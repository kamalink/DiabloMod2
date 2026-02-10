// --- ИНИЦИАЛИЗАЦИЯ ---

window.onload = function() {
    // Агрегация данных
    window.gameData = {
        main: [
            { id: 'econ', title: '1. Экономика' },
            { id: 'guilds', title: '2. Гильдии и Классы' },
            { id: 'skills_root', title: '3. Навыки и Опыт' },
            { id: 'portals', title: '4. Порталы' },
            { id: 'death_root', title: '5. Смерть, Сложность, Профы' }
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
                'custom-prompt-modal', 'custom-confirm-modal', 'iframe-modal', 
                'multi-sell-modal', 'gem-service-modal', 'sell-craft-modal', 
                'zaken-buy-modal', 'skill-calc-modal', 'exp-calc-modal', 
                'death-modal', 'edit-modal', 'text-window'
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
function startRandomGlitches() {
    const overlay = document.getElementById('glitch-overlay');
    const screamer = document.getElementById('screamer-sound');

    // Не запускать, если элементы не найдены
    if (!overlay || !screamer) return;

    // Функция для запуска одного эффекта
    const triggerEffect = () => {
        // 15% шанс на срабатывание
        if (Math.random() < 0.15) {
            screamer.currentTime = 0;
            screamer.volume = 0.08;
            screamer.play().catch(() => {});

            overlay.classList.add('active');
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 400); // Должно соответствовать длительности анимации в CSS
        }
        
        // Запланировать следующую проверку
        const randomInterval = Math.random() * 20000 + 10000; // от 10 до 30 секунд
        setTimeout(triggerEffect, randomInterval);
    };

    // Запускаем цикл
    triggerEffect();
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
