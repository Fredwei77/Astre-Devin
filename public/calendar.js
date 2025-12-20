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
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            initUI();
            calculate();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Wait for i18n to be ready
    const checkI18n = setInterval(() => {
        if (window.i18n && window.i18n.initialized) {
            clearInterval(checkI18n);
            initUI();

            // Set default date
            const now = new Date();
            const yearInput = document.getElementById('yearInput');
            if (yearInput) yearInput.value = now.getFullYear();
            populateSelects(now.getMonth() + 1, now.getDate());

            // Initial calculation with a slight delay for other libs (Lunar)
            setTimeout(calculate, 500);
        }
    }, 100);
});

function initUI() {
    // Check if elements exist
    const mSel = document.getElementById('monthInput');
    const hSel = document.getElementById('hourInput');
    if (!mSel || !hSel) return;

    // Populate Months
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
    const yearInput = document.getElementById('yearInput');
    if (yearInput) yearInput.addEventListener('change', updateDays);
    mSel.addEventListener('change', updateDays);

    // Refresh days to ensure correct translation
    updateDays();
}

function updateDays() {
    // ... no change to logic inside ...
    const yearEl = document.getElementById('yearInput');
    const monthEl = document.getElementById('monthInput');
    const dSel = document.getElementById('dayInput');
    if (!yearEl || !monthEl || !dSel) return;

    const y = parseInt(yearEl.value) || new Date().getFullYear();
    const m = parseInt(monthEl.value) || 1;
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

    if (currentVal && parseInt(currentVal) <= days) {
        dSel.value = currentVal;
    } else {
        dSel.value = 1;
    }
}

function populateSelects(currM, currD) {
    const mSel = document.getElementById('monthInput');
    const dSel = document.getElementById('dayInput');
    if (mSel) mSel.value = currM;
    updateDays();
    if (dSel) dSel.value = currD;
}

function setMode(mode) {
    currentMode = mode;

    const btnSolar = document.getElementById('modeSolar');
    const btnRev = document.getElementById('modeReverse');
    const divSolar = document.getElementById('solarInput');
    const divRev = document.getElementById('reverseInput');
    const mainAction = document.getElementById('actionBtnContainer');

    if (!btnSolar || !btnRev || !divSolar || !divRev || !mainAction) return;

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
        mainAction.classList.add('hidden');
    }
}

function getLunar(y, m, d, h) {
    if (typeof Solar === 'undefined') {
        console.warn('Lunar library (Solar) not loaded yet, retrying...');
        return null;
    }
    try {
        const solar = Solar.fromYmdHms(y, m, d, h, 0, 0);
        return solar.getLunar();
    } catch (err) {
        console.error('Lunar conversion error:', err);
        return null;
    }
}

function calculate() {
    const yearEl = document.getElementById('yearInput');
    const monthEl = document.getElementById('monthInput');
    const dayEl = document.getElementById('dayInput');
    const hourEl = document.getElementById('hourInput');

    if (!yearEl || !monthEl || !dayEl || !hourEl) return;

    const y = parseInt(yearEl.value);
    const m = parseInt(monthEl.value);
    const d = parseInt(dayEl.value);
    const h = parseInt(hourEl.value);

    // Initial load might be empty
    if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(h)) return;

    try {
        const lunar = getLunar(y, m, d, h);
        if (!lunar) {
            // Show loading or fallback in UI if needed
            return;
        }

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

        // Add spaces for English formatting
        const isEn = window.i18n && (window.i18n.currentLang === 'en' || window.i18n.currentLang === 'es');
        if (isEn) {
            document.getElementById('resLunar').innerText = `${lunar.getYearInGanZhi()} ${yearLabel}  ${lunarMonth} ${monthLabel}  ${lunarDay}`;
        } else {
            document.getElementById('resLunar').innerText = `${lunar.getYearInGanZhi()}${yearLabel} ${lunarMonth}${monthLabel} ${lunarDay}`;
        }

        document.getElementById('resTerm').innerText = lunar.getJieQi() || (window.i18n ? window.i18n.t('calendar.none') : 'None');
        document.getElementById('resZodiac').innerText = lunar.getYearShengXiao();

        const clashLabel = window.i18n ? window.i18n.t('calendar.clash') : 'Day Clash';
        // Ensure clash description is clean
        const clashDesc = lunar.getDayChongDesc();
        document.getElementById('resConflict').innerText = `${clashDesc}`; // Remove label repetition if label is already in UI
        // Wait, the UI has a label "Conflict: ". The JS was adding ANOTHER label "Clash: ...".
        // The screenshot showed "calendar.conflictcalendar.clash: ...". 
        // "calendar.conflict" is the translation of the label "Conflict:".
        // "calendar.clash" is the translation of the JS added label "Clash".
        // We should REMOVE the JS label "Clash" because the UI already has a label "Conflict".
        // BUT, "Conflict" (Conflict:) and "Clash" (Chong) might mean different things?
        // Usually "Day Conflict: (BingChen) Dragon".
        // So I will just output the value `lunar.getDayChongDesc()` and remove the JS-side label prefix.
        document.getElementById('resConflict').innerText = clashDesc;

    } catch (e) {
        console.error('Calculation error:', e);
    }
}

function doReverseLookup() {
    const yP = document.getElementById('yearPillarInput')?.value.trim();
    const mP = document.getElementById('monthPillarInput')?.value.trim();
    const dP = document.getElementById('dayPillarInput')?.value.trim();

    if (!yP || !mP || !dP) {
        alert(window.i18n ? window.i18n.t('calendar.enter_pillars') : "Please enter Year, Month, and Day pillars (e.g., 甲子).");
        return;
    }

    if (typeof Solar === 'undefined') {
        alert("Library not ready. Please wait a moment.");
        return;
    }

    const startYear = new Date().getFullYear() - 60;
    const endYear = startYear + 120;

    let found = false;
    let results = [];

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
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
        if (found) break;
    }

    if (found) {
        const match = results[0];
        const yearInput = document.getElementById('yearInput');
        if (yearInput) yearInput.value = match.y;
        populateSelects(match.m, match.d);
        setMode('solar');
        calculate();

        const card = document.querySelector('.calendar-card');
        if (card) {
            card.style.borderColor = '#ffd700';
            setTimeout(() => card.style.borderColor = 'rgba(255, 215, 0, 0.2)', 1000);
        }
    } else {
        alert(window.i18n ? window.i18n.t('calendar.no_match') : "No matching date found in the 120-year window.");
    }
}

