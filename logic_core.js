// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И УТИЛИТЫ ---

// 1. Пытаемся достать данные из LocalStorage
const savedData = localStorage.getItem('d3mod_player');
// 2. Если данные есть — превращаем их в объект, если нет — создаем новый
window.playerData = savedData ? JSON.parse(savedData) : {
    name: "НЕФАЛЕМ",
    level: 1,
    gold_g: 0, gold_s: 0, gold_c: 0, gold_y: 0,
    runes: 0,
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
    black_market: 0,
    zaken_discount: "",
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
    
    // Пентограмма (чекбоксы)
    penta_1: false, penta_2: false, penta_3: false,
    
    learnedSkills: {},
    className: "Класс не выбран",
    build: "",
    guild: "Нет",
    rank: 0,
    rankName: "",
    joined_level: 1, // Уровень, на котором вступили в гильдию
    saveCount: 0
};

// Исправление для старых сохранений
if (!window.playerData.inventory) window.playerData.inventory = [];
if (!window.playerData.learnedSkills) window.playerData.learnedSkills = {};
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
if (!window.playerData.difficulty) window.playerData.difficulty = "Высокий";
if (typeof window.playerData.refused_wizard_promotion === 'undefined') window.playerData.refused_wizard_promotion = false;
if (typeof window.playerData.saveCount === 'undefined') window.playerData.saveCount = 0;

// Глобальные переменные состояния
window.historyStack = ['main'];
window.pathNames = ['ГЛАВНАЯ'];
window.pendingVampireJoin = false;
window.isMusicPlaying = false;
window.lastResourceSellLevel = 1;
window.lastCraftSellLevel = 1;
window.audioTrack = new Audio('06 - The Slaughtered Calf Inn.mp3');
window.audioTrack.loop = true;
window.coinSound = new Audio('freesound_community-coin-clatter-6-87110.mp3');
window.idleTimer = null;

// --- УТИЛИТЫ ---

window.saveToStorage = function() {
    localStorage.setItem('d3mod_player', JSON.stringify(window.playerData));
}

window.getAllMoneyInYen = function() {
    return (window.playerData.gold_g * 1000000) + (window.playerData.gold_s * 10000) + (window.playerData.gold_c * 100) + window.playerData.gold_y;
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
    
    window.playerData.gold_g = absYen * sign;

    if (window.coinSound && window.playerData.gold_y !== undefined) {
        window.coinSound.currentTime = 0;
        window.coinSound.play().catch(e => {
            console.warn("Audio play failed:", e);
        });
    }
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

window.showCustomPrompt = function(title, text, defaultValue, onOk) {
    const modal = document.getElementById('custom-prompt-modal');
    // Сброс позиции
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';

    document.getElementById('prompt-title').innerText = title;
    document.getElementById('prompt-text').innerHTML = text;
    const input = document.getElementById('prompt-input');
    input.value = defaultValue;

    const okBtn = document.getElementById('prompt-ok-btn');
    const cancelBtn = document.getElementById('prompt-cancel-btn');

    const close = () => modal.style.display = 'none';

    okBtn.onclick = () => {
        const value = parseInt(input.value);
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
