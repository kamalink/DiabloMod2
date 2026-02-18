// --- ИНТЕРФЕЙС И ОТРИСОВКА ---

window.currencyTooltipTimer = null;

window.showCurrencyTooltip = function(event, type, amount) {
    // Clear any existing timer
    if (window.currencyTooltipTimer) {
        clearTimeout(window.currencyTooltipTimer);
    }

    window.currencyTooltipTimer = setTimeout(() => {
        let tooltip = document.getElementById('currency-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'currency-tooltip';
            document.body.appendChild(tooltip);
        }
        
        const typeMap = {
            m: 'Мифрил',
            g: 'Золото',
            s: 'Серебро',
            c: 'Медь',
            y: 'Йена'
        };

        tooltip.innerHTML = `${typeMap[type]}: ${amount.toLocaleString('ru-RU')}`;
        
        tooltip.style.display = 'block';
        tooltip.style.left = (event.clientX + 15) + 'px';
        tooltip.style.top = (event.clientY + 15) + 'px';
    }, 1000); // 1-секундная задержка
}

window.hideCurrencyTooltip = function() {
    if (window.currencyTooltipTimer) {
        clearTimeout(window.currencyTooltipTimer);
        window.currencyTooltipTimer = null;
    }
    const tooltip = document.getElementById('currency-tooltip');
    if (tooltip) tooltip.style.display = 'none';
}

window.closeAllWindows = function() {
    const modalIds = [
        'text-window',
        'death-modal',
        'skill-calc-modal',
        'exp-calc-modal',
        'difficulty-calc-modal',
        'sell-leg-gem-modal',
        'sell-craft-modal',
        'buy-ancient-modal',
        'buy-set-modal',
        'buy-sell-agrade-modal',
        'zaken-buy-modal',
        'custom-prompt-modal',
        'add-money-modal',
        'gem-service-modal',
        'multi-sell-modal',
        'enchant-item-modal',
        'theft-modal',
        'rift-diff-modal',
        'iframe-modal',
        'custom-confirm-modal'
    ];

    modalIds.forEach(id => {
        const modal = document.getElementById(id);
        if (modal && modal.style.display !== 'none') {
            modal.style.display = 'none';
        }
    });
}

