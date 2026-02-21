// --- ИГРОВАЯ ЛОГИКА ---

const guildRanksMap = {
    'гильдия торговцев': ['Нет', 'Наёмник', 'Слуга', 'Присягнувший', 'Законник', 'Кровный брат', 'Кузен', 'Брат', 'Отец', 'Зам', 'Глава'],
    'охотник на гоблинов': ['Нет', 'Слушатель', 'Уведомитель', 'Душитель', 'Палач', 'Убийца', 'Истребитель', 'Вагабонд', 'Мастер', 'Ликвидатор', 'Ассасин'],
    'охотник на ☠️': ['Нет', 'Слушатель', 'Уведомитель', 'Душитель', 'Палач', 'Убийца', 'Истребитель', 'Вагабонд', 'Мастер', 'Ликвидатор', 'Ассасин'],
    'помощник охотника': ['Нет', 'Помощник', 'Помощник', 'Помощник', 'Помощник', 'Помощник', 'Помощник', 'Помощник', 'Помощник', 'Помощник', 'Помощник'],
    'вампир': ['Нет', 'Союзник', 'Начинающий', 'Странник', 'Вызывающий', 'Мистик', 'Магиус', 'Чернокнижник', 'Волшебник', 'Мастер В.', 'Архимагиус'],
    'чародей': ['Нет', 'Союзник', 'Начинающий', 'Странник', 'Вызывающий', 'Мистик', 'Магиус', 'Чернокнижник', 'Волшебник', 'Мастер В.', 'Архимагиус'],
    'ученик чародея': ['Нет', 'Ученик', 'Ученик', 'Ученик', 'Ученик', 'Ученик', 'Ученик', 'Ученик', 'Ученик', 'Ученик', 'Ученик'],
    'гэмблер': ['Нет', 'Лягуха', 'Мокроух', 'Топотун', 'Черношапка', 'Бригадир', 'Бандит', 'Занятой', 'Заправила', 'Матерый', 'Мастер'],
    'вор': ['Нет', 'Лягуха', 'Мокроух', 'Топотун', 'Черношапка', 'Бригадир', 'Бандит', 'Занятой', 'Заправила', 'Матерый', 'Мастер'],
    'воришка': ['Нет', 'Воришка', 'Воришка', 'Воришка', 'Воришка', 'Воришка', 'Воришка', 'Воришка', 'Воришка', 'Воришка', 'Воришка'],
    'искатель приключений': ['Нет', 'Мечтающий', 'Сломленный', 'Осторожный', 'Расчетливый', 'Опытный', 'Искатель', 'Мастер', 'Скрывающий', 'Видящий', 'Лидер'],
    'искатель богатства': ['Нет', 'Мечтающий', 'Сломленный', 'Осторожный', 'Расчетливый', 'Опытный', 'Искатель', 'Мастер', 'Скрывающий', 'Видящий', 'Лидер'],
    'джимми': ['Нет', 'Джимми', 'Джимми', 'Джимми', 'Джимми', 'Джимми', 'Джимми', 'Джимми', 'Джимми', 'Джимми', 'Джимми'],
    'салага': ['Нет', 'Салага', 'Салага', 'Салага', 'Салага', 'Салага', 'Салага', 'Салага', 'Салага', 'Салага', 'Салага'],
    'громила': ['Нет', 'Союзник', 'Начинающий', 'Странник', 'Меченосец', 'Протектор', 'Защитник', 'Охранитель', 'Страж', 'Победитель', 'Мастер'],
    'лорд войны': ['Нет', 'Союзник', 'Начинающий', 'Странник', 'Меченосец', 'Протектор', 'Защитник', 'Охранитель', 'Страж', 'Победитель', 'Мастер']
};

