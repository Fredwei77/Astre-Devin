// calendar.js - Perpetual Calendar Logic

// State
let currentMode = 'solar'; // 'solar' | 'reverse'

// Constants for Hour Pillars (Simplified map for hours)
const earthBranchTime = [
    'Zi (23-01)', 'Chou (01-03)', 'Yin (03-05)', 'Mao (05-07)',
    'Chen (07-09)', 'Si (09-11)', 'Wu (11-13)', 'Wei (13-15)',
    'Shen (15-17)', 'You (17-19)', 'Xu (19-21)', 'Hai (21-23)'
];

// Initialize i18n observer
if (window.i18n) {
    window.i18n.addObserver((lang) => {
        initUI(); // Re-populate with translated labels
        calculate(); // Refresh result text
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    // Default calculate for today
    const now = new Date();
    document.getElementById('yearInput').value = now.getFullYear();
    populateSelects(now.getMonth() + 1, now.getDate());

    // Tiny delay to ensure library is loaded if fetched from CDN/node_modules
    setTimeout(calculate, 300);
});

function initUI() {
    // Populate Months
    const mSel = document.getElementById('monthInput');
    const prevM = mSel.value;
    mSel.innerHTML = '';
    for (let i = 1; i <= 12; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerText = `${i} ${window.i18n ? window.i18n.t('calendar.month') : 'Month'}`;
        mSel.appendChild(opt);
    }
    if (prevM) mSel.value = prevM;

    // Populate Hours
    const hSel = document.getElementById('hourInput');
    const prevH = hSel.value;
    hSel.innerHTML = '';
    const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    for (let i = 0; i < 24; i++) {
        const branchIdx = Math.floor(((i + 1) % 24) / 2);
        const branchName = BRANCHES[branchIdx];
        let opt = document.createElement('option');
        opt.value = i;
        const hourLabel = window.i18n ? window.i18n.t('calendar.hour') : 'Hour';
        opt.innerText = `${i.toString().padStart(2, '0')}:00 (${branchName}${hourLabel})`;
        hSel.appendChild(opt);
    }
    if (prevH) hSel.value = prevH;

    // Event listeners
    document.getElementById('monthInput').addEventListener('change', updateDays);
    document.getElementById('yearInput').addEventListener('change', updateDays);
}

function updateDays() {
    const y = parseInt(document.getElementById('yearInput').value) || 2000;
    const m = parseInt(document.getElementById('monthInput').value) || 1;
    const dSel = document.getElementById('dayInput');
    const currentVal = dSel.value;

    // Days in month
    const days = new Date(y, m, 0).getDate();

    dSel.innerHTML = '';
    for (let i = 1; i <= days; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerText = `${i} ${window.i18n ? window.i18n.t('calendar.day') : 'Day'}`;
        dSel.appendChild(opt);
    }

    if (currentVal && currentVal <= days) dSel.value = currentVal;
}

function populateSelects(currM, currD) {
    document.getElementById('monthInput').value = currM;
    updateDays();
    document.getElementById('dayInput').value = currD;
}

function setMode(mode) {
    currentMode = mode;

    // UI Toggles
    const btnSolar = document.getElementById('modeSolar');
    const btnRev = document.getElementById('modeReverse');
    const divSolar = document.getElementById('solarInput');
    const divRev = document.getElementById('reverseInput');
    const mainAction = document.getElementById('actionBtnContainer');

    if (mode === 'solar') {
        btnSolar.classList.add('bg-mystic-gold', 'text-deep-navy');
        btnSolar.classList.remove('text-moon-silver', 'hover:bg-white/10');

        btnRev.classList.remove('bg-mystic-gold', 'text-deep-navy');
        btnRev.classList.add('text-moon-silver', 'hover:bg-white/10');

        divSolar.classList.remove('hidden');
        divRev.classList.add('hidden');
        mainAction.classList.remove('hidden');
    } else {
        btnRev.classList.add('bg-mystic-gold', 'text-deep-navy');
        btnRev.classList.remove('text-moon-silver', 'hover:bg-white/10');

        btnSolar.classList.remove('bg-mystic-gold', 'text-deep-navy');
        btnSolar.classList.add('text-moon-silver', 'hover:bg-white/10');

        divRev.classList.remove('hidden');
        divSolar.classList.add('hidden');
        mainAction.classList.add('hidden'); // Reverse has its own button
    }
}

// Ensure Lunar is available
function getLunar(y, m, d, h) {
    if (typeof Solar === 'undefined') {
        console.error('Lunar library not loaded');
        return null;
    }
    const solar = Solar.fromYmdHms(y, m, d, h, 0, 0);
    return solar.getLunar();
}

function calculate() {
    const y = parseInt(document.getElementById('yearInput').value);
    const m = parseInt(document.getElementById('monthInput').value);
    const d = parseInt(document.getElementById('dayInput').value);
    const h = parseInt(document.getElementById('hourInput').value);

    try {
        const lunar = getLunar(y, m, d, h);
        if (!lunar) return;

        // Render Pillars
        const bazi = lunar.getEightChar();
        document.getElementById('yearPillar').innerText = bazi.getYear();
        document.getElementById('monthPillar').innerText = bazi.getMonth();
        document.getElementById('dayPillar').innerText = bazi.getDay();
        document.getElementById('hourPillar').innerText = bazi.getTime();

        // Render Info
        document.getElementById('resSolar').innerText = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')} ${h.toString().padStart(2, '0')}:00`;
        const lunarMonth = lunar.getMonthInChinese();
        const lunarDay = lunar.getDayInChinese();
        const yearLabel = window.i18n ? window.i18n.t('calendar.year') : 'Year';
        const monthLabel = window.i18n ? window.i18n.t('calendar.month') : 'Month';
        document.getElementById('resLunar').innerText = `${lunar.getYearInGanZhi()}${yearLabel} ${lunarMonth}${monthLabel} ${lunarDay}`;
        document.getElementById('resTerm').innerText = lunar.getJieQi() || (window.i18n ? window.i18n.t('calendar.none') : 'None');
        document.getElementById('resZodiac').innerText = lunar.getYearShengXiao();
        const clashLabel = window.i18n ? window.i18n.t('calendar.clash') : 'Day Clash';
        document.getElementById('resConflict').innerText = `${clashLabel}: ${lunar.getDayChongDesc()}`;

    } catch (e) {
        console.error(e);
        alert(window.i18n ? window.i18n.t('calendar.error') : 'Date calculation error (Out of range?)');
    }
}

function doReverseLookup() {
    const yP = document.getElementById('yearPillarInput').value.trim();
    const mP = document.getElementById('monthPillarInput').value.trim();
    const dP = document.getElementById('dayPillarInput').value.trim();

    if (!yP || !mP || !dP) {
        alert(window.i18n ? window.i18n.t('calendar.enter_pillars') : "Please enter Year, Month, and Day pillars (e.g., 甲子).");
        return;
    }

    // Search range: current year +/- 50 years to find matches
    const startYear = new Date().getFullYear() - 60;
    const endYear = startYear + 120;

    let found = false;
    let results = [];

    // Simple brute force search across days
    for (let y = startYear; y <= endYear; y++) {
        for (let m = 1; m <= 12; m++) {
            let daysInMonth = new Date(y, m, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const solar = Solar.fromYmd(y, m, d);
                const lunar = solar.getLunar();

                if (lunar.getYearInGanZhi() === yP &&
                    lunar.getMonthInGanZhi() === mP &&
                    lunar.getDayInGanZhi() === dP) {
                    results.push({ y, m, d });
                    if (results.length >= 1) { // Stop at first match for simplicity in this demo
                        found = true;
                        break;
                    }
                }
            }
            if (found) break;
        }
        if (found) break;
    }

    if (found) {
        const match = results[0];
        document.getElementById('yearInput').value = match.y;
        document.getElementById('monthInput').value = match.m;
        updateDays();
        document.getElementById('dayInput').value = match.d;

        setMode('solar');
        calculate();

        // Visual cue
        const card = document.querySelector('.calendar-card');
        card.style.borderColor = '#ffd700';
        setTimeout(() => card.style.borderColor = 'rgba(255, 215, 0, 0.2)', 1000);
    } else {
        alert(window.i18n ? window.i18n.t('calendar.no_match') : "No matching date found in the 120-year window (-60 to +60 years from now). Please check your pillars.");
    }
}
