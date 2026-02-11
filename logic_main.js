// --- ИНИЦИАЛИЗАЦИЯ ---

window.onload = function() {
    // Агрегация данных
    window.gameData = {
        main: [
            { id: 'econ', title: 'Экономика' },
            { id: 'guilds', title: 'Гильдии и Классы' },
            { id: 'skills_root', title: 'Навыки и Опыт' },
            { id: 'portals', title: 'Порталы' },
            { id: 'death_root', title: 'Смерть, Сложность, Профы' }
        ],
        ...window.economyData,
        ...window.guildsData,
        ...window.classesData,
        ...window.skillsData,
        ...window.worldData
    };

    // Восстановление состояния
    window.restorePanels();
    window.updateUI();
    window.renderMenu('main', 'ГЛАВНАЯ', true);

    // Настройка и попытка автозапуска музыки
    const slider = document.getElementById('volume-slider');
    window.audioTrack.volume = 0.15;
    if (slider) slider.value = 0.15;
    
    // Попытка автозапуска (может быть заблокирована браузером)
    window.toggleMusic(); 

    // Гарантированный запуск при первом клике
    document.addEventListener('click', function initAudio() {
        if (!window.isMusicPlaying) window.toggleMusic();
        document.removeEventListener('click', initAudio);
    }, { once: true });

    // Глобальный обработчик клавиатуры для модальных окон
    document.addEventListener('keydown', (event) => {
        // --- ESC to close modals ---
        if (event.key === 'Escape') {
            const modals = [
                'add-money-modal', 'sell-leg-gem-modal',
                'custom-prompt-modal', 'custom-confirm-modal', 'iframe-modal', 
                'multi-sell-modal', 'gem-service-modal', 'sell-craft-modal', 
                'zaken-buy-modal', 'skill-calc-modal', 'exp-calc-modal', 'difficulty-calc-modal',
                'death-modal', 'text-window'
            ]; // Ordered from most to least specific/top-level
            
            for (const id of modals) {
                const modal = document.getElementById(id);
                if (modal && (modal.style.display === 'block' || modal.style.display === 'flex')) {
                    modal.style.display = 'none';
                    return; // Close only the top-most modal
                }
            }
        }

        // --- Enter to confirm ---
        if (event.key === 'Enter') {
            // Blur character sheet inputs on Enter
            if (document.activeElement && document.activeElement.classList.contains('char-input')) {
                document.activeElement.blur();
                return;
            }

            // Handle custom prompt (input field)
            const promptModal = document.getElementById('custom-prompt-modal');
            if (promptModal && promptModal.style.display === 'flex') {
                event.preventDefault();
                document.getElementById('prompt-ok-btn').click();
                return;
            }
            
            // Handle custom confirm (Yes/No/OK)
            const confirmModal = document.getElementById('custom-confirm-modal');
            if (confirmModal && confirmModal.style.display === 'block') {
                const yesBtn = document.getElementById('confirm-yes-btn');
                const allowedTexts = ['ДА', 'OK', 'ПОДТВЕРДИТЬ'];
                if (allowedTexts.includes(yesBtn.innerText) && yesBtn.style.display !== 'none') {
                    event.preventDefault();
                    yesBtn.click();
                    return;
                }
            }
        }
    });
    
    // Запуск слежения за бездействием
    document.addEventListener('mousemove', window.resetIdleTimer);
    document.addEventListener('keydown', window.resetIdleTimer);
    document.addEventListener('click', window.resetIdleTimer);
    document.addEventListener('touchstart', window.resetIdleTimer);
    window.resetIdleTimer();

    // Запуск случайных глитч-эффектов
    startRandomGlitches();

    // Инициализация перетаскивания для всех модальных окон
    const draggableIds = ['text-window', 'death-modal', 'skill-calc-modal', 'exp-calc-modal', 'difficulty-calc-modal', 'zaken-buy-modal', 'sell-craft-modal', 'gem-service-modal', 'multi-sell-modal', 'custom-confirm-modal', 'custom-prompt-modal', 'add-money-modal', 'sell-leg-gem-modal'];
    draggableIds.forEach(id => {
        window.makeDraggable(document.getElementById(id));
    });

    // Звук клика
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.id === 'randomizer-btn') {
            const clickSound = new Audio('soundreality-button-4-214382.mp3');
            clickSound.volume = 0.5;
            clickSound.play().catch(() => {});
        }
    });
};

// Функция для случайных глитч-эффектов
window.startRandomGlitches = function() {
    const screamer = document.getElementById('screamer-sound');

    // 1. Таймер для Скримера (Звук) - Ровно каждые 30 секунд
    setInterval(() => {
        if (!screamer) return;
        // 40% шанс на звук
        if (Math.random() < 0.40) {
            screamer.currentTime = 0;
            screamer.volume = 0.104; // 0.08 * 1.3
            screamer.play().catch(() => {});
        }
    }, 30000);
}

// Таймер бездействия
window.resetIdleTimer = function() {
    const screen = document.getElementById('idle-screen');
    if(screen && screen.classList.contains('active')) {
        screen.classList.remove('active');
        setTimeout(() => {
            if(!screen.classList.contains('active')) screen.style.display = 'none';
        }, 1000);
    }
    clearTimeout(window.idleTimer);
    window.idleTimer = setTimeout(window.showIdleScreen, 30000);
}

window.showIdleScreen = function() {
    const screen = document.getElementById('idle-screen');
    if(screen) {
        screen.style.display = 'flex';
        void screen.offsetWidth;
        screen.classList.add('active');
    }
}

// Функция перетаскивания
window.makeDraggable = function(elmnt) {
    if (!elmnt) return;
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    // Ищем заголовок для перетаскивания
    const header = elmnt.querySelector('h2') || elmnt.querySelector('h3') || elmnt.querySelector('#window-title') || elmnt.querySelector('#prompt-title') || elmnt.querySelector('#confirm-title');
    
    if (header) {
        header.onmousedown = dragMouseDown;
        header.style.cursor = 'move';
    } else {
        // Если заголовка нет, тянем за сам элемент (аккуратно, может мешать кликам)
        // elmnt.onmousedown = dragMouseDown; 
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        // Рассчитываем позицию элемента в пикселях и отключаем transform
        const rect = elmnt.getBoundingClientRect();
        elmnt.style.top = rect.top + 'px';
        elmnt.style.left = rect.left + 'px';
        elmnt.style.transform = 'none';

        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
