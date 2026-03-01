// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И УТИЛИТЫ ---

// Утилиты для плавного появления/скрытия модальных окон
window.fadeInModal = function(el, callback) {
    if (!el) { if (callback) callback(); return; }
    el.style.opacity = '0';
    el.style.display = 'block';
    requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.3s ease';
        el.style.opacity = '1';
    });
    const handler = (e) => {
        if (e.propertyName === 'opacity') {
            el.removeEventListener('transitionend', handler);
            if (callback) callback();
        }
    };
    el.addEventListener('transitionend', handler);
};

window.fadeOutModal = function(el, callback) {
    if (!el) { if (callback) callback(); return; }
    el.style.transition = 'opacity 0.3s ease';
    el.style.opacity = '0';
    const handler = (e) => {
        if (e.propertyName === 'opacity') {
            el.removeEventListener('transitionend', handler);
            el.style.display = 'none';
            if (callback) callback();
        }
    };
    el.addEventListener('transitionend', handler);
};

// Конфигурация игры (Магические числа)
window.gameConfig = {
    guildReqs: {
        traders: { vit: 1000 },
        gamblers: { deals: 7, dex: 1000 },
        mages: { int: 1000, para: 50 },
        thieves: { steals: 7 },
        hunters: { rep: 85 },
        explorers: { legs: 5 },
        wealth: { legs: 8 },
        brute: { str: 1000, kills: 1700 }
    },
    zakenPrices: {
        20: 12000, 25: 12000, 30: 20000, 35: 30000, 40: 50000,
        45: 90000, 50: 130000, 55: 230000, 60: 350000, 65: 700000,
        70: 820000, 99: 970000 // 99 как дефолт для 70+
    },
    theft: { baseChance: 0.4 } // Бонус за ловкость
};

// 1. Пытаемся достать данные из LocalStorage
const savedData = localStorage.getItem('d3mod_player');
// 2. Если данные есть — превращаем их в объект, если нет — создаем новый
window.playerData = savedData ? JSON.parse(savedData) : {
    name: "НЕФАЛЕМ",
    level: 1,
    gold_g: 0, gold_s: 0, gold_c: 0, gold_y: 0,
    mithril: 0,
    runes: 0,
    act: 1, // Текущий акт
    para: 0,
    zakens: 0,
    maxVp: 0,
    potions: 0,
    death_breath: 0,
    blizzardStatsUrl: "", // Ссылка на профиль для статов
    blizzardCareerUrl: "", // Ссылка на карьеру
    career_imported: false, // Флаг первичного импорта карьеры
    
    // Сохраненный HTML боковых панелей
    guild_html: "",
    class_html: "",
    
    // Характеристики
    stat_str: 0, stat_dex: 0, stat_int: 0, stat_vit: 0,
    
    // Новые поля
    kills: 0,
    highest_kills: 0, // Максимальное кол-во убийств для предотвращения абуза наград
    base_kills: 0, // Изначально мобов
    base_elites: 0, // Изначально элиток
    elites_solo: 0,
    bosses: 0,
    gobs_solo: 0, gobs_assist: 0, 
    found_legs: 0,
    res_n: 0, res_dc: 0, res_b: 0, res_a: 0,
    reagents: 0,
    runes_sold: 0,
    reputation: 0,
    deals: 0,
    chests_found: 0,
    steals: 0, theft_fine: "",
    theft_attempts_level: 1, // Уровень, на котором были совершены попытки
    theft_attempts_count: 0, // Количество попыток на текущем уровне
    black_market: 0,
    zaken_discount: "",
    base_vp_at_70: 0, // ВП, зафиксированный при получении 70 уровня
    xp_bonus: "",
    potion_price: "",
    lvl70_portal: "",
    active_rents: [], // Список активных аренд: { rank, count, startLvl, duration }
    forgottenSkills: {}, // Счетчик забытых навыков
    professions: { 1: false, 2: false, 3: false }, // Состояние профессий
    refused_wizard_promotion: false,
    claimed_torments: [], // Полученные награды за Torment
    claimed_ranks: [], // Полученные награды за ранг
    difficulty: "Высокий", // Текущий уровень сложности
    diffCalcData: {}, // Сохраненные данные калькулятора сложности
    np_count: 0, // Количество НП в текущем акте
    is_in_np: false, // Находится ли игрок в НП
    gambler_bm_purchases_count: 0, // Счетчик покупок на ЧР для бонуса
    gambler_bonus_sales_left: 0, // Количество предметов для продажи по х5
    solo_vp_complete: false, // Флаг прохождения ВП соло
    vp_is_solo: false, // Текущий забег ВП - соло?
    current_rift_cost: 0, // Текущие затраты на портал (для возврата 25%)
    // Куб и навыки
    // Пентограмма (чекбоксы)
    penta_1: false, penta_2: false, penta_3: false,
    penta_1_boss: "", penta_2_boss: "", penta_3_boss: "",
    
    calculated_dmg: 0, calculated_tough: 0, last_run_kills: 0, // Поля для обмена статистикой
    learnedSkills: {},
    forgottenSkillRunes: {}, // Память изученных рун для забытых навыков
    learnedSkillsOrder: [], // Порядок изучения навыков для расчета стоимости
    className: "Класс не выбран",
    build: "",
    build_2: "", // Второй билд
    guild: "Нет",
    class_html_2: "", // HTML второго билда
    rank: 0,
    rankName: "",
    joined_level: 1, // Уровень, на котором вступили в гильдию
    saveCount: 0,
 journal: [], // Журнал событий
     death_history: [], // История смертей
 history: [], // История прогресса [time, para, wealth]
        settings: { // Настройки
            screamer: true,
            vfx: true,
 coinShimmer: 2, // 0: Выкл, 1: Редко, 2: Средне, 3: Часто
             textSelect: false,
                         showCandles: true, // Круг свечей
                                     showTooltips: false, // Всплывающие подсказки
            showImages: false, // Картинки в меню (false = кнопки)
            story_progress: 0 // 0-12 (Свечи)
                }
    };

