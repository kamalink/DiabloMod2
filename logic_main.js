// --- ИНИЦИАЛИЗАЦИЯ ---

let currencyInterval;
let currencyTimeout;

window.startCurrencyChange = function(type, amount) {
    // Первое изменение сразу при нажатии
    window.addCurrency(type, amount);
    
    // Запускаем таймаут, а после него - интервал для ускоренного изменения
    currencyTimeout = setTimeout(() => {
        currencyInterval = setInterval(() => {
            window.addCurrency(type, amount, true); // true = пропускаем тяжелое сохранение
        }, 100); // Повторять каждые 100мс
    }, 500); // Задержка перед ускорением 500мс
}

window.stopCurrencyChange = function() {
    clearTimeout(currencyTimeout);
    clearInterval(currencyInterval);
}

window.screamerSound = new Audio('screamer.mp3');
window.craftSound = new Audio('diablo-3-craft-done.mp3');
window.igniteSound = new Audio('ignite.mp3');
window.extinguishSound = new Audio('extinguish.mp3');
window.igniteSound.volume = 0.2;
window.extinguishSound.volume = 0.4;

window.onload = function() {
    // Агрегация данных
    window.gameData = {
        main: [
            { id: 'econ', title: 'Экономика' },
            { id: 'guilds', title: 'Гильдии и Классы' },
            { id: 'skills_root', title: 'Навыки и Опыт' },
            { id: 'portals', title: 'Порталы' },
            { id: 'progress_menu', title: 'Прогресс' },
            { id: 'death_root', title: 'Смерть, Сложность, Профы' }
       ],
        ...window.economyData,
        ...window.guildsData,
        ...window.classesData,
        ...window.skillsData,
        ...window.worldData
    };


    // Данные для меню прогресса
    window.gameData.progress_menu = {
        content: `<div id="progress-content-area"></div><script>document.getElementById('progress-content-area').innerHTML = window.renderProgressMenu();</script>`
    };
    // Хак для выполнения скрипта внутри контента (так как innerHTML не выполняет скрипты)
    const originalShowText = window.showText;
    window.showText = function(title, content) {
        originalShowText(title, content);
        if (title === 'Прогресс') {
            document.getElementById('window-content').innerHTML = window.renderProgressMenu();
        }
        if (title === '⚙️ Настройки') {
            document.getElementById('window-content').innerHTML = window.renderSettingsMenu();
        }
    };

    // Создание слоя динамического фона, если его нет
    if (!document.getElementById('dynamic-bg-layer')) {
        const bgLayer = document.createElement('div');
        bgLayer.id = 'dynamic-bg-layer';
        document.body.insertBefore(bgLayer, document.body.firstChild); // Вставляем в начало body
         }

    // Добавляем тени‑объёма к карточке игрока и виджетам
    // виджеты получают динамическую тень. Карточка игрока будет оформлена отдельно.
    const depthIds = ['learned-skills-widget','inventory-widget','journal-widget','active-guild-bonus','active-class-bonus','active-class-bonus-2'];
    depthIds.forEach(id=>{
        const el = document.getElementById(id);
        if(el) el.classList.add('depth-shadow');
    });

    // обновление тени по позиции
    window.updateShadowForEl = function(el) {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const angle = Math.atan2(cy - window.innerHeight/2, cx - window.innerWidth/2);
        // длина тени зависит от расстояния до центра, но минимум 15, максимум 40
        const dist = Math.hypot(cx - window.innerWidth/2, cy - window.innerHeight/2);
        const len = Math.min(40, Math.max(15, dist / 15));
        const dx = Math.cos(angle) * len;
        const dy = Math.sin(angle) * len;
        el.style.setProperty('--shadow-x', dx + 'px');
        el.style.setProperty('--shadow-y', dy + 'px');
    };

    // apply to all depth elements
    window.updateAllShadows = function() {
        depthIds.forEach(id=>{
            const el=document.getElementById(id);
            if(el) window.updateShadowForEl(el);
        });
    };

    // call on resize to reposition shadow angle
    window.addEventListener('resize', window.updateAllShadows);
    // also update header title shadow
    window.updateHeaderShadow = function() {
        const el = document.querySelector('.header-title');
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const angle = Math.atan2(cy - window.innerHeight/2, cx - window.innerWidth/2);
        const dist = Math.hypot(cx - window.innerWidth/2, cy - window.innerHeight/2);
        const len = Math.min(20, Math.max(5, dist / 20));
        const dx = Math.cos(angle) * len;
        const dy = Math.sin(angle) * len;
        el.style.setProperty('--title-shadow-x', dx + 'px');
        el.style.setProperty('--title-shadow-y', dy + 'px');
    };
    // modify updateAllShadows to include header
    const originalUpdateAll = window.updateAllShadows;
    window.updateAllShadows = function() {
        if (originalUpdateAll) originalUpdateAll();
        window.updateHeaderShadow();
    };
    // следим за изменением размеров виджетов
    if (window.ResizeObserver) {
        const ro = new ResizeObserver(entries => {
            entries.forEach(entry => {
                if (window.updateShadowForEl) window.updateShadowForEl(entry.target);
            });
        });
        depthIds.forEach(id=>{
            const el=document.getElementById(id);
            if (el) ro.observe(el);
        });
    }
    // слежение за курсором для освещения виджетов
    document.addEventListener('mousemove', e => {
        document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    });

    // Создание кнопки настроек (шестеренка)
    if (!document.getElementById('settings-btn')) {
        const btn = document.createElement('button');
        btn.id = 'settings-btn';
        btn.innerHTML = '⚙️';
        btn.title = 'Настройки';
        btn.onclick = function() { window.showText('⚙️ Настройки', ''); };
        document.body.appendChild(btn);
    }

    // Восстановление состояния
    window.restorePanels();
    window.restoreWidgetPositions();
    if (window.updateAllShadows) window.updateAllShadows();
    window.updateUI();
    window.updateCoinStacks(); // перемещенный вызов
        window.replaceStaticIcons(); // Глобальный проход один раз при загрузке
            window.renderCandles(); // Создание свечей
    window.renderMenu('main', 'ГЛАВНАЯ', true);

    // Настройка и попытка автозапуска музыки
    const slider = document.getElementById('volume-slider');
    window.audioTrack.volume = 0.15;
    if (slider) slider.value = 0.15;
    

    // Глобальный обработчик клавиатуры для модальных окон
    document.addEventListener('keydown', (event) => {
        // --- ESC to close modals ---
        if (event.key === 'Escape') {
            const modals = [
                'add-money-modal', 'sell-leg-gem-modal', 'sell-craft-modal', 'buy-ancient-modal', 'buy-set-modal', 'buy-sell-agrade-modal',
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
    let lastIdleReset = 0;
    const throttledIdleReset = () => {
        const now = Date.now();
        // Сбрасываем таймер не чаще раза в секунду, если экран не активен
        if (now - lastIdleReset > 1000 || (document.getElementById('idle-screen') && document.getElementById('idle-screen').classList.contains('active'))) {
            window.resetIdleTimer();
            lastIdleReset = now;
        }
    };
    document.addEventListener('mousemove', throttledIdleReset);
    document.addEventListener('keydown', window.resetIdleTimer);
    document.addEventListener('click', window.resetIdleTimer);
    window.resetIdleTimer();

    // Запуск случайных глитч-эффектов
    startRandomGlitches();



    // Инициализация перетаскивания для всех модальных окон
// Оставляем перетаскивание только для виджетов
    const draggableIds = ['learned-skills-widget', 'inventory-widget', 'journal-widget'];    draggableIds.forEach(id => {
        window.makeDraggable(document.getElementById(id));
    });

    // Звук клика
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'IMG') {
            const clickSound = new Audio('soundreality-button-4-214382.mp3');
            clickSound.volume = 0.5;
            clickSound.play().catch(() => {});
        }
       if (window.playerData && window.playerData.settings) {
            window.createClickSparks(e.clientX, e.clientY);
            }

        // Перехват кнопки калькулятора опыта для сюжетных боссов
        if (e.target.classList.contains('exp-apply-btn')) {
            const bossInput = document.getElementById('exp-bosses');
            if (bossInput) {
                const val = parseInt(bossInput.value) || 0;
                if (val > 0) {
                    // Если введены боссы, считаем их сюжетными (по 1 за раз или скопом)
                    window.advanceStoryProgress(val);
                    // Сбрасываем поле, чтобы не накрутить лишнего при повторном нажатии (опционально)
                    bossInput.value = 0; 
                }
            }
        }
        
    });

     // Обработчик всплывающих подсказок (Hints)
    document.addEventListener('mouseover', function(e) {
        if (!window.playerData.settings || !window.playerData.settings.showTooltips) return;
        const target = e.target.closest('[data-hint]');
        if (target) {
            window.showCustomTooltip(e, target.dataset.hint);
        }
    });
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('[data-hint]')) window.hideCustomTooltip();
    });

    // Авто-ресайз полей ввода при вводе
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('char-input')) {
            window.autoResizeInput(e.target);
        }
    });

    // Огненный след за курсором при нажатии
    let isCursorDown = false;
        let lastFireTime = 0;
    document.addEventListener('mousedown', () => isCursorDown = true);
    document.addEventListener('mouseup', () => isCursorDown = false);
    document.addEventListener('mousemove', (e) => {
        if (isCursorDown) {
         const now = Date.now();
            if (now - lastFireTime > 50) { // Ограничение ~20 FPS для частиц
                if (window.playerData && window.playerData.settings) {
                    window.createFireTrail(e.clientX, e.clientY);
                }
                lastFireTime = now;
            }        }
    });

    // Проверка и создание недостающих модальных окон (фиксы ошибок)
    window.ensureModalsExist();

    // Восстановление состояния активного портала
    window.updateActiveRiftModal();
    
    // Обновление раскладки свойств в модальных окнах (унификация)
    window.updateModalLayouts();

    // Инъекция кнопки импорта карьеры
    const statsBtn = document.getElementById('import-stats-btn');
    if (statsBtn && !document.getElementById('import-career-btn')) {
        const careerBtn = document.createElement('button');
        careerBtn.id = 'import-career-btn';
        careerBtn.className = 'd2-button'; 
        careerBtn.innerHTML = '<span class="text-gradient-gold">B.net Карьера</span><span class="btn-shimmer"></span>';
        careerBtn.onclick = function(e) { window.importCareerFromBlizzard(e); };
        statsBtn.parentNode.insertBefore(careerBtn, statsBtn.nextSibling);
        
    }

    const credits = document.getElementById('credits-label');
    if(credits) credits.innerHTML += '<br>v1.1.0';
    
    // Инициализация напоминания о сохранении
    window.initSaveReminder();
    }; 

    // Функция запуска игры (вызывается кликом по экрану входа)
