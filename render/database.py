import os
import libsql_experimental as libsql

# Dynamically find the project root directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Safely construct the absolute path to asset/guild.db
DB_FILE = os.path.join(BASE_DIR, "asset", "guild.db")

def get_db_connection():
    """Establishes a connection using Turso's Embedded Replica for instant local speeds."""
    turso_url = os.environ.get("TURSO_DATABASE_URL")
    turso_token = os.environ.get("TURSO_AUTH_TOKEN")
    
    os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
    
    if turso_url and turso_token:
        # DB_FILE MUST be the first argument to force a local Embedded Replica
        conn = libsql.connect(DB_FILE, sync_url=turso_url, auth_token=turso_token)
        
        # Pull the latest data from Turso before starting the script
        conn.sync()
    else:
        # Local testing fallback
        conn = libsql.connect(DB_FILE)

    # Force maximum write speed on the local file
    conn.execute("PRAGMA journal_mode = WAL;")
    conn.execute("PRAGMA synchronous = OFF;")
    
    return conn

def setup_database():
    """Ensures database schema exists. Migration handles initial data population."""
    conn = get_db_connection()
    c = conn.cursor()
    
    c.execute("""
        CREATE TABLE IF NOT EXISTS characters (
            name TEXT PRIMARY KEY, class TEXT, race TEXT, faction TEXT, guild TEXT,
            level INTEGER, equipped_item_level INTEGER, xp INTEGER, xp_max INTEGER,
            health INTEGER, power INTEGER, last_login_ms INTEGER, portrait_url TEXT
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS gear (
            character_name TEXT, slot TEXT, item_id INTEGER, name TEXT, quality TEXT,
            icon_data TEXT, tooltip_params TEXT,
            last_detected TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (character_name, slot, item_id)
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS timeline (
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, character_name TEXT,
            class TEXT, type TEXT, item_id INTEGER, item_name TEXT,
            item_quality TEXT, item_icon TEXT, level INTEGER
        )
    """)

    c.execute("CREATE INDEX IF NOT EXISTS idx_timeline_timestamp ON timeline (timestamp DESC)")

    c.execute("""
        CREATE TABLE IF NOT EXISTS daily_snapshot (
            id TEXT PRIMARY KEY,
            snapshot_date TEXT,
            val1 INTEGER,
            val2 INTEGER,
            val3 INTEGER
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS character_trends (
            char_name TEXT PRIMARY KEY,
            last_ilvl INTEGER,
            trend_ilvl INTEGER,
            last_hks INTEGER,
            trend_hks INTEGER
        )
    """)

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

    c.execute('''
        CREATE TABLE IF NOT EXISTS daily_roster_stats (
            date TEXT PRIMARY KEY,
            total_roster INTEGER DEFAULT 0,
            active_roster INTEGER DEFAULT 0
        )
    ''')
    
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
    conn.close()