// Исправление для старых сохранений
if (!window.playerData.inventory) window.playerData.inventory = [];
if (!window.playerData.journal) window.playerData.journal = [];
if (!window.playerData.learnedSkills) window.playerData.learnedSkills = {};
if (!window.playerData.history) window.playerData.history = [];
if (!window.playerData.death_history) window.playerData.death_history = [];
if (!window.playerData.forgottenSkillRunes) window.playerData.forgottenSkillRunes = {};
if (!window.playerData.learnedSkillsOrder) window.playerData.learnedSkillsOrder = Object.keys(window.playerData.learnedSkills);
if (typeof window.playerData.highest_kills === 'undefined') window.playerData.highest_kills = window.playerData.kills || 0;
if (!window.playerData.joined_level) window.playerData.joined_level = window.playerData.level || 1;
if (typeof window.playerData.reagents === 'undefined') window.playerData.reagents = 0;
if (typeof window.playerData.res_n === 'undefined') window.playerData.res_n = 0;
if (typeof window.playerData.res_dc === 'undefined') window.playerData.res_dc = 0;
if (typeof window.playerData.res_b === 'undefined') window.playerData.res_b = 0;
if (typeof window.playerData.res_a === 'undefined') window.playerData.res_a = 0;
if (!window.playerData.active_rents) window.playerData.active_rents = [];
if (!window.playerData.forgottenSkills) window.playerData.forgottenSkills = {};
if (!window.playerData.professions) window.playerData.professions = { 1: false, 2: false, 3: false };
if (!window.playerData.claimed_torments) window.playerData.claimed_torments = [];
if (!window.playerData.claimed_ranks) window.playerData.claimed_ranks = [];
if (!window.playerData.diffCalcData) window.playerData.diffCalcData = {};
if (!window.playerData.difficulty) window.playerData.difficulty = "Высокий";
if (typeof window.playerData.refused_wizard_promotion === 'undefined') window.playerData.refused_wizard_promotion = false;
if (typeof window.playerData.saveCount === 'undefined') window.playerData.saveCount = 0;
if (typeof window.playerData.act === 'undefined') window.playerData.act = 1;
if (typeof window.playerData.np_count === 'undefined') window.playerData.np_count = 0;
if (typeof window.playerData.gambler_bm_purchases_count === 'undefined') window.playerData.gambler_bm_purchases_count = 0;
if (typeof window.playerData.gambler_bonus_sales_left === 'undefined') window.playerData.gambler_bonus_sales_left = 0;
if (typeof window.playerData.theft_attempts_level === 'undefined') window.playerData.theft_attempts_level = window.playerData.level || 1;
if (typeof window.playerData.theft_attempts_count === 'undefined') window.playerData.theft_attempts_count = 0;
if (typeof window.playerData.current_rift_cost === 'undefined') window.playerData.current_rift_cost = 0;
if (typeof window.playerData.refused_thief_promotion === 'undefined') window.playerData.refused_thief_promotion = false;