window.startGame = function() {
    if (window.gameStarted) return; // Защита от двойного клика
    window.gameStarted = true;
    const uiIds = [
        'char-sheet', 'right-panels-stack', 'reset-btn', 'settings-btn', 'music-btn', 'volume-slider',
        'breadcrumb', 'learned-skills-widget', 'widgets-container', 
        'inventory-widget', 'journal-widget', 'save-load-controls', 
        'buttons-area', 'credits-label'
    ];
    const overlay = document.getElementById('start-overlay');
    if (overlay) {
        overlay.style.opacity = '0'; // Плавное исчезновение
        overlay.style.cursor = "url('cursor.png'), auto"; // Кастомный курсор
        overlay.onclick = null; // Отключаем клик

        // Удаляем блокирующий слой только когда весь интерфейс появится (6.5с интро + 3с появление UI)
setTimeout(() => { 
            overlay.style.display = 'none';
            
            // Разблокируем интерфейс
            uiIds.forEach(id => {
                const el = document.getElementById(id);
if (el) {
                    el.style.pointerEvents = '';
                    el.style.opacity = '1'; // Принудительно фиксируем видимость
                    el.classList.remove('fade-in-ui'); // Удаляем класс анимации, чтобы она не перезапускалась
                }            });

            // Последовательное зажигание кнопок главного меню
            const buttons = document.querySelectorAll('.main-btn .btn-text');
            buttons.forEach((btnText, index) => {
                setTimeout(() => { btnText.classList.add('ignited'); }, index * 200);
            });
            window.mainMenuIgnited = true;
        }, 9500);    }
    // Запуск анимации заголовка
    const title = document.getElementById('menu-title');
    if (title) title.classList.add('animate-intro');

    // Запуск анимации появления интерфейса (таймер пойдет с этого момента)
    uiIds.forEach(id => {
        const el = document.getElementById(id);
 if (el) {
            el.classList.add('fade-in-ui');
            el.style.pointerEvents = 'none'; // Блокируем до конца анимации
        }    });

    // Таймер воспламенения (синхронизирован с анимацией)
    setTimeout(() => {
        if (title) {
            title.classList.add('ignited');
            if (window.igniteSound) { window.igniteSound.currentTime = 0; window.igniteSound.play().catch(() => {}); }

            title.onclick = function() {
                if (this.classList.contains('ignited')) {
                    this.classList.remove('ignited');
                    this.classList.add('extinguishing');
                    if (window.extinguishSound) { window.extinguishSound.currentTime = 0; window.extinguishSound.play().catch(() => {}); }

                    // Эффект дыма (как у свечей)
                    for (let i = 0; i < 30; i++) {
                        setTimeout(() => {
                            const smoke = document.createElement('div');
                            smoke.className = 'candle-smoke';
                            smoke.style.left = (Math.random() * 100) + '%'; // Случайно по ширине текста
                            smoke.style.top = (Math.random() * 50) + '%';
                            this.appendChild(smoke);
                            setTimeout(() => smoke.remove(), 5000);
                        }, i * 50);
                    }
                    
                    setTimeout(() => this.classList.remove('extinguishing'), 2500);
                } else {
                    this.classList.remove('extinguishing');
                    this.classList.add('ignited');
                    if (window.igniteSound) { window.igniteSound.currentTime = 0; window.igniteSound.play().catch(() => {}); }
                }
            };
        }
    }, 3000);

    // Таймер музыки
    setTimeout(() => {
        window.introFinished = true;
        window.toggleMusic();
    }, 6500);
}

