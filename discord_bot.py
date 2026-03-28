import os
import discord
from discord.ext import commands
import aiohttp
from aiohttp import web

# Retrieve environment variables
DISCORD_TOKEN = os.environ.get("DISCORD_TOKEN", "")
TURSO_URL = os.environ.get("TURSO_DATABASE_URL", "").replace("libsql://", "https://")
TURSO_TOKEN = os.environ.get("TURSO_AUTH_TOKEN", "")

# Initialize the bot with slash command support
class MyBot(commands.Bot):
    def __init__(self):
        super().__init__(command_prefix="!", intents=discord.Intents.default())

    async def setup_hook(self):
        # This syncs the slash commands to Discord when the bot starts
        await self.tree.sync()
        print("✅ Slash commands synced!")

bot = MyBot()

async def fetch_character_from_turso(character_name: str):
    """Fetches a specific character directly from Turso using the REST API."""
    if not TURSO_URL or not TURSO_TOKEN:
        return None

    headers = {
        "Authorization": f"Bearer {TURSO_TOKEN}", 
        "Content-Type": "application/json"
    }
    
    # Query the characters table for the specific name
    query = f"SELECT * FROM characters WHERE LOWER(name) = '{character_name.lower()}' LIMIT 1"
    payload = {"statements": [query]}
    
    async with aiohttp.ClientSession() as session:
        async with session.post(TURSO_URL, json=payload, headers=headers) as resp:
            if resp.status != 200:
                return None
                
            data = await resp.json()
            if isinstance(data, list) and len(data) > 0:
                results = data[0].get("results", {})
                rows = results.get("rows", [])
                cols = results.get("columns", [])
                
                if rows:
                    # Zip the columns and the first row together into a dictionary
                    return dict(zip(cols, rows[0]))
            return None

async def handle_ping(request):
    return web.Response(text="Bot is online and listening!")

async def start_dummy_server():
    app = web.Application()
    app.router.add_get('/', handle_ping)
    runner = web.AppRunner(app)
    await runner.setup()
    port = int(os.environ.get("PORT", 10000))
    site = web.TCPSite(runner, '0.0.0.0', port)
    await site.start()
    print(f"🌐 Dummy web server running on port {port}")

@bot.event
async def on_ready():
    if bot.user is not None:
        print(f"🤖 Logged in as {bot.user.name} ({bot.user.id})")
    await start_dummy_server()

@bot.tree.command(name="who", description="Pull character data and raid readiness.")
async def who(interaction: discord.Interaction, character_name: str):
    """Slash command to look up a character."""
    await interaction.response.defer()
    
    char_data = await fetch_character_from_turso(character_name)
    
    if not char_data:
        await interaction.followup.send(f"❌ Could not find **{character_name.title()}** in the guild database.")
        return

    # Extract all data, adding Faction for color coding
    name = char_data.get("name", "Unknown").title()
    level = char_data.get("level", 0)
    char_class = char_data.get("class", "Unknown")
    race = char_data.get("race", "Unknown")
    faction = char_data.get("faction", "Unknown")
    ilvl = char_data.get("equipped_item_level", 0)
    active_spec = char_data.get("active_spec", "Unknown") or "None"
    portrait_url = char_data.get("portrait_url", "")
    last_login_ms = char_data.get("last_login_ms", 0)

    # Convert timestamp
    last_seen_unix = int(last_login_ms / 1000) if last_login_ms else 0
    last_seen_str = f"<t:{last_seen_unix}:R>" if last_seen_unix else "Unknown"

    # Set the card color based on the character's faction
    if faction.lower() == "horde":
        embed_color = discord.Color.red()
    elif faction.lower() == "alliance":
        embed_color = discord.Color.blue()
    else:
        embed_color = discord.Color.dark_gray()

    # Move Name to the Title and Class info to the Description for a cleaner look
    embed = discord.Embed(
        title=name,
        description=f"Level {level} {race} {char_class}",
        color=embed_color
    )
    
    if portrait_url:
        embed.set_thumbnail(url=portrait_url)

    # Condense the pertinent specs into a single, non-inline field to prevent layout clutter
    specs_text = (
        f"**Specialization:** {active_spec}\n"
        f"**Item Level:** {ilvl}\n"
        f"**Last Seen:** {last_seen_str}"
    )
    
    embed.add_field(name="Character Details", value=specs_text, inline=False)
    
    # Raid Readiness check
    if level == 70 and ilvl >= 110:
        embed.set_footer(text="✅ Raid Ready")
    else:
        embed.set_footer(text="❌ Not Raid Ready (Requires Lvl 70 & 110+ iLvl)")

    await interaction.followup.send(embed=embed)

# Run the bot
if __name__ == "__main__":
    if not DISCORD_TOKEN:
        print("❌ DISCORD_TOKEN is missing from environment variables.")
    else:
        bot.run(DISCORD_TOKEN)