window.renderMenu = function(menuId, titleText, isBack = false, noAnim = false) {
    const area = document.getElementById('buttons-area');
    const menuTitle = document.getElementById('menu-title');
    const breadcrumb = document.getElementById('breadcrumb');
    area.innerHTML = '';
    
    // Текстовые вставки для разделов
    if (menuId === 'hunters_guild_menu') {
        const infoMsg = document.createElement('p');
        infoMsg.style.color = '#ff4444';
        infoMsg.style.textAlign = 'center';
        infoMsg.style.fontSize = '0.9rem';
        infoMsg.style.border = '1px solid #5a0000';
        infoMsg.style.padding = '10px';
        infoMsg.innerHTML = '❗ Элитный моб засчитается убитым если в чате игры именно герой добил ☠️';
        area.appendChild(infoMsg);
    }
    if (menuId === 'mages_college_menu') {
        const infoMsg = document.createElement('div');
        infoMsg.style.background = 'linear-gradient(145deg, #1a1a2e, #16213e)';
        infoMsg.style.color = '#a29bfe';
        infoMsg.style.textAlign = 'center';
        infoMsg.style.fontSize = '0.9rem';
        infoMsg.style.border = '2px double #4834d4';
        infoMsg.style.borderRadius = '8px';
        infoMsg.style.padding = '15px';
        infoMsg.style.marginBottom = '20px';
        infoMsg.style.boxShadow = '0 0 15px rgba(72, 52, 212, 0.4)';
        infoMsg.innerHTML = `<p style="margin: 5px 0;">✨ Множитель опыта только за обычных монстров.</p><p style="margin: 5px 0;">✨ Руны продаются целыми числами (без дробей).</p><p style="margin: 5px 0; color: #ff7979;">⚠️ При расчёте интеллекта убираем бонус от парагона.</p>`;
        area.appendChild(infoMsg);
    }
    if (menuId === 'dark_brotherhood') {
        const infoMsg = document.createElement('div');
        infoMsg.style.background = 'linear-gradient(145deg, #0d0d0d, #1a1a1a)';
        infoMsg.style.color = '#8e8e8e';
        infoMsg.style.textAlign = 'center';
        infoMsg.style.fontSize = '0.9rem';
        infoMsg.style.border = '1px solid #444';
        infoMsg.style.padding = '12px';
        infoMsg.style.marginBottom = '15px';
        infoMsg.innerHTML = `<p style="margin: 0; color: #b22222;">🌑 Тень скрывает твои шаги...</p><p style="margin: 5px 0 0 0; font-size: 0.8rem;">Макс. шанс кражи 90% | Один 💍 — один раз.</p>`;
        area.appendChild(infoMsg);
    }
    if (menuId === 'adventurers_menu') {
        const infoMsg = document.createElement('div');
        infoMsg.style.background = 'linear-gradient(145deg, #1b2631, #283747)';
        infoMsg.style.color = '#85c1e9';
        infoMsg.style.textAlign = 'center';
        infoMsg.style.border = '1px solid #5499c7';
        infoMsg.style.padding = '10px';
        infoMsg.style.marginBottom = '15px';
        infoMsg.innerHTML = '❗ При платном перепрохождении локации за сундуки можно получить только половину 📖 и ⏳';
        area.appendChild(infoMsg);
    }
    if (menuId === 'companions_menu') {
        const infoMsg = document.createElement('div');
        infoMsg.style.background = 'linear-gradient(145deg, #2c3e50, #000000)';
        infoMsg.style.color = '#ecf0f1';
        infoMsg.style.textAlign = 'center';
        infoMsg.style.border = '1px solid #7f8c8d';
        infoMsg.style.padding = '10px';
        infoMsg.style.marginBottom = '15px';
        infoMsg.innerHTML = '❗ ☠️ считаются также как и 💀 при подсчёте убитых';
        area.appendChild(infoMsg);
    }
    if (menuId === 'skills_study_menu') {
        const infoMsg = document.createElement('div');
        infoMsg.style.background = 'linear-gradient(145deg, #1e1e1e, #2d2d2d)';
        infoMsg.style.color = '#d4af37';
        infoMsg.style.fontSize = '0.85rem';
        infoMsg.style.border = '1px solid #5a0000';
        infoMsg.style.padding = '12px';
        infoMsg.style.marginBottom = '15px';
        infoMsg.style.textAlign = 'left';
        infoMsg.innerHTML = `<p>❗ <b>Доп. навыки:</b> после 3-й профы можно изучить +1 навык в каждой категории и +1 пассивку. Цена: 1-й х1.3📖, далее +х0.3 за каждый.</p><p>❗ <b>Билды:</b> новый билд открывается после ВП соло. Для квеста нужно: ≥3 навыка и ≥2 пассивки старого билда.</p><p style="color: #ff7979;">❗❗ Если эффект на 2-х героев: цена делится 75/25%.</p>`;
        area.appendChild(infoMsg);
    }
    if (menuId === 'portals') {
        const infoMsg = document.createElement('div');
        infoMsg.style.background = 'linear-gradient(145deg, #1a0f2e, #0f0a1a)';
        infoMsg.style.color = '#d4af37';
        infoMsg.style.fontSize = '0.85rem';
        infoMsg.style.border = '1px solid #5a0000';
        infoMsg.style.padding = '12px';
        infoMsg.style.marginBottom = '15px';
        infoMsg.innerHTML = `<p>❗❗ <b>НГ+:</b> после 5 актов герои проходят их в режиме приключений на сложности +1 (сундуки в конце акта).</p><p>❗ <b>НП:</b> макс. 6 за акт (12 на НГ+). Скидка: 10% (до 50%) на обычной, 5% на НГ+.</p><p>❗ <b>В ВП🏛️:</b> за убийство 👹 вовремя — возврат 25% 💰.</p><p style="color: #ff7979;">❗ Портал -1 и ниже: лег. камни не выпадают.</p>`;
        area.appendChild(infoMsg);
    }

    // Управление историей
    if (!isBack && menuId !== window.historyStack[window.historyStack.length - 1]) {
        window.historyStack.push(menuId);
        window.pathNames.push(titleText || '...');
    }
    breadcrumb.innerText = window.pathNames.join(' > ');

    // Навигация
    if (menuId !== 'main') {
        const navBox = document.createElement('div');
        navBox.className = 'nav-box';
        
        const homeBtn = document.createElement('button');
        homeBtn.className = 'd2-button nav-btn';
        homeBtn.innerHTML = 'ГЛАВНОЕ МЕНЮ<span class="btn-shimmer"></span>';
        homeBtn.onclick = () => {
            window.closeAllWindows();
            window.historyStack = ['main'];
            window.pathNames = ['ГЛАВНАЯ'];
            window.renderMenu('main', 'Diablo III Mod', true);
        };

        const backBtn = document.createElement('button');
        backBtn.className = 'd2-button nav-btn';
        backBtn.innerHTML = 'НАЗАД<span class="btn-shimmer"></span>';
        backBtn.onclick = () => {
            window.closeAllWindows();
            if (window.historyStack.length > 1) {
                window.historyStack.pop();
                window.pathNames.pop();
                const prevMenu = window.historyStack[window.historyStack.length - 1];
                window.renderMenu(prevMenu, window.pathNames[window.pathNames.length-1], true);
            }
        };

        navBox.appendChild(homeBtn);
        navBox.appendChild(backBtn);

        if (menuId === 'skills_study_menu') {
            const calcBtn = document.createElement('button');
            calcBtn.className = 'calc-nav-btn';
            calcBtn.innerText = '🧮 КАЛЬКУЛЯТОР';
            calcBtn.setAttribute('onclick', 'window.openSkillCalculator()');
            navBox.appendChild(calcBtn);
        }

        area.appendChild(navBox);
        menuTitle.innerText = titleText;
    } else {
        menuTitle.innerText = "Diablo III Mod";
    }
    menuTitle.style.display = 'block';

    // Специальная отрисовка для меню навыков (Сетка 2x3)
    if (menuId === 'skills_study_menu') {
        const gridContainer = document.createElement('div');
        gridContainer.className = 'skills-grid-container';
        
        window.gameData[menuId].forEach((item) => {
            const btn = document.createElement('button');
            btn.className = 'd2-button skill-grid-btn';
            btn.innerText = item.title;
            btn.onclick = () => {
                const targetData = window.gameData[item.id];
                if (targetData && targetData.content) window.showText(item.title, targetData.content);
            };
            gridContainer.appendChild(btn);
        });
        area.appendChild(gridContainer);
        return; // Прерываем стандартную отрисовку кнопок
    }

    // Отрисовка кнопок
    window.gameData[menuId].forEach((item, index) => {
        const btn = document.createElement('button');
        btn.className = 'd2-button ' + (menuId === 'main' ? 'main-btn' : 'sub-btn');
        
        if (item.id === 'barb') btn.classList.add('btn-barbarian');
        if (item.id === 'wiz') btn.classList.add('btn-wizard');
        if (item.id === 'dh') btn.classList.add('btn-dh');
        if (item.id === 'wd') btn.classList.add('btn-wd');
        if (item.id === 'monk') btn.classList.add('btn-monk');
        if (item.id === 'crus') btn.classList.add('btn-crusader');
        if (item.id === 'necro') btn.classList.add('btn-necromancer');

        // --- Check for button locks ---
        let isLocked = false;
        let lockReason = "";

        const guildId = item.id;
            const pData = window.playerData;
            switch(guildId) {
                case 'traders_guild':
                    if (pData.stat_vit < 1000) { isLocked = true; lockReason = "🔒 1000 ⛑️"; }
                    break;
                case 'vampire_mage':
                case 'wizard_mage':
                    if (pData.stat_int < 1000 && pData.para < 50) { isLocked = true; lockReason = "🔒 1000🔮 | 50⏳"; }
                    break;
                case 'goblin_hunter':
                case 'elite_hunter':
                    if (pData.reputation < 85) { isLocked = true; lockReason = "🔒 85 🎭"; }
                    break;
                case 'db_gambler':
                    if (pData.deals < 7 && pData.stat_dex < 1000) { isLocked = true; lockReason = "🔒 7 🤝 | 1000🥢"; }
                    break;
                case 'db_thief':
                    if (pData.steals < 7) { isLocked = true; lockReason = "🔒 7 🧤"; }
                    break;
                case 'adv_explorer':
                    if (pData.found_legs < 5) { isLocked = true; lockReason = "🔒 5 📙"; }
                    break;
                case 'adv_wealth':
                    if (pData.found_legs < 8) { isLocked = true; lockReason = "🔒 8 📙"; }
                    break;
                case 'comp_brute':
                case 'comp_warlord':
                    if (pData.stat_str < 1000 && (pData.kills + (pData.base_kills || 0)) < 1700) { isLocked = true; lockReason = "🔒 1000🏮 | 1700💀"; }
                    break;
                case 'prof_1':
                    if (pData.level <= 20) { isLocked = true; lockReason = "🔒 Требуется ур. 21"; }
                    break;
                case 'prof_2':
                    if (pData.level <= 40) { isLocked = true; lockReason = "🔒 Требуется ур. 41"; }
                    break;
                case 'prof_3':
                    if (pData.level <= 70) { isLocked = true; lockReason = "🔒 Требуется ур. 71"; }
                    break;
            }

        if (isLocked) {
            btn.disabled = true;
            btn.innerHTML = `<span style="text-decoration: line-through; color: #888;">${item.title}</span><br><span style="font-size: 0.8rem; color: #ff4444; text-transform: none;">${lockReason}</span>`;
            btn.classList.add('locked-btn');
            btn.style.opacity = '0.7';

            // Hover preview for locked buttons
            btn.onmouseenter = () => {
                btn.hoverTimer = setTimeout(() => {
                    const targetData = window.gameData[item.id];
                    if (targetData && targetData.content) {
                        window.showText(item.title, targetData.content);
                        const textWindow = document.getElementById('text-window');
                        if(textWindow) textWindow.classList.add('preview-mode');
                    }
                }, 1000);
            };
            btn.onmouseleave = () => {
                if (btn.hoverTimer) clearTimeout(btn.hoverTimer);
                const textWindow = document.getElementById('text-window');
                if (textWindow && textWindow.style.display === 'block' && textWindow.classList.contains('preview-mode')) {
                    textWindow.style.display = 'none';
                    textWindow.classList.remove('preview-mode');
                }
            };
        } else {
            btn.innerHTML = `${item.title}<span class="btn-shimmer"></span>`;
            if (!noAnim) {
                btn.style.opacity = '0';
                btn.style.animation = `fadeInUp 0.3s ease-out forwards ${index * 0.05}s`;
                btn.addEventListener('animationend', () => {
                    btn.style.opacity = '1';
                    btn.style.animation = 'none';
                });
            } else {
                btn.style.opacity = '1';
                btn.style.animation = 'none';
            }
        }
        
        btn.onclick = () => {
            const targetData = window.gameData[item.id];
            if (item.url) {
                window.openIframe(item.url);
                return;
            }
            if (targetData) {
                if (Array.isArray(targetData)) {
                    window.renderMenu(item.id, item.title);
                } else if (targetData.content) {
                    window.showText(item.title, targetData.content);
                }
            } else if (item.content) {
                window.showText(item.title, item.content);
            }
        };

        area.appendChild(btn);
    });
}

window.showText = function(title, content) {
    const windowArea = document.getElementById('text-window');
    const titleArea = document.getElementById('window-title');
    const contentArea = document.getElementById('window-content');

    // Сброс позиции окна, чтобы оно всегда появлялось по центру
    windowArea.style.top = '50%';
    windowArea.style.left = '50%';
    windowArea.style.transform = 'translate(-50%, -50%)';

    windowArea.style.display = 'block';
    windowArea.classList.remove('preview-mode'); // Убираем режим превью, если открываем кликом
    titleArea.innerText = title;
    
    let html = (typeof content === 'object') ? content.content : content;
    
    const currentPath = window.pathNames.join(' > ');
    let btnHtml = '';

    if (window.pathNames.includes('Гильдии')) {
        const currentGuild = (window.playerData.guild || "Нет").toLowerCase();
        const targetGuild = title.toLowerCase();

        // Исключаем кнопку для информационных разделов
        if (title === 'Шанс кражи и Закены') {
            btnHtml = '';
        } else if (currentGuild === targetGuild) {
            btnHtml = `<button class="select-btn btn-guild-leave" onclick="leaveCurrentGuild()">🚪 ПОКИНУТЬ ГИЛЬДИЮ</button>`;
        } else {
            btnHtml = `<button class="select-btn btn-guild-join" onclick="selectProfileItem('${title}', '${currentPath}')">📜 ВСТУПИТЬ В ГИЛЬДИЮ</button>`;
        }
    } else if (window.pathNames.includes('Классы')) {
        btnHtml = `<button class="select-btn btn-class-select" onclick="selectProfileItem('${title}', '${currentPath}')">⚔️ ВЫБРАТЬ ЭТОТ БИЛД</button>`;
    }

    contentArea.innerHTML = btnHtml + html;
    
    // Показываем селектор руки для Охотников в магазине
    const handSelector = document.getElementById('hand-selector-main');
    if (handSelector) {
        const g = (window.playerData.guild || "").toLowerCase();
        handSelector.style.display = (g.includes('охотник')) ? 'flex' : 'none';
    }

    if (title.includes('Пентограмма')) {
        const vp = window.playerData.maxVp || 0;
        
        for (let i = 1; i <= 3; i++) {
            const req = (i === 1) ? 25 : (i === 2 ? 60 : 100);
            const boss = window.playerData[`penta_${i}_boss`];
            const btn = document.getElementById(`btn-penta-${i}`);
            const bossSpan = document.getElementById(`penta-boss-${i}`);
            
            if (boss) {
                // Расчет сложности
                let targetDiff = window.playerData[`penta_${i}_diff`];
                
                if (!targetDiff) {
                    const currentDiff = window.playerData.difficulty || "Высокий";
                    const diffOrder = window.difficultyOrder || [];
                    const currentIndex = diffOrder.indexOf(currentDiff);
                    targetDiff = currentDiff;
                    if (currentIndex !== -1) {
                        const offset = i - 1; 
                        const targetIndex = Math.min(currentIndex + offset, diffOrder.length - 1);
                        targetDiff = diffOrder[targetIndex];
                    }
                }

                if (bossSpan) bossSpan.innerHTML = `Убить: ${boss} <span style="color:#d4af37">(${targetDiff})</span>`;
                if (btn) btn.style.display = 'none';
            } else {
                if (vp >= req) {
                    if (btn) btn.style.display = 'inline-block';
                } else {
                    if (btn) btn.style.display = 'none';
                    if (bossSpan) {
                        bossSpan.innerText = "🔒";
                        bossSpan.style.color = "#555";
                    }
                }
            }
        }
    }

    // Обновляем состояние кнопок профессий, если это меню профессий
    if (window.updateProfessionButtonState) window.updateProfessionButtonState();
    
    window.updateUI(); // Обновляем UI, чтобы применить динамические изменения (например, кнопку покупки рун)
}