// FIX: Полная проверка и инициализация настроек
if (!window.playerData.settings) window.playerData.settings = {};
const defaultSettings = {
    screamer: true, vfx: true, coinShimmer: 2, textSelect: false,
    showTooltips: false, showImages: false, showCandles: true
};
for (let key in defaultSettings) {
    if (typeof window.playerData.settings[key] === 'undefined') {
        window.playerData.settings[key] = defaultSettings[key];
    }
}

if (typeof window.playerData.story_progress === 'undefined') window.playerData.story_progress = 0;


if (typeof window.playerData.base_vp_at_70 === 'undefined') {
    if (window.playerData.level >= 70) {
        window.playerData.base_vp_at_70 = window.playerData.maxVp || 0;
    } else {
        window.playerData.base_vp_at_70 = 0;
    }
}

// Глобальные переменные состояния
window.historyStack = ['main'];
window.pathNames = ['ГЛАВНАЯ'];
window.pendingVampireJoin = false;
window.partnerData = {}; // Данные напарника
window.isMusicPlaying = false;
window.lastResourceSellLevel = 1;
window.lastCraftSellLevel = 1;
window.audioTrackDefault = new Audio('06 - The Slaughtered Calf Inn.mp3');
window.audioTrackDefault.loop = true;
window.audioTrackNGPlus = new Audio('Cave.mp3');
window.audioTrackNGPlus.loop = true;
window.audioTrackAct5 = new Audio('act 5.mp3');
window.audioTrackAct5.loop = true;
window.audioTrack = window.audioTrackDefault; // Устанавливаем трек по умолчанию
window.coinSound = new Audio('freesound_community-coin-clatter-6-87110.mp3');
window.activeRiftMultiplier = null; // Множитель наград за текущий рифт (null если нет активной цепочки)
window.isVodyaniEventActive = false; // Флаг для блокировки другой музыки
window.activeRiftExpMultiplier = null; // Отдельный множитель для опыта (для ВП)
window.riftSuccess = null; // Флаг успешного закрытия портала
window.idleTimer = null;
window.saveTimeout = null; // Таймер для отложенного сохранения

// --- УТИЛИТЫ ---

window.logEvent = function(message, type = 'info') {
    const now = new Date();
    const entry = {
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullDate: now.toLocaleString('ru-RU'),
        msg: message,
        type: type
    };
    
    if (!window.playerData.journal) window.playerData.journal = [];
    window.playerData.journal.unshift(entry); // Добавляем в начало
    if (window.playerData.journal.length > 50) window.playerData.journal.pop(); // Храним только 50 записей
    
    window.renderJournalWidget();
}

window.saveToStorage = function() {
    // Debounce: откладываем сохранение на 1 сек, чтобы снизить нагрузку
    if (window.saveTimeout) clearTimeout(window.saveTimeout);
    window.saveTimeout = setTimeout(() => {
        
        window.updateHistory();
        localStorage.setItem('d3mod_player', JSON.stringify(window.playerData));
    }, 1000);
}

// Гарантированное сохранение при закрытии вкладки или обновлении
window.addEventListener('beforeunload', function() {
    if (window.saveTimeout) clearTimeout(window.saveTimeout);
    localStorage.setItem('d3mod_player', JSON.stringify(window.playerData));
});

window.getAllMoneyInYen = function() {
    return ((window.playerData.mithril || 0) * 100000000) + (window.playerData.gold_g * 1000000) + (window.playerData.gold_s * 10000) + (window.playerData.gold_c * 100) + window.playerData.gold_y;
}

