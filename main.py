"""
Main entry point for the WoW Classic API Dashboard pipeline.
Database logic upgraded to SQLite to remove historical limits and improve concurrency performance.
"""

import libsql_experimental as sqlite3
import os
import asyncio
import aiohttp
import sys
import json
from datetime import datetime, timezone

from wow.auth import get_access_token
from wow.api import fetch_realm_data, fetch_guild_metadata, fetch_static_maps
from wow.character import fetch_character_data, update_character_state
from render.html_dashboard import generate_html_dashboard
from render.database import setup_database, get_db_connection
from wow.trends import process_character_trends, process_global_trends
from config import REALM, GUILD_NAME

class DictCursor:
    """Wraps the libsql cursor to automatically convert fetched tuples into dictionaries."""
    def __init__(self, cursor):
        self.cursor = cursor

    def execute(self, *args, **kwargs):
        self.cursor.execute(*args, **kwargs)
        return self  # Return self so .fetchall() can be chained

    def fetchall(self):
        rows = self.cursor.fetchall()
        if not rows: return []
        cols = [col[0] for col in self.cursor.description]
        return [dict(zip(cols, row)) for row in rows]

    def fetchone(self):
        row = self.cursor.fetchone()
        if not row: return None
        cols = [col[0] for col in self.cursor.description]
        return dict(zip(cols, row))

    def __getattr__(self, name):
        return getattr(self.cursor, name)

# Map Blizzard's raw integer IDs to strings for the base roster view
CLASS_MAP = {
    1: "Warrior", 2: "Paladin", 3: "Hunter", 4: "Rogue", 5: "Priest", 
    6: "Death Knight", 7: "Shaman", 8: "Mage", 9: "Warlock", 11: "Druid"
}

RACE_MAP = {
    1: "Human", 2: "Orc", 3: "Dwarf", 4: "Night Elf", 5: "Undead", 
    6: "Tauren", 7: "Gnome", 8: "Troll", 10: "Blood Elf", 11: "Draenei"
}

# Map the exact in-game rank names to their numerical IDs (0 is always Guild Master)
RANK_MAP = {
    0: "Guild Master",
    1: "MOST WANTED",
    2: "Veteran",
    3: "Member",
    4: "Alt",
    5: "Wanted"
}