window.openIframe = function(url) {
    // Fix for CSP errors with Blizzard/Battle.net
    if (url.includes('battle.net') || url.includes('blizzard.com')) {
        window.open(url, '_blank');
        return;
    }

    const modal = document.getElementById('iframe-modal');
    const frame = document.getElementById('web-frame');

    // Сброс позиции
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    frame.src = url;
    modal.style.display = 'flex';
}

window.applyMenuButtonTheme = function(className) {
    const buttons = document.querySelectorAll('.d2-button');
    buttons.forEach(btn => {
        btn.classList.remove('menu-btn-barbarian', 'menu-btn-wizard', 'menu-btn-dh', 'menu-btn-monk', 'menu-btn-wd', 'menu-btn-crusader', 'menu-btn-necromancer');
        
        const map = {
            "Варвар": "menu-btn-barbarian",
            "Чародей": "menu-btn-wizard",
            "Охотник на демонов": "menu-btn-dh",
            "Монах": "menu-btn-monk",
            "Колдун": "menu-btn-wd",
            "Крестоносец": "menu-btn-crusader",
            "Некромант": "menu-btn-necromancer"
        };
        
        if (map[className]) {
            btn.classList.add(map[className]);
        }
    });
}

window.applyTheme = function(className) {
    document.body.className = ''; // Сброс классов

    if (!className) return;
    
    const map = {
        "Варвар": "theme-barbarian",
        "Чародей": "theme-wizard",
        "Монах": "theme-monk",
        "Колдун": "theme-wd",
        "Охотник на демонов": "theme-dh",
        "Крестоносец": "theme-crusader",
        "Некромант": "theme-necromancer"
    };
    
    if (map[className]) {
        document.body.classList.add(map[className]);
        window.applyMenuButtonTheme(className); // Обновляем кнопки тоже
    }

    // Настройка пула ресурсов
    const pool = document.getElementById('resource-pool');
    if (pool) {
        const resColors = {
            "Варвар": { dark: "#8b0000", light: "#ff4500", name: "Ярость" }, // Оранжево-красный
            "Чародей": { dark: "#4834d4", light: "#a29bfe", name: "Магическая энергия" }, // Фиолетовый
            "Монах": { dark: "#b8860b", light: "#ffd700", name: "Дух" }, // Желтый
            "Колдун": { dark: "#00008b", light: "#4169e1", name: "Мана" }, // Синий
            "Охотник на демонов": { dark: "#5a0000", light: "#ff4444", name: "Ненависть" }, // Красный
            "Крестоносец": { dark: "#005f99", light: "#00bfff", name: "Гнев" }, // Голубой
            "Некромант": { dark: "#2f4f4f", light: "#00ced1", name: "Эссенция" } // Бирюзовый
        };
        const theme = resColors[className];
        if (theme) {
            pool.style.display = 'block';
            pool.style.setProperty('--res-dark', theme.dark);
            pool.style.setProperty('--res-light', theme.light);
            pool.title = theme.name;
        } else {
            pool.style.display = 'none';
        }
    }
}