window.selectProfileItem = function(title, path, bypassConditions = false, contentOverride = null) {
    const textWindow = document.getElementById('text-window');
    const pathStr = path || document.getElementById('breadcrumb').innerText;
    const segments = pathStr.split(' > ').map(s => s.trim());

    const applySelection = () => {
        textWindow.classList.add('fly-to-bonus'); 
        // Увеличено время для завершения анимации
        setTimeout(() => {
            const fullHtml = contentOverride || document.getElementById('window-content').innerHTML;
            const cleanHtml = fullHtml.replace(/<button.*?>.*?<\/button>/g, ''); 

            if (segments.includes('Гильдии')) {
                window.playerData.guild = title;
                window.playerData.joined_level = window.playerData.level;
                window.logEvent(`Вступление в гильдию: ${title}`, 'info');
                document.getElementById('bonus-guild-name').innerText = title.toUpperCase();
                
                const temp = document.createElement('div');
                temp.innerHTML = cleanHtml;
                // Ищем блоки с плюсами и минусами более надежным способом
                const frames = Array.from(temp.querySelectorAll('div')).filter(div => 
                    (div.textContent.includes('Плюсы') || div.textContent.includes('Минусы')) &&
                    // Исключаем вложенные таблицы, если они есть внутри div (для вампира)
                    !div.querySelector('table')
                );
                let res = "";
                if (frames.length > 0) { frames.forEach(f => res += f.outerHTML); } 
                else { res = cleanHtml; }
                
                window.playerData.guild_html = res;
                document.getElementById('bonus-content').innerHTML = res;
                
                const guildPanel = document.getElementById('active-guild-bonus');
                guildPanel.style.display = 'block';
                guildPanel.style.order = '2';
                guildPanel.classList.remove('right-panel-bonus');
                void guildPanel.offsetWidth;
                guildPanel.classList.add('right-panel-bonus');
                window.makeDraggable(guildPanel);
            } 
            else if (segments.includes('Классы')) {
                if (window.isSelectingSecondBuild) {
                    // Логика второго билда
                    window.playerData.build_2 = title;
                    window.playerData.class_html_2 = cleanHtml;
                    
                    // Отрисовка второго виджета (через restorePanels или напрямую)
                    window.restorePanels();
                    window.isSelectingSecondBuild = false; // Сброс флага
                } else {
                    const clsIndex = segments.indexOf('Классы');
                    if (clsIndex !== -1 && clsIndex + 1 < segments.length) {
                        window.playerData.className = segments[clsIndex + 1];
                    }
                    window.logEvent(`Выбран класс: ${title}`, 'info');
                    window.playerData.build = title;
                    document.getElementById('bonus-class-name').innerText = title.toUpperCase();
                    window.playerData.class_html = cleanHtml;
                    document.getElementById('class-bonus-content').innerHTML = cleanHtml;
                    
                    const classPanel = document.getElementById('active-class-bonus');
                    classPanel.style.display = 'block';
                    classPanel.style.order = '1';
                    classPanel.classList.remove('right-panel-bonus');
                    void classPanel.offsetWidth;
                    classPanel.classList.add('right-panel-bonus');
                    
                    // Делаем панель перетаскиваемой
                    window.makeDraggable(classPanel);
                }
            }
            
            textWindow.style.display = 'none';
            textWindow.classList.remove('fly-to-bonus');
            window.updateUI();
            window.updateProfessionButtonState(); // Обновляем состояние кнопок если открыто окно
        }, 850);
    };

    if (segments.includes('Гильдии')) {
        const currentGuild = (window.playerData.guild || "Нет").toLowerCase();
        const newGuild = title.toLowerCase();

        if (currentGuild === newGuild) {
            window.showCustomAlert("Вы уже состоите в этой гильдии.");
            return;
        }

        if (bypassConditions) {
            applySelection();
            return;
        }

        window.attemptLeaveGuild(() => {
            checkEntryConditions();
        });
        
        function checkEntryConditions() {
                        const reqs = window.gameConfig.guildReqs;
            if (newGuild.includes('торговц')) {
                if (window.playerData.stat_vit < reqs.traders.vit) {
                    window.showCustomAlert(`❌ Для вступления требуется минимум ${reqs.traders.vit} ⛑️ (Живучести).`);
                    return;
                }
                window.showCustomConfirm(
                    `Вступить в гильдию "<span style="color:#d4af37">${title}</span>"?`,
                    () => applySelection()
                );
            }
            else if (newGuild.includes('вор') && !newGuild.includes('воришка')) {
                if (window.playerData.steals < reqs.thieves.steals) {
                    window.showCustomAlert(`❌ Для вступления нужно минимум ${reqs.thieves.steals} успешных краж (Ранг 1).`);
                    return;
                }
                window.showCustomConfirm(`Вступить в гильдию "<span style="color:#d4af37">${title}</span>"?`, () => applySelection());
            }
            else if (newGuild.includes('гэмблер')) {
                if (window.playerData.deals < reqs.gamblers.deals && window.playerData.stat_dex < reqs.gamblers.dex) {
                    window.showCustomAlert(`❌ Для вступления нужно ${reqs.gamblers.deals} сделок или ${reqs.gamblers.dex} ловкости (Ранг 1).`);
                    return;
                }
                window.showCustomConfirm(`Вступить в гильдию "<span style="color:#d4af37">${title}</span>"?`, () => applySelection());
            }
            else if (newGuild.includes('охотник на гоблинов') || newGuild.includes('охотник на ☠️')) {
                // Логика ниже
            }
            else if (newGuild.includes('искатель приключений')) {
                // Логика ниже
            }
            else if (newGuild.includes('искатель богатства')) {
                // Логика ниже
            }
            
            else if (newGuild.includes('вампир')) {
                window.showCustomConfirm(
                    "Для вступления в клан Вампиров нужно умереть.<br>Нажмите 'ДА', затем в главном меню нажмите '☠️ Я УМЕР'.",
                    () => {
                        window.pendingVampireJoin = true;
                        window.closeWindow();
                        window.showCustomAlert("Ожидание смерти...<br>Нажмите кнопку смерти в меню.");
                    }
                );
                return;
            }
            else if (newGuild.includes('чародей')) {
                if (window.playerData.stat_int < reqs.mages.int && window.playerData.para < reqs.mages.para) {
                    window.showCustomAlert(`❌ Для вступления нужно ${reqs.mages.int} интеллекта или ${reqs.mages.para} парагона (Ранг 1).`);
                    return;
                }
                window.showCustomConfirm(`Вступить в гильдию "<span style="color:#d4af37">${title}</span>"?`, () => applySelection());
            }
            else if (newGuild.includes('охотник')) {
                // Проверка условий 1 ранга (85 Репутации) для Охотников на Гоблинов и Элиту
                if ((newGuild.includes('гоблин') || newGuild.includes('на ☠️')) && window.playerData.reputation >= reqs.hunters.rep) {
                    window.showCustomConfirm(`Вступить в гильдию "<span style="color:#d4af37">${title}</span>"?<br><small>(Условие 1-го ранга выполнено)</small>`, () => applySelection());
                    return;
                }

                // For Hunters, we use the tracking system for the kill requirement
                // Goblin Hunter: Kill 1 goblin (gobs_solo)
                // Elite Hunter: Kill 5 elites (elites_solo)
                // Helper: Kill 5 elites (elites_solo)

                let condition = "";
                let rewardMsg = "";
                let rewardYen = 0;
                let rewardRep = 0;
                let rewardRunes = 0;

                if (newGuild.includes('гоблин')) { 
                    condition = "Убить гоблина самому"; 
                    rewardMsg = "Награда: 32🥉, 100🎭, 15📖";
                    rewardYen = 3200 * window.playerData.level; rewardRep = 100; rewardRunes = 15;
                }
                else if (newGuild.includes('на ☠️')) { 
                    condition = "Убить 5 элиток (за 3 награда)"; 
                    rewardMsg = `Награда: ${3 * window.playerData.level}🥉, 9🎭`;
                    rewardYen = 3 * 100 * window.playerData.level; rewardRep = 9;
                }
                else if (newGuild.includes('помощник')) { 
                    condition = "Убить 5 элиток (за всех награда)"; 
                    rewardMsg = `Награда: ${(5 * 0.5 * window.playerData.level).toFixed(1)}🥉, 15🎭`;
                    rewardYen = 5 * 50 * window.playerData.level; rewardRep = 15;
                }
                
                window.showCustomConfirm(
                    `Условие: ${condition}.<br>${rewardMsg}<br>Выполнено?`,
                    () => {
                        if (rewardYen > 0) window.addYen(rewardYen);
                        window.playerData.reputation += rewardRep;
                        window.playerData.runes += rewardRunes;
                        applySelection();
                        let alertMsg = "Добро пожаловать!<br>Награда получена:<br>";
                        if (rewardYen > 0) alertMsg += `💰 ${window.formatCurrency(rewardYen)}<br>`;
                        if (rewardRep > 0) alertMsg += `🎭 ${rewardRep} репутации<br>`;
                        if (rewardRunes > 0) alertMsg += `📖 ${rewardRunes} рун`;
                        window.showCustomAlert(alertMsg);
                    }
                );
                return;
            }
            else if (newGuild.includes('вор') || newGuild.includes('воришка')) {
                 // Проверка условий 1 ранга (7 Краж)
                 if (window.playerData.steals >= reqs.thieves.steals) {
                    window.showCustomConfirm(`Вступить в гильдию "<span style="color:#d4af37">${title}</span>"?<br><small>(Условие 1-го ранга выполнено)</small>`, () => applySelection());
                    return;
                 }

                 let count = newGuild.includes('воришка') ? 1 : 3;
                 
                 // Устанавливаем состояние ожидания вступления
                 window.pendingTheftJoin = {
                     guildTitle: title,
                     path: pathStr,
                     required: count,
                     done: 0
                 };

                 window.showCustomAlert(
                    `🔒 <b>Испытание вступления</b><br><br>Чтобы вступить в гильдию "${title}", докажите свое мастерство.<br>Украдите <b>${count}</b> предмет(а) в разделе "Экономика > Шанс кражи".<br><br>После успеха вы будете приняты автоматически.`
                 );
                 return;
            }
            else if (newGuild.includes('искатель') || newGuild.includes('джимми')) {
                // Проверка условий 1 ранга (Найденные легендарки)
                let passed = false;
                if (newGuild.includes('приключений') && window.playerData.found_legs >= reqs.explorers.legs) passed = true;
                if (newGuild.includes('богатства') && window.playerData.found_legs >= reqs.wealth.legs) passed = true;
                
                if (passed) {
                    window.showCustomConfirm(`Вступить в гильдию "<span style="color:#d4af37">${title}</span>"?<br><small>(Условие 1-го ранга выполнено)</small>`, () => applySelection());
                    return;
                }

                let r = 0;
                if (newGuild.includes('приключений')) r = 1.5;
                else if (newGuild.includes('богатства')) r = 2.0;
                else if (newGuild.includes('джимми')) r = 1.0;
                
                window.showCustomConfirm(
                    `Условие: Найти большой сундук.<br>Выполнено?`,
                    () => {
                        window.playerData.runes += r;
                        window.playerData.para += r;
                        applySelection();
                        window.showCustomAlert(`Добро пожаловать!<br>Награда: ${r} 📖 и ⏳`);
                    }
                );
                return;
            }
            else if (newGuild.includes('салага') || newGuild.includes('громила') || newGuild.includes('лорд')) {
                 // Проверка условий 1 ранга (Громила/Лорд: 1000 Силы или 500 Убийств)
                 const totalKills = window.playerData.kills + (window.playerData.base_kills || 0);
                 const str = window.playerData.stat_str;
                 
                 if ((newGuild.includes('громила') || newGuild.includes('лорд')) && (str >= reqs.brute.str || totalKills >= reqs.brute.kills)) {
                    window.showCustomConfirm(`Вступить в гильдию "<span style="color:#d4af37">${title}</span>"?<br><small>(Условие 1-го ранга выполнено)</small>`, () => applySelection());
                    return;
                 }

                 let kills = 0;
                 let mult = 0;
                 if (newGuild.includes('салага')) { kills = 150; mult = 0.88; }
                 else if (newGuild.includes('громила')) { kills = 500; mult = 1.75; }
                 else if (newGuild.includes('лорд')) { kills = 500; mult = 1.23; }

                 window.showCustomConfirm(
                    `Условие: Убить ${kills} мобов.<br>Выполнено?`,
                    () => {
                        let reward = kills * mult * window.playerData.level;
                        window.addYen(reward);
                        applySelection();
                        window.showCustomAlert(`Добро пожаловать!<br>Награда: ${window.formatCurrency(Math.floor(reward))}`);
                    }
                 );
                 return;
            }
            
            // Общее подтверждение для остальных гильдий
            window.showCustomConfirm(
                `Вступить в гильдию "<span style="color:#d4af37">${title}</span>"?`,
                () => applySelection()
            );
        }
    } 
    else if (segments.includes('Классы')) {
        // Проверка соответствия класса (ДО анимации)
        const clsIndex = segments.indexOf('Классы');
        let buildClass = "";
        if (clsIndex !== -1 && clsIndex + 1 < segments.length) {
            buildClass = segments[clsIndex + 1];
        }

        if (window.playerData.className && window.playerData.className !== "Класс не выбран") {
            if (window.playerData.className !== buildClass) {
                window.showCustomAlert(`❌ Ваш класс: <span style="color:#d4af37">${window.playerData.className}</span>.<br>Нельзя выбрать билд класса <span style="color:#ff4444">${buildClass}</span>.`);
                return;
            }
        }

        if (window.playerData.build && window.playerData.build !== "") {
            // Проверка условий для второго билда
            // 1. Прошел ВП Соло (>= 0 сложности)
            // 2. Изучено >= 3 навыков и >= 2 пассивок
            
            const activeSkillsCount = Object.values(window.playerData.learnedSkills).flat().length; // Грубый подсчет, но сойдет
            // Точнее:
            let actCount = 0;
            let passCount = 0;
            const cls = window.playerData.className;
            if (window.skillDB[cls]) {
                for (const [sName, runes] of Object.entries(window.playerData.learnedSkills)) {
                    const skillObj = window.skillDB[cls].find(s => s.name === sName);
                    if (skillObj) {
                        if (skillObj.category === "Пассивные") passCount++;
                        else actCount++;
                    }
                }
            }

            if (window.playerData.solo_vp_complete && actCount >= 3 && passCount >= 2) {
                if (window.playerData.build_2) {
                     window.showCustomAlert(`❌ У вас уже выбрано два билда.<br>1: ${window.playerData.build}<br>2: ${window.playerData.build_2}`);
                     return;
                }
                
                window.showCustomConfirm(
                    `🔓 <b>Открыт слот Второго Билда!</b><br>Выбрать "<span style="color:#66ccff">${title}</span>" как дополнительный билд?`,
                    () => {
                        window.isSelectingSecondBuild = true;
                        applySelection();
                    }
                );
            } else {
                window.showCustomAlert(`❌ Билд "<span style="color:#fff">${window.playerData.build}</span>" уже выбран.<br>Смена билда заблокирована.<br><br>Чтобы открыть <b>Второй Билд</b>, нужно:<br>1. Пройти ВП Соло (на своей сложности).<br>2. Изучить 3 активных и 2 пассивных навыка.`);
            }
            return;
        }
        applySelection();
    }
}