window.advanceStoryProgress = function(count) {
    const oldProgress = window.playerData.story_progress || 0;
    let newProgress = oldProgress + count;
    if (newProgress > 24) newProgress = 24; // Максимум 24 (12 обычных + 12 НГ+)
    
    window.playerData.story_progress = newProgress;

    
    // Автоматическая смена акта
    // 1 Акт: 2 босса (Леорик, Мясник) -> переход на 2
    // 2 Акт: 3 босса (Магда, Кулл, Белиал) -> переход на 3 (всего 5)
    // 3 Акт: 3 босса (Кхом, Зверь, Азмодан) -> переход на 4 (всего 8)
    // 4 Акт: 2 босса (Раканот, Диабло) -> переход на 5 (всего 10)
    let newAct = window.playerData.act;
    if (newProgress >= 2 && oldProgress < 2) newAct = 2;
    if (newProgress >= 5 && oldProgress < 5) newAct = 3;
    if (newProgress >= 8 && oldProgress < 8) newAct = 4;
    if (newProgress >= 10 && oldProgress < 10) newAct = 5;
     if (newProgress >= 12 && oldProgress < 12) newAct = 6; // НГ+ Старт

    // НГ+ переходы (пороги + 12)
    if (newProgress >= 14 && oldProgress < 14) newAct = 7;
    if (newProgress >= 17 && oldProgress < 17) newAct = 8;
    if (newProgress >= 20 && oldProgress < 20) newAct = 9;
    if (newProgress >= 22 && oldProgress < 22) newAct = 10;
    
    if (newAct !== window.playerData.act) {
        window.playerData.act = newAct;
        window.showCustomAlert(`Акт завершен! Переход в Акт ${newAct}.`);
        window.updateDynamicBackground();
    }
    
    window.saveToStorage();
    window.renderCandles(); // Обновляем свечи
    window.updateUI(); // Обновляем UI (номер акта)
    // Если прогресс увеличился, запускаем событие Vodyani (ПОСЛЕ отрисовки свечей)
    if (newProgress > oldProgress) {
        window.playVodyaniEvent();
    }
}

