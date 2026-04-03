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

function appendConciseBadges(container, badgeConfigs) {
    if (!container || !badgeConfigs || badgeConfigs.length === 0) return;

    const wrapperTemplate = document.getElementById('tpl-concise-badges-wrapper');
    const pillTemplate = document.getElementById('tpl-concise-badge-pill');
    const reigningTemplate = document.getElementById('tpl-concise-badge-reigning');

    if (!wrapperTemplate || !pillTemplate || !reigningTemplate) return;

    const wrapperClone = wrapperTemplate.content.cloneNode(true);
    const wrapper = wrapperClone.querySelector('.c-badges-wrapper');

    badgeConfigs.forEach(({ text, title = '', classNames = [] }) => {
        const isReigning = classNames.includes('c-badge-reigning');
        const badgeTemplate = isReigning ? reigningTemplate : pillTemplate;
        const badgeClone = badgeTemplate.content.cloneNode(true);
        const badgeEl = badgeClone.querySelector(isReigning ? '.c-badge-reigning' : '.c-badge-pill');

        classNames.forEach(cls => badgeEl.classList.add(cls));
        badgeEl.textContent = text;
        if (title) badgeEl.title = title;

        wrapper.appendChild(badgeClone);
    });

    container.appendChild(wrapperClone);
}

function appendConciseMeta(container, { raceName, specIconUrl, displaySpecClass, isClickable }) {
    if (!container) return;

    container.textContent = '';

    if (!isClickable) {
        container.textContent = `${raceName} ${displaySpecClass}`;
        return;
    }

    container.appendChild(document.createTextNode(`${raceName} • `));

    if (specIconUrl) {
        const specIconTemplate = document.getElementById('tpl-concise-spec-icon');
        if (specIconTemplate) {
            const specClone = specIconTemplate.content.cloneNode(true);
            const specImg = specClone.querySelector('.concise-spec-icon');
            specImg.src = specIconUrl;
            container.appendChild(specClone);
        }
    }

    container.appendChild(document.createTextNode(displaySpecClass));
}

