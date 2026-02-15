// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И УТИЛИТЫ ---

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
    found_legs: 0, found_yellows: 0,
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
    className: "Класс не выбран",
    build: "",
    build_2: "", // Второй билд
    guild: "Нет",
    class_html_2: "", // HTML второго билда
    rank: 0,
    rankName: "",
    joined_level: 1, // Уровень, на котором вступили в гильдию
    saveCount: 0
};

// Исправление для старых сохранений
if (!window.playerData.inventory) window.playerData.inventory = [];
if (!window.playerData.learnedSkills) window.playerData.learnedSkills = {};
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
window.audioTrack = new Audio('06 - The Slaughtered Calf Inn.mp3');
window.audioTrack.loop = true;
window.coinSound = new Audio('freesound_community-coin-clatter-6-87110.mp3');
window.activeRiftMultiplier = null; // Множитель наград за текущий рифт (null если нет активной цепочки)
window.activeRiftExpMultiplier = null; // Отдельный множитель для опыта (для ВП)
window.riftSuccess = null; // Флаг успешного закрытия портала
window.idleTimer = null;

// --- УТИЛИТЫ ---

window.saveToStorage = function() {
    localStorage.setItem('d3mod_player', JSON.stringify(window.playerData));
}

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

    if (window.coinSound && window.playerData.gold_y !== undefined) {
        window.coinSound.currentTime = 0;
        window.coinSound.play().catch(e => {
            console.warn("Audio play failed:", e);
        });
    }
}

window.addYen = function(yenAmount) {
    if (isNaN(yenAmount) || yenAmount === 0) return;
    const currentYen = window.getAllMoneyInYen();
    window.setMoneyFromYen(currentYen + Math.floor(yenAmount));
    // setMoneyFromYen уже включает звук, так что дополнительный вызов не нужен
}

window.getZakenPrice = function(level) {
    if (level < 20) return 12000;
    if (level < 25) return 12000;
    if (level < 30) return 20000;
    if (level < 35) return 30000;
    if (level < 40) return 50000;
    if (level < 45) return 90000;
    if (level < 50) return 130000;
    if (level < 55) return 230000;
    if (level < 60) return 350000;
    if (level < 65) return 700000;
    if (level < 70) return 820000;
    return 970000;
}

window.showCustomConfirm = function(msg, onYes, onNo) {
    const modal = document.getElementById('custom-confirm-modal');
    // Сброс позиции
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';

    document.getElementById('confirm-message').innerHTML = msg;
    const yesBtn = document.getElementById('confirm-yes-btn');
    const noBtn = document.getElementById('confirm-no-btn');
    
    // Сброс классов кнопок по умолчанию
    yesBtn.className = 'death-confirm-btn';
    noBtn.className = 'death-cancel-btn';

    yesBtn.style.display = 'inline-block';
    noBtn.style.display = 'inline-block';
    yesBtn.innerText = 'ДА';
    noBtn.innerText = 'ОТМЕНА';
    
    yesBtn.onclick = function() {
        modal.style.display = 'none';
        if (onYes) onYes();
    };
    
    noBtn.onclick = function() {
        modal.style.display = 'none';
        if (onNo) onNo();
    };
    
    modal.style.display = 'block';
}

window.showCustomAlert = function(msg) {
    const modal = document.getElementById('custom-confirm-modal');
    // Сброс позиции
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
        modal.style.display = 'none';
    };
    
    modal.style.display = 'block';
}

window.closeWindow = function() { 
    document.getElementById('text-window').style.display = 'none'; 
}

window.showCustomPrompt = function(title, text, defaultValue, onOk, isText = false) {
    const modal = document.getElementById('custom-prompt-modal');
    // Сброс позиции
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

    const close = () => modal.style.display = 'none';

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

    modal.style.display = 'flex';
    input.focus();
    input.select();
}

