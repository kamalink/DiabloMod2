// --- ИНТЕРФЕЙС И ОТРИСОВКА ---

window.renderMenu = function(menuId, titleText, isBack = false) {
    const area = document.getElementById('buttons-area');
    const menuTitle = document.getElementById('menu-title');
    const breadcrumb = document.getElementById('breadcrumb');
    area.innerHTML = '';
    
    // Текстовые вставки для разделов
    if (menuId === 'items_menu') {
        const infoMsg = document.createElement('div');
        infoMsg.style.color = '#d4af37';
        infoMsg.style.textAlign = 'center';
        infoMsg.style.marginBottom = '15px';
        infoMsg.innerHTML = `<p>🔹 Продажа купленного — 50%</p><p>🔹 Каждый следующий грейд предметов выше 🌖 гг стоит на 20% дороже.</p>`;
        area.appendChild(infoMsg);
    }
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
    if (menuId === 'grades_abc_menu') {
        const infoMsg = document.createElement('div');
        infoMsg.style.color = '#d4af37';
        infoMsg.style.textAlign = 'center';
        infoMsg.style.fontSize = '0.9rem';
        infoMsg.style.marginBottom = '15px';
        infoMsg.style.padding = '10px';
        infoMsg.style.border = '1px double #5a0000';
        infoMsg.innerHTML = `<p>📓 grade: 3🥉 * 1.1<sup>(🌒 вещи - 1)</sup></p><p>📘, 📒 grade: 9🥉 * 1.1<sup>(🌒 вещи - 1)</sup></p><p>📙 grade: 12🥉 * 1.1<sup>(🌒 вещи - 1)</sup></p><p style="font-size: 0.8rem; color: #ccc;">🔹 Любое легендарное зелье здоровья.</p><p>📕 grade: 32🥉 * 1.1<sup>(🌒 вещи - 1)</sup></p><hr><p style="text-align: left; font-size: 0.85rem;"><strong>Примеры:</strong><br>1) 📘 44🌒: 9 * 1.1<sup>43</sup> = 54🥉<br>2) 📒 25🌒: 12 * 1.1<sup>24</sup> = 11.8🥉</p>`;
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
    if (menuId === 'professions_menu') {
        const infoMsg = document.createElement('div');
        infoMsg.style.background = 'rgba(212, 175, 55, 0.1)';
        infoMsg.style.border = '1px solid #d4af37';
        infoMsg.style.padding = '10px';
        infoMsg.style.marginBottom = '15px';
        infoMsg.style.fontSize = '0.9rem';
        infoMsg.innerHTML = `<p><b>1️⃣ Профессия (20🌒):</b> Убить 2☠️ в локации класса.</p><p><b>2️⃣ Профессия (40🌒):</b> Убить 1 конкретного 👹.</p><p><b>3️⃣ Профессия (70🌒):</b> Пройти 🏛️ в одиночку.</p>`;
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
        homeBtn.innerText = '🏠 ГЛАВНОЕ МЕНЮ';
        homeBtn.onclick = () => {
            window.historyStack = ['main'];
            window.pathNames = ['ГЛАВНАЯ'];
            window.renderMenu('main', 'Diablo III Mod', true);
        };

        const backBtn = document.createElement('button');
        backBtn.className = 'd2-button nav-btn';
        backBtn.innerText = '🔙 НАЗАД';
        backBtn.onclick = () => {
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
        if (menuId === 'guilds_list') btn.classList.add('btn-guild');

        btn.innerText = item.title;
        btn.style.opacity = '0';
        btn.style.animation = `fadeInUp 0.3s ease-out forwards ${index * 0.05}s`;

        btn.addEventListener('animationend', () => {
            btn.style.opacity = '1';
            btn.style.animation = 'none';
        });
        
        btn.onclick = () => {
            const targetData = window.gameData[item.id];
            if (item.url) {
                window.open(item.url, '_blank');
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

    windowArea.style.display = 'block';
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
    
    if (title.includes('Пентограмма')) {
        if (document.getElementById('penta_1')) document.getElementById('penta_1').checked = window.playerData.penta_1;
        if (document.getElementById('penta_2')) document.getElementById('penta_2').checked = window.playerData.penta_2;
        if (document.getElementById('penta_3')) document.getElementById('penta_3').checked = window.playerData.penta_3;
    }
}

window.updateUI = function() {
    if (!window.playerData || !window.playerData.name) return;
    
    window.calculateRank();

    document.getElementById('view-name').innerText = window.playerData.name.toUpperCase();
    document.getElementById('view-lvl').innerText = window.playerData.level;
    document.getElementById('view-gold-g').innerText = window.playerData.gold_g;
    document.getElementById('view-gold-s').innerText = window.playerData.gold_s;
    document.getElementById('view-gold-c').innerText = window.playerData.gold_c;
    document.getElementById('view-gold-y').innerText = window.playerData.gold_y;
    document.getElementById('view-runes').innerText = window.playerData.runes;
    document.getElementById('view-para').innerText = window.playerData.para;
    document.getElementById('view-potions').innerText = window.playerData.potions;
    
    document.getElementById('view-stat-str').innerText = window.playerData.stat_str;
    document.getElementById('view-stat-dex').innerText = window.playerData.stat_dex;
    document.getElementById('view-stat-int').innerText = window.playerData.stat_int;
    document.getElementById('view-stat-vit').innerText = window.playerData.stat_vit;
    
    document.getElementById('view-kills').innerText = (window.playerData.kills + (window.playerData.base_kills || 0));
    document.getElementById('view-elites-solo').innerText = (window.playerData.elites_solo + (window.playerData.base_elites || 0));
    document.getElementById('view-bosses').innerText = window.playerData.bosses;
    document.getElementById('view-gobs-solo').innerText = window.playerData.gobs_solo;
    document.getElementById('view-gobs-assist').innerText = window.playerData.gobs_assist;
    document.getElementById('view-max-vp').innerText = window.playerData.maxVp;
    document.getElementById('view-lvl70-portal').innerText = window.playerData.lvl70_portal || "-";

    document.getElementById('view-found-legs').innerText = window.playerData.found_legs;
    document.getElementById('view-found-yellows').innerText = window.playerData.found_yellows;
    document.getElementById('view-res-n').innerText = window.playerData.res_n || 0;
    document.getElementById('view-res-dc').innerText = window.playerData.res_dc || 0;
    document.getElementById('view-res-b').innerText = window.playerData.res_b || 0;
    document.getElementById('view-res-a').innerText = window.playerData.res_a || 0;
    document.getElementById('view-reagents').innerText = window.playerData.reagents || 0;
    document.getElementById('view-death-breath').innerText = window.playerData.death_breath;

    document.getElementById('view-rank').innerText = `${window.playerData.rank} (${window.playerData.rankName})`;

    document.getElementById('view-runes-sold').innerText = window.playerData.runes_sold;
    document.getElementById('view-reputation').innerText = window.playerData.reputation;
    document.getElementById('view-deals').innerText = window.playerData.deals;
    document.getElementById('view-chests').innerText = window.playerData.chests_found;
    document.getElementById('view-steals').innerText = window.playerData.steals;
    document.getElementById('view-black-market').innerText = window.playerData.black_market;
    document.getElementById('view-zakens').innerText = window.playerData.zakens;
    
    document.getElementById('view-xp-bonus').innerText = window.playerData.xp_bonus;
    document.getElementById('view-potion-price').innerText = window.playerData.potion_price ? `(${window.playerData.potion_price})` : "";
    document.getElementById('view-zaken-discount').innerText = window.playerData.zaken_discount || "-";
    document.getElementById('view-theft-fine').innerText = window.playerData.theft_fine ? `(Штраф: ${window.playerData.theft_fine})` : "";

    document.getElementById('view-class').innerText = window.playerData.className || "Класс не выбран";
    document.getElementById('view-build').innerText = window.playerData.build ? `(${window.playerData.build})` : "";
    document.getElementById('view-guild').innerText = window.playerData.guild || "Нет";

    // Показываем все поля характеристик всегда
       document.getElementById('input-stat-str-box').style.display = 'block';
        document.getElementById('input-stat-dex-box').style.display = 'block';
        document.getElementById('input-stat-int-box').style.display = 'block';
        document.getElementById('input-stat-vit-box').style.display = 'block';
 
    window.updatePentaSlot('slot-penta-1', window.playerData.penta_1);
    window.updatePentaSlot('slot-penta-2', window.playerData.penta_2);
    window.updatePentaSlot('slot-penta-3', window.playerData.penta_3);

    localStorage.setItem('d3mod_player', JSON.stringify(window.playerData));
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
    }
    if (window.playerData.class_html) {
        document.getElementById('bonus-class-name').innerText = (window.playerData.build || "БИЛД").toUpperCase();
        document.getElementById('class-bonus-content').innerHTML = window.playerData.class_html;
        const p = document.getElementById('active-class-bonus');
        p.style.display = 'block';
        p.style.order = '1';
        p.classList.add('right-panel-bonus');
    }
}

window.toggleEditModal = function() {
    const modal = document.getElementById('edit-modal');
    if (!modal) return;
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        document.getElementById('input-name').value = window.playerData.name || "";
        
        // Выбор класса убран из книги судеб
        document.getElementById('input-class').parentElement.style.display = 'none';

        document.getElementById('input-lvl').value = window.playerData.level || 0;
        document.getElementById('input-gold-g').value = window.playerData.gold_g || 0;
        document.getElementById('input-base-kills').value = window.playerData.base_kills || 0;
        document.getElementById('input-base-elites').value = window.playerData.base_elites || 0;
        document.getElementById('input-base-kills-box').style.display = (window.playerData.base_kills > 0) ? 'none' : 'block';
        document.getElementById('input-base-elites-box').style.display = (window.playerData.base_elites > 0) ? 'none' : 'block';
        document.getElementById('input-gold-s').value = window.playerData.gold_s || 0;
        document.getElementById('input-gold-c').value = window.playerData.gold_c || 0;
        document.getElementById('input-gold-y').value = window.playerData.gold_y || 0;
        document.getElementById('input-runes').value = window.playerData.runes || 0;
        document.getElementById('input-para').value = window.playerData.para || 0;
        document.getElementById('input-potions').value = window.playerData.potions || 5;
        document.getElementById('input-stat-str').value = window.playerData.stat_str || 0;
        document.getElementById('input-stat-dex').value = window.playerData.stat_dex || 0;
        document.getElementById('input-stat-int').value = window.playerData.stat_int || 0;
        document.getElementById('input-stat-vit').value = window.playerData.stat_vit || 0;
        document.getElementById('input-kills').value = window.playerData.kills || 0;
        document.getElementById('input-elites-solo').value = window.playerData.elites_solo || 0;
        document.getElementById('input-bosses').value = window.playerData.bosses || 0;
        document.getElementById('input-gobs-solo').value = window.playerData.gobs_solo || 0;
        document.getElementById('input-gobs-assist').value = window.playerData.gobs_assist || 0;
        document.getElementById('input-max-vp').value = window.playerData.maxVp || 0;
        document.getElementById('input-lvl70-portal').value = window.playerData.lvl70_portal || "";
        document.getElementById('input-found-legs').value = window.playerData.found_legs || 0;
        document.getElementById('input-found-yellows').value = window.playerData.found_yellows || 0;
        document.getElementById('input-death-breath').value = window.playerData.death_breath || 0;
        document.getElementById('input-res-n').value = window.playerData.res_n || 0;
        document.getElementById('input-res-dc').value = window.playerData.res_dc || 0;
        document.getElementById('input-res-b').value = window.playerData.res_b || 0;
        document.getElementById('input-res-a').value = window.playerData.res_a || 0;
        document.getElementById('input-reagents').value = window.playerData.reagents || 0;
        document.getElementById('input-runes-sold').value = window.playerData.runes_sold || 0;
        document.getElementById('input-reputation').value = window.playerData.reputation || 0;
        document.getElementById('input-deals').value = window.playerData.deals || 0;
        document.getElementById('input-chests').value = window.playerData.chests_found || 0;
        document.getElementById('input-steals').value = window.playerData.steals || 0;
        document.getElementById('input-black-market').value = window.playerData.black_market || 0;
        document.getElementById('input-zakens').value = window.playerData.zakens || 0;
        
        // Показываем все поля характеристик всегда
        document.getElementById('input-stat-str-box').style.display = 'block';
        document.getElementById('input-stat-dex-box').style.display = 'block';
        document.getElementById('input-stat-int-box').style.display = 'block';
        document.getElementById('input-stat-vit-box').style.display = 'block';

        modal.style.display = 'block';
    }
}

window.toggleMusic = function() {
    const btn = document.getElementById('music-btn');
    if (window.isMusicPlaying) {
        window.audioTrack.pause();
        window.audioTrack.currentTime = 0;
        btn.innerHTML = '🎵 МУЗЫКА';
        btn.style.borderColor = '#66ccff'; btn.style.color = '#66ccff';
        window.isMusicPlaying = false;
    } else {
        window.audioTrack.play().catch(e => alert("Не удалось воспроизвести файл."));
        btn.innerHTML = '🔇 СТОП';
        btn.style.borderColor = '#ff4444'; btn.style.color = '#ff4444';
        window.isMusicPlaying = true;
    }
}

window.savePlayerData = function() {
    // 1. Сохраняем старые данные для сравнения
    const oldData = { ...window.playerData };

    // 2. Читаем новые данные из полей
    window.playerData.name = document.getElementById('input-name').value;
    window.playerData.level = parseFloat(document.getElementById('input-lvl').value) || 1;
    
    window.playerData.base_kills = parseInt(document.getElementById('input-base-kills').value) || 0;
    window.playerData.base_elites = parseInt(document.getElementById('input-base-elites').value) || 0;

    window.playerData.gold_g = parseFloat(document.getElementById('input-gold-g').value) || 0;
    window.playerData.gold_s = parseFloat(document.getElementById('input-gold-s').value) || 0;
    window.playerData.gold_c = parseFloat(document.getElementById('input-gold-c').value) || 0;
    window.playerData.gold_y = parseFloat(document.getElementById('input-gold-y').value) || 0;
    window.playerData.runes = parseFloat(document.getElementById('input-runes').value) || 0;
    window.playerData.para = parseFloat(document.getElementById('input-para').value) || 0;
    window.playerData.potions = parseInt(document.getElementById('input-potions').value) || 0;
    
    window.playerData.stat_str = parseInt(document.getElementById('input-stat-str').value) || 0;
    window.playerData.stat_dex = parseInt(document.getElementById('input-stat-dex').value) || 0;
    window.playerData.stat_int = parseInt(document.getElementById('input-stat-int').value) || 0;
    window.playerData.stat_vit = parseInt(document.getElementById('input-stat-vit').value) || 0;
    
    window.playerData.kills = parseInt(document.getElementById('input-kills').value) || 0;
    window.playerData.elites_solo = parseInt(document.getElementById('input-elites-solo').value) || 0;
    window.playerData.bosses = parseInt(document.getElementById('input-bosses').value) || 0;
    window.playerData.gobs_solo = parseInt(document.getElementById('input-gobs-solo').value) || 0;
    window.playerData.gobs_assist = parseInt(document.getElementById('input-gobs-assist').value) || 0;
    window.playerData.maxVp = parseInt(document.getElementById('input-max-vp').value) || 0;
    window.playerData.lvl70_portal = document.getElementById('input-lvl70-portal').value;

    window.playerData.found_legs = parseInt(document.getElementById('input-found-legs').value) || 0;
    window.playerData.found_yellows = parseInt(document.getElementById('input-found-yellows').value) || 0;
    window.playerData.death_breath = parseInt(document.getElementById('input-death-breath').value) || 0;
    window.playerData.res_n = parseInt(document.getElementById('input-res-n').value) || 0;
    window.playerData.res_dc = parseInt(document.getElementById('input-res-dc').value) || 0;
    window.playerData.res_b = parseInt(document.getElementById('input-res-b').value) || 0;
    window.playerData.res_a = parseInt(document.getElementById('input-res-a').value) || 0;
    window.playerData.reagents = parseInt(document.getElementById('input-reagents').value) || 0;

    window.playerData.runes_sold = parseFloat(document.getElementById('input-runes-sold').value) || 0;
    window.playerData.reputation = parseInt(document.getElementById('input-reputation').value) || 0;
    window.playerData.deals = parseInt(document.getElementById('input-deals').value) || 0;
    window.playerData.chests_found = parseInt(document.getElementById('input-chests').value) || 0;
    window.playerData.steals = parseInt(document.getElementById('input-steals').value) || 0;
    window.playerData.black_market = parseInt(document.getElementById('input-black-market').value) || 0;
    window.playerData.zakens = parseInt(document.getElementById('input-zakens').value) || 0;

    window.calculateRank();
    window.applyGuildRewards(oldData);
    window.checkGuildExitConditions();
    window.checkGuildProgression(); // Проверка на повышение
    // checkGuildExitConditions теперь также проверяет аренду, так как она вызывается здесь

    window.updateUI();
    window.toggleEditModal();
}