window.playVodyaniEvent = function() {
    // 0. Блокируем другую музыку
    window.isVodyaniEventActive = true;

    // 1. Останавливаем текущую музыку
    const wasPlaying = window.isMusicPlaying;
    if (window.audioTrack) window.audioTrack.pause();

    // 2. Меняем фон
    const wallpaper = document.querySelector('.wallpaper');
    if (wallpaper) wallpaper.classList.add('vodyani-bg');

     // 3. Прячем курсор, отключаем скринсейвер, закрываем алерты
    clearTimeout(window.idleTimer);
    document.body.classList.add('cursor-hidden');
    setTimeout(() => {
        const alertModal = document.getElementById('custom-confirm-modal');
        if (alertModal && alertModal.style.display !== 'none') window.fadeOutModal(alertModal);
                document.body.classList.add('vodyani-ui-hidden');
    }, 2000);

    // 3. Запускаем трек
     if (window.vodyaniAudio) { window.vodyaniAudio.pause(); window.vodyaniAudio.currentTime = 0; }
    window.vodyaniAudio = new Audio('Vodyani_Prologue.mp3');
    window.vodyaniAudio.volume = 1.0;
        window.vodyaniAudio.load(); // Принудительная загрузка


    let animationId = null;
    const candles = document.querySelectorAll('.candle');


    const visualize = () => {
        const time = window.vodyaniAudio.currentTime;

        // DEBUG TIMER UPDATE
        const timerEl = document.getElementById('vodyani-debug-timer');
        if (timerEl) timerEl.innerText = time.toFixed(2);

        // Тайминги фаз (в секундах)
      const tInertia = 18;
        const tCall = 28;
        const tAccumulation = 41;
       const tAscension = 51.5;
        const tHolyMachine = 62.5;
        const tGrandFinale = 84.5;
        const tTransitionOut = 87.5; // Новая фаза перехода
        const tDissolution = window.vodyaniAudio.duration || 180; // Конец

        // Определяем фазу музыки по временной карте
       let phase = 'inertia';
        if (time < tInertia) phase = 'inertia';
        else if (time < tCall) phase = 'call';
        else if (time < tAccumulation) phase = 'accumulation';
        else if (time < tAscension) phase = 'ascension';
        else if (time < tHolyMachine) phase = 'holy_machine';
        else if (time < tGrandFinale) phase = 'grand_finale';
        else if (time < tTransitionOut) phase = 'transition_out';
        else if (time < tDissolution) phase = 'dissolution';
                else phase = 'end';

                const isTense = ['holy_machine', 'grand_finale'].includes(phase); // Убрал ascension и transition_out

        candles.forEach((candle, i) => {
             // 1. Игнорируем потушенные свечи (они не участвуют в шоу)
            if (candle.classList.contains('extinguished')) {
                candle.classList.remove('divinity');
                return;
            }
            let scale = 1.0;
             let opacity = 1.0;

            if (isTense) candle.classList.add('divinity');
            else candle.classList.remove('divinity');

            switch (phase) {
                case 'inertia': // 0:00 - 0:18
                    // Низкий гул, медленный opacity
                    scale = 1.0 + Math.sin(time * 2 + i) * 0.05;
                    opacity = 0.5 + Math.abs(Math.sin(time * 0.5 + i)) * 0.3;
                    break;
                case 'call': // 0:18 - 0:28
                    // Вокал, пульсация средних
                    if (i >= 4 && i < 8) scale = 1.1 + Math.abs(Math.sin(time * 3 + i)) * 0.2;
                    else scale = 1.0 + Math.sin(time + i) * 0.05;
                    opacity = 0.8;
                    break;
                case 'accumulation': // 0:28 - 0:41
                    // Рост масштаба, на 15% больше чем в фазе 2, без "божественности"
                    scale = 1.15 + Math.abs(Math.sin(time * 5 + i)) * 0.25;
                    opacity = 0.9;
                    break;
               case 'ascension': // 0:41 - 0:51.5
                     // Пик 1, пульсация каждые 1.4 секунды
                    scale = 1.2 + Math.abs(Math.sin(time * (Math.PI / 1.4))) * 0.2; 
                    break;
                case 'holy_machine': // 0:51.5 - 1:02.5
                    // Ритмичный бас, отрывистые движения
                    scale = 1.2 + (Math.sin(time * 6) > 0 ? 0.4 : 0);
                    if (i < 4) scale *= 1.2; // Басы
                    break;
                case 'grand_finale': // 1:02.5 - 1:24.5
                    // Максимальный пик
                    scale = 1.5 + Math.random() * 0.5;
                    break;
                case 'transition_out': // 1:24.5 - 1:27.5
                    const transProg = (time - tGrandFinale) / (tTransitionOut - tGrandFinale);
                    // Плавное уменьшение масштаба с пикового (~1.7) до нормального (1.0)
                    // Цвет меняется плавно благодаря CSS transition, так как убрали класс divinity
                    scale = 1.7 - (0.7 * transProg); 
                    break;
                case 'dissolution': // 1:27.5 - End
                 
                    const disProg = (time - tTransitionOut) / (tDissolution - tTransitionOut || 1);
                                        scale = 1.0 - (disProg * 0.1); 
                    opacity = 1 - disProg;
                    break;
            }
            candle.style.setProperty('--flame-scale', scale);
                        candle.style.setProperty('--flame-opacity', opacity);
        });

        animationId = requestAnimationFrame(visualize);
    };


    const cleanup = function() {
        // 5. Восстанавливаем фон и музыку после окончания
                window.isVodyaniEventActive = false; // Снимаем блокировку
                 // DEBUG TIMER REMOVE
        const timerEl = document.getElementById('vodyani-debug-timer');
        if (timerEl) timerEl.remove();
                document.body.classList.remove('cursor-hidden'); // Возвращаем курсор
        document.body.classList.remove('vodyani-ui-hidden'); // Возвращаем UI
        window.resetIdleTimer(); // Возвращаем таймер бездействия

        if (wallpaper) wallpaper.classList.remove('vodyani-bg');
                 if (animationId) cancelAnimationFrame(animationId);
                 candles.forEach(c => { c.classList.remove('vodyani-ghost'); c.classList.remove('divinity'); c.style.removeProperty('--flame-scale'); c.style.removeProperty('--flame-opacity'); c.style.removeProperty('--divinity-filter'); });
        window.renderCandles(); // Принудительно перерисовываем свечи в их правильном состоянии

        
        if (wasPlaying && window.audioTrack) {
            window.audioTrack.play().catch(()=>{});
        }
    };

       window.vodyaniAudio.play().then(() => {
        // DEBUG TIMER CREATE
        const timerEl = document.createElement('div');
        timerEl.id = 'vodyani-debug-timer';
        timerEl.style.position = 'fixed';
        timerEl.style.top = '10%';
        timerEl.style.left = '50%';
        timerEl.style.transform = 'translateX(-50%)';
        timerEl.style.color = '#00ff00';
        timerEl.style.fontSize = '3rem';
        timerEl.style.zIndex = '20001';
        timerEl.style.fontFamily = 'monospace';
        timerEl.style.textShadow = '2px 2px 0 #000';
        document.body.appendChild(timerEl);
        animationId = requestAnimationFrame(visualize);
}).catch(e => {
        console.error("Vodyani play failed. This can happen if the browser blocks autoplay.", e);
        cleanup(); // Если не удалось запустить, сразу все чистим
    });
    window.vodyaniAudio.onended = cleanup;
}

