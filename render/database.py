import os
import libsql_experimental as sqlite3

def get_db_connection():
    """Establishes a connection to the Turso cloud database or local fallback."""
    turso_url = os.getenv("TURSO_DATABASE_URL")
    turso_token = os.getenv("TURSO_AUTH_TOKEN")

    if turso_url and turso_token:
        # Connect to Turso Cloud
        return sqlite3.connect(turso_url, auth_token=turso_token)
    else:
        # Fallback to local SQLite for local testing
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        DB_FILE = os.path.join(BASE_DIR, "asset", "guild.db")
        os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
        return sqlite3.connect(DB_FILE)

def setup_database(conn=None):
    """Ensures database schema exists. Migration handles initial data population."""
    is_own_conn = False
    if conn is None:
        conn = get_db_connection()
        is_own_conn = True
        
    c = conn.cursor()
    
    # Store character summary data, stats, and metadata like faction/class
    c.execute("""
        CREATE TABLE IF NOT EXISTS characters (
            name TEXT PRIMARY KEY, class TEXT, race TEXT, faction TEXT, guild TEXT,
            level INTEGER, equipped_item_level INTEGER, xp INTEGER, xp_max INTEGER,
            health INTEGER, power INTEGER, last_login_ms INTEGER, portrait_url TEXT
        )
    """)

    # Store loot/gear historical state.
    c.execute("""
        CREATE TABLE IF NOT EXISTS gear (
            character_name TEXT, slot TEXT, item_id INTEGER, name TEXT, quality TEXT,
            icon_data TEXT, tooltip_params TEXT,
            last_detected TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (character_name, slot, item_id)
        )
    """)

    # Store timeline events (loot drops and level ups). No longer capped.
    c.execute("""
        CREATE TABLE IF NOT EXISTS timeline (
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, character_name TEXT,
            class TEXT, type TEXT, item_id INTEGER, item_name TEXT,
            item_quality TEXT, item_icon TEXT, level INTEGER
        )
    """)

    c.execute("CREATE INDEX IF NOT EXISTS idx_timeline_timestamp ON timeline (timestamp DESC)")

    # Store midnight snapshots to calculate daily stat trends for the dashboard arrows
    c.execute("""
        CREATE TABLE IF NOT EXISTS daily_snapshot (
            id TEXT PRIMARY KEY,
            snapshot_date TEXT,
            val1 INTEGER,
            val2 INTEGER,
            val3 INTEGER
        )
    """)

    # Persistent trend tracker for characters (replaces daily reset for leaderboards)
    c.execute("""
        CREATE TABLE IF NOT EXISTS character_trends (
            char_name TEXT PRIMARY KEY,
            last_ilvl INTEGER,
            trend_ilvl INTEGER,
            last_hks INTEGER,
            trend_hks INTEGER
        )
    """)

    # Persistent trend tracker for global guild stats
    c.execute("""
        CREATE TABLE IF NOT EXISTS global_trends (
            id TEXT PRIMARY KEY,
            last_total INTEGER,
            trend_total INTEGER,
            last_active INTEGER,
            trend_active INTEGER,
            last_ready INTEGER,
            trend_ready INTEGER
        )
    """)

    # Create the new historical daily tracking table
    c.execute('''
        CREATE TABLE IF NOT EXISTS daily_roster_stats (
            date TEXT PRIMARY KEY,
            total_roster INTEGER DEFAULT 0,
            active_roster INTEGER DEFAULT 0
        )
    ''')
    
    # Historical daily tracking for characters (replaces character_trends)
    c.execute("""
        CREATE TABLE IF NOT EXISTS char_history (
            char_name TEXT,
            record_date TEXT,
            ilvl INTEGER,
            hks INTEGER,
            PRIMARY KEY (char_name, record_date)
        )
    """)

    conn.commit()
    if is_own_conn:
        conn.close()