const CLASS_COLORS = {
    "Druid": "#FF7C0A", "Hunter": "#ABD473", "Mage": "#3FC7EB", 
    "Paladin": "#F48CBA", "Priest": "#FFFFFF", "Rogue": "#FFF468",
    "Shaman": "#0070DE", "Warlock": "#8788EE", "Warrior": "#C69B6D",
    "Death Knight": "#C41E3A"
};
const QUALITY_COLORS = {
    "POOR": "#9d9d9d", "COMMON": "#ffffff", "UNCOMMON": "#1eff00",
    "RARE": "#0070dd", "EPIC": "#a335ee", "LEGENDARY": "#ff8000"
};
const SLOTS = ['HEAD', 'NECK', 'SHOULDER', 'BACK', 'CHEST', 'SHIRT', 'TABARD', 'WRIST', 'HANDS', 'WAIST', 'LEGS', 'FEET', 'FINGER_1', 'FINGER_2', 'TRINKET_1', 'TRINKET_2', 'MAIN_HAND', 'OFF_HAND', 'RANGED'];
const EMPTY_ICONS = {
    'HEAD': 'inventoryslot_head', 'NECK': 'inventoryslot_neck', 'SHOULDER': 'inventoryslot_shoulder',
    'BACK': 'inventoryslot_chest', 'CHEST': 'inventoryslot_chest', 'SHIRT': 'inventoryslot_shirt',
    'TABARD': 'inventoryslot_tabard', 'WRIST': 'inventoryslot_wrists', 'HANDS': 'inventoryslot_hands',
    'WAIST': 'inventoryslot_waist', 'LEGS': 'inventoryslot_legs', 'FEET': 'inventoryslot_feet',
    'FINGER_1': 'inventoryslot_finger', 'FINGER_2': 'inventoryslot_finger', 
    'TRINKET_1': 'inventoryslot_trinket', 'TRINKET_2': 'inventoryslot_trinket',
    'MAIN_HAND': 'inventoryslot_mainhand', 'OFF_HAND': 'inventoryslot_offhand', 'RANGED': 'inventoryslot_ranged'
};
const TBC_XP = {
    1: 400, 2: 900, 3: 1400, 4: 2100, 5: 2800, 6: 3600, 7: 4500, 8: 5400, 9: 6500, 10: 7600,
    11: 8800, 12: 10100, 13: 11400, 14: 12900, 15: 14400, 16: 16000, 17: 17700, 18: 19400, 19: 21300, 20: 23200,
    21: 25200, 22: 27300, 23: 29400, 24: 31700, 25: 34000, 26: 36400, 27: 38900, 28: 41400, 29: 44300, 30: 47400,
    31: 50800, 32: 54500, 33: 58600, 34: 62800, 35: 67100, 36: 71600, 37: 76100, 38: 80800, 39: 85700, 40: 90700,
    41: 95800, 42: 101000, 43: 106300, 44: 111800, 45: 117500, 46: 123200, 47: 129100, 48: 135100, 49: 141200, 50: 147500,
    51: 153900, 52: 160400, 53: 167100, 54: 173900, 55: 180800, 56: 187900, 57: 195000, 58: 202300, 59: 209800,
    60: 494000, 61: 517000, 62: 550000, 63: 587000, 64: 632000, 65: 684000, 66: 745000, 67: 815000, 68: 895000, 69: 985000
};

const AWARD_THEME_MAP = {
    "mvp_pve": "award-mvp-pve",
    "mvp_pvp": "award-mvp-pvp",
    "pve_gold": "award-pve-gold",
    "pvp_gold": "award-pvp-gold",
    "pve_silver": "award-pve-silver",
    "pvp_silver": "award-pvp-silver",
    "pve_bronze": "award-pve-bronze",
    "pvp_bronze": "award-pvp-bronze",
    "vanguard": "award-vanguard",
    "campaign": "award-campaign"
};

function slugifyToken(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function setHidden(el, hidden = true) {
    if (el) el.hidden = !!hidden;
}

function showElement(el) {
    setHidden(el, false);
}

function clearNode(el) {
    if (el) el.replaceChildren();
}

function createElement(tagName, className = '', text = '') {
    const el = document.createElement(tagName);
    if (className) el.className = className;
    if (text !== '') el.textContent = text;
    return el;
}

function appendChildren(parent, ...children) {
    children.flat().forEach(child => {
        if (child !== null && child !== undefined) parent.appendChild(child);
    });
    return parent;
}

function applyClassTheme(el, className) {
    if (!el) return;
    const slug = slugifyToken(className || 'unknown');
    el.classList.add(`class-theme-${slug}`);
}

function applyQualityTheme(el, quality) {
    if (!el) return;
    const slug = slugifyToken(quality || 'common');
    el.classList.add(`quality-theme-${slug}`);
}

function applyAwardTheme(el, awardKey) {
    if (!el) return;
    const cls = AWARD_THEME_MAP[awardKey] || `award-${slugifyToken(awardKey)}`;
    el.classList.add(cls);
}

function applyRankTheme(el, rank) {
    if (!el) return;
    el.classList.add(`rank-theme-${rank}`);
}

function bindCharacterSelect(el, charName) {
    if (!el || !charName) return;
    el.classList.add('is-character-link');
    el.setAttribute('data-char', charName);
    el.addEventListener('click', () => selectCharacter(charName));
}

function createSpecInline(className, specName, variant = 'default') {
    const fragment = document.createDocumentFragment();
    const activeSpec = specName ? specName : '';
    const iconUrl = activeSpec ? getSpecIcon(className, activeSpec) : null;
    if (iconUrl) {
        const iconClass = variant === 'tooltip' ? 'spec-icon-tt'
            : variant === 'small' ? 'spec-icon-sm'
            : variant === 'card' ? 'spec-icon-card'
            : 'spec-badge-icon';
        const img = createElement('img', iconClass);
        img.src = iconUrl;
        img.alt = `${activeSpec} icon`;
        fragment.appendChild(img);
    }
    fragment.appendChild(document.createTextNode(activeSpec ? `${activeSpec} ${className}` : className));
    return fragment;
}

function createTrendIndicator(value, baseClass = 'trend-indicator') {
    const span = createElement('span', baseClass);
    if (value > 0) {
        span.classList.add(baseClass + '-positive');
        span.textContent = `▲ ${value}`;
    } else if (value < 0) {
        span.classList.add(baseClass + '-negative');
        span.textContent = `▼ ${Math.abs(value)}`;
    } else {
        span.classList.add(baseClass + '-neutral');
        span.textContent = '-';
    }
    return span;
}

function createAwardDefinitionMap() {
    return {
        'mvp_pve': { label: 'PvE MVP', icon: '👑' },
        'mvp_pvp': { label: 'PvP MVP', icon: '⚔️' },
        'pve_gold': { label: 'PvE Gold', icon: '🥇' },
        'pvp_gold': { label: 'PvP Gold', icon: '🥇' },
        'pve_silver': { label: 'PvE Silver', icon: '🥈' },
        'pvp_silver': { label: 'PvP Silver', icon: '🥈' },
        'pve_bronze': { label: 'PvE Bronze', icon: '🥉' },
        'pvp_bronze': { label: 'PvP Bronze', icon: '🥉' },
        'vanguard': { label: 'Vanguards', icon: '🌟' },
        'campaign': { label: 'Campaigns', icon: '🎖️' }
    };
}

function restoreTimelineFilters(mode = 'default') {
    const filtersContainer = document.querySelector('.timeline-filters');
    if (!filtersContainer) return;

    clearNode(filtersContainer);
    const templateId = mode === 'awards' ? 'tpl-timeline-filters-awards' : 'tpl-timeline-filters-default';
    const template = document.getElementById(templateId);
    if (template) {
        filtersContainer.appendChild(template.content.cloneNode(true));
    }

    document.querySelectorAll('.timeline-filters .tl-btn').forEach(btn => {
        btn.addEventListener('click', event => {
            document.querySelectorAll('.timeline-filters .tl-btn').forEach(item => item.classList.remove('active'));
            const target = event.currentTarget;
            target.classList.add('active');
            tlTypeFilter = target.getAttribute('data-type');
            applyTimelineFilters();
        });
    });

    const dateSelectEl = document.getElementById('tl-date-filter');
    if (dateSelectEl) {
        dateSelectEl.addEventListener('change', event => {
            tlDateFilter = event.target.value;
            if (tlSpecificDate) {
                tlSpecificDate = null;
                document.querySelectorAll('.tt-heatmap').forEach(cell => cell.classList.remove('selected-date'));
            }
            applyTimelineFilters();
        });
    }
}

function setNavbarSubpageState(navbar, isSubpage) {
    if (!navbar) return;
    navbar.classList.toggle('navbar-subpage', !!isSubpage);
    navbar.classList.toggle('navbar-home', !isSubpage);
}

function setDisplayVariant(el, variant = '') {
    if (!el) return;
    el.classList.remove('display-block', 'display-flex', 'display-inline-block');
    if (!variant || variant === 'none') {
        el.hidden = true;
        return;
    }
    el.hidden = false;
    el.classList.add(`display-${slugifyToken(variant)}`);
}

function isElementVisible(el) {
    return !!el && !el.hidden;
}

function setChartPointerState(event, isClickable) {
    const target = event && event.native ? event.native.target : null;
    if (target) target.classList.toggle('chart-clickable', !!isClickable);
}

function clearAccentThemes(el) {
    if (!el) return;
    [...el.classList].forEach(cls => {
        if (cls.startsWith('accent-')) el.classList.remove(cls);
    });
}

function applyAccentTheme(el, themeKey) {
    if (!el) return;
    clearAccentThemes(el);
    el.classList.add(`accent-${slugifyToken(themeKey || 'default')}`);
}

function applyMonumentHighlightTheme(el, colorValue) {
    if (!el) return;
    const normalized = String(colorValue || '').toLowerCase();
    if (normalized === '#ffd100') applyAccentTheme(el, 'gold');
    else if (normalized === '#ff4400') applyAccentTheme(el, 'red');
    else if (normalized === '#a335ee') applyAccentTheme(el, 'purple');
    else if (normalized === '#3fc7eb') applyAccentTheme(el, 'cyan');
    else applyAccentTheme(el, 'gold');
}

function createSvgProgressBar(primaryPercent, secondaryPercent = 0) {
    const svg = createElement('svg', 'xp-bar-svg');
    svg.setAttribute('viewBox', '0 0 100 10');
    svg.setAttribute('preserveAspectRatio', 'none');

    const restedRect = createElement('rect', 'xp-bar-rested-svg');
    restedRect.setAttribute('x', '0');
    restedRect.setAttribute('y', '0');
    restedRect.setAttribute('height', '10');
    restedRect.setAttribute('width', String(Math.max(0, Math.min(100, secondaryPercent))));

    const earnedRect = createElement('rect', 'xp-bar-earned-svg');
    earnedRect.setAttribute('x', '0');
    earnedRect.setAttribute('y', '0');
    earnedRect.setAttribute('height', '10');
    earnedRect.setAttribute('width', String(Math.max(0, Math.min(100, primaryPercent))));

    appendChildren(svg, restedRect, earnedRect);
    return svg;
}

function createProgressFill(percent, type) {
    const svg = createElement('svg', `challenge-fill-svg challenge-fill-svg-${slugifyToken(type)}`);
    svg.setAttribute('viewBox', '0 0 100 10');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('data-progress-tier', percent >= 100 ? 'max' : percent >= 75 ? 'high' : percent >= 30 ? 'mid' : 'low');

    const rect = createElement('rect', 'challenge-fill-rect');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('height', '10');
    rect.setAttribute('width', String(Math.max(0, Math.min(100, percent))));

    svg.appendChild(rect);
    return svg;
}

function createInlineTooltipHost(trigger, tooltipEl) {
    if (!trigger || !tooltipEl) return;
    trigger.classList.add('tt-anchor');
    const existing = trigger.querySelector('.tt-inline-host');
    if (existing) existing.remove();
    const host = createElement('div', 'tt-inline-host');
    host.appendChild(tooltipEl);
    trigger.appendChild(host);
}

function removeInlineTooltipHost(trigger) {
    if (!trigger) return;
    const existing = trigger.querySelector('.tt-inline-host');
    if (existing) existing.remove();
}

function killIntro() {
    sessionStorage.setItem('amwIntroPlayed', 'true');
    const intro = document.getElementById('intro-container');
    const dash = document.querySelector('.dashboard-layout');
    
    if (intro && !intro.classList.contains('fade-out')) {
        intro.classList.add('fade-out');
        if (dash) {
            dash.classList.add('dashboard-visible');
        }
        setTimeout(() => { if (intro) intro.remove(); }, 1000);
    }
}

if (sessionStorage.getItem('amwIntroPlayed') === 'true') {
    const intro = document.getElementById('intro-container');
    if (intro) intro.remove();
    
    document.addEventListener('DOMContentLoaded', () => {
        const dash = document.querySelector('.dashboard-layout');
        if (dash) {
            dash.classList.add('dashboard-instant-visible');
        }
    });
} else {
    document.addEventListener('DOMContentLoaded', () => {
        const vid = document.getElementById('intro-video');
        if (vid) {
            vid.playbackRate = 1.75; 
            vid.addEventListener('ended', killIntro); 
            vid.addEventListener('error', killIntro); 
        }
        setTimeout(killIntro, 6000);
    });
}

// --- Helper: Safely Parse Arrays ---
function safeParseArray(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
        try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }
    return [];
}

// --- Helper: Map Raw Badge Names to Thematic Names ---
function getThematicName(rawName) {
    if (!rawName) return 'Awarded';
    const clean = rawName.toLowerCase().trim();
    const map = {
        'xp': "Hero's Journey",
        'hks': "Blood of the Enemy", // Fixed to match main.py output
        'hk': "Blood of the Enemy",
        'loot': "Dragon's Hoard",
        'zenith': "The Zenith Cohort",
        'pve_gold': "PvE Ladder (Gold)",
        'pve_silver': "PvE Ladder (Silver)",
        'pve_bronze': "PvE Ladder (Bronze)",
        'pvp_gold': "PvP Ladder (Gold)",
        'pvp_silver': "PvP Ladder (Silver)",
        'pvp_bronze': "PvP Ladder (Bronze)",
        'mvp_pve': "PvE MVP Champion",
        'mvp_pvp': "PvP MVP Champion",
        'vanguard': "Vanguard Status",
        'campaign': "Campaign Participant"
    };
    return map[clean] || (rawName.charAt(0).toUpperCase() + rawName.slice(1));
}

// --- Helper: Summarize Badges for Tooltips ---
function summarizeBadges(badgeArray) {
    const arr = safeParseArray(badgeArray);
    if (arr.length === 0) return "";
    const counts = arr.reduce((acc, val) => { 
        const niceName = getThematicName(val);
        acc[niceName] = (acc[niceName] || 0) + 1; 
        return acc; 
    }, {});
    return Object.entries(counts).map(([k, v]) => `${v}x ${k}`).join(', ');
}

