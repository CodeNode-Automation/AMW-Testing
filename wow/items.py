from wow.images import (
    fetch_blizzard_media_href,
    fetch_item_icon_url,
    fetch_wowhead_icon_url,
    get_standardized_image_url
)
from wow.quality import fetch_item_quality
from config import FALLBACK_ICON

async def process_equipment(session, token, equipment, past_gear=None):
    """
    Parses the character equipment payload and resolves metadata for each equipped item.
    Reuses historical database values if the item has not changed.
    
    Args:
        session (aiohttp.ClientSession): The active asynchronous HTTP session.
        token (str): The OAuth access token for Blizzard API authentication.
        equipment (dict): The raw equipment data payload from the Blizzard API.
        past_gear (dict, optional): Historical gear data for caching.
        
    Returns:
        dict: A mapping of equipment slot types to their respective parsed item data.
    """
    if past_gear is None: past_gear = {}
    equipped_dict = {}
    fallback_url = get_standardized_image_url(FALLBACK_ICON)

    if equipment and 'equipped_items' in equipment:
        items = equipment['equipped_items']
        
        for item in items:
            slot_type = item.get('slot', {}).get('type', '')
            item_id = item.get('item', {}).get('id')
            item_level = item.get('level', {}).get('value', 0)
            
            name_data = item.get('name', 'Empty')
            item_name = name_data if isinstance(name_data, str) else name_data.get('en_US', 'Empty')
            
            # --- LOCAL CACHE CHECK ---
            past_item = past_gear.get(slot_type, {})
            if past_item and past_item.get('item_id') == item_id and past_item.get('icon'):
                equipped_dict[slot_type] = {
                    "name": item_name,
                    "icon_data": past_item.get('icon'),
                    "quality": past_item.get('quality', 'COMMON'),
                    "is_fallback": False,
                    "item_id": item_id,
                    "item_level": item_level,
                    "tooltip_params": past_item.get('params', f"item={item_id}")
                }
                continue # Skip all network calls below!
            
            item_href = item.get('item', {}).get('key', {}).get('href')
            quality_type = item.get('quality', {}).get('type')
            if not quality_type:
                quality_type = await fetch_item_quality(session, token, item_href, item_id)
            quality_type = quality_type.upper() if quality_type else "COMMON"
            
            media_href = item.get('media', {}).get('key', {}).get('href')
            icon_url = None
            
            if media_href:
                icon_url = await fetch_blizzard_media_href(session, token, media_href)
            if not icon_url and item_id:
                icon_url = await fetch_item_icon_url(session, token, item_id) 
            if not icon_url and item_id:
                icon_url = await fetch_wowhead_icon_url(session, item_id)
            
            final_url = get_standardized_image_url(icon_url) if icon_url else None
            
            is_fallback = False 
            if not final_url:
                final_url = fallback_url
                is_fallback = True

            enchants = item.get('enchantments', [])
            ench_str = "&ench=" + ":".join([str(e.get('enchantment_id')) for e in enchants]) if enchants else ""
            
            sockets = item.get('sockets', [])
            gems_str = "&gems=" + ":".join([str(s.get('item', {}).get('id')) for s in sockets if s.get('item')]) if sockets else ""
            
            tooltip_params = f"item={item_id}{ench_str}{gems_str}"

            equipped_dict[slot_type] = {
                "name": item_name,
                "icon_data": final_url, 
                "quality": quality_type,
                "is_fallback": is_fallback,
                "item_id": item_id,
                "item_level": item_level,
                "tooltip_params": tooltip_params
            }

    return equipped_dict