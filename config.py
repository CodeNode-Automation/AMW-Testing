"""
Configuration settings for the WoW Classic API Dashboard pipeline.
"""

# The target realm where the characters reside.
REALM = "thunderstrike"

# The name of the guild to fetch the roster for dynamically.
GUILD_NAME = "Azeroths Most Wanted"

# The Blizzard API namespace required for querying character profiles. 
# 'profile-classicann-eu' targets the European WoW Classic Anniversary client.
PROFILE_NAMESPACE = "profile-classicann-eu"

# The default fallback image URL utilized when an item's specific icon 
# cannot be resolved through the primary or secondary API endpoints.
FALLBACK_ICON = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg"