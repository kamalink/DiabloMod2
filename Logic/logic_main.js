// --- ИНИЦИАЛИЗАЦИЯ ---

let currencyInterval;
let currencyTimeout;

window.startCurrencyChange = function(type, amount) {
    // Первое изменение сразу при нажатии
    window.addCurrency(type, amount);
    
    // Запускаем таймаут, а после него - интервал для ускоренного изменения
    currencyTimeout = setTimeout(() => {
        currencyInterval = setInterval(() => {
            window.addCurrency(type, amount);
        }, 100); // Повторять каждые 100мс
    }, 500); // Задержка перед ускорением 500мс
}

window.stopCurrencyChange = function() {
    clearTimeout(currencyTimeout);
    clearInterval(currencyInterval);
}

window.screamerSound = new Audio('Media/screamer.mp3');
window.craftSound = new Audio('Media/diablo-3-craft-done.mp3');

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
    window.restoreWidgetPositions();
    window.updateUI();
    window.updateCoinStacks(); // перемещенный вызов
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
    document.addEventListener('mousemove', window.resetIdleTimer);
    document.addEventListener('keydown', window.resetIdleTimer);
    document.addEventListener('click', window.resetIdleTimer);
    document.addEventListener('touchstart', window.resetIdleTimer);
    window.resetIdleTimer();

    // Запуск случайных глитч-эффектов
    startRandomGlitches();

    // Инициализация перетаскивания для всех модальных окон
    const draggableIds = ['text-window', 'death-modal', 'skill-calc-modal', 'exp-calc-modal', 'difficulty-calc-modal', 'zaken-buy-modal', 'sell-craft-modal', 'gem-service-modal', 'multi-sell-modal', 'custom-confirm-modal', 'custom-prompt-modal', 'add-money-modal', 'sell-leg-gem-modal', 'buy-ancient-modal', 'buy-set-modal', 'buy-sell-agrade-modal', 'melt-item-modal', 'learned-skills-widget', 'inventory-widget'];
    draggableIds.forEach(id => {
        window.makeDraggable(document.getElementById(id));
    });

    // Звук клика
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            const clickSound = new Audio('Media/soundreality-button-4-214382.mp3');
            clickSound.volume = 0.5;
            clickSound.play().catch(() => {});
        }
        window.createClickSparks(e.clientX, e.clientY);
    });

    // Авто-ресайз полей ввода при вводе
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('char-input')) {
            window.autoResizeInput(e.target);
        }
    });

    // Огненный след за курсором при нажатии
    let isCursorDown = false;
    document.addEventListener('mousedown', () => isCursorDown = true);
    document.addEventListener('mouseup', () => isCursorDown = false);
    document.addEventListener('mousemove', (e) => {
        if (isCursorDown) {
            window.createFireTrail(e.clientX, e.clientY);
        }
    });

    // Проверка и создание недостающих модальных окон (фиксы ошибок)
    window.ensureModalsExist();

    // Восстановление состояния активного портала
    window.updateActiveRiftModal();
    
    // Обновление раскладки свойств в модальных окнах (унификация)
    window.updateModalLayouts();
};

// Функция для случайных глитч-эффектов
window.startRandomGlitches = function() {
    // 1. Таймер для Скримера (Звук) - Ровно каждые 30 секунд
    setInterval(() => {
        // 40% шанс на звук
        if (Math.random() < 0.40) {
            if (window.screamerSound) {
                window.screamerSound.currentTime = 0;
                window.screamerSound.volume = 0.1;
                window.screamerSound.play().catch(() => {});
            }
        }
    }, 90000);
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
    var obstacles = [];
    var collisionSound = new Audio('Media/forge.mp3');
    collisionSound.volume = 0.4;
    var lastCollisionTime = 0;
    
    // Ищем заголовок для перетаскивания
    const header = elmnt.querySelector('h2') || elmnt.querySelector('h3') || elmnt.querySelector('#window-title') || elmnt.querySelector('#prompt-title') || elmnt.querySelector('#confirm-title') || elmnt.querySelector('#learned-skills-title') || elmnt.querySelector('#inventory-title') || elmnt.querySelector('#bonus-guild-name') || elmnt.querySelector('#bonus-class-name') || elmnt.querySelector('#bonus-class-name-2');
    
    if (header) {
        header.onmousedown = dragMouseDown;
        header.style.cursor = 'move';
    } else {
        // Если заголовка нет, тянем за сам элемент (аккуратно, может мешать кликам)
        // elmnt.onmousedown = dragMouseDown; 
    }

    function dragMouseDown(e) {
        e = e || window.event;
        // Игнорируем клики по элементам управления внутри окна
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON' || e.target.classList.contains('close-x')) {
            return;
        }
        e.preventDefault();

        // Сбор препятствий (только видимые элементы)
        obstacles = [];
        
        // Включаем физику коллизий ТОЛЬКО для виджетов главного экрана
        const collisionEnabledIds = ['learned-skills-widget', 'inventory-widget', 'active-guild-bonus', 'active-class-bonus', 'active-class-bonus-2'];
        const isCollisionEnabled = collisionEnabledIds.includes(elmnt.id);

        if (isCollisionEnabled) {
            const selectors = [
                '#char-sheet', 
                '.sidebar-widget', 
                '.d2-button', 
                '#save-load-controls',
                '#reset-btn',
                '#music-btn',
                '.modal', 
                '#text-window'
            ];

            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    // Исключаем: сам элемент, скрытые элементы, дочерние элементы
                    if (el !== elmnt && 
                        el.style.display !== 'none' && 
                        el.offsetParent !== null && 
                        !elmnt.contains(el)) {
                        obstacles.push(el.getBoundingClientRect());
                    }
                });
            });
        }

        // Принудительно делаем элемент фиксированным, чтобы его можно было вытащить из стека
        elmnt.style.position = 'fixed';
        elmnt.style.zIndex = '5000'; // Поверх всего
        elmnt.style.margin = '0'; // Сброс отступов для предотвращения скачков
        elmnt.style.transition = 'none'; // Отключаем плавность для мгновенного отклика

        // Рассчитываем позицию элемента в пикселях и отключаем transform
        const rect = elmnt.getBoundingClientRect();
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

        // 2. Коллизии с объектами
        // Проверяем движение по X
        let rectX = { left: proposedLeft, top: elmnt.offsetTop, right: proposedLeft + w, bottom: elmnt.offsetTop + h };
        if (checkCollision(rectX, obstacles)) {
            proposedLeft = elmnt.offsetLeft; // Отменяем движение по X
            collided = true;
            if (pos1 > 0) collisionSide = 'left';
            else if (pos1 < 0) collisionSide = 'right';
        }

        // Проверяем движение по Y (используя уже проверенный X, чтобы не застревать в углах)
        let rectY = { left: proposedLeft, top: proposedTop, right: proposedLeft + w, bottom: proposedTop + h };
        if (checkCollision(rectY, obstacles)) {
            proposedTop = elmnt.offsetTop; // Отменяем движение по Y
            collided = true;
            if (pos2 > 0) collisionSide = 'top';
            else if (pos2 < 0) collisionSide = 'bottom';
        }

        // Эффекты (Звук и отскок) - только для разрешенных виджетов
        const collisionEnabledIds = ['learned-skills-widget', 'inventory-widget', 'active-guild-bonus', 'active-class-bonus', 'active-class-bonus-2'];
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
    }

    function checkCollision(r1, obstacles) {
        for (let r2 of obstacles) {
            // Проверка на пересечение прямоугольников
            if (!(r2.left >= r1.right || 
                  r2.right <= r1.left || 
                  r2.top >= r1.bottom || 
                  r2.bottom <= r1.top)) {
                return true;
            }
        }
        return false;
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        elmnt.style.transition = ""; // Возвращаем CSS переходы
        
        // Сохранение позиции виджетов
        const id = elmnt.id;
        const saveableWidgets = ['char-sheet', 'learned-skills-widget', 'inventory-widget', 'active-guild-bonus', 'active-class-bonus', 'active-class-bonus-2'];
        
        if (saveableWidgets.includes(id)) {
            if (!window.playerData.widgetPositions) window.playerData.widgetPositions = {};
            window.playerData.widgetPositions[id] = {
                top: elmnt.style.top,
                left: elmnt.style.left
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
            el.style.margin = '0';
            el.style.zIndex = '4000'; // Чуть ниже модальных окон (5000+), но выше контента
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