window.updateUI = function() {
    if (!window.playerData || !window.playerData.name) return;
    
    // Хелпер: обновляет значение input, только если он не в фокусе (чтобы не мешать вводу)
    const setInput = (id, val) => {
        const el = document.getElementById(id);
        if (el && document.activeElement !== el) {
            el.value = val;
        }
    };

    window.calculateRank();

    setInput('input-name', window.playerData.name);
    
    const bestRank = window.playerData.claimed_ranks && window.playerData.claimed_ranks.length > 0 
        ? Math.min(...window.playerData.claimed_ranks) 
        : null;
    const rankEl = document.getElementById('view-ladder-rank');
    if (rankEl) {
        rankEl.style.display = bestRank ? 'block' : 'none';
        if (bestRank) rankEl.innerText = `🏆 РЕЙТИНГ: ${bestRank}`;
    }
    
    const profs = window.playerData.professions;
    let profText = "Без профессии";
    if (profs) {
        if (profs[3]) profText = "3-я Профессия";
        else if (profs[2]) profText = "2-я Профессия";
        else if (profs[1]) profText = "1-я Профессия";
    }
    const profEl = document.getElementById('view-profession');
    if (profEl) profEl.innerText = profText;
    
    let xpBonusText = window.playerData.xp_bonus ? `(XP: ${window.playerData.xp_bonus})` : "";
    setInput('input-lvl', window.playerData.level);
    document.getElementById('view-xp-bonus').innerText = xpBonusText;
    
    // Блокировка ввода уровня после 70
    const lvlInput = document.getElementById('input-lvl');
    if (lvlInput) lvlInput.disabled = (window.playerData.level >= 70);
    setInput('input-runes', window.playerData.runes);
    setInput('input-para', window.playerData.para);
    setInput('input-potions', window.playerData.potions);
    
    setInput('input-stat-str', window.playerData.stat_str);
    setInput('input-stat-dex', window.playerData.stat_dex);
    setInput('input-stat-int', window.playerData.stat_int);
    setInput('input-stat-vit', window.playerData.stat_vit);
    
    setInput('input-kills', window.playerData.kills);
    setInput('input-elites-solo', window.playerData.elites_solo);
    
    const baseKillsInput = document.getElementById('input-base-kills');
    const baseElitesInput = document.getElementById('input-base-elites');
    if (baseKillsInput && document.activeElement !== baseKillsInput) baseKillsInput.value = window.playerData.base_kills || 0;
    if (baseElitesInput && document.activeElement !== baseElitesInput) baseElitesInput.value = window.playerData.base_elites || 0;
    
    setInput('input-bosses', window.playerData.bosses);
    setInput('input-gobs-solo', window.playerData.gobs_solo);
    setInput('input-gobs-assist', window.playerData.gobs_assist);
    setInput('input-max-vp', window.playerData.maxVp);
    document.getElementById('view-difficulty').innerText = window.playerData.difficulty || "Высокий";
    
    const actInput = document.getElementById('input-act');
    if (actInput) {
        actInput.type = 'text'; // Разрешаем текст для "1+"
        const currentAct = window.playerData.act || 1;
        // Если акт > 5, показываем как НГ+ (1+, 2+ и т.д.)
        actInput.value = currentAct > 5 ? (currentAct - 5) + "+" : currentAct;
    }
    
    // Отображение скидки на НП
    const currentAct = window.playerData.act || 1;
    const npCount = window.playerData.np_count || 0;
    const isNGPlus = currentAct > 5;
    const discountStep = isNGPlus ? 5 : 10;
    const maxDiscount = isNGPlus ? 60 : 50;
    const npDiscount = Math.min(maxDiscount, npCount * discountStep);
    const npDiscountEl = document.getElementById('view-np-discount');
    if (npDiscountEl) npDiscountEl.innerText = npDiscount > 0 ? `(-${npDiscount}%)` : "";

    // Отображение бонусов к продаже
    const sellBonusEl = document.getElementById('view-sell-bonus');
    if (sellBonusEl) {
        const g = (window.playerData.guild || "").toLowerCase();
        const rank = window.playerData.rank || 0;
        let bonuses = [];

        // Торговцы
        if (g.includes('торговц')) {
            const sellPercents = [10, 13, 15, 17, 19, 21, 23, 25, 28, 32, 35];
            const p = sellPercents[rank] || 10;
            bonuses.push(`<span style="color:#66ff66">Торговцы: +${p}% (Все)</span>`);
        }
        // Вампир
        if (g.includes('вампир')) {
            bonuses.push(`<span style="color:#ff4444">Вампир: -50% (Все)</span>`);
        }
        // Гэмблер
        if (g.includes('гэмблер')) {
            bonuses.push(`<span style="color:#66ff66">Гэмблер: +25% (Предметы)</span>`);
            bonuses.push(`<span style="color:#ff4444">Гэмблер: -25% (Рес/Камни)</span>`);
        }
        // Воры
        if (g.includes('вор') && !g.includes('воришка')) bonuses.push(`<span style="color:#66ff66">Вор: +50% (Предметы)</span>`);
        if (g.includes('воришка')) bonuses.push(`<span style="color:#66ff66">Воришка: +20% (Предметы)</span>`);
        // Маги (штраф на предметы)
        if (g.includes('чародей') && !g.includes('ученик')) {
            const wizPenalties = [10, 12, 14, 16, 18, 20, 22, 25, 28, 30];
            const p = wizPenalties[Math.max(0, Math.min(rank - 1, 9))] || 10;
            bonuses.push(`<span style="color:#ff4444">Чародей: -${p}% (Предметы)</span>`);
        }
        if (g.includes('ученик чародея')) bonuses.push(`<span style="color:#ff4444">Ученик: -9% (Предметы)</span>`);

        sellBonusEl.innerHTML = bonuses.length > 0 ? bonuses.join('<br>') : "Нет бонусов к продаже";
    }

    setInput('input-lvl70-portal', window.playerData.lvl70_portal || "");

    setInput('input-found-legs', window.playerData.found_legs);
    setInput('input-found-yellows', window.playerData.found_yellows);
    setInput('input-res-n', window.playerData.res_n || 0);
    setInput('input-res-dc', window.playerData.res_dc || 0);
    setInput('input-res-b', window.playerData.res_b || 0);
    setInput('input-res-a', window.playerData.res_a || 0);
    setInput('input-reagents', window.playerData.reagents || 0);
    setInput('input-death-breath', window.playerData.death_breath);

    document.getElementById('view-rank').innerText = `${window.playerData.rank} (${window.playerData.rankName})`;

    setInput('input-runes-sold', window.playerData.runes_sold);
    setInput('input-reputation', window.playerData.reputation);
    setInput('input-deals', window.playerData.deals);

    // Отображение текущей цены продажи руны
    const inputRunesSold = document.getElementById('input-runes-sold');
    if (inputRunesSold) {
        let runePriceEl = document.getElementById('view-rune-price');
        if (!runePriceEl) {
            runePriceEl = document.createElement('span');
            runePriceEl.id = 'view-rune-price';
            runePriceEl.style.marginLeft = '5px';
            runePriceEl.style.color = '#d4af37';
            runePriceEl.style.fontSize = '0.8rem';
            if (inputRunesSold.parentNode) {
                inputRunesSold.parentNode.appendChild(runePriceEl);
            }
        }
        
        let price = 0;
        const g = (window.playerData.guild || "").toLowerCase();
        const rank = window.playerData.rank || 1;
        
        if (g.includes('чародей') && !g.includes('ученик')) {
             const prices = [0, 2000, 3700, 6000, 9000, 13500, 18000, 22500, 27000, 32000, 45000];
             const basePrice = prices[rank] || 2000;
             const bonusPercent = 27.5 * (window.playerData.stat_int / 100);
             price = basePrice * (1 + bonusPercent / 100);
        } else if (g.includes('ученик')) {
             const basePrice = 1500;
             const bonusPercent = 15 * (window.playerData.stat_int / 100);
             price = basePrice * (1 + bonusPercent / 100);
        } else if (g.includes('вампир')) {
             const basePrice = 1500;
             const bonusPercent = 30 * (window.playerData.stat_int / 100);
             price = basePrice * (1 + bonusPercent / 100);
        }
        
        runePriceEl.innerText = price > 0 ? `(${window.formatCurrency(Math.floor(price))})` : "";
    }

    setInput('input-chests', window.playerData.chests_found);
    setInput('input-steals', window.playerData.steals);
    
    // Отображение оставшихся попыток кражи
    const stealsInput = document.getElementById('input-steals');
    if (stealsInput) {
        let attemptsEl = document.getElementById('view-theft-attempts');
        if (!attemptsEl) {
            attemptsEl = document.createElement('span');
            attemptsEl.id = 'view-theft-attempts';
            attemptsEl.style.marginLeft = '5px';
            attemptsEl.style.fontSize = '0.7rem';
            if (stealsInput.parentNode) stealsInput.parentNode.appendChild(attemptsEl);
        }
        
        const maxAttempts = window.getMaxTheftAttempts ? window.getMaxTheftAttempts(window.playerData.level) : 5;
        const used = (window.playerData.theft_attempts_level === window.playerData.level) ? (window.playerData.theft_attempts_count || 0) : 0;
        const remaining = Math.max(0, maxAttempts - used);
        attemptsEl.innerText = `(Ост: ${remaining})`;
        attemptsEl.style.color = remaining > 0 ? '#66ff66' : '#ff4444';
    }

    // Отображение шанса кражи (бонус от ловкости)
    const theftChanceEl = document.getElementById('view-theft-chance');
    if (theftChanceEl) {
        let theftText = "";
        const g = (window.playerData.guild || "").toLowerCase();
        if (g.includes('вор') || g.includes('воришка')) {
            const bonus = (window.playerData.stat_dex / 100) * 0.4;
            if (bonus > 0) theftText = `(+${bonus.toFixed(1)}%)`;
        }
        theftChanceEl.innerText = theftText;
    }

    // Отображение зарядов Гэмблера
    const dealsEl = document.getElementById('input-deals');
    if (dealsEl && (window.playerData.guild || "").toLowerCase().includes('гэмблер')) {
        const charges = window.playerData.gambler_bonus_sales_left || 0;
        const chargesEl = document.getElementById('view-gambler-charges') || document.createElement('span');
        chargesEl.id = 'view-gambler-charges';
        chargesEl.style.color = '#66ff66';
        chargesEl.style.fontSize = '0.7rem';
        chargesEl.style.marginLeft = '5px';
        chargesEl.innerText = charges > 0 ? `(x5: ${charges})` : "";
        if (!document.getElementById('view-gambler-charges')) dealsEl.parentNode.appendChild(chargesEl);
    }

    window.updateTheftTable(); // Обновление таблицы краж
    setInput('input-zakens', window.playerData.zakens);
    
    document.getElementById('view-potion-price').innerText = window.playerData.potion_price ? `(${window.playerData.potion_price})` : "";
    document.getElementById('view-zaken-discount').innerText = window.playerData.zaken_discount || "-";
    document.getElementById('view-theft-fine').innerText = window.playerData.theft_fine ? `(Штраф: ${window.playerData.theft_fine})` : "";

    document.getElementById('view-class').innerText = window.playerData.className || "Класс не выбран";
    document.getElementById('view-build').innerText = window.playerData.build ? `(${window.playerData.build})` : "";
    document.getElementById('view-guild').innerText = window.playerData.guild || "Нет";

    // Показываем все поля характеристик всегда
    // document.getElementById('input-stat-str-box').style.display = 'block';
    // document.getElementById('input-stat-dex-box').style.display = 'block';
    // document.getElementById('input-stat-int-box').style.display = 'block';
    // document.getElementById('input-stat-vit-box').style.display = 'block';
 
    window.updatePentaSlot('slot-penta-1', window.playerData.penta_1);
    window.updatePentaSlot('slot-penta-2', window.playerData.penta_2);
    window.updatePentaSlot('slot-penta-3', window.playerData.penta_3);

    // Обновление цены на кнопке покупки рун (Гильдия Торговцев)
    const traderBuyBtn = document.getElementById('btn-buy-runes-trader');
    if (traderBuyBtn) {
        const g = (window.playerData.guild || "").toLowerCase();
        if (g.includes('торговц')) {
            traderBuyBtn.style.display = 'inline-block';
            const lvl = window.playerData.level;
            const price = Math.floor(2000 * Math.pow(lvl, 1.4));
            traderBuyBtn.innerHTML = `Купить 📖 (${window.formatCurrency(price)})`;
        } else {
            traderBuyBtn.style.display = 'none';
        }
    }

    window.renderLearnedSkillsWidget();
    window.renderInventoryWidget();
    localStorage.setItem('d3mod_player', JSON.stringify(window.playerData));
    
    window.applyTheme(window.playerData.className);

    // Обновляем состояние кнопок профессий в открытом окне (если оно открыто)
    if (window.updateProfessionButtonState) window.updateProfessionButtonState();

    // Обновление кнопок меню (снятие замков)
    if (window.historyStack && window.pathNames && window.gameData && window.renderMenu) {
        const currentMenuId = window.historyStack[window.historyStack.length - 1];
        const currentTitle = window.pathNames[window.pathNames.length - 1];
        if (currentMenuId && (window.gameData[currentMenuId] || currentMenuId === 'main') && currentMenuId !== 'skills_study_menu') {
             window.renderMenu(currentMenuId, currentTitle, true, true);
        }
    }

    // Обновление контента открытого текстового окна (для таблицы кражи и кнопок внутри текста)
    const textWindow = document.getElementById('text-window');
    if (textWindow && textWindow.style.display === 'block') {
        // Если открыта таблица кражи, обновляем её
        if (document.getElementById('tr-theft-1')) {
            window.updateTheftTable();
        }
        // Обновляем кнопки профессий внутри текста
        if (window.updateProfessionButtonState) window.updateProfessionButtonState();
    }

    // Авто-ресайз полей
    document.querySelectorAll('.char-input').forEach(input => {
        window.autoResizeInput(input);
    });
    window.updateResourcePool();
}

window.updateTheftTable = function() {
    // Проверяем, открыта ли вкладка с таблицей
    const table = document.getElementById('tr-theft-1');
    if (!table) return;

    const dex = window.playerData.stat_dex || 0;
    const bonus = (dex / 100) * 0.4;
    
    const input = document.getElementById('theft-item-level');
    if (input && input.value === "") input.value = window.playerData.level;
    
    const itemLvl = input ? parseInt(input.value) : window.playerData.level;
    const playerLvl = window.playerData.level;
    
    let lvlDiffBonus = 0;
    const diff = itemLvl - playerLvl;
    
    if (diff > 0) {
        lvlDiffBonus = -(diff * 1.5);
    } else {
        lvlDiffBonus = Math.abs(diff) * 1.0;
    }

    const updateCell = (id, base) => {
        const el = document.getElementById(id);
        if (el) {
            let total = base + bonus + lvlDiffBonus;
            total = Math.max(0, Math.min(90, total)); // Clamp 0-90%
            el.innerText = total.toFixed(1) + '%';
            // Сохраняем актуальный шанс в атрибут для использования при клике
            el.dataset.chance = total;
        }
    };

    // Row 1 (1-19)
    updateCell('td-theft-n-1', 50);
    updateCell('td-theft-d-1', 35);
    updateCell('td-theft-c-1', 25);
    // Row 2 (20-39)
    updateCell('td-theft-n-2', 50);
    updateCell('td-theft-d-2', 50);
    updateCell('td-theft-c-2', 35);
    // Row 3 (40-70)
    updateCell('td-theft-n-3', 50);
    updateCell('td-theft-d-3', 50);
    updateCell('td-theft-c-3', 50);
}

window.toggleStatGroup = function(btn) {
    const group = btn.closest('.stat-group');
    const content = group.querySelector('.stat-group-content');
    if (content.style.display === 'none') {
        content.style.display = 'block';
        btn.innerText = '[-]';
    } else {
        content.style.display = 'none';
        btn.innerText = '[+]';
    }
}

window.updatePentaSlot = function(id, isActive) {
    const el = document.getElementById(id);
    if (el) {
        if (isActive) el.classList.add('active');
        else el.classList.remove('active');
    }
}

window.restorePanels = function() {
    if (window.playerData.guild_html) {
        document.getElementById('bonus-guild-name').innerText = (window.playerData.guild || "ГИЛЬДИЯ").toUpperCase();
        document.getElementById('bonus-content').innerHTML = window.playerData.guild_html;
        const p = document.getElementById('active-guild-bonus');
        p.style.display = 'block';
        p.style.order = '2';
        p.classList.add('right-panel-bonus');
        window.makeDraggable(p);
    }
    if (window.playerData.class_html) {
        document.getElementById('bonus-class-name').innerText = (window.playerData.build || "БИЛД").toUpperCase();
        document.getElementById('class-bonus-content').innerHTML = window.playerData.class_html;
        const p = document.getElementById('active-class-bonus');
        p.style.display = 'block';
        p.style.order = '1';
        p.classList.add('right-panel-bonus');
        window.makeDraggable(p);
    }
    
    // Восстановление второго билда
    if (window.playerData.class_html_2) {
        let p2 = document.getElementById('active-class-bonus-2');
        if (!p2) {
            // Создаем панель, если её нет в HTML (динамически)
            p2 = document.createElement('div');
            p2.id = 'active-class-bonus-2';
            p2.className = 'right-panel-bonus';
            p2.style.display = 'none';
            p2.innerHTML = `<h3 id="bonus-class-name-2" style="color: #66ccff; border-bottom: 1px solid #66ccff; padding-bottom: 5px; margin-top: 0;">БИЛД 2</h3><div id="class-bonus-content-2"></div>`;
            document.getElementById('right-panels-stack').appendChild(p2);
        }
        
        document.getElementById('bonus-class-name-2').innerText = (window.playerData.build_2 || "БИЛД 2").toUpperCase();
        document.getElementById('class-bonus-content-2').innerHTML = window.playerData.class_html_2;
        p2.style.display = 'block';
        p2.style.order = '3';
        window.makeDraggable(p2);
    }
}

window.setVolume = function(value) {
    window.audioTrack.volume = value;
}

window.toggleMusic = function() {
    const btn = document.getElementById('music-btn');
    const slider = document.getElementById('volume-slider');
    if (window.isMusicPlaying) {
        window.audioTrack.pause();
        window.audioTrack.currentTime = 0;
        btn.innerHTML = 'МУЗЫКА<span class="btn-shimmer"></span>';
        btn.style.color = '#66ccff'; // Убрал изменение border, чтобы не ломать стиль
        slider.style.display = 'none';
        window.isMusicPlaying = false;
    } else {
        window.audioTrack.play().then(() => {
            btn.innerHTML = 'СТОП<span class="btn-shimmer"></span>';
            btn.style.color = '#ff4444'; // Убрал изменение border
            slider.style.display = 'block';
            window.isMusicPlaying = true;
        }).catch(e => {
            // Autoplay failed
        });
    }
}

// Вспомогательные функции для маппинга ВП <-> Сложность
window.getMinVPForDifficulty = function(diff) {
    switch(diff) {
        case "Высокий": return 1;
        case "Эксперт": return 4;
        case "Мастер": return 7;
        case "T1": return 10;
        case "T2": return 13;
        case "T3": return 16;
        case "T4": return 19;
        case "T5": return 22;
        case "T6": return 26;
        default: return 1;
    }
};

window.getDifficultyFromVP = function(vp) {
    if (vp < 4) return "Высокий"; // 1-3
    if (vp < 7) return "Эксперт"; // 4-6
    if (vp < 10) return "Мастер"; // 7-9 (исправлено с 19, т.к. Т1 с 10)
    if (vp < 13) return "T1";     // 10-12
    if (vp < 16) return "T2";     // 13-15
    if (vp < 19) return "T3";     // 16-18
    if (vp < 22) return "T4";     // 19-21
    if (vp < 26) return "T5";     // 22-25
    if (vp <= 30) return "T6";    // 26-30
    // Далее стандартная прогрессия D3 (примерная)
    if (vp < 35) return "T7"; else if (vp < 40) return "T8"; else if (vp < 45) return "T9"; else if (vp < 50) return "T10"; else if (vp < 55) return "T11"; else if (vp < 60) return "T12"; else if (vp < 65) return "T13"; else if (vp < 70) return "T14"; else if (vp < 75) return "T15"; else return "T16";
};

window.savePlayerData = function() {
    // 1. Сохраняем старые данные для сравнения
    const oldData = { ...window.playerData };

    // Вспомогательные функции для безопасного чтения
    const getVal = (id, isFloat = false) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const val = isFloat ? parseFloat(el.value) : parseInt(el.value);
        return isNaN(val) ? 0 : val;
    };
    const getStr = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : null;
    };

    // 2. Читаем новые данные из полей
   const name = getStr('input-name');
    if (name !== null) window.playerData.name = name;
    
    const lvl = getVal('input-lvl', true);
    if (lvl !== null) {
        window.playerData.level = lvl;
        // Автоматическое изменение сложности до 70 уровня
        if (lvl < 70) {
            let tier = "Высокий";
            if (lvl <= 19) tier = "Высокий";
            else if (lvl <= 39) tier = "Эксперт";
            else if (lvl <= 60) tier = "Мастер";
            else if (lvl <= 65) tier = "T1";
            else if (lvl <= 69) tier = "T2";
            window.playerData.difficulty = tier;
        } else {
            // После 70 сложность зависит от ВП (см. ниже)
        }
    }
    
    // Кастомное чтение акта для поддержки "1+"
    let act = null;
    const actEl = document.getElementById('input-act');
    if (actEl) {
        const valStr = actEl.value.toString();
        if (valStr.includes('+')) {
            act = parseInt(valStr) + 5;
        } else {
            act = parseInt(valStr);
        }
        if (isNaN(act)) act = null;
    }

    if (act !== null && act !== window.playerData.act) {
        // Если акт изменился, сбрасываем счетчик НП
        window.playerData.act = act;
        window.playerData.np_count = 0;
        window.showCustomAlert(`Акт изменен на ${act}.<br>Счетчик НП сброшен.`);
    }

    const baseKills = getVal('input-base-kills'); if (baseKills !== null) window.playerData.base_kills = baseKills;
    const baseElites = getVal('input-base-elites'); if (baseElites !== null) window.playerData.base_elites = baseElites;
    
    let gg = getVal('input-gold-g', true);
    let gs = getVal('input-gold-s', true);
    let gc = getVal('input-gold-c', true);
    let gy = getVal('input-gold-y', true);
    let mithril = getVal('input-mithril');

    // Автоматическая конвертация валют при вводе >= 100
    if (gy !== null && gy >= 100) {
        const extra = Math.floor(gy / 100);
        gy = gy % 100;
        if (gc !== null) gc += extra; else gc = extra;
        document.getElementById('input-gold-y').value = gy;
        document.getElementById('input-gold-c').value = gc;
    }
    if (gc !== null && gc >= 100) {
        const extra = Math.floor(gc / 100);
        gc = gc % 100;
        if (gs !== null) gs += extra; else gs = extra;
        document.getElementById('input-gold-c').value = gc;
        document.getElementById('input-gold-s').value = gs;
    }
    if (gs !== null && gs >= 100) {
        const extra = Math.floor(gs / 100);
        gs = gs % 100;
        if (gg !== null) gg += extra; else gg = extra;
        document.getElementById('input-gold-s').value = gs;
        document.getElementById('input-gold-g').value = gg;
    }
    if (gg !== null && gg >= 100) {
        const extra = Math.floor(gg / 100);
        gg = gg % 100;
        if (mithril !== null) mithril += extra; else mithril = extra;
        document.getElementById('input-gold-g').value = gg;
        document.getElementById('input-mithril').value = mithril;
    }

    if (gg !== null) window.playerData.gold_g = gg;
    if (gs !== null) window.playerData.gold_s = gs;
    if (gc !== null) window.playerData.gold_c = gc;
    if (gy !== null) window.playerData.gold_y = gy;
    
    if (mithril !== null) {
        window.playerData.mithril = Math.min(mithril, 10); // Ограничение 10
        if (mithril > 10) document.getElementById('input-mithril').value = 10;
    }
    
    const runes = getVal('input-runes', true); if (runes !== null) window.playerData.runes = runes;
    const para = getVal('input-para', true); if (para !== null) window.playerData.para = para;
    const potions = getVal('input-potions'); if (potions !== null) window.playerData.potions = potions;
    
    const str = getVal('input-stat-str'); if (str !== null) window.playerData.stat_str = str;
    const dex = getVal('input-stat-dex'); if (dex !== null) window.playerData.stat_dex = dex;
    const int = getVal('input-stat-int'); if (int !== null) window.playerData.stat_int = int;
    const vit = getVal('input-stat-vit'); if (vit !== null) window.playerData.stat_vit = vit;
    
    const kills = getVal('input-kills'); if (kills !== null) window.playerData.kills = kills;
    const elites = getVal('input-elites-solo'); if (elites !== null) window.playerData.elites_solo = elites;
    const bosses = getVal('input-bosses'); if (bosses !== null) window.playerData.bosses = bosses;
    const gobsS = getVal('input-gobs-solo'); if (gobsS !== null) window.playerData.gobs_solo = gobsS;
    const gobsA = getVal('input-gobs-assist'); if (gobsA !== null) window.playerData.gobs_assist = gobsA;
    const maxVp = getVal('input-max-vp'); if (maxVp !== null) window.playerData.maxVp = maxVp;
    
    const portal70 = getStr('input-lvl70-portal'); if (portal70 !== null) window.playerData.lvl70_portal = portal70;

    // Логика перехода на 70 уровень: Установка начального ВП
    if (oldData.level < 70 && window.playerData.level >= 70) {
        const currentDiff = window.playerData.difficulty || "Высокий";
        const startVp = window.getMinVPForDifficulty(currentDiff);
        window.playerData.maxVp = Math.max(window.playerData.maxVp || 0, startVp);
        window.playerData.base_vp_at_70 = window.playerData.maxVp; // Фиксируем базу ВП
    }

    // Логика после 70 уровня: Уровень зависит от ВП (База + (Текущий - База))
    if (window.playerData.level >= 70) {
        const base = window.playerData.base_vp_at_70 || 0;
        const current = window.playerData.maxVp || 0;
        window.playerData.level = 70 + Math.max(0, current - base);
    }

    const legs = getVal('input-found-legs'); if (legs !== null) window.playerData.found_legs = legs;
    const yellows = getVal('input-found-yellows'); if (yellows !== null) window.playerData.found_yellows = yellows;
    const db = getVal('input-death-breath'); if (db !== null) window.playerData.death_breath = db;
    const resN = getVal('input-res-n'); if (resN !== null) window.playerData.res_n = resN;
    const resDC = getVal('input-res-dc'); if (resDC !== null) window.playerData.res_dc = resDC;
    const resB = getVal('input-res-b'); if (resB !== null) window.playerData.res_b = resB;
    const resA = getVal('input-res-a'); if (resA !== null) window.playerData.res_a = resA;
    const reag = getVal('input-reagents'); if (reag !== null) window.playerData.reagents = reag;

    const rSold = getVal('input-runes-sold', true); if (rSold !== null) window.playerData.runes_sold = rSold;
    const rep = getVal('input-reputation'); if (rep !== null) window.playerData.reputation = rep;
    const deals = getVal('input-deals'); if (deals !== null) window.playerData.deals = deals;
    const chests = getVal('input-chests'); if (chests !== null) window.playerData.chests_found = chests;
    const steals = getVal('input-steals'); if (steals !== null) window.playerData.steals = steals;
    
    const zakens = getVal('input-zakens'); if (zakens !== null) window.playerData.zakens = zakens;

    // Проверка изменения денег для звука
    if (oldData.gold_g !== window.playerData.gold_g || 
        oldData.gold_s !== window.playerData.gold_s || 
        oldData.gold_c !== window.playerData.gold_c || 
        oldData.gold_y !== window.playerData.gold_y) {
        if (window.coinSound) { window.coinSound.currentTime = 0; window.coinSound.play().catch(e => {}); }
    }
    // Начисление золота Соратникам за убийства (при ручном вводе)
    const g = (window.playerData.guild || "").toLowerCase();
    const currentKills = window.playerData.kills;
    const maxKills = window.playerData.highest_kills || 0;
    const dKills = Math.max(0, currentKills - maxKills);

    if (dKills > 0 && (g.includes('салага') || g.includes('громила') || g.includes('лорд войны'))) {
        let mult = 0;
        if (g.includes('салага')) mult = 0.88;
        else if (g.includes('громила')) mult = 1.75;
        else if (g.includes('лорд войны')) mult = 1.23;
        
        // Учитываем бонус ранга
        const rank = window.playerData.rank || 0;
        const rankMultipliers = [0, 1.5, 2.5, 4, 6, 9, 12, 15, 18, 21.5, 27];
        const rankMult = (rank > 0) ? (rankMultipliers[rank] || 1) : 1;

        const reward = Math.floor(dKills * mult * window.playerData.level * rankMult);
        window.addYen(reward);
    }
    
    // Обновляем рекорд убийств, если текущее значение выше
    if (currentKills > maxKills) {
        window.playerData.highest_kills = currentKills;
    }

    window.calculateRank();
    // Обновляем отображение ранга сразу
    document.getElementById('view-rank').innerText = `${window.playerData.rank} (${window.playerData.rankName})`;
    window.applyGuildRewards(oldData);
    window.checkGuildExitConditions();
    window.checkGuildProgression(); // Проверка на повышение
    window.saveToStorage();
    // checkGuildExitConditions теперь также проверяет аренду, так как она вызывается здесь

    // Авто-ресайз полей
    document.querySelectorAll('.char-input').forEach(input => {
        window.autoResizeInput(input);
    });
    window.updateResourcePool();
    window.updateCoinStacks();
}