window.setMoneyFromYen = function(totalYen) {
    const sign = totalYen < 0 ? -1 : 1;
    let absYen = Math.abs(totalYen);

    window.playerData.gold_y = (absYen % 100) * sign;
    absYen = Math.floor(absYen / 100);
    
    window.playerData.gold_c = (absYen % 100) * sign;
    absYen = Math.floor(absYen / 100);
    
    window.playerData.gold_s = (absYen % 100) * sign;
    absYen = Math.floor(absYen / 100);
    
    window.playerData.gold_g = (absYen % 100) * sign;
    absYen = Math.floor(absYen / 100);

    window.playerData.mithril = absYen * sign;

    // Жесткое ограничение мифрила (макс 10)
    if (window.playerData.mithril > 10) window.playerData.mithril = 10;
    if (window.playerData.mithril < -10) window.playerData.mithril = -10; // На всякий случай для долгов

    if (window.coinSound && window.playerData.gold_y !== undefined) {
        window.coinSound.currentTime = 0;
        window.coinSound.play().catch(e => {
            console.warn("Audio play failed:", e);
        });
    }
    
    // Принудительно обновляем стопки монет при любом изменении баланса

    if (window.updateCoinStacks) window.updateCoinStacks();
}

window.addYen = function(yenAmount) {
    if (isNaN(yenAmount) || yenAmount === 0) return;
    const currentYen = window.getAllMoneyInYen();
    window.setMoneyFromYen(currentYen + Math.floor(yenAmount));
    // setMoneyFromYen уже включает звук, так что дополнительный вызов не нужен
}

window.addCurrency = function(type, amount, skipFullUpdate = false) {
    const keyMap = {
        m: 'mithril',
        g: 'gold_g',
        s: 'gold_s',
        c: 'gold_c',
        y: 'gold_y'
    };
    const key = keyMap[type];
    if (!key) return;

    let currentYen = window.getAllMoneyInYen();
    let change = 0;
    switch(type) {
        case 'm': change = amount * 100000000; break;
        case 'g': change = amount * 1000000; break;
        case 's': change = amount * 10000; break;
        case 'c': change = amount * 100; break;
        case 'y': change = amount; break;
    }
    
    // Защита от ухода в минус при ручном изменении
    if (currentYen + change < 0) return;

    window.setMoneyFromYen(currentYen + change);
if (!skipFullUpdate) {
        window.updateUI(); // updateUI вызывает saveToStorage
    }}

window.getZakenPrice = function(level) {
    const prices = window.gameConfig.zakenPrices;
    if (level < 20) return prices[20];
    
    // Ищем подходящий диапазон
    for (let cap of [25, 30, 35, 40, 45, 50, 55, 60, 65, 70]) {
        if (level < cap) return prices[cap];
    }
    return prices[99];
}

window.showCustomConfirm = function(msg, onYes, onNo) {
    const modal = document.getElementById('custom-confirm-modal');
    // Сброс позиции
        modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
        modal.style.zIndex = '9002';


    document.getElementById('confirm-message').innerHTML = msg;
    const yesBtn = document.getElementById('confirm-yes-btn');
    const noBtn = document.getElementById('confirm-no-btn');
    
    // Сброс классов кнопок по умолчанию
    yesBtn.className = 'death-confirm-btn';
    noBtn.className = 'death-cancel-btn';

    yesBtn.style.display = 'inline-block';
    noBtn.style.display = 'inline-block';
    
    // Полный сброс состояния кнопок (фикс залипания disabled/opacity)
    yesBtn.disabled = false;
    yesBtn.style.opacity = '1';
    yesBtn.title = '';
    yesBtn.style.background = '';
    yesBtn.style.borderColor = '';

    noBtn.disabled = false;
    noBtn.style.opacity = '1';
    noBtn.title = '';
    noBtn.style.background = '';
    noBtn.style.borderColor = '';

    yesBtn.innerText = 'ДА';
    noBtn.innerText = 'ОТМЕНА';
    
    yesBtn.onclick = function() {
        window.fadeOutModal(modal, () => { if (onYes) onYes(); });
    };
    
    noBtn.onclick = function() {
        window.fadeOutModal(modal, () => { if (onNo) onNo(); });
    };
    
    window.fadeInModal(modal);
}