window.attemptLeaveGuild = function(onSuccess) {
    const currentGuild = (window.playerData.guild || "Нет").toLowerCase();
    
    if (currentGuild === "нет") {
        onSuccess();
        return;
    }

    if (currentGuild.includes('торговц')) {
        const penalty = Math.floor(window.playerData.para);
        window.showCustomConfirm(
            `Выход из Гильдии Торговцев.<br>Штраф: ${penalty} 🥇 (1 за каждый парагон).<br>Оплатить и выйти?`,
            () => {
                const penaltyYen = penalty * 1000000;
                const currentYen = window.getAllMoneyInYen();
                window.setMoneyFromYen(currentYen - penaltyYen);
                window.showCustomAlert(`Штраф оплачен. Баланс обновлен.`);
                onSuccess();
            }
        );
        return;
    }
    else if (currentGuild.includes('гэмблер')) {
        if (window.playerData.black_market < 30) {
            window.showCustomConfirm(
                `Выход из Гэмблеров.<br>Куплено < 30 закенов.<br>Штраф: 10 🔖.<br>Если закенов нет, спишется их стоимость.`,
                () => {
                    if (window.playerData.zakens >= 10) {
                        window.playerData.zakens -= 10;
                        onSuccess();
                    } else {
                        const missing = 10 - window.playerData.zakens;
                        const pricePerZaken = window.getZakenPrice(window.playerData.level);
                        const penaltyYen = missing * pricePerZaken;
                        window.playerData.zakens = 0;
                        let currentYen = window.getAllMoneyInYen();
                        window.setMoneyFromYen(currentYen - penaltyYen);
                        window.showCustomAlert(`Списано ${missing} 🔖 деньгами (~${window.formatCurrency(penaltyYen)}).`);
                        onSuccess();
                    }
                }
            );
            return;
        }
    }
    else if (currentGuild.includes('чародей') && !currentGuild.includes('ученик')) {
        if (window.playerData.runes_sold < 25) {
            window.showCustomAlert(`Нельзя покинуть Чародеев.<br>Нужно продать еще ${(25 - window.playerData.runes_sold).toFixed(1)} 📖.`);
            return;
        }
    }
    else if (currentGuild.includes('ученик чародея')) {
        const joinLvl = window.playerData.joined_level || 0;
        const reqDiff = joinLvl >= 70 ? 2 : 5;
        if (window.playerData.level < joinLvl + reqDiff) {
            window.showCustomAlert(`Нельзя покинуть Учеников.<br>Нужно пробыть в гильдии еще ${(joinLvl + reqDiff - window.playerData.level).toFixed(0)} 🌒.`);
            return;
        }
    }
    else if (currentGuild.includes('вампир')) {
        window.showCustomAlert("Покинуть клан Вампиров можно только умерев.");
        return;
    }
    onSuccess();
}

window.leaveCurrentGuild = function() {
    window.showCustomConfirm("Вы действительно хотите покинуть гильдию?", () => {
        window.attemptLeaveGuild(() => {
            window.playerData.guild = "Нет";
            window.playerData.guild_html = "";
            window.playerData.rank = 0;
            window.playerData.rankName = "";
            document.getElementById('active-guild-bonus').style.display = 'none';
            window.updateUI();
            window.closeWindow();
            window.showCustomAlert("Вы покинули гильдию.");
        });
    });
}

window.checkGuildExitConditions = function() {
    const g = (window.playerData.guild || "").toLowerCase();
    if (g.includes('чародей') && !g.includes('ученик')) {
        if (window.playerData.runes_sold >= 25) {
            window.showCustomAlert("✅ Вы выполнили условие выхода из гильдии Чародеев (продано 25+ рун).");
        }
    }
    
    // Проверка аренды самоцветов
    if (window.playerData.active_rents && window.playerData.active_rents.length > 0) {
        const currentLvl = window.playerData.level;
        const expiredRents = [];
        window.playerData.active_rents = window.playerData.active_rents.filter(rent => {
            if (currentLvl >= rent.startLvl + rent.duration) {
                expiredRents.push(rent);
                return false;
            }
            return true;
        });
        
        if (expiredRents.length > 0) {
            let msg = "⚠️ <b>Срок аренды истек:</b><br>";
            expiredRents.forEach(r => {
                msg += `💎 Ранг ${r.rank} (${r.count} шт.)<br>`;
            });
            window.showCustomAlert(msg);
        }
    }
}

window.checkGuildProgression = function() {
    const g = (window.playerData.guild || "").toLowerCase();
    
    // 1. Воришка -> Вор
    if (g.includes('воришка') && window.playerData.steals >= 7) {
        if (window.playerData.refused_thief_promotion) return false;

        window.showCustomConfirm(
            "Вы достигли мастерства! Хотите стать Вором?",
            () => {
                window.selectProfileItem('Вор', 'Гильдии > Темное Братство', true);
            },
            () => {
                window.playerData.refused_thief_promotion = true;
                window.saveToStorage();
            }
        );
        return true;
    }

    // 2. Салага -> Громила или Лорд Войны
    else if (g.includes('салага') && (window.playerData.stat_str >= window.gameConfig.guildReqs.brute.str || (window.playerData.kills + (window.playerData.base_kills || 0)) >= window.gameConfig.guildReqs.brute.kills)) {
        if (window.playerData.refused_salaga_promotion) return false;

        // Тут выбор из двух, поэтому просто уведомляем или открываем меню
        // Но по заданию нужно окно выбора. Реализуем через кастомное окно с 2 кнопками
        const modal = document.getElementById('custom-confirm-modal');
        document.getElementById('confirm-message').innerHTML = "Вы прошли обучение! Выберите путь:";
        const yesBtn = document.getElementById('confirm-yes-btn');
        const noBtn = document.getElementById('confirm-no-btn');
        const extraBtn = document.getElementById('confirm-extra-btn');
        
        noBtn.className = 'death-confirm-btn'; // Делаем вторую кнопку красной
        yesBtn.style.background = '#5a0000';
        yesBtn.style.borderColor = '#d4af37';
        noBtn.style.background = '#5a0000';
        noBtn.style.borderColor = '#d4af37';

        yesBtn.style.display = 'inline-block';
        noBtn.style.display = 'inline-block';
        yesBtn.innerText = 'Громила';
        noBtn.innerText = 'Лорд Войны';

        if (extraBtn) {
            extraBtn.style.display = 'inline-block';
            extraBtn.innerText = 'Позже';
            extraBtn.onclick = function() {
                modal.style.display = 'none';
                window.playerData.refused_salaga_promotion = true;
                window.saveToStorage();
            };
        }
        
        yesBtn.onclick = function() {
            modal.style.display = 'none';
            if (extraBtn) extraBtn.style.display = 'none';
            yesBtn.style.background = ''; yesBtn.style.borderColor = ''; // Сброс
            const data = window.gameData['comp_brute'];
            if (data && data.content) {
                document.getElementById('window-content').innerHTML = data.content;
            }
            window.selectProfileItem('Громила', 'Гильдии > Соратники', true);
        };
        
        noBtn.onclick = function() {
            modal.style.display = 'none';
            if (extraBtn) extraBtn.style.display = 'none';
            noBtn.style.background = ''; noBtn.style.borderColor = ''; // Сброс
            const data = window.gameData['comp_warlord'];
            if (data && data.content) {
                document.getElementById('window-content').innerHTML = data.content;
            }
            window.selectProfileItem('Лорд Войны', 'Гильдии > Соратники', true);
        };
        
        modal.style.display = 'block';
        return true;
    }
    // 3. Ученик чародея -> Чародей
    else if (g.includes('ученик чародея')) {
        // Условие для чародея: 1000 инты или 50 парагона
        if (!window.playerData.refused_wizard_promotion && (window.playerData.stat_int >= window.gameConfig.guildReqs.mages.int || window.playerData.para >= window.gameConfig.guildReqs.mages.para)) {
             window.showCustomConfirm(
                "Вы готовы стать полноценным Чародеем?",
                () => {
                    window.selectProfileItem('Чародей', 'Гильдии > Коллегия магов', true);
                },
                () => {
                    window.playerData.refused_wizard_promotion = true;
                    window.saveToStorage();
                }
            );
            return true;
        }
    }
    // 4. Помощник охотника -> Охотник на гоблинов или Охотник на элиту
    else if (g.includes('помощник охотника') && window.playerData.reputation >= window.gameConfig.guildReqs.hunters.rep) {
        const modal = document.getElementById('custom-confirm-modal');
        document.getElementById('confirm-message').innerHTML = "Вы заслужили доверие Охотников! Выберите специализацию:";
        const yesBtn = document.getElementById('confirm-yes-btn');
        const noBtn = document.getElementById('confirm-no-btn');
        
        noBtn.className = 'death-confirm-btn'; // Делаем вторую кнопку красной
        yesBtn.style.background = '#5a0000';
        yesBtn.style.borderColor = '#d4af37';
        noBtn.style.background = '#5a0000';
        noBtn.style.borderColor = '#d4af37';

        yesBtn.style.display = 'inline-block';
        noBtn.style.display = 'inline-block';
        yesBtn.innerText = 'Охотник на гоблинов';
        noBtn.innerText = 'Охотник на ☠️';
        
        yesBtn.onclick = function() {
            modal.style.display = 'none';
            yesBtn.style.background = ''; yesBtn.style.borderColor = ''; // Сброс
            const content = window.gameData['goblin_hunter'] ? window.gameData['goblin_hunter'].content : null;
            window.selectProfileItem('Охотник на гоблинов', 'Гильдии > Гильдия Охотников', true, content);
        };
        
        noBtn.onclick = function() {
            modal.style.display = 'none';
            noBtn.style.background = ''; noBtn.style.borderColor = ''; // Сброс
            const content = window.gameData['elite_hunter'] ? window.gameData['elite_hunter'].content : null;
            window.selectProfileItem('Охотник на ☠️', 'Гильдии > Гильдия Охотников', true, content);
        };
        
        modal.style.display = 'block';
        return true;
    }
    return false;
}