window.renderLearnedSkillsWidget = function() {
    const container = document.getElementById('learned-skills-widget');
    const content = document.getElementById('learned-skills-content');
    if (!container || !content) return;

    const skills = window.playerData.learnedSkills || {};
    container.style.display = 'block';
    
    if (Object.keys(skills).length === 0) {
        content.innerHTML = '<div style="color: #888; font-size: 0.7rem; text-align: center;">Нет навыков</div>';
        return;
    }

    const secondLifeSkills = ["Нестабильная аномалия", "Стальные нервы", "Познание смерти", "Вместилище духов", "Непробиваемая броня", "Бдительность"];

    let activeHtml = '';
    let passiveHtml = '';
    const cls = window.playerData.className;
    const db = window.skillDB[cls];

    for (const [skill, runes] of Object.entries(skills)) {
        let isPassive = false;
        if (db) {
            const sObj = db.find(s => s.name === skill);
            if (sObj && sObj.category === "Пассивные") isPassive = true;
        }

        let skillNameHtml = `<span style="color: #b8a078; font-weight: bold;">${skill}</span>`;
        
        if (secondLifeSkills.includes(skill)) {
            skillNameHtml = `<span style="color: #ff7979; font-weight: bold; cursor: pointer; border-bottom: 1px dashed #ff7979;" onclick="window.handleSecondLifeClick('${skill}')" title="Нажмите для оплаты срабатывания">${skill} (2-я жизнь)</span>`;
        }

        const entryHtml = `<div class="widget-item">${skillNameHtml}<br><span style="color: #888; font-size: 0.7rem;">${runes.join(', ')}</span></div>`;
        
        if (isPassive) passiveHtml += entryHtml;
        else activeHtml += entryHtml;
    }
    
    let finalHtml = '';
    if (activeHtml) finalHtml += `<div style="color: #d4af37; font-size: 0.75rem; font-weight: bold; margin: 5px 0 2px 0; border-bottom: 1px solid #555;">⚔️ АКТИВНЫЕ</div><div class="widget-grid">${activeHtml}</div>`;
    if (passiveHtml) finalHtml += `<div style="color: #a29bfe; font-size: 0.75rem; font-weight: bold; margin: 10px 0 2px 0; border-bottom: 1px solid #555;">🛡️ ПАССИВНЫЕ</div><div class="widget-grid">${passiveHtml}</div>`;
    
    content.innerHTML = finalHtml;
}

