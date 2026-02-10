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
    window.audioTrack.volume = 0.3;
    if (slider) slider.value = 0.3;
    
    // Попытка автозапуска (может быть заблокирована браузером)
    window.toggleMusic(); 

    // Гарантированный запуск при первом клике
    document.addEventListener('click', function initAudio() {
        if (!window.isMusicPlaying) window.toggleMusic();
        document.removeEventListener('click', initAudio);
    }, { once: true });

    
    // Запуск слежения за бездействием
    document.addEventListener('mousemove', window.resetIdleTimer);
    document.addEventListener('keydown', window.resetIdleTimer);
    document.addEventListener('click', window.resetIdleTimer);
    document.addEventListener('touchstart', window.resetIdleTimer);
    window.resetIdleTimer();

    // Звук клика
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.id === 'randomizer-btn') {
            const clickSound = new Audio('soundreality-button-4-214382.mp3');
            clickSound.volume = 0.5;
            clickSound.play().catch(() => {});
        }
    });
};

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