window.checkTormentReward = function() {
    const input = document.getElementById('torment-input');
    if (!input) return;
    const grLevel = parseInt(input.value);

    if (isNaN(grLevel) || grLevel < 1) {
        window.showCustomAlert("❌ Введите корректный уровень Великого Портала.");
        return;
    }

    const grToTormentMap = {
        8: 1, 12: 2, 15: 3, 17: 4, 20: 5, 25: 6,
        30: 7, 35: 8, 40: 9, 45: 10, 50: 11, 55: 12, 60: 13, 65: 14, 70: 15, 75: 16,
        80: 17, 85: 18, 90: 19, 95: 20, 100: 21, 105: 22, 110: 23, 115: 24, 120: 25, 
        125: 26, 130: 27, 135: 28, 140: 29, 145: 30, 150: 31
    };

    const tormentLevel = grToTormentMap[grLevel];

    if (!tormentLevel) {
        window.showCustomAlert(`Уровень ВП ${grLevel} не дает право на получение награды за Torment.<br><small>Награда выдается только за точные уровни ВП, открывающие новый Torment (8, 12, 15, 17, 20, 25, 30...).</small>`);
        return;
    }

    if (!window.playerData.claimed_torments) window.playerData.claimed_torments = [];

    if (window.playerData.claimed_torments.includes(tormentLevel)) {
        window.showCustomAlert(`✅ Награда за Torment ${tormentLevel} уже была получена.`);
        return;
    }

    let reward = 0;
    const baseGold = 1; // 1 gold
    reward = (grLevel <= 100) ? (baseGold * Math.pow(1.04, grLevel)) : (baseGold * Math.pow(1.05, grLevel));
    const rewardYen = Math.floor(reward * 1000000);

    window.showCustomConfirm(
        `Вы закрыли ВП ${grLevel}, что соответствует <b>Torment ${tormentLevel}</b>.<br><br>Получить награду в размере <span style="color:#ffd700">${window.formatCurrency(rewardYen)}</span>?`,
        () => {
            window.setMoneyFromYen(window.getAllMoneyInYen() + rewardYen);
            window.playerData.claimed_torments.push(tormentLevel);
            window.saveToStorage();
            window.updateUI();
            window.showCustomAlert(`✅ Награда за Torment ${tormentLevel} получена!`);
        }
    );
}

window.checkRankReward = function() {
    const rankInput = document.getElementById('rank-input');
    const grInput = document.getElementById('rank-gr-input');
    if (!rankInput || !grInput) return;

    const rank = parseInt(rankInput.value);
    const grLevel = parseInt(grInput.value);

    if (isNaN(rank) || rank < 1 || isNaN(grLevel) || grLevel < 1) {
        window.showCustomAlert("❌ Введите корректное место в рейтинге и уровень ВП.");
        return;
    }

    const allowedRanks = [600, 500, 400, 300, 200, 100, 50, 25, 10, 5, 2, 1];
    if (!allowedRanks.includes(rank)) {
        window.showCustomAlert(`❌ Награда за ${rank}-е место не предусмотрена.`);
        return;
    }

    if (!window.playerData.claimed_ranks) window.playerData.claimed_ranks = [];

    if (window.playerData.claimed_ranks.includes(rank)) {
        window.showCustomAlert(`✅ Награда за ${rank}-е место уже была получена.`);
        return;
    }

    const baseGold = 6; // 6 gold
    const multiplier = (grLevel <= 100) ? Math.pow(1.04, grLevel) : Math.pow(1.05, grLevel);
    const reward = baseGold * multiplier;
    const rewardYen = Math.floor(reward * 1000000);

    window.showCustomConfirm(
        `Вы заняли <b>${rank}-е место</b>, закрыв ВП ${grLevel}.<br><br>Получить награду в размере <span style="color:#ffd700">${window.formatCurrency(rewardYen)}</span>?`,
        () => {
            window.setMoneyFromYen(window.getAllMoneyInYen() + rewardYen);
            window.playerData.claimed_ranks.push(rank);
            window.saveToStorage();
            window.updateUI();
            window.showCustomAlert(`✅ Награда за ${rank}-е место получена!`);
        }
    );
}

window.applyGuildRewards = function(oldData) {
    const g = (window.playerData.guild || "").toLowerCase();
    const rank = window.playerData.rank || 1;
    let lvl = window.playerData.level;
    if (window.playerData.level !== oldData.level) {
        lvl = (oldData.level + window.playerData.level) / 2;
    }
    const rankMultipliers = [0, 1.5, 2.5, 4, 6, 9, 12, 15, 18, 21.5, 27];
    const rankMult = rankMultipliers[rank] || 1;

    const dKills = Math.max(0, window.playerData.kills - oldData.kills);
    const dElites = Math.max(0, window.playerData.elites_solo - oldData.elites_solo);
    const dBosses = Math.max(0, window.playerData.bosses - oldData.bosses);
    const dGobsSolo = Math.max(0, window.playerData.gobs_solo - oldData.gobs_solo);
    const dGobsAssist = Math.max(0, window.playerData.gobs_assist - oldData.gobs_assist);
    const dChests = Math.max(0, window.playerData.chests_found - oldData.chests_found);
    const dRunesSold = Math.max(0, window.playerData.runes_sold - oldData.runes_sold);

    let rewardYen = 0;
    let rewardRep = 0;
    let rewardRunes = 0;
    let rewardPara = 0;
    let msg = "";

    if (g.includes('охотник на гоблинов')) {
        if (dGobsSolo > 0) {
            rewardYen += dGobsSolo * 3200 * lvl * rankMult;
            rewardRep += dGobsSolo * 100;
            rewardRunes += dGobsSolo * 15;
        }
        if (dGobsAssist > 0) {
            rewardYen += dGobsAssist * 1000 * lvl * rankMult;
            rewardRep += dGobsAssist * 30;
            rewardRunes += dGobsAssist * 3;
        }
        if (dBosses > 0) {
            rewardYen += dBosses * 500 * lvl * rankMult;
            rewardRep += dBosses * 30;
        }
    } 
    else if (g.includes('охотник на ☠️')) {
        if (dElites > 0) {
            rewardYen += dElites * 100 * lvl * rankMult;
            rewardRep += dElites * 3;
        }
        if (dBosses > 0) {
            rewardYen += dBosses * 500 * lvl * rankMult;
            rewardRep += dBosses * 30;
        }
    }
    else if (g.includes('помощник охотника')) {
        if (dElites > 0) {
            rewardYen += dElites * 50 * lvl;
            rewardRep += dElites * 3;
        }
        if (dBosses > 0) {
            rewardYen += dBosses * 250 * lvl;
            rewardRep += dBosses * 30;
        }
    }
    
    else if (g.includes('искатель приключений')) {
        if (dChests > 0) { rewardRunes += dChests * 0.5; rewardPara += dChests * 0.5; }
    }
    else if (g.includes('искатель богатства')) {
        if (dChests > 0) { rewardRunes += dChests * 0.7; rewardPara += dChests * 0.7; }
    }
    else if (g.includes('джимми')) {
        if (dChests > 0) { rewardRunes += dChests * 0.3; rewardPara += dChests * 0.3; }
    }
    else if (g.includes('ученик чародея')) {
        if (dRunesSold > 0) {
            const basePrice = 1500;
            const bonusPercent = 15 * (window.playerData.stat_int / 100);
            const pricePerRune = basePrice * (1 + bonusPercent / 100);
            rewardYen += dRunesSold * pricePerRune;
        }
    }
    else if (g.includes('чародей') || g.includes('вампир')) {
        if (dRunesSold > 0) {
            const basePrice = 1500;
            let percentPer100Int = 27.5;
            if (g.includes('вампир')) percentPer100Int = 30;
            const bonusPercent = percentPer100Int * (window.playerData.stat_int / 100);
            const pricePerRune = basePrice * (1 + bonusPercent / 100);
            rewardYen += dRunesSold * pricePerRune;
        }
    }

    // --- NEW LOGIC FOR ITEM BREAKING ---
    let brokenItems = [];
    if (dKills > 0 && (g.includes('искатель') || g.includes('джимми'))) {
        const oldKillCount = oldData.kills || 0;
        const newKillCount = window.playerData.kills;
        
        const milestonesPassed = Math.floor(newKillCount / 100) - Math.floor(oldKillCount / 100);
        
        if (milestonesPassed > 0) {
            let breakChance = 0;
            if (g.includes('искатель приключений')) breakChance = 0.10;
            else if (g.includes('искатель богатства')) breakChance = 0.15;
            else if (g.includes('джимми')) breakChance = 0.05;

            if (breakChance > 0) {
                for (let i = 0; i < milestonesPassed; i++) {
                    if (Math.random() < breakChance) {
                        if (window.playerData.inventory && window.playerData.inventory.length > 0) {
                            const randomIndex = Math.floor(Math.random() * window.playerData.inventory.length);
                            const lostItem = window.playerData.inventory[randomIndex];
                            brokenItems.push(lostItem.name);
                            window.playerData.inventory.splice(randomIndex, 1);
                        }
                    }
                }
            }
        }
    }

    const hasRewards = rewardYen > 0 || rewardRep > 0 || rewardRunes > 0 || rewardPara > 0;
    const hasBrokenItems = brokenItems.length > 0;

    if (hasRewards || hasBrokenItems) {
        let totalYen = Math.floor(rewardYen);
        window.playerData.gold_y += totalYen;
        while (window.playerData.gold_y >= 100) { window.playerData.gold_y -= 100; window.playerData.gold_c++; }
        while (window.playerData.gold_c >= 100) { window.playerData.gold_c -= 100; window.playerData.gold_s++; }
        while (window.playerData.gold_s >= 100) { window.playerData.gold_s -= 100; window.playerData.gold_g++; }
        if (window.coinSound && totalYen > 0) { window.coinSound.currentTime = 0; window.coinSound.play().catch(e => {}); }

        window.playerData.reputation += rewardRep;
        window.playerData.runes = parseFloat((window.playerData.runes + rewardRunes).toFixed(2));
        window.playerData.para = parseFloat((window.playerData.para + rewardPara).toFixed(2));

        msg = `<span style="color:#d4af37">Отчет гильдии:</span><br>`;
        if (totalYen > 0) msg += `💰 ${window.formatCurrency(totalYen)}<br>`;
        if (rewardRep > 0) msg += `🎭 +${rewardRep} реп.<br>`;
        if (rewardRunes > 0) msg += `📖 +${rewardRunes.toFixed(1)}<br>`;
        if (rewardPara > 0) msg += `⏳ +${rewardPara.toFixed(1)}<br>`;
        
        if (hasBrokenItems) {
            if (hasRewards) msg += `<br>`;
            msg += `<span style="color:#ff4444">Сломаны предметы:</span><br>${brokenItems.join('<br>')}`;
        }

        window.showCustomAlert(msg);
    }
}