function buildConciseTrendHtml(trend) {
    const template = document.getElementById('tpl-concise-trend-indicator');
    if (!template) return null;

    const clone = template.content.cloneNode(true);
    const trendEl = clone.querySelector('.trend-indicator-concise');
    if (!trendEl) return null;

    if (trend > 0) {
        trendEl.classList.add('trend-positive');
        trendEl.textContent = `▲ ${trend}`;
    } else if (trend < 0) {
        trendEl.classList.add('trend-negative');
        trendEl.textContent = `▼ ${Math.abs(trend)}`;
    } else {
        trendEl.classList.add('trend-neutral');
        trendEl.textContent = '-';
    }

    const rootEl = clone.firstElementChild;
    return rootEl || null;
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
    
        if (conciseList) {
        conciseList.addEventListener('click', (e) => {
            if (e.target.closest('.we-loot-link')) return;

            const trigger = e.target.closest('.concise-char-bar.tt-char[data-char], .podium-block.tt-char[data-char]');
            if (!trigger) return;

            const charName = trigger.getAttribute('data-char');
            if (charName) {
                selectCharacter(charName);
            }
        });

        conciseList.addEventListener('error', (e) => {
            const img = e.target;
            if (img instanceof HTMLImageElement && img.classList.contains('c-portrait')) {
                img.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
            }
        }, true);
    }

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

    function appendCharacterSearchResult(targetEl, char, options = {}) {
        const { forceObjectFitCover = false } = options;
        const template = document.getElementById('tpl-hero-search-result');
        if (!template || !targetEl || !char || !char.profile || !char.profile.name) return;

        const cClass = getCharClass(char);
        const cHex = CLASS_COLORS[cClass] || '#fff';
        const clone = template.content.cloneNode(true);

        const itemDiv = clone.querySelector('.hero-ac-item');
        itemDiv.style.setProperty('--hero-ac-accent', cHex);
        itemDiv.addEventListener('click', () => selectCharacter(char.profile.name.toLowerCase()));

        const img = clone.querySelector('.hero-ac-icon');
        img.src = char.render_url || getClassIcon(cClass);
        if (forceObjectFitCover) {
            img.classList.add('hero-ac-icon-cover');
        }

        const nameSpan = clone.querySelector('.hero-ac-name');
        nameSpan.textContent = char.profile.name;

        const metaSpan = clone.querySelector('.ac-meta');
        metaSpan.textContent = `Level ${char.profile.level} ${cClass}`;

        targetEl.appendChild(clone);
    }

    function findCharactersByName(query, limit) {
        const normalizedQuery = (query || '').toLowerCase().trim();
        if (normalizedQuery === '') return [];

        const matches = rosterData.filter(c =>
            c.profile &&
            c.profile.name &&
            c.profile.name.toLowerCase().includes(normalizedQuery)
        );

        return typeof limit === 'number' ? matches.slice(0, limit) : matches;
    }

    function navigateToFirstMatchingCharacter(query) {
        const results = findCharactersByName(query);
        if (results.length > 0) {
            window.location.hash = results[0].profile.name.toLowerCase();
        }
    }

    const searchInput = document.getElementById('charSearch');
    const searchAutoComplete = document.getElementById('search-autocomplete');
    
    const heroSearchInput = document.getElementById('heroCharSearch');
    const heroSearchAutoComplete = document.getElementById('hero-search-autocomplete');
    
    if (heroSearchInput) {
        heroSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query === '') { heroSearchAutoComplete.classList.remove('show'); return; }
            const results = findCharactersByName(query, 6);
            if (results.length > 0) {
                heroSearchAutoComplete.textContent = '';
                results.forEach(c => {
                    appendCharacterSearchResult(heroSearchAutoComplete, c);
                });
                heroSearchAutoComplete.classList.add('show');
            } else {
                heroSearchAutoComplete.classList.remove('show');
            }
        });
        heroSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                navigateToFirstMatchingCharacter(e.target.value);
            }
        });
    }

    // NEW: Force mobile keyboards to open when tapping the collapsed search icon
    const searchBox = document.querySelector('.search-box');
    if (searchBox && searchInput) {
        searchBox.addEventListener('click', () => {
            searchInput.focus();
        });
    }
    
    const customSelect = document.getElementById('customCharSelect');
    const customOptions = document.getElementById('customCharOptions');
    const selectValueText = customSelect ? customSelect.querySelector('.selected-value') : null;

    if (customSelect) {
        customSelect.addEventListener('click', (e) => {
            e.stopPropagation();
            customOptions.classList.toggle('show');
            customSelect.classList.toggle('active');
            if (searchAutoComplete) searchAutoComplete.classList.remove('show');
        });
    }

    document.querySelectorAll('.custom-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const val = opt.getAttribute('data-value');
            window.location.hash = val;
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query === '') {
                searchAutoComplete.classList.remove('show');
                return;
            }
            
            const results = findCharactersByName(query, 8);
            
            if (results.length > 0) {
                searchAutoComplete.textContent = '';
                results.forEach(c => {
                    appendCharacterSearchResult(searchAutoComplete, c, { forceObjectFitCover: true });
                });
                searchAutoComplete.classList.add('show');
            } else {
                searchAutoComplete.textContent = '';
                const emptyTemplate = document.getElementById('tpl-ac-empty-state');
                if (emptyTemplate) {
                    searchAutoComplete.appendChild(emptyTemplate.content.cloneNode(true));
                }
                searchAutoComplete.classList.add('show');
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                navigateToFirstMatchingCharacter(e.target.value);
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (customOptions) customOptions.classList.remove('show');
        if (customSelect) customSelect.classList.remove('active');
        if (searchAutoComplete) searchAutoComplete.classList.remove('show');

        if (e.target && e.target.classList && e.target.classList.contains('toggle-stats-btn')) {
            const btn = e.target;
            const p = btn.closest('.info-box');
            if (p) {
                const p1 = p.querySelector('.stat-page-1');
                const p2 = p.querySelector('.stat-page-2');
                const title = p.querySelector('.stat-card-title');
                if (p1 && p2 && title) {
                    const showingWeaponPage = p1.classList.contains('is-hidden');

                    if (showingWeaponPage) {
                        p1.classList.remove('is-hidden');
                        p2.classList.add('is-hidden');
                        title.innerText = 'Combat Stats';
                        btn.innerText = '▶';
                    } else {
                        p1.classList.add('is-hidden');
                        p2.classList.remove('is-hidden');
                        title.innerText = 'Weapon & Gear';
                        btn.innerText = '◀';
                    }
                }
            }
        }
    });
    
    function updateDropdownLabel(ignoreVal) {
        if (!selectValueText) return;

        selectValueText.className = 'selected-value';
        selectValueText.style.removeProperty('--selected-char-color');
        
        // Smarter logic: Read the actual active URL hash to determine the label
        const hash = window.location.hash.substring(1); 
        
        if (hash === '') {
            selectValueText.innerHTML = "Select View...";
        } else if (hash === 'all' || hash === 'total') {
            selectValueText.innerHTML = "🌍 Entire Guild";
        } else if (hash === 'active') {
            selectValueText.innerHTML = "🔥 Active Roster";
        } else if (hash === 'raidready') {
            selectValueText.innerHTML = "⚔️ Raid Ready";
        } else if (hash === 'analytics') {
            selectValueText.innerHTML = "📊 Analytics";
        } else if (hash === 'architecture') {
            selectValueText.innerHTML = "⚙️ Architecture";
        } else if (hash === 'badges') {
            selectValueText.innerHTML = "🌟 Hall of Heroes";
        } else if (hash.startsWith('class-') || hash.startsWith('spec-') || hash.startsWith('filter-')) {
            selectValueText.innerHTML = "⚡ Filter Active";
        } else {
            // It's a specific character
            const char = rosterData.find(c => c.profile && c.profile.name && c.profile.name.toLowerCase() === hash);
            if (char) {
                const cClass = getCharClass(char);
                const cHex = CLASS_COLORS[cClass] || '#fff';
                selectValueText.textContent = char.profile.name;
                selectValueText.className = 'selected-value char-selected-text';
                selectValueText.style.setProperty('--selected-char-color', cHex);
            } else {
                selectValueText.innerHTML = "Select View...";
            }
        }
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
            cell.addEventListener('click', function() {
                const rawDate = this.getAttribute('data-rawdate');
                if (tlSpecificDate === rawDate) {
                    tlSpecificDate = null;
                    this.classList.remove('selected-date');
                } else {
                    tlSpecificDate = rawDate;
                    document.querySelectorAll('.tt-heatmap').forEach(c => c.classList.remove('selected-date'));
                    this.classList.add('selected-date');
                }
                applyTimelineFilters();
            });

            cell.addEventListener('mousemove', e => {
                const count = cell.getAttribute('data-count');
                const dateStr = cell.getAttribute('data-date');
                const color = count > 0 ? '#ffd100' : '#888';
                
                tooltip.textContent = '';
                const tooltipTemplate = document.getElementById('tpl-heatmap-tooltip');
                if (tooltipTemplate) {
                    const clone = tooltipTemplate.content.cloneNode(true);
                    
                    const activityDiv = clone.querySelector('.tooltip-activity');
                    activityDiv.textContent = `${count} Activities`;
                    
                    const dateDiv = clone.querySelector('.tooltip-date');
                    dateDiv.textContent = dateStr;
                    
                    tooltip.appendChild(clone);
                }

                tooltip.style.setProperty('--heatmap-tooltip-accent', color);
                
                let x = e.clientX + 15;
                let y = e.clientY + 15;
                
                if (x + 200 > window.innerWidth) {
                    x = window.innerWidth - 210;
                }
                
                tooltip.style.left = `${x}px`; tooltip.style.top = `${y}px`;
                tooltip.classList.add('visible');
            });
            cell.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });
        });
    }

    function buildSmallSpecIconNode({ src, alt = '' }) {
        const template = document.getElementById('tpl-spec-icon-sm');
        if (!template) return null;

        const clone = template.content.cloneNode(true);
        const img = clone.querySelector('.spec-icon-sm');

        if (img) {
            img.src = src;
            img.alt = alt;
        }

        return clone.firstElementChild || null;
    }

    function createTrendSpan(trend, variant = 'default') {
        const templateId = variant === 'podium'
            ? 'tpl-podium-trend-indicator'
            : 'tpl-trend-indicator';

        const template = document.getElementById(templateId);
        if (!template) return document.createElement('span');

        const clone = template.content.cloneNode(true);
        const span = clone.firstElementChild;

        if (!span) return document.createElement('span');

        if (variant === 'podium') {
            if (trend > 0) {
                span.classList.add('podium-trend-positive');
                span.textContent = `▲ ${trend}`;
            } else if (trend < 0) {
                span.classList.add('podium-trend-negative');
                span.textContent = `▼ ${Math.abs(trend)}`;
            } else {
                span.classList.add('podium-trend-neutral');
                span.textContent = '-';
            }
        } else {
            if (trend > 0) {
                span.classList.add('trend-positive');
                span.textContent = `▲ ${trend}`;
            } else if (trend < 0) {
                span.classList.add('trend-negative');
                span.textContent = `▼ ${Math.abs(trend)}`;
            } else {
                span.classList.add('trend-neutral');
                span.textContent = '-';
            }
        }

        return span;
    }

    const pveContainer = document.getElementById('pve-leaderboard');
    const pveWrapper = document.getElementById('pve-leaderboard-container');

    const topPve = rosterData
        .filter(c => c.profile && (c.profile.equipped_item_level || 0) > 0)
        .sort((a, b) => (b.profile.equipped_item_level || 0) - (a.profile.equipped_item_level || 0))
        .slice(0, 25);

    if (topPve.length > 0 && pveContainer) {
        if (pveWrapper) pveWrapper.hidden = false;
        pveContainer.textContent = '';

        const podiumWrapTemplate = document.getElementById('tpl-home-leaderboard-podium-wrap');
        const listWrapTemplate = document.getElementById('tpl-home-leaderboard-list-wrap');

        const podiumWrap = podiumWrapTemplate?.content?.firstElementChild?.cloneNode(true);
        const listWrap = listWrapTemplate?.content?.firstElementChild?.cloneNode(true);

        if (!podiumWrap || !listWrap) return;

        const podiumTemplate = document.getElementById('tpl-home-leaderboard-podium');
        const rowTemplate = document.getElementById('tpl-home-leaderboard-row');

        topPve.forEach((char, index) => {
            const p = char.profile;
            const cClass = getCharClass(char);
            const cHex = CLASS_COLORS[cClass] || '#fff';
            const activeSpec = p.active_spec ? p.active_spec : '';
            const specIconUrl = getSpecIcon(cClass, activeSpec);
            const displaySpecClass = activeSpec ? `${activeSpec} ${cClass}` : cClass;
            const portraitURL = char.render_url || getClassIcon(cClass);
            const trend = p.trend_pve || p.trend_ilvl || 0;
            const cleanName = (p.name || '').toLowerCase();

            if (index < 3 && podiumTemplate) {
                const rank = index + 1;
                const stepClass = rank === 1 ? 'podium-step-1' : (rank === 2 ? 'podium-step-2' : 'podium-step-3');
                const clone = podiumTemplate.content.cloneNode(true);

                const block = clone.querySelector('.podium-block');
                block.classList.add(stepClass);
                block.setAttribute('data-char', cleanName);
                block.addEventListener('click', () => selectCharacter(cleanName));
                block.style.borderTopColor = cHex;

                const crown = clone.querySelector('.podium-crown');
                if (rank === 1) {
                    crown.hidden = false;
                } else {
                    crown.hidden = true;
                }

                const avatar = clone.querySelector('.podium-avatar');
                avatar.src = portraitURL;
                avatar.alt = p.name || 'Character portrait';
                avatar.style.borderColor = cHex;

                const rankEl = clone.querySelector('.podium-rank');
                rankEl.textContent = `#${rank}`;

                const nameEl = clone.querySelector('.podium-name');
                nameEl.textContent = p.name;
                nameEl.style.color = cHex;

                const statValEl = clone.querySelector('.podium-stat-val');
                statValEl.textContent = p.equipped_item_level || 0;
                statValEl.classList.add('text-ilvl');

                const statLabelEl = clone.querySelector('.podium-stat-lbl');
                statLabelEl.textContent = 'iLvl';

                const trendContainer = clone.querySelector('.podium-trend-container');
                trendContainer.appendChild(createTrendSpan(trend, 'podium'));

                podiumWrap.appendChild(clone);
            } else if (rowTemplate) {
                const clone = rowTemplate.content.cloneNode(true);

                const row = clone.querySelector('.leaderboard-row');
                row.setAttribute('data-char', cleanName);
                row.addEventListener('click', () => selectCharacter(cleanName));
                row.style.borderLeftColor = cHex;

                const rankEl = clone.querySelector('.lb-rank');
                rankEl.textContent = `#${index + 1}`;

                const portraitEl = clone.querySelector('.lb-portrait');
                portraitEl.src = portraitURL;
                portraitEl.alt = p.name || 'Character portrait';
                portraitEl.style.borderColor = cHex;

                const nameEl = clone.querySelector('.lb-name');
                nameEl.textContent = p.name;
                nameEl.style.color = cHex;

                const specEl = clone.querySelector('.lb-spec');
                specEl.textContent = displaySpecClass;
                if (specIconUrl) {
                    const specIconEl = buildSmallSpecIconNode({
                        src: specIconUrl,
                        alt: `${displaySpecClass} icon`
                    });
                    if (specIconEl) {
                        specEl.prepend(specIconEl);
                    }
                }

                const scoreEl = clone.querySelector('.lb-score');
                scoreEl.classList.add('pve-score');

                const scoreValueEl = clone.querySelector('.lb-score-value');
                scoreValueEl.textContent = p.equipped_item_level || 0;

                const scoreLabelEl = clone.querySelector('.lb-score-label');
                scoreLabelEl.textContent = 'iLvl';

                scoreEl.appendChild(createTrendSpan(trend));

                listWrap.appendChild(clone);
            }
        });

        pveContainer.appendChild(podiumWrap);
        pveContainer.appendChild(listWrap);

        if (topPve.length > 5) {
            const expandBtnTemplate = document.getElementById('tpl-home-leaderboard-expand-btn');
            const btn = expandBtnTemplate?.content?.firstElementChild?.cloneNode(true);

            if (btn) {
                btn.addEventListener('click', function() {
                    const listWrapEl = this.previousElementSibling;
                    if (listWrapEl) listWrapEl.classList.toggle('collapsed-list');
                    this.textContent = this.textContent.includes('▼') ? 'Collapse Leaderboard ▲' : 'Show Top 25 ▼';
                });
                pveContainer.appendChild(btn);
            }
        }
    }

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
        .slice(0, 25); // Changed to Top 25

    if (topPvp.length > 0 && pvpContainer) {
        if (pvpWrapper) pvpWrapper.hidden = false;
        pvpContainer.textContent = '';

        const podiumWrapTemplate = document.getElementById('tpl-home-leaderboard-podium-wrap');
        const listWrapTemplate = document.getElementById('tpl-home-leaderboard-list-wrap');

        const podiumWrap = podiumWrapTemplate?.content?.firstElementChild?.cloneNode(true);
        const listWrap = listWrapTemplate?.content?.firstElementChild?.cloneNode(true);

        if (!podiumWrap || !listWrap) return;

        const podiumTemplate = document.getElementById('tpl-home-leaderboard-podium');
        const rowTemplate = document.getElementById('tpl-home-leaderboard-row');

        topPvp.forEach((char, index) => {
            const p = char.profile;
            const cClass = getCharClass(char);
            const cHex = CLASS_COLORS[cClass] || '#fff';
            const activeSpec = p.active_spec ? p.active_spec : '';
            const specIconUrl = getSpecIcon(cClass, activeSpec);
            const displaySpecClass = activeSpec ? `${activeSpec} ${cClass}` : cClass;
            const hkCount = (p.honorable_kills || 0).toLocaleString();
            const portraitURL = char.render_url || getClassIcon(cClass);
            const trend = p.trend_pvp || 0;
            const cleanName = (p.name || '').toLowerCase();

            if (index < 3 && podiumTemplate) {
                const rank = index + 1;
                const stepClass = rank === 1 ? 'podium-step-1' : (rank === 2 ? 'podium-step-2' : 'podium-step-3');
                const clone = podiumTemplate.content.cloneNode(true);

                const block = clone.querySelector('.podium-block');
                block.classList.add(stepClass);
                block.setAttribute('data-char', cleanName);
                block.addEventListener('click', () => selectCharacter(cleanName));
                block.style.borderTopColor = cHex;

                const crown = clone.querySelector('.podium-crown');
                if (rank === 1) {
                    crown.hidden = false;
                } else {
                    crown.hidden = true;
                }

                const avatar = clone.querySelector('.podium-avatar');
                avatar.src = portraitURL;
                avatar.alt = p.name || 'Character portrait';
                avatar.style.borderColor = cHex;

                const rankEl = clone.querySelector('.podium-rank');
                rankEl.textContent = `#${rank}`;

                const nameEl = clone.querySelector('.podium-name');
                nameEl.textContent = p.name;
                nameEl.style.color = cHex;

                const statValEl = clone.querySelector('.podium-stat-val');
                statValEl.textContent = hkCount;
                statValEl.classList.add('text-hk');

                const statLabelEl = clone.querySelector('.podium-stat-lbl');
                statLabelEl.textContent = 'HKs';

                const trendContainer = clone.querySelector('.podium-trend-container');
                trendContainer.appendChild(createTrendSpan(trend, 'podium'));

                podiumWrap.appendChild(clone);
            } else if (rowTemplate) {
                const clone = rowTemplate.content.cloneNode(true);

                const row = clone.querySelector('.leaderboard-row');
                row.setAttribute('data-char', cleanName);
                row.addEventListener('click', () => selectCharacter(cleanName));
                row.style.borderLeftColor = cHex;

                const rankEl = clone.querySelector('.lb-rank');
                rankEl.textContent = `#${index + 1}`;

                const portraitEl = clone.querySelector('.lb-portrait');
                portraitEl.src = portraitURL;
                portraitEl.alt = p.name || 'Character portrait';
                portraitEl.style.borderColor = cHex;

                const nameEl = clone.querySelector('.lb-name');
                nameEl.textContent = p.name;
                nameEl.style.color = cHex;

                const specEl = clone.querySelector('.lb-spec');
                specEl.textContent = displaySpecClass;
                if (specIconUrl) {
                    const specIconEl = buildSmallSpecIconNode({
                        src: specIconUrl,
                        alt: `${displaySpecClass} icon`
                    });
                    if (specIconEl) {
                        specEl.prepend(specIconEl);
                    }
                }

                const scoreEl = clone.querySelector('.lb-score');
                scoreEl.classList.add('pvp-score');

                const scoreValueEl = clone.querySelector('.lb-score-value');
                scoreValueEl.textContent = hkCount;

                const scoreLabelEl = clone.querySelector('.lb-score-label');
                scoreLabelEl.textContent = 'HKs';

                scoreEl.appendChild(createTrendSpan(trend));

                listWrap.appendChild(clone);
            }
        });

        pvpContainer.appendChild(podiumWrap);
        pvpContainer.appendChild(listWrap);

        if (topPvp.length > 5) {
            const expandBtnTemplate = document.getElementById('tpl-home-leaderboard-expand-btn');
            const btn = expandBtnTemplate?.content?.firstElementChild?.cloneNode(true);

            if (btn) {
                btn.addEventListener('click', function() {
                    const listWrapEl = this.previousElementSibling;
                    if (listWrapEl) listWrapEl.classList.toggle('collapsed-list');
                    this.textContent = this.textContent.includes('▼') ? 'Collapse Leaderboard ▲' : 'Show Top 25 ▼';
                });
                pvpContainer.appendChild(btn);
            }
        }
    }
    
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
        const cHex = CLASS_COLORS[cClass] || "#ffd100";
        const factionType = p.faction && p.faction.type ? p.faction.type : "ALLIANCE";
        const factionCls = factionType === "HORDE" ? "faction-horde" : "faction-alliance";
        const powerCol = cClass === "Warrior" ? "#e74c3c" : "#3498db";
        const powerName = getPowerName(cClass);
        
        const activeSpec = p.active_spec ? p.active_spec : '';
        const specIconUrl = getSpecIcon(cClass, activeSpec);
        const specIconHtml = specIconUrl ? `<img src="${specIconUrl}" class="spec-icon-card">` : '';
        const displaySpecClass = activeSpec ? `${activeSpec} ${cClass}` : cClass;

        const health = st.health || 0;
        const power = st.power || 0;
        const strVal = st.strength_effective || ((st.strength && st.strength.effective) || 0);
        const agiVal = st.agility_effective || ((st.agility && st.agility.effective) || 0);
        const staVal = st.stamina_effective || ((st.stamina && st.stamina.effective) || 0);
        const intVal = st.intellect_effective || ((st.intellect && st.intellect.effective) || 0);
        const spiVal = st.spirit_effective || ((st.spirit && st.spirit.effective) || 0);
        const raceName = p.race && p.race.name ? (typeof p.race.name === 'string' ? p.race.name : (p.race.name.en_US || 'Unknown')) : 'Unknown';
        
        // Safely extract stats supporting both the old nested JSON and the new flat Turso schema
        const armor = st.armor_effective || ((st.armor && st.armor.effective) || 0);
        const defense = st.defense_effective || ((st.defense && st.defense.effective) || 0);
        const dodge = st.dodge || ((st.dodge && st.dodge.value) || 0);
        const parry = st.parry || 0;
        const block = st.block || 0;
        
        const ap = st.attack_power || 0;
        const meleeCrit = st.melee_crit_value || ((st.melee_crit && st.melee_crit.value) || 0);
        const meleeHaste = st.melee_haste_value || 0;
        
        const rangedCrit = st.ranged_crit || 0;
        const rangedHaste = st.ranged_haste || 0;
        
        const spellPower = st.spell_power || 0;
        const spellCrit = st.spell_crit_value || ((st.spell_crit && st.spell_crit.value) || 0);
        const spellHaste = st.spell_haste || 0;
        const spellPen = st.spell_penetration || 0;
        
        const manaRegen = st.mana_regen || 0;
        const mp5 = st.mana_regen_combat || 0;

        // Determine logical roles to prevent stat bloat
        const isTank = ["Protection", "Blood"].includes(activeSpec) || (cClass === "Druid" && activeSpec === "Feral Combat") || cClass === "Warrior";
        const isHunter = cClass === "Hunter";
        const isMelee = ["Rogue", "Warrior", "Death Knight"].includes(cClass) || ["Retribution", "Enhancement", "Feral Combat"].includes(activeSpec);
        const isCaster = ["Mage", "Warlock", "Priest"].includes(cClass) || ["Balance", "Elemental", "Restoration", "Holy"].includes(activeSpec) || (cClass === "Paladin" && ["Holy", "Protection"].includes(activeSpec)) || (cClass === "Shaman" && activeSpec !== "Enhancement") || (cClass === "Druid" && activeSpec !== "Feral Combat");

        const pushNode = (collection, node) => {
            if (node) {
                collection.push(node);
            }
        };

        const advancedStatsNodes = [];
        pushNode(advancedStatsNodes, getTemplateRootHtml('tpl-full-card-stat-divider'));
        pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
            label: '🛡️ Armor',
            value: armor.toLocaleString(),
            valueClass: 'val-wht'
        }));
        
        // 1. Defenses (Gated to Tanks or High-Defense Off-Tanks)
        if (isTank || defense > 350) {
            if (defense > 0) {
                pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
                    label: '🧱 Defense',
                    value: defense,
                    valueClass: 'val-wht'
                }));
            }
            if (dodge > 0) {
                pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
                    label: '🤸 Dodge',
                    value: `${dodge.toFixed(2)}%`,
                    valueClass: 'val-wht'
                }));
            }
            if (parry > 0) {
                pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
                    label: '⚔️ Parry',
                    value: `${parry.toFixed(2)}%`,
                    valueClass: 'val-wht'
                }));
            }
            if (block > 0) {
                pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
                    label: '🛡️ Block',
                    value: `${block.toFixed(2)}%`,
                    valueClass: 'val-wht'
                }));
            }
        }

        // 2. Physical Offense (Melee & Ranged)
        if (isMelee || isHunter) {
            if (ap > 0) {
                pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
                    label: '⚔️ Attack Power',
                    value: ap,
                    valueClass: 'val-org'
                }));
            }
        }
        if (isMelee) {
            if (meleeCrit > 0) {
                pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
                    label: '🩸 Melee Crit',
                    value: `${meleeCrit.toFixed(2)}%`,
                    valueClass: 'val-red'
                }));
            }
            if (meleeHaste > 0) {
                pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
                    label: '⚡ Melee Haste',
                    value: `${meleeHaste.toFixed(2)}%`,
                    valueClass: 'val-red'
                }));
            }
        }
        if (isHunter) {
            if (rangedCrit > 0) {
                pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
                    label: '🏹 Ranged Crit',
                    value: `${rangedCrit.toFixed(2)}%`,
                    valueClass: 'val-grn'
                }));
            }
            if (rangedHaste > 0) {
                pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
                    label: '⚡ Ranged Haste',
                    value: `${rangedHaste.toFixed(2)}%`,
                    valueClass: 'val-grn'
                }));
            }
        }

        // 3. Spellcasting & Healing
        if (isCaster) {
            if (spellPower > 0) {
                pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
                    label: '✨ Spell Power',
                    value: spellPower,
                    valueClass: 'val-blu'
                }));
            }
            if (spellCrit > 0) {
                pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
                    label: '🔥 Spell Crit',
                    value: `${spellCrit.toFixed(2)}%`,
                    valueClass: 'val-ylw'
                }));
            }
            if (spellHaste > 0) {
                pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
                    label: '⚡ Spell Haste',
                    value: `${spellHaste.toFixed(2)}%`,
                    valueClass: 'val-ylw'
                }));
            }
            if (spellPen > 0) {
                pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
                    label: '🌀 Spell Pen',
                    value: spellPen,
                    valueClass: 'val-blu'
                }));
            }
            if (mp5 > 0) {
                pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
                    label: '💧 Mana/5 (Combat)',
                    value: Math.round(mp5),
                    valueClass: 'val-grn'
                }));
            } else if (manaRegen > 0) {
                pushNode(advancedStatsNodes, buildFullCardStatRowHtml({
                    label: '💧 Mana Regen',
                    value: Math.round(manaRegen),
                    valueClass: 'val-grn'
                }));
            }
        }

        const hks = p.honorable_kills || 0;
        
        // --- NEW: Page 2 Weapon & Gear Breakdown ---
        const mhMin = st.main_hand_damage_min || st.main_hand_min || ((st.main_hand_weapon_damage && st.main_hand_weapon_damage.min) || 0);
        const mhMax = st.main_hand_damage_max || st.main_hand_max || ((st.main_hand_weapon_damage && st.main_hand_weapon_damage.max) || 0);
        const mhSpeed = st.main_hand_speed || ((st.main_hand_weapon_damage && st.main_hand_weapon_damage.speed) || 0);
        const mhDps = st.main_hand_dps || ((st.main_hand_weapon_damage && st.main_hand_weapon_damage.dps) || 0);

        const ohMin = st.off_hand_damage_min || st.off_hand_min || ((st.off_hand_weapon_damage && st.off_hand_weapon_damage.min) || 0);
        const ohMax = st.off_hand_damage_max || st.off_hand_max || ((st.off_hand_weapon_damage && st.off_hand_weapon_damage.max) || 0);
        const ohSpeed = st.off_hand_speed || ((st.off_hand_weapon_damage && st.off_hand_weapon_damage.speed) || 0);
        const ohDps = st.off_hand_dps || ((st.off_hand_weapon_damage && st.off_hand_weapon_damage.dps) || 0);

        const strBase = st.strength_base || ((st.strength && st.strength.base) || 0);
        const agiBase = st.agility_base || ((st.agility && st.agility.base) || 0);
        const staBase = st.stamina_base || ((st.stamina && st.stamina.base) || 0);
        const intBase = st.intellect_base || ((st.intellect && st.intellect.base) || 0);
        const spiBase = st.spirit_base || ((st.spirit && st.spirit.base) || 0);

        const weaponStatsNodes = [];
        
        if (mhDps > 0) {
            pushNode(weaponStatsNodes, buildFullCardWeaponHeaderHtml({
                text: 'Main Hand Weapon'
            }));
            pushNode(weaponStatsNodes, buildFullCardStatRowHtml({
                label: '🗡️ Damage',
                value: `${Math.round(mhMin)} - ${Math.round(mhMax)}`,
                valueClass: 'val-wht'
            }));
            pushNode(weaponStatsNodes, buildFullCardStatRowHtml({
                label: '⏱️ Speed',
                value: mhSpeed.toFixed(2),
                valueClass: 'val-wht'
            }));
            pushNode(weaponStatsNodes, buildFullCardStatRowHtml({
                label: '💥 DPS',
                value: mhDps.toFixed(1),
                valueClass: 'val-org'
            }));
        }

        if (ohDps > 0) {
            pushNode(weaponStatsNodes, buildFullCardWeaponHeaderHtml({
                text: 'Off Hand Weapon',
                extraClass: 'weapon-stats-header-secondary'
            }));
            pushNode(weaponStatsNodes, buildFullCardStatRowHtml({
                label: '🗡️ Damage',
                value: `${Math.round(ohMin)} - ${Math.round(ohMax)}`,
                valueClass: 'val-wht'
            }));
            pushNode(weaponStatsNodes, buildFullCardStatRowHtml({
                label: '⏱️ Speed',
                value: ohSpeed.toFixed(2),
                valueClass: 'val-wht'
            }));
            pushNode(weaponStatsNodes, buildFullCardStatRowHtml({
                label: '💥 DPS',
                value: ohDps.toFixed(1),
                valueClass: 'val-org'
            }));
        }

        // Show Gear Contribution for Casters or characters lacking weapon API data
        if (mhDps === 0 || isCaster || isTank) {
            const marginClass = mhDps > 0 ? 'weapon-stats-header-mt16' : 'weapon-stats-header-mt0';

            pushNode(weaponStatsNodes, buildFullCardWeaponHeaderHtml({
                text: 'Gear Contribution',
                extraClass: marginClass
            }));

            pushNode(weaponStatsNodes, buildFullCardGearContributionRowHtml({
                label: '🛡️ Stamina',
                baseValue: staBase,
                gainValue: staVal - staBase
            }));

            if (intVal > 0) {
                pushNode(weaponStatsNodes, buildFullCardGearContributionRowHtml({
                    label: '🧠 Intellect',
                    baseValue: intBase,
                    gainValue: intVal - intBase
                }));
            }

            if (spiVal > 0) {
                pushNode(weaponStatsNodes, buildFullCardGearContributionRowHtml({
                    label: '✨ Spirit',
                    baseValue: spiBase,
                    gainValue: spiVal - spiBase
                }));
            }

            if (strVal > 0 && !isCaster) {
                pushNode(weaponStatsNodes, buildFullCardGearContributionRowHtml({
                    label: '⚔️ Strength',
                    baseValue: strBase,
                    gainValue: strVal - strBase
                }));
            }

            if (agiVal > 0 && (!isCaster || isHunter)) {
                pushNode(weaponStatsNodes, buildFullCardGearContributionRowHtml({
                    label: '🏹 Agility',
                    baseValue: agiBase,
                    gainValue: agiVal - agiBase
                }));
            }
        }

        const xp = p.experience || 0;
        const restedXp = p.rested_experience || 0;
        let maxXp = p.next_level_experience || p.experience_max || 0;
        
        if (maxXp <= 0 && p.level < 70) {
            maxXp = TBC_XP[p.level] || 0;
        }
        
        let xpPercent = 100;
        let restedPercent = 0;
        let xpLabel = "Max Level";
        
        if (p.level < 70 && maxXp > 0) {
            xpPercent = Math.min((xp / maxXp) * 100, 100);
            restedPercent = Math.min(((xp + restedXp) / maxXp) * 100, 100);
            if (restedXp > 0) {
                xpLabel = `${xp.toLocaleString()} / ${maxXp.toLocaleString()} XP (+${restedXp.toLocaleString()} Rested)`;
            } else {
                xpLabel = `${xp.toLocaleString()} / ${maxXp.toLocaleString()} XP`;
            }
        }

        const gearNodes = [];
        
        // Items that cannot be traditionally enchanted (ignoring rings to prevent false positives for non-enchanters)
        const UNENCHANTABLE_SLOTS = ['NECK', 'SHIRT', 'TABARD', 'FINGER_1', 'FINGER_2', 'TRINKET_1', 'TRINKET_2'];

        SLOTS.forEach(slot => {
            const data = eq[slot];
            if (data && data.item_id) {
                const q = data.quality || "COMMON", qHex = QUALITY_COLORS[q];
                const hasEnchant = data.tooltip_params && data.tooltip_params.includes('ench=');
                const canBeEnchanted = !UNENCHANTABLE_SLOTS.includes(slot);

                let warningStyle = '';

                if (!hasEnchant && canBeEnchanted && (q === "EPIC" || q === "LEGENDARY")) {
                    warningStyle = 'missing-enchant-warning';
                }

                const gearSlotTemplate = document.getElementById('tpl-full-card-gear-slot');

                if (gearSlotTemplate) {
                    const gearClone = gearSlotTemplate.content.cloneNode(true);
                    const gearSlotEl = gearClone.querySelector('.item-slot');
                    const gearIconEl = gearClone.querySelector('.gear-slot-icon');
                    const enchantBadgeEl = gearClone.querySelector('.enchant-badge');
                    const gearLinkEl = gearClone.querySelector('.gear-slot-link');
                    const warningTextEl = gearClone.querySelector('.missing-enchant-text');

                    if (gearSlotEl) {
                        gearSlotEl.classList.add(`qual-border-left-${q}`);
                        if (warningStyle) {
                            gearSlotEl.classList.add(warningStyle);
                        }
                    }

                    if (gearIconEl) {
                        gearIconEl.src = data.icon_data;
                        gearIconEl.alt = data.name || 'Equipped item';
                        gearIconEl.classList.add(warningStyle ? 'gear-slot-icon-warning' : `qual-border-${q}`);
                    }

                    if (hasEnchant) {
                        if (enchantBadgeEl) {
                            enchantBadgeEl.hidden = false;
                        }
                    } else if (enchantBadgeEl) {
                        enchantBadgeEl.remove();
                    }

                    if (gearLinkEl) {
                        gearLinkEl.href = `https://www.wowhead.com/wotlk/item=${data.item_id}`;
                        gearLinkEl.classList.add(`qual-color-${q}`);
                        gearLinkEl.textContent = data.name;
                        gearLinkEl.setAttribute('data-wowhead', data.tooltip_params);
                    }

                    if (warningStyle) {
                        if (warningTextEl) {
                            warningTextEl.hidden = false;
                        }
                    } else if (warningTextEl) {
                        warningTextEl.remove();
                    }

                    const gearSlotNode = gearClone.firstElementChild;
                    if (gearSlotNode) {
                        gearNodes.push(gearSlotNode);
                    }
                }
            } else {
                const emptyIcon = EMPTY_ICONS[slot] || 'inv_misc_questionmark';
                const emptySlotTemplate = document.getElementById('tpl-full-card-empty-slot');

                if (emptySlotTemplate) {
                    const emptyClone = emptySlotTemplate.content.cloneNode(true);
                    const emptyImg = emptyClone.querySelector('.empty-slot-icon');

                    if (emptyImg) {
                        emptyImg.src = `https://wow.zamimg.com/images/wow/icons/large/${emptyIcon}.jpg`;
                        emptyImg.alt = `${slot.replace(/_/g, ' ')} empty slot`;
                    }

                    const emptySlotEl = emptyClone.firstElementChild;
                    if (emptySlotEl) {
                        gearNodes.push(emptySlotEl);
                    }
                }
            }
        });

        // --- NEW: Grab the Guild Rank & Badges (Scope-Safe) ---
        const guildRank = p.guild_rank || 'Member';
        const vBadges = safeParseArray(p.vanguard_badges || char.vanguard_badges);
        const cBadges = safeParseArray(p.campaign_badges || char.campaign_badges);
        const prevMvps = config.prev_mvps || {};
        const isPveReigning = prevMvps.pve && prevMvps.pve.name && prevMvps.pve.name.toLowerCase() === charName.toLowerCase();
        const isPvpReigning = prevMvps.pvp && prevMvps.pvp.name && prevMvps.pvp.name.toLowerCase() === charName.toLowerCase();

        const vCount = vBadges.length;
        const cCount = cBadges.length;
        const pveChamp = parseInt(p.pve_champ_count || char.pve_champ_count) || 0;
        const pvpChamp = parseInt(p.pvp_champ_count || char.pvp_champ_count) || 0;
        const pveGold = parseInt(p.pve_gold || char.pve_gold) || 0;
        const pveSilver = parseInt(p.pve_silver || char.pve_silver) || 0;
        const pveBronze = parseInt(p.pve_bronze || char.pve_bronze) || 0;
        const pvpGold = parseInt(p.pvp_gold || char.pvp_gold) || 0;
        const pvpSilver = parseInt(p.pvp_silver || char.pvp_silver) || 0;
        const pvpBronze = parseInt(p.pvp_bronze || char.pvp_bronze) || 0;

        const tPveGold = getDetailedBadgeTooltip(p.name, ['pve_gold'], `${pveGold}x PvE Gold Medal`, pveGold);
        const tPveSilver = getDetailedBadgeTooltip(p.name, ['pve_silver'], `${pveSilver}x PvE Silver Medal`, pveSilver);
        const tPveBronze = getDetailedBadgeTooltip(p.name, ['pve_bronze'], `${pveBronze}x PvE Bronze Medal`, pveBronze);
        const tPvpGold = getDetailedBadgeTooltip(p.name, ['pvp_gold'], `${pvpGold}x PvP Gold Medal`, pvpGold);
        const tPvpSilver = getDetailedBadgeTooltip(p.name, ['pvp_silver'], `${pvpSilver}x PvP Silver Medal`, pvpSilver);
        const tPvpBronze = getDetailedBadgeTooltip(p.name, ['pvp_bronze'], `${pvpBronze}x PvP Bronze Medal`, pvpBronze);
        const tPveChamp = getDetailedBadgeTooltip(p.name, ['mvp_pve'], `${pveChamp}x PvE Champion`, pveChamp);
        const tPvpChamp = getDetailedBadgeTooltip(p.name, ['mvp_pvp'], `${pvpChamp}x PvP Champion`, pvpChamp);
        const tVanguard = getDetailedBadgeTooltip(p.name, ['vanguard'], summarizeBadges(vBadges), vCount);
        const tCampaign = getDetailedBadgeTooltip(p.name, ['campaign'], summarizeBadges(cBadges), cCount);

        const fullCardTemplate = document.getElementById('tpl-full-card-shell');
        if (!fullCardTemplate) return '';

        const clone = fullCardTemplate.content.cloneNode(true);

        const card = clone.querySelector('.char-card');
        card.classList.add(factionCls);
        card.classList.add('char-card-accent');
        card.style.setProperty('--full-card-accent', cHex);

        const nameEl = clone.querySelector('.char-card-name');
        nameEl.textContent = p.name || 'Unknown';

        const badgesEl = clone.querySelector('.char-badges-container');
        badgesEl.textContent = '';

        appendFullCardBadge(badgesEl, {
            text: `🛡️ ${guildRank}`,
            classNames: ['char-badge-guild-rank']
        });

        if (isPveReigning) {
            appendFullCardBadge(badgesEl, {
                text: '👑 Reigning PvE MVP',
                title: 'Current Reigning PvE Champion!',
                classNames: ['badge-reigning-pve']
            });
        }

        if (isPvpReigning) {
            appendFullCardBadge(badgesEl, {
                text: '⚔️ Reigning PvP MVP',
                title: 'Current Reigning PvP Champion!',
                classNames: ['badge-reigning-pvp']
            });
        }

        if (pveGold > 0) {
            appendFullCardBadge(badgesEl, {
                text: `🛡️🥇 PvE Gold x${pveGold}`,
                title: tPveGold,
                classNames: ['badge-pve-gold']
            });
        }

        if (pveSilver > 0) {
            appendFullCardBadge(badgesEl, {
                text: `🛡️🥈 PvE Silver x${pveSilver}`,
                title: tPveSilver,
                classNames: ['badge-silver']
            });
        }

        if (pveBronze > 0) {
            appendFullCardBadge(badgesEl, {
                text: `🛡️🥉 PvE Bronze x${pveBronze}`,
                title: tPveBronze,
                classNames: ['badge-bronze']
            });
        }

        if (pvpGold > 0) {
            appendFullCardBadge(badgesEl, {
                text: `⚔️🥇 PvP Gold x${pvpGold}`,
                title: tPvpGold,
                classNames: ['badge-gold-alt']
            });
        }

        if (pvpSilver > 0) {
            appendFullCardBadge(badgesEl, {
                text: `⚔️🥈 PvP Silver x${pvpSilver}`,
                title: tPvpSilver,
                classNames: ['badge-silver']
            });
        }

        if (pvpBronze > 0) {
            appendFullCardBadge(badgesEl, {
                text: `⚔️🥉 PvP Bronze x${pvpBronze}`,
                title: tPvpBronze,
                classNames: ['badge-bronze']
            });
        }

        if (pveChamp > 0) {
            appendFullCardBadge(badgesEl, {
                text: `👑 PvE Champ x${pveChamp}`,
                title: tPveChamp,
                classNames: ['badge-pve-champ']
            });
        }

        if (pvpChamp > 0) {
            appendFullCardBadge(badgesEl, {
                text: `⚔️ PvP Champ x${pvpChamp}`,
                title: tPvpChamp,
                classNames: ['badge-pvp-champ']
            });
        }

        if (vCount > 0) {
            appendFullCardBadge(badgesEl, {
                text: `🌟 Vanguard x${vCount}`,
                title: tVanguard,
                classNames: ['badge-vanguard']
            });
        }

        if (cCount > 0) {
            appendFullCardBadge(badgesEl, {
                text: `🎖️ Campaigns x${cCount}`,
                title: tCampaign,
                classNames: ['badge-campaign']
            });
        }

        appendFullCardBadge(badgesEl, {
            text: `Level ${p.level || 0}`,
            classNames: ['default-badge']
        });

        appendFullCardBadge(badgesEl, {
            text: `iLvl ${p.equipped_item_level || 0}`,
            classNames: ['char-badge-ilvl']
        });

        appendFullCardBadge(badgesEl, {
            text: raceName,
            classNames: ['default-badge']
        });

        appendFullCardBadge(badgesEl, {
            text: displaySpecClass,
            textColor: cHex,
            borderColor: cHex,
            iconSrc: specIconUrl || '',
            iconAlt: ''
        });

        if (hks > 0) {
            appendFullCardBadge(badgesEl, {
                text: `⚔️ ${hks.toLocaleString()} HKs`,
                classNames: ['hk-card-badge']
            });
        }

        const restedBar = clone.querySelector('.xp-bar-rested');
        restedBar.style.width = `${restedPercent}%`;

        const earnedBar = clone.querySelector('.xp-bar-earned');
        earnedBar.style.width = `${xpPercent}%`;

        const xpLabelEl = clone.querySelector('.xp-bar-label');
        xpLabelEl.textContent = xpLabel;

        const portraitEl = clone.querySelector('.char-card-portrait');
        portraitEl.src = char.render_url || getClassIcon(cClass);
        portraitEl.alt = p.name || 'Character portrait';

        const statsTitleEl = clone.querySelector('.char-card-stats-title');
        statsTitleEl.textContent = 'Combat Stats';

        const healthFillEl = clone.querySelector('.full-card-health-fill');

        const healthTextEl = clone.querySelector('.full-card-health-text');
        healthTextEl.textContent = `Health: ${health}`;

        const powerFillEl = clone.querySelector('.full-card-power-fill');
        powerFillEl.style.setProperty('--full-card-power-accent', powerCol);

        const powerTextEl = clone.querySelector('.full-card-power-text');
        powerTextEl.textContent = `${powerName}: ${power}`;

        clone.querySelector('.full-card-stat-str').textContent = strVal;
        clone.querySelector('.full-card-stat-agi').textContent = agiVal;
        clone.querySelector('.full-card-stat-sta').textContent = staVal;
        clone.querySelector('.full-card-stat-int').textContent = intVal;
        clone.querySelector('.full-card-stat-spi').textContent = spiVal;

        const advancedStatsEl = clone.querySelector('.full-card-advanced-stats');
        advancedStatsEl.textContent = '';
        advancedStatsNodes.forEach(node => {
            if (node) {
                advancedStatsEl.appendChild(node);
            }
        });

        const page2El = clone.querySelector('.stat-page-2');
        page2El.textContent = '';
        weaponStatsNodes.forEach(node => {
            if (node) {
                page2El.appendChild(node);
            }
        });

        const gearGridEl = clone.querySelector('.full-card-gear-grid');
        gearGridEl.textContent = '';
        gearNodes.forEach(node => {
            if (node) {
                gearGridEl.appendChild(node);
            }
        });

        return clone.firstElementChild || null;
    }

    function getTemplateRootHtml(templateId) {
        const template = document.getElementById(templateId);
        const rootEl = template?.content?.firstElementChild;
        return rootEl ? rootEl.cloneNode(true) : null;
    }

    function buildFullCardGearContributionRowHtml({ label, baseValue, gainValue }) {
        const template = document.getElementById('tpl-full-card-gear-contribution-row');
        if (!template) return null;

        const clone = template.content.cloneNode(true);
        const labelEl = clone.querySelector('.stat-lbl');
        const baseEl = clone.querySelector('.gear-base-stat');
        const gainEl = clone.querySelector('.gear-gain-stat');

        if (labelEl) {
            labelEl.textContent = label;
        }

        if (baseEl) {
            baseEl.textContent = `${baseValue} Base`;
        }

        if (gainEl) {
            gainEl.textContent = `+${gainValue}`;
        }

        const rootEl = clone.firstElementChild;
        return rootEl || null;
    }

    function buildFullCardWeaponHeaderHtml({ text, extraClass = '' }) {
        const template = document.getElementById('tpl-full-card-weapon-header');
        if (!template) return null;

        const clone = template.content.cloneNode(true);
        const headerEl = clone.querySelector('.weapon-stats-header');

        if (headerEl) {
            headerEl.textContent = text;
            if (extraClass) {
                extraClass.split(' ').filter(Boolean).forEach(cls => headerEl.classList.add(cls));
            }
        }

        const rootEl = clone.firstElementChild;
        return rootEl || null;
    }

    function buildFullCardStatRowHtml({ label, value, valueClass = '' }) {
        const template = document.getElementById('tpl-full-card-stat-row');
        if (!template) return null;

        const clone = template.content.cloneNode(true);
        const labelEl = clone.querySelector('.stat-lbl');
        const valueEl = clone.querySelector('.stat-val');

        if (labelEl) {
            labelEl.textContent = label;
        }

        if (valueEl) {
            valueEl.textContent = value;
            if (valueClass) {
                valueClass.split(' ').filter(Boolean).forEach(cls => valueEl.classList.add(cls));
            }
        }

        const rowEl = clone.firstElementChild;
        return rowEl || null;
    }

    function appendFullCardBadge(container, {
        text,
        title = '',
        classNames = [],
        textColor = '',
        borderColor = '',
        iconSrc = '',
        iconAlt = ''
    }) {
        const template = document.getElementById('tpl-full-card-badge');
        if (!template || !container) return;

        const clone = template.content.cloneNode(true);
        const badge = clone.querySelector('.full-card-badge');
        const content = clone.querySelector('.full-card-badge-content');

        classNames.forEach(cls => badge.classList.add(cls));
        if (title) badge.title = title;

        if (textColor || borderColor) {
            badge.classList.add('full-card-badge-accent');
        }
        if (textColor) {
            badge.style.setProperty('--full-card-badge-text-color', textColor);
        }
        if (borderColor) {
            badge.style.setProperty('--full-card-badge-border-color', borderColor);
        }

        if (iconSrc) {
            const iconTemplate = document.getElementById('tpl-full-card-badge-icon');
            if (iconTemplate) {
                const iconClone = iconTemplate.content.cloneNode(true);
                const img = iconClone.querySelector('.full-card-badge-icon');

                if (img) {
                    img.src = iconSrc;
                    img.alt = iconAlt;
                }

                content.appendChild(iconClone);
            }
        }

        content.appendChild(document.createTextNode(text));
        container.appendChild(clone);
    }

    function appendFullCardBadgeHtml(container, html) {
        if (!container || !html || html.trim() === '') return;
        const fragment = document.createRange().createContextualFragment(html);
        container.appendChild(fragment);
    }

    function renderDynamicBadges(characters, isRawMode) {
        const container = document.getElementById('concise-class-badges');
        
        const specContainer = document.getElementById('concise-spec-container');
        if (specContainer) specContainer.hidden = true;

        if (!characters || characters.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        const counts = {};
        characters.forEach(char => {
            let cClass = 'Unknown';
            if (isRawMode) {
                const deepChar = rosterData.find(c => c.profile && c.profile.name && c.profile.name.toLowerCase() === char.name.toLowerCase());
                if (deepChar) cClass = getCharClass(deepChar);
                else cClass = char.class || 'Unknown';
            } else {
                cClass = getCharClass(char);
            }
            counts[cClass] = (counts[cClass] || 0) + 1;
        });
        
        const sortedClasses = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
        container.textContent = '';
        const badgeTemplate = document.getElementById('tpl-dynamic-badge');
        
        sortedClasses.forEach(cls => {
            if (cls === 'Unknown') return;
            const color = CLASS_COLORS[cls] || '#fff';
            
            if (badgeTemplate) {
                const clone = badgeTemplate.content.cloneNode(true);
                const badgeDiv = clone.querySelector('.dynamic-badge');
                const clsSpan = clone.querySelector('.stat-badge-cls');
                const countSpan = clone.querySelector('.stat-badge-count');
                
                badgeDiv.setAttribute('data-class', cls);
                badgeDiv.style.setProperty('--dynamic-badge-accent', color);
                badgeDiv.title = `Filter ${cls}s`;
                
                clsSpan.textContent = cls;
                
                countSpan.textContent = counts[cls];
                
                container.appendChild(clone);
            }
        });
        
        container.style.display = 'flex';

        document.querySelectorAll('.dynamic-badge').forEach(badge => {
            badge.addEventListener('click', function() {
                const targetClass = this.getAttribute('data-class');
                const isActive = this.classList.contains('active-filter');
                
                document.querySelectorAll('.dynamic-badge').forEach(b => {
                    b.classList.remove('active-filter', 'filter-badge-dimmed', 'filter-badge-selected');
                });
                
                // Trigger smooth fade-in animation
                const charList = document.getElementById('concise-char-list');
                if (charList) {
                    charList.classList.remove('animate-list-update');
                    void charList.offsetWidth; // Force a browser reflow
                    charList.classList.add('animate-list-update');
                }

                if (isActive) {
                    document.querySelectorAll('.concise-char-bar').forEach(el => {
                        el.classList.remove('concise-char-bar-filtered-out');
                    });
                    document.querySelectorAll('.dynamic-badge').forEach(b => {
                        b.classList.remove('filter-badge-dimmed', 'filter-badge-selected');
                    });
                    if (specContainer) specContainer.hidden = true;
                    
                    window.currentFilteredChars = characters.map(c => (c.profile && c.profile.name ? c.profile.name.toLowerCase() : (c.name ? c.name.toLowerCase() : '')));
                    applyTimelineFilters();
                } else {
                    document.querySelectorAll('.dynamic-badge').forEach(b => {
                        if (b !== this) {
                            b.classList.add('filter-badge-dimmed');
                        }
                    });

                    this.classList.add('active-filter', 'filter-badge-selected');
                    
                    const visibleChars = [];
                    document.querySelectorAll('.concise-char-bar').forEach(el => {
                        const charName = el.getAttribute('data-char');
                        if (el.getAttribute('data-class') === targetClass) {
                            el.classList.remove('concise-char-bar-filtered-out');
                            if(charName) visibleChars.push(charName);
                        } else {
                            el.classList.add('concise-char-bar-filtered-out');
                        }
                    });
                    
                    window.currentFilteredChars = visibleChars;
                    applyTimelineFilters();

                    const formattedClass = targetClass.charAt(0).toUpperCase() + targetClass.slice(1);
                    const cHex = CLASS_COLORS[formattedClass] || '#fff';

                    const classRoster = characters.filter(c => {
                        let cClass = isRawMode ? (rosterData.find(deep => deep.profile && deep.profile.name && deep.profile.name.toLowerCase() === c.name.toLowerCase()) ? getCharClass(rosterData.find(deep => deep.profile && deep.profile.name && deep.profile.name.toLowerCase() === c.name.toLowerCase())) : c.class) : getCharClass(c);
                        return cClass === targetClass;
                    });

                    const specCounts = {};
                    let unspeccedCount = 0;

                    classRoster.forEach(char => {
                        let spec = null;
                        if (isRawMode) {
                            const deepChar = rosterData.find(deep => deep.profile && deep.profile.name && deep.profile.name.toLowerCase() === char.name.toLowerCase());
                            if (deepChar && deepChar.profile) spec = deepChar.profile.active_spec;
                        } else {
                            spec = char.profile.active_spec;
                        }

                        if (spec) {
                            specCounts[spec] = (specCounts[spec] || 0) + 1;
                        } else {
                            unspeccedCount++;
                        }
                    });

                    specContainer.textContent = '';

                    const specFilterWrapperTemplate = document.getElementById('tpl-spec-filter-wrapper');
                    const wrapDiv = specFilterWrapperTemplate?.content?.firstElementChild?.cloneNode(true);

                    if (!wrapDiv) return;
                    
                    const specTemplate = document.getElementById('tpl-spec-badge');
                    if (specTemplate) {
                        let clone = specTemplate.content.cloneNode(true);
                        let badge = clone.querySelector('.spec-btn');
                        badge.setAttribute('data-spec', 'all');
                        badge.style.setProperty('--spec-badge-accent', cHex);
                        badge.classList.add('spec-badge-all');
                        badge.title = `View all ${formattedClass}s`;
                        
                        let clsSpan = clone.querySelector('.stat-badge-cls');
                        clsSpan.textContent = `All ${formattedClass}s`;
                        
                        clone.querySelector('.stat-badge-count').textContent = classRoster.length;
                        wrapDiv.appendChild(clone);

                        Object.keys(specCounts).sort().forEach(spec => {
                            clone = specTemplate.content.cloneNode(true);
                            badge = clone.querySelector('.spec-btn');
                            badge.setAttribute('data-spec', spec);
                            badge.style.setProperty('--spec-badge-accent', cHex);
                            badge.title = `View ${spec} ${formattedClass}s`;
                            
                            clsSpan = clone.querySelector('.stat-badge-cls');
                            
                            const iconUrl = getSpecIcon(formattedClass, spec);
                            if (iconUrl) {
                                const iconTemplate = document.getElementById('tpl-spec-badge-icon');
                                if (iconTemplate) {
                                    const iconClone = iconTemplate.content.cloneNode(true);
                                    const img = iconClone.querySelector('.spec-badge-icon');
                                    if (img) {
                                        img.src = iconUrl;
                                        img.alt = `${spec} ${formattedClass} icon`;
                                    }
                                    clsSpan.appendChild(iconClone);
                                }
                            }
                            clsSpan.appendChild(document.createTextNode(spec));
                            
                            clone.querySelector('.stat-badge-count').textContent = specCounts[spec];
                            wrapDiv.appendChild(clone);
                        });

                        if (unspeccedCount > 0) {
                            clone = specTemplate.content.cloneNode(true);
                            badge = clone.querySelector('.spec-btn');
                            badge.setAttribute('data-spec', 'unspecced');
                            badge.style.setProperty('--spec-badge-accent', '#888');
                            badge.title = `View Unspecced ${formattedClass}s`;
                            
                            clsSpan = clone.querySelector('.stat-badge-cls');
                            clsSpan.textContent = 'Unspecced';
                            
                            clone.querySelector('.stat-badge-count').textContent = unspeccedCount;
                            wrapDiv.appendChild(clone);
                        }
                    }
                    specContainer.appendChild(wrapDiv);
                    specContainer.hidden = false;

                    document.querySelectorAll('.concise-spec-btn').forEach(specBtn => {
                        specBtn.addEventListener('click', function() {
                            const targetSpec = this.getAttribute('data-spec');
                            const subVisibleChars = []; 
                            
                            // Trigger smooth fade-in animation for spec clicks
                            const charList = document.getElementById('concise-char-list');
                            if (charList) {
                                charList.classList.remove('animate-list-update');
                                void charList.offsetWidth; // Force a browser reflow
                                charList.classList.add('animate-list-update');
                            }
                            
                            document.querySelectorAll('.concise-char-bar').forEach(el => {
                                const charName = el.getAttribute('data-char');
                                if (el.getAttribute('data-class') === targetClass) {
                                    if (targetSpec === 'all') {
                                        el.classList.remove('concise-char-bar-filtered-out');
                                        if(charName) subVisibleChars.push(charName);
                                    } else {
                                        const elSpec = el.getAttribute('data-spec') || 'unspecced';
                                        if (elSpec === targetSpec) {
                                            el.classList.remove('concise-char-bar-filtered-out');
                                            if(charName) subVisibleChars.push(charName);
                                        } else {
                                            el.classList.add('concise-char-bar-filtered-out');
                                        }
                                    }
                                } else {
                                    el.classList.add('concise-char-bar-filtered-out');
                                }
                            });
                            
                            window.currentFilteredChars = subVisibleChars;
                            applyTimelineFilters();
                        });
                    });

                }
            });
        });
    }

    function renderAwardFilterBadges(characters, isRawMode) {
        const container = document.getElementById('concise-class-badges');
        const specContainer = document.getElementById('concise-spec-container');
        if (specContainer) specContainer.hidden = true;

        if (!characters || characters.length === 0) {
            container.style.display = 'none';
            return;
        }

        const counts = { 'mvp_pve': 0, 'mvp_pvp': 0, 'vanguard': 0, 'campaign': 0, 'pve_gold': 0, 'pve_silver': 0, 'pve_bronze': 0, 'pvp_gold': 0, 'pvp_silver': 0, 'pvp_bronze': 0 };
        characters.forEach(char => {
            const p = isRawMode ? (rosterData.find(deep => deep.profile && deep.profile.name && deep.profile.name.toLowerCase() === char.name.toLowerCase())?.profile) : char.profile;
            const c = isRawMode ? (rosterData.find(deep => deep.profile && deep.profile.name && deep.profile.name.toLowerCase() === char.name.toLowerCase()) || char) : char;
            if (!p && !c) return;

            if (parseInt(p?.pve_champ_count || c?.pve_champ_count) > 0) counts['mvp_pve']++;
            if (parseInt(p?.pvp_champ_count || c?.pvp_champ_count) > 0) counts['mvp_pvp']++;
            if (safeParseArray(p?.vanguard_badges || c?.vanguard_badges).length > 0) counts['vanguard']++;
            if (safeParseArray(p?.campaign_badges || c?.campaign_badges).length > 0) counts['campaign']++;
            if (parseInt(p?.pve_gold || c?.pve_gold) > 0) counts['pve_gold']++;
            if (parseInt(p?.pve_silver || c?.pve_silver) > 0) counts['pve_silver']++;
            if (parseInt(p?.pve_bronze || c?.pve_bronze) > 0) counts['pve_bronze']++;
            if (parseInt(p?.pvp_gold || c?.pvp_gold) > 0) counts['pvp_gold']++;
            if (parseInt(p?.pvp_silver || c?.pvp_silver) > 0) counts['pvp_silver']++;
            if (parseInt(p?.pvp_bronze || c?.pvp_bronze) > 0) counts['pvp_bronze']++;
        });

        const AWARD_DEFS = {
            'mvp_pve': { label: 'PvE MVP', icon: '👑', color: '#ff8000' },
            'mvp_pvp': { label: 'PvP MVP', icon: '⚔️', color: '#ff4400' },
            'pve_gold': { label: 'PvE Gold', icon: '🥇', color: '#ffd700' },
            'pvp_gold': { label: 'PvP Gold', icon: '🥇', color: '#ffd700' },
            'pve_silver': { label: 'PvE Silver', icon: '🥈', color: '#c0c0c0' },
            'pvp_silver': { label: 'PvP Silver', icon: '🥈', color: '#c0c0c0' },
            'pve_bronze': { label: 'PvE Bronze', icon: '🥉', color: '#cd7f32' },
            'pvp_bronze': { label: 'PvP Bronze', icon: '🥉', color: '#cd7f32' },
            'vanguard': { label: 'Vanguards', icon: '🌟', color: '#00ffcc' },
            'campaign': { label: 'Campaigns', icon: '🎖️', color: '#aaa' }
        };

        container.textContent = '';
        const badgeTemplate = document.getElementById('tpl-award-badge');

        Object.keys(AWARD_DEFS).forEach(key => {
            if (counts[key] > 0) {
                const def = AWARD_DEFS[key];
                if (badgeTemplate) {
                    const clone = badgeTemplate.content.cloneNode(true);
                    const badgeDiv = clone.querySelector('.dynamic-award-badge');
                    const clsSpan = clone.querySelector('.stat-badge-cls');
                    const countSpan = clone.querySelector('.stat-badge-count');
                    
                    badgeDiv.setAttribute('data-award', key);
                    badgeDiv.style.setProperty('--award-badge-accent', def.color);
                    badgeDiv.title = `Filter ${def.label}`;
                    
                    clsSpan.textContent = `${def.icon} ${def.label}`;
                    
                    countSpan.textContent = counts[key];
                    
                    container.appendChild(clone);
                }
            }
        });

        container.style.display = 'flex';

        document.querySelectorAll('.dynamic-award-badge').forEach(badge => {
            badge.addEventListener('click', function() {
                const targetAward = this.getAttribute('data-award');
                const isActive = this.classList.contains('active-filter');
                
                document.querySelectorAll('.dynamic-award-badge').forEach(b => {
                    b.classList.remove('active-filter', 'filter-badge-dimmed', 'filter-badge-selected');
                });
                
                const charList = document.getElementById('concise-char-list');
                if (charList) {
                    charList.classList.remove('animate-list-update');
                    void charList.offsetWidth; 
                    charList.classList.add('animate-list-update');
                }

                if (isActive) {
                    document.querySelectorAll('.concise-char-bar').forEach(el => {
                        el.classList.remove('concise-char-bar-filtered-out');
                    });
                    document.querySelectorAll('.dynamic-award-badge').forEach(b => {
                        b.classList.remove('filter-badge-dimmed', 'filter-badge-selected');
                    });
                    window.currentFilteredChars = null; 
                    applyTimelineFilters();
                } else {
                    document.querySelectorAll('.dynamic-award-badge').forEach(b => {
                        if (b !== this) {
                            b.classList.add('filter-badge-dimmed');
                        }
                    });

                    this.classList.add('active-filter', 'filter-badge-selected');
                    
                    const visibleChars = [];
                    document.querySelectorAll('.concise-char-bar').forEach(el => {
                        const awards = el.getAttribute('data-awards') || '';
                        if (awards.includes(targetAward)) {
                            el.classList.remove('concise-char-bar-filtered-out');
                            const charName = el.getAttribute('data-char');
                            if(charName) visibleChars.push(charName);
                        } else {
                            el.classList.add('concise-char-bar-filtered-out');
                        }
                    });
                    window.currentFilteredChars = visibleChars;
                    applyTimelineFilters();
                }
            });
        });
    }

    function buildConciseRowHtml({
        isClickable,
        cleanName,
        cClass,
        activeSpecAttr,
        awardsAttr,
        cHex,
        isWarEffortRow,
        isWarEffortLootRow,
        rankNumber,
        rankToneClass,
        rankSizeClass,
        portraitURL,
        displayName,
        conciseBadges,
        showVanguardBadge,
        vanguardBadgeTimeText,
        raceName,
        specIconUrl,
        displaySpecClass,
        statsNode,
        hashUrl,
        vanguardClass,
        podiumClass
    }) {
        const template = document.getElementById('tpl-concise-row');
        if (!template) return null;

        const clone = template.content.cloneNode(true);
        const bar = clone.querySelector('.concise-char-bar');
        const innerWrap = clone.querySelector('.concise-row-inner');
        const rankSlot = clone.querySelector('.concise-rank-slot');
        const portrait = clone.querySelector('.c-portrait');
        const nameEl = clone.querySelector('.c-name');
        const metaEl = clone.querySelector('.c-meta');
        const statsTop = clone.querySelector('.concise-row-stats-top');
        const statsBottom = clone.querySelector('.concise-row-stats-bottom');

        if (podiumClass) bar.classList.add(podiumClass);
        if (vanguardClass) bar.classList.add(vanguardClass);
        if (isWarEffortRow) bar.classList.add('concise-char-bar-war-effort');
        if (isWarEffortLootRow) {
            bar.classList.add('concise-char-bar-war-effort-loot');
            innerWrap.classList.add('concise-row-inner-war-effort-loot');
        }

        if (isClickable) {
            bar.classList.add('tt-char');
            bar.setAttribute('data-char', cleanName);
            bar.setAttribute('data-spec', activeSpecAttr);
        } else {
            bar.setAttribute('data-spec', 'unspecced');
        }

        bar.setAttribute('data-class', cClass);
        bar.setAttribute('data-awards', awardsAttr.join(','));

        if (rankNumber !== null) {
            const rankTemplate = document.getElementById('tpl-concise-rank-indicator');
            if (rankTemplate) {
                const rankClone = rankTemplate.content.cloneNode(true);
                const rankEl = rankClone.querySelector('.concise-rank-indicator');
                rankEl.classList.add(rankSizeClass, rankToneClass);
                rankEl.textContent = `#${rankNumber}`;
                rankSlot.appendChild(rankClone);
            }
        }

        portrait.src = portraitURL;

        nameEl.textContent = displayName;
        appendConciseBadges(nameEl, conciseBadges);

        if (showVanguardBadge) {
            const vanguardTemplate = document.getElementById('tpl-concise-vanguard-badge');
            if (vanguardTemplate) {
                const vanguardClone = vanguardTemplate.content.cloneNode(true);
                const timeEl = vanguardClone.querySelector('.vanguard-badge-time');
                if (vanguardBadgeTimeText) {
                    timeEl.textContent = vanguardBadgeTimeText;
                    timeEl.hidden = false;
                }
                nameEl.appendChild(vanguardClone);
            }
        }

        appendConciseMeta(metaEl, {
            raceName,
            specIconUrl,
            displaySpecClass,
            isClickable
        });

        if (hashUrl === 'war-effort-loot') {
            statsTop.remove();
            statsBottom.hidden = false;
            statsBottom.classList.add('concise-row-stats-bottom-war-effort-loot');
            if (statsNode) {
                statsBottom.appendChild(statsNode);
            }
        } else {
            statsBottom.remove();
            if (statsNode) {
                statsTop.appendChild(statsNode);
            }
        }

        return clone.firstElementChild;
    }

    function buildConcisePodiumHtml({
        cleanName,
        cClass,
        activeSpecAttr,
        awardsAttr,
        cHex,
        stepClass,
        rank,
        rankColor,
        portraitURL,
        baseName,
        vanguardClass,
        hashUrl,
        deepChar,
        statValue
    }) {
        const template = document.getElementById('tpl-concise-podium');
        if (!template) return null;

        const clone = template.content.cloneNode(true);
        const block = clone.querySelector('.podium-block');
        const crown = clone.querySelector('.podium-crown');
        const vanguard = clone.querySelector('.vanguard-floating-icon');
        const avatar = clone.querySelector('.podium-avatar');
        const rankEl = clone.querySelector('.podium-rank');
        const nameEl = clone.querySelector('.podium-name');
        const pill = clone.querySelector('.podium-pill');
        const statLine = clone.querySelector('.podium-stat-line');
        const statValEl = clone.querySelector('.podium-stat-val');
        const statLabelEl = clone.querySelector('.podium-stat-lbl');
        const trendContainer = clone.querySelector('.podium-trend-container');

        block.classList.add(stepClass);
        block.setAttribute('data-char', cleanName);
        block.setAttribute('data-class', cClass);
        block.setAttribute('data-spec', activeSpecAttr);
        block.setAttribute('data-awards', awardsAttr.join(','));

        if (rank === 1) {
            crown.hidden = false;
        } else {
            crown.hidden = true;
        }

        if (vanguardClass !== '') {
            vanguard.hidden = false;
        }

        avatar.src = portraitURL;
        avatar.alt = baseName || 'Character portrait';

        rankEl.textContent = `#${rank}`;

        nameEl.textContent = baseName;

        if (hashUrl === 'war-effort-hk') {
            const trendVal = deepChar && deepChar.profile ? (deepChar.profile.trend_pvp || deepChar.profile.trend_hks || 0) : 0;
            statValEl.textContent = `+${trendVal.toLocaleString()}`;
            statValEl.classList.add('text-hk');
            statLabelEl.textContent = 'HKs';
            trendContainer.remove();
        } else if (hashUrl === 'war-effort-xp' && window.warEffortContext && window.warEffortContext[cleanName]) {
            statValEl.textContent = `+${window.warEffortContext[cleanName]}`;
            statValEl.classList.add('text-xp');
            statLabelEl.textContent = 'Levels';
            trendContainer.remove();
        } else if (hashUrl === 'war-effort-loot' && window.warEffortContext && window.warEffortContext[cleanName]) {
            statValEl.textContent = window.warEffortContext[cleanName].length;
            statValEl.classList.add('text-loot');
            statLabelEl.textContent = 'Epics';
            trendContainer.remove();
        } else if (hashUrl === 'war-effort-zenith' && window.warEffortContext && window.warEffortContext[cleanName]) {
            statLine.remove();
            trendContainer.remove();

            const zenithEl = document.createElement('div');
            zenithEl.className = 'text-zenith';
            zenithEl.textContent = window.warEffortContext[cleanName].split(' ')[0];
            pill.appendChild(zenithEl);
        } else if (hashUrl === 'ladder-pve') {
            const trendVal = deepChar && deepChar.profile ? (deepChar.profile.trend_pve || deepChar.profile.trend_ilvl || 0) : 0;
            statValEl.textContent = statValue;
            statValEl.classList.add('text-ilvl');
            statLabelEl.textContent = 'iLvl';
            trendContainer.appendChild(createTrendSpan(trendVal, 'podium'));
        } else if (hashUrl === 'ladder-pvp') {
            const trendVal = deepChar && deepChar.profile ? (deepChar.profile.trend_pvp || deepChar.profile.trend_hks || 0) : 0;
            statValEl.textContent = statValue;
            statValEl.classList.add('text-hk');
            statLabelEl.textContent = 'HKs';
            trendContainer.appendChild(createTrendSpan(trendVal, 'podium'));
        } else {
            trendContainer.remove();
        }

        return clone.firstElementChild;
    }

    // Variable to track current sort method
    let currentSortMethod = 'level';

    function renderConciseList(title, characters, isRawMode = false) {
        conciseViewTitle.textContent = title;

        // Apply Sorting before mapping HTML
        let sortedCharacters = [...characters];
        const hashUrl = window.location.hash.substring(1);

        sortedCharacters.sort((a, b) => {
            let valA, valB;
            
            // Handle Raw vs Full data structures
            const profA = isRawMode ? (rosterData.find(c => c.profile && c.profile.name === a.name)?.profile || a) : (a.profile || a);
            const profB = isRawMode ? (rosterData.find(c => c.profile && c.profile.name === b.name)?.profile || b) : (b.profile || b);
            const nameA = (profA.name || '').toLowerCase();
            const nameB = (profB.name || '').toLowerCase();

            // Override sorting for ALL War Effort challenges
            if (hashUrl.startsWith('war-effort-')) {
                const type = hashUrl.replace('war-effort-', '');
                
                // --- NEW: FORCE VANGUARDS TO HOLD TOP 3 RANKS ---
                if (window.warEffortVanguards && window.warEffortVanguards[type]) {
                    const vanguards = window.warEffortVanguards[type];
                    const idxA = vanguards.indexOf(nameA);
                    const idxB = vanguards.indexOf(nameB);
                    
                    // If both are Vanguards, keep their locked 1st/2nd/3rd order
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    // If only A is a Vanguard, A wins
                    if (idxA !== -1) return -1;
                    // If only B is a Vanguard, B wins
                    if (idxB !== -1) return 1;
                }
                
                if (hashUrl === 'war-effort-xp' && window.warEffortContext) {
                    valA = window.warEffortContext[nameA] || 0;
                    valB = window.warEffortContext[nameB] || 0;
                    return valB - valA; // High to Low Contributions
                } else if (hashUrl === 'war-effort-zenith' && window.warEffortContextRaw) {
                    valA = window.warEffortContextRaw[nameA] || Infinity;
                    valB = window.warEffortContextRaw[nameB] || Infinity;
                    return valA - valB; // Low to High (Earliest to hit 70 wins!)
                } else if (hashUrl === 'war-effort-loot' && window.warEffortContext) {
                    valA = window.warEffortContext[nameA] ? window.warEffortContext[nameA].length : 0;
                    valB = window.warEffortContext[nameB] ? window.warEffortContext[nameB].length : 0;
                    return valB - valA; // High to Low Contributions (Array length)
                } else if (hashUrl === 'war-effort-hk') {
                    valA = profA.trend_pvp || profA.trend_hks || 0;
                    valB = profB.trend_pvp || profB.trend_hks || 0;
                    return valB - valA; // High to Low Contributions
                }
            }

            if (currentSortMethod === 'ilvl') {
                valA = profA.equipped_item_level || 0;
                valB = profB.equipped_item_level || 0;
                return valB - valA; // High to Low
            } else if (currentSortMethod === 'level') {
                valA = profA.level || 0;
                valB = profB.level || 0;
                return valB - valA; // High to Low
            } else if (currentSortMethod === 'hks') {
                valA = profA.honorable_kills || 0;
                valB = profB.honorable_kills || 0;
                return valB - valA; // High to Low
            } else if (currentSortMethod === 'name') {
                return nameA.localeCompare(nameB); // A to Z
            } else if (currentSortMethod === 'badges') {
                // --- NEW: Sort by Total Badge Count ---
                const getScore = (prof) => {
                    const vCount = safeParseArray(prof.vanguard_badges).length;
                    const cCount = safeParseArray(prof.campaign_badges).length;
                    const pve = parseInt(prof.pve_champ_count) || 0;
                    const pvp = parseInt(prof.pvp_champ_count) || 0;
                    return vCount + cCount + pve + pvp;
                };
                return getScore(profB) - getScore(profA); // High to Low
            }
            return 0;
        });

        

        // Generate the HTML for the list
        const usePodium = hashUrl === 'ladder-pve' || hashUrl === 'ladder-pvp' || hashUrl.startsWith('war-effort-');
        const podiumNodes = [];
        const listItemNodes = [];

        sortedCharacters.forEach((char, index) => {
            let statLabel = currentSortMethod === 'hks' ? 'HKs' : 'iLvl';
            
            // 1. Identify if we have a deep profile
            let deepChar = isRawMode ? rosterData.find(c => c.profile && c.profile.name && c.profile.name.toLowerCase() === char.name.toLowerCase()) : char;
            
            // 2. Setup Variables
            let isClickable = false;
            let cleanName = ''; // <--- NEW: Strict logic name
            let baseName = '';
            let displayName, cClass, raceName, cHex, portraitURL, level;
            let activeSpecAttr = 'unspecced';
            let specIconUrl = '';
            let displaySpecClass = '';
            let statValue = '???';
            let statValueClass = '';
            let trendNode = null;
            let awardsAttr = [];
            let conciseBadges = [];

            // 3. Populate Variables
            if (deepChar && deepChar.profile) {
                const p = deepChar.profile;
                isClickable = true;
                
                const guildRank = p.guild_rank || 'Member';
                const vBadges = safeParseArray(p.vanguard_badges || char.vanguard_badges || deepChar.vanguard_badges);
                const cBadges = safeParseArray(p.campaign_badges || char.campaign_badges || deepChar.campaign_badges);
                const vCount = vBadges.length;
                const cCount = cBadges.length;
                const pveChamp = parseInt(p.pve_champ_count || char.pve_champ_count || deepChar.pve_champ_count) || 0;
                const pvpChamp = parseInt(p.pvp_champ_count || char.pvp_champ_count || deepChar.pvp_champ_count) || 0;
                const pveGold = parseInt(p.pve_gold || char.pve_gold || deepChar.pve_gold) || 0;
                const pveSilver = parseInt(p.pve_silver || char.pve_silver || deepChar.pve_silver) || 0;
                const pveBronze = parseInt(p.pve_bronze || char.pve_bronze || deepChar.pve_bronze) || 0;
                const pvpGold = parseInt(p.pvp_gold || char.pvp_gold || deepChar.pvp_gold) || 0;
                const pvpSilver = parseInt(p.pvp_silver || char.pvp_silver || deepChar.pvp_silver) || 0;
                const pvpBronze = parseInt(p.pvp_bronze || char.pvp_bronze || deepChar.pvp_bronze) || 0;

                const prevMvps = config.prev_mvps || {};
                const isPveReigning = prevMvps.pve && prevMvps.pve.name && prevMvps.pve.name.toLowerCase() === (p.name || '').toLowerCase();
                const isPvpReigning = prevMvps.pvp && prevMvps.pvp.name && prevMvps.pvp.name.toLowerCase() === (p.name || '').toLowerCase();

                // 1. Build the data-awards attribute for the Bubbles
                if (pveGold > 0) awardsAttr.push('pve_gold');
                if (pveSilver > 0) awardsAttr.push('pve_silver');
                if (pveBronze > 0) awardsAttr.push('pve_bronze');
                if (pvpGold > 0) awardsAttr.push('pvp_gold');
                if (pvpSilver > 0) awardsAttr.push('pvp_silver');
                if (pvpBronze > 0) awardsAttr.push('pvp_bronze');
                if (pveChamp > 0) awardsAttr.push('mvp_pve');
                if (pvpChamp > 0) awardsAttr.push('mvp_pvp');
                if (vCount > 0) awardsAttr.push('vanguard');
                if (cCount > 0) awardsAttr.push('campaign');

                // 2. Generate the dynamic date tooltips
                const tPveGold = getDetailedBadgeTooltip(p.name, ['pve_gold'], `${pveGold}x PvE Gold Medal`, pveGold);
                const tPveSilver = getDetailedBadgeTooltip(p.name, ['pve_silver'], `${pveSilver}x PvE Silver Medal`, pveSilver);
                const tPveBronze = getDetailedBadgeTooltip(p.name, ['pve_bronze'], `${pveBronze}x PvE Bronze Medal`, pveBronze);
                const tPvpGold = getDetailedBadgeTooltip(p.name, ['pvp_gold'], `${pvpGold}x PvP Gold Medal`, pvpGold);
                const tPvpSilver = getDetailedBadgeTooltip(p.name, ['pvp_silver'], `${pvpSilver}x PvP Silver Medal`, pvpSilver);
                const tPvpBronze = getDetailedBadgeTooltip(p.name, ['pvp_bronze'], `${pvpBronze}x PvP Bronze Medal`, pvpBronze);
                const tPveChamp = getDetailedBadgeTooltip(p.name, ['mvp_pve'], `${pveChamp}x PvE Champion`, pveChamp);
                const tPvpChamp = getDetailedBadgeTooltip(p.name, ['mvp_pvp'], `${pvpChamp}x PvP Champion`, pvpChamp);
                const tVanguard = getDetailedBadgeTooltip(p.name, ['vanguard'], summarizeBadges(vBadges), vCount);
                const tCampaign = getDetailedBadgeTooltip(p.name, ['campaign'], summarizeBadges(cBadges), cCount);

                conciseBadges = [];

                if (isPveReigning) {
                    conciseBadges.push({
                        text: '👑 Reigning MVP',
                        title: 'Current Reigning PvE Champion!',
                        classNames: ['c-badge-reigning', 'c-badge-reigning-pve']
                    });
                }

                if (isPvpReigning) {
                    conciseBadges.push({
                        text: '⚔️ Reigning MVP',
                        title: 'Current Reigning PvP Champion!',
                        classNames: ['c-badge-reigning', 'c-badge-reigning-pvp']
                    });
                }

                if (pveGold > 0) {
                    conciseBadges.push({
                        text: `🛡️🥇 ${pveGold}`,
                        title: tPveGold,
                        classNames: ['c-badge-pill', 'c-badge-gold']
                    });
                }

                if (pveSilver > 0) {
                    conciseBadges.push({
                        text: `🛡️🥈 ${pveSilver}`,
                        title: tPveSilver,
                        classNames: ['c-badge-pill', 'c-badge-silver']
                    });
                }

                if (pveBronze > 0) {
                    conciseBadges.push({
                        text: `🛡️🥉 ${pveBronze}`,
                        title: tPveBronze,
                        classNames: ['c-badge-pill', 'c-badge-bronze']
                    });
                }

                if (pvpGold > 0) {
                    conciseBadges.push({
                        text: `⚔️🥇 ${pvpGold}`,
                        title: tPvpGold,
                        classNames: ['c-badge-pill', 'c-badge-gold']
                    });
                }

                if (pvpSilver > 0) {
                    conciseBadges.push({
                        text: `⚔️🥈 ${pvpSilver}`,
                        title: tPvpSilver,
                        classNames: ['c-badge-pill', 'c-badge-silver']
                    });
                }

                if (pvpBronze > 0) {
                    conciseBadges.push({
                        text: `⚔️🥉 ${pvpBronze}`,
                        title: tPvpBronze,
                        classNames: ['c-badge-pill', 'c-badge-bronze']
                    });
                }

                if (pveChamp > 0) {
                    conciseBadges.push({
                        text: `👑 ${pveChamp}`,
                        title: tPveChamp,
                        classNames: ['c-badge-pill', 'c-badge-pve']
                    });
                }

                if (pvpChamp > 0) {
                    conciseBadges.push({
                        text: `⚔️ ${pvpChamp}`,
                        title: tPvpChamp,
                        classNames: ['c-badge-pill', 'c-badge-pvp']
                    });
                }

                if (vCount > 0) {
                    conciseBadges.push({
                        text: `🌟 ${vCount}`,
                        title: tVanguard,
                        classNames: ['c-badge-pill', 'c-badge-vanguard']
                    });
                }

                if (cCount > 0) {
                    conciseBadges.push({
                        text: `🎖️ ${cCount}`,
                        title: tCampaign,
                        classNames: ['c-badge-pill', 'c-badge-campaign']
                    });
                }

                baseName = p.name || 'Unknown';
                cleanName = (p.name || 'Unknown').toLowerCase();
                displayName = p.name || 'Unknown';
                cClass = getCharClass(deepChar);
                raceName = p.race && p.race.name ? (typeof p.race.name === 'string' ? p.race.name : (p.race.name.en_US || 'Unknown')) : 'Unknown';
                cHex = CLASS_COLORS[cClass] || "#fff";
                portraitURL = deepChar.render_url || getClassIcon(cClass);
                level = p.level || 0;
                
                const activeSpec = p.active_spec ? p.active_spec : '';
                activeSpecAttr = activeSpec ? activeSpec : 'unspecced';
                specIconUrl = getSpecIcon(cClass, activeSpec) || '';
                displaySpecClass = activeSpec ? `${activeSpec} ${cClass}` : cClass;
                
                statValue = currentSortMethod === 'hks' ? (p.honorable_kills || 0).toLocaleString() : (p.equipped_item_level || 0);
                statValueClass = currentSortMethod === 'hks' ? ' c-val-ilvl-hks' : '';

                // Calculate Trend based on the current ladder view
                if (currentSortMethod === 'hks' || currentSortMethod === 'ilvl') {
                    const trend = currentSortMethod === 'hks' ? (p.trend_pvp || p.trend_hks || 0) : (p.trend_pve || p.trend_ilvl || 0);
                    trendNode = buildConciseTrendHtml(trend);
                }
            } else {
                baseName = char.name || 'Unknown';
                cleanName = (char.name || 'Unknown').toLowerCase();
                displayName = char.name || 'Unknown';
                cClass = char.class || 'Unknown';
                raceName = char.race || 'Unknown';
                cHex = CLASS_COLORS[cClass] || "#fff";
                portraitURL = getClassIcon(cClass);
                level = char.level || 0;
                displaySpecClass = cClass;
            }

            // Inject Podium Classes & Rank Number if we are on a Ladder View
            const isLadderView = hashUrl === 'ladder-pve' || hashUrl === 'ladder-pvp';
            let podiumClass = '';
            let rankNumber = null;
            let rankToneClass = '';
            let rankSizeClass = '';

            if (isLadderView) {
                podiumClass = index === 0 ? 'podium-1' : index === 1 ? 'podium-2' : index === 2 ? 'podium-3' : '';
                rankToneClass = index === 0 ? 'concise-rank-gold' : index === 1 ? 'concise-rank-silver' : index === 2 ? 'concise-rank-bronze' : 'concise-rank-default';
                rankSizeClass = index < 3 ? 'rank-size-large' : 'rank-size-small';
                rankNumber = index + 1;
            }

            // --- NEW: Vanguard Aura Logic ---
            let vanguardClass = '';
            let showVanguardBadge = false;
            let vanguardBadgeTimeText = '';
            if (hashUrl.startsWith('war-effort-') && window.warEffortVanguards) {
                const type = hashUrl.replace('war-effort-', '');
                if (window.warEffortVanguards[type] && window.warEffortVanguards[type].includes(cleanName)) {
                    vanguardClass = 'vanguard-aura';
                    showVanguardBadge = true;

                    // Grab the locked timestamp and format it nicely (24-Hour)
                    if (window.warEffortLockTimes && window.warEffortLockTimes[type]) {
                        const dt = new Date(window.warEffortLockTimes[type]);
                        if (!isNaN(dt)) {
                            vanguardBadgeTimeText = `(${dt.toLocaleString('en-GB', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:false}).replace(',', '')})`;
                        }
                    }
                }
            }

            // --- NEW: Custom War Effort Stats Overrides ---
            const defaultStatsTemplate = document.getElementById('tpl-concise-default-stats');
            let statsNode = null;

            if (defaultStatsTemplate) {
                const defaultStatsClone = defaultStatsTemplate.content.cloneNode(true);
                const levelEl = defaultStatsClone.querySelector('[data-role="level-value"]');
                const labelEl = defaultStatsClone.querySelector('[data-role="stat-label"]');
                const valueEl = defaultStatsClone.querySelector('[data-role="stat-value"]');
                const trendSlot = defaultStatsClone.querySelector('[data-role="trend-slot"]');

                levelEl.textContent = level;
                labelEl.textContent = `${statLabel} `;
                valueEl.textContent = statValue;

                if (statValueClass) {
                    valueEl.classList.add(statValueClass.trim());
                }

                if (trendNode) {
                    trendSlot.replaceWith(trendNode);
                } else {
                    trendSlot.remove();
                }

                statsNode = defaultStatsClone;
            }
            let isWarEffortRow = false;
            let isWarEffortLootRow = false;

            if (hashUrl.startsWith('war-effort-')) {
                // By default, stretch the bars
                isWarEffortRow = true;
                
                if (hashUrl === 'war-effort-hk') {
                    const trendVal = deepChar && deepChar.profile ? (deepChar.profile.trend_pvp || deepChar.profile.trend_hks || 0) : 0;
                    const hkTemplate = document.getElementById('tpl-we-stat-hk');
                    if (hkTemplate) {
                        const hkClone = hkTemplate.content.cloneNode(true);
                        const hkEl = hkClone.querySelector('.we-stat-hk');
                        hkEl.textContent = `+${trendVal.toLocaleString()} HKs Contributed`;

                        statsNode = hkClone;
                    }
                } else if (window.warEffortContext) {
                    const charKey = cleanName; // FIXED: Using cleanName
                    const contextData = window.warEffortContext[charKey];
                    
                    if (contextData) {
                        if (hashUrl === 'war-effort-xp') {
                            const xpTemplate = document.getElementById('tpl-we-stat-xp');
                            if (xpTemplate) {
                                const xpClone = xpTemplate.content.cloneNode(true);
                                const xpEl = xpClone.querySelector('.we-stat-xp');
                                xpEl.textContent = `+${contextData} Levels Contributed`;

                                statsNode = xpClone;
                            }
                        } else if (hashUrl === 'war-effort-loot') {
                            // Turn the main bar into a column so we can stack the character info on top, and loot on the bottom
                            isWarEffortLootRow = true;

                            const lootTemplate = document.getElementById('tpl-we-stat-loot');
                            const lootBadgeTemplate = document.getElementById('tpl-we-loot-badge');

                            if (lootTemplate && lootBadgeTemplate) {
                                const lootClone = lootTemplate.content.cloneNode(true);
                                const lootContainer = lootClone.querySelector('.we-loot-container');

                                contextData.forEach(itemData => {
                                    const badgeClone = lootBadgeTemplate.content.cloneNode(true);
                                    const badgeEl = badgeClone.querySelector('.we-loot-badge');
                                    const lootLinkTemplate = document.getElementById('tpl-we-loot-link');

                                    if (lootLinkTemplate) {
                                        const linkClone = lootLinkTemplate.content.cloneNode(true);
                                        const linkEl = linkClone.querySelector('.we-loot-link');
                                        linkEl.href = `https://www.wowhead.com/wotlk/item=${itemData.itemId}`;
                                        linkEl.classList.add(itemData.qualityClass);
                                        linkEl.textContent = `[${itemData.itemName}]`;
                                        badgeEl.appendChild(linkClone);
                                    }

                                    lootContainer.appendChild(badgeClone);
                                });

                                statsNode = lootClone;
                            }
                        } else if (hashUrl === 'war-effort-zenith') {
                            const zenithTemplate = document.getElementById('tpl-we-stat-zenith');
                            if (zenithTemplate) {
                                const zenithClone = zenithTemplate.content.cloneNode(true);
                                const zenithVal = zenithClone.querySelector('.we-zenith-val');
                                zenithVal.textContent = contextData;

                                statsNode = zenithClone;
                            }
                        }
                    }
                }
            }

            // 4. Render the HTML Row (or intercept for Podium)
            const rowNode = buildConciseRowHtml({
                isClickable,
                cleanName,
                cClass,
                activeSpecAttr,
                awardsAttr,
                cHex,
                isWarEffortRow,
                isWarEffortLootRow,
                rankNumber,
                rankToneClass,
                rankSizeClass,
                portraitURL,
                displayName,
                conciseBadges,
                showVanguardBadge,
                vanguardBadgeTimeText,
                raceName,
                specIconUrl,
                displaySpecClass,
                statsNode,
                hashUrl,
                vanguardClass,
                podiumClass
            });

            // Intercept and Build Podium Block for Top 3
            if (usePodium && index < 3) {
                const rank = index + 1;
                const stepClass = rank === 1 ? 'podium-step-1' : (rank === 2 ? 'podium-step-2' : 'podium-step-3');
                const rankColor = rank === 1 ? '#ffd100' : (rank === 2 ? '#c0c0c0' : '#cd7f32');
                
                const podiumNode = buildConcisePodiumHtml({
                    cleanName,
                    cClass,
                    activeSpecAttr,
                    awardsAttr,
                    cHex,
                    stepClass,
                    rank,
                    rankColor,
                    portraitURL,
                    baseName,
                    vanguardClass,
                    hashUrl,
                    deepChar,
                    statValue
                });

                if (podiumNode) {
                    podiumNodes.push(podiumNode);
                }
            } else if (rowNode) {
                listItemNodes.push(rowNode);
            }
        });
        
        conciseList.textContent = '';

        if (usePodium && podiumNodes.length > 0) {
            const podiumWrapTemplate = document.getElementById('tpl-home-leaderboard-podium-wrap');
            const listWrapTemplate = document.getElementById('tpl-home-leaderboard-list-wrap');

            const podiumWrap = podiumWrapTemplate?.content?.firstElementChild?.cloneNode(true);
            const listWrap = listWrapTemplate?.content?.firstElementChild?.cloneNode(true);

            if (podiumWrap) {
                podiumNodes.forEach(node => {
                    if (node) podiumWrap.appendChild(node);
                });
                conciseList.appendChild(podiumWrap);
            }

            if (listWrap) {
                listItemNodes.forEach(node => {
                    if (node) listWrap.appendChild(node);
                });
                conciseList.appendChild(listWrap);
            }
        } else {
            listItemNodes.forEach(node => {
                if (node) conciseList.appendChild(node);
            });
        }
        
        let templateId = null;
        if (hashUrl === 'badges' || currentSortMethod === 'badges') {
            templateId = 'tpl-sort-badges';
        } else if (!hashUrl.startsWith('war-effort-')) {
            templateId = 'tpl-sort-default';
        }
        
        if (templateId) {
            const template = document.getElementById(templateId);
            if (template) {
                const clone = template.content.cloneNode(true);
                const select = clone.querySelector('.concise-sort-dropdown');
                if (select) {
                    select.value = currentSortMethod;
                    select.id = 'concise-sort-dropdown'; 
                }
                conciseList.insertBefore(clone, conciseList.firstChild);
            }
        }

        // Bind the event listener to the newly created dropdown if it exists
        const sortDropdown = document.getElementById('concise-sort-dropdown');
        if (sortDropdown) {
            sortDropdown.addEventListener('change', function(e) {
                currentSortMethod = e.target.value;
                // Re-render the list with the exact same parameters but new sort
                renderConciseList(title, characters, isRawMode);
                
                // Re-apply any active spec filters to the newly rendered HTML
                if (typeof applyTimelineFilters === 'function') {
                     // Trigger a click on the active badge to re-filter the DOM elements
                     const activeBadge = document.querySelector('.dynamic-badge.active-filter');
                     if (activeBadge) {
                         // Briefly remove the class so the click handler re-applies it correctly
                         activeBadge.classList.remove('active-filter'); 
                         activeBadge.click();
                     }
                }
            });
        } 

        setupTooltips();
    }

    function setupTooltips() {
        const tt_chars = document.querySelectorAll('.tt-char:not(.tt-bound)');
        tt_chars.forEach(trigger => {
            trigger.classList.add('tt-bound');
            
            trigger.addEventListener('mousemove', e => {
                const charName = trigger.getAttribute('data-char');
                const char = rosterData.find(c => c.profile && c.profile.name && c.profile.name.toLowerCase() === charName);
                if (!char) return;
                
                const p = char.profile || {};
                const st = char.stats || {};
                const cClass = getCharClass(char);
                const powerName = getPowerName(cClass);
                const raceName = p.race && p.race.name ? (typeof p.race.name === 'string' ? p.race.name : (p.race.name.en_US || 'Unknown')) : 'Unknown';
                const cHex = CLASS_COLORS[cClass] || "#ffd100";
                
                const activeSpec = p.active_spec ? p.active_spec : '';
                const specIconUrl = getSpecIcon(cClass, activeSpec);
                const displaySpecClass = activeSpec ? `${activeSpec} ${cClass}` : cClass;
                
                // --- NEW: Grab the Guild Rank & MVP Badges (Scope-Safe) ---
                const guildRank = p.guild_rank || 'Member';
                const vBadges = safeParseArray(p.vanguard_badges || char.vanguard_badges);
                const cBadges = safeParseArray(p.campaign_badges || char.campaign_badges);
                const vCount = vBadges.length;
                const cCount = cBadges.length;
                const pveChamp = parseInt(p.pve_champ_count || char.pve_champ_count) || 0;
                const pvpChamp = parseInt(p.pvp_champ_count || char.pvp_champ_count) || 0;
                const pveGold = parseInt(p.pve_gold || char.pve_gold) || 0;
                const pveSilver = parseInt(p.pve_silver || char.pve_silver) || 0;
                const pveBronze = parseInt(p.pve_bronze || char.pve_bronze) || 0;
                const pvpGold = parseInt(p.pvp_gold || char.pvp_gold) || 0;
                const pvpSilver = parseInt(p.pvp_silver || char.pvp_silver) || 0;
                const pvpBronze = parseInt(p.pvp_bronze || char.pvp_bronze) || 0;

                const tPveGold = getDetailedBadgeTooltip(p.name, ['pve_gold'], `${pveGold}x PvE Gold Medal`, pveGold);
                const tPveSilver = getDetailedBadgeTooltip(p.name, ['pve_silver'], `${pveSilver}x PvE Silver Medal`, pveSilver);
                const tPveBronze = getDetailedBadgeTooltip(p.name, ['pve_bronze'], `${pveBronze}x PvE Bronze Medal`, pveBronze);
                const tPvpGold = getDetailedBadgeTooltip(p.name, ['pvp_gold'], `${pvpGold}x PvP Gold Medal`, pvpGold);
                const tPvpSilver = getDetailedBadgeTooltip(p.name, ['pvp_silver'], `${pvpSilver}x PvP Silver Medal`, pvpSilver);
                const tPvpBronze = getDetailedBadgeTooltip(p.name, ['pvp_bronze'], `${pvpBronze}x PvP Bronze Medal`, pvpBronze);
                const tPveChamp = getDetailedBadgeTooltip(p.name, ['mvp_pve'], `${pveChamp}x PvE Champion`, pveChamp);
                const tPvpChamp = getDetailedBadgeTooltip(p.name, ['mvp_pvp'], `${pvpChamp}x PvP Champion`, pvpChamp);
                const tVanguard = getDetailedBadgeTooltip(p.name, ['vanguard'], summarizeBadges(vBadges), vCount);
                const tCampaign = getDetailedBadgeTooltip(p.name, ['campaign'], summarizeBadges(cBadges), cCount);

                tooltip.innerHTML = '';
                const template = document.getElementById('tpl-char-tooltip');
                if (template) {
                    const clone = template.content.cloneNode(true);
                    
                    const nameWrap = clone.querySelector('.tooltip-name-wrap');
                    nameWrap.style.color = cHex;
                    clone.querySelector('.tooltip-char-name').textContent = p.name || 'Unknown';
                    
                    const badgesContainer = clone.querySelector('.tooltip-badges-container');
                    badgesContainer.className = 'tt-badge-container';
                    
                    const addBadge = (count, title, cssClass, icon) => {
                        if (count > 0) {
                            const badge = document.createElement('span');
                            badge.className = `tt-badge ${cssClass}`;
                            badge.title = title;
                            badge.textContent = `${icon} ${count}`;
                            badgesContainer.appendChild(badge);
                        }
                    };
                    
                    addBadge(pveGold, tPveGold, 'tt-badge-gold', '🥇');
                    addBadge(pveSilver, tPveSilver, 'tt-badge-silver', '🥈');
                    addBadge(pveBronze, tPveBronze, 'tt-badge-bronze', '🥉');
                    addBadge(pvpGold, tPvpGold, 'tt-badge-gold', '🥇');
                    addBadge(pvpSilver, tPvpSilver, 'tt-badge-silver', '🥈');
                    addBadge(pvpBronze, tPvpBronze, 'tt-badge-bronze', '🥉');
                    addBadge(pveChamp, tPveChamp, 'tt-badge-pve', '👑');
                    addBadge(pvpChamp, tPvpChamp, 'tt-badge-pvp', '⚔️');
                    addBadge(vCount, tVanguard, 'tt-badge-vanguard', '🌟');
                    addBadge(cCount, tCampaign, 'tt-badge-campaign', '🎖️');
                    
                    clone.querySelector('.tooltip-guild-rank').textContent = guildRank;
                    clone.querySelector('.tooltip-level-race').textContent = `${p.level || 0} / ${raceName}`;
                    
                    const classWrap = clone.querySelector('.tooltip-class-wrap');
                    classWrap.style.color = cHex;
                    classWrap.textContent = '';

                    if (specIconUrl) {
                        const tooltipSpecIconTemplate = document.getElementById('tpl-tooltip-spec-icon');
                        if (tooltipSpecIconTemplate) {
                            const specClone = tooltipSpecIconTemplate.content.cloneNode(true);
                            const specImg = specClone.querySelector('.spec-icon-tt');
                            specImg.src = specIconUrl;
                            classWrap.appendChild(specClone);
                        }
                    }

                    classWrap.appendChild(document.createTextNode(displaySpecClass));
                    
                    clone.querySelector('.tooltip-ilvl').textContent = p.equipped_item_level || 0;
                    clone.querySelector('.tooltip-power-label').textContent = powerName;
                    clone.querySelector('.tooltip-health-power').textContent = `${st.health || 0} / ${st.power || 0}`;
                    
                    tooltip.appendChild(clone);
                }
                tooltip.style.borderLeftColor = cHex;
                
                let x = e.clientX + 15;
                let y = e.clientY + 15;
                if (x + 200 > window.innerWidth) x = window.innerWidth - 210;
                
                tooltip.style.left = `${x}px`; tooltip.style.top = `${y}px`;
                tooltip.classList.add('visible');
            });
            trigger.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });
        });
    }

    function applyTimelineFilters() {
        if (!timeline) return;

        const now = Date.now();
        
        // 1. Filter the raw data array directly instead of the DOM elements
        let tempFilteredData = timelineData.filter(event => {
            const charName = (event.character_name || '').toLowerCase();
            const eventType = event.type;
            const timestampStr = event.timestamp || '';
            const itemQuality = event.item_quality || 'COMMON';

            // Filter by Character
            if (window.currentFilteredChars && !window.currentFilteredChars.includes(charName)) return false;

            // --- NEW: Badge Filter Logic ---
            if (tlTypeFilter.startsWith('badge_')) {
                if (eventType !== 'badge') return false; // Show ONLY badges
                if (tlTypeFilter === 'badge_mvp' && event.badge_type !== 'mvp_pve' && event.badge_type !== 'mvp_pvp') return false;
                if (tlTypeFilter === 'badge_vanguard' && event.badge_type !== 'vanguard') return false;
                if (tlTypeFilter === 'badge_campaign' && event.badge_type !== 'campaign') return false;
                
                // FIX: Add the missing logic to evaluate the Medals button
                if (tlTypeFilter === 'badge_ladder' && !['pve_gold','pve_silver','pve_bronze','pvp_gold','pvp_silver','pvp_bronze'].includes(event.badge_type)) return false;
            } else {
                if (eventType === 'badge') return false; // NEVER show badges in normal feeds
                
                // Normal Rarity/Type filters
                if (tlTypeFilter === 'rare_plus') {
                    if (eventType !== 'item') return false;
                    if (itemQuality === 'POOR' || itemQuality === 'COMMON' || itemQuality === 'UNCOMMON') return false;
                } else if (tlTypeFilter === 'epic') {
                    if (eventType !== 'item' || (itemQuality !== 'EPIC' && itemQuality !== 'LEGENDARY')) return false;
                } else if (tlTypeFilter === 'legendary') {
                    if (eventType !== 'item' || itemQuality !== 'LEGENDARY') return false;
                } else if (tlTypeFilter !== 'all' && eventType !== tlTypeFilter) {
                    return false;
                }
            }

            // Filter by Date (Hours)
            if (tlSpecificDate && timestampStr) {
                if (!timestampStr.startsWith(tlSpecificDate)) return false;
            } else if (tlDateFilter !== 'all' && timestampStr) {
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

        // --- NEW: Deduplicate identical badge events in the feed ---
        const uniqueEvents = [];
        const seenKeys = new Set();
        
        tempFilteredData.forEach(e => {
            if (e.type === 'badge') {
                // Ensure a character only gets one timeline row per specific badge category per day
                let dStr = (e.timestamp || '').substring(0, 10);
                const charName = (e.character_name || '').toLowerCase();
                const key = `badge_${charName}_${e.badge_type}_${e.category || ''}_${dStr}`;
                if (!seenKeys.has(key)) {
                    seenKeys.add(key);
                    uniqueEvents.push(e);
                }
            } else {
                // Let items and level-ups pass through normally
                uniqueEvents.push(e);
            }
        });
        
        filteredTimelineData = uniqueEvents;

        // 2. Clear the old feed and reset the counter
        const container = document.getElementById('timeline-feed-container');
        if (container) container.innerHTML = '';
        currentTimelineIndex = 0;

        // 3. Handle empty states or render the first batch
        const noResultsMsg = document.getElementById('tl-no-results');
        if (filteredTimelineData.length === 0) {
            if (container) container.hidden = true;
            if (noResultsMsg) noResultsMsg.hidden = false;

            const loadMoreBtn = document.getElementById('load-more-btn');
            if (loadMoreBtn) loadMoreBtn.hidden = true;
        } else {
            if (container) container.hidden = false;
            if (noResultsMsg) noResultsMsg.hidden = true;
            renderTimelineBatch();
        }
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
        emptyState.style.display = 'none';
        conciseView.style.display = 'none';
        fullCardContainer.style.display = 'none';
        if (analyticsView) analyticsView.style.display = 'none';
        if (architectureView) architectureView.style.display = 'none';
        if (searchInput) searchInput.value = '';
        if (searchAutoComplete) searchAutoComplete.classList.remove('show');
        
        // Show nav search by default on sub-pages
        const navSearch = document.querySelector('.navbar .search-container');
        if (navSearch) navSearch.style.display = 'block';

        if (timeline) timeline.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // --- RESTORE DEFAULT TIMELINE HTML ---
        renderTimelineFilters('tpl-timeline-filters-default');

        tlTypeFilter = 'rare_plus';
        tlDateFilter = 'all';
        tlSpecificDate = null;

        const xpCont = document.getElementById('guild-xp-container');
        if (xpCont) xpCont.style.display = 'none';

        document.querySelectorAll('.tt-heatmap').forEach(c => {
            c.classList.remove('selected-date');
        });
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
                    event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
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
                        if (dynamicBadge && document.getElementById('concise-view').style.display !== 'none') {
                            dynamicBadge.click(); 
                        } else {
                            window.location.hash = 'class-' + clickedClass.toLowerCase();
                        }
                    }
                },
                onHover: (event, elements) => {
                    event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
                },
                plugins: { legend: { display: false } }
            },
            plugins: [createPieOverlayPlugin()]
        });
    }

    function showAnalyticsView() {
        hideAllViews();
        if (analyticsView) analyticsView.style.display = 'block';
        if (navbar) navbar.style.background = '#111';
        if (timeline) timeline.style.display = 'none'; 

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

        // --- LEVEL DISTRIBUTION ---
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
                    onHover: (event, elements) => { event.native.target.style.cursor = elements.length ? 'pointer' : 'default'; }
                },
                plugins: [barLabelPlugin]
            });
        }

        // --- ILVL DISTRIBUTION ---
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
                    onHover: (event, elements) => { event.native.target.style.cursor = elements.length ? 'pointer' : 'default'; }
                },
                plugins: [barLabelPlugin]
            });
        }

        // --- RACE DISTRIBUTION ---
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
                onHover: (event, elements) => { event.native.target.style.cursor = elements.length ? 'pointer' : 'default'; }
            },
            plugins: [createPieOverlayPlugin()]
        });

        // --- NEW: CLASS DISTRIBUTION FOR ANALYTICS ---
        if(analyticsClassChartInst) analyticsClassChartInst.destroy();
        analyticsClassChartInst = createDonutChart('analyticsClassChart', rosterData, false);

        // --- ACTIVITY CHART ---
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

    function bindTimelineFilterControls() {
        document.querySelectorAll('.timeline-filters .tl-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.timeline-filters .tl-btn').forEach(b => b.classList.remove('active'));
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
    }

    function renderTimelineFilters(templateId) {
        const filtersContainer = document.querySelector('.timeline-filters');
        const template = document.getElementById(templateId);
        if (!filtersContainer || !template) return;

        filtersContainer.textContent = '';
        filtersContainer.appendChild(template.content.cloneNode(true));
        bindTimelineFilterControls();
    }

    function showArchitectureView() {
        hideAllViews();
        if (architectureView) architectureView.style.display = 'block';
        if (navbar) navbar.style.background = '#111';
        if (timeline) timeline.style.display = 'none'; 
    }

    window.returnToHome = function() {
        window.location.hash = '';
        showHomeView();
    }

    function showHomeView() {
        hideAllViews();
        emptyState.style.display = 'block';
        if (navbar) navbar.style.background = 'rgba(15, 15, 15, 0.85)';
        updateDropdownLabel('all');

        // Hide nav search purely on the homepage
        const navSearch = document.querySelector('.navbar .search-container');
        if (navSearch) navSearch.style.display = 'none';

        const xpCont = document.getElementById('guild-xp-container');
        if (xpCont) xpCont.style.display = 'block';
        
        // Calculate the War Effort data AND monuments first
        if (typeof window.renderGuildXPBar === 'function') window.renderGuildXPBar();

        // Now that monuments exist, apply timeline filters to render them at the top
        if (timeline) { 
            timeline.style.display = 'block'; 
            timelineTitle.innerHTML = "📜 Guild Recent Activity"; 
            window.currentFilteredChars = null; 
            applyTimelineFilters(); 
        }

        // Populate New KPIs
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
        if (kpiHks) kpiHks.innerText = totalHks >= 1000000 ? (totalHks/1000000).toFixed(1) + 'M' : totalHks.toLocaleString();

        const statAvgIlvl = document.getElementById('stat-avgilvl');
        if (statAvgIlvl) statAvgIlvl.onclick = () => { window.location.hash = 'ladder-pve'; };
        
        const statHks = document.getElementById('stat-hks');
        if (statHks) statHks.onclick = () => { window.location.hash = 'ladder-pvp'; };

        // "Yesterday" Sparklines & Math
        if (heatmapData && heatmapData.length >= 2) {
            const today = heatmapData[heatmapData.length - 1];
            const yesterday = heatmapData[heatmapData.length - 2];
            
            function applyTrend(elementId, todayVal, yestVal) {
                const el = document.getElementById(elementId);
                if (!el || yestVal == null) return;
                const diff = todayVal - yestVal;
                
                el.textContent = '';
                const span = document.createElement('span');
                
                if (diff > 0) {
                    span.textContent = `▲ ${diff}`;
                    span.classList.add('trend-positive');
                } else if (diff < 0) {
                    span.textContent = `▼ ${Math.abs(diff)}`;
                    span.classList.add('trend-negative');
                } else {
                    span.textContent = `-`;
                    span.classList.add('trend-neutral');
                }
                
                el.appendChild(span);
            }

            applyTrend('trend-total', today.total_roster, yesterday.total_roster);
            applyTrend('trend-active', today.active_roster, yesterday.active_roster);
            // Raid Ready math isn't stored historically in heatmapData, so we leave it static or estimate it

            // Draw Sparklines
            function drawSpark(canvasId, dataKey, colorStr) {
                const ctx = document.getElementById(canvasId);
                if (!ctx) return;
                const dataPoints = heatmapData.map(d => d[dataKey] || 0);
                new Chart(ctx, {
                    type: 'line',
                    data: { labels: heatmapData.map(d => d.day_name), datasets: [{ data: dataPoints, borderColor: colorStr, borderWidth: 2, tension: 0.4, pointRadius: 0 }] },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false, min: Math.min(...dataPoints) * 0.95 } } }
                });
            }
            drawSpark('spark-total', 'total_roster', 'rgba(255, 209, 0, 0.5)');
            drawSpark('spark-active', 'active_roster', 'rgba(46, 204, 113, 0.5)');
        }

        // Recent Milestones logic (Fading Rotator)
        if (timelineData && timelineData.length > 0) {
            const milestoneCont = document.getElementById('recent-milestones-container');
            const milestoneText = document.getElementById('milestone-text');

            if (milestoneCont && milestoneText) {
                // 1. Grab the top 5 most recent milestones
                const recentEvents = timelineData.filter(e => 
                    (e.type === 'item' && (e.item_quality === 'EPIC' || e.item_quality === 'LEGENDARY')) || 
                    (e.type === 'level_up' && e.level === 70)
                ).slice(0, 5);

                if (recentEvents.length > 0) {
                    milestoneCont.style.display = 'flex';
                    milestoneText.classList.add('milestone-text-rotator');

                    // 2. Pre-build the DOM elements for all 5 events
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

                    // 3. Initialize the first slide
                    milestoneText.textContent = '';
                    milestoneText.appendChild(slideElements[0].cloneNode(true));

                    // 4. Start the rotating carousel if there is more than 1 event
                    if (slideElements.length > 1) {
                        let currentSlide = 0;

                        if (window.milestoneInterval) clearInterval(window.milestoneInterval);

                        window.milestoneInterval = setInterval(() => {
                            milestoneText.style.opacity = '0';

                            setTimeout(() => {
                                currentSlide = (currentSlide + 1) % slideElements.length;
                                milestoneText.textContent = '';
                                milestoneText.appendChild(slideElements[currentSlide].cloneNode(true));
                                milestoneText.style.opacity = '1';
                            }, 500);

                        }, 4500);
                    }
                } else {
                    milestoneCont.style.display = 'none';
                }
            }
        }
		
		// Trigger the MVP render
        if (typeof renderMVPs === 'function') renderMVPs();
    }

    window.selectCharacter = function(charName) {
        window.location.hash = charName;
    }

    // Added defaultSort parameter to override the standard "level" start
    function showConciseView(title, characters, isRawRoster = false, showBadges = true, defaultSort = 'level') {
        hideAllViews();
        conciseView.style.display = 'flex';
        if (navbar) navbar.style.background = '#111';
        
        currentSortMethod = defaultSort; // Apply the requested sort method immediately
        renderConciseList(title, characters, isRawRoster);
        
        window.currentFilteredChars = characters.map(c => {
            if (isRawRoster) return c.name ? c.name.toLowerCase() : '';
            return c.profile && c.profile.name ? c.profile.name.toLowerCase() : '';
        });
        
        const hash = window.location.hash.substring(1);
        const chartViews = ['total', 'active', 'raidready', 'ladder-pve', 'ladder-pvp'];

        const wrapper = document.getElementById('concise-content-wrapper');
        const leftCol = document.getElementById('concise-left-col');
        const badgesContainer = document.getElementById('concise-class-badges');

        if (showBadges === true) {
            renderDynamicBadges(characters, isRawRoster);
            leftCol.style.display = 'flex';
            
            // Restore default column layout
            wrapper.style.flexDirection = 'row';
            leftCol.style.maxWidth = '350px';
            leftCol.style.width = 'auto';
            badgesContainer.style.flexWrap = 'wrap';
            badgesContainer.style.justifyContent = 'center';
            badgesContainer.style.maxWidth = '900px';
            
            // FIX: Reset inline padding/margins when leaving the Hall of Heroes
            badgesContainer.style.overflowX = 'visible'; 
            badgesContainer.style.padding = ''; 
            badgesContainer.style.marginTop = '';
            
            if (timeline) {
                timeline.style.width = ''; 
                timeline.style.maxWidth = ''; // Reset timeline width
            }
            
        } else if (showBadges === 'awards') {
            renderAwardFilterBadges(characters, isRawRoster);
            leftCol.style.display = 'flex';
            
            // Stack layout: Bubbles single-file on top, character list stretched wide below
            wrapper.style.flexDirection = 'column';
            leftCol.style.maxWidth = '100%';
            leftCol.style.width = '100%';
            badgesContainer.style.flexWrap = 'nowrap';
            badgesContainer.style.justifyContent = 'flex-start';
            badgesContainer.style.maxWidth = '100%';
            badgesContainer.style.overflowX = 'auto'; // Allows horizontal scroll if screen is too small
            
            // FIX: Generous internal padding gives the bubbles room to grow without getting severed
            badgesContainer.style.padding = '15px 10px 25px 10px';
            badgesContainer.style.marginTop = '-10px';
            
            // Stretch the activity feed slightly, but keep it responsive for mobile!
            if (timeline) {
                timeline.style.width = '100%'; 
                timeline.style.maxWidth = '440px'; 
            }
            
        } else {
            badgesContainer.style.display = 'none';
            const specContainer = document.getElementById('concise-spec-container');
            if (specContainer) specContainer.hidden = true;
            
            // Restore default column layout
            wrapper.style.flexDirection = 'row';
            leftCol.style.maxWidth = '350px';
            leftCol.style.width = 'auto';
            if (timeline) {
                timeline.style.width = ''; 
                timeline.style.maxWidth = ''; // Reset timeline width
            }
            
            if (!chartViews.includes(hash)) {
                leftCol.style.display = 'none';
            } else {
                leftCol.style.display = 'flex';
            }
        }

       // Draw the dynamic charts & KPIs
        const donutContainer = document.getElementById('concise-donut-container');

        if (chartViews.includes(hash)) {
            if (donutContainer) {
                donutContainer.classList.add('is-visible');
                
               donutContainer.textContent = '';
                const template = document.getElementById('tpl-concise-dashboard-widgets');
                if (template) {
                    donutContainer.appendChild(template.content.cloneNode(true));
                }
                const kpiContainer = donutContainer.querySelector('.concise-kpi-container');
                
                const addKpi = (val, label, colorHex) => {
                    const kpiTpl = document.getElementById('tpl-concise-kpi-box');
                    if (kpiTpl && kpiContainer) {
                        const clone = kpiTpl.content.cloneNode(true);
                        const box = clone.querySelector('.concise-stat-box');
                        box.classList.add('concise-stat-box-accent');
                        box.style.setProperty('--concise-kpi-accent', colorHex);
                        const valSpan = clone.querySelector('.concise-stat-value');
                        valSpan.textContent = val;
                        clone.querySelector('.concise-stat-label').textContent = label;
                        kpiContainer.appendChild(clone);
                    }
                };

                if (hash === 'raidready') {
                    const avgIlvl = Math.round(characters.reduce((sum, c) => sum + ((c.profile && c.profile.equipped_item_level) || 0), 0) / characters.length) || 0;
                    addKpi(avgIlvl, 'Average iLvl', '#ff8000');
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
                    
                    addKpi(avgIlvl, 'Avg iLvl', '#ff8000');
                    addKpi(avgLvl70Ilvl, 'Avg Lvl 70 iLvl', '#a335ee');
                } else if (hash === 'ladder-pvp') {
                    const totalHks = characters.reduce((sum, c) => sum + ((c.profile && c.profile.honorable_kills) || 0), 0) || 0;
                    const displayHks = totalHks >= 1000000 ? (totalHks/1000000).toFixed(1) + 'M' : totalHks.toLocaleString();
                    addKpi(displayHks, 'Total HKs', '#ff4400');
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
                    
                    addKpi(avgLvl, 'Avg Level', '#ffd100');
                    addKpi(avgIlvl, 'Avg Lvl 70 iLvl', '#ff8000');
                }

                if (window.conciseRoleChartInstance) window.conciseRoleChartInstance.destroy();
                if (window.conciseClassChartInstance) window.conciseClassChartInstance.destroy();

                window.conciseRoleChartInstance = drawRoleChart('conciseRoleChart', characters, isRawRoster);
                window.conciseClassChartInstance = createDonutChart('conciseClassChart', characters, isRawRoster);
            }
        } else {
            if (donutContainer) donutContainer.classList.remove('is-visible');
        }
        
        if (timeline) {
            const baseTitle = title.replace(/ Overview \(\d+\)/, '').replace(/ \(\d+\)/, '');
            timelineTitle.innerHTML = `📜 ${baseTitle} Activity`;
            applyTimelineFilters();
        }
    }

    function showFullCardView(charName) {
        hideAllViews();
        fullCardContainer.style.display = 'block';
        fullCardContainer.textContent = '';

        const fullCardNode = renderFullCard(charName);
        if (fullCardNode) {
            fullCardContainer.appendChild(fullCardNode);
        }

        if (navbar) navbar.style.background = '#111';
        
        if (timeline) {
            const formattedName = charName.charAt(0).toUpperCase() + charName.slice(1);
            timelineTitle.innerHTML = `📜 ${formattedName}'s Recent Activity`;
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
                timelineTitle.innerHTML = `📜 Hall of Heroes Award History`;
                renderTimelineFilters('tpl-timeline-filters-badges');
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
                                const qualityClass = e.item_quality === 'LEGENDARY' ? 'we-loot-link-legendary' : 'we-loot-link-epic';
                                window.warEffortContext[cName].push({
                                    itemId: e.item_id,
                                    itemName: e.item_name,
                                    qualityClass
                                });
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
            if (timeline) timeline.style.display = 'none';
            
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
            const cHex = CLASS_COLORS[formattedClass] || '#fff';

            if (window.activeClassExpanded === className) {
                document.getElementById('home-spec-container').style.display = 'none';
                badge.classList.remove('active-filter');
                window.activeClassExpanded = null;
                return;
            }

            document.querySelectorAll('.clickable-class').forEach(b => b.classList.remove('active-filter'));
            badge.classList.add('active-filter');
            window.activeClassExpanded = className;

            // USE RAW GUILD ROSTER HERE
            const classRosterRaw = rawGuildRoster.filter(c => (c.class || '').toLowerCase() === className);
            const specCounts = {};
            let unspeccedCount = 0;

            classRosterRaw.forEach(rawChar => {
                const fullChar = rosterData.find(c => c.profile && c.profile.name && c.profile.name.toLowerCase() === (rawChar.name || '').toLowerCase());
                const spec = (fullChar && fullChar.profile && fullChar.profile.active_spec) ? fullChar.profile.active_spec : null;
                if (spec) {
                    specCounts[spec] = (specCounts[spec] || 0) + 1;
                } else {
                    unspeccedCount++;
                }
            });

            const specContainer = document.getElementById('home-spec-container');
            specContainer.textContent = '';
            
            const wrapDiv = document.createElement('div');
            wrapDiv.className = 'class-stat-container spec-filter-wrapper';
            
            const template = document.getElementById('tpl-home-spec-badge');
            if (template) {
                // All Class Badge
                let clone = template.content.cloneNode(true);
                let badge = clone.querySelector('.spec-btn');
                badge.setAttribute('data-hash', `class-${className}`);
                badge.style.setProperty('--spec-badge-accent', cHex);
                badge.classList.add('home-spec-badge-all');
                badge.title = `View all ${formattedClass}s`;
                
                let clsSpan = clone.querySelector('.stat-badge-cls');
                clsSpan.textContent = `All ${formattedClass}s`;
                
                clone.querySelector('.stat-badge-count').textContent = classRosterRaw.length;
                wrapDiv.appendChild(clone);
                
                // Individual Spec Badges
                Object.keys(specCounts).sort().forEach(spec => {
                    clone = template.content.cloneNode(true);
                    badge = clone.querySelector('.spec-btn');
                    badge.setAttribute('data-hash', `spec-${className}-${spec.toLowerCase().replace(/\s+/g, '')}`);
                    badge.style.setProperty('--spec-badge-accent', cHex);
                    badge.title = `View ${spec} ${formattedClass}s`;
                    
                    clsSpan = clone.querySelector('.stat-badge-cls');
                    
                    const iconUrl = getSpecIcon(formattedClass, spec);
                    if (iconUrl) {
                        const img = document.createElement('img');
                        img.src = iconUrl;
                        img.className = 'spec-badge-icon';
                        clsSpan.appendChild(img);
                    }
                    clsSpan.appendChild(document.createTextNode(spec));
                    
                    clone.querySelector('.stat-badge-count').textContent = specCounts[spec];
                    wrapDiv.appendChild(clone);
                });
                
                // Unspecced Badge
                if (unspeccedCount > 0) {
                    clone = template.content.cloneNode(true);
                    badge = clone.querySelector('.spec-btn');
                    badge.setAttribute('data-hash', `spec-${className}-unspecced`);
                    badge.style.setProperty('--spec-badge-accent', '#888');
                    badge.title = `View Unspecced ${formattedClass}s`;
                    
                    clsSpan = clone.querySelector('.stat-badge-cls');
                    clsSpan.textContent = 'Unspecced';
                    
                    clone.querySelector('.stat-badge-count').textContent = unspeccedCount;
                    wrapDiv.appendChild(clone);
                }
            }
            
            specContainer.appendChild(wrapDiv);
            specContainer.style.display = 'block';

            document.querySelectorAll('.spec-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    window.location.hash = btn.getAttribute('data-hash');
                });
            });
        });
    });

    // Interactive Mouse Parallax for Embers
    document.addEventListener('mousemove', (e) => {
        const emberContainer = document.querySelector('.embers-container');
        if (emberContainer) {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
            emberContainer.style.transform = `translate(${xAxis}px, ${yAxis}px)`;
        }
    });
    
    // ==========================================
    // 🌌 TBC ATMOSPHERE: NETHERSTORM (SPARKS ONLY)
    // ==========================================
    function initAtmosphere() {
        // 1. CANVAS FOR PHYSICS & PARTICLES
        const canvas = document.createElement('canvas');
        canvas.id = 'ember-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-2'; 
        canvas.style.pointerEvents = 'none'; 
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
                    event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
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
                        if (dynamicBadge && document.getElementById('concise-view').style.display !== 'none') {
                            dynamicBadge.click(); 
                        } else {
                            // Otherwise (on the Home dashboard), route to the dedicated class roster page
                            window.location.hash = 'class-' + clickedClass.toLowerCase();
                        }
                    }
                },
                onHover: (event, elements) => {
                    // Change cursor to pointer when hovering over a slice
                    event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
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
            
            const eventEl = document.createElement('div');
            
            // Monument rendering moved to dedicated feed.
            
            // Restored the proper concise-item class from your production site!
            eventEl.className = 'concise-item tt-char';
            eventEl.style.cursor = 'pointer';
            eventEl.onclick = () => selectCharacter((event.character_name || '').toLowerCase());
            
            eventEl.setAttribute('data-char', (event.character_name || '').toLowerCase());
            eventEl.setAttribute('data-class', event.class || 'Unknown');
            eventEl.setAttribute('data-event-type', event.type);
            eventEl.setAttribute('data-timestamp', event.timestamp);
            if (event.item_quality) {
                eventEl.setAttribute('data-quality', event.item_quality);
            }
            
            // Format the date to 24-hour clock (e.g., "24 Mar 14:30")
            let date_str = event.timestamp.substring(0, 10);
            try {
                const cleanTs = event.timestamp.replace('Z', '+00:00');
                const dt = new Date(cleanTs);
                if (!isNaN(dt.getTime())) {
                    date_str = dt.toLocaleString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '');
                }
            } catch(e) {}
            
            const c_hex = CLASS_COLORS[event.class] || '#ffd100';
            const c_name = (event.character_name || 'Unknown').charAt(0).toUpperCase() + (event.character_name || '').slice(1).toLowerCase();
            
            if (event.type === 'badge') {
                eventEl.style.borderLeftColor = c_hex;
                eventEl.style.padding = '8px 12px'; // Tighter padding for badges
                let badgeIcon = '🎖️', badgeColor = '#aaa', badgeText = '';
                
                if (event.badge_type === 'mvp_pve') { badgeIcon = '👑'; badgeColor = '#ff8000'; badgeText = 'PvE MVP'; }
                else if (event.badge_type === 'mvp_pvp') { badgeIcon = '⚔️'; badgeColor = '#ff4400'; badgeText = 'PvP MVP'; }
                else if (event.badge_type === 'vanguard') { badgeIcon = '🌟'; badgeColor = '#00ffcc'; badgeText = 'Vanguard'; }
                else if (event.badge_type === 'campaign') { badgeIcon = '🎖️'; badgeColor = '#aaa'; badgeText = 'Campaign'; }
                else if (event.badge_type === 'pve_gold') { badgeIcon = '🥇'; badgeColor = '#ffd700'; badgeText = 'PvE 1st'; }
                else if (event.badge_type === 'pve_silver') { badgeIcon = '🥈'; badgeColor = '#c0c0c0'; badgeText = 'PvE 2nd'; }
                else if (event.badge_type === 'pve_bronze') { badgeIcon = '🥉'; badgeColor = '#cd7f32'; badgeText = 'PvE 3rd'; }
                else if (event.badge_type === 'pvp_gold') { badgeIcon = '🥇'; badgeColor = '#ffd700'; badgeText = 'PvP 1st'; }
                else if (event.badge_type === 'pvp_silver') { badgeIcon = '🥈'; badgeColor = '#c0c0c0'; badgeText = 'PvP 2nd'; }
                else if (event.badge_type === 'pvp_bronze') { badgeIcon = '🥉'; badgeColor = '#cd7f32'; badgeText = 'PvP 3rd'; }
                
                const template = document.getElementById('tpl-timeline-badge');
                if (template) {
                    const clone = template.content.cloneNode(true);
                    
                    const node = clone.querySelector('.tl-badge-node');
                    node.style.background = badgeColor;
                    node.style.boxShadow = `0 0 8px ${badgeColor}`;
                    
                    const nameSpan = clone.querySelector('.tl-badge-name');
                    nameSpan.textContent = c_name;
                    nameSpan.style.color = c_hex;
                    
                    const pill = clone.querySelector('.tl-badge-pill');
                    pill.style.borderLeft = `2px solid ${badgeColor}`;
                    
                    const iconSpan = clone.querySelector('.tl-badge-icon');
                    iconSpan.textContent = badgeIcon;
                    iconSpan.style.filter = `drop-shadow(0 0 2px ${badgeColor})`;
                    
                    const textSpan = clone.querySelector('.tl-badge-text');
                    textSpan.textContent = badgeText;
                    textSpan.style.color = badgeColor;
                    
                    clone.querySelector('.tl-badge-category').textContent = `• ${event.category}`;
                    clone.querySelector('.tl-badge-date').textContent = date_str;
                    
                    eventEl.appendChild(clone);
                }
            } else if (event.type === 'level_up') {
                eventEl.style.borderLeftColor = c_hex;
                const template = document.getElementById('tpl-timeline-levelup');
                if (template) {
                    const clone = template.content.cloneNode(true);
                    
                    const nameSpan = clone.querySelector('.tl-event-name');
                    nameSpan.textContent = c_name;
                    nameSpan.style.color = c_hex;
                    
                    clone.querySelector('.tl-event-date').textContent = date_str;
                    clone.querySelector('.tl-event-level-text').textContent = `Reached Level ${event.level}`;
                    
                    eventEl.appendChild(clone);
                }
            } else {
                const q = event.item_quality || 'COMMON';
                const q_hex = QUALITY_COLORS[q] || '#ffffff';
                eventEl.style.borderLeftColor = q_hex;
                
                const template = document.getElementById('tpl-timeline-loot');
                if (template) {
                    const clone = template.content.cloneNode(true);
                    
                    const node = clone.querySelector('.timeline-node');
                    node.style.background = q_hex;
                    node.style.boxShadow = `0 0 8px ${q_hex}`;
                    
                    const nameSpan = clone.querySelector('.tl-event-name');
                    nameSpan.textContent = c_name;
                    nameSpan.style.color = c_hex;
                    
                    clone.querySelector('.tl-event-date').textContent = date_str;
                    
                    const eventBox = clone.querySelector('.event-box');
                    eventBox.style.borderLeftColor = q_hex;
                    
                    clone.querySelector('.tl-event-icon').src = event.item_icon;
                    
                    const itemLink = clone.querySelector('.tl-event-item-link');
                    itemLink.href = `https://www.wowhead.com/wotlk/item=${event.item_id}`;
                    itemLink.textContent = event.item_name;
                    itemLink.style.color = q_hex;

                    itemLink.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                    
                    eventEl.appendChild(clone);
                }
            }
            
            container.appendChild(eventEl);
        }
        
        currentTimelineIndex = endIndex;
        
        if (currentTimelineIndex >= filteredTimelineData.length) {
            if (loadMoreBtn) loadMoreBtn.hidden = true;
        } else {
            if (loadMoreBtn) loadMoreBtn.hidden = false;
        }
        
        if (typeof setupTooltips === 'function') {
            setupTooltips();
        }
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

        mvpContainer.style.display = 'block';

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
                block.classList.add(stepClass);
                block.setAttribute('data-char', (p.name || '').toLowerCase());
                block.setAttribute('data-class', cClass);
                block.onclick = () => selectCharacter((p.name || '').toLowerCase());
                
                if (rank === 1) {
                    const crown = document.createElement('div');
                    crown.className = 'podium-crown';
                    crown.textContent = '👑';
                    block.insertBefore(crown, block.firstChild);
                }
                
                const avatar = clone.querySelector('.podium-avatar');
                avatar.src = portraitURL;
                
                const rankDiv = clone.querySelector('.podium-rank');
                rankDiv.textContent = `#${rank}`;
                
                const nameDiv = clone.querySelector('.podium-name');
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
            img.onclick = () => selectCharacter(p.name.toLowerCase());
            
            const nameSpan = clone.querySelector('.gloat-name');
            nameSpan.textContent = p.name;
            nameSpan.style.color = cHex;
            nameSpan.onclick = () => selectCharacter(p.name.toLowerCase());
            
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
            const dynamicGlow = 10 + (pct * 0.25);
            
            let colorBase, colorMid, colorMax, labelName, glowColor;
            if (type === 'XP') {
                colorBase = '#8B6508'; colorMid = '#ffd100'; colorMax = '#ff8000'; labelName = 'Levels'; glowColor = '#ffd100';
            } else if (type === 'HK') {
                colorBase = '#8B0000'; colorMid = '#e74c3c'; colorMax = '#ff4400'; labelName = 'HKs'; glowColor = '#ff0000';
            } else if (type === 'LOOT') {
                colorBase = '#4b0082'; colorMid = '#a335ee'; colorMax = '#ff8000'; labelName = 'Epics'; glowColor = '#ff8000';
            } else { // ZENITH
                colorBase = '#006064'; colorMid = '#3FC7EB'; colorMax = '#00e5ff'; labelName = 'Max Levels'; glowColor = '#00e5ff';
            }

            if (fillEl) {
                setTimeout(() => { 
                    fillEl.style.width = pct + '%'; 
                    if (pct >= 100) {
                        // Toned down 100% state: Natural colors, softer shadow, and a slower pulse
                        fillEl.style.background = `linear-gradient(90deg, ${colorBase}, ${colorMax})`;
                        fillEl.style.boxShadow = `0 0 20px ${colorMax}`;
                        fillEl.style.animation = `pulseMax${type} 1.5s infinite alternate`;
                    } else if (pct >= 75) {
                        fillEl.style.background = `linear-gradient(90deg, ${colorBase}, ${colorMax})`;
                        fillEl.style.boxShadow = `0 0 ${dynamicGlow}px ${colorMax}`;
                        fillEl.style.animation = `pulseFast${type} 0.8s infinite alternate`;
                    } else if (pct >= 30) {
                        fillEl.style.background = `linear-gradient(90deg, ${colorBase}, ${colorMid})`;
                        fillEl.style.boxShadow = `0 0 ${dynamicGlow}px ${colorMid}`;
                        fillEl.style.animation = `pulseSlow${type} 1.5s infinite alternate`;
                    } else {
                        fillEl.style.background = `linear-gradient(90deg, #333, ${colorBase})`;
                        fillEl.style.boxShadow = `0 0 ${dynamicGlow}px rgba(255, 255, 255, 0.2)`;
                        fillEl.style.animation = 'none';
                    }
                }, 100);
            }
            
            if (textEl) {
                textEl.textContent = '';
                const labelSpan = document.createElement('span');
                labelSpan.className = 'we-text-label';
                labelSpan.textContent = labelName + ':';
                
                const valSpan = document.createElement('span');
                valSpan.className = 'we-text-values';
                valSpan.textContent = `${currentVal.toLocaleString()} / ${maxVal.toLocaleString()}`;
                
                if (pct >= 100) {
                    textEl.className = 'challenge-text we-text-state-max';
                    textEl.style.color = colorMid;
                    labelSpan.style.color = '#ddd';
                    
                    const crushSpan = document.createElement('span');
                    crushSpan.className = 'we-text-crushed';
                    crushSpan.textContent = '🔥 CRUSHED!';
                    crushSpan.style.textShadow = `0 0 10px ${colorMax}`;
                    
                    textEl.appendChild(labelSpan);
                    textEl.appendChild(valSpan);
                    textEl.appendChild(crushSpan);
                } else {
                    textEl.className = 'challenge-text we-text-state-normal';
                    textEl.style.color = '#fff';
                    labelSpan.style.color = '#ccc';
                    
                    textEl.appendChild(labelSpan);
                    textEl.appendChild(valSpan);
                }
            }
        }

        renderBar('guild-xp-fill', 'guild-xp-text', totalLevels, 750, 'XP');
        renderBar('guild-hk-fill', 'guild-hk-text', totalHks, 1000, 'HK');
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

        if (totalHks >= 1000) {
            const topPvpers = Object.entries(hkContributors).sort((a,b)=>b[1]-a[1]);
            const topDyn = topPvpers.slice(0,3).map(x=>x[0].toLowerCase());
            let fallback = null;
            if (topPvpers.length > 0) fallback = { title: "🩸 Blood of the Enemy", highlightColor: "#ff4400", highlightText: topPvpers[0][0].charAt(0).toUpperCase() + topPvpers[0][0].slice(1), suffixText: " led the 1000 HK charge!", timestamp: new Date().toISOString() };
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

        if (totalLevels >= 750 && totalHks >= 1000 && totalLoot >= 60 && totalZenith >= 10) {
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
            
            monContainer.innerHTML = '';
            if (window.warEffortMonuments.length > 0) {
                window.warEffortMonuments.forEach(mon => {
                    const eventEl = document.createElement('div');
                    eventEl.className = 'monument-card';
                    const dt = new Date(mon.timestamp);
                    const timeStr = isNaN(dt) ? '' : dt.toLocaleString('en-GB', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:false}).replace(',', '');
                    eventEl.textContent = '';
                    const template = document.getElementById('tpl-monument-card');
                    if (template) {
                        const clone = template.content.cloneNode(true);
                        
                        clone.querySelector('.mon-title-text').textContent = mon.title;
                        clone.querySelector('.mon-time-text').textContent = timeStr;
                        const descContainer = clone.querySelector('.mon-desc-text');
                        descContainer.textContent = '';
                        if (mon.highlightText) {
                            if (mon.prefixText) descContainer.appendChild(document.createTextNode(mon.prefixText));
                            const hlSpan = document.createElement('span');
                            hlSpan.style.color = mon.highlightColor;
                            hlSpan.classList.add('monument-highlight-span');
                            hlSpan.textContent = mon.highlightText;
                            descContainer.appendChild(hlSpan);
                            if (mon.suffixText) descContainer.appendChild(document.createTextNode(mon.suffixText));
                        } else {
                            descContainer.innerHTML = mon.desc;
                        }
                        
                        eventEl.appendChild(clone);
                    }
                    monContainer.appendChild(eventEl);
                });
            }
        }

        // 6. Tooltip Generator Helper (Updated to Route on Click)
        function bindTooltip(triggerId, contributorsDict, titleText, labelText) {
            const tooltipTrigger = document.getElementById(triggerId);
            if (!tooltipTrigger) return;
            
            const sortedContributors = Object.entries(contributorsDict).sort((a, b) => b[1] - a[1]);
            
            const newTrigger = tooltipTrigger.cloneNode(true);
            tooltipTrigger.parentNode.replaceChild(newTrigger, tooltipTrigger);
            
            function displayTooltip(clientX, clientY) {
                tooltip.textContent = '';
                
                const header = document.createElement('div');
                header.className = 'we-tt-header';
                header.textContent = titleText;
                tooltip.appendChild(header);
                
                if (sortedContributors.length === 0) {
                    const empty = document.createElement('div');
                    empty.className = 'we-tt-empty';
                    empty.textContent = 'The challenges just began!';
                    tooltip.appendChild(empty);
                } else {
                    const topList = sortedContributors.slice(0, 15);
                    topList.forEach(([name, count], index) => {
                        const charData = rosterData.find(c => c.profile && c.profile.name && c.profile.name.toLowerCase() === name.toLowerCase());
                        const cClass = charData ? getCharClass(charData) : 'Unknown';
                        const cHex = CLASS_COLORS[cClass] || '#fff';
                        const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                        
                        const row = document.createElement('div');
                        row.className = 'we-tt-row';
                        
                        const nameSpan = document.createElement('span');
                        nameSpan.style.color = cHex;
                        nameSpan.textContent = `${index + 1}. ${formattedName}`;
                        
                        const scoreSpan = document.createElement('span');
                        scoreSpan.className = 'we-tt-score';
                        scoreSpan.textContent = `+${count.toLocaleString()}`;
                        
                        row.appendChild(nameSpan);
                        row.appendChild(scoreSpan);
                        tooltip.appendChild(row);
                    });
                    
                    if (sortedContributors.length > 15) {
                        const remaining = sortedContributors.slice(15).reduce((sum, [_, count]) => sum + count, 0);
                        const footer = document.createElement('div');
                        footer.className = 'we-tt-footer';
                        footer.textContent = `...and +${remaining.toLocaleString()} more ${labelText}!`;
                        tooltip.appendChild(footer);
                    }
                }

                tooltip.style.borderLeftColor = '#ffd100';
                let x = clientX + 15;
                let y = clientY + 15;
                if (x + 250 > window.innerWidth) x = window.innerWidth - 260; 
                tooltip.style.left = `${x}px`; 
                tooltip.style.top = `${y}px`;
                tooltip.classList.add('visible');
            }

            newTrigger.addEventListener('mousemove', e => displayTooltip(e.clientX, e.clientY));
            newTrigger.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
            
            // --- NEW: Interactive Navigation ---
            newTrigger.addEventListener('click', e => {
                e.stopPropagation();
                tooltip.classList.remove('visible');
                
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
});