window.showCustomAlert = function(msg, onClose) {
    const modal = document.getElementById('custom-confirm-modal');
    // Сброс позиции
        modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';

    document.getElementById('confirm-message').innerHTML = msg;
    const yesBtn = document.getElementById('confirm-yes-btn');
    const noBtn = document.getElementById('confirm-no-btn');
    
    yesBtn.style.display = 'inline-block';
    noBtn.style.display = 'none';
    yesBtn.innerText = 'OK';
    
    yesBtn.onclick = function() {
        window.fadeOutModal(modal, () => { if (onClose) onClose(); });
    };
    
    window.fadeInModal(modal);
}

window.closeWindow = function() { 
    const win = document.getElementById('text-window');
    window.fadeOutModal(win);
}

window.showCustomPrompt = function(title, text, defaultValue, onOk, isText = false) {
    const modal = document.getElementById('custom-prompt-modal');
    // Сброс позиции
        modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';

    document.getElementById('prompt-title').innerText = title;
    document.getElementById('prompt-text').innerHTML = text;
    const input = document.getElementById('prompt-input');
    
    if (isText) {
        input.type = 'text';
    } else {
        input.type = 'number';
    }
    input.value = defaultValue;

    const okBtn = document.getElementById('prompt-ok-btn');
    const cancelBtn = document.getElementById('prompt-cancel-btn');

    const close = () => window.fadeOutModal(modal);

    okBtn.onclick = () => {
        let value = input.value;
        if (!isText) {
            value = parseInt(value);
        }
        if (onOk) {
            onOk(value);
        }
        close();
    };

    cancelBtn.onclick = close;

    // Ручная анимация для сохранения display: flex (исправляет скачок позиции)
    modal.style.opacity = '0';
    modal.style.display = 'flex';
   requestAnimationFrame(() => {
        modal.style.transition = 'opacity 0.3s ease';
        modal.style.opacity = '1';
        input.focus();
        input.select();
    });
}

window.exportSaveFile = function() {
    window.playerData.saveCount = (window.playerData.saveCount || 0) + 1;
    window.saveToStorage();
    
    // Сброс таймера напоминания
    if (window.resetSaveReminder) window.resetSaveReminder();

    const dataStr = JSON.stringify(window.playerData, null, 2);
    const blob = new Blob([dataStr], {type: "text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const filename = `Diablo3Mod(${window.playerData.saveCount})${dd}.${mm}.${yyyy}//\\\\${hh}:${min}.txt`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

window.importSaveFile = function() {
    document.getElementById('load-file-input').click();
}

window.handleFileSelect = function(input) {
    const file = input.files[0];
    if (!file) return;

    // Восстановление кастомного курсора после закрытия окна выбора файла
    document.body.style.cursor = "url('cursor.png'), auto";

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data && typeof data === 'object') {
                // Объединяем с текущей структурой, чтобы гарантировать наличие новых полей
                window.playerData = { ...window.playerData, ...data };
                
                // Восстанавливаем сложные объекты, если они отсутствуют в старом сохранении
                if (!window.playerData.learnedSkills) window.playerData.learnedSkills = {};
                if (!window.playerData.inventory) window.playerData.inventory = [];
                if (!window.playerData.active_rents) window.playerData.active_rents = [];
                if (!window.playerData.forgottenSkills) window.playerData.forgottenSkills = {};
                if (!window.playerData.professions) window.playerData.professions = { 1: false, 2: false, 3: false };
                if (!window.playerData.claimed_torments) window.playerData.claimed_torments = [];
                if (!window.playerData.claimed_ranks) window.playerData.claimed_ranks = [];
                if (!window.playerData.history) window.playerData.history = [];
                if (!window.playerData.settings) window.playerData.settings = { screamer: true, vfx: true, coinShimmer: 2 };

                window.saveToStorage();
                window.restorePanels();
                window.updateUI();
                window.showCustomAlert("✅ Сохранение успешно загружено!");
            } else {
                window.showCustomAlert("❌ Ошибка: Некорректный файл.");
            }
        } catch (err) {
            console.error(err);
            window.showCustomAlert("❌ Ошибка при чтении файла.");
        }
        input.value = ''; // Сброс, чтобы можно было выбрать тот же файл снова
    };
    reader.readAsText(file);
}