window.exportSaveFile = function() {
    window.playerData.saveCount = (window.playerData.saveCount || 0) + 1;
    window.saveToStorage();

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

// --- ФУНКЦИИ ОБМЕНА КОДОМ ---

window.currentCodeMode = 'full';

window.switchCodeMode = function(mode) {
    window.currentCodeMode = mode;
    document.getElementById('btn-mode-full').classList.toggle('active', mode === 'full');
    document.getElementById('btn-mode-stats').classList.toggle('active', mode === 'stats');
    window.openSaveCodeModal(); // Перегенерировать код
}

window.openSaveCodeModal = function() {
    const modal = document.getElementById('save-code-modal');
    const textarea = document.getElementById('save-code-area');
    
    // Генерируем код из текущих данных
    try {
        let dataToExport;
        
        if (window.currentCodeMode === 'stats') {
            // Экспорт только статистики для напарника
            dataToExport = {
                type: 'stats',
                name: window.playerData.name,
                dmg: window.playerData.calculated_dmg || 0,
                tough: window.playerData.calculated_tough || 0,
                last_kills: window.playerData.last_run_kills || 0,
                timestamp: Date.now()
            };
        } else {
            // Полный экспорт
            dataToExport = window.playerData;
            dataToExport.type = 'full'; // Маркер типа
        }

        const json = JSON.stringify(dataToExport);
        // Кодируем в Base64 с поддержкой Unicode (русских букв)
        const code = btoa(unescape(encodeURIComponent(json)));
        textarea.value = code;
    } catch (e) {
        console.error("Error generating save code", e);
        textarea.value = "Ошибка генерации кода";
    }
    
    modal.style.display = 'block';
    // Центрирование (на всякий случай, хотя CSS есть)
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
}

window.loadFromCode = function() {
    const textarea = document.getElementById('save-code-area');
    const code = textarea.value.trim();
    
    if (!code) {
        window.showCustomAlert("❌ Введите код сохранения.");
        return;
    }
    
    try {
        // Декодируем Base64
        const json = decodeURIComponent(escape(atob(code)));
        const data = JSON.parse(json);
        
        // Обработка статистики напарника
        if (data.type === 'stats') {
            window.partnerData = data;
            window.showCustomAlert(`✅ <b>Статистика напарника загружена!</b><br>Имя: ${data.name}<br>Урон: ${parseInt(data.dmg).toLocaleString()}<br>Живучесть: ${parseInt(data.tough).toLocaleString()}<br>Убийств за ран: ${data.last_kills}`);
            document.getElementById('save-code-modal').style.display = 'none';
            // Обновляем UI калькуляторов если они открыты
            if (document.getElementById('difficulty-calc-modal').style.display === 'block') window.openDifficultyCalculator();
            if (document.getElementById('exp-calc-modal').style.display === 'block') window.calculateExp();
            return;
        }

        if (data && typeof data === 'object') {
            // Объединяем и восстанавливаем (логика как в handleFileSelect)
            window.playerData = { ...window.playerData, ...data };
            
            // Восстанавливаем сложные объекты если их нет
            if (!window.playerData.learnedSkills) window.playerData.learnedSkills = {};
            if (!window.playerData.inventory) window.playerData.inventory = [];
            if (!window.playerData.active_rents) window.playerData.active_rents = [];
            if (!window.playerData.forgottenSkills) window.playerData.forgottenSkills = {};
            if (!window.playerData.professions) window.playerData.professions = { 1: false, 2: false, 3: false };
            if (!window.playerData.claimed_torments) window.playerData.claimed_torments = [];
            if (!window.playerData.claimed_ranks) window.playerData.claimed_ranks = [];

            window.saveToStorage();
            window.restorePanels();
            window.updateUI();
            document.getElementById('save-code-modal').style.display = 'none';
            window.showCustomAlert("✅ Данные успешно загружены из кода!");
        } else {
            window.showCustomAlert("❌ Ошибка: Некорректный код.");
        }
    } catch (err) {
        console.error(err);
        window.showCustomAlert("❌ Ошибка: Некорректный код или формат.");
    }
}

window.copyCodeToClipboard = function() {
    const textarea = document.getElementById('save-code-area');
    textarea.select();
    textarea.setSelectionRange(0, 99999); /* Для мобильных */
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            window.showCustomAlert("✅ Код скопирован в буфер обмена!");
        } else {
            window.showCustomAlert("❌ Не удалось скопировать.");
        }
    } catch (err) {
        window.showCustomAlert("❌ Ошибка копирования.");
    }
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