window.calculateRank = function() {
    const g = (window.playerData.guild || "").toLowerCase();
    let rank = 0;

    if (g.includes('торговц')) {
        const vit = window.playerData.stat_vit;
        if (vit >= 10000) rank = 10;
        else if (vit >= 9000) rank = 9;
        else if (vit >= 8000) rank = 8;
        else if (vit >= 7000) rank = 7;
        else if (vit >= 6000) rank = 6;
        else if (vit >= 5000) rank = 5;
        else if (vit >= 4000) rank = 4;
        else if (vit >= 3000) rank = 3;
        else if (vit >= 2000) rank = 2;
        else if (vit >= 1000) rank = 1;
    } else if (g.includes('охотник на гоблинов')) {
         const rep = window.playerData.reputation;
         if (rep >= 4000) rank = 10;
         else if (rep >= 3200) rank = 9;
         else if (rep >= 2750) rank = 8;
         else if (rep >= 2315) rank = 7;
         else if (rep >= 1870) rank = 6;
         else if (rep >= 1330) rank = 5;
         else if (rep >= 685) rank = 4;
         else if (rep >= 430) rank = 3;
         else if (rep >= 215) rank = 2;
         else if (rep >= 85) rank = 1;
    } else if (g.includes('охотник на ☠️')) {
         const rep = window.playerData.reputation;
         if (rep >= 3000) rank = 10;
         else if (rep >= 2400) rank = 9;
         else if (rep >= 2050) rank = 8;
         else if (rep >= 1715) rank = 7;
         else if (rep >= 1370) rank = 6;
         else if (rep >= 1030) rank = 5;
         else if (rep >= 685) rank = 4;
         else if (rep >= 430) rank = 3;
         else if (rep >= 215) rank = 2;
         else if (rep >= 85) rank = 1;
    } else if (g.includes('вампир') || g.includes('чародей')) {
         const int = window.playerData.stat_int;
         const para = window.playerData.para;
         if (int >= 10000 || para >= 1000) rank = 10;
         else if (int >= 9000 || para >= 900) rank = 9;
         else if (int >= 8000 || para >= 800) rank = 8;
         else if (int >= 7000 || para >= 700) rank = 7;
         else if (int >= 6000 || para >= 600) rank = 6;
         else if (int >= 5000 || para >= 450) rank = 5;
         else if (int >= 4000 || para >= 300) rank = 4;
         else if (int >= 3000 || para >= 200) rank = 3;
         else if (int >= 2000 || para >= 100) rank = 2;
         else if (int >= 1000 || para >= 50) rank = 1;
    } else if (g.includes('гэмблер')) {
         const dex = window.playerData.stat_dex;
         const deals = window.playerData.deals;
         if (dex >= 10000 || deals >= 313) rank = 10;
         else if (dex >= 9000 || deals >= 255) rank = 9;
         else if (dex >= 8000 || deals >= 210) rank = 8;
         else if (dex >= 7000 || deals >= 170) rank = 7;
         else if (dex >= 6000 || deals >= 135) rank = 6;
         else if (dex >= 5000 || deals >= 100) rank = 5;
         else if (dex >= 4000 || deals >= 70) rank = 4;
         else if (dex >= 3000 || deals >= 45) rank = 3;
         else if (dex >= 2000 || deals >= 20) rank = 2;
         else if (dex >= 1000 || deals >= 7) rank = 1;
    } else if (g.includes('вор') && !g.includes('воришка')) {
         const success = window.playerData.steals;
         if (success >= 300) rank = 10;
         else if (success >= 255) rank = 9;
         else if (success >= 210) rank = 8;
         else if (success >= 170) rank = 7;
         else if (success >= 135) rank = 6;
         else if (success >= 100) rank = 5;
         else if (success >= 70) rank = 4;
         else if (success >= 45) rank = 3;
         else if (success >= 20) rank = 2;
         else if (success >= 7) rank = 1;
    } else if (g.includes('искатель приключений')) {
         const found = window.playerData.found_legs;
         if (found >= 90) rank = 10;
         else if (found >= 73) rank = 9;
         else if (found >= 61) rank = 8;
         else if (found >= 50) rank = 7;
         else if (found >= 40) rank = 6;
         else if (found >= 31) rank = 5;
         else if (found >= 23) rank = 4;
         else if (found >= 16) rank = 3;
         else if (found >= 10) rank = 2;
         else if (found >= 5) rank = 1;
    } else if (g.includes('искатель богатства')) {
         const found = window.playerData.found_legs;
         if (found >= 135) rank = 10;
         else if (found >= 110) rank = 9;
         else if (found >= 92) rank = 8;
         else if (found >= 75) rank = 7;
         else if (found >= 60) rank = 6;
         else if (found >= 47) rank = 5;
         else if (found >= 35) rank = 4;
         else if (found >= 24) rank = 3;
         else if (found >= 15) rank = 2;
         else if (found >= 8) rank = 1;
    } else if (g.includes('громила') || g.includes('лорд войны')) {
         const str = window.playerData.stat_str;
         const kills = window.playerData.kills;
         if (str >= 10000 || kills >= 60000) rank = 10;
         else if (str >= 9000 || kills >= 48000) rank = 9;
         else if (str >= 8000 || kills >= 41000) rank = 8;
         else if (str >= 7000 || kills >= 34300) rank = 7;
         else if (str >= 6000 || kills >= 27400) rank = 6;
         else if (str >= 5000 || kills >= 20600) rank = 5;
         else if (str >= 4000 || kills >= 13700) rank = 4;
         else if (str >= 3000 || kills >= 8600) rank = 3;
         else if (str >= 2000 || kills >= 4300) rank = 2;
         else if (str >= 1000 || kills >= 1700) rank = 1;
    }

    rank = Math.min(rank, 10);
    window.playerData.rank = rank;
    
    let rankName = "Нет";
    for (const [key, ranks] of Object.entries(guildRanksMap)) {
        if (g.includes(key)) {
            rankName = ranks[rank] || "Нет";
            break;
        }
    }
    window.playerData.rankName = rankName;
    // --- Расчет бонусов для UI ---
    let xp_bonus_val = 0;
    let potion_mod = 0;
    let zaken_mod = 0;
    let theft_fine_val = "";

    if (g.includes('вампир')) {
        const ranks = [0.10, 0.13, 0.16, 0.20, 0.25, 0.40, 0.50, 0.60, 0.75, 1.00];
        xp_bonus_val = (rank > 0) ? (ranks[Math.min(rank - 1, 9)] || 0.10) : 0.10;
    } else if (g.includes('чародей') && !g.includes('ученик')) {
        const ranks = [0.15, 0.20, 0.28, 0.35, 0.50, 0.75, 1.00, 1.25, 1.50, 2.00];
        xp_bonus_val = (rank > 0) ? (ranks[Math.min(rank - 1, 9)] || 0.15) : 0.15;
        const pot_ranks = [0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 1.00];
        const p_disc = (rank > 0) ? (pot_ranks[Math.min(rank - 1, 9)] || 0.55) : 0.55;
        potion_mod = -p_disc;
    } else if (g.includes('ученик чародея')) {
        xp_bonus_val = 0.10;
        potion_mod = -0.30;
    } else if (g.includes('охотник на гоблинов')) {
        xp_bonus_val = 0.20;
    } else if (g.includes('охотник на ☠️')) {
        // Бонус 33% с элиток и боссов
        xp_bonus_val = "☠️+33% (x5 К)";
    } else if (g.includes('помощник охотника')) {
        // Бонус 15% с элиток и боссов
        xp_bonus_val = "☠️+15%";
    } else if (g.includes('гэмблер')) {
        xp_bonus_val = -0.25;
        potion_mod = 0.50;
        const buyPercents = [100, 98, 95, 92, 89, 86, 82, 80, 77, 75, 70];
        const p = buyPercents[rank] || 100;
        zaken_mod = (p - 100) / 100;
    } else if (g.includes('вор') && !g.includes('воришка')) {
        xp_bonus_val = -0.175;
        potion_mod = 0.20;
        const finePercents = [100, 98, 95, 92, 89, 86, 82, 80, 77, 75, 70];
        theft_fine_val = (finePercents[rank] || 100) + "%";
    } else if (g.includes('воришка')) {
        xp_bonus_val = -0.10;
        potion_mod = 0.10;
        theft_fine_val = "100%";
    } else if (g.includes('салага')) {
        xp_bonus_val = -0.10;
    } else if (g.includes('громила')) {
        xp_bonus_val = -0.20;
    } else if (g.includes('лорд войны')) {
        xp_bonus_val = 0.07;
    }

    // Сохраняем числовое значение скидки на зелья
    window.playerData.potion_discount_val = potion_mod;
    window.playerData.zaken_discount_val = zaken_mod;

    if (xp_bonus_val !== 0 && xp_bonus_val !== "-") {
        if (typeof xp_bonus_val === 'string') {
             window.playerData.xp_bonus = xp_bonus_val;
        } else {
            const sign = xp_bonus_val > 0 ? "+" : "";
            window.playerData.xp_bonus = `${sign}${(xp_bonus_val * 100).toFixed(0)}%`;
        }
    } else {
        window.playerData.xp_bonus = "";
    }

    if (potion_mod !== 0) {
        const sign = potion_mod > 0 ? "+" : ""; // + means more expensive (penalty), - means cheaper (discount)
        // В UI показываем просто процент изменения
        window.playerData.potion_price = `${sign}${Math.abs(potion_mod * 100).toFixed(0)}%`;
    } else {
        window.playerData.potion_price = "";
    }

    if (window.getZakenPrice) {
        const basePrice = window.getZakenPrice(window.playerData.level);
        const finalPrice = basePrice * (1 + zaken_mod);
        window.playerData.zaken_discount = `(${window.formatCurrency(Math.floor(finalPrice))})`;
    } else {
        window.playerData.zaken_discount = "";
    }

    window.playerData.theft_fine = theft_fine_val;
}