// Функция для случайных глитч-эффектов
window.startRandomGlitches = function() {
    // 1. Таймер для Скримера (Звук) - Ровно каждые 30 секунд
    setInterval(() => {
                if (window.playerData.settings && !window.playerData.settings.screamer) return; // Проверка настройки
        if (Math.random() < 0.40) {
            if (window.screamerSound) {
                window.screamerSound.currentTime = 0;
                window.screamerSound.volume = 0.1;
                window.screamerSound.play().catch(() => {});
            }
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
        if (window.isVodyaniEventActive) return;
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
    var obstacles = [];
    var collisionSound = new Audio('forge.mp3');
    collisionSound.volume = 0.4;
    var lastCollisionTime = 0;
    
    // Ищем заголовок для перетаскивания
    const header = elmnt.querySelector('h2') || elmnt.querySelector('h3') || elmnt.querySelector('#window-title') || elmnt.querySelector('#prompt-title') || elmnt.querySelector('#confirm-title') || elmnt.querySelector('#learned-skills-title') || elmnt.querySelector('#inventory-title') || elmnt.querySelector('#bonus-guild-name') || elmnt.querySelector('#bonus-class-name') || elmnt.querySelector('#bonus-class-name-2') || elmnt.querySelector('#journal-title');
    
    if (header) {
        header.onmousedown = dragMouseDown;
        header.style.cursor = 'move';
    } else {
        // Если заголовка нет, тянем за сам элемент (аккуратно, может мешать кликам)
         if (elmnt.id === 'movable-candle') {
            elmnt.onmousedown = dragMouseDown;
        } 
    }

    // Добавляем слушатель для сохранения размеров после изменения (resize)
    if (!elmnt.dataset.resizeListenerAttached) {
        elmnt.addEventListener('mouseup', function() {
            const id = elmnt.id;
            const saveableWidgets = ['char-sheet', 'learned-skills-widget', 'inventory-widget', 'active-guild-bonus', 'active-class-bonus', 'active-class-bonus-2', 'journal-widget'];
            if (saveableWidgets.includes(id)) {
                if (!window.playerData.widgetPositions) window.playerData.widgetPositions = {};
                window.playerData.widgetPositions[id] = {
                    top: elmnt.style.top,
                    left: elmnt.style.left,
                    width: elmnt.style.width,
                    height: elmnt.style.height
                };
                window.saveToStorage();
            }
        });
        elmnt.dataset.resizeListenerAttached = "true";
    }

    function dragMouseDown(e) {
        e = e || window.event;
        // Игнорируем клики по элементам управления внутри окна
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON' || e.target.classList.contains('close-x')) {
            return;
        }
        e.preventDefault();

         // Рассчитываем позицию элемента ДО изменения его display-модели
        const rect = elmnt.getBoundingClientRect();

        // Сбор препятствий (только видимые элементы)
        obstacles = [];
        

        // Принудительно делаем элемент фиксированным, чтобы его можно было вытащить из стека
        elmnt.style.position = 'fixed';
        elmnt.style.zIndex = '10002'; // Поверх всего во время перетаскивания
        elmnt.style.margin = '0'; // Сброс отступов для предотвращения скачков
        elmnt.style.transition = 'none'; // Отключаем плавность для мгновенного отклика

        
        elmnt.style.top = rect.top + 'px';
        elmnt.style.left = rect.left + 'px';
        elmnt.style.right = 'auto'; // Сброс привязки к правому краю
        elmnt.style.bottom = 'auto'; // Сброс привязки к низу
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
        
        let proposedTop = elmnt.offsetTop - pos2;
        let proposedLeft = elmnt.offsetLeft - pos1;
        
        const rect = elmnt.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        
        let collided = false;
        let collisionSide = null;

        // 1. Границы экрана
        if (proposedTop < 0) { proposedTop = 0; collided = true; collisionSide = 'top'; }
        if (proposedLeft < 0) { proposedLeft = 0; collided = true; collisionSide = 'left'; }
        if (proposedTop + h > window.innerHeight) { proposedTop = window.innerHeight - h; collided = true; collisionSide = 'bottom'; }
        if (proposedLeft + w > window.innerWidth) { proposedLeft = window.innerWidth - w; collided = true; collisionSide = 'right'; }


        // Эффекты (Звук и отскок) - только для разрешенных виджетов
        const collisionEnabledIds = ['learned-skills-widget', 'inventory-widget', 'active-guild-bonus', 'active-class-bonus', 'active-class-bonus-2', 'journal-widget'];
        if (collided && collisionEnabledIds.includes(elmnt.id)) {
            const now = Date.now();
            if (now - lastCollisionTime > 400) { // Задержка звука 400мс (в 2 раза реже)
                collisionSound.currentTime = 0;
                collisionSound.play().catch(()=>{});
                lastCollisionTime = now;
                
                // Создаем искры в точке удара
                let sparkX = proposedLeft + w / 2;
                let sparkY = proposedTop + h / 2;
                
                if (collisionSide === 'left') sparkX = proposedLeft;
                else if (collisionSide === 'right') sparkX = proposedLeft + w;
                else if (collisionSide === 'top') sparkY = proposedTop;
                else if (collisionSide === 'bottom') sparkY = proposedTop + h;

                window.createCollisionSparks(sparkX, sparkY, collisionSide);

                // Визуальный эффект отскока (сжатие)
                elmnt.style.transition = "transform 0.05s";
                elmnt.style.transform = "scale(0.98)";
                setTimeout(() => {
                    elmnt.style.transform = "none";
                    setTimeout(() => { elmnt.style.transition = "none"; }, 50);
                }, 50);
            }
        }

        elmnt.style.top = proposedTop + "px";
        elmnt.style.left = proposedLeft + "px";
        // adjust shadow direction while dragging
        if (window.updateShadowForEl) window.updateShadowForEl(elmnt);
    }


    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        elmnt.style.transition = ""; // Возвращаем CSS переходы
        elmnt.style.zIndex = ''; // Возвращаем z-index из CSS (5000+ для окон, 1100 для виджетов)

        // обновляем тень после окончания перемещения
        if (window.updateShadowForEl) window.updateShadowForEl(elmnt);
        
        // Сохранение позиции виджетов
        const id = elmnt.id;
        const saveableWidgets = ['char-sheet', 'learned-skills-widget', 'inventory-widget', 'active-guild-bonus', 'active-class-bonus', 'active-class-bonus-2', 'journal-widget'];
        
        if (saveableWidgets.includes(id)) {
            if (!window.playerData.widgetPositions) window.playerData.widgetPositions = {};
            window.playerData.widgetPositions[id] = {
                top: elmnt.style.top,
                left: elmnt.style.left,
                width: elmnt.style.width,
                height: elmnt.style.height
            };
            window.saveToStorage();
        }
    }
}

window.restoreWidgetPositions = function() {
    if (!window.playerData.widgetPositions) return;
    
    for (const [id, pos] of Object.entries(window.playerData.widgetPositions)) {
        const el = document.getElementById(id);
        if (el) {
            el.style.position = 'fixed';
            el.style.top = pos.top;
            el.style.left = pos.left;
            el.style.right = 'auto';
            el.style.bottom = 'auto';
            
            // Восстановление размеров
            if (pos.width) el.style.width = pos.width;
            if (pos.height) el.style.height = pos.height;

            el.style.margin = '0';
            // el.style.zIndex = '1100'; // Убрано, чтобы использовался CSS
            if (window.updateShadowForEl) window.updateShadowForEl(el);
        }
    }
}

// Функция для создания недостающих элементов интерфейса (фиксы ошибок)
window.ensureModalsExist = function() {
    // 1. Фикс ошибки продажи ресурсов (отсутствующий заголовок)
    const multiSellModal = document.getElementById('multi-sell-modal');
    if (multiSellModal && !document.getElementById('multi-sell-label-text')) {
        const inputContainer = document.getElementById('multi-sell-inputs');
        if (inputContainer) {
            const label = document.createElement('p');
            label.id = 'multi-sell-label-text';
            label.style.color = '#d4af37';
            label.style.marginBottom = '5px';
            label.innerText = 'Уровень:';
            inputContainer.parentNode.insertBefore(label, inputContainer);
        }
    }

    // 2. Фикс ошибки расплавки (отсутствующее окно)
    if (!document.getElementById('melt-item-modal')) {
        const div = document.createElement('div');
        div.id = 'melt-item-modal';
        div.className = 'modal'; // Используем класс для стилей, если есть, или инлайн
        div.style.display = 'none';
        div.style.position = 'fixed';
        div.style.zIndex = '6000';
        div.style.left = '50%';
        div.style.top = '50%';
        div.style.transform = 'translate(-50%, -50%)';
        div.style.background = '#1a1a1a';
        div.style.border = '2px solid #ff4444';
        div.style.padding = '20px';
        div.style.width = '300px';
        div.style.textAlign = 'center';
        div.style.boxShadow = '0 0 20px #000';
        
        div.innerHTML = `
            <h3 style="color:#ff4444; margin-top:0; font-family:'Exocet',serif;">🔥 РАСПЛАВИТЬ</h3>
            <label style="display:block; margin:10px 0; color:#ccc;">Уровень: <input type="number" id="melt-level" class="char-input" style="width:50px; background:transparent; color:#fff; border:none; border-bottom:1px solid #555; text-align:center;"></label>
            <label style="display:block; margin:10px 0; color:#ccc;">Грейд: 
                <select id="melt-grade" style="background:#000; color:#fff; border:1px solid #555; padding:5px;">
                    <option value="N">N</option><option value="D">D</option><option value="C">C</option>
                    <option value="B">B</option><option value="A">A</option><option value="S">S</option>
                    <option value="S+">S+</option><option value="Spectrum">Spectrum</option>
                </select>
            </label>
            <label style="display:block; margin:10px 0; color:#ccc;">Тип: 
                <select id="melt-type" style="background:#000; color:#fff; border:1px solid #555; padding:5px;">
                    <option value="normal">Обычный</option>
                    <option value="ancient">Древний</option>
                    <option value="primal">Первозданный</option>
                </select>
            </label>
            <div style="margin-top:20px;">
                <button class="craft-btn sell" onclick="window.confirmMeltItem()">РАСПЛАВИТЬ</button>
                <button class="death-cancel-btn" onclick="document.getElementById('melt-item-modal').style.display='none'">ОТМЕНА</button>
            </div>
        `;
        document.body.appendChild(div);
        window.makeDraggable(div);
    }
    // 3. Фикс ошибки покупки закенов (отсутствующее окно)
    if (!document.getElementById('zaken-buy-modal')) {
        const div = document.createElement('div');
        div.id = 'zaken-buy-modal';
        div.className = 'modal';
        div.style.display = 'none';
        div.style.position = 'fixed';
        div.style.zIndex = '6000';
        div.style.left = '50%';
        div.style.top = '50%';
        div.style.transform = 'translate(-50%, -50%)';
        div.style.background = '#1a1a1a';
        div.style.border = '2px solid #d4af37';
        div.style.padding = '20px';
        div.style.width = '300px';
        div.style.textAlign = 'center';
        div.style.boxShadow = '0 0 20px #000';
        
        div.innerHTML = `
            <h3 style="color:#d4af37; margin-top:0; font-family:'Exocet',serif;">💰 ПОКУПКА ЗАКЕНОВ</h3>
            <div style="margin: 15px 0;">
                <label style="color:#ccc;">Количество: <input type="number" id="zaken-count-input" value="1" min="1" style="width:60px; background:#000; color:#fff; border:1px solid #555; text-align:center; padding:5px;" oninput="window.updateZakenTotalCost()"></label>
            </div>
            <div id="zaken-total-cost" style="color:#d4af37; margin-bottom:10px; font-weight:bold;">Стоимость: 0</div>
            <div id="zaken-price-display" style="font-size:0.8rem; color:#888; margin-bottom:15px;"></div>
            <div style="margin-top:20px;">
                <button id="btn-confirm-buy" class="death-confirm-btn" onclick="window.confirmBuyZakens()">КУПИТЬ</button>
                <button class="death-cancel-btn" onclick="document.getElementById('zaken-buy-modal').style.display='none'">ОТМЕНА</button>
            </div>
        `;
        document.body.appendChild(div);
        window.makeDraggable(div);
    }
}

window.updateModalLayouts = function() {
    const layoutHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
            <div style="flex: 1 1 45%; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; padding: 8px; border-radius: 4px;">
                <div style="color: #d4af37; font-weight: bold; border-bottom: 1px solid #5a0000; margin-bottom: 5px; text-align: center;">40%</div>
                <div style="font-size: 0.85rem; text-align: center;"><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 40)">Основа оружия</span></div>
            </div>
            <div style="flex: 1 1 45%; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; padding: 8px; border-radius: 4px;">
                <div style="color: #d4af37; font-weight: bold; border-bottom: 1px solid #5a0000; margin-bottom: 5px; text-align: center;">30%</div>
                <div style="font-size: 0.85rem; text-align: center;"><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 30)">Основа брони</span><br><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 30)">Основа бижы</span><br><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 30)">Живучесть</span><br><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 30)">Осн.Хар.</span><br><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 30)">Гнездо (голова/оруж)</span></div>
            </div>
            <div style="flex: 1 1 45%; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; padding: 8px; border-radius: 4px;">
                <div style="color: #d4af37; font-weight: bold; border-bottom: 1px solid #5a0000; margin-bottom: 5px; text-align: center;">20%</div>
                <div style="font-size: 0.85rem; text-align: center;"><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 20)">Восстановление</span></div>
            </div>
            <div style="flex: 1 1 45%; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; padding: 8px; border-radius: 4px;">
                <div style="color: #d4af37; font-weight: bold; border-bottom: 1px solid #5a0000; margin-bottom: 5px; text-align: center;">15%</div>
                <div style="font-size: 0.85rem; text-align: center;"><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 15)">Все сопротивления</span><br><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 15)">Крит урон</span><br><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 15)">Крит шанс</span></div>
            </div>
            <div style="flex: 1 1 100%; background: rgba(212, 175, 55, 0.05); border: 1px solid #888; padding: 8px; border-radius: 4px;">
                <div style="color: #d4af37; font-weight: bold; border-bottom: 1px solid #5a0000; margin-bottom: 5px; text-align: center;">10%</div>
                <div style="font-size: 0.85rem; display: grid; grid-template-columns: 1fr 1fr; gap: 5px; text-align: center;">
                    <span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 10)">Не Осн.Хар.</span><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 10)">Броня</span>
                    <span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 10)">Здоровье</span><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 10)">Ур. в бижутерии</span>
                    <span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 10)">Скор. атак</span><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 10)">Гнездо (броня)</span>
                    <span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 10)">Урон стихии</span><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 10)">Урон умения</span>
                    <span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 10)">+ Ур. к скилу</span><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 10)">Сниж. затрат / КДР</span>
                    <span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 10)" style="grid-column: span 2;">Урон по области</span>
                </div>
            </div>
            <div style="flex: 1 1 100%; background: rgba(212, 175, 55, 0.05); border: 1px solid #888; padding: 8px; border-radius: 4px;">
                <div style="color: #d4af37; font-weight: bold; border-bottom: 1px solid #5a0000; margin-bottom: 5px; text-align: center;">5%</div>
                <div style="font-size: 0.85rem; text-align: center;"><span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 5)">Одно сопрот.</span> | <span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 5)">Скор. передвижения</span> | <span class="PROP_CLASS" onclick="PROP_ONCLICK(this, 5)">Урон уменьшен</span></div>
            </div>
        </div>
    `;

    const updateContainer = (modalId, containerClass, propClass, onClickFunc) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            const container = modal.querySelector('.' + containerClass);
            if (container) {
                let html = layoutHTML.replace(/PROP_CLASS/g, propClass).replace(/PROP_ONCLICK/g, onClickFunc);
                container.innerHTML = html;
            }
        }
    };

    updateContainer('sell-craft-modal', 'craft-props-container', 'sell-prop-item', 'toggleSellProperty');
    updateContainer('buy-sell-agrade-modal', 'agrade-props-container', 'buy-prop-item', 'toggleBuyProperty');
    updateContainer('buy-ancient-modal', 'ancient-props-container', 'buy-prop-item', 'toggleBuyProperty');
    updateContainer('buy-set-modal', 'set-props-container', 'buy-prop-item', 'toggleBuyProperty');
}