async def fetch_with_semaphore(sem, session, token, char, history_data):
    """Bouncer function throttling dynamic API requests to respect rate limits."""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            async with sem:
                await asyncio.sleep(0.3)
                return await fetch_character_data(session, token, char, history_data)
        except Exception as e:
            print(f"⚠️ Failed to fetch {char} (Attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                await asyncio.sleep(5)
            else:
                print(f"❌ Skipping {char} after {max_retries} failed attempts.")
                return None
            
async def main_async():
    """Core asynchronous orchestrator."""
    print("\n🔑 Authenticating with Blizzard API...")
    token = await get_access_token()
    if not token:
        print("❌ Failed to authenticate with Blizzard.")
        return
    print("✅ Authentication successful!\n")

    print("📂 Synchronizing Local SQLite Database...")
    db_conn = get_db_connection()
    setup_database(db_conn) # We now pass the active connection directly
    
    db_c = DictCursor(db_conn.cursor())

    # Load known gear state into memory format required by update_character_state
    history_data = {}
    known_chars = db_c.execute("SELECT name, level FROM characters").fetchall()
    for row in known_chars:
        history_data[row['name']] = {'level': row['level']}
        
    known_gear = db_c.execute("""
        SELECT character_name, slot, item_id, name, quality, icon_data, tooltip_params
        FROM gear
    """).fetchall()
    for row in known_gear:
        char_n = row['character_name']
        if char_n not in history_data:
            history_data[char_n] = {}
        history_data[char_n][row['slot']] = {
            'item_id': row['item_id'], 'name': row['name'], 
            'quality': row['quality'], 'icon': row['icon_data'], 'params': row['tooltip_params']
        }
    
    print(f"✅ Database synchronized: {len(known_chars)} known characters, {len(known_gear)} known gear rows.")
    
    # We pass a temporary list for timeline events so update_character_state can append new ones
    timeline_data_new = [] 
    roster_data = []

    print("🚀 Opening Async HTTP Session...\n")
    async with aiohttp.ClientSession() as session:
        class_map, race_map = await fetch_static_maps(session, token)
        
        realm_data = await fetch_realm_data(session, token, REALM)

        slug = GUILD_NAME.lower().replace(" ", "-").replace("'", "")
        rank_map = await fetch_guild_metadata(session, token, REALM, slug)

        print(f"📜 Fetching guild roster for <{GUILD_NAME}>...")
        url = f"https://eu.api.blizzard.com/data/wow/guild/{REALM}/{slug}/roster?namespace=profile-classicann-eu&locale=en_US"
        headers = {"Authorization": f"Bearer {token}"}
        
        roster_names = []
        raw_guild_roster = [] # Captures EVERYONE, even level 1s, for the total roster view
        char_ranks = {} # Temporary mapping to inject ranks into the deep character profiles
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                async with session.get(url, headers=headers) as resp:
                    if resp.status == 200:
                        raw_data = await resp.json()
                        all_m = raw_data.get('members', [])
                        
                        for m in all_m:
                            c = m.get('character', {})
                            c_name = c.get('name', 'Unknown')
                            c_level = c.get('level', 0)
                            
                            # Convert raw IDs to Strings for the fallback view
                            c_class_id = c.get('playable_class', {}).get('id')
                            c_class = class_map.get(c_class_id, "Unknown")
                            
                            c_race_id = c.get('playable_race', {}).get('id')
                            c_race = race_map.get(c_race_id, "Unknown")
                            
                            # Map the explicit Guild Rank using our manual RANK_MAP
                            rank_id = m.get('rank', 5) # Default to 5 if missing
                            rank_name = RANK_MAP.get(rank_id, f"Rank {rank_id}")
                            char_ranks[c_name.lower()] = rank_name
                            
                            raw_guild_roster.append({
                                "name": c_name.title(),
                                "level": c_level,
                                "class": c_class,
                                "race": c_race,
                                "rank": rank_name
                            })
                            
                            # Only process full API deep-scans for chars > level 10
                            if c_level > 10:
                                roster_names.append(c_name.lower())
                        break # Successfully fetched and parsed, break out of the retry loop
                    else:
                        resp.raise_for_status()
            except Exception as e:
                print(f"⚠️ Roster fetch failed (Attempt {attempt + 1}/{max_retries}): {e}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(5)
                else:
                    print("❌ Fatal Error: Could not fetch guild roster.")
                    # Let the rest of the script continue with an empty roster to prevent a hard crash

        print(f"👥 Guild: {len(raw_guild_roster)} Total Members. Processing {len(roster_names)} valid characters (> Lvl 10).")

        sem = asyncio.Semaphore(5)
        tasks = [fetch_with_semaphore(sem, session, token, char, history_data) for char in roster_names]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # --- TREND LOGIC: Load Persistent Trends & Daily Snapshots ---
        today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        
        print("📊 Pre-fetching historical character trends...")
        past_records_raw = db_c.execute("""
            SELECT char_name, ilvl, hks, record_date 
            FROM char_history 
            WHERE record_date < ? 
            ORDER BY record_date DESC
        """, (today_str,)).fetchall()
        
        past_history_map = {}
        for row in past_records_raw:
            c_name = row['char_name']
            # Only store the most recent previous record per character
            if c_name not in past_history_map:
                past_history_map[c_name] = {'ilvl': row['ilvl'], 'hks': row['hks']}

        batch_char_history = []
        
        # Load Global Snapshots
        snapshots = {}
        for row in db_c.execute("SELECT * FROM daily_snapshot").fetchall():
            snapshots[row['id']] = dict(row)

        for result in results:
            if isinstance(result, dict) and result:
                try:
                    # 1. Process math using in-memory data
                    result = process_character_trends(result, char_ranks, past_history_map, batch_char_history)
                    
                    # 2. Check gear state and append any new drops to timeline_data_new
                    history_data, timeline_data_new = update_character_state(result, history_data, timeline_data_new)
                    
                    roster_data.append(result)
                except Exception as e:
                    char_name = result.get('char', 'Unknown')
                    print(f"⚠️ Data processing failed for {char_name}: {e}")
                    # Skip this character and continue the loop without crashing the whole script
                    continue

        # --- PERSISTENT TREND CALCULATIONS: Global Guild Stats ---
        realm_data = process_global_trends(db_c, roster_data, raw_guild_roster, realm_data)

    print("\n===========================================")
    print("💾 Commit today's updates to SQLite database in Batch Mode...")
    
    char_updates = []
    gear_updates = []
    
    for char_name, data in history_data.items():
        level = data.get('level', 0)
        char_updates.append((char_name, level))
        for slot, item in data.items():
            if isinstance(item, dict) and 'item_id' in item:
                gear_updates.append((
                    char_name, slot, item.get('item_id'), item.get('name'), 
                    item.get('quality'), item.get('icon'), item.get('params')
                ))

    # Execute all character and gear updates at once
    db_c.executemany("INSERT OR REPLACE INTO characters (name, level) VALUES (?, ?)", char_updates)
    db_c.executemany("""
        INSERT OR REPLACE INTO gear 
        (character_name, slot, item_id, name, quality, icon_data, tooltip_params)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, gear_updates)

    # Execute all trend history at once
    db_c.executemany("""
        INSERT OR REPLACE INTO char_history (char_name, record_date, ilvl, hks) 
        VALUES (?, ?, ?, ?)
    """, batch_char_history)

    # Pre-fetch timeline validation to avoid duplicates without network loops
    existing_levels = set(row['char_lvl'] for row in db_c.execute("SELECT character_name || '_' || level AS char_lvl FROM timeline WHERE type = 'level_up'").fetchall())
    existing_items = set(row['char_item'] for row in db_c.execute("SELECT character_name || '_' || item_id AS char_item FROM timeline WHERE type = 'item'").fetchall())
    
    timeline_level_updates = []
    timeline_item_updates = []
    
    for ev in timeline_data_new:
        char_name = ev.get('character')
        if ev.get('type') == 'level_up':
            level = ev.get('level')
            key = f"{char_name}_{level}"
            if key not in existing_levels:
                timeline_level_updates.append((ev.get('timestamp'), char_name, ev.get('class'), level))
                existing_levels.add(key)
        else:
            it = ev.get('item', {})
            item_id = it.get('item_id')
            key = f"{char_name}_{item_id}"
            if key not in existing_items:
                timeline_item_updates.append((ev.get('timestamp'), char_name, ev.get('class'), item_id, it.get('name'), it.get('quality'), it.get('icon_data')))
                existing_items.add(key)

    # Execute all new timeline events at once
    db_c.executemany("""
        INSERT INTO timeline (timestamp, character_name, class, type, level)
        VALUES (?, ?, ?, 'level_up', ?)
    """, timeline_level_updates)
    
    db_c.executemany("""
        INSERT INTO timeline (timestamp, character_name, class, type, item_id, item_name, item_quality, item_icon)
        VALUES (?, ?, ?, 'item', ?, ?, ?, ?)
    """, timeline_item_updates)

    db_conn.commit()
    db_conn.close()

    print("🌐 Generating final HTML Dashboard...")
    
    # Re-open database read-only to query history for the frontend
    render_conn = get_db_connection() 
    render_c = DictCursor(render_conn.cursor())
    
    # Query latest 3000 events for the HTML feed so the page doesn't bloat endlessly
    dashboard_feed = [dict(row) for row in render_c.execute("SELECT * FROM timeline ORDER BY timestamp DESC LIMIT 3000").fetchall()]
    # Query the last 7 days of population trends
    roster_history = {row['date']: dict(row) for row in render_c.execute("SELECT * FROM daily_roster_stats ORDER BY date DESC LIMIT 7").fetchall()}
    
    render_conn.close()

    # Pass historical data and the FULL raw roster into generator
    generate_html_dashboard(roster_data, realm_data, dashboard_feed, raw_guild_roster, roster_history)
    print("🎉 ALL DONE! The SQLite-powered pipeline ran successfully.")

def main():
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main_async())

if __name__ == "__main__":
    main()