window.processDeath = function() {
    const modal = document.getElementById('death-modal');
    const content = document.getElementById('death-modal-content');
    const actions = document.getElementById('death-modal-actions');

    // Сброс позиции окна
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.zIndex = '8005';
    
    // Предварительный расчет потерь рун
    const runePenalty = Math.floor(window.playerData.para * 0.1 * 100) / 100;
    
    // Расчет штрафа гильдии для отображения
    let guildPenaltyText = "";
    const g = (window.playerData.guild || "").toLowerCase();
    
    if (g.includes('вампир')) {
        let pen = window.playerData.para * 0.1;
        if (pen > 0.5 && pen < 1) pen = 1; else pen = Math.floor(pen * 10) / 10;
        guildPenaltyText = `С шансом 90% вы обманете смерть и не понесете потерь. <br>В противном случае (10%): изгнание из клана, потеря ${runePenalty} 📖, потеря ${pen.toFixed(1)} ⏳ и 5% шанс забыть каждый навык.`;
    }
    else if (g.includes('торговц')) {
        const lostYen = Math.floor(window.getAllMoneyInYen() * 0.2);
        guildPenaltyText = `-20% Денег (${window.formatCurrency(lostYen)})`;
    }
    else if (g.includes('охотник') || g.includes('помощник')) {
        let pen = window.playerData.reputation * 0.1;
        if (pen > 0.5 && pen < 1) pen = 1; else pen = Math.floor(pen);
        guildPenaltyText = `-10% Репутации (-${pen})`;
    }
    else if (g.includes('чародей') || g.includes('ученик')) {
        let pen = window.playerData.para * 0.1;
        guildPenaltyText = `-10% Парагона (-${pen.toFixed(2)})`;
    }
    else if (g.includes('гэмблер')) {
        let pen = Math.floor(window.playerData.deals * 0.1);
        guildPenaltyText = `-10% Сделок (-${pen})`;
    }
    else if (g.includes('вор') || g.includes('воришка')) {
        let pen = Math.floor(window.playerData.steals * 0.1);
        guildPenaltyText = `-10% Краж (-${pen})`;
    }
    else if (g.includes('искатель') || g.includes('джимми')) {
        let pen = Math.floor(window.playerData.chests_found * 0.1);
        guildPenaltyText = `-10% Сундуков (-${pen})`;
    }
    else if (g.includes('салага') || g.includes('громила') || g.includes('лорд')) {
        let pen = Math.floor(window.playerData.kills * 0.1);
        guildPenaltyText = `-10% Убитых мобов (-${pen})`;
    }
    else guildPenaltyText = "Нет штрафа гильдии";

    content.innerHTML = `Вы действительно умерли?<br>
    <span style='font-size:0.9rem; color:#ff4444;'>Потеря рун: -${runePenalty} 📖</span><br>
    <span style='font-size:0.9rem; color:#aaa;'>Будет применён штраф согласно вашей гильдии: <b style="color:#d4af37">${guildPenaltyText}</b></span>`;
    
    actions.innerHTML = `
        <button class="death-confirm-btn" onclick="confirmDeath()">ДА, Я УМЕР</button>
        <button class="death-cancel-btn" onclick="document.getElementById('death-modal').style.display='none'">ОТМЕНА</button>
    `;
    modal.style.display = 'block';
}

window.processPartnerDeath = function() {
    const modal = document.getElementById('death-modal');
    const content = document.getElementById('death-modal-content');
    const actions = document.getElementById('death-modal-actions');

    // Сброс позиции окна
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.zIndex = '8005';
    
    const g = (window.playerData.guild || "").toLowerCase();
    let penaltyText = "";

    // Потеря рун для не-магов
    if (!g.includes('чародей') && !g.includes('вампир') && !g.includes('ученик')) {
        const runePenalty = (Math.floor(window.playerData.para * 0.1 * 100) / 100) / 2;
        penaltyText += `<span style='font-size:0.9rem; color:#ff4444;'>Потеря рун: -${runePenalty.toFixed(2)} 📖</span><br>`;
    }

    // Штраф гильдии
    if (g.includes('торговц')) {
        const lostYen = Math.floor(window.getAllMoneyInYen() * 0.1); // 10%
        penaltyText += `<span style='font-size:0.9rem; color:#aaa;'>Штраф гильдии: -10% Денег (${window.formatCurrency(lostYen)})</span>`;
    } else if (g.includes('охотник') || g.includes('помощник')) {
        let pen = Math.floor((window.playerData.reputation * 0.1) / 2);
        penaltyText += `<span style='font-size:0.9rem; color:#aaa;'>Штраф гильдии: -5% Репутации (-${pen})</span>`;
    } else if (g.includes('чародей') || g.includes('ученик') || g.includes('вампир')) {
        let pen = (window.playerData.para * 0.1) / 2;
        penaltyText += `<span style='font-size:0.9rem; color:#aaa;'>Штраф гильдии: -5% Парагона (-${pen.toFixed(2)})</span>`;
    } else if (g.includes('гэмблер')) {
        let pen = Math.floor(window.playerData.deals * 0.1 / 2);
        penaltyText += `<span style='font-size:0.9rem; color:#aaa;'>Штраф гильдии: -5% Сделок (-${pen})</span>`;
    } else if (g.includes('вор') || g.includes('воришка')) {
        let pen = Math.floor(window.playerData.steals * 0.1 / 2);
        penaltyText += `<span style='font-size:0.9rem; color:#aaa;'>Штраф гильдии: -5% Краж (-${pen})</span>`;
    } else if (g.includes('искатель') || g.includes('джимми')) {
        let pen = Math.floor(window.playerData.chests_found * 0.1 / 2);
        penaltyText += `<span style='font-size:0.9rem; color:#aaa;'>Штраф гильдии: -5% Сундуков (-${pen})</span>`;
    } else if (g.includes('салага') || g.includes('громила') || g.includes('лорд')) {
        let pen = Math.floor(window.playerData.kills * 0.1 / 2);
        penaltyText += `<span style='font-size:0.9rem; color:#aaa;'>Штраф гильдии: -5% Убитых мобов (-${pen})</span>`;
    }

    content.innerHTML = `Умер напарник?<br><br>${penaltyText}<br><span style='font-size:0.9rem; color:#aaa;'>Предметы не теряются.</span>`;
    
    actions.innerHTML = `
        <button class="death-confirm-btn" onclick="confirmPartnerDeath()">ПОДТВЕРДИТЬ</button>
        <button class="death-cancel-btn" onclick="document.getElementById('death-modal').style.display='none'">ОТМЕНА</button>
    `;
    modal.style.display = 'block';
}

window.confirmPartnerDeath = function() {
    const g = (window.playerData.guild || "").toLowerCase();
    
    // Маги не теряют руны при смерти напарника
    if (!g.includes('чародей') && !g.includes('вампир') && !g.includes('ученик')) {
        const runePenalty = Math.floor(window.playerData.para * 0.1 * 100) / 100 / 2; // Половина
        window.playerData.runes = window.playerData.runes - runePenalty;
    }

    // Штрафы гильдий (половина)
    if (g.includes('торговц')) {
        window.playerData.gold_g = Math.floor(window.playerData.gold_g * 0.9 * 10) / 10;
        window.playerData.gold_s = Math.floor(window.playerData.gold_s * 0.9 * 10) / 10;
        window.playerData.gold_c = Math.floor(window.playerData.gold_c * 0.9 * 10) / 10;
        window.playerData.gold_y = Math.floor(window.playerData.gold_y * 0.9 * 10) / 10;
    } else if (g.includes('охотник') || g.includes('помощник')) {
        let pen = Math.floor((window.playerData.reputation * 0.1) / 2);
        window.playerData.reputation -= pen;
    } else if (g.includes('чародей') || g.includes('ученик') || g.includes('вампир')) {
        let pen = (window.playerData.para * 0.1) / 2;
        window.playerData.para = parseFloat((window.playerData.para - pen).toFixed(2));
    } else if (g.includes('гэмблер')) { let pen = Math.floor(window.playerData.deals * 0.1 / 2); window.playerData.deals -= pen; 
    } else if (g.includes('вор') || g.includes('воришка')) { let pen = Math.floor(window.playerData.steals * 0.1 / 2); window.playerData.steals -= pen; 
    } else if (g.includes('искатель') || g.includes('джимми')) { let pen = Math.floor(window.playerData.chests_found * 0.1 / 2); window.playerData.chests_found -= pen; 
    } else if (g.includes('салага') || g.includes('громила') || g.includes('лорд')) { let pen = Math.floor(window.playerData.kills * 0.1 / 2); window.playerData.kills -= pen; }

    window.updateUI();
    document.getElementById('death-modal').style.display = 'none';
    window.showCustomAlert("⚰️ Потери от смерти напарника применены.");
}