// NEW: Added 'async' so we can fetch the external files
window.addEventListener('DOMContentLoaded', async () => {

    const config = JSON.parse(document.getElementById('dashboard-config').textContent);
    const heatmapData = JSON.parse(document.getElementById('heatmap-data').textContent);
    
    const introContainerEl = document.getElementById('intro-container');
    if (introContainerEl) {
        introContainerEl.addEventListener('click', killIntro);
    }

    // NEW: Download the heavy roster files silently in the background with error handling
    let rosterData = [];
    let rawGuildRoster = [];
    let warEffortLocks = {}; 
    
    // 1. Fetch CRITICAL Roster Data Firstt
    try {
        const cb = new Date().getTime(); // Cache Buster
        const rosterRes = await fetch(`asset/roster.json?t=${cb}`);
        rosterData = await rosterRes.json();
        
        const rawRes = await fetch(`asset/raw_roster.json?t=${cb}`);
        rawGuildRoster = await rawRes.json();
    } catch (error) {
        console.error("Failed to load armory data:", error);
        const loaderText = document.querySelector('.loader-content div');
        if (loaderText) {
            loaderText.classList.add('error-text');
            loaderText.textContent = 'Failed to load data. Please refresh.';
        }
        return; // Stop executing to prevent cascading errors
    }

    // 2. Fetch NON-CRITICAL War Effort Locks (Ignore if it fails or is missing)
    try {
        const cb = new Date().getTime();
        const weRes = await fetch(`asset/war_effort.json?t=${cb}`);
        if (weRes.ok) {
            const weData = await weRes.json();
            warEffortLocks = weData.locks || {};
        }
    } catch (error) {
        console.warn("War Effort locks not generated yet. Proceeding with dynamic data.");
    }

    // Hide the loading overlay once data is ready
    const loader = document.getElementById('loading-overlay');
    if (loader) loader.classList.add('hidden');
    
    const active14Days = config.active_14_days;
    const btnViewHeroes = document.getElementById('btn-view-heroes');
    if (btnViewHeroes) {
        btnViewHeroes.addEventListener('click', () => {
            window.location.hash = 'badges';
        });
    }
    const raidReadyCount = config.raid_ready_count;

    const rawDate = new Date(config.last_updated);
    const dateOptions = { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
    const updateTimeEl = document.getElementById("update-time");
    if (updateTimeEl) updateTimeEl.textContent = rawDate.toLocaleString('de-DE', dateOptions) + ' Uhr (CET/CEST)';
    
    let tlTypeFilter = 'rare_plus';
    let tlDateFilter = 'all'; // Start with 7 days to match the heatmap
    let tlSpecificDate = null; 
    window.currentFilteredChars = null;
    window.activeClassExpanded = null;
    let mainDonutChartInstance = null;     
    let conciseDonutChartInstance = null;
    let levelChartInstance = null;
    let ilvlChartInstance = null;
    let raceChartInstance = null;
    let analyticsActivityChartInst = null;
    let analyticsClassChartInst = null;
    window.roleChartInstance = null;
    const analyticsView = document.getElementById('analytics-view');   
    const architectureView = document.getElementById('architecture-view');

    const navbar = document.querySelector('.navbar');
    
    
    const emptyState = document.getElementById('empty-state');
    const conciseView = document.getElementById('concise-view');
    const conciseViewTitle = document.getElementById('concise-view-title');
    const conciseList = document.getElementById('concise-char-list');
    const fullCardContainer = document.getElementById('full-card-container');
    const timeline = document.getElementById('timeline');
    const timelineTitle = document.getElementById('timeline-title');
    const tooltip = document.getElementById('custom-tooltip');
    
    function getPowerName(cClass) {
        if (cClass === "Warrior") return "Rage";
        if (cClass === "Rogue") return "Energy";
        return "Mana";
    }
    
    function getClassIcon(className) {
        const clean = className.toLowerCase().replace(/\s/g, '');
        return `https://wow.zamimg.com/images/wow/icons/large/class_${clean}.jpg`;
    }
    
    function getSpecIcon(className, specName) {
        if (!specName || specName.trim() === '') return null;
        const icons = {
            "Druid": { "Balance": "spell_nature_starfall", "Feral Combat": "ability_racial_bearform", "Restoration": "spell_nature_healingtouch" },
            "Hunter": { "Beast Mastery": "ability_hunter_beasttaming", "Marksmanship": "ability_hunter_snipershot", "Survival": "ability_hunter_swiftstrike" },
            "Mage": { "Arcane": "spell_holy_magicalsentry", "Fire": "spell_fire_firebolt02", "Frost": "spell_frost_frostbolt02" },
            "Paladin": { "Holy": "spell_holy_holybolt", "Protection": "spell_holy_devotionaura", "Retribution": "spell_holy_auraoflight" },
            "Priest": { "Discipline": "spell_holy_wordfortitude", "Holy": "spell_holy_guardianspirit", "Shadow": "spell_shadow_shadowwordpain" },
            "Rogue": { "Assassination": "ability_rogue_eviscerate", "Combat": "ability_backstab", "Subtlety": "ability_stealth" },
            "Shaman": { "Elemental": "spell_nature_lightning", "Enhancement": "ability_shaman_stormstrike", "Restoration": "spell_nature_magicimmunity" },
            "Warlock": { "Affliction": "spell_shadow_deathcoil", "Demonology": "spell_shadow_requiem", "Destruction": "spell_shadow_rainoffire" },
            "Warrior": { "Arms": "ability_warrior_savageblow", "Fury": "ability_warrior_innerrage", "Protection": "inv_shield_06" },
            "Death Knight": { "Blood": "spell_deathknight_bloodpresence", "Frost": "spell_deathknight_frostpresence", "Unholy": "spell_deathknight_unholypresence" }
        };
        const classIcons = icons[className];
        if (classIcons && classIcons[specName]) {
            return `https://wow.zamimg.com/images/wow/icons/small/${classIcons[specName]}.jpg`;
        }
        return null;
    }
    
    function getCharClass(char) {
        if (char.profile && char.profile.character_class && char.profile.character_class.name) {
            return typeof char.profile.character_class.name === 'string' ? char.profile.character_class.name : char.profile.character_class.name.en_US;
        }
        return char.class || 'Unknown';
    }

    const searchInput = document.getElementById('charSearch');
    const searchAutoComplete = document.getElementById('search-autocomplete');
    
    const heroSearchInput = document.getElementById('heroCharSearch');
    const heroSearchAutoComplete = document.getElementById('hero-search-autocomplete');
    
    
    function buildAutocompleteResults(query, targetContainer, limit, includeEmptyState) {
        if (!targetContainer) return;
        const results = rosterData
            .filter(char => char.profile && char.profile.name && char.profile.name.toLowerCase().includes(query))
            .slice(0, limit);

        clearNode(targetContainer);

        if (results.length === 0) {
            if (includeEmptyState) {
                const emptyTemplate = document.getElementById('tpl-ac-empty-state');
                if (emptyTemplate) targetContainer.appendChild(emptyTemplate.content.cloneNode(true));
                targetContainer.classList.add('show');
            } else {
                targetContainer.classList.remove('show');
            }
            return;
        }

        const template = document.getElementById('tpl-hero-search-result');
        results.forEach(char => {
            if (!template) return;
            const clone = template.content.cloneNode(true);
            const cClass = getCharClass(char);
            const itemDiv = clone.querySelector('.hero-ac-item');
            const img = clone.querySelector('.hero-ac-icon');
            const nameSpan = clone.querySelector('.hero-ac-name');
            const metaSpan = clone.querySelector('.ac-meta');

            applyClassTheme(itemDiv, cClass);
            bindCharacterSelect(itemDiv, char.profile.name.toLowerCase());

            img.src = char.render_url || getClassIcon(cClass);
            img.alt = char.profile.name;

            nameSpan.textContent = char.profile.name;
            metaSpan.textContent = `Level ${char.profile.level} ${cClass}`;

            targetContainer.appendChild(clone);
        });

        targetContainer.classList.add('show');
    }

    if (heroSearchInput) {
        heroSearchInput.addEventListener('input', event => {
            const query = event.target.value.toLowerCase().trim();
            if (query === '') {
                heroSearchAutoComplete.classList.remove('show');
                return;
            }
            buildAutocompleteResults(query, heroSearchAutoComplete, 6, false);
        });

        heroSearchInput.addEventListener('keypress', event => {
            if (event.key !== 'Enter') return;
            const query = event.target.value.toLowerCase().trim();
            const result = rosterData.find(char => char.profile && char.profile.name && char.profile.name.toLowerCase().includes(query));
            if (result) window.location.hash = result.profile.name.toLowerCase();
        });
    }

    const searchBox = document.querySelector('.search-box');
    if (searchBox && searchInput) {
        searchBox.addEventListener('click', () => searchInput.focus());
    }

    const customSelect = document.getElementById('customCharSelect');
    const customOptions = document.getElementById('customCharOptions');
    const selectValueText = customSelect ? customSelect.querySelector('.selected-value') : null;

    if (customSelect) {
        customSelect.addEventListener('click', event => {
            event.stopPropagation();
            customOptions.classList.toggle('show');
            customSelect.classList.toggle('active');
            if (searchAutoComplete) searchAutoComplete.classList.remove('show');
        });
    }

    document.querySelectorAll('.custom-option').forEach(opt => {
        opt.addEventListener('click', () => {
            window.location.hash = opt.getAttribute('data-value');
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', event => {
            const query = event.target.value.toLowerCase().trim();
            if (query === '') {
                searchAutoComplete.classList.remove('show');
                return;
            }
            buildAutocompleteResults(query, searchAutoComplete, 8, true);
        });

        searchInput.addEventListener('keypress', event => {
            if (event.key !== 'Enter') return;
            const query = event.target.value.toLowerCase().trim();
            const result = rosterData.find(char => char.profile && char.profile.name && char.profile.name.toLowerCase().includes(query));
            if (result) window.location.hash = result.profile.name.toLowerCase();
        });
    }

    document.addEventListener('click', event => {
        if (customOptions) customOptions.classList.remove('show');
        if (customSelect) customSelect.classList.remove('active');
        if (searchAutoComplete) searchAutoComplete.classList.remove('show');

        const button = event.target && event.target.closest ? event.target.closest('.toggle-stats-btn') : null;
        if (!button) return;

        const card = button.closest('.info-box');
        if (!card) return;

        const pageOne = card.querySelector('.stat-page-1');
        const pageTwo = card.querySelector('.stat-page-2');
        const title = card.querySelector('.stat-card-title');
        if (!pageOne || !pageTwo || !title) return;

        const showingGear = !pageTwo.hidden;
        setHidden(pageOne, !showingGear);
        setHidden(pageTwo, showingGear);
        title.textContent = showingGear ? 'Combat Stats' : 'Weapon & Gear';
        button.textContent = showingGear ? '▶' : '◀';
    });

    function updateDropdownLabel() {
        if (!selectValueText) return;

        const hash = window.location.hash.substring(1);
        selectValueText.className = 'selected-value';
        selectValueText.removeAttribute('data-label-theme');

        if (hash === '') {
            selectValueText.textContent = 'Select View...';
            return;
        }
        if (hash === 'all' || hash === 'total') {
            selectValueText.textContent = '🌍 Entire Guild';
            return;
        }
        if (hash === 'active') {
            selectValueText.textContent = '🔥 Active Roster';
            return;
        }
        if (hash === 'raidready') {
            selectValueText.textContent = '⚔️ Raid Ready';
            return;
        }
        if (hash === 'analytics') {
            selectValueText.textContent = '📊 Analytics';
            return;
        }
        if (hash === 'architecture') {
            selectValueText.textContent = '⚙️ Architecture';
            return;
        }
        if (hash === 'badges') {
            selectValueText.textContent = '🌟 Hall of Heroes';
            return;
        }
        if (hash.startsWith('class-') || hash.startsWith('spec-') || hash.startsWith('filter-')) {
            selectValueText.textContent = '⚡ Filter Active';
            return;
        }

        const char = rosterData.find(item => item.profile && item.profile.name && item.profile.name.toLowerCase() === hash);
        if (!char) {
            selectValueText.textContent = 'Select View...';
            return;
        }

        const cClass = getCharClass(char);
        selectValueText.textContent = char.profile.name;
        selectValueText.classList.add('char-selected-text', `class-theme-${slugifyToken(cClass)}`);
    }

    const heatmapGrid = document.getElementById('heatmap-grid');

    if (heatmapGrid && heatmapData && heatmapData.length > 0) {

        // --- NEW: Chart.js Line Graph ---
        const ctx = document.getElementById('activityChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: heatmapData.map(d => d.day_name),
                    datasets: [
                        {
                            label: 'Loot Drops',
                            data: heatmapData.map(d => d.loot || 0),
                            borderColor: '#a335ee', // Epic Purple
                            backgroundColor: 'rgba(163, 53, 238, 0.1)',
                            borderWidth: 2,
                            pointBackgroundColor: '#a335ee',
                            pointBorderColor: '#fff',
                            tension: 0.3,
                            fill: true,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Level Ups',
                            data: heatmapData.map(d => d.levels || 0),
                            borderColor: '#ffd100', // Gold
                            backgroundColor: 'rgba(255, 209, 0, 0.1)',
                            borderWidth: 2,
                            pointBackgroundColor: '#ffd100',
                            pointBorderColor: '#fff',
                            tension: 0.3,
                            fill: true,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Total Roster',
                            data: heatmapData.map(d => d.total_roster || 0),
                            borderColor: 'rgba(52, 152, 219, 0.3)',
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            borderDash: [4, 4],
                            pointRadius: 0,
                            pointHoverRadius: 4,
                            pointBackgroundColor: '#3498db',
                            pointBorderColor: '#fff',
                            tension: 0.3,
                            fill: false,
                            yAxisID: 'y-roster'
                        },
                        {
                            label: 'Active Roster',
                            data: heatmapData.map(d => d.active_roster || 0),
                            borderColor: 'rgba(46, 204, 113, 0.6)',
                            backgroundColor: 'rgba(46, 204, 113, 0.05)',
                            borderWidth: 2,
                            borderDash: [4, 4],
                            pointRadius: 0,
                            pointHoverRadius: 4,
                            pointBackgroundColor: '#2ecc71',
                            pointBorderColor: '#fff',
                            tension: 0.3,
                            fill: true,
                            yAxisID: 'y-roster'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#bbb', font: { family: 'Cinzel' }, boxWidth: 12 } },
                        tooltip: { mode: 'index', intersect: false, backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyFont: { family: 'Cinzel' } }
                    },
                    scales: {
                        y: { 
                            type: 'linear',
                            position: 'left',
                            beginAtZero: true, 
                            title: { display: true, text: 'Activity Count', color: '#888', font: {family: 'Cinzel'} },
                            ticks: { color: '#888', stepSize: 1, font: {family: 'Cinzel'} }, 
                            grid: { color: 'rgba(255,255,255,0.05)' } 
                        },
                        'y-roster': {
                            type: 'linear',
                            position: 'right',
                            beginAtZero: false, // Setting false so large roster numbers don't compress the lines
                            title: { display: true, text: 'Player Count', color: '#888', font: {family: 'Cinzel'} },
                            ticks: { color: '#888', font: {family: 'Cinzel'} },
                            grid: { drawOnChartArea: false } // Prevents overlapping grid lines
                        },
                        x: { ticks: { color: '#888', font: { family: 'Cinzel', weight: 'bold' } }, grid: { display: false } }
                    },
                    interaction: { mode: 'nearest', axis: 'x', intersect: false }
                }
            });
        }

        const heatmapTemplate = document.getElementById('tpl-heatmap-col');

        // --- Original Heatmap Grid ---
        let heatmapHtml = '';
        
        // Find the absolute highest activity count in the current 7-day window
        const maxCount = Math.max(...heatmapData.map(d => d.count), 1);

        heatmapData.forEach(day => {
            let lvl = 0;
            
            // Assign a heatmap level based on the percentage of the peak day
            if (day.count > 0) {
                const ratio = day.count / maxCount;
                if (ratio > 0.75) lvl = 4;       // Top 25% busiest
                else if (ratio > 0.50) lvl = 3;  // 50% - 75%
                else if (ratio > 0.20) lvl = 2;  // 20% - 50%
                else lvl = 1;                    // Bottom 20% (but still non-zero)
            }
            
            const dateObj = new Date(day.date + 'T00:00:00Z');
            const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            
            if (heatmapTemplate) {
                const clone = heatmapTemplate.content.cloneNode(true);
                const colDiv = clone.querySelector('.heatmap-col');
                const labelSpan = clone.querySelector('.heatmap-label');
                const cellDiv = clone.querySelector('.heatmap-cell');
                
                labelSpan.textContent = day.day_name;
                cellDiv.setAttribute('data-lvl', lvl);
                cellDiv.setAttribute('data-date', dateStr);
                cellDiv.setAttribute('data-rawdate', day.date);
                cellDiv.setAttribute('data-count', day.count);
                
                heatmapGrid.appendChild(clone);
            }
            
        });

        
        document.querySelectorAll('.tt-heatmap').forEach(cell => {
            cell.addEventListener('click', function () {
                const rawDate = this.getAttribute('data-rawdate');
                if (tlSpecificDate === rawDate) {
                    tlSpecificDate = null;
                    this.classList.remove('selected-date');
                } else {
                    tlSpecificDate = rawDate;
                    document.querySelectorAll('.tt-heatmap').forEach(item => item.classList.remove('selected-date'));
                    this.classList.add('selected-date');
                }
                applyTimelineFilters();
            });

            cell.addEventListener('mouseenter', () => {
                const count = cell.getAttribute('data-count');
                const dateStr = cell.getAttribute('data-date');
                const tooltipTemplate = document.getElementById('tpl-heatmap-tooltip');
                if (!tooltipTemplate) return;

                const tooltipRoot = createElement('div', 'custom-tooltip visible');
                tooltipRoot.classList.add(count > 0 ? 'heatmap-has-activity' : 'heatmap-no-activity');
                const clone = tooltipTemplate.content.cloneNode(true);
                clone.querySelector('.tooltip-activity').textContent = `${count} Activities`;
                clone.querySelector('.tooltip-date').textContent = dateStr;
                tooltipRoot.appendChild(clone);
                createInlineTooltipHost(cell, tooltipRoot);
            });

            cell.addEventListener('mouseleave', () => {
                removeInlineTooltipHost(cell);
            });
        });

    }

    
    function createLeaderboardPodium(char, index, type) {
        const p = char.profile || {};
        const cClass = getCharClass(char);
        const portraitURL = char.render_url || getClassIcon(cClass);
        const activeSpec = p.active_spec ? p.active_spec : '';
        const trend = type === 'pve' ? (p.trend_pve || p.trend_ilvl || 0) : (p.trend_pvp || p.trend_hks || 0);
        const rank = index + 1;

        const block = createElement('div', `podium-block tt-char podium-step-${rank}`);
        bindCharacterSelect(block, (p.name || '').toLowerCase());
        applyClassTheme(block, cClass);
        applyRankTheme(block, rank);

        if (rank === 1) {
            block.appendChild(createElement('div', 'podium-crown', '👑'));
        }

        const avatar = createElement('img', 'podium-avatar');
        avatar.src = portraitURL;
        avatar.alt = p.name || 'Character portrait';
        avatar.classList.add('theme-border');

        const rankDiv = createElement('div', 'podium-rank', `#${rank}`);
        rankDiv.classList.add('rank-text');

        const nameDiv = createElement('div', 'podium-name theme-text', p.name || 'Unknown');

        const pill = createElement('div', 'podium-pill');
        const statDiv = createElement('div', 'podium-stat-val');
        statDiv.classList.add(type === 'pve' ? 'text-ilvl' : 'text-hk');
        statDiv.appendChild(document.createTextNode(type === 'pve' ? String(p.equipped_item_level || 0) : (p.honorable_kills || 0).toLocaleString()));
        statDiv.appendChild(document.createTextNode(' '));
        statDiv.appendChild(createElement('span', 'podium-stat-lbl', type === 'pve' ? 'iLvl' : 'HKs'));

        const trendWrap = createElement('div', 'podium-trend-container');
        trendWrap.appendChild(createTrendIndicator(trend, 'podium-trend'));

        appendChildren(pill, statDiv, trendWrap);
        appendChildren(block, avatar, rankDiv, nameDiv, pill);
        return block;
    }

    function createLeaderboardRow(char, index, type) {
        const p = char.profile || {};
        const cClass = getCharClass(char);
        const portraitURL = char.render_url || getClassIcon(cClass);
        const activeSpec = p.active_spec ? p.active_spec : '';
        const trend = type === 'pve' ? (p.trend_pve || p.trend_ilvl || 0) : (p.trend_pvp || p.trend_hks || 0);

        const row = createElement('div', 'pvp-row tt-char leaderboard-row');
        bindCharacterSelect(row, (p.name || '').toLowerCase());
        applyClassTheme(row, cClass);
        row.classList.add('theme-border-left');

        const rankDiv = createElement('div', 'lb-rank', `#${index + 1}`);
        const portrait = createElement('img', 'lb-portrait');
        portrait.src = portraitURL;
        portrait.alt = p.name || 'Character portrait';
        portrait.classList.add('theme-border');

        const info = createElement('div', 'lb-info');
        const name = createElement('span', 'lb-name theme-text', p.name || 'Unknown');
        const spec = createElement('span', 'lb-spec');
        spec.appendChild(createSpecInline(cClass, activeSpec, 'small'));

        const score = createElement('div', `lb-score ${type === 'pve' ? 'pve-score' : 'pvp-score'}`);
        score.appendChild(document.createTextNode(type === 'pve' ? String(p.equipped_item_level || 0) : (p.honorable_kills || 0).toLocaleString()));
        score.appendChild(document.createTextNode(' '));
        score.appendChild(createElement('span', 'lb-score-label', type === 'pve' ? 'iLvl' : 'HKs'));
        score.appendChild(createTrendIndicator(trend));

        appendChildren(info, name, spec);
        appendChildren(row, rankDiv, portrait, info, score);
        return row;
    }

    function renderHomeLeaderboard(containerEl, wrapperEl, characters, type) {
        if (!containerEl || !wrapperEl || characters.length === 0) return;

        showElement(wrapperEl);
        clearNode(containerEl);

        const podiumWrap = createElement('div', 'lb-podium-wrap');
        const listWrap = createElement('div', 'lb-list-wrap collapsed-list');

        characters.forEach((char, index) => {
            if (index < 3) {
                podiumWrap.appendChild(createLeaderboardPodium(char, index, type));
            } else {
                listWrap.appendChild(createLeaderboardRow(char, index, type));
            }
        });

        containerEl.appendChild(podiumWrap);
        containerEl.appendChild(listWrap);

        if (characters.length > 5) {
            const btn = createElement('button', 'expand-lb-btn', 'Show Top 25 ▼');
            btn.addEventListener('click', function () {
                listWrap.classList.toggle('collapsed-list');
                btn.textContent = btn.textContent.includes('▼') ? 'Collapse Leaderboard ▲' : 'Show Top 25 ▼';
            });
            containerEl.appendChild(btn);
        }
    }

    const pveContainer = document.getElementById('pve-leaderboard');
    const pveWrapper = document.getElementById('pve-leaderboard-container');

    const topPve = rosterData
        .filter(c => c.profile && (c.profile.equipped_item_level || 0) > 0)
        .sort((a, b) => (b.profile.equipped_item_level || 0) - (a.profile.equipped_item_level || 0))
        .slice(0, 25);

    renderHomeLeaderboard(pveContainer, pveWrapper, topPve, 'pve');

    const btnViewPve = document.getElementById('btn-view-pve');
    if (btnViewPve) {
        btnViewPve.addEventListener('click', () => {
            window.location.hash = 'ladder-pve';
        });
    }

    const btnViewPvp = document.getElementById('btn-view-pvp');
    if (btnViewPvp) {
        btnViewPvp.addEventListener('click', () => {
            window.location.hash = 'ladder-pvp';
        });
    }

    const pvpContainer = document.getElementById('pvp-leaderboard');
    const pvpWrapper = document.getElementById('pvp-leaderboard-container');

    const topPvp = rosterData
        .filter(c => c.profile && (c.profile.honorable_kills || 0) > 0)
        .sort((a, b) => (b.profile.honorable_kills || 0) - (a.profile.honorable_kills || 0))
        .slice(0, 25);

    renderHomeLeaderboard(pvpContainer, pvpWrapper, topPvp, 'pvp');

    setupTooltips();


    // --- Helper: Get Detailed Badge History from Timeline ---
    function getDetailedBadgeTooltip(charName, badgeTypes, baseTitle, actualCount) {
        let tooltip = baseTitle;
        if (!timelineData || timelineData.length === 0 || !charName) return tooltip.replace(/"/g, '&quot;');
        
        let events = timelineData.filter(e => 
            e.type === 'badge' && 
            (e.character_name || '').toLowerCase() === charName.toLowerCase() &&
            badgeTypes.includes(e.badge_type)
        );
        
        if (events.length > 0) {
            events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // Deduplicate identical events from the backend (same badge, same day)
            const uniqueEvents = [];
            const seenKeys = new Set();
            
            events.forEach(e => {
                let dStr = e.timestamp.substring(0, 10);
                // Include the specific category so different campaigns aren't squashed
                const key = `${e.badge_type}_${e.category || ''}_${dStr}`;
                if (!seenKeys.has(key)) {
                    seenKeys.add(key);
                    uniqueEvents.push(e);
                }
            });
            
            events = uniqueEvents;
            
            // Failsafe: Never show more events than the character actually has badges
            if (actualCount !== undefined && actualCount > 0) {
                events = events.slice(0, actualCount);
            }
            
            if (events.length > 0) {
                tooltip += ' \n-------------------\n';
                
                const lineCounts = {};
                events.forEach(e => {
                    let dStr = e.timestamp.substring(0, 10);
                    try {
                        let cleanTs = e.timestamp.replace('Z', '+00:00');
                        if (!cleanTs.includes('+') && !cleanTs.includes('Z')) cleanTs += 'Z';
                        const dt = new Date(cleanTs);
                        if (!isNaN(dt.getTime())) dStr = dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                    } catch(err) {}
                    
                    const catName = getThematicName(e.category);
                    const lineStr = `• ${dStr}: ${catName}`;
                    lineCounts[lineStr] = (lineCounts[lineStr] || 0) + 1;
                });

                tooltip += Object.entries(lineCounts).map(([line, count]) => {
                    return count > 1 ? `${line} (x${count})` : line;
                }).join('\n');
            }
        }
        return tooltip.replace(/"/g, '&quot;');
    }

    
    function renderFullCard(charName) {
        const char = rosterData.find(c => c.profile && c.profile.name && c.profile.name.toLowerCase() === charName);
        if (!char) return null;

        const p = char.profile || {};
        const eq = char.equipped || {};
        const st = char.stats || {};

        const cClass = getCharClass(char);
        const factionType = p.faction && p.faction.type ? p.faction.type : 'ALLIANCE';
        const factionCls = factionType === 'HORDE' ? 'faction-horde' : 'faction-alliance';
        const powerName = getPowerName(cClass);

        const activeSpec = p.active_spec ? p.active_spec : '';
        const displaySpecClass = activeSpec ? `${activeSpec} ${cClass}` : cClass;

        const health = st.health || 0;
        const power = st.power || 0;
        const strVal = st.strength_effective || ((st.strength && st.strength.effective) || 0);
        const agiVal = st.agility_effective || ((st.agility && st.agility.effective) || 0);
        const staVal = st.stamina_effective || ((st.stamina && st.stamina.effective) || 0);
        const intVal = st.intellect_effective || ((st.intellect && st.intellect.effective) || 0);
        const spiVal = st.spirit_effective || ((st.spirit && st.spirit.effective) || 0);

    function setupTooltips() {
        const ttChars = document.querySelectorAll('.tt-char:not(.tt-bound)');
        ttChars.forEach(trigger => {
            trigger.classList.add('tt-bound');
            trigger.addEventListener('mouseenter', () => {
                const charName = (trigger.getAttribute('data-char') || '').toLowerCase();
                const char = rosterData.find(c => c.profile && c.profile.name && c.profile.name.toLowerCase() === charName);
                if (!char) return;
                const p = char.profile || {};
                const st = char.stats || {};
                const cClass = getCharClass(char);
                const powerName = getPowerName(cClass);
                const raceName = p.race && p.race.name ? (typeof p.race.name === 'string' ? p.race.name : (p.race.name.en_US || 'Unknown')) : 'Unknown';
                const activeSpec = p.active_spec || '';
                const guildRank = p.guild_rank || 'Member';
                const vBadges = safeParseArray(p.vanguard_badges || char.vanguard_badges);
                const cBadges = safeParseArray(p.campaign_badges || char.campaign_badges);
                const counts = {
                    pveGold: parseInt(p.pve_gold || char.pve_gold) || 0,
                    pveSilver: parseInt(p.pve_silver || char.pve_silver) || 0,
                    pveBronze: parseInt(p.pve_bronze || char.pve_bronze) || 0,
                    pvpGold: parseInt(p.pvp_gold || char.pvp_gold) || 0,
                    pvpSilver: parseInt(p.pvp_silver || char.pvp_silver) || 0,
                    pvpBronze: parseInt(p.pvp_bronze || char.pvp_bronze) || 0,
                    pveChamp: parseInt(p.pve_champ_count || char.pve_champ_count) || 0,
                    pvpChamp: parseInt(p.pvp_champ_count || char.pvp_champ_count) || 0,
                    vanguard: vBadges.length,
                    campaign: cBadges.length
                };
                const tooltipRoot = createElement('div', 'custom-tooltip visible');
                const template = document.getElementById('tpl-char-tooltip');
                if (template) {
                    const clone = template.content.cloneNode(true);
                    const nameWrap = clone.querySelector('.tooltip-name-wrap');
                    nameWrap.classList.add('theme-text');
                    applyClassTheme(nameWrap, cClass);
                    clone.querySelector('.tooltip-char-name').textContent = p.name || 'Unknown';
                    const badgesContainer = clone.querySelector('.tooltip-badges-container');
                    const addBadge = (count, cssClass, icon) => { if (count > 0) badgesContainer.appendChild(createElement('span', `tt-badge ${cssClass}`, `${icon} ${count}`)); };
                    addBadge(counts.pveGold, 'tt-badge-gold', '🥇');
                    addBadge(counts.pveSilver, 'tt-badge-silver', '🥈');
                    addBadge(counts.pveBronze, 'tt-badge-bronze', '🥉');
                    addBadge(counts.pvpGold, 'tt-badge-gold', '🥇');
                    addBadge(counts.pvpSilver, 'tt-badge-silver', '🥈');
                    addBadge(counts.pvpBronze, 'tt-badge-bronze', '🥉');
                    addBadge(counts.pveChamp, 'tt-badge-pve', '👑');
                    addBadge(counts.pvpChamp, 'tt-badge-pvp', '⚔️');
                    addBadge(counts.vanguard, 'tt-badge-vanguard', '🌟');
                    addBadge(counts.campaign, 'tt-badge-campaign', '🎖️');
                    clone.querySelector('.tooltip-guild-rank').textContent = guildRank;
                    clone.querySelector('.tooltip-level-race').textContent = `${p.level || 0} / ${raceName}`;
                    const classWrap = clone.querySelector('.tooltip-class-wrap');
                    classWrap.classList.add('theme-text');
                    applyClassTheme(classWrap, cClass);
                    classWrap.appendChild(createSpecInline(cClass, activeSpec, 'tooltip'));
                    clone.querySelector('.tooltip-ilvl').textContent = p.equipped_item_level || 0;
                    clone.querySelector('.tooltip-power-label').textContent = powerName;
                    clone.querySelector('.tooltip-health-power').textContent = `${st.health || 0} / ${st.power || 0}`;
                    tooltipRoot.appendChild(clone);
                }
                createInlineTooltipHost(trigger, tooltipRoot);
            });
            trigger.addEventListener('mouseleave', () => removeInlineTooltipHost(trigger));
        });
    }

    function applyTimelineFilters() {
        if (!timeline) return;

        const now = Date.now();
        let tempFilteredData = timelineData.filter(event => {
            const charName = (event.character_name || '').toLowerCase();
            const eventType = event.type;
            const timestampStr = event.timestamp || '';
            const itemQuality = event.item_quality || 'COMMON';

            if (window.currentFilteredChars && !window.currentFilteredChars.includes(charName)) return false;

            if (tlTypeFilter.startsWith('badge_')) {
                if (eventType !== 'badge') return false;
                if (tlTypeFilter === 'badge_mvp' && event.badge_type !== 'mvp_pve' && event.badge_type !== 'mvp_pvp') return false;
                if (tlTypeFilter === 'badge_vanguard' && event.badge_type !== 'vanguard') return false;
                if (tlTypeFilter === 'badge_campaign' && event.badge_type !== 'campaign') return false;
                if (tlTypeFilter === 'badge_ladder' && !['pve_gold','pve_silver','pve_bronze','pvp_gold','pvp_silver','pvp_bronze'].includes(event.badge_type)) return false;
            } else {
                if (eventType === 'badge') return false;
                if (tlTypeFilter === 'rare_plus') {
                    if (eventType !== 'item') return false;
                    if (['POOR', 'COMMON', 'UNCOMMON'].includes(itemQuality)) return false;
                } else if (tlTypeFilter === 'epic') {
                    if (eventType !== 'item' || (itemQuality != 'EPIC' && itemQuality != 'LEGENDARY')) return false;
                } else if (tlTypeFilter == 'legendary') {
                    if (eventType != 'item' || itemQuality != 'LEGENDARY') return false;
                } else if (tlTypeFilter != 'all' && eventType != tlTypeFilter) {
                    return false;
                }
            }

            if (tlSpecificDate && timestampStr) {
                if (!timestampStr.startsWith(tlSpecificDate)) return false;
            } else if (tlDateFilter != 'all' && timestampStr) {
                let cleanTs = timestampStr.replace('Z', '+00:00');
                if (!cleanTs.includes('+') && !cleanTs.includes('Z')) cleanTs += 'Z';
                const eventDate = new Date(cleanTs).getTime();
                if (!isNaN(eventDate)) {
                    const hoursMs = parseInt(tlDateFilter) * 60 * 60 * 1000;
                    if ((now - eventDate) > hoursMs) return false;
                }
            }

            return true;
        });

        const uniqueEvents = [];
        const seenKeys = new Set();
        tempFilteredData.forEach(event => {
            if (event.type === 'badge') {
                const dayString = (event.timestamp || '').substring(0, 10);
                const charName = (event.character_name || '').toLowerCase();
                const key = `badge_${charName}_${event.badge_type}_${event.category || ''}_${dayString}`;
                if (!seenKeys.has(key)) {
                    seenKeys.add(key);
                    uniqueEvents.push(event);
                }
            } else {
                uniqueEvents.push(event);
            }
        });

        filteredTimelineData = uniqueEvents;
        const container = document.getElementById('timeline-feed-container');
        if (container) clearNode(container);
        currentTimelineIndex = 0;

        let noResultsMsg = document.getElementById('tl-no-results');
        if (filteredTimelineData.length === 0) {
            setHidden(container, true);
            if (!noResultsMsg) {
                noResultsMsg = createElement('div', 'tl-empty-msg', 'No activity found for these filters yet... keep raiding!');
                noResultsMsg.id = 'tl-no-results';
                document.getElementById('timeline').appendChild(noResultsMsg);
            }
            showElement(noResultsMsg);
            setHidden(document.getElementById('load-more-btn'), true);
            return;
        }

        showElement(container);
        if (noResultsMsg) setHidden(noResultsMsg, true);
        renderTimelineBatch();
    }


    document.querySelectorAll('.tl-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tl-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            tlTypeFilter = e.target.getAttribute('data-type');
            applyTimelineFilters();
        });
    });

    const dateSelect = document.getElementById('tl-date-filter');
    if (dateSelect) {
        dateSelect.addEventListener('change', (e) => {
            tlDateFilter = e.target.value;
            if (tlSpecificDate) {
                tlSpecificDate = null;
                document.querySelectorAll('.tt-heatmap').forEach(c => c.classList.remove('selected-date'));
            }
            applyTimelineFilters();
        });
    }

    
    function hideAllViews() {
        setHidden(emptyState, true);
        setHidden(conciseView, true);
        setHidden(fullCardContainer, true);
        if (analyticsView) setHidden(analyticsView, true);
        if (architectureView) setHidden(architectureView, true);
        if (searchInput) searchInput.value = '';
        if (searchAutoComplete) searchAutoComplete.classList.remove('show');

        const navSearch = document.querySelector('.navbar .search-container');
        showElement(navSearch);
        showElement(timeline);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        restoreTimelineFilters('default');
        tlTypeFilter = 'rare_plus';
        tlDateFilter = 'all';
        tlSpecificDate = null;

        setHidden(document.getElementById('guild-xp-container'), true);
        document.querySelectorAll('.tt-heatmap').forEach(cell => cell.classList.remove('selected-date'));
    }


    // --- AESTHETIC CHART DRAWING PLUGINS ---
    function createPieOverlayPlugin() {
        return {
            id: 'pieOverlays',
            afterDatasetDraw(chart) {
                const ctx = chart.ctx;
                const meta = chart.getDatasetMeta(0);
                chart.data.labels.forEach((label, i) => {
                    const arc = meta.data[i];
                    const dataVal = chart.data.datasets[0].data[i];
                    if (dataVal === 0 || arc.hidden) return;

                    // Calculate center of slice, pushed slightly outward
                    const centerAngle = arc.startAngle + (arc.endAngle - arc.startAngle) / 2;
                    const radius = arc.innerRadius + (arc.outerRadius - arc.innerRadius) * 0.65; 
                    const x = arc.x + Math.cos(centerAngle) * radius;
                    const y = arc.y + Math.sin(centerAngle) * radius;

                    ctx.save();
                    
                    // Draw sleek pill-shaped badge
                    ctx.beginPath();
                    ctx.roundRect(x - 18, y - 12, 36, 24, 6);
                    ctx.fillStyle = 'rgba(15, 15, 15, 0.9)';
                    ctx.fill();
                    ctx.lineWidth = 1.5;
                    ctx.strokeStyle = arc.options.backgroundColor || '#ffd100';
                    ctx.stroke();

                    // Draw text
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 13px Inter, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(dataVal, x, y + 1); // +1 tweak for optical alignment
                    
                    ctx.restore();
                });
            }
        };
    }

    const barLabelPlugin = {
        id: 'barLabels',
        afterDatasetsDraw(chart) {
            const ctx = chart.ctx;
            chart.data.datasets.forEach((dataset, i) => {
                const meta = chart.getDatasetMeta(i);
                meta.data.forEach((bar, index) => {
                    const data = dataset.data[index];
                    if (data > 0) {
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 14px Cinzel';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.shadowColor = 'rgba(0,0,0,0.9)';
                        ctx.shadowBlur = 4;
                        ctx.shadowOffsetX = 1;
                        ctx.shadowOffsetY = 1;
                        ctx.fillText(data, bar.x, bar.y - 6);
                        ctx.shadowBlur = 0; 
                    }
                });
            });
        }
    };

    // --- REUSABLE ROLE CHART GENERATOR ---
    function drawRoleChart(ctxId, characters, isRawMode) {
        const roleCounts = { "Tank": 0, "Healer": 0, "Melee DPS": 0, "Ranged DPS": 0 };
        characters.forEach(c => {
            const p = isRawMode ? rosterData.find(deep => deep.profile && deep.profile.name && deep.profile.name.toLowerCase() === (c.name || '').toLowerCase())?.profile : c.profile;
            if (!p || !p.active_spec) return;
            const spec = p.active_spec;
            const cClass = isRawMode ? (c.class || 'Unknown') : getCharClass(c);
            
            if (["Protection", "Blood"].includes(spec) || (cClass === "Druid" && spec === "Feral Combat")) roleCounts["Tank"]++;
            else if (["Holy", "Discipline", "Restoration"].includes(spec)) roleCounts["Healer"]++;
            else if (["Mage", "Warlock", "Hunter"].includes(cClass) || ["Balance", "Elemental", "Shadow"].includes(spec)) roleCounts["Ranged DPS"]++;
            else roleCounts["Melee DPS"]++;
        });

        const ctx = document.getElementById(ctxId);
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(roleCounts),
                datasets: [{ 
                    data: Object.values(roleCounts), 
                    backgroundColor: ['#e74c3c', '#2ecc71', '#e67e22', '#3498db'], 
                    borderColor: '#111', borderWidth: 2 
                }]
            },
            options: { 
                responsive: true, maintainAspectRatio: false, cutout: '60%', layout: { padding: { top: 20, bottom: 20 } },
                plugins: { legend: { position: 'bottom', labels: { color: '#bbb', font: { family: 'Cinzel' } } } },
                onClick: (event, elements, chart) => {
                    if (elements.length > 0) {
                        const clickedLabel = chart.data.labels[elements[0].index];
                        window.location.hash = 'filter-role-' + clickedLabel.toLowerCase().replace(/\s+/g, '-');
                    }
                },
                onHover: (event, elements) => {
                    setChartPointerState(event, elements.length > 0);
                }
            },
            plugins: [createPieOverlayPlugin()]
        });
    }

    function createDonutChart(ctxId, rosterToCount, isRawMode) {
        const counts = {};
        rosterToCount.forEach(char => {
            let cClass = isRawMode ? (char.class || 'Unknown') : getCharClass(char);
            if (cClass !== 'Unknown') counts[cClass] = (counts[cClass] || 0) + 1;
        });

        const sortedClasses = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
        const donutLabels = sortedClasses;
        const donutData = sortedClasses.map(cls => counts[cls]);
        const donutColors = sortedClasses.map(cls => CLASS_COLORS[cls] || '#888');

        const ctx = document.getElementById(ctxId);
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'doughnut',
            data: { labels: donutLabels, datasets: [{ data: donutData, backgroundColor: donutColors, borderColor: '#111', borderWidth: 2, hoverOffset: 6 }] },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '65%', layout: { padding: { top: 20, bottom: 20, right: 20, left: 20 } },
                onClick: (event, elements, chart) => {
                    if (elements.length > 0) {
                        const clickedClass = chart.data.labels[elements[0].index];
                        const dynamicBadge = document.querySelector(`.dynamic-badge[data-class="${clickedClass}"]`);
                        if (dynamicBadge && isElementVisible(document.getElementById('concise-view'))) {
                            dynamicBadge.click(); 
                        } else {
                            window.location.hash = 'class-' + clickedClass.toLowerCase();
                        }
                    }
                },
                onHover: (event, elements) => {
                    setChartPointerState(event, elements.length > 0);
                },
                plugins: { legend: { display: false } }
            },
            plugins: [createPieOverlayPlugin()]
        });
    }

    function showAnalyticsView() {
        hideAllViews();
        setDisplayVariant(analyticsView, 'block');
        setNavbarSubpageState(navbar, true);
        setHidden(timeline, true);

        // --- CALCULATE KPIs ---
        let totalIlvl = 0, lvl70Count = 0, totalHks = 0;
        rosterData.forEach(c => {
            const p = c.profile;
            if (p) {
                if (p.level === 70 && p.equipped_item_level) {
                    totalIlvl += p.equipped_item_level;
                    lvl70Count++;
                }
                if (p.honorable_kills) totalHks += p.honorable_kills;
            }
        });
        
        let epicLootCount = 0;
        timelineData.forEach(e => {
            if (e.type === 'item' && (e.item_quality === 'EPIC' || e.item_quality === 'LEGENDARY')) epicLootCount++;
        });

        const kpiIlvl = document.getElementById('kpi-avg-ilvl');
        if (kpiIlvl) kpiIlvl.innerText = lvl70Count > 0 ? Math.round(totalIlvl / lvl70Count) : 0;

        const kpiEpic = document.getElementById('kpi-epic-loot');
        if (kpiEpic) kpiEpic.innerText = epicLootCount;

        const kpiBoxLoot = document.getElementById('kpi-box-loot');
        if (kpiBoxLoot) {
            kpiBoxLoot.addEventListener('click', () => {
                window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
            });
        }

        const kpiBoxPvp = document.getElementById('kpi-box-pvp');
        if (kpiBoxPvp) {
            kpiBoxPvp.addEventListener('click', () => {
                window.location.hash = 'ladder-pvp';
            });
        }
        
        const kpiHks = document.getElementById('kpi-total-hks');
        if (kpiHks) kpiHks.innerText = totalHks >= 1000000 ? (totalHks/1000000).toFixed(1) + 'M' : totalHks.toLocaleString();

        const kpiBoxPve = document.getElementById('kpi-box-pve');
        if (kpiBoxPve) {
            kpiBoxPve.addEventListener('click', () => {
                window.location.hash = 'ladder-pve';
            });
        }

        if(window.roleChartInstance) window.roleChartInstance.destroy();
        window.roleChartInstance = drawRoleChart('roleDonutChart', rosterData, false);

        const levelLabels = ["1-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70"];
        const levelData = [0, 0, 0, 0, 0, 0, 0, 0];
        rawGuildRoster.forEach(c => {
            const lvl = c.level || 0;
            if(lvl >= 70) levelData[7]++;
            else if(lvl >= 60) levelData[6]++;
            else if(lvl >= 50) levelData[5]++;
            else if(lvl >= 40) levelData[4]++;
            else if(lvl >= 30) levelData[3]++;
            else if(lvl >= 20) levelData[2]++;
            else if(lvl >= 10) levelData[1]++;
            else levelData[0]++;
        });

        const lvlCanvas = document.getElementById('levelDistChart');
        if (lvlCanvas) {
            const lvlCtx = lvlCanvas.getContext('2d');
            const lvlGradient = lvlCtx.createLinearGradient(0, 0, 0, 400);
            lvlGradient.addColorStop(0, 'rgba(255, 209, 0, 0.8)');
            lvlGradient.addColorStop(1, 'rgba(255, 209, 0, 0.1)');

            if(levelChartInstance) levelChartInstance.destroy();
            levelChartInstance = new Chart(lvlCtx, {
                type: 'bar',
                data: {
                    labels: levelLabels,
                    datasets: [{ label: 'Characters', data: levelData, backgroundColor: lvlGradient, borderColor: '#ffd100', borderWidth: 1, borderRadius: 4 }]
                },
                options: { 
                    responsive: true, maintainAspectRatio: false, layout: { padding: { top: 30 } }, plugins: { legend: {display: false}}, 
                    scales: { 
                        y: {beginAtZero: true, grid: {color: 'rgba(255,255,255,0.05)'}, ticks: {color: '#888'}}, 
                        x: {grid: {display: false}, ticks: {color: '#888', font: {family: 'Cinzel'}}}
                    },
                    onClick: (event, elements, chart) => {
                        if (elements.length > 0) {
                            window.location.hash = 'filter-level-' + chart.data.labels[elements[0].index];
                        }
                    },
                    onHover: (event, elements) => { setChartPointerState(event, elements.length > 0); }
                },
                plugins: [barLabelPlugin]
            });
        }

        const ilvlLabels = ["<100", "100-109", "110-119", "120-129", "130+"];
        const ilvlData = [0, 0, 0, 0, 0];
        rosterData.forEach(c => {
            const p = c.profile;
            if(p && p.level >= 70) {
                const ilvl = p.equipped_item_level || 0;
                if(ilvl >= 130) ilvlData[4]++;
                else if(ilvl >= 120) ilvlData[3]++;
                else if(ilvl >= 110) ilvlData[2]++;
                else if(ilvl >= 100) ilvlData[1]++;
                else ilvlData[0]++;
            }
        });

        const ilvlCanvas = document.getElementById('ilvlDistChart');
        if (ilvlCanvas) {
            const ilvlCtx = ilvlCanvas.getContext('2d');
            const ilvlGradient = ilvlCtx.createLinearGradient(0, 0, 0, 400);
            ilvlGradient.addColorStop(0, 'rgba(255, 128, 0, 0.8)'); 
            ilvlGradient.addColorStop(1, 'rgba(255, 128, 0, 0.1)'); 

            if(ilvlChartInstance) ilvlChartInstance.destroy();
            ilvlChartInstance = new Chart(ilvlCtx, {
                type: 'bar',
                data: {
                    labels: ilvlLabels,
                    datasets: [{ label: 'Level 70 Characters', data: ilvlData, backgroundColor: ilvlGradient, borderColor: '#ff8000', borderWidth: 1, borderRadius: 4 }]
                },
                options: { 
                    responsive: true, maintainAspectRatio: false, layout: { padding: { top: 30 } }, plugins: { legend: {display: false}}, 
                    scales: { 
                        y: {beginAtZero: true, grid: {color: 'rgba(255,255,255,0.05)'}, ticks: {color: '#888'}}, 
                        x: {grid: {display: false}, ticks: {color: '#888', font: {family: 'Cinzel'}}}
                    },
                    onClick: (event, elements, chart) => {
                        if (elements.length > 0) window.location.hash = 'filter-ilvl-' + chart.data.labels[elements[0].index];
                    },
                    onHover: (event, elements) => { setChartPointerState(event, elements.length > 0); }
                },
                plugins: [barLabelPlugin]
            });
        }

        const raceCounts = {};
        rosterData.forEach(c => {
            const p = c.profile;
            if(p && p.race && p.race.name) {
                const raceName = typeof p.race.name === 'string' ? p.race.name : (p.race.name.en_US || 'Unknown');
                raceCounts[raceName] = (raceCounts[raceName] || 0) + 1;
            }
        });
        
        const RACE_COLORS = {
            "Human": "#0033aa", "Draenei": "#ba55d3", "Dwarf": "#8B4513", "Night Elf": "#800080",
            "Gnome": "#FF69B4", "Orc": "#8B0000", "Undead": "#556B2F", "Tauren": "#D2B48C",
            "Troll": "#008B8B", "Blood Elf": "#DC143C", "Unknown": "#888"
        };

        if(raceChartInstance) raceChartInstance.destroy();
        raceChartInstance = new Chart(document.getElementById('raceDistChart'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(raceCounts),
                datasets: [{ data: Object.values(raceCounts), backgroundColor: Object.keys(raceCounts).map(r => RACE_COLORS[r] || '#555'), borderColor: '#111', borderWidth: 2 }]
            },
            options: { 
                responsive: true, maintainAspectRatio: false, cutout: '55%', layout: { padding: { top: 20, bottom: 20, right: 20, left: 20 } },
                plugins: { legend: {position: 'right', labels:{color:'#bbb', font:{family:'Cinzel'}}} },
                onClick: (event, elements, chart) => {
                    if (elements.length > 0) window.location.hash = 'filter-race-' + chart.data.labels[elements[0].index].toLowerCase();
                },
                onHover: (event, elements) => { setChartPointerState(event, elements.length > 0); }
            },
            plugins: [createPieOverlayPlugin()]
        });

        if(analyticsClassChartInst) analyticsClassChartInst.destroy();
        analyticsClassChartInst = createDonutChart('analyticsClassChart', rosterData, false);

        const actCtx = document.getElementById('analyticsActivityChart');
        if (actCtx && heatmapData && heatmapData.length > 0) {
            if(analyticsActivityChartInst) analyticsActivityChartInst.destroy();
            analyticsActivityChartInst = new Chart(actCtx, {
                type: 'line',
                data: {
                    labels: heatmapData.map(d => d.day_name),
                    datasets: [
                        { label: 'Loot Drops', data: heatmapData.map(d => d.loot || 0), borderColor: '#a335ee', backgroundColor: 'rgba(163, 53, 238, 0.1)', borderWidth: 2, pointBackgroundColor: '#a335ee', pointBorderColor: '#fff', tension: 0.3, fill: true, yAxisID: 'y' },
                        { label: 'Level Ups', data: heatmapData.map(d => d.levels || 0), borderColor: '#ffd100', backgroundColor: 'rgba(255, 209, 0, 0.1)', borderWidth: 2, pointBackgroundColor: '#ffd100', pointBorderColor: '#fff', tension: 0.3, fill: true, yAxisID: 'y' },
                        { label: 'Total Roster', data: heatmapData.map(d => d.total_roster || 0), borderColor: 'rgba(52, 152, 219, 0.3)', backgroundColor: 'transparent', borderWidth: 2, borderDash: [4, 4], pointRadius: 0, pointHoverRadius: 4, pointBackgroundColor: '#3498db', pointBorderColor: '#fff', tension: 0.3, fill: false, yAxisID: 'y-roster' },
                        { label: 'Active Roster', data: heatmapData.map(d => d.active_roster || 0), borderColor: 'rgba(46, 204, 113, 0.6)', backgroundColor: 'rgba(46, 204, 113, 0.05)', borderWidth: 2, borderDash: [4, 4], pointRadius: 0, pointHoverRadius: 4, pointBackgroundColor: '#2ecc71', pointBorderColor: '#fff', tension: 0.3, fill: true, yAxisID: 'y-roster' }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: '#bbb', font: { family: 'Cinzel' }, boxWidth: 12 } }, tooltip: { mode: 'index', intersect: false, backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyFont: { family: 'Cinzel' } } },
                    scales: { 
                        y: { type: 'linear', position: 'left', beginAtZero: true, title: { display: true, text: 'Activity Count', color: '#888', font: {family: 'Cinzel'} }, ticks: { color: '#888', stepSize: 1, font: {family: 'Cinzel'} }, grid: { color: 'rgba(255,255,255,0.05)' } },
                        'y-roster': { type: 'linear', position: 'right', beginAtZero: false, title: { display: true, text: 'Player Count', color: '#888', font: {family: 'Cinzel'} }, ticks: { color: '#888', font: {family: 'Cinzel'} }, grid: { drawOnChartArea: false } },
                        x: { ticks: { color: '#888', font: { family: 'Cinzel', weight: 'bold' } }, grid: { display: false } } 
                    },
                    interaction: { mode: 'nearest', axis: 'x', intersect: false }
                }
            });
        }
    }

    function showArchitectureView() {
        hideAllViews();
        setDisplayVariant(architectureView, 'block');
        setNavbarSubpageState(navbar, true);
        setHidden(timeline, true);
    }

    window.returnToHome = function() {
        window.location.hash = '';
        showHomeView();
    }

    function showHomeView() {
        hideAllViews();
        setDisplayVariant(emptyState, 'block');
        setNavbarSubpageState(navbar, false);
        updateDropdownLabel('all');

        const navSearch = document.querySelector('.navbar .search-container');
        setHidden(navSearch, true);

        const xpCont = document.getElementById('guild-xp-container');
        setDisplayVariant(xpCont, 'block');
        
        if (typeof window.renderGuildXPBar === 'function') window.renderGuildXPBar();

        if (timeline) { 
            setDisplayVariant(timeline, 'block'); 
            timelineTitle.textContent = '📜 Guild Recent Activity'; 
            window.currentFilteredChars = null; 
            applyTimelineFilters(); 
        }

        let totalIlvl = 0, lvl70Count = 0, totalHks = 0;
        rosterData.forEach(c => {
            if (c.profile) {
                if (c.profile.level === 70 && c.profile.equipped_item_level) { totalIlvl += c.profile.equipped_item_level; lvl70Count++; }
                if (c.profile.honorable_kills) totalHks += c.profile.honorable_kills;
            }
        });
        const kpiIlvl = document.getElementById('home-kpi-ilvl');
        if (kpiIlvl) kpiIlvl.innerText = lvl70Count > 0 ? Math.round(totalIlvl / lvl70Count) : 0;
        const kpiHks = document.getElementById('home-kpi-hks');
        if (kpiHks) kpiHks.innerText = totalHks >= 1000000 ? (totalHks / 1000000).toFixed(1) + 'M' : totalHks.toLocaleString();

        const recentKpi = document.getElementById('recent-milestones-container');
        const milestoneText = document.getElementById('milestone-text');
        if (timelineData && timelineData.length > 0 && recentKpi && milestoneText) {
            const recentEvents = timelineData.filter(e => 
                (e.type === 'item' && (e.item_quality === 'EPIC' || e.item_quality === 'LEGENDARY')) || 
                (e.type === 'level_up' && e.level === 70)
            ).slice(0, 5);

            if (recentEvents.length > 0) {
                setDisplayVariant(recentKpi, 'flex');
                milestoneText.classList.add('milestone-text-rotator');

                const slideElements = recentEvents.map(recent => {
                    let timeStr = '';
                    try {
                        let cleanTs = (recent.timestamp || '').replace('Z', '+00:00');
                        if (!cleanTs.includes('+') && !cleanTs.includes('Z')) cleanTs += 'Z';
                        const dt = new Date(cleanTs);
                        if (!isNaN(dt.getTime())) timeStr = ` (${dt.toLocaleString('en-GB', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:false}).replace(',', '')})`;
                    } catch(e) {}
                    let clone;
                    if (recent.type === 'level_up') {
                        const tpl = document.getElementById('tpl-milestone-level');
                        clone = tpl.content.cloneNode(true);
                        clone.querySelector('.ms-char').textContent = recent.character_name;
                        clone.querySelector('.ms-time').textContent = timeStr;
                    } else {
                        const tpl = document.getElementById('tpl-milestone-loot');
                        clone = tpl.content.cloneNode(true);
                        clone.querySelector('.ms-char').textContent = recent.character_name;
                        clone.querySelector('.ms-time').textContent = timeStr;
                        const link = clone.querySelector('.ms-loot-link');
                        link.href = `https://www.wowhead.com/wotlk/item=${recent.item_id}`;
                        link.textContent = `[${recent.item_name}]`;
                        link.classList.add(recent.item_quality === 'LEGENDARY' ? 'ms-loot-link-legendary' : 'ms-loot-link-epic');
                    }
                    const wrapper = document.createElement('span');
                    wrapper.appendChild(clone);
                    return wrapper;
                });

                clearNode(milestoneText);
                milestoneText.appendChild(slideElements[0].cloneNode(true));
                milestoneText.classList.remove('is-fading');
                milestoneText.classList.add('is-visible');

                if (slideElements.length > 1) {
                    let currentSlide = 0;
                    if (window.milestoneInterval) clearInterval(window.milestoneInterval);
                    window.milestoneInterval = setInterval(() => {
                        milestoneText.classList.remove('is-visible');
                        milestoneText.classList.add('is-fading');
                        setTimeout(() => {
                            currentSlide = (currentSlide + 1) % slideElements.length;
                            clearNode(milestoneText);
                            milestoneText.appendChild(slideElements[currentSlide].cloneNode(true));
                            milestoneText.classList.remove('is-fading');
                            milestoneText.classList.add('is-visible');
                        }, 500);
                    }, 4500);
                }
            } else {
                setHidden(recentKpi, true);
            }
        }

        const statAvgIlvl = document.getElementById('stat-avg-ilvl');
        if (statAvgIlvl && !statAvgIlvl.dataset.boundClick) {
            statAvgIlvl.dataset.boundClick = 'true';
            statAvgIlvl.addEventListener('click', () => { window.location.hash = 'ladder-pve'; });
        }
        const statHks = document.getElementById('stat-hks');
        if (statHks && !statHks.dataset.boundClick) {
            statHks.dataset.boundClick = 'true';
            statHks.addEventListener('click', () => { window.location.hash = 'ladder-pvp'; });
        }
		
		if (typeof renderMVPs === 'function') renderMVPs();
    }

    window.selectCharacter = function(charName) {
        window.location.hash = charName;
    }

    // Added defaultSort parameter to override the standard "level" start
    function showConciseView(title, characters, isRawRoster = false, showBadges = true, defaultSort = 'level') {
        hideAllViews();
        setDisplayVariant(conciseView, 'flex');
        setNavbarSubpageState(navbar, true);
        currentSortMethod = defaultSort;
        renderConciseList(title, characters, isRawRoster);
        window.currentFilteredChars = characters.map(c => isRawRoster ? (c.name ? c.name.toLowerCase() : '') : (c.profile && c.profile.name ? c.profile.name.toLowerCase() : ''));
        const hash = window.location.hash.substring(1);
        const chartViews = ['total', 'active', 'raidready', 'ladder-pve', 'ladder-pvp'];
        const wrapper = document.getElementById('concise-content-wrapper');
        const leftCol = document.getElementById('concise-left-col');
        const badgesContainer = document.getElementById('concise-class-badges');
        const specContainer = document.getElementById('concise-spec-container');
        const donutContainer = document.getElementById('concise-donut-container');
        const isChartView = chartViews.includes(hash);
        const isAwardsMode = showBadges === 'awards';
        const showLeftCol = showBadges === true || isAwardsMode || isChartView;

        if (wrapper) wrapper.classList.toggle('concise-layout-column', isAwardsMode);
        if (leftCol) {
            setDisplayVariant(leftCol, showLeftCol ? 'flex' : 'none');
            leftCol.classList.toggle('concise-left-col-wide', isAwardsMode);
        }
        if (badgesContainer) {
            setDisplayVariant(badgesContainer, showBadges === false ? 'none' : 'flex');
            badgesContainer.classList.toggle('badges-mode-default', showBadges === true);
            badgesContainer.classList.toggle('badges-mode-awards', isAwardsMode);
        }
        if (specContainer && showBadges === false) setHidden(specContainer, true);
        if (timeline) timeline.classList.toggle('timeline-awards-mode', isAwardsMode);

        if (showBadges === true) renderDynamicBadges(characters, isRawRoster);
        else if (isAwardsMode) renderAwardFilterBadges(characters, isRawRoster);

        if (isChartView && donutContainer) {
            setDisplayVariant(donutContainer, 'flex');
            donutContainer.classList.add('donut-dashboard-mode');
            clearNode(donutContainer);
            const template = document.getElementById('tpl-concise-dashboard-widgets');
            if (template) donutContainer.appendChild(template.content.cloneNode(true));
            const kpiContainer = donutContainer.querySelector('.concise-kpi-container');
            const addKpi = (val, label, theme) => {
                const kpiTpl = document.getElementById('tpl-concise-kpi-box');
                if (kpiTpl && kpiContainer) {
                    const clone = kpiTpl.content.cloneNode(true);
                    const box = clone.querySelector('.concise-stat-box');
                    const valSpan = clone.querySelector('.concise-stat-value');
                    box.classList.add('concise-kpi-box', 'theme-accent-border');
                    applyAccentTheme(box, theme);
                    valSpan.classList.add('theme-accent-text');
                    applyAccentTheme(valSpan, theme);
                    valSpan.textContent = val;
                    clone.querySelector('.concise-stat-label').textContent = label;
                    kpiContainer.appendChild(clone);
                }
            };
            if (hash === 'raidready') {
                const avgIlvl = Math.round(characters.reduce((sum, c) => sum + ((c.profile && c.profile.equipped_item_level) || 0), 0) / characters.length) || 0;
                addKpi(avgIlvl, 'Average iLvl', 'orange');
            } else if (hash === 'ladder-pve') {
                const avgIlvl = Math.round(characters.reduce((sum, c) => sum + ((c.profile && c.profile.equipped_item_level) || 0), 0) / characters.length) || 0;
                const lvl70s = characters.filter(c => {
                    const p = isRawRoster ? rosterData.find(deep => deep.profile?.name?.toLowerCase() === (c.name || '').toLowerCase())?.profile : c.profile;
                    return p && p.level === 70;
                });
                const avgLvl70Ilvl = lvl70s.length > 0 ? Math.round(lvl70s.reduce((sum, c) => {
                    const p = isRawRoster ? rosterData.find(deep => deep.profile?.name?.toLowerCase() === (c.name || '').toLowerCase())?.profile : c.profile;
                    return sum + ((p && p.equipped_item_level) || 0);
                }, 0) / lvl70s.length) : 0;
                addKpi(avgIlvl, 'Avg iLvl', 'orange');
                addKpi(avgLvl70Ilvl, 'Avg Lvl 70 iLvl', 'purple');
            } else if (hash === 'ladder-pvp') {
                const totalHks = characters.reduce((sum, c) => sum + ((c.profile && c.profile.honorable_kills) || 0), 0) || 0;
                const displayHks = totalHks >= 1000000 ? (totalHks/1000000).toFixed(1) + 'M' : totalHks.toLocaleString();
                addKpi(displayHks, 'Total HKs', 'red');
            } else if (hash === 'active' || hash === 'total') {
                const avgLvl = Math.round(characters.reduce((sum, c) => {
                    const p = isRawRoster ? rosterData.find(deep => deep.profile?.name?.toLowerCase() === (c.name || '').toLowerCase())?.profile : c.profile;
                    return sum + ((p && p.level) || c.level || 0);
                }, 0) / characters.length) || 0;
                const lvl70s = characters.filter(c => {
                    const p = isRawRoster ? rosterData.find(deep => deep.profile?.name?.toLowerCase() === (c.name || '').toLowerCase())?.profile : c.profile;
                    return p && p.level === 70;
                });
                const avgIlvl = lvl70s.length > 0 ? Math.round(lvl70s.reduce((sum, c) => {
                    const p = isRawRoster ? rosterData.find(deep => deep.profile?.name?.toLowerCase() === (c.name || '').toLowerCase())?.profile : c.profile;
                    return sum + ((p && p.equipped_item_level) || 0);
                }, 0) / lvl70s.length) : 0;
                addKpi(avgLvl, 'Avg Level', 'gold');
                addKpi(avgIlvl, 'Avg Lvl 70 iLvl', 'orange');
            }
            if (window.conciseRoleChartInstance) window.conciseRoleChartInstance.destroy();
            if (window.conciseClassChartInstance) window.conciseClassChartInstance.destroy();
            window.conciseRoleChartInstance = drawRoleChart('conciseRoleChart', characters, isRawRoster);
            window.conciseClassChartInstance = createDonutChart('conciseClassChart', characters, isRawRoster);
        } else if (donutContainer) {
            setHidden(donutContainer, true);
        }
        if (timeline) {
            const baseTitle = title.replace(/ Overview \(\d+\)/, '').replace(/ \(\d+\)/, '');
            timelineTitle.textContent = `📜 ${baseTitle} Activity`;
            applyTimelineFilters();
        }
    }

    function showFullCardView(charName) {
        hideAllViews();
        setDisplayVariant(fullCardContainer, 'block');
        clearNode(fullCardContainer);
        const fullCardNode = renderFullCard(charName);
        if (fullCardNode) fullCardContainer.appendChild(fullCardNode);
        setNavbarSubpageState(navbar, true);
        if (timeline) {
            const formattedName = charName.charAt(0).toUpperCase() + charName.slice(1);
            timelineTitle.textContent = `📜 ${formattedName}'s Recent Activity`;
            window.currentFilteredChars = [charName.toLowerCase()];
            applyTimelineFilters();
        }
    }

    function route() {
        const hash = decodeURIComponent(window.location.hash.substring(1));
        
        if (!hash || hash === '') {
            showHomeView();
        } else if (hash === 'analytics') {
            showAnalyticsView();
            updateDropdownLabel('all');
        } else if (hash === 'architecture') {
            showArchitectureView();
            updateDropdownLabel('all');
        } else if (hash === 'total') {
            showConciseView(`Total Guild Roster (${rawGuildRoster.length})`, rawGuildRoster.sort((a,b) => b.level - a.level), true, true);
            updateDropdownLabel('all');
        } else if (hash === 'badges') {
            const badgeRoster = rosterData.filter(c => {
                const p = c.profile;
                if (!p) return false;
                const vCount = safeParseArray(p.vanguard_badges || c.vanguard_badges).length;
                const cCount = safeParseArray(p.campaign_badges || c.campaign_badges).length;
                const pveMvp = parseInt(p.pve_champ_count || c.pve_champ_count) || 0;
                const pvpMvp = parseInt(p.pvp_champ_count || c.pvp_champ_count) || 0;
                const pveG = parseInt(p.pve_gold || c.pve_gold) || 0;
                const pvpG = parseInt(p.pvp_gold || c.pvp_gold) || 0;
                const pveS = parseInt(p.pve_silver || c.pve_silver) || 0;
                const pvpS = parseInt(p.pvp_silver || c.pvp_silver) || 0;
                const pveB = parseInt(p.pve_bronze || c.pve_bronze) || 0;
                const pvpB = parseInt(p.pvp_bronze || c.pvp_bronze) || 0;
                return (vCount + cCount + pveMvp + pvpMvp + pveG + pvpG + pveS + pvpS + pveB + pvpB) > 0;
            });
            
            showConciseView(`🌟 Hall of Heroes (${badgeRoster.length})`, badgeRoster, false, 'awards', 'badges');
            updateDropdownLabel('badges');
            
            // --- OVERRIDE TIMELINE FILTERS FOR BADGE LOG ---
            if (timeline) {
                timelineTitle.textContent = '📜 Hall of Heroes Award History';
                restoreTimelineFilters('awards');
                tlTypeFilter = 'badge_all';
                tlDateFilter = 'all'; // Ignore time limits for history
                window.currentFilteredChars = null; 
                applyTimelineFilters();
            }

        } else if (hash === 'active') {
            const activeRoster = rosterData.filter(c => {
                const lastLogin = c.profile && c.profile.last_login_timestamp ? c.profile.last_login_timestamp : 0;
                const now = Date.now();
                return (now - lastLogin) <= (14 * 24 * 60 * 60 * 1000);
            });
            showConciseView(`Active Members Overview (${activeRoster.length})`, activeRoster, false, true);
            updateDropdownLabel('all');
        } else if (hash === 'raidready') {
            const raidReadyRoster = rosterData.filter(c => c.profile && c.profile.level === 70 && (c.profile.equipped_item_level || 0) >= 110);
            showConciseView(`Raid Ready Overview (${raidReadyRoster.length})`, raidReadyRoster, false, true);
            updateDropdownLabel('all');
        } else if (hash === 'all') {
            const activeLabel = active14Days > 0 ? `(${active14Days} Active)` : '';
            showConciseView(`Processed Roster Overview ${activeLabel}`, rosterData, false, true);
            updateDropdownLabel('all');
        } else if (hash.startsWith('class-')) {
            const className = hash.replace('class-', '');
            const formattedClass = className.charAt(0).toUpperCase() + className.slice(1);
            const classRoster = rosterData.filter(c => {
                const cClass = getCharClass(c);
                return cClass.toLowerCase() === className;
            });
            showConciseView(`Guild ${formattedClass}s Overview (${classRoster.length})`, classRoster, false, false);
            updateDropdownLabel('all');
        } else if (hash.startsWith('spec-')) {
            const parts = hash.split('-');
            const className = parts[1];
            const specParam = parts.slice(2).join('');
            const formattedClass = className.charAt(0).toUpperCase() + className.slice(1);

            const specRoster = rosterData.filter(c => {
                const cClass = getCharClass(c);
                if (cClass.toLowerCase() !== className) return false;

                const cSpec = c.profile && c.profile.active_spec ? c.profile.active_spec : "unspecced";
                const cSpecClean = cSpec.toLowerCase().replace(/\s+/g, '');
                return cSpecClean === specParam;
            });

            let displaySpecName = "Unspecced";
            if (specRoster.length > 0 && specRoster[0].profile && specRoster[0].profile.active_spec) {
                displaySpecName = specRoster[0].profile.active_spec;
            }
            
            showConciseView(`Guild ${displaySpecName} ${formattedClass}s (${specRoster.length})`, specRoster, false, false);
            updateDropdownLabel('all');
        } else if (hash.startsWith('filter-level-')) {
            const range = hash.replace('filter-level-', '');
            let minLvl = 0, maxLvl = 70;
            if (range === '70') { minLvl = 70; maxLvl = 70; }
            else if (range.includes('-')) {
                const parts = range.split('-');
                minLvl = parseInt(parts[0]);
                maxLvl = parseInt(parts[1]);
            }
            const filteredRoster = rawGuildRoster.filter(c => {
                const lvl = c.level || 0;
                return lvl >= minLvl && lvl <= maxLvl;
            });
            showConciseView(`Level ${range} Characters (${filteredRoster.length})`, filteredRoster, true, true);
            updateDropdownLabel('all');
        } else if (hash.startsWith('filter-ilvl-')) {
            const range = hash.replace('filter-ilvl-', '');
            const filteredRoster = rosterData.filter(c => {
                const p = c.profile;
                if (!p || p.level < 70) return false;
                const ilvl = p.equipped_item_level || 0;
                
                if (range === '<100') return ilvl < 100;
                if (range === '130+') return ilvl >= 130;
                
                const parts = range.split('-');
                if (parts.length === 2) {
                    return ilvl >= parseInt(parts[0]) && ilvl <= parseInt(parts[1]);
                }
                return false;
            });
            showConciseView(`Level 70 Characters iLvl ${range} (${filteredRoster.length})`, filteredRoster, false, true);
            updateDropdownLabel('all');
        } else if (hash.startsWith('filter-race-')) {
            const targetRace = decodeURIComponent(hash.replace('filter-race-', ''));
            const filteredRoster = rosterData.filter(c => {
                const p = c.profile;
                if (p && p.race && p.race.name) {
                    const raceName = typeof p.race.name === 'string' ? p.race.name : (p.race.name.en_US || 'Unknown');
                    return raceName.toLowerCase() === targetRace;
                }
                return false;
            });
            // Capitalize for the nice title string
            const displayRace = targetRace.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            showConciseView(`${displayRace} Characters (${filteredRoster.length})`, filteredRoster, false, true);
            updateDropdownLabel('all');
        } else if (hash.startsWith('filter-role-')) {
            const targetRoleHash = hash.replace('filter-role-', '');
            
            let targetRoleName = "Unknown";
            if (targetRoleHash === "tank") targetRoleName = "Tank";
            else if (targetRoleHash === "healer") targetRoleName = "Healer";
            else if (targetRoleHash === "melee-dps") targetRoleName = "Melee DPS";
            else if (targetRoleHash === "ranged-dps") targetRoleName = "Ranged DPS";

            const filteredRoster = rosterData.filter(c => {
                if (!c.profile || !c.profile.active_spec) return false;
                const spec = c.profile.active_spec;
                const cClass = getCharClass(c);
                let role = "Melee DPS"; 

                if (["Protection", "Blood"].includes(spec) || (cClass === "Druid" && spec === "Feral Combat")) role = "Tank";
                else if (["Holy", "Discipline", "Restoration"].includes(spec)) role = "Healer";
                else if (["Mage", "Warlock", "Hunter"].includes(cClass) || ["Balance", "Elemental", "Shadow"].includes(spec)) role = "Ranged DPS";

                return role === targetRoleName;
            });

            showConciseView(`Raid Role: ${targetRoleName}s (${filteredRoster.length})`, filteredRoster, false, true);
            updateDropdownLabel('all');

        } else if (hash === 'ladder-pve') {
            const sortedPve = [...rosterData].filter(c => c.profile && (c.profile.equipped_item_level || 0) > 0)
                .sort((a, b) => (b.profile.equipped_item_level || 0) - (a.profile.equipped_item_level || 0));
            // Passed 'true' for Badges, and 'ilvl' for the default sort!
            showConciseView(`Full PvE Ladder (${sortedPve.length})`, sortedPve, false, true, 'ilvl');
            updateDropdownLabel('all');
            
        } else if (hash === 'ladder-pvp') {
            const sortedPvp = [...rosterData].filter(c => c.profile && (c.profile.honorable_kills || 0) > 0)
                .sort((a, b) => (b.profile.honorable_kills || 0) - (a.profile.honorable_kills || 0));
            // Passed 'true' for Badges, and 'hks' for the default sort!
            showConciseView(`Full PvP Ladder (${sortedPvp.length})`, sortedPvp, false, true, 'hks');
            updateDropdownLabel('all');
            
        } else if (hash.startsWith('war-effort-')) {
            const type = hash.replace('war-effort-', '');
            
            const realNow = new Date();
            const berlinString = realNow.toLocaleString("en-US", {timeZone: "Europe/Berlin"});
            const berlinNow = new Date(berlinString);
            const lastReset = new Date(berlinNow);
            lastReset.setHours(0, 0, 0, 0);
            let day = lastReset.getDay();
            let diff = (day >= 2) ? (day - 2) : (day + 5); 
            lastReset.setDate(lastReset.getDate() - diff);
            const lastResetMs = lastReset.getTime();

            let filteredRoster = [];
            let title = "";
            window.warEffortContext = {}; // Initialize custom display context
            window.warEffortContextRaw = {}; // Initialize raw values for sorting

            if (type === 'hk') {
                filteredRoster = rosterData.filter(c => c.profile && (c.profile.trend_pvp || c.profile.trend_hks || 0) > 0);
                title = `🩸 Blood of the Enemy Contributors (${filteredRoster.length})`;
                // Note: The 'false' flag here hides the Class Badges
                showConciseView(title, filteredRoster, false, false, 'hks'); 
            } else {
                const contributors = new Set();
                if (typeof timelineData !== 'undefined') {
                    timelineData.forEach(e => {
                        let cleanTs = (e.timestamp || '').replace('Z', '+00:00');
                        if (!cleanTs.includes('+') && !cleanTs.includes('Z')) cleanTs += 'Z';
                        const eventDate = new Date(cleanTs).getTime();
                        if (eventDate >= lastResetMs) {
                            const cName = (e.character_name || '').toLowerCase();
                            
                            if (type === 'xp' && e.type === 'level_up') {
                                contributors.add(cName);
                                window.warEffortContext[cName] = (window.warEffortContext[cName] || 0) + 1;
                            }
                            if (type === 'loot' && e.type === 'item' && (e.item_quality === 'EPIC' || e.item_quality === 'LEGENDARY')) {
                                contributors.add(cName);
                                window.warEffortContext[cName] = window.warEffortContext[cName] || [];
                                const qColor = QUALITY_COLORS[e.item_quality] || '#a335ee';
                                window.warEffortContext[cName].push({ itemId: e.item_id, name: e.item_name, quality: e.item_quality || 'COMMON' });
                            }
                            if (type === 'zenith' && e.type === 'level_up' && e.level === 70) {
                                contributors.add(cName);
                                const dateObj = new Date(cleanTs);
                                const dd = String(dateObj.getDate()).padStart(2, '0');
                                const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                                const yyyy = dateObj.getFullYear();
                                const HH = String(dateObj.getHours()).padStart(2, '0');
                                const MM = String(dateObj.getMinutes()).padStart(2, '0');
                                window.warEffortContext[cName] = `${dd}.${mm}.${yyyy} ${HH}:${MM}`;
                                window.warEffortContextRaw[cName] = dateObj.getTime(); // Store the raw timestamp for perfect sorting!
                            }
                        }
                    });
                }
                filteredRoster = rosterData.filter(c => c.profile && c.profile.name && contributors.has(c.profile.name.toLowerCase()));
                
                if (type === 'xp') title = `🛡️ Hero's Journey Contributors (${filteredRoster.length})`;
                if (type === 'loot') title = `🐉 Dragon's Hoard Contributors (${filteredRoster.length})`;
                if (type === 'zenith') title = `⚡ The Zenith Cohort (${filteredRoster.length})`;
                
                let sortPref = type === 'loot' ? 'ilvl' : 'level';
                // Note: The 'false' flag here hides the Class Badges
                showConciseView(title, filteredRoster, false, false, sortPref); 
            }
            
            // Explicitly hide timeline entirely for these pages
            if (timeline) setHidden(timeline, true);
            
            updateDropdownLabel('all');
            
        } else {
            // Final fallback: Look for a specific character
            const char = rosterData.find(c => c.profile && c.profile.name && c.profile.name.toLowerCase() === hash);
            if (char) {
                showFullCardView(hash);
                updateDropdownLabel(hash);
            } else {
                showHomeView(); 
            }
        }
    }

    // Setup clickable stat boxes safely
    const statTotal = document.getElementById('stat-total');
    if (statTotal) statTotal.addEventListener('click', () => { window.location.hash = 'total'; });

    const statActive = document.getElementById('stat-active');
    if (statActive) statActive.addEventListener('click', () => { window.location.hash = 'active'; });

    const statRaidReady = document.getElementById('stat-raidready');
    if (statRaidReady) statRaidReady.addEventListener('click', () => { window.location.hash = 'raidready'; });

    // 🔥 RESTORED: Dynamic Home Page Class Pop-outs
    document.querySelectorAll('.clickable-class').forEach(badge => {
        badge.addEventListener('click', () => {
            const className = badge.id.replace('stats-', '');
            const formattedClass = className.charAt(0).toUpperCase() + className.slice(1);
            const specContainer = document.getElementById('home-spec-container');
            if (window.activeClassExpanded === className) {
                setHidden(specContainer, true);
                badge.classList.remove('active-filter');
                window.activeClassExpanded = null;
                return;
            }
            document.querySelectorAll('.clickable-class').forEach(b => b.classList.remove('active-filter'));
            badge.classList.add('active-filter');
            window.activeClassExpanded = className;
            const classRosterRaw = rawGuildRoster.filter(c => (c.class || '').toLowerCase() === className);
            const specCounts = {};
            let unspeccedCount = 0;
            classRosterRaw.forEach(rawChar => {
                const fullChar = rosterData.find(c => c.profile && c.profile.name && c.profile.name.toLowerCase() === (rawChar.name || '').toLowerCase());
                const spec = (fullChar && fullChar.profile && fullChar.profile.active_spec) ? fullChar.profile.active_spec : null;
                if (spec) specCounts[spec] = (specCounts[spec] || 0) + 1;
                else unspeccedCount++;
            });
            clearNode(specContainer);
            const wrapDiv = createElement('div', 'class-stat-container spec-filter-wrapper');
            const template = document.getElementById('tpl-home-spec-badge');
            if (template) {
                const addBadge = (hash, label, count, specName = '', useUnknown = false) => {
                    const clone = template.content.cloneNode(true);
                    const btn = clone.querySelector('.spec-btn');
                    const labelSpan = clone.querySelector('.stat-badge-cls');
                    const countSpan = clone.querySelector('.stat-badge-count');
                    btn.setAttribute('data-hash', hash);
                    btn.title = label;
                    if (useUnknown) {
                        btn.classList.add('class-theme-unknown');
                        labelSpan.classList.add('theme-text');
                        labelSpan.textContent = 'Unspecced';
                    } else {
                        applyClassTheme(btn, formattedClass);
                        btn.classList.add('theme-border');
                        labelSpan.classList.add('theme-text');
                        applyClassTheme(labelSpan, formattedClass);
                        if (specName) labelSpan.appendChild(createSpecInline(formattedClass, specName));
                        else labelSpan.textContent = label;
                    }
                    if (!specName && !useUnknown) btn.classList.add('home-spec-badge-all');
                    countSpan.textContent = count;
                    wrapDiv.appendChild(clone);
                };
                addBadge(`class-${className}`, `All ${formattedClass}s`, classRosterRaw.length);
                Object.keys(specCounts).sort().forEach(spec => addBadge(`spec-${className}-${spec.toLowerCase().replace(/\s+/g, '')}`, `View ${spec} ${formattedClass}s`, specCounts[spec], spec));
                if (unspeccedCount > 0) addBadge(`spec-${className}-unspecced`, `View Unspecced ${formattedClass}s`, unspeccedCount, '', true);
            }
            specContainer.appendChild(wrapDiv);
            setDisplayVariant(specContainer, 'block');
            specContainer.querySelectorAll('.spec-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    window.location.hash = btn.getAttribute('data-hash');
                });
            });
        });
    });

    document.addEventListener('mousemove', (e) => {
        const emberContainer = document.querySelector('.embers-container');
        if (emberContainer) {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
            emberContainer.setAttribute('data-parallax-x', xAxis.toFixed(2));
            emberContainer.setAttribute('data-parallax-y', yAxis.toFixed(2));
        }
    });
    
    // ==========================================
    // 🌌 TBC ATMOSPHERE: NETHERSTORM (SPARKS ONLY)
    // ==========================================
    function initAtmosphere() {
        // 1. CANVAS FOR PHYSICS & PARTICLES
        const canvas = document.createElement('canvas');
        canvas.id = 'ember-canvas';
        canvas.className = 'ember-canvas';
        document.body.prepend(canvas);

        const ctx = canvas.getContext('2d');
        let width, height;
        let sparks = [];
        let windTime = 0;
        let windForce = 0;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        let mouse = { x: null, y: null, radius: 150 };
        document.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
        document.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

        // --- CLASS 1: FEL & NETHER SPARKS ---
        class Spark {
            constructor() {
                this.z = Math.random() * 0.8 + 0.2; 
                this.x = Math.random() * width;
                this.y = Math.random() * height + height; 
                this.size = (Math.random() * 2.5 + 1) * this.z; 
                this.speed = (Math.random() * 1.5 + 0.5) * this.z * 1.5; 
                this.angle = Math.random() * 360; 
                this.spin = (Math.random() - 0.5) * 0.05;
                this.opacity = (Math.random() * 0.8 + 0.2) * this.z;

                if (Math.random() > 0.4) {
                    this.coreColor = `rgba(180, 255, 180, ${this.opacity})`; 
                    this.glowColor = '#1eff00'; // Fel Green
                } else {
                    this.coreColor = `rgba(230, 180, 255, ${this.opacity})`; 
                    this.glowColor = '#a335ee'; // Nether Purple
                }
            }
            update() {
                this.y -= this.speed; 
                this.angle += this.spin;
                this.x += (Math.sin(this.angle) * 0.5 + windForce * 2.5) * this.z; 
                
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= (dx / distance) * force * 3 * this.z;
                        this.y -= (dy / distance) * force * 3 * this.z;
                    }
                }
                if (this.y < -20) {
                    this.y = height + 20;
                    this.x = Math.random() * width;
                    this.opacity = (Math.random() * 0.8 + 0.2) * this.z;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.shadowBlur = 12 * this.z; 
                ctx.shadowColor = this.glowColor; 
                ctx.fillStyle = this.coreColor;
                ctx.fill();
                ctx.shadowBlur = 0; 
            }
        }

        // Spawn Sparks
        for (let i = 0; i < 90; i++) sparks.push(new Spark()); 

        function animate() {
            ctx.clearRect(0, 0, width, height);

            windTime += 0.02;
            windForce = (Math.sin(windTime) * 0.5 + Math.sin(windTime * 0.3) * 0.8) * 0.6;

            // Draw Sparks
            for (let i = 0; i < sparks.length; i++) {
                sparks[i].update();
                sparks[i].draw();
            }

            requestAnimationFrame(animate);
        }
        animate();
    }

    initAtmosphere();

    // --- REUSABLE ROLE CHART GENERATOR ---
    function drawRoleChart(ctxId, characters, isRawMode) {
        const roleCounts = { "Tank": 0, "Healer": 0, "Melee DPS": 0, "Ranged DPS": 0 };
        characters.forEach(c => {
            const p = isRawMode ? rosterData.find(deep => deep.profile && deep.profile.name && deep.profile.name.toLowerCase() === (c.name || '').toLowerCase())?.profile : c.profile;
            if (!p || !p.active_spec) return;
            const spec = p.active_spec;
            const cClass = isRawMode ? (c.class || 'Unknown') : getCharClass(c);
            
            if (["Protection", "Blood"].includes(spec) || (cClass === "Druid" && spec === "Feral Combat")) roleCounts["Tank"]++;
            else if (["Holy", "Discipline", "Restoration"].includes(spec)) roleCounts["Healer"]++;
            else if (["Mage", "Warlock", "Hunter"].includes(cClass) || ["Balance", "Elemental", "Shadow"].includes(spec)) roleCounts["Ranged DPS"]++;
            else roleCounts["Melee DPS"]++;
        });

        const ctx = document.getElementById(ctxId);
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(roleCounts),
                datasets: [{ 
                    data: Object.values(roleCounts), 
                    backgroundColor: ['#e74c3c', '#2ecc71', '#e67e22', '#3498db'], 
                    borderColor: '#111', borderWidth: 2 
                }]
            },
            options: { 
                responsive: true, maintainAspectRatio: false, cutout: '60%', layout: { padding: { top: 20, bottom: 20 } },
                plugins: { legend: { position: 'bottom', labels: { color: '#bbb', font: { family: 'Cinzel' } } } },
                onClick: (event, elements, chart) => {
                    if (elements.length > 0) {
                        const clickedLabel = chart.data.labels[elements[0].index];
                        window.location.hash = 'filter-role-' + clickedLabel.toLowerCase().replace(/\s+/g, '-');
                    }
                },
                onHover: (event, elements) => {
                    setChartPointerState(event, elements.length > 0);
                }
            },
            plugins: [createPieOverlayPlugin()]
        });
    }

    function createDonutChart(ctxId, rosterToCount, isRawMode) {
        const counts = {};
        rosterToCount.forEach(char => {
            let cClass = isRawMode ? (char.class || 'Unknown') : getCharClass(char);
            if (cClass !== 'Unknown') counts[cClass] = (counts[cClass] || 0) + 1;
        });

        const sortedClasses = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
        const donutLabels = sortedClasses;
        const donutData = sortedClasses.map(cls => counts[cls]);
        const donutColors = sortedClasses.map(cls => CLASS_COLORS[cls] || '#888');

        const ctx = document.getElementById(ctxId);
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'doughnut',
            data: { labels: donutLabels, datasets: [{ data: donutData, backgroundColor: donutColors, borderColor: '#111', borderWidth: 2, hoverOffset: 6 }] },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '65%',
                onClick: (event, elements, chart) => {
                    if (elements.length > 0) {
                        // Get the name of the class that was clicked (e.g., "Paladin")
                        const clickedClass = chart.data.labels[elements[0].index];
                        const dynamicBadge = document.querySelector(`.dynamic-badge[data-class="${clickedClass}"]`);
                        
                        // If we are on a concise view with the class badges visible, trigger the in-place filter
                        if (dynamicBadge && isElementVisible(document.getElementById('concise-view'))) {
                            dynamicBadge.click(); 
                        } else {
                            // Otherwise (on the Home dashboard), route to the dedicated class roster page
                            window.location.hash = 'class-' + clickedClass.toLowerCase();
                        }
                    }
                },
                onHover: (event, elements) => {
                    // Change cursor to pointer when hovering over a slice
                    setChartPointerState(event, elements.length > 0);
                },
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#bbb', font: { family: 'Cinzel', size: 11 }, padding: 8, boxWidth: 12,
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    return data.labels.map((label, i) => {
                                        const meta = chart.getDatasetMeta(0);
                                        const style = meta.controller.getStyle(i);
                                        const value = data.datasets[0].data[i];
                                        const pct = Math.round((value / total) * 100) + '%';
                                        return {
                                            text: `${label}: ${value} (${pct})`, // Visible Math
                                            fillStyle: style.backgroundColor, strokeStyle: style.borderColor,
                                            lineWidth: style.borderWidth, hidden: isNaN(value) || meta.data[i].hidden, index: i,
                                            fontColor: '#bbb' // Fixes the black text issue
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.9)', titleColor: '#fff', bodyFont: { family: 'Cinzel', size: 14, weight: 'bold' }, borderColor: '#ffd100', borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) label += ': ';
                                if (context.parsed !== null) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const pct = Math.round((context.parsed / total) * 100);
                                    label += context.parsed + ' (' + pct + '%)'; 
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // ==========================================
    // UX ENHANCEMENT: Back to Top Button Logic
    // ==========================================
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (backToTopBtn) {
        // Show button when user scrolls down 400px
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // Smooth scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Also reset focus to the top for Accessibility (a11y)
            document.body.focus();
        });
    }

    let timelineData = [];
    let filteredTimelineData = [];
    let currentTimelineIndex = 0;
    const timelineBatchSize = 50;

    async function fetchTimeline() {
        try {
            const cb = new Date().getTime();
            const response = await fetch(`asset/timeline.json?t=${cb}`);
            timelineData = await response.json();
            
            // --- FIX: Update Epic Loot KPI dynamically after fetch ---
            const kpiEpic = document.getElementById('kpi-epic-loot');
            if (kpiEpic) {
                let epicCount = 0;
                timelineData.forEach(e => {
                    if (e.type === 'item' && (e.item_quality === 'EPIC' || e.item_quality === 'LEGENDARY')) epicCount++;
                });
                kpiEpic.innerText = epicCount;
            }
            
            // Generate War Effort data first, then render the timeline feed
            if (typeof window.renderGuildXPBar === 'function') window.renderGuildXPBar(); 
            applyTimelineFilters();
            
            route();
            
        } catch (error) {
            console.error("Failed to load timeline data:", error);
        }
    }

    function renderTimelineBatch() {
        const container = document.getElementById('timeline-feed-container');
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!container) return;
        const endIndex = Math.min(currentTimelineIndex + timelineBatchSize, filteredTimelineData.length);
        for (let i = currentTimelineIndex; i < endIndex; i++) {
            const event = filteredTimelineData[i];
            const eventEl = createElement('div', 'concise-item tt-char timeline-feed-item');
            bindCharacterSelect(eventEl, (event.character_name || '').toLowerCase());
            eventEl.setAttribute('data-char', (event.character_name || '').toLowerCase());
            eventEl.setAttribute('data-class', event.class || 'Unknown');
            if (event.item_quality) eventEl.setAttribute('data-quality', event.item_quality);
            let dateStr = (event.timestamp || '').substring(0, 10);
            try {
                const cleanTs = (event.timestamp || '').replace('Z', '+00:00');
                const dt = new Date(cleanTs);
                if (!isNaN(dt.getTime())) dateStr = dt.toLocaleString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '');
            } catch (e) {}
            const className = event.class || 'Unknown';
            const charName = (event.character_name || 'Unknown').charAt(0).toUpperCase() + (event.character_name || '').slice(1).toLowerCase();
            applyClassTheme(eventEl, className);
            eventEl.classList.add('theme-border-left');
            if (event.type === 'badge') {
                const template = document.getElementById('tpl-timeline-badge');
                if (template) {
                    const clone = template.content.cloneNode(true);
                    const node = clone.querySelector('.tl-badge-node');
                    const nameSpan = clone.querySelector('.tl-badge-name');
                    const pill = clone.querySelector('.tl-badge-pill');
                    const iconSpan = clone.querySelector('.tl-badge-icon');
                    const textSpan = clone.querySelector('.tl-badge-text');
                    const defs = createAwardDefinitionMap();
                    const def = defs[event.badge_type] || { icon: '🎖️', label: event.badge_type || 'Award' };
                    applyAwardTheme(eventEl, event.badge_type);
                    applyAwardTheme(node, event.badge_type);
                    node.classList.add('theme-award-node');
                    nameSpan.textContent = charName;
                    nameSpan.classList.add('theme-text');
                    applyClassTheme(nameSpan, className);
                    applyAwardTheme(pill, event.badge_type);
                    pill.classList.add('theme-award-pill');
                    iconSpan.textContent = def.icon;
                    applyAwardTheme(iconSpan, event.badge_type);
                    iconSpan.classList.add('theme-award-icon');
                    textSpan.textContent = def.label;
                    applyAwardTheme(textSpan, event.badge_type);
                    textSpan.classList.add('theme-award-text');
                    clone.querySelector('.tl-badge-category').textContent = `• ${event.category || ''}`;
                    clone.querySelector('.tl-badge-date').textContent = dateStr;
                    eventEl.appendChild(clone);
                }
            } else if (event.type === 'level_up') {
                const template = document.getElementById('tpl-timeline-levelup');
                if (template) {
                    const clone = template.content.cloneNode(true);
                    const nameSpan = clone.querySelector('.tl-event-name');
                    nameSpan.textContent = charName;
                    nameSpan.classList.add('theme-text');
                    applyClassTheme(nameSpan, className);
                    clone.querySelector('.tl-event-date').textContent = dateStr;
                    clone.querySelector('.tl-event-level-text').textContent = `Reached Level ${event.level}`;
                    eventEl.appendChild(clone);
                }
            } else {
                const template = document.getElementById('tpl-timeline-loot');
                if (template) {
                    const clone = template.content.cloneNode(true);
                    const node = clone.querySelector('.timeline-node');
                    const nameSpan = clone.querySelector('.tl-event-name');
                    const eventBox = clone.querySelector('.event-box');
                    const itemLink = clone.querySelector('.tl-event-item-link');
                    const quality = event.item_quality || 'COMMON';
                    applyQualityTheme(eventEl, quality);
                    eventEl.classList.add('theme-quality-border-left');
                    applyQualityTheme(node, quality);
                    node.classList.add('theme-quality-node');
                    nameSpan.textContent = charName;
                    nameSpan.classList.add('theme-text');
                    applyClassTheme(nameSpan, className);
                    clone.querySelector('.tl-event-date').textContent = dateStr;
                    applyQualityTheme(eventBox, quality);
                    eventBox.classList.add('theme-quality-border-left');
                    clone.querySelector('.tl-event-icon').src = event.item_icon;
                    itemLink.href = `https://www.wowhead.com/wotlk/item=${event.item_id}`;
                    itemLink.textContent = event.item_name;
                    applyQualityTheme(itemLink, quality);
                    itemLink.classList.add('theme-quality-text');
                    itemLink.addEventListener('click', e => e.stopPropagation());
                    eventEl.appendChild(clone);
                }
            }
            container.appendChild(eventEl);
        }
        currentTimelineIndex = endIndex;
        setDisplayVariant(loadMoreBtn, currentTimelineIndex >= filteredTimelineData.length ? 'none' : 'inline-block');
        if (typeof setupTooltips === 'function') setupTooltips();
    }

    fetchTimeline();
    
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', renderTimelineBatch);
    }

    // --- NEW: Hamburger Menu Logic ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links-container');
    
    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('open');
            navLinksContainer.classList.toggle('open');
        });
        
        document.querySelectorAll('.nav-links-container .nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navLinksContainer.classList.remove('open');
            });
        });
        
        document.addEventListener('click', (e) => {
            if (navLinksContainer.classList.contains('open') && !menuToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
                menuToggle.classList.remove('open');
                navLinksContainer.classList.remove('open');
            }
        });
    }

    // ==========================================
    // ROLLING 7-DAY MVP LOGIC
    // ==========================================
    window.renderMVPs = function() {
        const mvpContainer = document.getElementById('weekly-mvps-container');
        const mvpPveList = document.getElementById('mvp-pve-list');
        const mvpPvpList = document.getElementById('mvp-pvp-list');
        
        if (!mvpContainer || !mvpPveList || !mvpPvpList) return;

        const topTrendPve = [...rosterData]
            .filter(c => c.profile && (c.profile.trend_pve || c.profile.trend_ilvl || 0) > 0)
            .sort((a, b) => (b.profile.trend_pve || b.profile.trend_ilvl || 0) - (a.profile.trend_pve || a.profile.trend_ilvl || 0))
            .slice(0, 3);

        const topTrendPvp = [...rosterData]
            .filter(c => c.profile && (c.profile.trend_pvp || c.profile.trend_hks || 0) > 0)
            .sort((a, b) => (b.profile.trend_pvp || b.profile.trend_hks || 0) - (a.profile.trend_pvp || a.profile.trend_hks || 0))
            .slice(0, 3);

        setDisplayVariant(mvpContainer, 'block');

        function generateMvpHtml(chars, isPvp) {
            if (chars.length === 0) {
                const icon = isPvp ? '⚔️' : '🛡️';
                const action = isPvp ? 'get some HKs' : 'equip some upgrades';
                const template = document.getElementById('tpl-mvp-empty');
                if (!template) return document.createDocumentFragment();
                const clone = template.content.cloneNode(true);
                clone.querySelector('.mvp-empty-icon').textContent = icon;
                clone.querySelector('.mvp-empty-desc').textContent = `Log in and ${action} to claim the #1 spot.`;
                return clone;
            }
            
            const container = document.createElement('div');
            container.className = 'mvp-podium-container';

            chars.forEach((char, index) => {
                const p = char.profile;
                const cClass = getCharClass(char);
                const cHex = CLASS_COLORS[cClass] || '#fff';
                const portraitURL = char.render_url || getClassIcon(cClass);
                const trend = isPvp ? (p.trend_pvp || p.trend_hks || 0) : (p.trend_pve || p.trend_ilvl || 0);
                const label = isPvp ? 'HKs' : 'iLvl';
                const rank = index + 1;
                const stepClass = rank === 1 ? 'podium-step-1' : (rank === 2 ? 'podium-step-2' : 'podium-step-3');
                const rankColor = rank === 1 ? '#ffd100' : (rank === 2 ? '#c0c0c0' : '#cd7f32');
                
                const template = document.getElementById('tpl-mvp-podium-block');
                if (!template) return;
                const clone = template.content.cloneNode(true);
                
                const block = clone.querySelector('.podium-block');
                block.classList.add(stepClass, 'theme-border-top');
                block.setAttribute('data-char', (p.name || '').toLowerCase());
                bindCharacterSelect(block, (p.name || '').toLowerCase());
                applyClassTheme(block, cClass);
                
                if (rank === 1) {
                    const crown = document.createElement('div');
                    crown.className = 'podium-crown';
                    crown.textContent = '👑';
                    block.insertBefore(crown, block.firstChild);
                }
                
                const avatar = clone.querySelector('.podium-avatar');
                avatar.src = portraitURL;
                avatar.classList.add('theme-border');
                applyClassTheme(avatar, cClass);
                
                const rankDiv = clone.querySelector('.podium-rank');
                applyRankTheme(rankDiv, rank);
                rankDiv.textContent = `#${rank}`;
                
                const nameDiv = clone.querySelector('.podium-name');
                nameDiv.classList.add('theme-text');
                applyClassTheme(nameDiv, cClass);
                nameDiv.textContent = p.name;
                
                clone.querySelector('.podium-trend-val').textContent = `▲ ${trend.toLocaleString()}`;
                clone.querySelector('.podium-trend-label').textContent = label;
                
                container.appendChild(clone);
            });

            return container;
        }

        function generateGloatingHtml(mvpData, isPvp) {
            const label = isPvp ? 'HKs' : 'iLvl';
            
            if (!mvpData || !mvpData.name) {
                const template = document.getElementById('tpl-mvp-placeholder');
                if (!template) return document.createDocumentFragment();
                const clone = template.content.cloneNode(true);
                clone.querySelector('.mvp-placeholder-label').textContent = `Last Week's ${label}`;
                return clone;
            }

            const char = rosterData.find(c => c.profile && c.profile.name && c.profile.name.toLowerCase() === mvpData.name.toLowerCase());
            if (!char) return document.createDocumentFragment(); 
            
            const p = char.profile;
            const cClass = getCharClass(char);
            const cHex = CLASS_COLORS[cClass] || '#fff';
            const portraitURL = char.render_url || getClassIcon(cClass);
            
            const template = document.getElementById('tpl-mvp-gloat');
            if (!template) return document.createDocumentFragment();
            const clone = template.content.cloneNode(true);
            
            const img = clone.querySelector('.gloat-avatar');
            img.src = portraitURL;
            bindCharacterSelect(img, p.name.toLowerCase());
            
            const nameSpan = clone.querySelector('.gloat-name');
            nameSpan.textContent = p.name;
            nameSpan.classList.add('theme-text');
            applyClassTheme(nameSpan, cClass);
            bindCharacterSelect(nameSpan, p.name.toLowerCase());
            
            clone.querySelector('.gloat-score').textContent = `+${mvpData.score.toLocaleString()}`;
            clone.querySelector('.gloat-label').textContent = `Last Week's ${label}`;
            
            return clone;
        }

        const prevMvps = config.prev_mvps || {};
        const pveGloat = generateGloatingHtml(prevMvps.pve, false);
        const pvpGloat = generateGloatingHtml(prevMvps.pvp, true);

        mvpPveList.textContent = '';
        mvpPveList.appendChild(pveGloat);
        mvpPveList.appendChild(generateMvpHtml(topTrendPve, false));

        mvpPvpList.textContent = '';
        mvpPvpList.appendChild(pvpGloat);
        mvpPvpList.appendChild(generateMvpHtml(topTrendPvp, true));

        // Re-bind tooltips to the newly injected MVP elements
        if (typeof setupTooltips === 'function') {
            setupTooltips();
        }
    };

    // ==========================================
    // WEEKLY GUILD WAR EFFORT LOGIC
    // ==========================================
    window.renderGuildXPBar = function() {
        const xpContainer = document.getElementById('guild-xp-container');
        if (!xpContainer || !timelineData || timelineData.length === 0) return;

        // --- Live Countdown Timer Logic (Command Ribbon) ---
        if (!window.warEffortTimerInitialized) {
            window.warEffortTimerInitialized = true;
            
            function updateWarEffortCountdown() {
                const realNow = new Date();
                const berlinString = realNow.toLocaleString("en-US", {timeZone: "Europe/Berlin"});
                const berlinNow = new Date(berlinString);
                
                const nextResetBerlin = new Date(berlinNow);
                nextResetBerlin.setHours(0, 0, 0, 0);
                
                let day = nextResetBerlin.getDay();
                let diff = (2 - day + 7) % 7; 
                
                if (diff === 0 && berlinNow > nextResetBerlin) {
                    diff = 7;
                }
                nextResetBerlin.setDate(nextResetBerlin.getDate() + diff);

                const timeLeft = nextResetBerlin - berlinNow;
                
                const d = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const h = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((timeLeft % (1000 * 60)) / 1000);

                const timerEl = document.getElementById('countdown-timer-text');
                if (timerEl) {
                    timerEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
                }
            }
            setInterval(updateWarEffortCountdown, 1000);
            updateWarEffortCountdown();
        }

        // 1. Calculate the Berlin Time Reset Anchor
        const realNow = new Date();
        const berlinString = realNow.toLocaleString("en-US", {timeZone: "Europe/Berlin"});
        const berlinNow = new Date(berlinString);
        
        const lastReset = new Date(berlinNow);
        lastReset.setHours(0, 0, 0, 0);
        let day = lastReset.getDay();
        let diff = (day >= 2) ? (day - 2) : (day + 5); 
        lastReset.setDate(lastReset.getDate() - diff);
        const lastResetMs = lastReset.getTime();

        // 2. Tally Leveling Effort & Zenith (From Timeline)
        let totalLevels = 0;
        let totalZenith = 0;
        const levelContributors = {};
        const zenithContributors = {};
        
        timelineData.forEach(event => {
            if (event.type === 'level_up') {
                let cleanTs = event.timestamp.replace('Z', '+00:00');
                if (!cleanTs.includes('+') && !cleanTs.includes('Z')) cleanTs += 'Z';
                const eventDate = new Date(cleanTs).getTime();
                
                if (eventDate >= lastResetMs) {
                    totalLevels++;
                    const charName = event.character_name || 'Unknown';
                    levelContributors[charName] = (levelContributors[charName] || 0) + 1;
                    
                    if (event.level === 70) {
                        totalZenith++;
                        zenithContributors[charName] = (zenithContributors[charName] || 0) + 1;
                    }
                }
            }
        });

        // 3. Tally PvP Effort (From 7-Day Roster Trends)
        let totalHks = 0;
        const hkContributors = {};
        rosterData.forEach(c => {
            if (c.profile) {
                const trend = c.profile.trend_pvp || c.profile.trend_hks || 0;
                if (trend > 0) {
                    totalHks += trend;
                    const charName = c.profile.name || 'Unknown';
                    hkContributors[charName] = trend;
                }
            }
        });

        // 3b. Tally Dragon's Hoard (Epic Loot from Timeline)
        let totalLoot = 0;
        const lootContributors = {};
        timelineData.forEach(event => {
            if (event.type === 'item' && (event.item_quality === 'EPIC' || event.item_quality === 'LEGENDARY')) {
                let cleanTs = event.timestamp.replace('Z', '+00:00');
                if (!cleanTs.includes('+') && !cleanTs.includes('Z')) cleanTs += 'Z';
                const eventDate = new Date(cleanTs).getTime();
                
                if (eventDate >= lastResetMs) {
                    totalLoot++;
                    const charName = event.character_name || 'Unknown';
                    lootContributors[charName] = (lootContributors[charName] || 0) + 1;
                }
            }
        });

        // 5. Render the Bars
        function renderBar(fillId, textId, currentVal, maxVal, type) {
            const pct = Math.min((currentVal / maxVal) * 100, 100);
            const fillEl = document.getElementById(fillId);
            const textEl = document.getElementById(textId);
            const labelMap = { XP: 'Levels', HK: 'HKs', LOOT: 'Epics', ZENITH: 'Max Levels' };
            const accentMap = { XP: 'gold', HK: 'red', LOOT: 'purple', ZENITH: 'cyan' };
            if (fillEl && fillEl.parentElement) {
                const newFill = createProgressFill(pct, type);
                newFill.id = fillId;
                fillEl.parentElement.replaceChild(newFill, fillEl);
            }
            if (textEl) {
                textEl.textContent = '';
                textEl.className = pct >= 100 ? 'challenge-text we-text-state-max' : 'challenge-text we-text-state-normal';
                if (pct >= 100) {
                    applyAccentTheme(textEl, accentMap[type] || 'gold');
                    textEl.classList.add('theme-accent-text');
                }
                const labelSpan = createElement('span', 'we-text-label', `${labelMap[type] || type}:`);
                const valSpan = createElement('span', 'we-text-values', `${currentVal.toLocaleString()} / ${maxVal.toLocaleString()}`);
                textEl.appendChild(labelSpan);
                textEl.appendChild(valSpan);
                if (pct >= 100) {
                    const crushSpan = createElement('span', 'we-text-crushed', '🔥 CRUSHED!');
                    applyAccentTheme(crushSpan, accentMap[type] || 'gold');
                    crushSpan.classList.add('theme-accent-shadow');
                    textEl.appendChild(crushSpan);
                }
            }
        }

        renderBar('guild-xp-fill', 'guild-xp-text', totalLevels, 750, 'XP');
        renderBar('guild-hk-fill', 'guild-hk-text', totalHks, 500, 'HK');
        renderBar('guild-loot-fill', 'guild-loot-text', totalLoot, 60, 'LOOT');
        renderBar('guild-zenith-fill', 'guild-zenith-text', totalZenith, 10, 'ZENITH');

        // --- NEW: VANGUARD AURA & TIMELINE MONUMENT CALCULATION ---
        window.warEffortVanguards = { xp: [], hk: [], loot: [], zenith: [] };
        window.warEffortMonuments = [];
        window.warEffortLockTimes = {}; // <-- NEW: Store the exact time it locked

        function applyLockFallback(type, fallbackMon, dynVanguards) {
            if (warEffortLocks[type]) {
                window.warEffortVanguards[type] = warEffortLocks[type].vanguards;
                window.warEffortMonuments.push(warEffortLocks[type].monument);
                window.warEffortLockTimes[type] = warEffortLocks[type].monument.timestamp;
            } else if (fallbackMon) {
                window.warEffortVanguards[type] = dynVanguards;
                window.warEffortMonuments.push(fallbackMon);
                window.warEffortLockTimes[type] = fallbackMon.timestamp;
            }
        }

        if (totalLevels >= 750) {
            const topDyn = Object.entries(levelContributors).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0].toLowerCase());
            let fallback = null;
            const sortedXP = timelineData.filter(e => e.type === 'level_up' && new Date((e.timestamp || '').replace('Z', '+00:00')).getTime() >= lastResetMs).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            if (sortedXP[749]) fallback = { title: "🛡️ Hero's Journey", highlightColor: "#ffd100", highlightText: sortedXP[749].character_name, suffixText: " hit the 750th level!", timestamp: sortedXP[749].timestamp };
            applyLockFallback('xp', fallback, topDyn);
        }

        if (totalHks >= 500) {
            const topPvpers = Object.entries(hkContributors).sort((a,b)=>b[1]-a[1]);
            const topDyn = topPvpers.slice(0,3).map(x=>x[0].toLowerCase());
            let fallback = null;
            if (topPvpers.length > 0) fallback = { title: "🩸 Blood of the Enemy", highlightColor: "#ff4400", highlightText: topPvpers[0][0].charAt(0).toUpperCase() + topPvpers[0][0].slice(1), suffixText: " led the 500 HK charge!", timestamp: new Date().toISOString() };
            applyLockFallback('hk', fallback, topDyn);
        }

        if (totalLoot >= 60) {
            const topDyn = Object.entries(lootContributors).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0].toLowerCase());
            let fallback = null;
            const sortedLoot = timelineData.filter(e => e.type === 'item' && (e.item_quality === 'EPIC' || e.item_quality === 'LEGENDARY') && new Date((e.timestamp || '').replace('Z', '+00:00')).getTime() >= lastResetMs).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            if (sortedLoot[49]) fallback = { title: "🐉 Dragon's Hoard", highlightColor: "#a335ee", highlightText: sortedLoot[49].character_name, suffixText: " looted the 60th Epic!", timestamp: sortedLoot[49].timestamp };
            applyLockFallback('loot', fallback, topDyn);
        }

        if (totalZenith >= 10) {
            const sortedZenithAsc = timelineData.filter(e => e.type === 'level_up' && e.level === 70 && new Date((e.timestamp || '').replace('Z', '+00:00')).getTime() >= lastResetMs).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            const uniqueZ = [];
            sortedZenithAsc.forEach(e => {
                const n = (e.character_name || '').toLowerCase();
                if(n && !uniqueZ.includes(n)) uniqueZ.push(n);
            });
            
            const topDyn = uniqueZ.slice(0,3);
            let fallback = null;
            if (uniqueZ[9]) fallback = { title: "⚡ The Zenith Cohort", highlightColor: "#3FC7EB", highlightText: uniqueZ[9].charAt(0).toUpperCase() + uniqueZ[9].slice(1), suffixText: " was the 10th Level 70!", timestamp: new Date().toISOString() };
            applyLockFallback('zenith', fallback, topDyn);
        }

        if (totalLevels >= 750 && totalHks >= 500 && totalLoot >= 60 && totalZenith >= 10) {
            const lockTimes = [
                new Date(window.warEffortLockTimes.xp).getTime(),
                new Date(window.warEffortLockTimes.hk).getTime(),
                new Date(window.warEffortLockTimes.loot).getTime(),
                new Date(window.warEffortLockTimes.zenith).getTime()
            ];
            const flawlessCompletionTime = new Date(Math.max(...lockTimes));
            
            const weekStart = new Date(lastResetMs).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });

            window.warEffortMonuments.push({
                title: "🌟 FLAWLESS VICTORY",
                highlightColor: "#ffd100", highlightText: `The guild crushed ALL FOUR War Efforts for the week of ${weekStart}!`, suffixText: " Glory to Azeroth's Most Wanted!",
                timestamp: flawlessCompletionTime.toISOString()
            });
        }
        
        // --- NEW: COMPACT MONUMENTS GRID FEED ---
        const timelineEl = document.getElementById('timeline');
        if (timelineEl) {
            let monContainer = document.getElementById('monuments-container');
            if (!monContainer) {
                monContainer = document.createElement('div');
                monContainer.id = 'monuments-container';
                monContainer.className = 'monuments-grid';
                const filtersEl = timelineEl.querySelector('.timeline-filters');
                if (filtersEl) timelineEl.insertBefore(monContainer, filtersEl);
                else timelineEl.prepend(monContainer);
            }
            clearNode(monContainer);
            if (window.warEffortMonuments.length > 0) {
                window.warEffortMonuments.forEach(mon => {
                    const eventEl = createElement('div', 'monument-card');
                    const dt = new Date(mon.timestamp);
                    const timeStr = isNaN(dt) ? '' : dt.toLocaleString('en-GB', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:false}).replace(',', '');
                    const template = document.getElementById('tpl-monument-card');
                    if (template) {
                        const clone = template.content.cloneNode(true);
                        clone.querySelector('.mon-title-text').textContent = mon.title;
                        clone.querySelector('.mon-time-text').textContent = timeStr;
                        const descContainer = clone.querySelector('.mon-desc-text');
                        descContainer.textContent = '';
                        if (mon.highlightText) {
                            if (mon.prefixText) descContainer.appendChild(document.createTextNode(mon.prefixText));
                            const hlSpan = createElement('span', 'monument-highlight-span');
                            applyMonumentHighlightTheme(hlSpan, mon.highlightColor);
                            hlSpan.classList.add('theme-accent-text');
                            hlSpan.textContent = mon.highlightText;
                            descContainer.appendChild(hlSpan);
                            if (mon.suffixText) descContainer.appendChild(document.createTextNode(mon.suffixText));
                        } else {
                            descContainer.textContent = mon.desc || '';
                        }
                        eventEl.appendChild(clone);
                    }
                    monContainer.appendChild(eventEl);
                });
            }
        }

        function bindTooltip(triggerId, contributorsDict, titleText, labelText) {
            const tooltipTrigger = document.getElementById(triggerId);
            if (!tooltipTrigger) return;
            const sortedContributors = Object.entries(contributorsDict).sort((a, b) => b[1] - a[1]);
            const newTrigger = tooltipTrigger.cloneNode(true);
            tooltipTrigger.parentNode.replaceChild(newTrigger, tooltipTrigger);
            newTrigger.addEventListener('mouseenter', () => {
                const tooltipRoot = createElement('div', 'custom-tooltip visible war-effort-tooltip');
                tooltipRoot.appendChild(createElement('div', 'we-tt-header', titleText));
                if (sortedContributors.length === 0) {
                    tooltipRoot.appendChild(createElement('div', 'we-tt-empty', 'The challenges just began!'));
                } else {
                    sortedContributors.slice(0, 15).forEach(([name, count], index) => {
                        const charData = rosterData.find(c => c.profile && c.profile.name && c.profile.name.toLowerCase() === name.toLowerCase());
                        const className = charData ? getCharClass(charData) : 'Unknown';
                        const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                        const row = createElement('div', 'we-tt-row');
                        const nameSpan = createElement('span', 'theme-text', `${index + 1}. ${formattedName}`);
                        applyClassTheme(nameSpan, className);
                        row.appendChild(nameSpan);
                        row.appendChild(createElement('span', 'we-tt-score', `+${count.toLocaleString()}`));
                        tooltipRoot.appendChild(row);
                    });
                    if (sortedContributors.length > 15) {
                        const remaining = sortedContributors.slice(15).reduce((sum, [_, count]) => sum + count, 0);
                        tooltipRoot.appendChild(createElement('div', 'we-tt-footer', `...and +${remaining.toLocaleString()} more ${labelText}!`));
                    }
                }
                createInlineTooltipHost(newTrigger, tooltipRoot);
            });
            newTrigger.addEventListener('mouseleave', () => removeInlineTooltipHost(newTrigger));
            newTrigger.addEventListener('click', e => {
                e.stopPropagation();
                removeInlineTooltipHost(newTrigger);
                if (triggerId === 'guild-xp-tooltip-trigger') window.location.hash = 'war-effort-xp';
                else if (triggerId === 'guild-hk-tooltip-trigger') window.location.hash = 'war-effort-hk';
                else if (triggerId === 'guild-loot-tooltip-trigger') window.location.hash = 'war-effort-loot';
                else if (triggerId === 'guild-zenith-tooltip-trigger') window.location.hash = 'war-effort-zenith';
            });
        }

        bindTooltip('guild-xp-tooltip-trigger', levelContributors, "Top Leveling Heroes", "levels");
        bindTooltip('guild-hk-tooltip-trigger', hkContributors, "Top PvP Slayers", "HKs");
        bindTooltip('guild-loot-tooltip-trigger', lootContributors, "Top Treasure Hunters", "Epics");
        bindTooltip('guild-zenith-tooltip-trigger', zenithContributors, "The Zenith Cohort", "Max Levels");
    };

    window.addEventListener('hashchange', route);
}
});
