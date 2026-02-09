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

window.selectProfileItem = function(title, path, bypassConditions = false) {
    const textWindow = document.getElementById('text-window');
    const pathStr = path || document.getElementById('breadcrumb').innerText;
    const segments = pathStr.split(' > ').map(s => s.trim());

    const applySelection = () => {
        textWindow.classList.add('fly-to-bonus'); 
        // Увеличено время для завершения анимации
        setTimeout(() => {
            const fullHtml = document.getElementById('window-content').innerHTML;
            const cleanHtml = fullHtml.replace(/<button.*?>.*?<\/button>/g, ''); 

            if (segments.includes('Гильдии')) {
                window.playerData.guild = title;
                window.playerData.joined_level = window.playerData.level;
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
            } 
            else if (segments.includes('Классы')) {
                const clsIndex = segments.indexOf('Классы');
                if (clsIndex !== -1 && clsIndex + 1 < segments.length) {
                    window.playerData.className = segments[clsIndex + 1];
                }
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
            }
            
            textWindow.style.display = 'none';
            textWindow.classList.remove('fly-to-bonus');
            window.updateUI();
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
            if (newGuild.includes('торговц')) {
                if (window.playerData.stat_vit < 1000) {
                    window.showCustomAlert("❌ Для вступления требуется минимум 1000 ⛑️ (Живучести).");
                    return;
                }
                window.showCustomConfirm(
                    `Вступить в гильдию "<span style="color:#d4af37">${title}</span>"?`,
                    () => applySelection()
                );
            }
            else if (newGuild.includes('вор') && !newGuild.includes('воришка')) {
                if (window.playerData.steals < 7) {
                    window.showCustomAlert("❌ Для вступления нужно минимум 7 успешных краж (Ранг 1).");
                    return;
                }
                window.showCustomConfirm(`Вступить в гильдию "<span style="color:#d4af37">${title}</span>"?`, () => applySelection());
            }
            else if (newGuild.includes('гэмблер')) {
                if (window.playerData.deals < 7 && window.playerData.stat_dex < 1000) {
                    window.showCustomAlert("❌ Для вступления нужно 7 сделок или 1000 ловкости (Ранг 1).");
                    return;
                }
                window.showCustomConfirm(`Вступить в гильдию "<span style="color:#d4af37">${title}</span>"?`, () => applySelection());
            }
            else if (newGuild.includes('охотник на гоблинов') || newGuild.includes('охотник на ☠️')) {
                if (window.playerData.reputation < 85) {
                    window.showCustomAlert("❌ Для вступления нужно 85 репутации (Ранг 1).");
                    return;
                }
                // Далее идет стандартная логика с условием убийства, она ниже по коду
            }
            else if (newGuild.includes('искатель приключений')) {
                if (window.playerData.found_legs < 5) {
                    window.showCustomAlert("❌ Для вступления нужно найти 5 легендарок (Ранг 1).");
                    return;
                }
                // Далее стандартная логика
            }
            else if (newGuild.includes('искатель богатства')) {
                if (window.playerData.found_legs < 8) {
                    window.showCustomAlert("❌ Для вступления нужно найти 8 легендарок (Ранг 1).");
                    return;
                }
                // Далее стандартная логика
            }
            
            else if (newGuild.includes('вампир')) {
                if (window.playerData.stat_int < 1000 && window.playerData.para < 50) {
                    window.showCustomAlert("❌ Для вступления нужно 1000 интеллекта или 50 парагона (Ранг 1).");
                    return;
                }
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
                if (window.playerData.stat_int < 1000 && window.playerData.para < 50) {
                    window.showCustomAlert("❌ Для вступления нужно 1000 интеллекта или 50 парагона (Ранг 1).");
                    return;
                }
                window.showCustomConfirm(`Вступить в гильдию "<span style="color:#d4af37">${title}</span>"?`, () => applySelection());
            }
            else if (newGuild.includes('охотник')) {
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
                        if (rewardYen > 0) {
                            window.playerData.gold_y += rewardYen;
                            while (window.playerData.gold_y >= 100) { window.playerData.gold_y -= 100; window.playerData.gold_c++; }
                            while (window.playerData.gold_c >= 100) { window.playerData.gold_c -= 100; window.playerData.gold_s++; }
                            while (window.playerData.gold_s >= 100) { window.playerData.gold_s -= 100; window.playerData.gold_g++; }
                            if (window.coinSound) { window.coinSound.currentTime = 0; window.coinSound.play().catch(e => {}); }
                        }
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
                 let count = newGuild.includes('воришка') ? 1 : 3;
                 window.showCustomConfirm(
                    `Условие: Украсть ${count} предмет(а).<br>Выполнено?`,
                    () => {
                        window.playerData.steals += count;
                        applySelection();
                        window.showCustomAlert(`Добро пожаловать!<br>Добавлено ${count} в украденное.`);
                    }
                 );
                 return;
            }
            else if (newGuild.includes('искатель') || newGuild.includes('джимми')) {
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
                 let kills = 0;
                 if ((newGuild.includes('громила') || newGuild.includes('лорд')) && window.playerData.stat_str < 1000 && window.playerData.kills < 1700) {
                     window.showCustomAlert("❌ Для вступления нужно 1000 силы или 1700 убийств (Ранг 1).");
                     return;
                 }
                 let mult = 0;
                 if (newGuild.includes('салага')) { kills = 150; mult = 0.88; }
                 else if (newGuild.includes('громила')) { kills = 500; mult = 1.75; }
                 else if (newGuild.includes('лорд')) { kills = 1500; mult = 1.23; }

                 window.showCustomConfirm(
                    `Условие: Убить ${kills} мобов.<br>Выполнено?`,
                    () => {
                        let reward = kills * mult * window.playerData.level;
                        // Начисление денег
                        window.playerData.gold_y += reward;
                        while (window.playerData.gold_y >= 100) { window.playerData.gold_y -= 100; window.playerData.gold_c++; }
                        while (window.playerData.gold_c >= 100) { window.playerData.gold_c -= 100; window.playerData.gold_s++; }
                        while (window.playerData.gold_s >= 100) { window.playerData.gold_s -= 100; window.playerData.gold_g++; }
                        
                        if (window.coinSound) { window.coinSound.currentTime = 0; window.coinSound.play().catch(e => {}); }
                        
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
            window.showCustomConfirm(
                `У вас уже выбран билд "<span style="color:#fff">${window.playerData.build}</span>".<br>Сменить его на "<span style="color:#66ccff">${title}</span>"?`,
                applySelection
            );
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
        window.showCustomConfirm(
            "Вы достигли мастерства! Хотите стать Вором?",
            () => {
                window.selectProfileItem('Вор', 'Гильдии > Темное Братство', true);
            }
        );
    }
    // 2. Салага -> Громила или Лорд Войны
    else if (g.includes('салага') && window.playerData.kills >= 500) {
        // Тут выбор из двух, поэтому просто уведомляем или открываем меню
        // Но по заданию нужно окно выбора. Реализуем через кастомное окно с 2 кнопками
        const modal = document.getElementById('custom-confirm-modal');
        document.getElementById('confirm-message').innerHTML = "Вы прошли обучение! Выберите путь:";
        const yesBtn = document.getElementById('confirm-yes-btn');
        const noBtn = document.getElementById('confirm-no-btn');
        
        noBtn.className = 'death-confirm-btn'; // Делаем вторую кнопку красной
        yesBtn.style.display = 'inline-block';
        noBtn.style.display = 'inline-block';
        yesBtn.innerText = 'Громила';
        noBtn.innerText = 'Лорд Войны';
        
        yesBtn.onclick = function() {
            modal.style.display = 'none';
            window.selectProfileItem('Громила', 'Гильдии > Соратники', true);
        };
        
        noBtn.onclick = function() {
            modal.style.display = 'none';
            window.selectProfileItem('Лорд Войны', 'Гильдии > Соратники', true);
        };
        
        modal.style.display = 'block';
    }
    // 3. Ученик чародея -> Чародей
    else if (g.includes('ученик чародея')) {
        // Условие для чародея: 1000 инты или 50 парагона
        if (window.playerData.stat_int >= 1000 || window.playerData.para >= 50) {
             window.showCustomConfirm(
                "Вы готовы стать полноценным Чародеем?",
                () => {
                    window.selectProfileItem('Чародей', 'Гильдии > Коллегия магов', true);
                }
            );
        }
    }
    // 4. Помощник охотника -> Охотник на гоблинов или Охотник на элиту
    else if (g.includes('помощник охотника') && window.playerData.reputation >= 85) {
        const modal = document.getElementById('custom-confirm-modal');
        document.getElementById('confirm-message').innerHTML = "Вы заслужили доверие Охотников! Выберите специализацию:";
        const yesBtn = document.getElementById('confirm-yes-btn');
        const noBtn = document.getElementById('confirm-no-btn');
        
        noBtn.className = 'death-confirm-btn'; // Делаем вторую кнопку красной
        yesBtn.style.display = 'inline-block';
        noBtn.style.display = 'inline-block';
        yesBtn.innerText = 'Охотник на гоблинов';
        noBtn.innerText = 'Охотник на ☠️';
        
        yesBtn.onclick = function() {
            modal.style.display = 'none';
            window.selectProfileItem('Охотник на гоблинов', 'Гильдии > Гильдия Охотников', true);
        };
        
        noBtn.onclick = function() {
            modal.style.display = 'none';
            window.selectProfileItem('Охотник на ☠️', 'Гильдии > Гильдия Охотников', true);
        };
        
        modal.style.display = 'block';
    }
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
    else if (g.includes('салага')) {
        if (dKills > 0) rewardYen += dKills * 0.88 * lvl;
    }
    else if (g.includes('громила')) {
        if (dKills > 0) rewardYen += dKills * 1.75 * lvl * rankMult;
    }
    else if (g.includes('лорд войны')) {
        if (dKills > 0) rewardYen += dKills * 1.23 * lvl * rankMult;
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

    if (rewardYen > 0 || rewardRep > 0 || rewardRunes > 0 || rewardPara > 0) {
        let totalYen = Math.floor(rewardYen);
        window.playerData.gold_y += totalYen;
        while (window.playerData.gold_y >= 100) { window.playerData.gold_y -= 100; window.playerData.gold_c++; }
        while (window.playerData.gold_c >= 100) { window.playerData.gold_c -= 100; window.playerData.gold_s++; }
        while (window.playerData.gold_s >= 100) { window.playerData.gold_s -= 100; window.playerData.gold_g++; }
        if (window.coinSound) { window.coinSound.currentTime = 0; window.coinSound.play().catch(e => {}); }

        window.playerData.reputation += rewardRep;
        window.playerData.runes = parseFloat((window.playerData.runes + rewardRunes).toFixed(2));
        window.playerData.para = parseFloat((window.playerData.para + rewardPara).toFixed(2));

        msg = `<span style="color:#d4af37">Награда гильдии:</span><br>`;
        if (totalYen > 0) msg += `💰 ${window.formatCurrency(totalYen)}<br>`;
        if (rewardRep > 0) msg += `🎭 +${rewardRep} реп.<br>`;
        if (rewardRunes > 0) msg += `📖 +${rewardRunes.toFixed(1)}<br>`;
        if (rewardPara > 0) msg += `⏳ +${rewardPara.toFixed(1)}<br>`;
        
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
        potion_mod = -0.55;
    } else if (g.includes('ученик чародея')) {
        xp_bonus_val = 0.10;
        potion_mod = -0.30;
    } else if (g.includes('охотник на гоблинов')) {
        xp_bonus_val = 0.20;
    } else if (g.includes('охотник на ☠️')) {
        // Бонус 33% с элиток и боссов
        xp_bonus_val = "☠️+33%";
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

    if (xp_bonus_val !== 0 && xp_bonus_val !== "-") {
        if (typeof xp_bonus_val === 'string') {
             window.playerData.xp_bonus = xp_bonus_val;
        } else {
            const sign = xp_bonus_val > 0 ? "+" : "";
            window.playerData.xp_bonus = `${sign}${(xp_bonus_val * 100).toFixed(1)}%`;
        }
    } else {
        window.playerData.xp_bonus = "-";
    }

    if (potion_mod !== 0) {
        const sign = potion_mod > 0 ? "+" : "";
        window.playerData.potion_price = `${sign}${Math.abs(potion_mod * 100)}%`;
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