window.confirmDeath = function() {
    const g = (window.playerData.guild || "").toLowerCase();

    // Шанс выжить для вампира
    if (g.includes('вампир') && Math.random() > 0.1) {
        window.showCustomAlert("🩸 Вы обманули смерть!");
        document.getElementById('death-modal').style.display = 'none';
        return;
    }

    // Запись смерти в историю
    if (!window.playerData.death_history) window.playerData.death_history = [];
    window.playerData.death_history.push({
        level: window.playerData.level,
        time: Date.now(),
        dateStr: new Date().toLocaleString()
    });

    if (window.pendingVampireJoin) {
        window.pendingVampireJoin = false;
        window.playerData.guild = "Вампир";
        window.playerData.joined_level = window.playerData.level;
        const vampireData = window.gameData.vampire_mage;
        const cleanHtml = vampireData.content.replace(/<button.*?>.*?<\/button>/g, '');
        
        const temp = document.createElement('div');
        temp.innerHTML = cleanHtml;
        const frames = Array.from(temp.querySelectorAll('div')).filter(div => 
            (div.textContent.includes('Плюсы') || div.textContent.includes('Минусы')) &&
            !div.querySelector('table')
        );
        let res = "";
        if (frames.length > 0) { frames.forEach(f => res += f.outerHTML); } 
        else { res = cleanHtml; }
        
        window.playerData.guild_html = res;
        document.getElementById('bonus-guild-name').innerText = "ВАМПИР";
        document.getElementById('bonus-content').innerHTML = res;
        
        const guildPanel = document.getElementById('active-guild-bonus');
        guildPanel.style.display = 'block';
        guildPanel.classList.add('right-panel-bonus');

        document.getElementById('death-modal').style.display = 'none';
        window.showCustomAlert("🩸 Вы умерли и возродились Вампиром!");
        window.updateUI();
        return;
    }

    // 1. Руны: -10% от текущего парагона
    const runePenalty = Math.floor(window.playerData.para * 0.1 * 100) / 100; 
    window.playerData.runes = window.playerData.runes - runePenalty;

    // Штраф гильдии
    if (g.includes('вампир')) {
        let pen = window.playerData.para * 0.1;
        window.playerData.para = parseFloat((window.playerData.para - pen).toFixed(2));
        window.playerData.guild = "Нет";
        window.playerData.guild_html = "";
        document.getElementById('active-guild-bonus').style.display = 'none';
    }
    
    else if (g.includes('торговц')) {
        window.playerData.gold_g = Math.floor(window.playerData.gold_g * 0.8 * 10) / 10;
        window.playerData.gold_s = Math.floor(window.playerData.gold_s * 0.8 * 10) / 10;
        window.playerData.gold_c = Math.floor(window.playerData.gold_c * 0.8 * 10) / 10;
        window.playerData.gold_y = Math.floor(window.playerData.gold_y * 0.8 * 10) / 10;
    } 
    else if (g.includes('охотник') || g.includes('помощник')) {
        let pen = window.playerData.reputation * 0.1;
        if (pen > 0.5 && pen < 1) pen = 1; else pen = Math.floor(pen);
        window.playerData.reputation -= pen;
    }
    // ... (остальные штрафы аналогично логике выше, сокращено для краткости, но логика сохранена из предыдущих итераций)
    else if (g.includes('чародей') || g.includes('ученик')) { let pen = window.playerData.para * 0.1; window.playerData.para = parseFloat((window.playerData.para - pen).toFixed(2)); }
    else if (g.includes('гэмблер')) { let pen = window.playerData.deals * 0.1; if (pen > 0.5 && pen < 1) pen = 1; else pen = Math.floor(pen); window.playerData.deals -= pen; }
    else if (g.includes('вор') || g.includes('воришка')) { let pen = window.playerData.steals * 0.1; if (pen > 0.5 && pen < 1) pen = 1; else pen = Math.floor(pen); window.playerData.steals -= pen; }
    else if (g.includes('искатель') || g.includes('джимми')) { let pen = window.playerData.chests_found * 0.1; if (pen > 0.5 && pen < 1) pen = 1; else pen = Math.floor(pen); window.playerData.chests_found -= pen; }
    else if (g.includes('салага') || g.includes('громила') || g.includes('лорд')) { let pen = window.playerData.kills * 0.1; if (pen > 0.5 && pen < 1) pen = 1; else pen = Math.floor(pen); window.playerData.kills -= pen; }

    let finalMessage = "";

    // 5% шанс забыть КАЖДЫЙ навык (включая пассивные)
    const learned = window.playerData.learnedSkills;
    let skillNames = Object.keys(learned);
    let forgottenList = [];

    skillNames.forEach(skillName => {
        if (Math.random() < 0.05) {
            // Сохраняем руны перед удалением
            if (!window.playerData.forgottenSkillRunes) window.playerData.forgottenSkillRunes = {};
            window.playerData.forgottenSkillRunes[skillName] = window.playerData.learnedSkills[skillName];

            delete window.playerData.learnedSkills[skillName];
            if (window.playerData.learnedSkillsOrder) {
                const idx = window.playerData.learnedSkillsOrder.indexOf(skillName);
                if (idx > -1) window.playerData.learnedSkillsOrder.splice(idx, 1);
            }
            window.playerData.forgottenSkills[skillName] = (window.playerData.forgottenSkills[skillName] || 0) + 1;
            forgottenList.push(skillName);
        }
    });

    if (forgottenList.length > 0) {
        finalMessage += `🧠 Амнезия! Вы забыли навыки:<br><br><span style="color:#ff4444; font-size: 1.1rem; font-weight: bold;">${forgottenList.join('<br>')}</span><br><br>`;
    }

    // Потеря предмета из инвентаря
    if (window.playerData.inventory && window.playerData.inventory.length > 0) {
        const randomIndex = Math.floor(Math.random() * window.playerData.inventory.length);
        const lostItem = window.playerData.inventory[randomIndex];
        window.playerData.inventory.splice(randomIndex, 1);
        finalMessage += `🎒 Потерян предмет из инвентаря:<br><span style="color:#ff4444; font-weight:bold;">${lostItem.name}</span><br><br>`;
    } else {
        finalMessage += `🎒 Инвентарь пуст, предметы не потеряны.<br><br>`;
    }

    window.logEvent(`СМЕРТЬ ГЕРОЯ. Потеряно: ${runePenalty} рун.`, 'death');
    window.updateUI();
    document.getElementById('death-modal').style.display = 'none';

    const grimMessages = [
        "Тьма поглотила вашу душу...",
        "Ваше путешествие окончено... на этот раз.",
        "Смерть настигла вас.",
        "Даже самый могучий нефалем смертен.",
        "Ваша история обрывается здесь."
    ];
    const randomMessage = grimMessages[Math.floor(Math.random() * grimMessages.length)];
    
    window.showCustomAlert(randomMessage + "<br><br>" + finalMessage);
}

