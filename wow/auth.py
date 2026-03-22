import os
import aiohttp
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("BLIZZARD_CLIENT_ID", "")
CLIENT_SECRET = os.getenv("BLIZZARD_CLIENT_SECRET", "")

async def get_access_token():
    """
    Retrieves an OAuth2 access token from the Blizzard Battle.net API.
    
    Uses the client credentials grant type to authenticate and fetch 
    a temporary access token required for subsequent API requests.
    
    Returns:
        str | None: The access token string if successful, or None if the request fails.
    """
    url = "https://oauth.battle.net/token"
    auth = aiohttp.BasicAuth(CLIENT_ID, CLIENT_SECRET)
    
    try:
        # Create a temporary session just for the auth request
        async with aiohttp.ClientSession() as session:
            async with session.post(url, data={"grant_type": "client_credentials"}, auth=auth, timeout=aiohttp.ClientTimeout(total=10)) as response:
                response.raise_for_status()
                data = await response.json()
                return data.get("access_token")
    except Exception as e:
        print(f"Error fetching token: {e}")
        return None