window.renderInventoryWidget = function() {
    const container = document.getElementById('inventory-widget');
    const content = document.getElementById('inventory-content');
    if (!container || !content) return;
    
    const inv = window.playerData.inventory || [];
    container.style.display = 'block';
    
    if (inv.length === 0) {
        content.innerHTML = '<div style="color: #888; font-size: 0.7rem; text-align: center;">Пусто</div>';
        return;
    }
    let weapons = [];
    let armors = [];
    let others = [];

    inv.forEach(item => {
        const props = item.properties || [];
        const isWeapon = props.some(p => p.includes('Основа оружия'));
        const isArmor = props.some(p => p.includes('Основа брони'));
        
        if (isWeapon) weapons.push(item);
        else if (isArmor) armors.push(item);
        else others.push(item);
    });

    let html = '';
    const renderItem = (item) => {
        const propsStr = (item.properties || []).join(', ').replace(/'/g, "&apos;");
        const safeName = item.name.replace(/'/g, "&apos;");
        const isStolen = item.isStolen || false;
        const g = (item.grade || "").toUpperCase();
        
        let nameColor = "#fff";
        if (isStolen) nameColor = "#ff7979";
        else {
            if (g === 'N') nameColor = "#aaaaaa";
            else if (g === 'D') nameColor = "#66ccff";
            else if (g === 'C') nameColor = "#ffff00";
            else if (g === 'B' || g === 'A') nameColor = "#ff8c00";
            else if (g === 'S' || g === 'S+' || g === 'SPECTRUM') nameColor = "#00ff00";
        }

        const icon = isStolen ? " 🧤" : "";
        
        let borderStyle = "1px solid #333";
        const isGreenGrade = (g === 'S+' || g === 'SPECTRUM');

        if (item.isPrimal) {
            borderStyle = isGreenGrade ? "2px solid #00ff00" : "2px solid #ff4444"; // Green for S+/Spectrum, else Red
        } else if (item.isAncient) {
            borderStyle = isGreenGrade ? "2px solid #00ff00" : "2px solid #ff9900"; // Green for S+/Spectrum, else Orange
        }
        
        // Fallback check by name if flags are missing (for old items)
        if (!item.isPrimal && !item.isAncient) {
            if (item.name.includes('Первозданн')) borderStyle = isGreenGrade ? "2px solid #00ff00" : "2px solid #ff4444";
            else if (item.name.includes('Древн') || item.name.includes('Ancient')) borderStyle = isGreenGrade ? "2px solid #00ff00" : "2px solid #ff9900";
        }

        return `<div class="widget-item" style="cursor: help; border: ${borderStyle};" onmousemove="window.showItemTooltip(event, '${safeName}', '${item.grade}', ${item.level}, ${item.buyPrice}, ${item.isCrafted}, '${propsStr}', ${isStolen})" onmouseleave="window.hideItemTooltip()">
            <span style="color: ${nameColor}; font-weight: bold;">${item.name}${icon}</span><br>
            <span style="color: #888; font-size: 0.7rem;">${item.grade} | Lvl ${item.level} | ${window.formatCurrency(item.buyPrice)}</span>
        </div>`;
    };

    if (weapons.length > 0) {
        html += `<div style="color: #ff9900; font-size: 0.75rem; font-weight: bold; margin: 5px 0 2px 0; border-bottom: 1px solid #555;">⚔️ ОРУЖИЕ</div><div class="widget-grid">`;
        weapons.forEach(i => html += renderItem(i));
        html += `</div>`;
    }
    if (armors.length > 0) {
        html += `<div style="color: #66ccff; font-size: 0.75rem; font-weight: bold; margin: 5px 0 2px 0; border-bottom: 1px solid #555;">🛡️ БРОНЯ</div><div class="widget-grid">`;
        armors.forEach(i => html += renderItem(i));
        html += `</div>`;
    }
    if (others.length > 0) {
        html += `<div style="color: #40e0d0; font-size: 0.75rem; font-weight: bold; margin: 5px 0 2px 0; border-bottom: 1px solid #555;">💍 БИЖА</div><div class="widget-grid">`;
        others.forEach(i => html += renderItem(i));
        html += `</div>`;
    }
    content.innerHTML = html;
}

window.showItemTooltip = function(e, name, grade, level, price, isCrafted, props, isStolen) {
    let tooltip = document.getElementById('item-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'item-tooltip';
        tooltip.style.position = 'fixed';
        tooltip.style.background = 'rgba(0, 0, 0, 0.95)';
        tooltip.style.border = '1px solid #d4af37';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '10px';
        tooltip.style.fontSize = '0.85rem';
        tooltip.style.borderRadius = '4px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.zIndex = '10000';
        tooltip.style.boxShadow = '0 0 10px #000';
        tooltip.style.maxWidth = '250px';
        document.body.appendChild(tooltip);
    }
    
    let typeText = "";
    if (isStolen) {
        typeText = "<span style='color:#ff7979'>Украдено</span>";
    } else {
        typeText = isCrafted ? "<span style='color:#a29bfe'>Создано (Крафт)</span>" : "<span style='color:#66ff66'>Куплено</span>";
    }

    let propsHtml = "";
    if (props) {
        propsHtml = `<div style="margin-top:5px; border-top:1px solid #555; padding-top:5px; color:#ccc; font-style:italic;">${props}</div>`;
    }
    
    tooltip.innerHTML = `<strong style="color:#d4af37; font-size:1rem;">${name}</strong><br>
                         Грейд: ${grade}<br>
                         Уровень: ${level}<br>
                         Цена: ${window.formatCurrency(price)}<br>
                         ${typeText}
                         ${propsHtml}`;
    
    tooltip.style.display = 'block';
    tooltip.style.top = (e.clientY + 15) + 'px';
    tooltip.style.left = (e.clientX + 15) + 'px';
}

window.hideItemTooltip = function() {
    const tooltip = document.getElementById('item-tooltip');
    if (tooltip) tooltip.style.display = 'none';
}

window.filterItems = function(inputElement) {
    const searchTerm = inputElement.value;
    const searchTermLower = searchTerm.toLowerCase();
    // Контейнер - это следующий элемент после input
    const container = inputElement.nextElementSibling;
    if (!container) return;

    const items = container.querySelectorAll('.item-category');
    items.forEach(item => {
        // Сохраняем оригинальный HTML, если еще не сохранен
        if (!item.dataset.originalHtml) {
            item.dataset.originalHtml = item.innerHTML;
        }
        const originalHtml = item.dataset.originalHtml;
        const itemTextLower = item.innerText.toLowerCase();

        // Сначала восстанавливаем оригинальный HTML
        item.innerHTML = originalHtml;

        if (searchTermLower && itemTextLower.includes(searchTermLower)) {
            item.style.display = 'block';
            const regex = new RegExp(searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
            item.innerHTML = item.innerHTML.replace(regex, (match) => `<span class="search-highlight">${match}</span>`);
        } else if (searchTermLower) {
            item.style.display = 'none';
        } else {
            item.style.display = 'block';
        }
    });
}

window.autoResizeInput = function(input) {
    if (!input || input.classList.contains('name-input')) return;
    const val = input.value.toString();
// Для парагона делаем отступ меньше (1 символ вместо 3)
    const extra = (input.id === 'input-para') ? 1 : 3;
    input.style.width = (Math.max(1, val.length) + extra) + 'ch';}

window.updateResourcePool = function() {
    const pool = document.getElementById('resource-pool');
    const liquid = pool ? pool.querySelector('.resource-liquid') : null;
    if (!pool || !liquid) return;

    const g = (window.playerData.guild || "").toLowerCase();
    const rank = window.playerData.rank || 0;
    
    // Если ранг максимальный (10), заполняем полностью
    if (rank >= 10) {
        liquid.style.height = '100%';
        // pool.title сохраняем от темы или ставим свой
        return;
    }

    let progress = 0;
    let tooltip = "";

    const calcPct = (current, target) => Math.min(100, Math.max(0, (current / target) * 100));
    const kills = (window.playerData.kills || 0) + (window.playerData.base_kills || 0);

    if (g.includes('салага')) {
        const pStr = calcPct(window.playerData.stat_str, 1000);
        const pKills = calcPct(kills, 1700);
        progress = Math.max(pStr, pKills);
        tooltip = `Салага -> Громила/Лорд\nСила: ${window.playerData.stat_str} / 1000\nУбийства: ${kills} / 1700`;
    } 
    else if (g.includes('торговц')) {
        const targets = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
        const target = targets[rank] || 10000;
        progress = calcPct(window.playerData.stat_vit, target);
        tooltip = `Торговцы: Ранг ${rank} -> ${rank+1}\nЖивучесть: ${window.playerData.stat_vit} / ${target}`;
    }
    else if (g.includes('охотник на гоблинов')) {
        const targets = [85, 215, 430, 685, 1330, 1870, 2315, 2750, 3200, 4000];
        const target = targets[rank] || 4000;
        progress = calcPct(window.playerData.reputation, target);
        tooltip = `Охотник на гоблинов: Ранг ${rank} -> ${rank+1}\nРепутация: ${window.playerData.reputation} / ${target}`;
    }
    else if (g.includes('охотник на ☠️')) {
        const targets = [85, 215, 430, 685, 1030, 1370, 1715, 2050, 2400, 3000];
        const target = targets[rank] || 3000;
        progress = calcPct(window.playerData.reputation, target);
        tooltip = `Охотник на Элиту: Ранг ${rank} -> ${rank+1}\nРепутация: ${window.playerData.reputation} / ${target}`;
    }
    else if (g.includes('вампир') || g.includes('чародей')) {
        const tInt = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
        const tPara = [50, 100, 200, 300, 450, 600, 700, 800, 900, 1000];
        const targetInt = tInt[rank] || 10000;
        const targetPara = tPara[rank] || 1000;
        const pInt = calcPct(window.playerData.stat_int, targetInt);
        const pPara = calcPct(window.playerData.para, targetPara);
        progress = Math.max(pInt, pPara);
        tooltip = `Маги: Ранг ${rank} -> ${rank+1}\nИнтеллект: ${window.playerData.stat_int} / ${targetInt}\nПарагон: ${window.playerData.para} / ${targetPara}`;
    }
    else if (g.includes('гэмблер')) {
        const tDex = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
        const tDeals = [7, 20, 45, 70, 100, 135, 170, 210, 255, 313];
        const targetDex = tDex[rank] || 10000;
        const targetDeals = tDeals[rank] || 313;
        const pDex = calcPct(window.playerData.stat_dex, targetDex);
        const pDeals = calcPct(window.playerData.deals, targetDeals);
        progress = Math.max(pDex, pDeals);
        tooltip = `Гэмблер: Ранг ${rank} -> ${rank+1}\nЛовкость: ${window.playerData.stat_dex} / ${targetDex}\nСделки: ${window.playerData.deals} / ${targetDeals}`;
    }
    else if (g.includes('вор') && !g.includes('воришка')) {
        const targets = [7, 20, 45, 70, 100, 135, 170, 210, 255, 300];
        const target = targets[rank] || 300;
        progress = calcPct(window.playerData.steals, target);
        tooltip = `Вор: Ранг ${rank} -> ${rank+1}\nКражи: ${window.playerData.steals} / ${target}`;
    }
    else if (g.includes('искатель') || g.includes('джимми')) {
        // Для искателей приключений и богатства (Джимми не имеет рангов, но пусть будет)
        const targets = g.includes('богатства') ? [8, 15, 24, 35, 47, 60, 75, 92, 110, 135] : [5, 10, 16, 23, 31, 40, 50, 61, 73, 90];
        const target = targets[rank] || 135;
        progress = calcPct(window.playerData.found_legs, target);
        tooltip = `Искатель: Ранг ${rank} -> ${rank+1}\nЛегендарки: ${window.playerData.found_legs} / ${target}`;
    }
    else if (g.includes('громила') || g.includes('лорд войны')) {
        const tStr = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
        const tKills = [1700, 4300, 8600, 13700, 20600, 27400, 34300, 41000, 48000, 60000];
        const targetStr = tStr[rank] || 10000;
        const targetKills = tKills[rank] || 60000;
        const pStr = calcPct(window.playerData.stat_str, targetStr);
        const pKills = calcPct(kills, targetKills);
        progress = Math.max(pStr, pKills);
        tooltip = `Соратники: Ранг ${rank} -> ${rank+1}\nСила: ${window.playerData.stat_str} / ${targetStr}\nУбийства: ${kills} / ${targetKills}`;
    }
    else {
        progress = 100;
    }

    liquid.style.height = `${progress}%`;
    if (tooltip) pool.title = tooltip;
}

window.updateCoinStacks = function() {
    const types = ['m', 'g', 's', 'c', 'y']; // Мифрил, Золото, Серебро, Медь, Йена
    const containerHeight = 75; // Макс высота стопки в пикселях
    const coinHeight = 4; // Высота одной монеты

    types.forEach(type => {
        const stackEl = document.getElementById(`stack-${type}`);
        if (!stackEl) return;
        
        let val = 0;
        let count = 0;

        if (type === 'm') {
            val = window.playerData.mithril || 0;
            count = Math.max(0, Math.min(val, 10)); // Ограничение мифрила до 10
        } else {
            val = window.playerData[`gold_${type}`] || 0;
            count = Math.max(0, Math.min(val, 100)); // Ограничение монет до 100
        }
        
        // Синхронизация количества элементов (чтобы анимировать только новые)
        const currentCount = stackEl.children.length;

        if (count > currentCount) {
            // Добавляем новые монеты
            const step = (containerHeight - coinHeight) / 99;

            for (let i = currentCount; i < count; i++) {
                let el;
                let targetBottom;

                if (type === 'm') {
                    el = document.createElement('div');
                    el.className = 'mithril-gem';
                    const seed = i * 123.45;
                    const rndOffset = (Math.sin(seed) * 3);
                    const rndRot = (Math.cos(seed) * 30);
                    
                    targetBottom = `${i * 7}px`;
                    el.style.left = `calc(50% - 7px + ${rndOffset}px)`;
                    el.style.transform = `rotate(${rndRot}deg)`;
                } else {
                    el = document.createElement('div');
                    el.className = `coin coin-${type}`;
                    targetBottom = `${i * step}px`;
                    if (type !== 'y') {
                        el.style.animationDelay = `${Math.random() * 5}s`;
                    }
                }

                el.style.zIndex = i;
                // Начальная позиция для анимации (сверху)
                el.style.bottom = '100px'; 
                el.style.opacity = '0';
                
                stackEl.appendChild(el);

                // Запуск анимации падения
                // Используем setTimeout вместо requestAnimationFrame для надежности при загрузке
                setTimeout(() => {
                    el.style.bottom = targetBottom;
                    el.style.opacity = '1';
                }, 50);
            }
        } else if (count < currentCount) {
            // Удаляем лишние сверху
            while (stackEl.children.length > count) {
                stackEl.lastChild.remove();
            }
        }
        
        let typeName = '';
        if (type === 'm') typeName = 'Мифрила';
        else if (type === 'g') typeName = 'Золота';
        else if (type === 's') typeName = 'Серебра';
        else if (type === 'c') typeName = 'Меди';
        else if (type === 'y') typeName = 'Йен';
        
        // Убираем стандартный title, чтобы использовать кастомный тултип
        stackEl.removeAttribute('title');
        stackEl.onmousemove = (e) => window.showCurrencyTooltip(e, type, val);
        stackEl.onmouseleave = () => window.hideCurrencyTooltip();
    });
}