window.claimProfessionReward = function(profNum) {
    const lvl = window.playerData.level;
    
    // Проверка уровней
    if (profNum === 1 && lvl <= 20) {
        window.showCustomAlert("❌ Доступно после 20 уровня.");
        return;
    }
    if (profNum === 2 && lvl <= 40) {
        window.showCustomAlert("❌ Доступно после 40 уровня.");
        return;
    }
    if (profNum === 3 && lvl < 70) {
        window.showCustomAlert("❌ Доступно с 70 уровня.");
        return;
    }

    // Проверка предыдущей профессии
    if (profNum > 1 && !window.playerData.professions[profNum - 1]) {
        window.showCustomAlert(`❌ Сначала получите награду за ${profNum - 1} Профессию.`);
        return;
    }

    if (window.playerData.professions[profNum]) {
        window.showCustomAlert("✅ Награда уже получена.");
        return;
    }

    // Выдача наград
    if (profNum === 1) {
        window.playerData.gold_s += 1;
        
        // Расчет опыта с учетом бонусов гильдии
        let baseRunes = 1.5;
        let basePara = 1.5;
        const g = (window.playerData.guild || "").toLowerCase();
        let mod = 1;

        if (g.includes('охотник на гоблинов')) { mod += 0.2; }
        else if (g.includes('охотник на ☠️')) { mod += 0.33; }
        else if (g.includes('помощник охотника')) { mod += 0.15; }
        else if (g.includes('ученик чародея')) { mod += 0.1; }
        else if (g.includes('чародей')) {
            const ranks = [0.15, 0.20, 0.28, 0.35, 0.50, 0.75, 1.00, 1.25, 1.50, 2.00];
            const r = (window.playerData.rank || 1) - 1;
            mod += (ranks[Math.min(r, 9)] || 0.15);
        }
        else if (g.includes('вампир')) {
            const ranks = [0.10, 0.13, 0.16, 0.20, 0.25, 0.40, 0.50, 0.60, 0.75, 1.00];
            const r = (window.playerData.rank || 1) - 1;
            mod += (ranks[Math.min(r, 9)] || 0.10);
        }
        else if (g.includes('гэмблер')) { mod -= 0.25; }
        else if (g.includes('вор') && !g.includes('воришка')) { mod -= 0.175; }
        else if (g.includes('воришка')) { mod -= 0.1; }
        else if (g.includes('салага')) { mod -= 0.1; }
        else if (g.includes('громила')) { mod -= 0.2; }
        else if (g.includes('лорд войны')) { mod += 0.07; }

        let finalRunes = baseRunes * mod;
        let finalPara = basePara * mod;

        window.playerData.runes = parseFloat((window.playerData.runes + finalRunes).toFixed(2));
        window.playerData.para = parseFloat((window.playerData.para + finalPara).toFixed(2));
        
        window.logEvent(`Получена Профессия I (+${finalRunes} рун, +${finalPara} пара)`, 'gain');
        window.showCustomAlert(`💰 Получено: 1🥈<br>⚔️ Опыт: ${finalRunes.toFixed(2)} 📖, ${finalPara.toFixed(2)} ⏳<br>🔓 Открыто: +2 Активных, +1 Пассивный слот.`);
    }
    else if (profNum === 2) {
        window.playerData.gold_s += 10;
        
        // Начисление опыта за босса (3 руны / 3 парагона) с учетом гильдии
        let bossRunes = 3;
        let bossPara = 3;
        const g = (window.playerData.guild || "").toLowerCase();
        let mod = 1;

        if (g.includes('охотник на гоблинов')) { mod += 0.2; }
        else if (g.includes('охотник на ☠️')) { bossRunes *= 1.33; bossPara *= 1.33; }
        else if (g.includes('помощник охотника')) { bossRunes *= 1.15; bossPara *= 1.15; }
        else if (g.includes('ученик чародея')) { mod += 0.1; }
        else if (g.includes('чародей')) {
            const ranks = [0.15, 0.20, 0.28, 0.35, 0.50, 0.75, 1.00, 1.25, 1.50, 2.00];
            const r = (window.playerData.rank || 1) - 1;
            mod += (ranks[Math.min(r, 9)] || 0.15);
        }
        else if (g.includes('вампир')) {
            const ranks = [0.10, 0.13, 0.16, 0.20, 0.25, 0.40, 0.50, 0.60, 0.75, 1.00];
            const r = (window.playerData.rank || 1) - 1;
            mod += (ranks[Math.min(r, 9)] || 0.10);
        }
        else if (g.includes('гэмблер')) { mod -= 0.25; }
        else if (g.includes('вор') && !g.includes('воришка')) { mod -= 0.175; }
        else if (g.includes('воришка')) { mod -= 0.1; }
        else if (g.includes('салага')) { mod -= 0.1; }
        else if (g.includes('громила')) { mod -= 0.2; }
        else if (g.includes('лорд войны')) { mod += 0.07; }

        bossRunes *= mod;
        bossPara *= mod;

        window.playerData.runes = parseFloat((window.playerData.runes + bossRunes).toFixed(2));
        window.playerData.para = parseFloat((window.playerData.para + bossPara).toFixed(2));

        window.logEvent(`Получена Профессия II (+${bossRunes} рун, +${bossPara} пара)`, 'gain');
        window.showCustomAlert(`💰 Получено: 10🥈<br>⚔️ Опыт за босса: ${bossRunes.toFixed(2)} 📖, ${bossPara.toFixed(2)} ⏳<br>🔓 Открыто: +2 Активных, +1 Пассивный слот.`);
    }
    else if (profNum === 3) {
        if (!window.playerData.solo_vp_complete) {
            window.showCustomAlert("❌ Для получения профессии нужно пройти ВП Соло (Сложность +0 или выше).");
            return;
        }
        window.logEvent(`Получена Профессия III`, 'gain');
        window.showCustomAlert("🔓 Открыто: +1 Активный, +2 Пассивных слота.<br>💍 Кольца с боссов теперь ваши!");
    }

    if (window.coinSound) { window.coinSound.currentTime = 0; window.coinSound.play().catch(e => {}); }
    
    // Сохраняем прогресс
    window.playerData.professions[profNum] = true;
    window.saveToStorage();
    window.updateUI();
    
    // Обновляем кнопку
    if (window.updateProfessionButtonState) window.updateProfessionButtonState();
}

window.updateProfessionButtonState = function() {
    // Ищем кнопки в открытом окне text-window
    const content = document.getElementById('window-content');
    if (!content) return;

    const btns = content.querySelectorAll('.claim-reward-btn');
    btns.forEach(btn => {
        let profNum = 0;
        if (btn.onclick.toString().includes('claimProfessionReward(1)')) profNum = 1;
        if (btn.onclick.toString().includes('claimProfessionReward(2)')) profNum = 2;
        if (btn.onclick.toString().includes('claimProfessionReward(3)')) profNum = 3;

        if (profNum > 0) {
            const lvl = window.playerData.level;
            let isLocked = false;
            if (profNum === 1 && lvl <= 20) isLocked = true;
            if (profNum === 2 && lvl <= 40) isLocked = true;
            if (profNum === 3 && lvl < 70) isLocked = true;

            if (window.playerData.professions[profNum]) {
                btn.innerText = "✅ ПОЛУЧЕНО";
                btn.disabled = true;
                btn.style.opacity = "0.5";
            } else if (isLocked) {
                btn.innerText = `🔒 Требуется ур. ${profNum === 1 ? 21 : (profNum === 2 ? 41 : 70)}`;
                btn.disabled = true;
                btn.style.opacity = "0.5";
                btn.style.borderColor = "#555";
            } else if (profNum === 3 && !window.playerData.solo_vp_complete) {
                btn.innerText = "🔒 Требуется ВП Соло (+0)";
                btn.disabled = true;
                btn.style.opacity = "0.5";
                btn.style.borderColor = "#555";
            } else {
                btn.disabled = false;
                btn.style.opacity = "1";
            }
        }
    });
}

window.togglePentagram = function(id) {
    const el = document.getElementById(id);
    if (el) {
        window.playerData[id] = el.checked;
        window.updateUI();
    }
}

window.d3Bosses = [
    "Мясник", "Магда", "Золтун Кулл", "Белиал", 
    "Кхом", "Штурмовой зверь", "Азмодан", 
    "Раканот", "Диабло", "Урзаэль", "Адрия", "Малтаэль"
];

window.randomizePentaBoss = function(slot) {
    const boss = window.d3Bosses[Math.floor(Math.random() * window.d3Bosses.length)];
    window.playerData[`penta_${slot}_boss`] = boss;
    window.playerData[`penta_${slot}`] = true; // Активируем вкладку (слот в сайдбаре)
    window.saveToStorage();
    
    // Обновляем UI (перерисовка окна через showText не нужна, обновим элементы точечно и весь UI)
    const bossSpan = document.getElementById(`penta-boss-${slot}`);
    const btn = document.getElementById(`btn-penta-${slot}`);
    
    // Расчет сложности
    const currentDiff = window.playerData.difficulty || "Высокий";
    const diffOrder = window.difficultyOrder || [];
    const currentIndex = diffOrder.indexOf(currentDiff);
    let targetDiff = currentDiff;
    if (currentIndex !== -1) {
        const offset = slot - 1; 
        const targetIndex = Math.min(currentIndex + offset, diffOrder.length - 1);
        targetDiff = diffOrder[targetIndex];
    }

    window.playerData[`penta_${slot}_diff`] = targetDiff; // Сохраняем сложность
    window.saveToStorage();

    if (bossSpan) bossSpan.innerHTML = `Убить: ${boss} <span style="color:#d4af37">(${targetDiff})</span>`;
    if (btn) btn.style.display = 'none';
    
    window.updateUI();
}

window.handleSecondLifeClick = function(skillName) {
    // Проверка наличия средств
    const g = (window.playerData.guild || "").toLowerCase();
    if (window.playerData.runes < 10 && window.playerData.para < 10) {
        window.showCustomAlert(`❌ Недостаточно средств для оплаты Второй Жизни!<br>Нужно 10 📖 или 10 ⏳.<br><br><b style="color:#ff4444">СМЕРТЬ НЕИЗБЕЖНА.</b>`);
        window.confirmDeath(); // Автоматическая смерть
        return;
    }

    window.showCustomConfirm(
        `Сработала пассивка "${skillName}"?<br>Необходимо оплатить 10 📖 или 10 ⏳.`,
        () => {
            const modal = document.getElementById('custom-confirm-modal');
            const msg = document.getElementById('confirm-message');
            const btn1 = document.getElementById('confirm-yes-btn');
            const btn2 = document.getElementById('confirm-no-btn');

            msg.innerHTML = "Выберите валюту для оплаты:";
            
            btn1.innerText = "10 📖 (Руны)";
            btn1.onclick = function() {
                if (window.playerData.runes >= 10) {
                    window.playerData.runes = parseFloat((window.playerData.runes - 10).toFixed(2));
                    window.updateUI();
                    modal.style.display = 'none';
                    window.showCustomAlert("✅ Оплачено 10 📖.");
                } else {
                    window.showCustomAlert("❌ Недостаточно рун!");
                }
            };

            btn2.innerText = "10 ⏳ (Парагон)";
            
            // Сброс состояния перед проверкой
            btn2.disabled = false;
            btn2.style.opacity = "1";
            btn2.title = "";
            
            // Торговцы не могут платить парагоном
            if (g.includes('торговц')) {
                btn2.disabled = true;
                btn2.innerText = "10 ⏳ (Недоступно)";
                btn2.style.opacity = "0.5";
                btn2.title = "Торговцы не могут платить парагоном";
            }

            btn2.onclick = function() {
                if (window.playerData.para >= 10) {
                    window.playerData.para = parseFloat((window.playerData.para - 10).toFixed(2));
                    window.updateUI();
                    modal.style.display = 'none';
                    window.showCustomAlert("✅ Оплачено 10 ⏳.");
                } else {
                    window.showCustomAlert("❌ Недостаточно парагона!");
                }
            };

            modal.style.display = 'block';
        }
    );
}