// --- DEBUG AND VALIDATION FUNCTIONS ---

/**
 * Проверяет расчет стоимости навыка на наличие потенциальных ошибок или нелогичных значений.
 */
window.validateSkillCost = function(className, skillIdx, runeIdx) {
    const runeData = window.skillDB[className]?.[skillIdx]?.runes?.[runeIdx];
    if (!runeData) {
        return "Данные о руне не найдены.";
    }

    // calculateRuneCostFromDB находится в logic_calc.js, который загружается позже.
    // Это нормально, так как функция вызывается только при действии пользователя.
    if (typeof window.calculateRuneCostFromDB !== 'function') return null;

    const { cost } = window.calculateRuneCostFromDB(className, skillIdx, runeIdx);

    // 1. Отрицательная стоимость
    if (cost < 0) {
        return `Критическая ошибка: Расчетная стоимость отрицательна (${cost.toFixed(2)}).`;
    }

    // 2. Проверка конвертации снижения урона в стойкость
    if (runeData.buffDef && runeData.desc) {
        const match = runeData.desc.match(/(-|снижени\w+)\s*(\d+)%/i);
        if (match) {
            const reduction = parseInt(match[2]);
            if (reduction > 0 && reduction < 100) {
                const expectedToughness = (1 / (1 - reduction / 100) - 1) * 100;
                const actualToughness = runeData.buffDef;
                // Допускаем погрешность в 1%
                if (Math.abs(expectedToughness - actualToughness) > 1) {
                    return `Несоответствие расчета стойкости. При снижении ${reduction}%, ожидаемая стойкость ~${expectedToughness.toFixed(0)}%, а указана ${actualToughness}%.`;
                }
            }
        }
    }

    return null; // Нет ошибок
}

/**
 * Проверяет стоимость предмета при покупке или крафте.
 */
window.validateItemAction = function(cost, level, grade, mode) {
    if (typeof cost !== 'number' || isNaN(cost)) {
        return "Критическая ошибка: Цена предмета не является числом (NaN).";
    }
    if (cost < 0) {
        return "Критическая ошибка: Цена предмета отрицательная.";
    }
    
    // Проверка на 0 (кроме продажи и Торговцев)
    if (cost === 0 && mode !== 'sell' && level > 1) {
        const g = (window.playerData.guild || "").toLowerCase();
        if (!g.includes('торговц')) {
             return "Внимание: Цена предмета равна 0. Проверьте расчеты.";
        }
    }
    return null;
}

/**
 * Проверяет стоимость операций с камнями.
 */
window.validateGemAction = function(cost, rank, quantity, operation) {
    if (typeof cost !== 'number' || isNaN(cost)) return "Ошибка: Стоимость операции с камнями не является числом.";
    if (cost < 0) return "Ошибка: Стоимость отрицательная.";
    return null;
}

window.validateGenericAction = function(cost, actionName) {
    if (typeof cost !== 'number' || isNaN(cost)) return `Ошибка: Стоимость "${actionName}" не является числом.`;
    if (cost < 0) return `Ошибка: Стоимость "${actionName}" отрицательная.`;
    return null;
}

window.updateHistory = function(force = false) {
    const d = window.playerData;
    const now = Date.now();
    if (!d.history) d.history = []; // Защита от отсутствия истории
    const lastPoint = d.history[d.history.length - 1];
// Интервал: 1 минута для первой точки после старта, 5 минут для остальных
    let interval = 300000; // 5 мин
    if (d.history.length === 1) interval = 60000; // 1 мин

    if (force || !lastPoint || (now - lastPoint.time > interval)) {        const wealth = Math.floor(window.getAllMoneyInYen() / 10000); // В серебре для компактности
        // Данные для 70 уровня
        const dmg = (d.level >= 70) ? (d.calculated_dmg || 0) : 0;
        const tough = (d.level >= 70) ? (d.calculated_tough || 0) : 0;
        d.history.push({
            time: now,
            para: Math.floor(d.para),
wealth: wealth,
            deaths: (d.death_history || []).length,
            dmg: dmg,
            tough: tough        });
        // Храним последние 50 точек
        if (d.history.length > 50) d.history.shift();
    }
}
