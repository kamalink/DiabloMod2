// --- КАЛЬКУЛЯТОРЫ И МЕХАНИКИ ---

window.openSkillCalculator = function() {
    const modal = document.getElementById('skill-calc-modal');
    const classSelect = document.getElementById('calc-class-select');
    
    // Сброс позиции окна, чтобы оно всегда появлялось по центру
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';

    classSelect.innerHTML = '';
    const playerClass = window.playerData.className;

    // Если у игрока выбран класс и он есть в базе навыков
    if (playerClass && window.skillDB[playerClass] && playerClass !== "Класс не выбран") {
        classSelect.innerHTML = `<option value="${playerClass}">${playerClass}</option>`;
        classSelect.value = playerClass;
    } else {
        // Иначе показываем все (например, для тестов или если класс не выбран)
        classSelect.innerHTML = '<option value="" disabled selected>Выберите класс</option>';
        for (let cls in window.skillDB) {
            classSelect.innerHTML += `<option value="${cls}">${cls}</option>`;
        }
    }
    
    window.updateCalcSkills();
    modal.style.display = 'block';
}

window.updateCalcSkills = function() {
    const cls = document.getElementById('calc-class-select').value;
    const skillSelect = document.getElementById('calc-skill-select');
    skillSelect.innerHTML = '';
    
    if (window.skillDB[cls]) {
        const allSkills = window.skillDB[cls].map((skill, index) => ({ ...skill, originalIndex: index }));
        
        const activeSkills = allSkills.filter(s => s.category !== "Пассивные");
        const passiveSkills = allSkills.filter(s => s.category === "Пассивные");

        // Сортировка активных навыков по категориям
        const categoryOrder = {
            "Основное": 1, "Вспомогательное": 2, "Сила": 3, 
            "Мастерство": 4, "Защита": 5, "Чары": 6, "Тактика": 7, "Другое": 99
        };
        activeSkills.sort((a, b) => {
            const orderA = categoryOrder[a.category || "Другое"] || 99;
            const orderB = categoryOrder[b.category || "Другое"] || 99;
            if (orderA !== orderB) return orderA - orderB;
            return a.name.localeCompare(b.name, 'ru');
        });

        let html = '';

        // Группа активных навыков
        if (activeSkills.length > 0) {
            html += `<optgroup label="АКТИВНЫЕ НАВЫКИ">`;
            let lastCategory = null;
            activeSkills.forEach(skill => {
                const cat = skill.category || "Другое";
                if (cat !== lastCategory) {
                    html += `<option disabled>&nbsp;&nbsp;[${cat}]</option>`;
                    lastCategory = cat;
                }
                html += `<option value="${skill.originalIndex}">&nbsp;&nbsp;&nbsp;&nbsp;${skill.name}</option>`;
            });
            html += `</optgroup>`;
        }

        // Группа пассивных навыков
        if (passiveSkills.length > 0) {
            html += `<optgroup label="ПАССИВНЫЕ НАВЫКИ">`;
            passiveSkills.sort((a, b) => a.name.localeCompare(b.name, 'ru')).forEach(skill => {
                html += `<option value="${skill.originalIndex}">${skill.name}</option>`;
            });
            html += `</optgroup>`;
        }

        skillSelect.innerHTML = html;
    }
    window.updateCalcRunes();
}

window.updateCalcRunes = function() {
    const cls = document.getElementById('calc-class-select').value;
    const skillIdx = document.getElementById('calc-skill-select').value;
    const runeSelect = document.getElementById('calc-rune-select');
    runeSelect.innerHTML = '';

    if (cls && window.skillDB[cls] && window.skillDB[cls][skillIdx]) {
        const runes = window.skillDB[cls][skillIdx].runes;
        runes.forEach((rune, index) => {
            runeSelect.innerHTML += `<option value="${index}">${rune.name}</option>`;
        });
    }
    window.loadCalcSkillData();
}

window.loadCalcSkillData = function() {
    const cls = document.getElementById('calc-class-select').value;
    const skillIdx = document.getElementById('calc-skill-select').value;
    const runeIdx = document.getElementById('calc-rune-select').value;
    
    const buyBtn = document.querySelector('.buy-skill-btn');
    const detailsP = document.getElementById('calc-details');
    
    if (cls && window.skillDB[cls] && window.skillDB[cls][skillIdx]) {
        const skillName = window.skillDB[cls][skillIdx].name;
        const runeName = window.skillDB[cls][skillIdx].runes[runeIdx].name;
        if (window.playerData.learnedSkills[skillName] && window.playerData.learnedSkills[skillName].includes(runeName)) {
            buyBtn.innerText = "ИЗУЧЕНО";
            buyBtn.disabled = true;
            buyBtn.style.background = "#333";
            buyBtn.style.color = "#aaa";
            buyBtn.style.border = "1px solid #555"; // Убираем зеленую рамку
            buyBtn.style.display = "inline-block";
        } else {
            buyBtn.innerText = "ИЗУЧИТЬ";
            buyBtn.disabled = false;
            buyBtn.style.background = ""; // Reset to CSS default
            buyBtn.style.color = "";
            buyBtn.style.display = "inline-block";

            // Логика для базовой руны: если изучена любая другая руна этого навыка, кнопку убираем
            if (runeIdx == 0) {
                const learnedRunes = window.playerData.learnedSkills[skillName];
                if (learnedRunes && learnedRunes.length > 0) {
                    buyBtn.style.display = "none";
                }
            }
            
            // Счетчик забытых
            const forgottenCount = window.playerData.forgottenSkills[skillName] || 0;
            if (forgottenCount > 0) {
                buyBtn.innerHTML += ` <span style="font-size:0.6rem; color:#888;">(забыт ${forgottenCount} раз)</span>`;
            }
        }
    }

    if (cls && window.skillDB[cls] && window.skillDB[cls][skillIdx]) {
        const runeData = window.skillDB[cls][skillIdx].runes[runeIdx];
        if (runeData) {
            document.getElementById('calc-dmg').innerText = runeData.dmg || 0;
            
            let aoeVal = runeData.aoe || 1;
            if (aoeVal === 2.5) {
                if (cls === 'Чародей' || cls === 'Колдун') aoeVal = 1.6;
                else if (cls === 'Охотник на демонов') aoeVal = 1.9;
            }
            
            let aoeText = `x${aoeVal}`;
            if (aoeVal === 1) aoeText = "Одиночная (х1)";
            else if (aoeVal === 1.3) aoeText = "Малая группа (х1.3)";
            else if (aoeVal === 1.5) aoeText = "Линия (х1.5)";
            else if (aoeVal === 1.75) aoeText = "Конус (х1.75)";
            else if (aoeVal === 1.9) {
                if (cls === 'Охотник на демонов') aoeText = "В любую точку (х1.9)";
                else aoeText = "Средняя (х1.9)";
            }
            else if (aoeVal === 2) aoeText = "Вокруг (х2)";
            else if (aoeVal === 2.5) aoeText = "В любую точку (х2.5)";
            else if (aoeVal === 1.6) aoeText = "В любую точку (х1.6)";

            document.getElementById('calc-aoe').innerText = aoeText;
            document.getElementById('calc-aoe').dataset.value = aoeVal;

            document.getElementById('calc-slow').innerText = runeData.slow || 0;
            document.getElementById('calc-stun').innerText = runeData.stun || 0;
            document.getElementById('calc-heal').innerText = runeData.heal || 0;
            document.getElementById('calc-buff-dmg').innerText = runeData.buffDmg || 0;
            document.getElementById('calc-buff-def').innerText = runeData.buffDef || 0;
            document.getElementById('calc-eff-inc').innerText = runeData.effInc || 0;
            document.getElementById('calc-res-gain').innerText = runeData.resGain || 0;
            document.getElementById('calc-buff-perm').value = runeData.buffPerm ? "true" : "false";
            document.getElementById('calc-buff-duration').value = runeData.buffDuration || 0;
            document.getElementById('calc-dmg-amp').value = runeData.dmgAmp || 0;
            document.getElementById('calc-cost-red-flat').value = runeData.costRedFlat || 0;
            document.getElementById('calc-dmg-2').value = runeData.dmg2 || 0;
            document.getElementById('calc-aoe-2').value = runeData.aoe2 || 1;
            
            const skillName = window.skillDB[cls][skillIdx].name;
            const runeName = window.skillDB[cls][skillIdx].runes[runeIdx].name;
            
            document.getElementById('calc-skill-cost-box').style.display = (runeName === "Призма" || runeName === "Сила бури") ? 'block' : 'none';
            
            const synergyBox = document.getElementById('calc-synergy-box');
            if (runeData.dmgAmp > 0) {
                synergyBox.style.display = 'block';
                const synSelect = document.getElementById('calc-synergy-skill');
                
                synSelect.innerHTML = '<option value="">-- Выберите навык --</option>';
                window.skillDB[cls].forEach((s, i) => {
                    s.runes.forEach((r, ri) => {
                        if (r.dmg > 0) {
                            // Фильтрация по стихии, если указана в elemSynergy
                            if (runeData.elemSynergy && !r.name.includes(runeData.elemSynergy)) return;
                            
                            // Фильтрация по КД (для Ускоренного восстановления)
                            if (runeData.synergyCD) {
                                const desc = (r.desc || "").toLowerCase();
                                if (!desc.includes("время восстановления") && !desc.includes("кд")) return;
                            }

                            synSelect.innerHTML += `<option value="${i}-${ri}">${s.name} - ${r.name} (${r.dmg}%)</option>`;
                        }
                    });
                });
            } else {
                synergyBox.style.display = 'none';
            }
        } else {
            document.getElementById('calc-skill-cost-box').style.display = 'none';
            document.getElementById('calc-synergy-box').style.display = 'none';
        }
    }
    window.calculateSkillCost();
}

// Вспомогательная функция для расчета стоимости руны из БД
window.calculateRuneCostFromDB = function(className, skillIdx, runeIdx) {
    if (!window.skillDB[className] || !window.skillDB[className][skillIdx]) return { cost: 0, details: [] };
    
    const runeData = window.skillDB[className][skillIdx].runes[runeIdx];
    if (!runeData) return { cost: 0, details: [] };

    const isPassive = window.skillDB[className][skillIdx].category === "Пассивные";

    const dmg = runeData.dmg || 0;
    let aoeMult = runeData.aoe || 1;
    
    // Если пассивка, принудительно ставим AOE "В любую точку"
    if (isPassive) {
        if (className === 'Чародей' || className === 'Колдун') aoeMult = 1.6;
        else if (className === 'Охотник на демонов') aoeMult = 1.9;
        else aoeMult = 2.5;
    } else if (aoeMult === 2.5) {
        if (className === 'Чародей' || className === 'Колдун') aoeMult = 1.6;
        else if (className === 'Охотник на демонов') aoeMult = 1.9;
    }

    const slow = runeData.slow || 0;
    const stun = runeData.stun || 0;
    const heal = runeData.heal || 0;
    const buffDmg = runeData.buffDmg || 0;
    const buffDef = runeData.buffDef || 0;
    const effInc = runeData.effInc || 0;
    const resGain = runeData.resGain || 0;
    const isBuffPerm = runeData.buffPerm || false;
    const buffDuration = runeData.buffDuration || 0;
    const dmgAmp = runeData.dmgAmp || 0;
    const costRedFlat = runeData.costRedFlat || 0;
    const dmg2 = runeData.dmg2 || 0;
    let aoe2 = runeData.aoe2 || 1;
    const isSynergyCD = runeData.synergyCD || false;
    const isBuffAoe = runeData.buffIsAoe || false;
    const defType = runeData.defType || "";
    const passiveDmg = runeData.passiveDmg || 0;
    const passiveSlow = runeData.passiveSlow || 0;
    
    // Для синергии и снижения затрат берем значения из UI, так как они зависят от выбора пользователя
    const mainSkillCost = parseFloat(document.getElementById('calc-main-skill-cost').value) || 0;
    const synVal = document.getElementById('calc-synergy-skill').value;
    
    const meleeClasses = ["Варвар", "Монах", "Крестоносец"];
    const rangedClasses = ["Чародей", "Колдун", "Охотник на демонов"];
    const isMelee = meleeClasses.includes(className);
    const isRanged = rangedClasses.includes(className);
    
    let controlMult = 1;
    let slowMult = 1;

    if (isMelee) { controlMult = 2.5; slowMult = 0; }
    else if (isRanged) { slowMult = 1.5; }

    let cost = 0;
    let details = [];

    let totalEffInc = effInc;
    if (costRedFlat > 0 && mainSkillCost > costRedFlat) {
        let newCost = mainSkillCost - costRedFlat;
        let ratio = mainSkillCost / newCost;
        let addedEff = (ratio - 1) * 100;
        totalEffInc += addedEff;
        details.push(`Эфф. от сниж. затрат (${mainSkillCost} -> ${newCost}): +${addedEff.toFixed(1)}%`);
    }

    // Парсинг КД для скидки на урон
    let cooldown = 0;
    if (!runeData.noCdDiscount) {
        const descText = runeData.desc || "";
        let cdMatch = descText.match(/(?:Время восстановления|КД)[^0-9]*(\d+(?:\.\d+)?) сек/i);
        
        // Fallback: если в текущей руне нет КД, ищем в базовой (индекс 0)
        if (!cdMatch && runeIdx != 0) {
            const baseRune = window.skillDB[className][skillIdx].runes[0];
            if (baseRune && baseRune.desc) {
                cdMatch = baseRune.desc.match(/(?:Время восстановления|КД)[^0-9]*(\d+(?:\.\d+)?) сек/i);
            }
        }

        if (cdMatch) {
            cooldown = parseFloat(cdMatch[1]);
        }
    }
    const cdDiscount = 1 + (cooldown * 0.1);

    if (dmg > 0) {
        let baseDmgCost = (dmg / 100) * 2 * aoeMult;
        
        // Применяем скидку за КД
        if (cooldown > 0) baseDmgCost /= cdDiscount;

        let finalDmgCost = baseDmgCost;
        let formula = `Урон (${dmg}% / 100 * 2 [База] * ${aoeMult} [AOE])`;
        
        if (cooldown > 0) formula += ` / ${cdDiscount.toFixed(1)} [КД]`;

        if (totalEffInc > 0) {
            formula += ` * (1 + ${totalEffInc.toFixed(0)}%/100 [Эфф])`;
            finalDmgCost = baseDmgCost * (1 + totalEffInc / 100);
        }
        
        cost += finalDmgCost;
        details.push(`${formula} = ${finalDmgCost.toFixed(2)}`);
    }

    if (dmg2 > 0) {
        if (aoe2 === 2.5) {
            if (className === "Чародей" || className === "Колдун") aoe2 = 1.6;
            else if (className === "Охотник на демонов") aoe2 = 1.9;
        }

        let dmg2Cost = (dmg2 / 100) * 2 * aoe2;

        // Применяем скидку за КД и ко второму урону
        if (cooldown > 0) dmg2Cost /= cdDiscount;
        
        if (totalEffInc > 0) {
            dmg2Cost = dmg2Cost * (1 + totalEffInc / 100);
            details.push(`Доп. Урон (${dmg2}%${cooldown > 0 ? ' / ' + cdDiscount.toFixed(1) + ' [КД]' : ''}) * (1 + ${totalEffInc.toFixed(0)}% [Эфф]) = ${dmg2Cost.toFixed(2)}`);
        } else {
            details.push(`Доп. Урон (${dmg2}% / 100 * 2 [База] * ${aoe2} [AOE]${cooldown > 0 ? ' / ' + cdDiscount.toFixed(1) + ' [КД]' : ''}) = ${dmg2Cost.toFixed(2)}`);
        }
        
        cost += dmg2Cost;
    }

    // Пассивный урон (без скидки за КД)
    if (passiveDmg > 0) {
        let val = (passiveDmg / 100) * 2; // Считаем как одиночную цель (питомец)
        cost += val;
        details.push(`Пассивный Урон (${passiveDmg}% / 100 * 2) = ${val.toFixed(2)}`);
    }

    // Пассивное замедление (без скидки за КД, считается как постоянная аура)
    if (passiveSlow > 0) {
        let baseVal = (passiveSlow / 20) * 4; // x4 за постоянство
        let val = baseVal * slowMult; // Учитываем классовый множитель (0 для мили)
        cost += val;
        let formula = `Пассивное Замедл. (${passiveSlow}% / 20 * 4 [Пост])`;
        if (slowMult !== 1) formula += ` * ${slowMult} [Класс]`;
        details.push(`${formula} = ${val.toFixed(2)}`);
    }

    if (slow > 0) { 
        let baseSlowCost = slow / 20;
        let val = baseSlowCost * aoeMult * slowMult;
        cost += val; 
        let formula = `Замедл (${slow}% / 20 [База])`;
        if (aoeMult !== 1) formula += ` * ${aoeMult} [AOE]`;
        if (slowMult !== 1) formula += ` * ${slowMult} [Класс]`;
        details.push(`${formula} = ${val.toFixed(2)}`); 
    }
    if (stun > 0) { 
        let val = stun * aoeMult * controlMult;
        cost += val; 
        let formula = `Стан (${stun}с * 1 [Цена/с])`;
        if (aoeMult !== 1) formula += ` * ${aoeMult} [AOE]`;
        if (controlMult !== 1) formula += ` * ${controlMult} [Класс]`;
        details.push(`${formula} = ${val.toFixed(2)}`); 
    }

    if (heal > 0) { 
        let val = (heal / 5) * 2;
        
        // Применяем скидку за КД к лечению (для активных навыков типа Выносливого союзника)
        if (cooldown > 0) val /= cdDiscount;

        let desc = `Лечение/Щит (${heal}% / 5 [База] * 2 [Множ])`;
        
        if (cooldown > 0) desc += ` / ${cdDiscount.toFixed(1)} [КД]`;

        if (isBuffAoe) {
            val *= 0.75;
            desc += ` * 0.75 [Командный]`;
            
            let costFor2nd = val / 3;
            if (dmg === 0 && dmg2 === 0 && totalEffInc > 0) {
                costFor2nd *= (1 + totalEffInc / 100);
            }
            
            cost += val;
            details.push(`${desc} = ${val.toFixed(2)}`);
            details.push(`<span style="color:#ff7979; font-weight:bold; margin-left:10px;">👤 2-й игрок платит: ${costFor2nd.toFixed(2)} 📖</span>`);
        } else {
            cost += val; 
            details.push(`${desc} = ${val.toFixed(2)}`); 
        }
    }

    if (buffDmg > 0) { 
        let multiplier = isBuffPerm ? 4 : 2;
        
        // Спец. правило для пассивок: 20% = 10 рун (1% = 0.5 рун)
        // Базовая формула (buffDmg / 10) * X. Значит X = 5.
        if (isPassive) multiplier = 5;

        let val = (buffDmg / 10) * multiplier;
        // Для пассивок применяем AOE множитель к баффу урона
        if (isPassive) val *= aoeMult;
        cost += val; 
        let formula = "";
        if (isPassive) {
            formula = `Бафф Урона (${buffDmg}% * 0.5 [Пассивка])`;
        } else {
            formula = `Бафф Урона (${buffDmg}% / 10 [База] * ${multiplier} [Тип])`;
        }
        if (isPassive) formula += ` * ${aoeMult} [AOE]`;
        details.push(`${formula} = ${val.toFixed(2)}`); 
    }

    // Обработка нескольких баффов защиты (buffDef, buffDef2, buffDef3)
    const defBuffs = [
        { val: runeData.buffDef || 0, type: runeData.defType || "" },
        { val: runeData.buffDef2 || 0, type: runeData.defType2 || "" },
        { val: runeData.buffDef3 || 0, type: runeData.defType3 || "" }
    ];

    defBuffs.forEach((buff, idx) => {
        if (buff.val > 0) {
            let multiplier = 1;
            if (isBuffPerm) multiplier = 4;
            else if (buffDuration >= 10 && buffDuration <= 20) multiplier = 2;
            else multiplier = 1;

            // Спец. правило для пассивок: 20% = 15 рун (1% = 0.75 рун)
            if (isPassive) multiplier = 3.75;

            let val = (buff.val / 5) * multiplier;

            // Множители типа защиты
            let typeMult = 1;
            let typeName = "";
            
            if (buff.type === "res") {
                if (className === "Чародей" || className === "Колдун") typeMult = 1;
                else typeMult = 1.5;
                typeName = " [Сопрот]";
            } else if (buff.type === "armor") {
                if (className === "Варвар" || className === "Крестоносец") typeMult = 1;
                else typeMult = 1.5;
                typeName = " [Броня]";
            } else if (buff.type === "dodge") {
                if (className === "Монах" || className === "Охотник на демонов") typeMult = 1;
                else typeMult = 1.5;
                typeName = " [Уклон]";
            }

            val *= typeMult;
            
            // Если бафф защиты массовый (или дебафф врагов), применяем AOE
            // Множитель AOE для стоимости защиты отключен по просьбе (только разделение цены)
            if (isBuffAoe) {
                // Правило 75/25: Владелец платит 75%
                val *= 0.75;
            }

            cost += val; 
            let desc = "";
            if (isPassive) {
                desc = `Бафф Защиты ${idx+1} (${buff.val}% * 0.75 [Пассивка]${typeMult > 1 ? ' * ' + typeMult + typeName : ''})`;
            } else {
                desc = `Бафф Защиты ${idx+1} (${buff.val}% / 5 [База] * ${multiplier} [Тип]${typeMult > 1 ? ' * ' + typeMult + typeName : ''})`;
            }
            if (isBuffAoe) {
                desc += ` * 0.75 [Командный]`;
                
                // Расчет стоимости для второго игрока (25%)
                // val - это 75%. Полная цена = val / 0.75. 2-й игрок платит 25% от полной (или 1/3 от val).
                let costFor2nd = val / 3;

                // Если будет применена общая эффективность (нет урона), учитываем её и для второго игрока
                if (dmg === 0 && dmg2 === 0 && totalEffInc > 0) {
                    costFor2nd *= (1 + totalEffInc / 100);
                }

                details.push(`${desc} = ${val.toFixed(2)}`);
                details.push(`<span style="color:#ff7979; font-weight:bold; margin-left:10px;">👤 2-й игрок платит: ${costFor2nd.toFixed(2)} 📖</span>`);
            } else {
                details.push(`${desc} = ${val.toFixed(2)}`); 
            }
        }
    });

    const maxResources = {
        "Чародей": 100,
        "Колдун": 750,
        "Монах": 250,
        "Варвар": 100,
        "Крестоносец": 100,
        "Охотник на демонов": 125
    };
    if (resGain > 0 && maxResources[className]) {
        const maxRes = maxResources[className];
        const resGainPercent = (resGain / maxRes) * 100;
        let val = (resGainPercent / 2) * 1;

        cost += val;
        let formula = `Восст. ресурса (${resGain} / ${maxRes} [Макс] / 2% [База])`;
        details.push(`${formula} = ${val.toFixed(2)}`);
    }

    if (runeData.customCost !== undefined) {
        let cc = runeData.customCost;
        let desc = runeData.customCostDesc || `Доп. эффект`;
        
        if (isBuffAoe && cc > 0) {
            let val = cc * 0.75;
            cost += val;
            details.push(`${desc}: ${cc} * 0.75 [Командный] = ${val.toFixed(2)}`);
            
            let costFor2nd = val / 3;
            if (dmg === 0 && dmg2 === 0 && totalEffInc > 0) {
                costFor2nd *= (1 + totalEffInc / 100);
            }
            details.push(`<span style="color:#ff7979; font-weight:bold; margin-left:10px;">👤 2-й игрок платит: ${costFor2nd.toFixed(2)} 📖</span>`);
        } else {
            cost += cc;
            details.push(`${desc}: ${cc}`);
        }
    }

    // Специальная логика для Архонта - Замедление времени
    const skillName = window.skillDB[className][skillIdx].name;
    const runeName = window.skillDB[className][skillIdx].runes[runeIdx].name;
    if (skillName === "Архонт" && runeName.includes("Замедление времени")) {
        const slowTimeLearned = window.playerData.learnedSkills["Замедление времени"];
        if (!slowTimeLearned || slowTimeLearned.length === 0) {
            cost += 7.20;
            details.push(`Вкл. навык "Замедление времени" (не изучен): 7.20`);
        }
    }

    if (dmgAmp > 0) {
        if (synVal) {
            const [sIdx, rIdx] = synVal.split('-');
            const targetRune = window.skillDB[className][sIdx].runes[rIdx];
            
            const tDmg = targetRune.dmg || 0;
            let tAoe = targetRune.aoe || 1;
            if (tAoe === 2.5) {
                if (className === "Чародей" || className === "Колдун") tAoe = 1.6;
                else if (className === "Охотник на демонов") tAoe = 1.9;
            }

            if (tDmg > 0) {
                const targetCost = (tDmg / 100) * 2 * tAoe;
                
                if (isSynergyCD) {
                    // Расчет для Ускоренного восстановления (только эффективность)
                    const addedCost = targetCost * (dmgAmp / 100);
                    cost += addedCost;
                    details.push(`Эффективность КД: ${targetCost.toFixed(2)} [Цена цели] * ${dmgAmp}% = ${addedCost.toFixed(2)}`);
                } else {
                    // Стандартная синергия (Урон + Бафф)
                    let multiplier = 1;
                    if (isBuffPerm) multiplier = 4;
                    else if (buffDuration >= 10 && buffDuration <= 20) multiplier = 2;

                    const part1 = targetCost * (dmgAmp / 100);
                    const part2 = (dmgAmp / 10) * multiplier;
                    const addedCost = part1 + part2;
                    
                    cost += addedCost;
                    details.push(`Синергия: (${targetCost.toFixed(2)} [Цена цели] * ${dmgAmp}% [Усил]) + (${(dmgAmp/10*multiplier).toFixed(1)} [Бафф]) = ${addedCost.toFixed(2)}`);
                }
            }
        } else {
            details.push(`<span style="color:#ff4444">⚠️ Выберите навык для расчета синергии!</span>`);
        }
    }

    if (dmg === 0 && dmg2 === 0 && totalEffInc > 0) {
        let oldCost = cost;
        cost = cost * (1 + totalEffInc / 100);
        details.push(`Общая Эфф.: ${oldCost.toFixed(2)} * (1 + ${totalEffInc.toFixed(0)}%/100 [Эфф]) = ${cost.toFixed(2)}`);
    }
    
    // --- ПРАВИЛО ДОП. НАВЫКОВ (3-я Профа / 2-й Билд) ---
    // Если изучено >= 6 активных или >= 4 пассивных, цена х1.3
    let actCount = 0;
    let passCount = 0;
    if (window.playerData.learnedSkills) {
        for (const [sName, runes] of Object.entries(window.playerData.learnedSkills)) {
            // Ищем навык в БД чтобы понять категорию
            const skillObj = window.skillDB[className].find(s => s.name === sName);
            if (skillObj) {
                if (skillObj.category === "Пассивные") passCount++;
                else actCount++;
            }
        }
    }

    if ((!isPassive && actCount >= 6) || (isPassive && passCount >= 4)) {
        let oldCost = cost;
        cost *= 1.3;
        details.push(`<span style="color:#ffcc00">⚠️ Доп. навык (Лимит превышен): ${oldCost.toFixed(2)} * 1.3 = ${cost.toFixed(2)}</span>`);
    }

    return { cost: cost, details: details };
}

window.calculateSkillCost = function() {
    const className = document.getElementById('calc-class-select').value;
    const skillIdx = document.getElementById('calc-skill-select').value;
    const runeIdx = document.getElementById('calc-rune-select').value;

    if (!className || skillIdx === '' || runeIdx === '') return;

    // 1. Считаем полную стоимость выбранной руны
    const currentCalc = window.calculateRuneCostFromDB(className, skillIdx, runeIdx);
    let finalCost = currentCalc.cost;
    let details = currentCalc.details;

    // 2. Проверяем, изучена ли хоть одна руна этого навыка
    const skillName = window.skillDB[className][skillIdx].name;
    const learnedRunes = window.playerData.learnedSkills[skillName];
    const isAnyRuneLearned = learnedRunes && learnedRunes.length > 0;

    // 3. Если навык уже открыт (изучена любая руна), вычитаем стоимость базовой версии
    if (isAnyRuneLearned) {
        const baseCalc = window.calculateRuneCostFromDB(className, skillIdx, 0);
        // Базовая руна обычно не имеет синергии/снижения затрат в контексте "базы", 
        // поэтому расчет через DB (где эти поля из UI могут быть пустыми или дефолтными) приемлем.
        if (baseCalc.cost > 0) {
            finalCost = Math.max(0, finalCost - baseCalc.cost);
            details.push(`<br><span style="color:#66ff66">✅ Скидка за изученный навык: -${baseCalc.cost.toFixed(2)}</span>`);
        }
    }

    document.getElementById('calc-result').innerText = finalCost.toFixed(2);
    document.getElementById('calc-details').innerHTML = details.join('<br>') || "Нет параметров";
}

window.buySkill = function() {
    const cost = parseFloat(document.getElementById('calc-result').innerText);
    const className = document.getElementById('calc-class-select').value;
    const skillIdx = document.getElementById('calc-skill-select').value;
    const runeIdx = document.getElementById('calc-rune-select').value;

    if (!className || skillIdx === '' || runeIdx === '') {
        window.showCustomAlert("⚠️ Сначала выберите класс, навык и руну.");
        return;
    }

    // Проверка синергии
    const runeData = window.skillDB[className][skillIdx].runes[runeIdx];
    if (runeData.dmgAmp > 0) {
        const synVal = document.getElementById('calc-synergy-skill').value;
        if (!synVal) {
            window.showCustomAlert("⚠️ Выберите навык для синергии!");
            return;
        }
    }

    if (!window.playerData.className || window.playerData.className === "Класс не выбран") {
        window.showCustomAlert("⚠️ Сначала выберите класс (билд) в меню Классов.");
        return;
    }

    if (window.playerData.className && window.playerData.className !== "Класс не выбран") {
        if (window.playerData.className !== className) {
             window.showCustomAlert(`❌ Вы не можете изучить навык класса <span style="color:#d4af37">${className}</span>.<br><br>Ваш класс: <span style="color:#66ccff">${window.playerData.className}</span>.`);
             return;
        }
    }

    // --- DEBUG VALIDATION ---
    const validationError = window.validateSkillCost(className, skillIdx, runeIdx);
    if (validationError) {
        window.showCustomConfirm(
            `⚠️ Обнаружена потенциальная ошибка в расчетах!<br><br><span style="color:#ffcc00;">${validationError}</span><br><br>Продолжить покупку?`,
            () => proceedWithPurchase()
        );
    } else {
        proceedWithPurchase();
    }
}

function proceedWithPurchase() {
    const cost = parseFloat(document.getElementById('calc-result').innerText);
    const className = document.getElementById('calc-class-select').value;
    const skillIdx = document.getElementById('calc-skill-select').value;
    const runeIdx = document.getElementById('calc-rune-select').value;

    const skillName = window.skillDB[className][skillIdx].name;
    const runeName = window.skillDB[className][skillIdx].runes[runeIdx].name;

    if (window.playerData.learnedSkills[skillName] && window.playerData.learnedSkills[skillName].includes(runeName)) {
        window.showCustomAlert(`✅ Навык "${skillName} (${runeName})" уже изучен.`);
        return;
    }

    // --- ПРОВЕРКА ЛИМИТА НАВЫКОВ (ПРОФЕССИИ) ---
    // База: 1 активный
    // Профа 1: +2 (Итого 3)
    // Профа 2: +2 (Итого 5)
    // Профа 3: +1 (Итого 6)
    // Доп. правило: После 3-й профы можно +1 Актив (Итого 7) и +1 Пассив (Итого 5)
    
    let maxActive = 1;
    if (window.playerData.professions[1]) maxActive += 2;
    if (window.playerData.professions[2]) maxActive += 2;
    if (window.playerData.professions[3]) maxActive += 2; // +1 обычный +1 доп = +2

    let maxPassive = 0; // База? В D3 пассивки открываются по уровням.
    // В моде: Профа 1 (+1), Профа 2 (+1), Профа 3 (+2) = 4.
    // Доп правило: +1 Пассив после 3 профы = 5.
    if (window.playerData.professions[1]) maxPassive += 1;
    if (window.playerData.professions[2]) maxPassive += 1;
    if (window.playerData.professions[3]) maxPassive += 3; // +2 обычных +1 доп = +3

    // Считаем текущие
    let currentActive = 0;
    let currentPassive = 0;
    const skillObj = window.skillDB[className][skillIdx];
    const isPassive = skillObj.category === "Пассивные";

    for (const [sName, runes] of Object.entries(window.playerData.learnedSkills)) {
        const s = window.skillDB[className].find(sk => sk.name === sName);
        if (s) {
            if (s.category === "Пассивные") currentPassive++;
            else currentActive++;
        }
    }

    // Если навык новый, проверяем лимит
    if (!window.playerData.learnedSkills[skillName]) {
        if (isPassive && currentPassive >= maxPassive) {
            window.showCustomAlert(`❌ Достигнут лимит пассивных навыков (${currentPassive}/${maxPassive}).`);
            return;
        }
        if (!isPassive && currentActive >= maxActive) {
            window.showCustomAlert(`❌ Достигнут лимит активных навыков (${currentActive}/${maxActive}).`);
            return;
        }
    }

    if (isNaN(cost) || cost < 0) { 
        window.showCustomAlert("⚠️ Стоимость навыка не рассчитана.");
        return;
    }
    
    if (window.playerData.runes >= cost) {
        window.showCustomConfirm(
            `Изучить "${skillName} (${runeName})" за <span style="color:#fff">${cost}</span> 📖?<br><br>У вас останется: ${(window.playerData.runes - cost).toFixed(1)} 📖`,
            () => {
                window.playerData.runes = parseFloat((window.playerData.runes - cost).toFixed(1));
                
                if (!window.playerData.learnedSkills[skillName]) {
                    window.playerData.learnedSkills[skillName] = [];
                }
                window.playerData.learnedSkills[skillName].push(runeName);

                window.saveToStorage();
                window.updateUI();
                window.showCustomAlert("✅ Навык успешно изучен!");
                
                // Обновляем кнопку сразу
                const buyBtn = document.querySelector('.buy-skill-btn');
                buyBtn.innerText = "ИЗУЧЕНО";
                buyBtn.disabled = true;
                buyBtn.style.background = "#333";
                buyBtn.style.color = "#aaa";
                buyBtn.style.border = "1px solid #555";
            }
        );
    } else {
        window.showCustomAlert(`❌ Недостаточно рун!<br><br>Нужно: <span style="color:#ff4444">${cost}</span> 📖<br>У вас: <span style="color:#66ccff">${window.playerData.runes}</span> 📖`);
    }
}

// Вспомогательная функция для форматирования валюты
window.formatCurrency = function(yen) {
    let m = Math.floor(yen / 100000000);
    let remainder = yen % 100000000;
    let g = Math.floor(remainder / 1000000);
    remainder = remainder % 1000000;
    let s = Math.floor(remainder / 10000);
    remainder = remainder % 10000;
    let c = Math.floor(remainder / 100);
    let y = remainder % 100;

    let parts = [];
    if (m > 0) parts.push(`${m}💠`);
    if (g > 0) parts.push(`${g}🥇`);
    if (s > 0) parts.push(`${s}🥈`);
    if (c > 0) parts.push(`${c}🥉`);
    if (y > 0 || parts.length === 0) parts.push(`${y}🧧`);

    return parts.join(' ');
}

window.openExpCalculator = function() {
    const modal = document.getElementById('exp-calc-modal');
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';

    document.getElementById('exp-calc-modal').style.display = 'block';
    document.getElementById('exp-mobs').value = 0;
    document.getElementById('exp-elites').value = 0;
    document.getElementById('exp-bosses').value = 0;
    
    // Сброс и настройка чекбокса контракта
    const contractLabel = document.getElementById('exp-contract-label');
    const contractCheck = document.getElementById('exp-contract-check');
    if (contractLabel && contractCheck) {
        contractCheck.checked = false;
        const g = (window.playerData.guild || "").toLowerCase();
        if (g.includes('громила') || g.includes('лорд войны')) {
            contractLabel.style.display = 'inline-block';
        } else {
            contractLabel.style.display = 'none';
        }
    }
    
    // Сброс и настройка полей сундуков
    const chestRow = document.getElementById('exp-chests-row');
    const bigChestRow = document.getElementById('exp-big-chests-row');
    if (chestRow) { chestRow.style.display = 'none'; document.getElementById('exp-chests').value = 0; }
    if (bigChestRow) { bigChestRow.style.display = 'none'; document.getElementById('exp-big-chests').value = 0; }

    const g = (window.playerData.guild || "").toLowerCase();
    
    // Логика отображения полей
    const bossRow = document.getElementById('exp-bosses').parentNode;
    if (window.activeRiftMultiplier !== null && window.riftSuccess === false) {
        bossRow.style.display = 'none';
        document.getElementById('exp-bosses').value = 0;
    } else {
        bossRow.style.display = 'flex';
    }

    const mobsRow = document.getElementById('exp-mobs').parentNode;
    if (g.includes('торговц')) {
        mobsRow.style.display = 'none';
    } else {
        mobsRow.style.display = 'flex';
    }

    if (g.includes('искатель') || g.includes('джимми')) {
        if (chestRow) chestRow.style.display = 'flex';
        if (bigChestRow) bigChestRow.style.display = 'flex';
    }

    window.calculateExp();
}

window.calculateExp = function() {
    const mobs = parseInt(document.getElementById('exp-mobs').value) || 0;
    const elites = parseInt(document.getElementById('exp-elites').value) || 0;
    const bosses = parseInt(document.getElementById('exp-bosses').value) || 0;
    const chests = parseInt(document.getElementById('exp-chests') ? document.getElementById('exp-chests').value : 0) || 0;
    const bigChests = parseInt(document.getElementById('exp-big-chests') ? document.getElementById('exp-big-chests').value : 0) || 0;

    // Считаем разницу от последнего введенного
    const dMobs = Math.max(0, mobs - (window.playerData.last_input_mobs || 0));
    const dElites = Math.max(0, elites - (window.playerData.last_input_elites || 0));
    // Боссы считаются как есть (вводятся за раз)

    // Отображение убийств напарника
    const partnerKillsEl = document.getElementById('exp-partner-kills');
    if (window.partnerData && window.partnerData.last_kills !== undefined) {
        partnerKillsEl.style.display = 'inline';
        partnerKillsEl.innerText = `(Нап: ${window.partnerData.last_kills})`;
    }
    // Сундуки считаются как есть (вводятся за раз)

    let runesBase = (dMobs * 0.01) + (dElites * 0.1) + (bosses * 3);
    let paraBase = (dMobs * 0.01) + (dElites * 0.1) + (bosses * 3);
    let chestsRunes = 0;
    let chestsPara = 0;

    // Применяем множитель рифта
    let riftMult = 1;
    if (window.activeRiftExpMultiplier !== undefined && window.activeRiftExpMultiplier !== null) {
        riftMult = window.activeRiftExpMultiplier;
    } else if (window.activeRiftMultiplier) {
        riftMult = window.activeRiftMultiplier;
    }

    if (riftMult !== 1) {
        runesBase *= riftMult;
        paraBase *= riftMult;
    }

    const g = (window.playerData.guild || "").toLowerCase();
    let runesMod = 1;
    let paraMod = 1;

    if (g.includes('торговц')) {
        runesBase = (dElites * 0.1) + (bosses * 3);
        paraBase = (dElites * 0.1) + (bosses * 3);
    } else if (g.includes('охотник на гоблинов')) {
        runesMod += 0.2; paraMod += 0.2;
    } else if (g.includes('охотник на ☠️')) {
        const eliteBossBase = (dElites * 0.1) + (bosses * 3);
        const bonus = eliteBossBase * 0.33;
        runesBase += bonus; paraBase += bonus;
    } else if (g.includes('помощник охотника')) {
        const eliteBossBase = (dElites * 0.1) + (bosses * 3);
        const bonus = eliteBossBase * 0.15;
        runesBase += bonus; paraBase += bonus;
    } else if (g.includes('ученик чародея')) {
        runesMod += 0.1; paraMod += 0.1;
    } else if (g.includes('вампир')) {
        const ranks = [0.10, 0.13, 0.16, 0.20, 0.25, 0.40, 0.50, 0.60, 0.75, 1.00];
        const r = (window.playerData.rank || 1) - 1;
        const bonus = ranks[Math.min(r, 9)] || 0.10;
        runesMod += bonus; paraMod += bonus;
    } else if (g.includes('чародей')) {
        const ranks = [0.15, 0.20, 0.28, 0.35, 0.50, 0.75, 1.00, 1.25, 1.50, 2.00];
        const r = (window.playerData.rank || 1) - 1;
        const bonus = ranks[Math.min(r, 9)] || 0.15;
         // Бонус применяется только к опыту за обычных мобов (dMobs * 0.01)
        const mobsExp = dMobs * 0.01;
        runesBase += mobsExp * bonus;
        paraBase += mobsExp * bonus;
    } else if (g.includes('гэмблер')) {
        runesMod -= 0.25; paraMod -= 0.25;
    } else if (g.includes('вор') && !g.includes('воришка')) {
        runesMod -= 0.175; paraMod -= 0.175;
    } else if (g.includes('воришка')) {
        runesMod -= 0.1; paraMod -= 0.1;
    } else if (g.includes('салага')) {
        runesMod -= 0.1; paraMod -= 0.1;
    } else if (g.includes('громила')) {
        runesMod -= 0.2; paraMod -= 0.2;
    } else if (g.includes('лорд войны')) {
        runesMod += 0.07;
    } else if (g.includes('искатель приключений')) {
        chestsRunes = (chests * 0.5) + (bigChests * 1.5);
        chestsPara = (chests * 0.5) + (bigChests * 1.5);
    } else if (g.includes('искатель богатства')) {
        chestsRunes = (chests * 0.7) + (bigChests * 2.0);
        chestsPara = (chests * 0.7) + (bigChests * 2.0);
    } else if (g.includes('джимми')) {
        chestsRunes = (chests * 0.3) + (bigChests * 1.0);
        chestsPara = (chests * 0.3) + (bigChests * 1.0);
    }

    const totalRunes = ((runesBase * runesMod) + chestsRunes).toFixed(2);
    const totalPara = ((paraBase * paraMod) + chestsPara).toFixed(2);

    let riftMsg = "";
    if (riftMult !== 1) {
        riftMsg = `<br><span style="color:#ffd700; font-size:0.8rem;">(Множитель: x${riftMult.toFixed(2)})</span>`;
    }

    const diffText = (dMobs > 0 || dElites > 0) ? `<br><span style="font-size:0.8rem; color:#aaa;">(+${dMobs}💀, +${dElites}☠️)</span>` : "";
    document.getElementById('exp-result-display').innerHTML = `
        <span style="color:#fff">Награда:</span><br>
        <span style="color:#66ccff; font-size:1.2rem;">${totalRunes} 📖</span> | 
        <span style="color:#d4af37; font-size:1.2rem;">${totalPara} ⏳</span>${diffText}${riftMsg}
    `;
}

window.applyExpCalculation = function() {
    const mobs = parseInt(document.getElementById('exp-mobs').value) || 0;
    const elites = parseInt(document.getElementById('exp-elites').value) || 0;
    const bosses = parseInt(document.getElementById('exp-bosses').value) || 0;
    const chests = parseInt(document.getElementById('exp-chests') ? document.getElementById('exp-chests').value : 0) || 0;
    const bigChests = parseInt(document.getElementById('exp-big-chests') ? document.getElementById('exp-big-chests').value : 0) || 0;
    
    // Считаем разницу для статистики
    const dMobs = Math.max(0, mobs - (window.playerData.last_input_mobs || 0));
    const dElites = Math.max(0, elites - (window.playerData.last_input_elites || 0));
    
    // Сохраняем убийства за этот ран для экспорта статистики
    window.playerData.last_run_kills = dMobs;

    // Автоматическая проверка контракта Соратников
    const g = (window.playerData.guild || "").toLowerCase();
    const contractCheck = document.getElementById('exp-contract-check');
    if ((g.includes('громила') || g.includes('лорд войны')) && window.partnerData && window.partnerData.last_kills !== undefined) {
        if (dMobs > window.partnerData.last_kills) {
            if (contractCheck) contractCheck.checked = true;
        }
    }

    window.calculateExp();
    const resHTML = document.getElementById('exp-result-display').innerHTML;
    const runesMatch = resHTML.match(/([\d\.]+) 📖/);
    const paraMatch = resHTML.match(/([\d\.]+) ⏳/);
    
    const addRunes = runesMatch ? parseFloat(runesMatch[1]) : 0;
    const addPara = paraMatch ? parseFloat(paraMatch[1]) : 0;

    // Блокировка ввода опыта во время ВП (до закрытия)
    if (window.playerData.is_vp && !window.playerData.vp_close_mode) {
        window.showCustomAlert("⚠️ В ВП опыт начисляется только после закрытия портала.");

        return;
    }

    window.playerData.runes = parseFloat((window.playerData.runes + addRunes).toFixed(2));
    window.playerData.para = parseFloat((window.playerData.para + addPara).toFixed(2));
    window.playerData.kills += dMobs;
    window.playerData.elites_solo += dElites;
    window.playerData.bosses += bosses;
    window.playerData.chests_found += (chests + bigChests);
    
    if (window.playerData.kills > (window.playerData.highest_kills || 0)) {
        window.playerData.highest_kills = window.playerData.kills;
    }

    // Начисление золота Соратникам за убийства
    let rewardMsg = "";
    if (dMobs > 0 && (g.includes('салага') || g.includes('громила') || g.includes('лорд войны'))) {
        let mult = 0;
        if (g.includes('салага')) mult = 0.88;
        else if (g.includes('громила')) mult = 1.75;
        else if (g.includes('лорд войны')) mult = 1.23;
        
        // Проверка контракта (х3)
        const contractCheck = document.getElementById('exp-contract-check');
        if (contractCheck && contractCheck.checked && (g.includes('громила') || g.includes('лорд войны'))) {
            mult *= 3;
        }
        
        const reward = Math.floor(dMobs * mult * window.playerData.level);
        window.addYen(reward);
        rewardMsg = `<br>💰 Получено: ${window.formatCurrency(reward)}`;
    }
    // Сброс флагов ВП после начисления
    if (window.playerData.vp_close_mode) {
        window.playerData.is_vp = false;
        window.playerData.vp_close_mode = false;
        window.playerData.is_in_np = false;
        window.playerData.vp_empowered = false;
                window.playerData.current_rift_cost = 0; // Сброс затрат

       
    }
    
    window.saveToStorage();
    window.updateUI();
    document.getElementById('exp-calc-modal').style.display = 'none';
    window.showCustomAlert(`✅ Получено: ${addRunes} 📖 и ${addPara} ⏳${rewardMsg}<br>Статистика обновлена.`);
}

window.setBaseStats = function() {
    window.showCustomPrompt("Изначальные параметры", "Введите изначальное кол-во убитых мобов:", "0", (mobs) => {
        window.showCustomPrompt("Изначальные параметры", "Введите изначальное кол-во убитых элиток:", "0", (elites) => {
            window.playerData.base_kills = parseInt(mobs) || 0;
            window.playerData.base_elites = parseInt(elites) || 0;
            window.playerData.last_input_mobs = parseInt(mobs) || 0;
            window.playerData.last_input_elites = parseInt(elites) || 0;
            
            document.getElementById('exp-mobs').value = window.playerData.last_input_mobs;
            document.getElementById('exp-elites').value = window.playerData.last_input_elites;
            
            window.saveToStorage();
            window.updateUI();
            window.calculateExp();
            window.showCustomAlert("✅ Изначальные параметры установлены.");
        });
    });
}

window.addMoney = function(g, s, c, y) {
    window.playerData.gold_g += g;
    window.playerData.gold_s += s;
    window.playerData.gold_c += c;
    window.playerData.gold_y += y;
    if (window.coinSound) { window.coinSound.currentTime = 0; window.coinSound.play().catch(e => {}); }
    window.updateUI();
    alert(`💰 Получено: ${s} серебра!`);
}

window.buyZakens = function(mode) {
    const modal = document.getElementById('zaken-buy-modal');
    const title = modal.querySelector('h3');
    const buyBtn = document.getElementById('btn-confirm-buy');
    
    // Сброс позиции
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    
    const priceYen = window.getZakenPrice(window.playerData.level);
    const lvl = window.playerData.level;

    if (mode === 'buy') {
        // Проверка уровня (20+, кратно 5 до 70, или >70)
        if (lvl < 20) {
            window.showCustomAlert("❌ Покупка закенов доступна с 20 уровня.");
            return;
        }
        
        // Если уровень меньше 70 и не кратен 5 (20, 25, 30...)
        if (lvl < 70 && lvl % 5 !== 0) {
            window.showCustomAlert("❌ До 70 уровня покупка доступна только на уровнях, кратных 5 (20, 25, 30...).");
            return;
        }

        title.innerText = '💰 ПОКУПКА ЗАКЕНОВ';
        title.style.color = '#d4af37';
        modal.style.borderColor = '#d4af37';
        buyBtn.style.display = 'inline-block';
        
        document.getElementById('zaken-price-display').innerText = "";
    
    }
    
    document.getElementById('zaken-count-input').value = 1;
    modal.dataset.mode = mode; // Сохраняем режим
    window.updateZakenTotalCost();
    
    modal.style.display = 'block';
}

window.updateZakenTotalCost = function() {
    const count = parseInt(document.getElementById('zaken-count-input').value) || 0;
    const modal = document.getElementById('zaken-buy-modal');
    const mode = modal.dataset.mode;
    const lvl = window.playerData.level;
    const g = (window.playerData.guild || "").toLowerCase();
    let priceYen = window.getZakenPrice(lvl);
    

    const totalYen = priceYen * count;
    const label = mode === 'buy' ? 'Стоимость' : 'Получите';
    document.getElementById('zaken-total-cost').innerText = `${label}: ${window.formatCurrency(totalYen)}`;
}

window.confirmBuyZakens = function() {
    const count = parseInt(document.getElementById('zaken-count-input').value);
    let priceYen = window.getZakenPrice(window.playerData.level);
    let bonuses = [];
    
    if (isNaN(count) || count <= 0) {
        window.showCustomAlert("Некорректное число.");
        return;
    }

    // Применяем скидку гильдии (Гэмблер)
    if (window.playerData.zaken_discount_val) {
        priceYen = priceYen * (1 + window.playerData.zaken_discount_val);
        bonuses.push(`Гэмблер ${Math.round(window.playerData.zaken_discount_val*100)}%`);
    }
const totalCostYen = priceYen * count;
    const valError = window.validateGenericAction(totalCostYen, "Покупка Закенов");
    if (valError) {
        window.showCustomAlert(valError);
        return;
    }
    
    const currentYen = window.getAllMoneyInYen();

    if (currentYen >= totalCostYen) {
        window.setMoneyFromYen(currentYen - totalCostYen);
        window.playerData.zakens += count;
        window.playerData.deals += count; // Используем сделки вместо black_market
        // Логика бонуса Гэмблера: каждые 2 покупки дают 10 продаж по х5
        if ((window.playerData.guild || "").toLowerCase().includes('гэмблер')) {
            window.playerData.gambler_bm_purchases_count = (window.playerData.gambler_bm_purchases_count || 0) + count;
            while (window.playerData.gambler_bm_purchases_count >= 2) {
                window.playerData.gambler_bm_purchases_count -= 2;
                window.playerData.gambler_bonus_sales_left = (window.playerData.gambler_bonus_sales_left || 0) + 10;
            }
        }
        window.updateUI();
        document.getElementById('zaken-buy-modal').style.display = 'none';
        window.showCustomAlert(`✅ Куплено ${count} 🔖 за ${window.formatCurrency(totalCostYen)}.`);
    } else {
        const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";
        window.showCustomAlert(`❌ Недостаточно средств!<br>Нужно: ${window.formatCurrency(totalCostYen)}${bonusText}`);
    }
}




window.buyReagent = function() {
    showCustomPrompt("Покупка реагента", "Цена: 10🥈 за 1 шт.", "1", (quantity) => {
        if (isNaN(quantity) || quantity <= 0) {
            showCustomAlert("Некорректное количество.");
            return;
        }

        const costPerUnit = 100000; // 10 silver = 100000 yen
        const totalCost = costPerUnit * quantity;
        const currentMoney = getAllMoneyInYen();

        if (currentMoney >= totalCost) {
            setMoneyFromYen(currentMoney - totalCost);
            playerData.reagents += quantity;
            updateUI();
            showCustomAlert(`✅ Куплено ${quantity} реагентов за ${window.formatCurrency(totalCost)}.`);
        } else {
            showCustomAlert(`❌ Недостаточно средств!`);
        }
    });
}

window.sellDeathBreath = function() {
    showCustomPrompt("Продажа Дыхания Смерти", `Цена: 5🥈 за 1 шт.<br>У вас: ${playerData.death_breath} 🧪`, "1", (quantity) => {
        if (isNaN(quantity) || quantity <= 0) {
            showCustomAlert("Некорректное количество.");
            return;
        }

        if (playerData.death_breath < quantity) {
            showCustomAlert(`❌ Недостаточно Дыханий Смерти!`);
            return;
                }

        const g = (window.playerData.guild || "").toLowerCase();
        const playerRank = window.playerData.rank || 0;
        const pricePerUnit = 50000; // 5 silver = 50000 yen
        let sellMult = 1.0;
        let bonuses = [];

        if (g.includes('торговц')) {
             const sellPercents = [10, 13, 15, 17, 19, 21, 23, 25, 28, 32, 35];
             const p = sellPercents[playerRank] || 10;
             sellMult = p / 5;
             bonuses.push(`Торговцы x${sellMult.toFixed(2)}`);
        }
        // Вампир: штраф только на предметы, здесь убран
        
        let totalGain = pricePerUnit * quantity * sellMult;
        playerData.death_breath -= quantity;
        
        const currentMoney = getAllMoneyInYen();
        setMoneyFromYen(currentMoney + totalGain);
        updateUI();
        const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";
        showCustomAlert(`✅ Продано ${quantity} 🧪 за ${window.formatCurrency(totalGain)}.${bonusText}`);
    });
}



window.craftHealthPotion = function() {
    showCustomPrompt("Крафт зелий здоровья", `Нужно: 1🧪 и 1 реагент за зелье.`, "1", (quantity) => {
        if (isNaN(quantity) || quantity <= 0) {
            showCustomAlert("Некорректное количество.");
            return;
        }

        const currentReagents = window.playerData.reagents || 0;
        if (window.playerData.death_breath < quantity || currentReagents < quantity) {
            let errorMsg = "❌ Недостаточно ресурсов!<br>";
            if (window.playerData.death_breath < quantity) errorMsg += `Нужно 🧪: ${quantity} (у вас ${window.playerData.death_breath})<br>`;
            if (currentReagents < quantity) errorMsg += `Нужно реагентов: ${quantity} (у вас ${currentReagents})`;
            showCustomAlert(errorMsg);
            return;
        }

        playerData.death_breath -= quantity;
        playerData.reagents -= quantity;
        playerData.potions += quantity;
        updateUI();
        showCustomAlert(`✅ Скрафчено ${quantity} 💊.`);
    });
}

window.applySkillPenalty = function() {
    const lvl = playerData.level;
    let penaltyYen = 0;
    if (lvl <= 20) penaltyYen = 1000;
    else if (lvl <= 40) penaltyYen = 2500;
    else if (lvl <= 60) penaltyYen = 5000;
    else penaltyYen = 10000;

    const currentMoney = getAllMoneyInYen();
    setMoneyFromYen(currentMoney - penaltyYen);
    updateUI();
    showCustomAlert(`🚨 Использовано неизученное умение!<br>Списано: ${window.formatCurrency(penaltyYen)}`);
}


window.applyEscapePenalty = function() {
    const lvl = playerData.level;
    let penaltyYen = 0;
    if (lvl <= 20) penaltyYen = 10000;
    else if (lvl <= 40) penaltyYen = 30000;
    else if (lvl <= 60) penaltyYen = 60000;
    else if (lvl <= 69) penaltyYen = 100000;
    else if (lvl <= 75) penaltyYen = 300000;
    else if (lvl <= 85) penaltyYen = 1000000;
    else penaltyYen = 5000000;

    const currentMoney = getAllMoneyInYen();
    setMoneyFromYen(currentMoney - penaltyYen);
    updateUI();
    showCustomAlert(`🚨 Использована спас-способность!<br>Списано: ${window.formatCurrency(penaltyYen)}`);
}

window.buyPotion = function() {
    showCustomPrompt("Экстренная покупка зелий", "Сколько зелий (💊) купить и выпить?", "1", (quantity) => {
        if (isNaN(quantity) || quantity <= 0) {
            showCustomAlert("Некорректное количество.");
            return;
        }
        const g = (window.playerData.guild || "").toLowerCase();
        if (g.includes('вампир')) {
            showCustomAlert(`🩸 Вампиры не нуждаются в покупных зельях.`);
            return;
        }
        const lvl = playerData.level;
        let pricePerPotion = 0;
        let bonuses = [];

        if (lvl < 70) {
            if (lvl <= 20) pricePerPotion = 1000; // 10c
            else if (lvl <= 40) pricePerPotion = 4000; // 40c
            else if (lvl <= 52) pricePerPotion = 20000; // 2s
            else if (lvl <= 61) pricePerPotion = 40000; // 4s
            else if (lvl <= 66) pricePerPotion = 80000; // 8s
            else pricePerPotion = 200000; // 20s
        } else {
            const basePrice = 200000; // 20s
            const maxVp = playerData.maxVp || 0;
            pricePerPotion = basePrice * Math.pow(1.05, maxVp);
        }

        // Применяем скидку гильдии
        if (window.playerData.potion_discount_val) {
            pricePerPotion = pricePerPotion * (1 + window.playerData.potion_discount_val);
            bonuses.push(`Гильдия ${Math.round(window.playerData.potion_discount_val*100)}%`);
        }

        const totalCost = Math.floor(pricePerPotion * quantity);
        const valError = window.validateGenericAction(totalCost, "Покупка Зелий");
        if (valError) {
            window.showCustomAlert(valError);
            return;
        }
        const currentMoney = getAllMoneyInYen();

        if (currentMoney >= totalCost) {
            setMoneyFromYen(currentMoney - totalCost);
            updateUI();
            const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";
            showCustomAlert(`✅ Куплено и выпито ${quantity} 💊. Списано: ${window.formatCurrency(totalCost)}.${bonusText}`);
        } else {
            showCustomAlert(`❌ Недостаточно средств!`);
        }
    });
}

function getSmithSellPrice(level) {
    // Эта функция использует таблицу из раздела "Кузница" -> "Продажа ресурсов (5%)"
    if (level <= 5) return 25;
    if (level <= 10) return 30;
    if (level <= 15) return 40;
    if (level <= 20) return 55;
    if (level <= 25) return 100;
    if (level <= 30) return 200;
    if (level <= 35) return 280;
    if (level <= 40) return 460;
    if (level <= 45) return 650;
    if (level <= 50) return 1100;
    if (level <= 55) return 1800;
    if (level <= 60) return 2700;
    if (level <= 65) return 4500;
    if (level <= 69) return 7000;
    if (level >= 70) return 8700;
    return 25; // Default
}

window.sellResources = function() {
    const modal = document.getElementById('multi-sell-modal');
    const inputsContainer = document.getElementById('multi-sell-inputs');
    const totalDisplay = document.getElementById('multi-sell-total');
    const okBtn = document.getElementById('multi-sell-ok-btn');
    const cancelBtn = document.getElementById('multi-sell-cancel-btn');
    const levelInput = document.getElementById('multi-sell-level');

    // Сброс позиции
   modal.style.top = '50%';    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    levelInput.value = (window.lastResourceSellLevel && window.lastResourceSellLevel >= 5) ? window.lastResourceSellLevel : 5;
    document.getElementById('multi-sell-label-text').innerText = "Уровень ресурсов:";

    document.getElementById('multi-sell-title').innerText = "Продажа ресурсов";
    const resources = [
        { type: 'n', name: 'N Grade 📓', mult: 1, stock: window.playerData.res_n || 0 },
        { type: 'dc', name: 'D/C Grade 📘/📒', mult: 3, stock: window.playerData.res_dc || 0 },
        { type: 'b', name: 'B Grade 📙', mult: 4, stock: window.playerData.res_b || 0 },
        { type: 'a', name: 'A Grade 📕', mult: 10.5, stock: window.playerData.res_a || 0 }
    ];

    inputsContainer.innerHTML = resources.map(r => `
        <label style="display: flex; justify-content: space-between; align-items: center;">
            <span>${r.name} (x${r.mult})<br><small style="color:#888">В наличии: ${r.stock}</small></span>
            <input type="number" data-type="${r.type}" data-mult="${r.mult}" class="multi-sell-input" value="0" min="0" style="width: 80px; padding: 5px; background: #000; border: 1px solid #444; color: #fff;">
        </label>
    `).join('');

    const updateTotal = () => {
        let totalYen = 0;
        const level = parseInt(levelInput.value) || 1;
        window.lastResourceSellLevel = level;
        const labelText = document.getElementById('multi-sell-label-text');
        if (labelText) labelText.innerText = "Уровень ресурсов:";
        const basePrice = getSmithSellPrice(level);
        
        const g = (window.playerData.guild || "").toLowerCase();
        const playerRank = window.playerData.rank || 0;
        let sellMult = 1.0;
        let bonuses = [];

        if (g.includes('торговц')) {
             const sellPercents = [10, 13, 15, 17, 19, 21, 23, 25, 28, 32, 35];
             const p = sellPercents[playerRank] || 10;
             sellMult = p / 5;
             bonuses.push(`Торговцы x${sellMult.toFixed(2)}`);
        }
        if (g.includes('вампир')) {
            sellMult *= 0.5;
            bonuses.push(`Вампир -50%`); // Возвращен штраф
        }
        const riftMult = window.activeRiftMultiplier || 1;
        if (riftMult !== 1) {
            bonuses.push(`НП x${riftMult}`);
        }

        inputsContainer.querySelectorAll('.multi-sell-input').forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const mult = parseFloat(input.dataset.mult);
            totalYen += quantity * basePrice * mult * sellMult * riftMult;
        });
        const bonusText = bonuses.length ? ` <span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";
        totalDisplay.innerHTML = `Итого: ${window.formatCurrency(Math.floor(totalYen))}${bonusText}`;
    };

    levelInput.oninput = updateTotal;
    inputsContainer.querySelectorAll('.multi-sell-input').forEach(input => {
        input.oninput = updateTotal;
    });

    okBtn.onclick = () => {
        const g = (window.playerData.guild || "").toLowerCase();
        let totalGain = 0;
        let error = false;
        const quantities = {};
        const level = parseInt(levelInput.value) || 1;
        const basePrice = getSmithSellPrice(level);

        const playerRank = window.playerData.rank || 0;
        let sellMult = 1.0;
        if (g.includes('торговц')) {
             const sellPercents = [10, 13, 15, 17, 19, 21, 23, 25, 28, 32, 35];
             const p = sellPercents[playerRank] || 10;
             sellMult = p / 5;
        }
        if (g.includes('вампир')) {
            sellMult *= 0.5;
        }
        const riftMult = window.activeRiftMultiplier || 1;
        const isRiftSequence = !!window.activeRiftMultiplier;

        inputsContainer.querySelectorAll('.multi-sell-input').forEach(input => {
            const resType = input.dataset.type;
            const quantity = parseInt(input.value) || 0;
            quantities[resType] = (quantities[resType] || 0) + quantity;

            if (!isRiftSequence && quantity > (window.playerData[`res_${resType}`] || 0)) {
                error = true;
            }
            totalGain += quantity * basePrice * parseFloat(input.dataset.mult) * sellMult * riftMult;
        });
        
        if (error) {
            showCustomAlert("❌ Недостаточно ресурсов одного из типов!");
            return;
        }

        if (totalGain > 0) {
            if (!isRiftSequence) {
                for (const resType in quantities) {
                    window.playerData[`res_${resType}`] -= quantities[resType];
                }
            }
            const currentMoney = getAllMoneyInYen();
            setMoneyFromYen(currentMoney + Math.floor(totalGain));
            updateUI();
            showCustomAlert(`✅ Ресурсы проданы! Получено: ${window.formatCurrency(Math.floor(totalGain))}`);
        }
        modal.style.display = 'none';
        // Цепочка НП: Ресурсы -> Камни
        if (window.activeRiftMultiplier) {
            setTimeout(() => window.openGemServices('sell'), 500);
        }
    };

    cancelBtn.onclick = () => {
        modal.style.display = 'none';
        if (window.activeRiftMultiplier) {
            setTimeout(() => window.openGemServices('sell'), 500);
        }
    };

    updateTotal();
    modal.style.display = 'flex';
}

window.sellRunes = function(guildType) {
    const g = (window.playerData.guild || "").toLowerCase();
    // Проверка: можно нажать только кнопку своей гильдии
    if (!g.includes(guildType)) {
        window.showCustomAlert("❌ Вы не можете использовать эту услугу.");
        return;
    }

    // Расчет цены за 1 руну
    let pricePerRune = 0;
    const rank = window.playerData.rank || 1;
    
    if (g.includes('чародей') && !g.includes('ученик')) {
        const prices = [0, 2000, 3700, 6000, 9000, 13500, 18000, 22500, 27000, 32000, 45000];
      const basePrice = prices[rank] || 2000;
        const bonusPercent = 27.5 * (window.playerData.stat_int / 100);
        pricePerRune = basePrice * (1 + bonusPercent / 100);
    } else if (g.includes('ученик')) {
        pricePerRune = 1500; // Фикс 15 бронзы
    } else if (g.includes('вампир')) {
        // Вампир: Уроки стоят на 30% больше за каждые 100 Интеллекта
        const basePrice = 1500;
        // Штраф на продажу -50% (применяется к итоговой цене)
       const bonusPercent = 30 * (window.playerData.stat_int / 100); // Штраф -50% применяется при продаже
        pricePerRune = basePrice * (1 + bonusPercent / 100);
    }

    window.showCustomPrompt("Продажа Рун", `Цена за 1 📖: ${window.formatCurrency(pricePerRune)}<br>У вас: ${window.playerData.runes} 📖`, "1", (quantity) => {
        if (isNaN(quantity) || quantity <= 0) return;
        // Для Чародеев руны продаются только целыми числами
        if (g.includes('чародей')) {
            quantity = Math.floor(quantity);
        }
        if (window.playerData.runes < quantity) { window.showCustomAlert("Недостаточно рун."); return; }
        
        window.playerData.runes -= quantity;
        window.playerData.runes_sold += quantity;
        
        const totalGain = Math.floor(pricePerRune * quantity);
        // Вампирский штраф на продажу рун
        if (g.includes('вампир')) {
            totalGain = Math.floor(totalGain * 0.5);
        }
        window.playerData.gold_y += totalGain;
        
        // Нормализация денег
        while (window.playerData.gold_y >= 100) { window.playerData.gold_y -= 100; window.playerData.gold_c++; }
        while (window.playerData.gold_c >= 100) { window.playerData.gold_c -= 100; window.playerData.gold_s++; }
        while (window.playerData.gold_s >= 100) { window.playerData.gold_s -= 100; window.playerData.gold_g++; }
        
        window.updateUI();
        window.showCustomAlert(`✅ Продано ${quantity} 📖 за ${window.formatCurrency(totalGain)}`);
    });
}

window.buyRunes = function() {
    const lvl = window.playerData.level;
    // Формула: 2000 * Level^1.4
    // Lvl 1: 2000
    // Lvl 20: ~132,000
    // Lvl 70: ~765,000
    const pricePerRune = Math.floor(2000 * Math.pow(lvl, 1.4));

    window.showCustomPrompt("Покупка Рун", `Цена за 1 📖: ${window.formatCurrency(pricePerRune)}<br>Ваш уровень: ${lvl}`, "1", (quantity) => {
        if (isNaN(quantity) || quantity <= 0) return;
        
        const totalCost = pricePerRune * quantity;
        window.showCustomConfirm(
            `Купить ${quantity} 📖?<br>Итоговая стоимость: ${window.formatCurrency(totalCost)}`,
            () => {
                const currentYen = window.getAllMoneyInYen();
                if (currentYen >= totalCost) {
                    window.setMoneyFromYen(currentYen - totalCost);
                    window.playerData.runes = parseFloat((window.playerData.runes + quantity).toFixed(2));
                    window.updateUI();
                    window.showCustomAlert(`✅ Куплено ${quantity} 📖 за ${window.formatCurrency(totalCost)}`);
                } else {
                    window.showCustomAlert(`❌ Недостаточно средств! Нужно: ${window.formatCurrency(totalCost)}`);
                }
            }
        );
    });
}

window.resetProgress = function() {
    window.showCustomConfirm(
        "⚠️ ВНИМАНИЕ ⚠️<br><br>Вы собираетесь полностью стереть весь прогресс, статистику, выбранные классы и гильдии.<br><br>Это действие нельзя отменить.<br><br>Вы уверены?",
        () => {
            window.playerData = {
                name: "НЕФАЛЕМ",
                level: 1,
                gold_g: 0, gold_s: 0, gold_c: 0, gold_y: 0, // Валюта
                runes: 0, para: 0, zakens: 0, maxVp: 0, potions: 0, death_breath: 0, // Ресурсы
                
                // Панели
                guild_html: "", class_html: "",
                
                // Характеристики
                stat_str: 0, stat_dex: 0, stat_int: 0, stat_vit: 0,
                
                // Статистика
                kills: 0, base_kills: 0, base_elites: 0,
                elites_solo: 0, bosses: 0, gobs_solo: 0, gobs_assist: 0, 
                found_legs: 0, found_yellows: 0,
                
                // Ресурсы крафта
                res_n: 0, res_dc: 0, res_b: 0, res_a: 0, reagents: 0,
                
                // Статистика гильдий
                runes_sold: 0, reputation: 0, deals: 0, chests_found: 0,
                steals: 0,
                
                // Состояния и бонусы
                theft_fine: "", zaken_discount: "", xp_bonus: "", potion_price: "",
                lvl70_portal: "", active_rents: [], forgottenSkills: {},
                professions: { 1: false, 2: false, 3: false }, claimed_torments: [], claimed_ranks: [],
                refused_wizard_promotion: false,
                difficulty: "Высокий", // Текущий уровень сложности
                
                
                // Куб и навыки
                penta_1: false, penta_2: false, penta_3: false,
                inventory: [], // Инвентарь купленных/скрафченных предметов
                learnedSkills: {},
                
                // Профиль
                className: "Класс не выбран",
                build: "",
                guild: "Нет",
                rank: 0,
                rankName: "",
                joined_level: 1
            };

            window.saveToStorage();
            document.getElementById('active-guild-bonus').style.display = 'none';
            document.getElementById('active-class-bonus').style.display = 'none';
            window.updateUI();
        }
    );
}

// --- ЛОГИКА УСЛУГ ЮВЕЛИРА ---

const gemPrices = [
    // rank is index + 1
    { insert: 8000, sell: 1300, rent: 3000 },       // Rank 1
    { insert: 16000, sell: 2500, rent: 5500 },      // Rank 2
    { insert: 33000, sell: 5000, rent: 10000 },     // Rank 3
    { insert: 50000, sell: 7500, rent: 17000 },     // Rank 4
    { insert: 100000, sell: 15000, rent: 33000 },    // Rank 5
    { insert: 110000, sell: 17500, rent: 35000 },    // Rank 6
    { insert: 230000, sell: 35000, rent: 75000 },    // Rank 7
    { insert: 380000, sell: 57500, rent: 130000 },   // Rank 8
    { insert: 760000, sell: 115000, rent: 250000 },  // Rank 9
    { insert: 1150000, sell: 172500, rent: 400000 }  // Rank 10
];

window.openGemServices = function(mode) {
    const modal = document.getElementById('gem-service-modal');
    const title = document.getElementById('gem-service-title');
    const buttonsContainer = document.getElementById('gem-service-buttons');
    const itemTypeSelector = document.getElementById('gem-item-type-selector');
    const rentDurationBox = document.getElementById('gem-rent-duration-box');

    // Сброс позиции
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';

    buttonsContainer.innerHTML = ''; // Clear previous buttons

    if (mode === 'main') {
        title.innerText = 'Услуги Ювелира';
        buttonsContainer.innerHTML = `
            <button class="craft-btn buy" onclick="executeGemService('insert')">Вставить/Убрать</button>
            <button class="craft-btn sell" onclick="executeGemService('sell')">Продать</button>
        `;
        itemTypeSelector.style.display = 'flex';
        rentDurationBox.style.display = 'none';
    } else if (mode === 'rent') {
        const g = (window.playerData.guild || "").toLowerCase();
        if (!g.includes('торговц')) {
            showCustomAlert("❌ Аренда доступна только членам Гильдии Торговцев.");
            return;
        }
        title.innerText = 'Аренда Самоцветов';
        buttonsContainer.innerHTML = `
            <button class="craft-btn craft" onclick="executeGemService('rent')">Арендовать</button>
        `;
        itemTypeSelector.style.display = 'none';
        rentDurationBox.style.display = 'block';
        } else if (mode === 'sell') {
        title.innerText = 'Продажа Самоцветов';
        buttonsContainer.innerHTML = `
            <button class="craft-btn sell" onclick="executeGemService('sell')">Продать</button>
        `;
        itemTypeSelector.style.display = 'none';
        rentDurationBox.style.display = 'none';
    }
    
    buttonsContainer.innerHTML += `<button class="death-cancel-btn" onclick="closeGemModal()">Отмена</button>`;
    // Если это часть цепочки НП, меняем кнопку Отмена на Завершить
    if (window.activeRiftMultiplier && mode === 'sell') {
        const cancelBtn = buttonsContainer.querySelector('.death-cancel-btn');
        cancelBtn.innerText = "ЗАВЕРШИТЬ";
        cancelBtn.onclick = () => { closeGemModal(); window.activeRiftMultiplier = null; window.activeRiftExpMultiplier = null; window.riftSuccess = null; window.showCustomAlert("🏁 Цепочка завершена!"); };

    }
    
    modal.style.display = 'flex';
}

window.closeGemModal = function() {
    document.getElementById('gem-service-modal').style.display = 'none';
}

window.executeGemService = function(operation) {
    const gemRank = parseInt(document.getElementById('gem-rank-input').value);
    const quantity = parseInt(document.getElementById('gem-quantity-input').value);
    const itemTypeMult = parseFloat(document.querySelector('input[name="gem-item-type"]:checked').value);
    const rentDuration = parseInt(document.getElementById('gem-rent-duration').value) || 1;

    if (isNaN(gemRank) || gemRank < 1 || gemRank > 10 || isNaN(quantity) || quantity <= 0) {
        showCustomAlert("❌ Неверный ранг или количество.");
        return;
    }

    const priceData = gemPrices[gemRank - 1];
    if (!priceData) {
        showCustomAlert("❌ Неверный ранг камня.");
        return;
    }

    let singleCost = 0;
    let operationText = "";
    let isIncome = false;
    let bonuses = [];

    const g = (window.playerData.guild || "").toLowerCase();
    const playerRank = window.playerData.rank || 0;

    if (operation === 'insert') {
        singleCost = priceData.insert * itemTypeMult;
        operationText = `Вставить/убрать ${quantity} 💎 ${gemRank} ранга`;
        if (g.includes('торговц')) {
            singleCost = 0; // Guild bonus
            operationText += " (Бесплатно для Торговцев)";
        }
    } else if (operation === 'sell') {
        let sellMult = 1; // База 5%
        if (g.includes('торговц')) {
            // Проценты продажи для торговцев по рангам (0-10)
            const sellPercents = [10, 13, 15, 17, 19, 21, 23, 25, 28, 32, 35];
            const p = sellPercents[playerRank] || 10;
            sellMult = p / 5; // Отношение к базовым 5%
            bonuses.push(`Торговцы x${sellMult.toFixed(2)}`);
        }
        singleCost = priceData.sell * sellMult;
        // Вампирский штраф возвращен
        if (g.includes('вампир')) {
            singleCost *= 0.5;
            bonuses.push(`Вампир -50%`);
        }
        operationText = `Продать ${quantity} 💎 ${gemRank} ранга`;
        isIncome = true;
    } else if (operation === 'rent') {
        singleCost = priceData.rent;
        operationText = `Арендовать ${quantity} 💎 ${gemRank} ранга`;
    }

    let totalCost = singleCost * quantity;
    // Множитель рифта для продажи
    if (isIncome && window.activeRiftMultiplier) {
        totalCost *= window.activeRiftMultiplier;
        bonuses.push(`НП x${window.activeRiftMultiplier}`);
    }
    if (operation === 'rent') totalCost *= rentDuration;
    const costFormatted = formatCurrency(totalCost);
    const valError = window.validateGemAction(totalCost, gemRank, quantity, operation);
    if (valError) {
        window.showCustomAlert(valError);
        return;
    }
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";
    const confirmMsg = isIncome 
        ? `${operationText}?<br>Вы получите: ${costFormatted}${bonusText}`
        : `${operationText}?<br>Стоимость: ${costFormatted}`;

    showCustomConfirm(confirmMsg, () => {
        const currentMoney = getAllMoneyInYen();
        if (isIncome) {
            setMoneyFromYen(currentMoney + Math.floor(totalCost));
            showCustomAlert(`✅ Продано! Получено: ${costFormatted}`);
        } else {
            if (currentMoney < totalCost) {
                showCustomAlert("❌ Недостаточно средств!");
                return;
            }
            setMoneyFromYen(currentMoney - totalCost);
            showCustomAlert(`✅ Услуга оплачена! Списано: ${costFormatted}`);
            
            if (operation === 'rent') {
                window.playerData.active_rents.push({
                    rank: gemRank,
                    count: quantity,
                    startLvl: window.playerData.level,
                    duration: rentDuration
                });
            }
        }
        updateUI();
        closeGemModal();
    });
}

// --- ЛОГИКА ПРОДАЖИ КРАФТА ---

function getBaseNPriceForCraft(level) {
    if (level <= 5) return 25;
    if (level <= 10) return 35;
    if (level <= 15) return 50;
    if (level <= 20) return 100;
    if (level <= 25) return 140;
    if (level <= 30) return 200;
    if (level <= 35) return 300;
    if (level <= 40) return 600;
    if (level <= 45) return 900;
    if (level <= 50) return 1400;
    if (level <= 55) return 2300;
    if (level <= 60) return 3500;
    if (level <= 65) return 6000;
    if (level <= 69) return 9300;
    if (level >= 70) return 12000;
    return 25;
}

// Helper to get hand penalty multiplier
window.getHandPenaltyMult = function(containerId) {
    const g = (window.playerData.guild || "").toLowerCase();
    if (!g.includes('охотник')) return 1.0;

    const container = document.getElementById(containerId);
    if (!container) return 1.0;
    
    const radio = container.querySelector('input[type="radio"]:checked');
    if (!radio) return 1.0;
    
    if (radio.value === 'right') {
        if (g.includes('гоблин')) return 1.5; // +50%
        if (g.includes('на ☠️')) return 1.25; // +25%
        if (g.includes('помощник')) return 1.1; // +10%
    }
    // Left hand has no penalty
    return 1.0;
}

// Helper: Get numeric index for grade
window.getGradeIndex = function(grade) {
    const g = grade.toUpperCase();
    if (g === 'N') return 0;
    if (g === 'D') return 1;
    if (g === 'C') return 2;
    if (g === 'DC' || g === 'D/C') return 1.5; 
    if (g === 'B') return 3;
    if (g === 'A') return 4;
    if (g === 'S' || g === 'S+' || g === 'SPECTRUM' || g === 'ANCIENT' || g === 'PRIMAL') return 5;
    return 0;
}

// Helper: Get player grade index based on level
window.getPlayerGradeIndex = function(level) {
    if (level < 20) return 0; // N
    if (level < 40) return 1; // D
    if (level < 52) return 2; // C
    if (level < 61) return 3; // B
    if (level < 70) return 4; // A
    return 5; // S+
}

function getCraftedItemBasePrice(level, grade) {
    let baseVal = 0;
    switch(grade) {
        case 'N': baseVal = 300; break; // 3 copper
        case 'D': baseVal = 900; break; // 9 copper
        case 'C': baseVal = 900; break; // 9 copper
        case 'DC': baseVal = 900; break; // 9 copper
        case 'B': baseVal = 1200; break; // 12 copper
        case 'A': baseVal = 3200; break; // 32 copper
        case 'S': baseVal = 3200 * 1.5; break;
        case 'S+': baseVal = 3200 * 1.56; break;
        case 'Spectrum': baseVal = 3200 * 4.875; break;
        default: baseVal = 300;
    }
    return baseVal * Math.pow(1.1, level - 1);
}

function getBulkItemPrice(level, multiplier = 1) {
    let price = 25;
    if (level <= 5) price = 25;
    else if (level <= 10) price = 35;
    else if (level <= 15) price = 50;
    else if (level <= 20) price = 100;
    else if (level <= 25) price = 140;
    else if (level <= 30) price = 200;
    else if (level <= 35) price = 300;
    else if (level <= 40) price = 600;
    else if (level <= 45) price = 900;
    else if (level <= 50) price = 1400;
    else if (level <= 55) price = 2300;
    else if (level <= 60) price = 3500;
    else if (level <= 65) price = 6000;
    else if (level <= 69) price = 9300;
    else if (level >= 70) price = 12000;
    
    return price * multiplier;
}


window.sellItemsBulk = function() {
    const modal = document.getElementById('multi-sell-modal');
    const inputsContainer = document.getElementById('multi-sell-inputs');
    const totalDisplay = document.getElementById('multi-sell-total');
    const okBtn = document.getElementById('multi-sell-ok-btn');
    const cancelBtn = document.getElementById('multi-sell-cancel-btn');
    const levelInput = document.getElementById('multi-sell-level');

    // Show/Hide Hand Selector for Hunters
    const handSelector = document.getElementById('hand-selector-main');
    const g = (window.playerData.guild || "").toLowerCase();
    if (handSelector) {
        handSelector.style.display = (g.includes('охотник')) ? 'flex' : 'none';
    }

    // Если это не цепочка НП, сбрасываем множитель, чтобы не влиял на обычную продажу
    if (!window.activeRiftMultiplier && document.getElementById('active-rift-modal').style.display === 'none') {
        // window.activeRiftMultiplier = 0; // Не сбрасываем глобально, просто учитываем локально
    }

    // Сброс позиции
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    levelInput.value = (window.lastResourceSellLevel && window.lastResourceSellLevel >= 5) ? window.lastResourceSellLevel : (window.playerData.level || 5);

    document.getElementById('multi-sell-title').innerText = "Продажа предметов";
    const labelText = document.getElementById('multi-sell-label-text');
    if (labelText) labelText.innerText = "Уровень предметов:";
    const items = [
        { type: 'n', name: 'N Grade 📓', mult: 1 },
        { type: 'dc', name: 'D/C Grade 📘/📒', mult: 3 },
        { type: 'b', name: 'B Grade 📙', mult: 4 }
    ];

    inputsContainer.innerHTML = items.map(r => `
        <label style="display: flex; justify-content: space-between; align-items: center;">
            <span>${r.name}</span>
            <input type="number" data-mult="${r.mult}" class="multi-sell-input" value="0" min="0" style="width: 80px; padding: 5px; background: #000; border: 1px solid #444; color: #fff;">
        </label>
    `).join('');

    const updateTotal = () => {
        let totalYen = 0;
        const level = parseInt(levelInput.value) || 1;
        
        window.lastResourceSellLevel = level; // Запоминаем уровень (общий с ресурсами)
        const riftMult = window.activeRiftMultiplier || 1;
        // Если окно открыто не в рамках цепочки (нет активного множителя), то riftMult = 1
        // Но activeRiftMultiplier глобальный. Проверяем контекст вызова?
        // В рамках текущей логики activeRiftMultiplier сбрасывается только в конце цепочки.
        // Если игрок просто открыл меню, activeRiftMultiplier должен быть 0/undefined.
        
        const basePrice = getBulkItemPrice(level, riftMult);
        const g = (window.playerData.guild || "").toLowerCase();
        let gamblerBonusLeft = window.playerData.gambler_bonus_sales_left || 0;

        // Расчет множителя продажи (без Гэмблера, он считается отдельно в цикле)
        let sellMultiplier = 1.0;
        if (g.includes('чародей') && !g.includes('ученик')) {
            const wizPenalties = [0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.75, 0.72, 0.70];
            const rank = window.playerData.rank || 0;
            const mult = wizPenalties[Math.min(rank, 9)] || 0.9;
            sellMultiplier *= mult;
        } else if (g.includes('ученик чародея')) {
            sellMultiplier *= 0.91;
        }
        if (g.includes('вор') && !g.includes('воришка')) sellMultiplier *= 1.5;
        if (g.includes('воришка')) sellMultiplier *= 1.2;
        if (g.includes('вампир')) sellMultiplier *= 0.5;

        inputsContainer.querySelectorAll('.multi-sell-input').forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const mult = parseFloat(input.dataset.mult);
           
            // Если Гэмблер, показываем с учетом бонуса
            if (g.includes('гэмблер')) {
                let bonusCount = Math.min(quantity, gamblerBonusLeft);
                let normalCount = quantity - bonusCount;
               // Бонусные по х5, обычные по х1.25
                totalYen += bonusCount * basePrice * mult * 5;
                totalYen += normalCount * basePrice * mult * 1.25;
                gamblerBonusLeft -= bonusCount;
            } else if (g.includes('гэмблер')) {
                totalYen += quantity * basePrice * mult * 1.25;
            } else {
                totalYen += quantity * basePrice * mult;
            }
        });
         totalYen *= sellMultiplier;
        totalDisplay.innerHTML = `Итого: ${window.formatCurrency(Math.floor(totalYen))}`;
    };

    levelInput.oninput = updateTotal;
    inputsContainer.querySelectorAll('.multi-sell-input').forEach(input => {
        input.oninput = updateTotal;
    });

    okBtn.onclick = () => {
        // Просто считаем и добавляем деньги, так как инвентаря предметов нет
        // Но используем updateTotal логику для финального расчета
        updateTotal(); // Обновить totalYen визуально, но нам нужно значение
        
        // Повторяем расчет для применения
        let totalGain = 0;
        const level = parseInt(levelInput.value) || 1;
        const riftMult = window.activeRiftMultiplier || 1;
        const basePrice = getBulkItemPrice(level, riftMult);
        let gamblerBonusLeft = window.playerData.gambler_bonus_sales_left || 0;
        const g = (window.playerData.guild || "").toLowerCase();
        let sellMultiplier = 1.0;
        
        if (g.includes('чародей') && !g.includes('ученик')) {
            const wizPenalties = [0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.75, 0.72, 0.70];
            const rank = window.playerData.rank || 0;
            const mult = wizPenalties[Math.min(rank, 9)] || 0.9;
            sellMultiplier *= mult;
        } else if (g.includes('ученик чародея')) {
            sellMultiplier *= 0.91;

        }
        // Бонусы Воров
        if (g.includes('вор') && !g.includes('воришка')) sellMultiplier *= 1.5;
        if (g.includes('воришка')) sellMultiplier *= 1.2;
        
        // Вампир (штраф на предметы есть)
        if (g.includes('вампир')) sellMultiplier *= 0.5;
        


        inputsContainer.querySelectorAll('.multi-sell-input').forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const mult = parseFloat(input.dataset.mult);
            if (g.includes('гэмблер')) {
                let bonusCount = Math.min(quantity, gamblerBonusLeft);
                let normalCount = quantity - bonusCount;
                
                // Бонусные предметы по х5
                totalGain += bonusCount * basePrice * mult * 5;
                 // Обычные по х1.25
                totalGain += normalCount * basePrice * mult * 1.25;
                
                gamblerBonusLeft -= bonusCount;
            } else {
                totalGain += quantity * basePrice * mult;
            }
        });
        // Сохраняем остаток бонусов Гэмблера
        if (g.includes('гэмблер')) {
            window.playerData.gambler_bonus_sales_left = gamblerBonusLeft;
        }

        totalGain *= sellMultiplier;

        if (totalGain > 0) {
            const currentMoney = getAllMoneyInYen();
            setMoneyFromYen(currentMoney + Math.floor(totalGain));
            updateUI();
            showCustomAlert(`✅ Предметы проданы! Получено: ${window.formatCurrency(Math.floor(totalGain))}`);
        }
        modal.style.display = 'none';
        // Если это часть цепочки НП
        if (window.activeRiftMultiplier) {
            setTimeout(() => window.openSellCraftedModal(), 500); // Следующий шаг: продажа штучных (крафт окно)
        }
    };

    cancelBtn.onclick = () => {
        modal.style.display = 'none';
         if (window.activeRiftMultiplier) {
            setTimeout(() => window.openSellCraftedModal(), 500); // Пропускаем шаг, идем дальше
        }
    };

    updateTotal();
    modal.style.display = 'flex';
}

 window.toggleSellProperty = function(el, percent) {
    el.classList.toggle('selected');
    el.dataset.percent = percent;
}

window.openSellCraftedModal = function() {
    const modal = document.getElementById('sell-craft-modal');
    const title = modal.querySelector('h3');
    let btn = document.getElementById('craft-sell-action-btn');
    if (!btn) btn = modal.querySelector('.craft-btn'); // Доп. поиск кнопки
    
    // Сброс интерфейса в режим продажи
    const handSelector = document.getElementById('hand-selector-craft');
    const g = (window.playerData.guild || "").toLowerCase();
    if (handSelector) {
        handSelector.style.display = 'none'; // Hide for sell mode
    }
    if (window.activeRiftMultiplier) {
        title.innerText = "💰 ПРОДАЖА ПРЕДМЕТОВ";
    } else {
        title.innerText = "⚒️ ПРОДАЖА КРАФТА";
    }
    title.style.color = "#d4af37";
    if (btn) {
        btn.innerText = "ПРОДАТЬ";
        btn.className = "craft-btn smith-sell";
        btn.onclick = window.sellCraftedItemFromModal;
    }

    // Если это часть цепочки НП, добавляем кнопку "Далее"
    if (window.activeRiftMultiplier) {
        let nextBtn = document.getElementById('craft-next-btn');
        if (!nextBtn) {
            nextBtn = document.createElement('button');
            nextBtn.id = 'craft-next-btn';
            nextBtn.className = 'death-cancel-btn';
            nextBtn.style.marginTop = '10px';
            nextBtn.innerText = 'ДАЛЕЕ (Ресурсы) >>';
            nextBtn.onclick = () => { modal.style.display = 'none'; window.sellResources(); };
            modal.appendChild(nextBtn);
        }
    }

    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.display = 'block';
}

window.sellCraftedItemFromModal = function() {
    const level = parseInt(document.getElementById('modal-sell-level').value) || 1;
    const grade = document.getElementById('modal-sell-grade').value;
    const playerRank = window.playerData.rank || 0;
    // Set level to player level by default if not set
    if (!document.getElementById('modal-sell-level').dataset.touched) {
         // Logic to auto-set level could go here, but input is manual
    }

    // 1. Получаем базовую 100% цену
    let price = getCraftedItemBasePrice(level, grade);
    let bonuses = [];

    // Если это цепочка НП, базовая цена 5% (как вендор), а не 100%
    if (window.activeRiftMultiplier) {
        price = price * 0.05;
    }

    // 2. Считаем бонус от выбранных свойств
    let totalPercent = 0;
    const modal = document.getElementById('sell-craft-modal');
    const selectedProps = modal.querySelectorAll('.sell-prop-item.selected');
    if (selectedProps.length === 0) {
        window.showCustomAlert("❌ Выберите хотя бы одно свойство.");
        return;
    }
    
    selectedProps.forEach(el => {
        totalPercent += parseFloat(el.dataset.percent);
    });

    price = price * (totalPercent / 100);

    // 3. Применяем бонус/штраф гильдии
    // Бонусы гильдий применяются ТОЛЬКО если это не продажа лута из НП
    if (!window.activeRiftMultiplier) {
        const g = (window.playerData.guild || "").toLowerCase();
        let guildMultiplier = 1.0; // Базовая продажа 100%
        if (g.includes('салага') || g.includes('громила') || g.includes('лорд войны')) { guildMultiplier = 0.9; bonuses.push(`Соратники -10%`); }
        if (g.includes('вампир')) { 
            const vampMults = [0.50, 0.48, 0.46, 0.44, 0.42, 0.40, 0.38, 0.36, 0.34, 0.30];
            guildMultiplier = vampMults[Math.min(playerRank, 9)] || 0.5;
            bonuses.push(`Вампир ${Math.round((guildMultiplier-1)*100)}%`); 
        }

        if (g.includes('чародей') && !g.includes('ученик')) {
            const wizPenalties = [0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.75, 0.72, 0.70];
            guildMultiplier = wizPenalties[Math.min(playerRank, 9)] || 0.9;
            bonuses.push(`Чародей ${Math.round((guildMultiplier-1)*100)}%`);
        }
        
        price = price * guildMultiplier;
    }
    // Бонус Гэмблера (х1.25)
    if ((window.playerData.guild || "").toLowerCase().includes('гэмблер')) {
        sellPrice = Math.floor(sellPrice * 1.25);
    }
    // Множитель рифта
    if (window.activeRiftMultiplier) {
        price *= window.activeRiftMultiplier;
    }
    const totalYen = Math.floor(price);
    
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";

    window.showCustomConfirm(
        `Продать предмет (Lvl ${level}, ${grade})?<br>Свойств: ${selectedProps.length} (${totalPercent}%)<br>Цена: ${window.formatCurrency(totalYen)}${bonusText}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            window.setMoneyFromYen(currentMoney + totalYen);
            window.updateUI();
            window.showCustomAlert(`✅ Предмет продан! Получено: ${window.formatCurrency(totalYen)}`);
            // Если это цепочка НП, не закрываем окно, чтобы можно было продать еще или нажать Далее
            if (!window.activeRiftMultiplier) {
                document.getElementById('sell-craft-modal').style.display = 'none';
            }
            selectedProps.forEach(el => el.classList.remove('selected'));
        }
    );
}

window.selectAGradeItem = function(el) {
    document.querySelectorAll('.selectable-item.selected').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
    window.selectedAGradeItemName = el.innerText;
    
    const display = document.getElementById('selected-agrade-item-display');
    if(display) display.innerText = `Выбрано: ${window.selectedAGradeItemName}`;
}

window.openBuySellAGradeModal = function(mode, classMult) {
    if (!window.selectedAGradeItemName) {
        window.showCustomAlert("❌ Сначала выберите предмет из списка.");
        return;
    }

    const modal = document.getElementById('buy-sell-agrade-modal');
    const title = document.getElementById('agrade-modal-title');
    const btn = document.getElementById('agrade-action-btn');
    const itemName = document.getElementById('agrade-item-name');
    
    modal.dataset.mode = mode;
    modal.dataset.classMult = classMult;
    
    itemName.innerText = window.selectedAGradeItemName;

    const handSelector = document.getElementById('hand-selector-agrade');
    const g = (window.playerData.guild || "").toLowerCase();
    if (handSelector) {
        handSelector.style.display = (g.includes('охотник') && mode === 'buy') ? 'flex' : 'none';
    }
    
    if (mode === 'buy') {
        title.innerText = "КУПИТЬ ПРЕДМЕТ (A-GRADE)";
        title.style.color = "#66ff66";
        btn.innerText = "КУПИТЬ";
        btn.className = "craft-btn buy";
    } else {
        title.innerText = "ПРОДАТЬ ПРЕДМЕТ (A-GRADE)";
        title.style.color = "#ff4444";
        btn.innerText = "ПРОДАТЬ";
        btn.className = "craft-btn sell";
    }

    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.display = 'block';
}

window.confirmBuySellAGrade = function() {
    const modal = document.getElementById('buy-sell-agrade-modal');
    const mode = modal.dataset.mode;
    const classMult = parseFloat(modal.dataset.classMult);
    const level = parseInt(document.getElementById('agrade-level-input').value) || window.playerData.level;
    const g = (window.playerData.guild || "").toLowerCase(); // Defined here for both scopes

    const basePrice = 3200 * Math.pow(1.1, level - 1);
    let bonuses = [];

    let totalPercent = 0;
    let propsList = [];
    const selectedProps = modal.querySelectorAll('.buy-prop-item.selected');

    if (selectedProps.length === 0) {
        window.showCustomAlert("❌ Выберите хотя бы одно свойство.");
        return;
    }

    selectedProps.forEach(el => {
        totalPercent += parseFloat(el.dataset.percent);
        propsList.push(el.innerText);
    });

    let finalPrice = basePrice * classMult * (totalPercent / 100);

    if (mode === 'buy') {
        // Grade Penalty Logic for Buying
        const itemGradeIdx = 4; // A grade
        const playerGradeIdx = window.getPlayerGradeIndex(window.playerData.level);
        const diff = Math.max(0, itemGradeIdx - playerGradeIdx);
        const gradePenaltyMult = 1 + (diff * 0.2);
        finalPrice *= gradePenaltyMult;
        if (gradePenaltyMult > 1) bonuses.push(`Грейд +${Math.round((gradePenaltyMult-1)*100)}%`);

        // Guild Bonus
        let isWeapon = false;
        selectedProps.forEach(el => {
            if (el.innerText.includes("Основа оружия")) isWeapon = true;
        });
        let buyMult = 1.0;
        if (g.includes('торговц')) {
            const rank = window.playerData.rank || 0;
            const buyPercents = [95, 93.5, 92.5, 91.5, 90.5, 89.5, 88.5, 87.5, 86, 84, 82.5];
            const p = buyPercents[rank] || 95;
            buyMult = p / 100;
            bonuses.push(`Торговцы ${Math.round((buyMult-1)*100)}%`);
        }
        if (isWeapon) {
            const handMult = window.getHandPenaltyMult('hand-selector-agrade');
            if (handMult > 1) {
                buyMult *= handMult;
                bonuses.push(`Охотник (Рука) +${Math.round((handMult-1)*100)}%`);
            }
        }
        // Штраф Гэмблера
        if (g.includes('гэмблер')) {
            buyMult += 0.25;
            bonuses.push(`Гэмблер +25%`);
        }
        finalPrice *= buyMult;
    }
    
    if (mode === 'sell') {
        // Vampire Penalty for selling
        if (g.includes('вампир')) {
            finalPrice *= 0.5;
            bonuses.push(`Вампир -50%`);
            }
        // Гэмблер (бонус х1.25)
        if (g.includes('гэмблер')) {
            finalPrice *= 1.25;
            bonuses.push(`Гэмблер +25%`);
        }
        // Traders bonus is already in base price? No, traders usually have bonus on sell too.
        // Adding Trader bonus for selling A-grade if applicable (assuming standard 5% base logic applies or custom)
        // The prompt didn't specify Trader bonus for A-grade sell, but usually it exists. 
        // Let's stick to the requested Vampire penalty fix for now.
    }

    const cost = Math.floor(finalPrice);
    const valError = window.validateItemAction(cost, level, "A", mode);
    if (valError) {
        window.showCustomAlert(valError);
        return;
    }
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";
    const currentMoney = window.getAllMoneyInYen();

    if (mode === 'buy') {
        if (currentMoney >= cost) {
            window.setMoneyFromYen(currentMoney - cost);
            
            window.showCustomPrompt("Название предмета", "Введите название:", window.selectedAGradeItemName || "A-Grade Item", (name) => {
                window.playerData.inventory.push({
                    id: Date.now(),
                    name: name,
                    grade: "A",
                    level: level,
                    buyPrice: cost,
                    isCrafted: false,
                    properties: propsList
                });
                window.updateUI();
                window.showCustomAlert(`✅ Предмет куплен! Списано: ${window.formatCurrency(cost)}${bonusText}`);
            }, true);

            modal.style.display = 'none';
            selectedProps.forEach(el => el.classList.remove('selected'));
        } else {
            window.showCustomAlert(`❌ Недостаточно средств! Нужно: ${window.formatCurrency(cost)}`);
        }
    } else {
        window.setMoneyFromYen(currentMoney + cost);
        window.updateUI();
        window.showCustomAlert(`✅ Предмет продан! Получено: ${window.formatCurrency(cost)}${bonusText}`);
        modal.style.display = 'none';
        selectedProps.forEach(el => el.classList.remove('selected'));
    }
}

window.openBuyAncientModal = function() {
    const modal = document.getElementById('buy-ancient-modal');
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    const handSelector = document.getElementById('hand-selector-ancient');
    const g = (window.playerData.guild || "").toLowerCase();
    if (handSelector) {
        handSelector.style.display = (g.includes('охотник')) ? 'flex' : 'none';
    }
    document.getElementById('ancient-level-input').value = window.playerData.level;
    window.updateAncientInputs(); // Initial check
    modal.style.display = 'block';
}

window.updateAncientInputs = function() {
    const grade = document.getElementById('ancient-grade-input').value;
    const classSelect = document.getElementById('ancient-item-class');
    if (!classSelect) return;
    
    if (grade === 'B') {
        classSelect.value = "1.0";
        classSelect.disabled = true;
        classSelect.style.opacity = "0.5";
    } else {
        classSelect.disabled = false;
        classSelect.style.opacity = "1";
    }
}

window.openBuySetModal = function() {
    const modal = document.getElementById('buy-set-modal');
    modal.style.top = '50%';
    modal.style.display = 'block';
}

window.openBuySetModal = function() {
    const modal = document.getElementById('buy-set-modal');
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    const handSelector = document.getElementById('hand-selector-set');
    const g = (window.playerData.guild || "").toLowerCase();
    if (handSelector) {
        handSelector.style.display = (g.includes('охотник')) ? 'flex' : 'none';
    }
    document.getElementById('set-level-input').value = window.playerData.level;
    modal.style.display = 'block';
}

window.buyAncientImmediate = function() {
        const level = parseInt(document.getElementById('ancient-level-input').value) || 1;
    const grade = document.getElementById('ancient-grade-input').value;
    const type = document.getElementById('ancient-type-input').value;
    const itemClassMultEl = document.getElementById('ancient-item-class');
    const itemClassMult = itemClassMultEl ? (parseFloat(itemClassMultEl.value) || 1.0) : 1.0;
    
    // New Formula: Base * 1.1^(level - 1)
    // B grade: 12 copper (1200 yen), A grade: 32 copper (3200 yen)
    let baseVal = (grade === 'B') ? 1200 : 3200;
    let basePrice = baseVal * Math.pow(1.1, level - 1);
    let bonuses = [];

    if (grade === 'A' && itemClassMult !== 1.0) {
        basePrice *= itemClassMult;
        bonuses.push(`Класс x${itemClassMult}`);
    }
    
    let typeMult = 1;
    if (type === 'ancient') typeMult = 1.5;
    else if (type === 'primal') typeMult = 2.5;
    
    // Grade Penalty
    const itemGradeIdx = (grade === 'B') ? 3 : 4; // B or A
    // Ancient/Primal usually implies high level, but here it's a modifier on B/A.
    // If type is ancient/primal, does it increase grade index? 
    // The prompt says "S, S+, Spectrum - 70". Ancient/Primal are modifiers.
    // Let's stick to base grade for penalty.
    const playerGradeIdx = window.getPlayerGradeIndex(window.playerData.level);
    const diff = Math.max(0, itemGradeIdx - playerGradeIdx);
    const gradePenaltyMult = 1 + (diff * 0.2);
    if (gradePenaltyMult > 1) bonuses.push(`Грейд +${Math.round((gradePenaltyMult-1)*100)}%`);

    let totalPercent = 0;
    let propsList = [];
    const modal = document.getElementById('buy-ancient-modal');
    const selectedProps = modal.querySelectorAll('.buy-prop-item.selected');
    
    if (selectedProps.length === 0) {
        window.showCustomAlert("❌ Выберите хотя бы одно свойство.");
        return;
    }
    
    let isWeapon = false;
    selectedProps.forEach(el => {
        totalPercent += parseFloat(el.dataset.percent);
        if (el.innerText.includes("Основа оружия")) isWeapon = true;
        propsList.push(el.innerText);
    });
    
    let finalPrice = basePrice * typeMult * (totalPercent / 100) * gradePenaltyMult;
    
    // Guild bonuses (same as standard buy)
    const g = (window.playerData.guild || "").toLowerCase();
    let buyMult = 1.0;
    if (g.includes('торговц')) {
        const rank = window.playerData.rank || 0;
        const buyPercents = [95, 93.5, 92.5, 91.5, 90.5, 89.5, 88.5, 87.5, 86, 84, 82.5];
        const p = buyPercents[rank] || 95;
        buyMult = p / 100;
        bonuses.push(`Торговцы ${Math.round((buyMult-1)*100)}%`);
    }
    if (isWeapon) {
        const handMult = window.getHandPenaltyMult('hand-selector-ancient');
        if (handMult > 1) {
            buyMult *= handMult;
            bonuses.push(`Охотник (Рука) +${Math.round((handMult-1)*100)}%`);
        }
          }
    // Штраф Гэмблера
    if (g.includes('гэмблер')) {
        buyMult += 0.25;
        bonuses.push(`Гэмблер +25%`);
    }
    
    finalPrice *= buyMult;
    const cost = Math.floor(finalPrice);
    const valError = window.validateItemAction(cost, level, grade, 'buy');
    if (valError) {
        window.showCustomAlert(valError);
        return;
    }
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";

    window.showCustomConfirm(
        `Купить ${type === 'ancient' ? 'Древний' : 'Первозданный'} ${grade}-grade?<br>Свойств: ${selectedProps.length} (${totalPercent}%)<br>Цена: ${window.formatCurrency(cost)}${bonusText}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            if (currentMoney >= cost) {
                window.setMoneyFromYen(currentMoney - cost);
                const defName = `${type === 'ancient' ? 'Древний' : 'Первозданный'} ${grade}`;
                window.showCustomPrompt("Название предмета", "Введите название:", defName, (name) => {
                    window.playerData.inventory.push({
                        id: Date.now(),
                        name: name,
                        grade: grade,
                        level: level,
                        buyPrice: cost,
                        isAncient: (type === 'ancient'),
                        isPrimal: (type === 'primal'),
                    isCrafted: false,
                    properties: propsList
                    });
                    window.updateUI();
                    window.showCustomAlert(`✅ Предмет куплен!`);
                }, true);

                selectedProps.forEach(el => el.classList.remove('selected'));
                modal.style.display = 'none';
            } else {
                window.showCustomAlert(`❌ Недостаточно средств!`);
            }
        }
    );
}

window.buySetImmediate = function() {
    const level = parseInt(document.getElementById('set-level-input').value) || 1;
    const grade = document.getElementById('set-grade-input').value;
    const type = document.getElementById('set-type-input').value;
    const countVal = parseInt(document.getElementById('set-count-input').value);
    let bonuses = [];
    
    // Base price is A grade: 32 copper (3200 yen) * 1.1^(level - 1)
    const baseAPrice = 3200 * Math.pow(1.1, level - 1);
    
    let gradeMult = (grade === 'S+') ? 1.56 : 4.875;
    let typeMult = (type === 'normal') ? 1 : (type === 'ancient' ? 1.5 : 2.5);
    
    // Grade Penalty
    const itemGradeIdx = 5; // S+ or Spectrum
    const playerGradeIdx = window.getPlayerGradeIndex(window.playerData.level);
    const diff = Math.max(0, itemGradeIdx - playerGradeIdx);
    const gradePenaltyMult = 1 + (diff * 0.2);
    if (gradePenaltyMult > 1) bonuses.push(`Грейд +${Math.round((gradePenaltyMult-1)*100)}%`);

    let countMult = 1;
    if (grade === 'S+') {
        if (countVal === 1) countMult = 1;
        else if (countVal === 2) countMult = 1.5; // 2-3
        else if (countVal === 4) countMult = 2;   // 4-5
        else if (countVal === 6) countMult = 4;
    } else { // Spectrum
        if (countVal === 1) countMult = 1;
        else if (countVal === 2) countMult = 2;   // 2-3
        else if (countVal === 4) countMult = 4;   // 4-5
        else if (countVal === 6) countMult = 8;
    }
    
    let totalPercent = 0;
    let propsList = [];
    const modal = document.getElementById('buy-set-modal');
    const selectedProps = modal.querySelectorAll('.buy-prop-item.selected');
    
    if (selectedProps.length === 0) {
        window.showCustomAlert("❌ Выберите хотя бы одно свойство.");
        return;
    }
    
    selectedProps.forEach(el => {
        totalPercent += parseFloat(el.dataset.percent);
        propsList.push(el.innerText);
    });
    
    let finalPrice = baseAPrice * gradeMult * typeMult * countMult * (totalPercent / 100) * gradePenaltyMult;

    // Guild bonuses
    let isWeapon = false; // Set items are not weapons, but let's check just in case.
    selectedProps.forEach(el => {
        if (el.innerText.includes("Основа оружия")) isWeapon = true;
    });
    const g = (window.playerData.guild || "").toLowerCase();
    let buyMult = 1.0;
    if (g.includes('торговц')) {
        const rank = window.playerData.rank || 0;
        const buyPercents = [95, 93.5, 92.5, 91.5, 90.5, 89.5, 88.5, 87.5, 86, 84, 82.5];
        const p = buyPercents[rank] || 95;
        buyMult = p / 100;
        bonuses.push(`Торговцы ${Math.round((buyMult-1)*100)}%`);
    }
    if (isWeapon) {
        const handMult = window.getHandPenaltyMult('hand-selector-set');
        if (handMult > 1) {
            buyMult *= handMult;
            bonuses.push(`Охотник (Рука) +${Math.round((handMult-1)*100)}%`);
        }
        }
    // Штраф Гэмблера
    if (g.includes('гэмблер')) {
        buyMult += 0.25;
        bonuses.push(`Гэмблер +25%`);
    }
    finalPrice *= buyMult;

    const cost = Math.floor(finalPrice);
    const valError = window.validateItemAction(cost, level, grade, 'buy');
    if (valError) {
        window.showCustomAlert(valError);
        return;
    }
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";

    window.showCustomConfirm(
        `Купить ${grade} (${type})?<br>Свойств: ${selectedProps.length} (${totalPercent}%)<br>Цена: ${window.formatCurrency(cost)}${bonusText}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            if (currentMoney >= cost) {
                window.setMoneyFromYen(currentMoney - cost);
                const defName = `Set ${grade} (${type})`;
                window.showCustomPrompt("Название предмета", "Введите название:", defName, (name) => {
                    window.playerData.inventory.push({
                        id: Date.now(),
                        name: name,
                        grade: grade,
                        level: level,
                        buyPrice: cost,
                        isAncient: (type === 'ancient'),
                        isPrimal: (type === 'primal'),
                        isCrafted: false,
                        properties: propsList
                    });
                    window.updateUI();
                    window.showCustomAlert(`✅ Комплект куплен!`);
                }, true);

                selectedProps.forEach(el => el.classList.remove('selected'));
                modal.style.display = 'none';
            } else {
                window.showCustomAlert(`❌ Недостаточно средств!`);
            }
        }
    );
}

window.openAddMoneyModal = function() {
     const modal = document.getElementById('add-money-modal');
    // Сброс значений
    document.getElementById('add-gold-g').value = 0;
    document.getElementById('add-gold-s').value = 0;
    document.getElementById('add-gold-c').value = 0;
    document.getElementById('add-gold-y').value = 0;
    
    // Сброс позиции
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    
    modal.style.display = 'block';
}

window.confirmAddMoney = function() {
    const g = parseInt(document.getElementById('add-gold-g').value) || 0;
    const s = parseInt(document.getElementById('add-gold-s').value) || 0;
    const c = parseInt(document.getElementById('add-gold-c').value) || 0;
    const y = parseInt(document.getElementById('add-gold-y').value) || 0;
    
    if (g === 0 && s === 0 && c === 0 && y === 0) {
        document.getElementById('add-money-modal').style.display = 'none';
        return;
    }
    
    const addedYen = (g * 1000000) + (s * 10000) + (c * 100) + y;
    const currentYen = window.getAllMoneyInYen();
    
    window.setMoneyFromYen(currentYen + addedYen);
    window.updateUI();
    
    document.getElementById('add-money-modal').style.display = 'none';
    window.showCustomAlert(`✅ Добавлено: ${window.formatCurrency(addedYen)}`);
        }

// --- КАЛЬКУЛЯТОР СЛОЖНОСТИ ---

const difficultyTable = [
    { tier: "T1", dmg: 2000000, tough: 4340000 },
    { tier: "T2", dmg: 3200000, tough: 7140000 },
    { tier: "T3", dmg: 6000000, tough: 11460000 },
    { tier: "T4", dmg: 9750000, tough: 18120000 },
    { tier: "T5", dmg: 15600000, tough: 29400000 },
    { tier: "T6", dmg: 25000000, tough: 47100000 },
    { tier: "T7", dmg: 55000000, tough: 75360000 },
    { tier: "T8", dmg: 121000000, tough: 120580000 },
    { tier: "T9", dmg: 266000000, tough: 192930000 },
    { tier: "T10", dmg: 586000000, tough: 308690000 },
    { tier: "T11", dmg: 1290000000, tough: 494000000 },
    { tier: "T12", dmg: 2830000000, tough: 790000000 },
    { tier: "T13", dmg: 6230000000, tough: 1264000000 },
    { tier: "T14", dmg: 8540000000, tough: 2023000000 },
    { tier: "T15", dmg: 18800000000, tough: 3237000000 },
    { tier: "T16", dmg: 41400000000, tough: 5179000000 }
];

window.openDifficultyCalculator = function() {
    const modal = document.getElementById('difficulty-calc-modal');
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    
    // Reset inputs
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(inp => {
        if (inp.id === 'diff-multipliers') inp.value = "";
        else if (inp.id.includes('mult')) inp.value = 1;
        else if (inp.id === 'diff-tough-multipliers') inp.value = "";
        else if (inp.type === 'text') inp.value = "";
        else inp.value = 0;
    });
    // Load saved data
    window.loadDifficultyCalcData();

    // Авто-заполнение данных напарника, если они есть
    if (window.partnerData && window.partnerData.dmg) {
        document.getElementById('diff-partner-dmg').value = window.partnerData.dmg;
        document.getElementById('diff-partner-tough').value = window.partnerData.tough;
    }

    // Auto-fetch best skill
    let maxDmg = 0;
    let bestSkillName = "Нет";
    const cls = window.playerData.className;
    const learned = window.playerData.learnedSkills || {};

    if (cls && window.skillDB[cls]) {
        for (const [sName, runes] of Object.entries(learned)) {
            // Find skill in DB
            const skillObj = window.skillDB[cls].find(s => s.name === sName);
            if (skillObj) {
                runes.forEach(rName => {
                    const runeObj = skillObj.runes.find(r => r.name === rName);
                    if (runeObj) {
                        const totalRuneDmg = (runeObj.dmg || 0) + (runeObj.dmg2 || 0) + (runeObj.passiveDmg || 0);
                        if (totalRuneDmg > maxDmg) {
                            maxDmg = totalRuneDmg;
                            bestSkillName = `${sName} (${rName})`;
                        }
                    }
                });
            }
        }
    }
    
    // Auto-fetch toughness from skills
    let skillToughTotal = 0;
    let passToughTotal = 0;
    
    // Class multipliers for auto-calc
    let armorMult = 1.0;
    let resMult = 1.0;
    let dodgeMult = 1.0;
    if (cls === "Варвар" || cls === "Крестоносец") armorMult = 0.63;
    if (cls === "Чародей" || cls === "Колдун") resMult = 0.63;
    if (cls === "Монах" || cls === "Охотник на демонов") dodgeMult = 0.63;

    if (cls && window.skillDB[cls]) {
        for (const [sName, runes] of Object.entries(learned)) {
            const skillObj = window.skillDB[cls].find(s => s.name === sName);
            if (skillObj) {
                const isPassive = skillObj.category === "Пассивные";
                runes.forEach(rName => {
                    const runeObj = skillObj.runes.find(r => r.name === rName);
                    if (runeObj) {
                        // Sum up all buffDef values
                        const buffs = [
                            { val: runeObj.buffDef || 0, type: runeObj.defType },
                            { val: runeObj.buffDef2 || 0, type: runeObj.defType2 },
                            { val: runeObj.buffDef3 || 0, type: runeObj.defType3 }
                        ];
                        
                        let runeTotal = 0;
                        buffs.forEach(b => {
                            if (b.val > 0) {
                                let mult = 1;
                                if (b.type === "armor") mult = armorMult;
                                else if (b.type === "res") mult = resMult;
                                else if (b.type === "dodge") mult = dodgeMult;
                                runeTotal += b.val * mult;
                            }
                        });

                        if (isPassive) passToughTotal += runeTotal;
                        else skillToughTotal += runeTotal;
                    }
                });
            }
        }
    }
    document.getElementById('diff-skill-tough').value = skillToughTotal;
    document.getElementById('diff-pass-tough').value = passToughTotal;

    document.getElementById('diff-skill-pct').value = maxDmg;
    document.getElementById('diff-auto-skill-name').innerText = bestSkillName;
    
    const calcInputs = modal.querySelectorAll('input');

    // Add listeners for live calculation
    calcInputs.forEach(inp => inp.oninput = window.calculateDifficulty);
    
    // Add listeners for selects
    const selects = modal.querySelectorAll('select');
    selects.forEach(sel => sel.onchange = window.calculateDifficulty);

    window.calculateDifficulty();
    modal.style.display = 'block';
}

window.calculateDifficulty = function() {
    const lvl = window.playerData.level || 1;

    // --- Pre-70 Logic ---
    if (lvl < 70) {
        let tier = "Обычный";
        if (lvl <= 19) tier = "Высокий";
        else if (lvl <= 39) tier = "Эксперт";
        else if (lvl <= 60) tier = "Мастер";
        else if (lvl <= 65) tier = "T1";
        else if (lvl <= 69) tier = "T2";

        document.getElementById('diff-result-tier').innerText = tier;
        document.getElementById('diff-result-details').innerHTML = `Уровень ${lvl} < 70.<br>Сложность определяется уровнем.`;
        document.getElementById('diff-result-tier').dataset.tier = tier;
        
        // Still calc numbers for fun, but return early for tier logic? 
        // User wants logic based on table ONLY after 70.
        // But we should still show the calculated damage numbers.
    }

    // Damage
    const heroDmg = parseFloat(document.getElementById('diff-hero-dmg').value) || 0;
   
    const skillPct = parseFloat(document.getElementById('diff-skill-pct').value) || 0;
    
    const partnerDmg = parseFloat(document.getElementById('diff-partner-dmg').value) || 0;

    // Parse Additional Multipliers (Comma separated)
    const multipliersStr = document.getElementById('diff-multipliers').value || "";
    let additionalMult = 1;
    if (multipliersStr.trim() !== "") {
        const parts = multipliersStr.split(/[,;]+/);
        parts.forEach(p => {
            const val = parseFloat(p.trim());
            if (!isNaN(val)) {
                additionalMult *= (1 + val / 100);
            }
        });
    }

    // Formula: Hero * (1 + ItemSkill%) * (Skill%/100) * (1 + Elem%) * (1 + Gems%) * Cube
    // Note: Skill% is usually e.g. 740, so we multiply by 7.4.
    // If skillPct is 0 (no skill), we assume x1 to not zero out damage? No, usually 100% weapon damage is base.
    // But here we take specific skill %. If 0, it means 0 damage from skills.
    
    const skillMult = skillPct > 0 ? (skillPct / 100) : 1;

        const totalHeroDmg = heroDmg * skillMult * additionalMult;
      const totalDmg = totalHeroDmg + partnerDmg;

    // Сохраняем рассчитанный урон героя для экспорта статистики
    window.playerData.calculated_dmg = totalHeroDmg;

    document.getElementById('diff-total-dmg').innerText = totalDmg.toLocaleString('ru-RU', { maximumFractionDigits: 0 });

    // Toughness
    const baseTough = parseFloat(document.getElementById('diff-base-tough').value) || 0;
    
    // 1. Damage Reduction (Multiplicative)
    let damageTakenMult = 1.0;
    document.querySelectorAll('.calc-reduce-dmg').forEach(inp => {
        const val = parseFloat(inp.value) || 0;
        if (val > 0 && val < 100) {
            damageTakenMult *= (1 - val / 100);
        }
    });
    const reductionMult = 1 / damageTakenMult;

    // 2. Armor/Res/Dodge
    const cls = window.playerData.className;
    let armorMult = 1.0;
    let resMult = 1.0;
    let dodgeMult = 1.0;
    
    if (cls === "Варвар" || cls === "Крестоносец") armorMult = 0.63;
    if (cls === "Чародей" || cls === "Колдун") resMult = 0.63;
    if (cls === "Монах" || cls === "Охотник на демонов") dodgeMult = 0.63;

    let armorBonus = 0;
    document.querySelectorAll('.calc-armor-pct').forEach(inp => armorBonus += (parseFloat(inp.value) || 0));
    
    let resBonus = 0;
    document.querySelectorAll('.calc-res-pct').forEach(inp => resBonus += (parseFloat(inp.value) || 0));
    
    let dodgeBonus = 0;
    document.querySelectorAll('.calc-dodge-pct').forEach(inp => dodgeBonus += (parseFloat(inp.value) || 0));

    const skillToughPct = parseFloat(document.getElementById('diff-skill-tough').value) || 0;
    const passToughPct = parseFloat(document.getElementById('diff-pass-tough').value) || 0;
    const partnerTough = parseFloat(document.getElementById('diff-partner-tough').value) || 0;

    // 4. Additional Multipliers
    const toughMultipliersStr = document.getElementById('diff-tough-multipliers').value || "";
    let additionalToughMult = 1;
    if (toughMultipliersStr.trim() !== "") {
        const parts = toughMultipliersStr.split(/[,;]+/);
        parts.forEach(p => {
            const val = parseFloat(p.trim());
            if (!isNaN(val)) {
                additionalToughMult *= (1 + val / 100);
            }
        });
    }

    const totalTough = baseTough * reductionMult 
                       * (1 + (armorBonus * armorMult)/100) 
                       * (1 + (resBonus * resMult)/100) 
                       * (1 + (dodgeBonus * dodgeMult)/100)
                       * (1 + skillToughPct / 100) 
                       * (1 + passToughPct / 100) 
                       * additionalToughMult 
                       + partnerTough;

    // Сохраняем рассчитанную живучесть героя для экспорта
    window.playerData.calculated_tough = totalTough - partnerTough; // Сохраняем только свою часть

    document.getElementById('diff-total-tough').innerText = totalTough.toLocaleString('ru-RU', { maximumFractionDigits: 0 });

    // Determine Tier
    if (lvl >= 70) {
        let dmgTier = "Ниже T1";
        let toughTier = "Ниже T1";
        let dmgIndex = -1;
        let toughIndex = -1;

        for (let i = 0; i < difficultyTable.length; i++) {
            if (totalDmg >= difficultyTable[i].dmg) {
                dmgTier = difficultyTable[i].tier;
                dmgIndex = i;
            }
            if (totalTough >= difficultyTable[i].tough) {
                toughTier = difficultyTable[i].tier;
                toughIndex = i;
            }
        }

        const maxIndex = Math.max(dmgIndex, toughIndex);
        const resultTier = maxIndex >= 0 ? difficultyTable[maxIndex].tier : "Ниже T1";

        document.getElementById('diff-result-tier').innerText = resultTier;
        document.getElementById('diff-result-details').innerHTML = `По урону: ${dmgTier}<br>По живучести: ${toughTier}`;
        document.getElementById('diff-result-tier').dataset.tier = resultTier;
    }
     // --- Правило НГ+ (Сложность +1) ---
    if (window.playerData.act > 5) {
        let currentTier = document.getElementById('diff-result-tier').innerText;
        const order = window.difficultyOrder || [];
        const idx = order.indexOf(currentTier);
        
        if (idx !== -1 && idx < order.length - 1) {
            const nextTier = order[idx + 1];
            document.getElementById('diff-result-tier').innerText = nextTier;
            document.getElementById('diff-result-tier').dataset.tier = nextTier;
            document.getElementById('diff-result-details').innerHTML += `<br><span style="color:#d4af37">NG+ (Акт ${window.playerData.act}): Сложность +1</span>`;
        }
    }

    // Save data on calculation
    window.saveDifficultyCalcData();
}

window.applyDifficulty = function() {
    const tier = document.getElementById('diff-result-tier').dataset.tier;
    window.playerData.difficulty = tier;
    window.saveToStorage();
    window.updateUI();
    document.getElementById('difficulty-calc-modal').style.display = 'none';
    window.showCustomAlert(`✅ Уровень сложности обновлен: ${tier}`);
}

window.addCalcField = function(containerId, inputClass) {
    const container = document.getElementById(containerId).querySelector('div');
    const btn = container.querySelector('button');
    
    const input = document.createElement('input');
    input.type = 'number';
    input.className = inputClass;
    input.name = inputClass;
    input.placeholder = '%';
    input.style.width = '50px';
    input.style.background = '#000'; input.style.border = '1px solid #444'; input.style.color = '#fff'; input.style.textAlign = 'center';
    input.oninput = window.calculateDifficulty;
    
    container.insertBefore(input, btn);
}

window.saveDifficultyCalcData = function() {
    const data = {
        heroDmg: document.getElementById('diff-hero-dmg').value,
        skillPct: document.getElementById('diff-skill-pct').value,
        multipliers: document.getElementById('diff-multipliers').value,
        partnerDmg: document.getElementById('diff-partner-dmg').value,
        
        baseTough: document.getElementById('diff-base-tough').value,
        skillTough: document.getElementById('diff-skill-tough').value,
        passTough: document.getElementById('diff-pass-tough').value,
        toughMultipliers: document.getElementById('diff-tough-multipliers').value,
        partnerTough: document.getElementById('diff-partner-tough').value,
        
        reduceDmg: Array.from(document.querySelectorAll('.calc-reduce-dmg')).map(i => i.value),
        armorPct: Array.from(document.querySelectorAll('.calc-armor-pct')).map(i => i.value),
        dodgePct: Array.from(document.querySelectorAll('.calc-dodge-pct')).map(i => i.value),
        resPct: Array.from(document.querySelectorAll('.calc-res-pct')).map(i => i.value)
    };
    window.playerData.diffCalcData = data;
    window.saveToStorage();
}

window.loadDifficultyCalcData = function() {
    const data = window.playerData.diffCalcData || {};
    
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if(el) el.value = val !== undefined ? val : 0;
    };
    const setStr = (id, val) => {
        const el = document.getElementById(id);
        if(el) el.value = val !== undefined ? val : "";
    };

    setVal('diff-hero-dmg', data.heroDmg);
    setVal('diff-skill-pct', data.skillPct);
    setStr('diff-multipliers', data.multipliers);
    setVal('diff-partner-dmg', data.partnerDmg);
    
    setVal('diff-base-tough', data.baseTough);
    setVal('diff-skill-tough', data.skillTough);
    setVal('diff-pass-tough', data.passTough);
    setStr('diff-tough-multipliers', data.toughMultipliers);
    setVal('diff-partner-tough', data.partnerTough);

    const restoreDynamic = (containerId, inputClass, values) => {
        const container = document.getElementById(containerId).querySelector('div');
        container.querySelectorAll('.' + inputClass).forEach(el => el.remove());
        const vals = values && values.length > 0 ? values : [""];
        vals.forEach(val => {
            const btn = container.querySelector('button');
            const input = document.createElement('input');
            input.type = 'number';
            input.className = inputClass;
            input.placeholder = '%';
            input.style.width = '50px';
            input.style.background = '#000'; input.style.border = '1px solid #444'; input.style.color = '#fff'; input.style.textAlign = 'center';
            input.value = val;
            input.oninput = window.calculateDifficulty;
            container.insertBefore(input, btn);
        });
    };

    restoreDynamic('container-reduce-dmg', 'calc-reduce-dmg', data.reduceDmg);
    restoreDynamic('container-armor-pct', 'calc-armor-pct', data.armorPct);
    restoreDynamic('container-dodge-pct', 'calc-dodge-pct', data.dodgePct);
    restoreDynamic('container-res-pct', 'calc-res-pct', data.resPct);
}

// --- НОВЫЕ ФУНКЦИИ (ПОКУПКА ЛОКАЦИЙ, ОБМЕН, КАМНИ) ---

const npCosts = {
    "Высокий": 230000, "Эксперт": 290000, "Мастер": 370000,
    "T1": 440000, "T2": 550000, "T3": 690000, "T4": 860000,
    "T5": 1080000, "T6": 1350000, "T7": 1550000, "T8": 1790000,
    "T9": 2060000, "T10": 2360000, "T11": 2720000, "T12": 3290000,
    "T13": 3610000, "T14": 3980000, "T15": 4380000, "T16": 4810000
};
window.difficultyOrder = [
    "Высокий", "Эксперт", "Мастер",
    "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8",
    "T9", "T10", "T11", "T12", "T13", "T14", "T15", "T16"
];

window.buyLocationEntry = function(type) {
    const diff = window.playerData.difficulty || "Высокий";
    let baseCost = npCosts[diff] || 440000;
    let cost = baseCost;
    let name = "НП Локация";

    if (type === 'act') {
        cost = baseCost * 0.5;
        name = "Актовая Локация";
    } else if (type === 'vp') {
        cost = baseCost * 2.5;
        name = "Великий Портал";
    }

    if (type === 'vp') {
        // Для ВП открываем выбор сложности с флагом isVP
        window.selectRiftDifficulty(cost, name, diff, true);
        return;
    }
    if (type === 'np') {
        // Для НП открываем выбор сложности
        window.selectRiftDifficulty(cost, name, diff, false);
        return;
    }
    // Скидка на НП (10% за каждый пройденный в акте, макс 50%)
    if (type === 'np') {
        const count = window.playerData.np_count || 0;
        if (count >= 6) {
            window.showCustomAlert("⚠️ В этом акте уже пройдено 6 НП (максимум).<br>Смените акт для сброса.");
            return;
        }
        const discount = Math.min(0.5, count * 0.1);
        cost = cost * (1 - discount);
        if (discount > 0) name += ` (-${discount*100}%)`;
    }

    // Охотник на гоблинов: НП на 20% дешевле (только НП и Акт, ВП обычно не скидывается, но по логике "от НП" может и скидываться. Оставим скидку на базу)
    const g = (window.playerData.guild || "").toLowerCase();
    if (g.includes('охотник на гоблинов') && type !== 'vp') {
        cost *= 0.8;
    }
    const valError = window.validateGenericAction(cost, name);
    if (valError) {
        window.showCustomAlert(valError);
        return;
    }

    

    window.showCustomConfirm(
        `Купить вход: ${name} (${diff})?<br>Стоимость: ${window.formatCurrency(Math.floor(cost))}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            if (currentMoney >= cost) {
                window.setMoneyFromYen(currentMoney - Math.floor(cost));
                window.updateUI();
                window.showCustomAlert(`✅ Вход оплачен!`);
            } else {
                window.showCustomAlert(`❌ Недостаточно средств!`);
            }
        }
    );
}

window.selectRiftDifficulty = function(cost, name, diff, isVP = false) {
    const modal = document.getElementById('rift-diff-modal');
    // Сохраняем параметры для подтверждения
    window.pendingRift = { name: name, diff: diff, isVP: isVP }; // cost не сохраняем, пересчитываем
    document.getElementById('rift-diff-cost-display').innerHTML = `Выберите уровень сложности относительно вашего текущего (${diff}):`;
    
    const container = document.getElementById('rift-diff-buttons-container');
    
    

    // Добавляем чекбокс улучшения для ВП
    let extraHtml = '';
    if (isVP) {
        extraHtml = `<div style="margin: 10px 0; text-align: center;">
            <label style="color:#d4af37; cursor:pointer; font-size: 0.9rem;">
                <input type="checkbox" id="vp-empowered" onchange="window.renderRiftButtons()"> Улучшить портал (+10% 💰)
            </label>
        </div>`;
    }

    container.innerHTML = extraHtml + '<div id="rift-buttons-list" style="display:flex; flex-direction:column; gap:5px;"></div>';
    
    window.renderRiftButtons();
    
    modal.style.display = 'flex';
}

window.renderRiftButtons = function() {
    const container = document.getElementById('rift-buttons-list');
    if (!container) return;
    
    const params = window.pendingRift;
    if (!params) return;
    
    const diff = params.diff;
    const isVP = params.isVP;
    
    // Расчет скидки
    const count = window.playerData.np_count || 0;
    const discount = isVP ? 0 : Math.min(0.5, count * 0.1); // Скидка только для НП
    const g = (window.playerData.guild || "").toLowerCase();
    const isGoblinHunter = g.includes('охотник на гоблинов');
    
    const empCheckbox = document.getElementById('vp-empowered');
    const isEmpowered = empCheckbox && empCheckbox.checked;

    const currentIndex = window.difficultyOrder.indexOf(diff);
    let html = '';
    let offsets = [];
    if (isVP) {
        // Для ВП: +0, -1, -2, -3
        offsets = [
            { val: 0, mult: "x1.75 / x1", bg: '#2d5a3a', border: '#66ff66' },
            { val: -1, mult: "x1.17 / x0.67", bg: '#444', border: '#888' },
            { val: -2, mult: "x0.78 / x0.44", bg: '#5a4a2d', border: '#d4af37' },
            { val: -3, mult: "x0.52 / x0.29", bg: '#5a2d2d', border: '#ff4444' }
        ];
    } else {
        // Для НП: +1, +0, -1, -2
        offsets = [
            { val: 1, mult: 1.5, bg: '#2d5a3a', border: '#66ff66' },
            { val: 0, mult: 1.0, bg: '#444', border: '#888' },
            { val: -1, mult: 0.66, bg: '#5a4a2d', border: '#d4af37' },
            { val: -2, mult: 0.44, bg: '#5a2d2d', border: '#ff4444' }
        ];
    }
    

    offsets.forEach(opt => {
        const targetIndex = currentIndex + opt.val;
        
        if (targetIndex >= 0 && targetIndex < window.difficultyOrder.length) {
            const targetDiff = window.difficultyOrder[targetIndex];
            let base = npCosts[targetDiff] || 440000;
            // Для ВП цена берется из таблицы НП * 2.5
            if (isVP) base = base * 2.5;
            // Применяем бонусы
            if (isGoblinHunter && !isVP) base *= 0.8; // Бонус охотника только для НП
            // Применяем улучшение (+10%)
            if (isVP && isEmpowered) base *= 1.1;
            
            const finalCost = Math.floor(base * (1 - discount));
                        const displayCost = finalCost; 
 
            const costStr = window.formatCurrency(Math.floor(displayCost));
            const label = opt.val > 0 ? `+${opt.val}` : `${opt.val}`;

// Передаем базовую стоимость в confirmRiftEntry, там накрутим 10% если надо
            html += `<button class="death-confirm-btn" style="background: ${opt.bg}; border-color: ${opt.border};" onclick="window.confirmRiftEntry(${opt.val}, ${Math.floor(displayCost)})">${label} (Награда ${isVP ? opt.mult : 'х'+opt.mult}) — ${costStr}</button>`;        } else {
            const label = opt.val > 0 ? `+${opt.val}` : `${opt.val}`;
            html += `<button class="death-confirm-btn" style="background: #333; border-color: #555; opacity: 0.5; cursor: not-allowed;" disabled>${label} — Недоступно</button>`;
        }
    });

        container.innerHTML = html;

}

window.confirmRiftEntry = function(offset, specificCost) {
    const params = window.pendingRift;
    if (!params) return;

    let finalCost = specificCost;

    // Проверка улучшения портала
    const empCheckbox = document.getElementById('vp-empowered');
    

    const currentMoney = window.getAllMoneyInYen();
    if (currentMoney >= finalCost) {
        window.setMoneyFromYen(currentMoney - Math.floor(finalCost));
        
        window.playerData.is_in_np = true;
// Увеличиваем счетчик НП только если это НЕ ВП
        if (!params.isVP) {
            window.playerData.np_count = (window.playerData.np_count || 0) + 1;
        }        window.playerData.current_run_diff = offset; // Сохраняем смещение сложности
         // Настройка режима ВП
        if (params.isVP) {
            window.playerData.is_vp = true;
         window.playerData.vp_empowered = (empCheckbox && empCheckbox.checked);
        }
                window.playerData.current_rift_cost = Math.floor(finalCost); // Запоминаем стоимость входа

        window.updateActiveRiftModal();
        
        window.updateUI();
        document.getElementById('rift-diff-modal').style.display = 'none';
const typeName = params.isVP ? "ВП" : "НП";
        window.showCustomAlert(`✅ Вход в ${typeName} оплачен!<br>Сложность: ${offset > 0 ? '+' : ''}${offset}<br>Удачи, Нефалем!`);    } else {
        window.showCustomAlert(`❌ Недостаточно средств!`);
    }
}

window.buyExtraRiftLocation = function() {
    const diff = window.playerData.difficulty || "Высокий";
    const offset = window.playerData.current_run_diff || 0;
    
    // Calculate target difficulty based on offset
        const currentIndex = window.difficultyOrder.indexOf(diff);

    const targetIndex = currentIndex + offset;
    
    if (targetIndex < 0 || targetIndex >= window.difficultyOrder.length) {
        window.showCustomAlert("Ошибка определения сложности.");
        return;
    }
    
    const targetDiff = window.difficultyOrder[targetIndex];
    let baseCost = npCosts[targetDiff] || 440000;
    
    let finalCost = 0;

    if (window.playerData.is_vp) {
        // Логика цены для ВП
        baseCost *= 2.5; // Базовая наценка ВП
        if (window.playerData.vp_empowered) {
            baseCost *= 1.1; // Наценка за улучшение
        }
        finalCost = Math.floor(baseCost);
    } else {
        // Логика цены для НП
        const g = (window.playerData.guild || "").toLowerCase();
        if (g.includes('охотник на гоблинов')) {
            baseCost *= 0.8;
        }
        
        // Скидка за кол-во пройденных НП
        const count = window.playerData.np_count || 1;
        const discount = Math.min(0.5, Math.max(0, (count - 1) * 0.1));
        finalCost = Math.floor(baseCost * (1 - discount));
    }
    
    const currentMoney = window.getAllMoneyInYen();
    if (currentMoney >= finalCost) {
        window.setMoneyFromYen(currentMoney - finalCost);
                window.playerData.current_rift_cost = (window.playerData.current_rift_cost || 0) + finalCost; // Добавляем к затратам

        window.updateUI();
        window.showCustomAlert(`✅ Доп. локация оплачена!<br>Списано: ${window.formatCurrency(finalCost)}`);
    } else {
        window.showCustomAlert(`❌ Недостаточно средств! Нужно: ${window.formatCurrency(finalCost)}`);
    }
}

window.closeNephalemRift = function(success) {
    if (!window.playerData.is_in_np) {
        window.showCustomAlert("⚠️ Вы не находитесь в Нефалемском портале.");
        return;
        }

    // Логика закрытия ВП
    if (window.playerData.is_vp) {
        if (!success) {
            // Провал (отмена)
            window.playerData.is_vp = false;
            
            window.playerData.is_in_np = false;
            window.playerData.vp_is_solo = false;
window.playerData.vp_empowered = false;
            window.playerData.current_rift_cost = 0; // Сброс затрат при провале
            window.playerData.saved_rift_multiplier = null;
            window.playerData.saved_rift_exp_multiplier = null;

            window.saveToStorage();
            window.updateActiveRiftModal();
            window.showCustomAlert("❌ ВП провален. Награды потеряны.");
            return;
        }

        // Успех (закрытие) - спрашиваем время
        let options = `<option value=">15">> 15 мин</option>`;
        for (let i = 15; i >= 1; i--) {
            options += `<option value="${i}">${i} мин</option>`;
        }
        
        const msg = `<p>Выберите время прохождения:</p><select id="vp-close-time" style="background:#000; color:#fff; padding:5px; font-size:1rem;">${options}</select>`;
        
        window.showCustomConfirm(msg, () => {
            const timeVal = document.getElementById('vp-close-time').value;
            window.finishVPClose(timeVal);
        });
        return;
    }

     // Скрываем модальное окно блокировки
    document.getElementById('active-rift-modal').style.display = 'none';

    window.playerData.is_in_np = false;
    window.saveToStorage();

   

    // Расчет множителя наград
    const offset = window.playerData.current_run_diff || 0;
    let multiplier = 1.0;
    if (offset === 1) multiplier = 1.5;
    else if (offset === 0) multiplier = 1.0;
    else if (offset === -1) multiplier = 0.66;
    else if (offset === -2) multiplier = 0.44;

    window.activeRiftMultiplier = multiplier;

    window.riftSuccess = success;
    if (success) {
        window.showCustomAlert(`✅ Портал закрыт!<br>Множитель наград: x${multiplier}<br>Приступаем к подсчету...`);
    } else {
        window.showCustomAlert(`❌ Портал не закрыт.<br>Множитель наград: x${multiplier}<br>Приступаем к подсчету (без Босса)...`);
    }
    
    // Запуск цепочки окон
    setTimeout(() => {
        window.nextRiftSequenceStep(1);
    }, 1500);
}

window.finishVPClose = function(timeVal) {
    const offset = window.playerData.current_run_diff || 0;
    
    // 1. Множитель времени
    const timeMultMap = {
        ">15": 2.0, "15": 1.8, "14": 1.6, "13": 1.4, "12": 1.2, "11": 1.1,
        "10": 1.0, "9": 0.8, "8": 0.6, "7": 0.4, "6": 0.3, "5": 0.2,
        "4": 0.1, "3": 0.066, "2": 0, "1": 0
    };
    const timeMult = timeMultMap[timeVal] || 0;

    // 2. Множитель сложности (В зависимости от того, уложились ли в 15 мин)
    // Если время > 15, значит НЕ вовремя.
    const isLate = (timeVal === ">15"); 
    
    let diffMult = 1.0;
    if (isLate) {
        // НЕ ВОВРЕМЯ
        if (offset === 0) diffMult = 1.0;
        else if (offset === -1) diffMult = 0.67;
        else if (offset === -2) diffMult = 0.44;
        else if (offset === -3) diffMult = 0.29;
    } else {
        // ВОВРЕМЯ
        if (offset === 0) diffMult = 1.75;
        else if (offset === -1) diffMult = 1.17;
        else if (offset === -2) diffMult = 0.78;
        else if (offset === -3) diffMult = 0.52;
    }

    const totalMultiplier = timeMult * diffMult;
    window.activeRiftMultiplier = totalMultiplier;
    // Возврат 25% стоимости, если вовремя
    let refundMsg = "";
    if (!isLate) {
        const totalCost = window.playerData.current_rift_cost || 0;
        if (totalCost > 0) {
            const refund = Math.floor(totalCost * 0.25);
            window.addYen(refund);
            refundMsg = `<br><span style="color:#66ff66">Возврат 25%: ${window.formatCurrency(refund)}</span>`;
        }
    }


    // Устанавливаем режим закрытия ВП для калькулятора опыта
    window.playerData.vp_close_mode = true;

    document.getElementById('active-rift-modal').style.display = 'none';
    window.saveToStorage();
    window.updateUI();

    window.showCustomAlert(`✅ ВП закрыт!<br>Время: ${timeVal} мин<br>Множитель: x${totalMultiplier.toFixed(2)}${refundMsg}<br>Введите статистику убийств для начисления наград.`);
    
    setTimeout(() => {
        window.nextRiftSequenceStep(1); // Открываем калькулятор опыта
    }, 1500);
}

window.nextRiftSequenceStep = function(step) {
    // 1. Опыт -> 2. Опт. продажа -> 3. Штучная продажа -> 4. Ресурсы -> 5. Камни
    switch(step) {
        case 1: // Опыт
            window.openExpCalculator();
            
            const expBtn = document.querySelector('#exp-calc-modal .exp-apply-btn');
            expBtn.onclick = function() {
                window.applyExpCalculation(); // Стандартная логика
                // Переход только если активен рифт
                if (window.activeRiftMultiplier) setTimeout(() => window.nextRiftSequenceStep(2), 500);
            };
            break;
        case 2: // Опт продажа
            window.sellItemsBulk();
            
            break;
        // ... (остальные шаги реализуем через модификацию самих функций, чтобы они поддерживали callback)
    }
}

window.updateActiveRiftModal = function() {
    const modal = document.getElementById('active-rift-modal');
    if (!window.playerData.is_in_np) {
        modal.style.display = 'none';
        return;
    }
    
    const diff = window.playerData.difficulty || "Высокий";
    const offset = window.playerData.current_run_diff || 0;
    const act = window.playerData.act || 1;
    const count = window.playerData.np_count || 1;
    
    const diffLabel = offset > 0 ? `+${offset}` : (offset < 0 ? `${offset}` : `+0`);
    
    document.getElementById('active-rift-info').innerHTML = `
        Сложность: <span style="color:#fff">${diff} (${diffLabel})</span><br>
        Акт: <span style="color:#d4af37">${act}</span> | Портал №: <span style="color:#d4af37">${count}</span>
    `;
    
    modal.style.display = 'flex';
}


window.exchangeRunesForPara = function() {
    window.showCustomPrompt("Обмен Рун на Парагон", "Курс: 1.5 📖 = 1 ⏳<br>Сколько ⏳ хотите получить?", "1", (amount) => {
        if (isNaN(amount) || amount <= 0) return;
        const cost = amount * 1.5;
        
        if (window.playerData.runes >= cost) {
            window.playerData.runes = parseFloat((window.playerData.runes - cost).toFixed(2));
            window.playerData.para = parseFloat((window.playerData.para + amount).toFixed(2));
            window.saveToStorage();
            window.updateUI();
            window.showCustomAlert(`✅ Обменяно ${cost} 📖 на ${amount} ⏳`);
        } else {
            window.showCustomAlert(`❌ Недостаточно рун! Нужно: ${cost}`);
        }
    });
}

window.manageLegendaryGem = function(classType, action) {
    let cost = 0;
    if (classType === 3) cost = 1500000; // 1.5g
    else if (classType === 2) cost = 4500000; // 4.5g
    else if (classType === 1) cost = 7000000; // 7g

    const g = (window.playerData.guild || "").toLowerCase();
    if (g.includes('торговц') && (action === 'insert' || action === 'remove')) {
        cost = 0;
    }

    const actionName = action === 'insert' ? "Вставить" : "Убрать";
    
    window.showCustomConfirm(
        `${actionName} Легендарный камень (${classType} кл.)?<br>Стоимость: ${window.formatCurrency(cost)}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            if (currentMoney >= cost) {
                window.setMoneyFromYen(currentMoney - cost);
                window.updateUI();
                window.showCustomAlert(`✅ Оплачено: ${window.formatCurrency(cost)}`);
            } else {
                window.showCustomAlert(`❌ Недостаточно средств!`);
            }
        }
    );
}

window.sellLegendaryGem = function() {
    const modal = document.getElementById('sell-leg-gem-modal');
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.display = 'block';
}

// --- ПОКУПКА ПРЕДМЕТОВ (MODAL) ---

window.toggleBuyProperty = function(el, percent) {
    const propName = el.innerText;
    const bases = ["Основа оружия", "Основа брони", "Основа бижы"];
    
    if (bases.includes(propName) && !el.classList.contains('selected')) {
        // Если выбираем основу, снимаем выбор с других основ
        const allSelected = document.querySelectorAll('.buy-prop-item.selected');
        allSelected.forEach(sel => {
            if (bases.includes(sel.innerText) && sel !== el) {
                sel.classList.remove('selected');
            }
        });
    }

    el.classList.toggle('selected');
    el.dataset.percent = percent;
}

window.buyItemImmediate = function() {
    const level = parseInt(document.getElementById('buy-item-level-input').value) || 1;
    const grade = document.getElementById('buy-item-grade-input').value;
    let bonuses = [];
    
    const basePrice = getCraftedItemBasePrice(level, grade); 
    
    // Grade Penalty
    const itemGradeIdx = window.getGradeIndex(grade);
    const playerGradeIdx = window.getPlayerGradeIndex(window.playerData.level);
    const diff = Math.max(0, itemGradeIdx - playerGradeIdx);
    const gradePenaltyMult = 1 + (diff * 0.2);
    if (gradePenaltyMult > 1) bonuses.push(`Грейд +${Math.round((gradePenaltyMult-1)*100)}%`);

    let totalPercent = 0;
    const container = document.getElementById('window-content');
    const selectedProps = container ? container.querySelectorAll('.buy-prop-item.selected') : [];
    if (selectedProps.length === 0) {
        window.showCustomAlert("❌ Выберите хотя бы одно свойство.");
        return;
    }
    
    let isWeapon = false;
    selectedProps.forEach(el => {
        totalPercent += parseFloat(el.dataset.percent);
        if (el.innerText.includes("Основа оружия")) isWeapon = true;
    });
    
    let finalPrice = basePrice * (totalPercent / 100) * gradePenaltyMult;
    
    const g = (window.playerData.guild || "").toLowerCase();
    let buyMult = 1.0;
    
    if (g.includes('торговц')) {
        const rank = window.playerData.rank || 0;
        const buyPercents = [95, 93.5, 92.5, 91.5, 90.5, 89.5, 88.5, 87.5, 86, 84, 82.5];
        const p = buyPercents[rank] || 95;
        buyMult = p / 100;
        bonuses.push(`Торговцы ${Math.round((buyMult-1)*100)}%`);
    }
    
    if (isWeapon) {
        if (g.includes('охотник на гоблинов')) { buyMult += 0.5; bonuses.push(`Охотник +50%`); }
        else if (g.includes('охотник на ☠️')) { buyMult += 0.25; bonuses.push(`Охотник +25%`); }
        else if (g.includes('помощник охотника')) { buyMult += 0.10; bonuses.push(`Охотник +10%`); }
          }

    // Штраф Гэмблера на покупку выпавших (обычных) предметов
    if (g.includes('гэмблер')) {
        buyMult += 0.25;
        bonuses.push(`Гэмблер +25%`);
    
    }
    
    finalPrice *= buyMult;
    const cost = Math.floor(finalPrice);
    const valError = window.validateItemAction(cost, level, grade, 'buy');
    if (valError) {
        window.showCustomAlert(valError);
        return;
    }
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";

    window.showCustomConfirm(
        `Купить предмет (Lvl ${level}, ${grade})?<br>Свойств: ${selectedProps.length} (${totalPercent}%)<br>Цена: ${window.formatCurrency(cost)}${bonusText}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            if (currentMoney >= cost) {
                window.setMoneyFromYen(currentMoney - cost);
                const defName = `Item ${grade}-Grade`;
                window.showCustomPrompt("Название предмета", "Введите название:", defName, (name) => {
                    window.playerData.inventory.push({
                        id: Date.now(),
                        name: name,
                        grade: grade,
                        level: level,
                        buyPrice: cost
                    });
                    window.updateUI();
                    window.showCustomAlert(`✅ Предмет куплен!`);
                }, true);

                selectedProps.forEach(el => el.classList.remove('selected'));
            } else {
                window.showCustomAlert(`❌ Недостаточно средств!`);
            }
        }
    );
}

window.confirmSellLegendaryGem = function() {
    const classType = parseInt(document.getElementById('sell-gem-class').value);
    const level = parseInt(document.getElementById('sell-gem-level').value);
    
    if (isNaN(level) || level < 0) {
        window.showCustomAlert("❌ Некорректный уровень.");
        return;
    }
    
    let baseVal = 0;
    if (classType === 3) baseVal = 1500000 * 0.05; // 1.5g
    else if (classType === 2) baseVal = 4500000 * 0.05; // 4.5g
    else if (classType === 1) baseVal = 7000000 * 0.05; // 7g
    
    const g = (window.playerData.guild || "").toLowerCase();
    const playerRank = window.playerData.rank || 0;
    let sellMult = 1.0;
    let bonuses = [];

    if (g.includes('торговц')) {
         const sellPercents = [10, 13, 15, 17, 19, 21, 23, 25, 28, 32, 35];
         const p = sellPercents[playerRank] || 10;
         sellMult = p / 5;
         bonuses.push(`Торговцы x${sellMult.toFixed(2)}`);
    }
    if (g.includes('вампир')) {
        sellMult *= 0.5;
        bonuses.push(`Вампир -50%`);
         // Гэмблер х1.25
        if (g.includes('гэмблер')) { sellMult *= 1.25; bonuses.push(`Гэмблер +25%`); }
    }

    const sellPrice = baseVal * Math.pow(1.1, level) * sellMult;
    const totalYen = Math.floor(sellPrice);
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";

    window.showCustomConfirm(
        `Продать Лег. камень (Кл. ${classType}, Ур. ${level})?<br>Цена: ${window.formatCurrency(totalYen)}${bonusText}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            window.setMoneyFromYen(currentMoney + totalYen);
            window.updateUI();
            document.getElementById('sell-leg-gem-modal').style.display = 'none';
            window.showCustomAlert(`✅ Камень продан! Получено: ${window.formatCurrency(totalYen)}`);
        }
    );
}

// --- НОВЫЕ ФУНКЦИИ ---

window.openCraftModal = function() {
    const modal = document.getElementById('sell-craft-modal');
    const title = modal.querySelector('h3');
    let btn = document.getElementById('craft-sell-action-btn');
    if (!btn) btn = modal.querySelector('.craft-btn'); // Доп. поиск кнопки, если ID не найден
    
    // Change UI for Crafting
    title.innerText = "⚒️ КРАФТ ПРЕДМЕТА";
    title.style.color = "#a29bfe";
    if (btn) {
        btn.innerText = "СКРАФТИТЬ";
        btn.className = "craft-btn craft";
        btn.onclick = window.craftItemFromModal;
    }
    const handSelector = document.getElementById('hand-selector-craft');
    const g = (window.playerData.guild || "").toLowerCase();
    if (handSelector) {
        handSelector.style.display = (g.includes('охотник')) ? 'flex' : 'none';
    }
    
    // Set level default
    document.getElementById('modal-sell-level').value = window.playerData.level || 1;

    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.display = 'block';
}

window.craftItemFromModal = function() {
    const level = parseInt(document.getElementById('modal-sell-level').value) || 1;
    const grade = document.getElementById('modal-sell-grade').value;
    let bonuses = [];
    
    // Base Price
    let price = getCraftedItemBasePrice(level, grade);

    // Properties
    let totalPercent = 0;
    let propsList = [];
    const modal = document.getElementById('sell-craft-modal');
    const selectedProps = modal.querySelectorAll('.sell-prop-item.selected');
    if (selectedProps.length === 0) {
        window.showCustomAlert("❌ Выберите хотя бы одно свойство.");
        return;
    }
    
    let isWeapon = false;
    selectedProps.forEach(el => {
        totalPercent += parseFloat(el.dataset.percent);
        if (el.innerText.includes("Основа оружия")) isWeapon = true;
        propsList.push(el.innerText);
    });

    // Grade Penalty
    const itemGradeIdx = window.getGradeIndex(grade);
    const playerGradeIdx = window.getPlayerGradeIndex(window.playerData.level);
    const diff = Math.max(0, itemGradeIdx - playerGradeIdx);
    const gradePenaltyMult = 1 + (diff * 0.2);
    if (gradePenaltyMult > 1) bonuses.push(`Грейд +${Math.round((gradePenaltyMult-1)*100)}%`);

    // Guild Bonuses (Same as Buy)
    const g = (window.playerData.guild || "").toLowerCase();
    let buyMult = 1.0;
    if (g.includes('торговц')) {
        const rank = window.playerData.rank || 0;
        const buyPercents = [95, 93.5, 92.5, 91.5, 90.5, 89.5, 88.5, 87.5, 86, 84, 82.5];
        const p = buyPercents[rank] || 95;
        buyMult = p / 100;
        bonuses.push(`Торговцы ${Math.round((buyMult-1)*100)}%`);
    }
    if (isWeapon) {
        const handMult = window.getHandPenaltyMult('hand-selector-craft');
        if (handMult > 1) {
            buyMult *= handMult;
            bonuses.push(`Охотник (Рука) +${Math.round((handMult-1)*100)}%`);
        }
    }

    // Crafting Multiplier (150%)
    let craftMult = 1.5;
    if (g.includes('салага')) { craftMult = 1.3; bonuses.push(`Соратники (130%)`); }
    else if (g.includes('громила')) { craftMult = 1.15; bonuses.push(`Соратники (115%)`); }
    else if (g.includes('лорд войны')) { craftMult = 1.05; bonuses.push(`Соратники (105%)`); }

    const finalPrice = Math.floor(price * (totalPercent / 100) * gradePenaltyMult * buyMult * craftMult);
    const valError = window.validateItemAction(finalPrice, level, grade, 'craft');
    if (valError) {
        window.showCustomAlert(valError);
        return;
    }
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";
    
    window.showCustomConfirm(
        `Скрафтить предмет (Lvl ${level}, ${grade})?<br>Свойств: ${selectedProps.length} (${totalPercent}%)<br>Цена: ${window.formatCurrency(finalPrice)}${bonusText}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            if (currentMoney >= finalPrice) {
                window.setMoneyFromYen(currentMoney - finalPrice);
                const defName = `Crafted ${grade}-Grade`;
                window.showCustomPrompt("Название предмета", "Введите название:", defName, (name) => {
                    window.playerData.inventory.push({
                        id: Date.now(),
                        name: name,
                        grade: grade,
                        level: level,
                        buyPrice: finalPrice,
                        isCrafted: true,
                        properties: propsList
                    });
                    window.updateUI();
                    
                    if (window.craftSound) {
                        window.craftSound.currentTime = 0;
                        window.craftSound.play().catch(() => {});
                    }
                    window.showCustomAlert(`✅ Предмет скрафчен!`);
                }, true);

                document.getElementById('sell-craft-modal').style.display = 'none';
                selectedProps.forEach(el => el.classList.remove('selected'));
            } else {
                window.showCustomAlert(`❌ Недостаточно средств!`);
            }
        }
    );
}

window.openMeltModal = function() {
    const modal = document.getElementById('melt-item-modal');
    if (document.getElementById('melt-level')) {
        document.getElementById('melt-level').value = window.playerData.level;
    }
    modal.style.display = 'block';
}

window.confirmMeltItem = function() {
    const level = parseInt(document.getElementById('melt-level').value) || 1;
    const grade = document.getElementById('melt-grade').value;
    const type = document.getElementById('melt-type').value;
    // Множитель рифта не влияет на расплавку (обычно), но если надо:
    // const riftMult = window.activeRiftMultiplier || 1;
    // Но в ТЗ про расплавку не сказано, только про продажу. Оставим как есть.
    let bonuses = [];

    // Calculate "Buy Price" to determine melt value
    // Base
    let baseVal = 0;
    // Simplified base val logic from getCraftedItemBasePrice but accounting for type
    if (grade === 'S+' || grade === 'Spectrum' || grade === 'S') {
        baseVal = 3200; // A grade base
        if (grade === 'S') baseVal *= 1.5;
        if (grade === 'S+') baseVal *= 1.56;
        if (grade === 'Spectrum') baseVal *= 4.875;
    } else {
        baseVal = getCraftedItemBasePrice(level, grade) / Math.pow(1.1, level - 1); // Extract base
        // Actually getCraftedItemBasePrice returns full price for level.
        // Let's use it directly.
        baseVal = getCraftedItemBasePrice(level, grade);
    }

    let typeMult = 1;
    if (type === 'ancient') typeMult = 1.5;
    if (type === 'primal') typeMult = 2.5;

    // Assume 100% properties for calculation base? Or average?
    // "4.4% of its price". Usually implies the price YOU paid or market price.
    // Let's assume standard 100% properties price.
    const estimatedBuyPrice = baseVal * typeMult; 
    
    const meltValue = Math.floor(estimatedBuyPrice * 0.044);
    let finalMeltValue = meltValue;

    // Бонус Торговцев: +2% к деньгам за каждые 100 Живучести
    const g = (window.playerData.guild || "").toLowerCase();
    if (g.includes('торговц')) {
        const vit = window.playerData.stat_vit || 0;
        const bonusMult = 1 + (Math.floor(vit / 100) * 0.02);
        finalMeltValue = Math.floor(meltValue * bonusMult);
        if (bonusMult > 1) bonuses.push(`Торговцы +${Math.round((bonusMult-1)*100)}%`);
    }
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";

    window.showCustomConfirm(
        `Расплавить предмет?<br>Получите: ${window.formatCurrency(finalMeltValue)}${bonusText}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            window.setMoneyFromYen(currentMoney + finalMeltValue);
            window.updateUI();
            const m = document.getElementById('melt-item-modal');
            if(m) m.style.display = 'none';
            window.showCustomAlert(`✅ Предмет расплавлен!`);
        }
    );
}

window.openSellInventory = function(mode) {
    const inv = window.playerData.inventory || [];
    const playerRank = window.playerData.rank || 0;
    // Фильтрация
    let itemsToShow = [];
    let title = "";
    
    if (mode === 'smith') {
        title = "⚒️ ПРОДАЖА КРАФТА (100%)";
        itemsToShow = inv.filter(i => i.isCrafted);
    } else {
        title = "💰 ПРОДАЖА ПРЕДМЕТОВ (50%)";
        itemsToShow = inv; // Вендор покупает всё
    }

    if (itemsToShow.length === 0) {
        window.showCustomAlert(mode === 'smith' ? "🎒 Нет скрафченных предметов." : "🎒 Инвентарь пуст.");
        return;
    }

    // Create a prompt-like list
    let html = `<h3 style="color:${mode === 'smith' ? '#d4af37' : '#ff4444'}; margin-top:0; text-align:center;">${title}</h3>`;
    html += `<div style="max-height: 300px; overflow-y: auto; text-align: left;">`;
    
    itemsToShow.forEach((item) => {
        // Расчет цены
        let sellPrice = 0;
        if (mode === 'smith') {
            // Продажа крафта: 100% от стоимости (База * Свойства)
            const basePrice = getCraftedItemBasePrice(item.level, item.grade);
            
            // Восстанавливаем процент от свойств
            let totalPercent = 0;
            if (item.properties && item.properties.length > 0) {
                const propMap = {
                   "Основа оружия": 40,
                    "Основа брони": 30, "Основа бижы": 30, "Живучесть": 30, "Осн.Хар.": 30, "Гнездо (голова/оруж)": 30,
                    "Восстановление": 20,
                    "Все сопротивления": 15, "Крит урон": 15, "Крит шанс": 15,
                    "Не Осн.Хар.": 10, "Броня": 10, "Здоровье": 10, "Ур. в бижутерии": 10,
                    "Скор. атак": 10, "Гнездо (броня)": 10, "Урон стихии": 10, "Урон умения": 10,
                    "+ Ур. к скилу": 10, "Сниж. затрат / КДР": 10, "Урон по области": 10,
                    "Одно сопрот.": 5, "Скор. передвижения": 5, "Урон уменьшен": 5
                };
                item.properties.forEach(p => {
                    totalPercent += (propMap[p] || 0);
                });
            } else {
                // Если свойств нет (старый предмет), берем приблизительно из цены покупки
                totalPercent = 100; 
            }
            
            sellPrice = Math.floor(basePrice * (totalPercent / 100));

            // Множитель рифта
            if (window.activeRiftMultiplier) {
                sellPrice = Math.floor(sellPrice * window.activeRiftMultiplier);
            }

            // Бонус/Штраф гильдии для крафта (репликация логики sellCraftedItemFromModal)
            const g = (window.playerData.guild || "").toLowerCase();
            if (g.includes('салага') || g.includes('громила') || g.includes('лорд войны')) sellPrice = Math.floor(sellPrice * 0.9);
        if (g.includes('вампир')) {
                const vampMults = [0.50, 0.48, 0.46, 0.44, 0.42, 0.40, 0.38, 0.36, 0.34, 0.30];
                const mult = vampMults[Math.min(playerRank, 9)] || 0.5;
                sellPrice = Math.floor(sellPrice * mult);
            }
            if (g.includes('чародей') && !g.includes('ученик')) {
                const wizPenalties = [0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.75, 0.72, 0.70];
                const mult = wizPenalties[Math.min(playerRank, 9)] || 0.9;
                sellPrice = Math.floor(sellPrice * mult);
            }
        } else {
            // Вендор: 50% от цены покупки
            sellPrice = Math.floor(item.buyPrice * 0.5);
            
            // Штраф вампира на продажу
            const g = (window.playerData.guild || "").toLowerCase();
            if (g.includes('вампир')) {
                const vampMults = [0.50, 0.48, 0.46, 0.44, 0.42, 0.40, 0.38, 0.36, 0.34, 0.30];
                const mult = vampMults[Math.min(playerRank, 9)] || 0.5;
                sellPrice = Math.floor(sellPrice * mult); // Применяется к уже 50% базе? Или заменяет?
                // Обычно штрафы мультипликативны. 50% база * 0.5 штраф = 25% итог.
            }
            if (g.includes('чародей') && !g.includes('ученик')) {
                const wizPenalties = [0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.75, 0.72, 0.70];
                const mult = wizPenalties[Math.min(playerRank, 9)] || 0.9;
                sellPrice = Math.floor(sellPrice * mult);
            }
            // Бонусы Воров (х1.5 / х1.2)
        if (g.includes('вор') && !g.includes('воришка')) sellPrice = Math.floor(sellPrice * 1.5);
        if (g.includes('воришка')) sellPrice = Math.floor(sellPrice * 1.2);
            // Множитель рифта
            if (window.activeRiftMultiplier) {
                sellPrice = Math.floor(sellPrice * window.activeRiftMultiplier);
            }
        }

        html += `<div style="border-bottom: 1px solid #333; padding: 5px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size:0.9rem;">${item.name} <span style="color:#888">(${item.grade})</span></span>
            <button class="craft-btn sell" style="font-size: 0.7rem; padding: 2px 5px;" onclick="window.processSellItem(${item.id}, ${sellPrice})">Продать (${window.formatCurrency(sellPrice)})</button>
        </div>`;
    });
    html += `</div>`;
    // Кнопка закрытия/далее
    let closeAction = "document.getElementById('custom-confirm-modal').style.display='none'";
    let closeText = "ЗАКРЫТЬ";
    if (window.activeRiftMultiplier && mode === 'smith') {
        // Если это часть цепочки, то после штучной продажи идем к ресурсам
        closeAction = "document.getElementById('custom-confirm-modal').style.display='none'; window.sellResources();";
        closeText = "ДАЛЕЕ (Ресурсы) >>";
    }
    html += `<div style="text-align:center; margin-top:10px;"><button class="death-cancel-btn" onclick="${closeAction}">${closeText}</button></div>`;
    window.showCustomAlert(html); // Reusing alert modal for list, but buttons inside work
    // Need to hide the OK button of alert
    document.getElementById('confirm-yes-btn').style.display = 'none';
}

window.processSellItem = function(itemId, sellPrice) {
    const index = window.playerData.inventory.findIndex(i => i.id === itemId);
    if (index === -1) return;
    const item = window.playerData.inventory[index];
    
    window.playerData.inventory.splice(index, 1);
    const currentMoney = window.getAllMoneyInYen();
    window.setMoneyFromYen(currentMoney + sellPrice);
    
    window.updateUI();
    document.getElementById('custom-confirm-modal').style.display = 'none'; // Close list
    window.showCustomAlert(`✅ Продано: ${item.name} за ${window.formatCurrency(sellPrice)}`);
}

window.buyItemImmediate = function() {
    if (!document.getElementById('buy-item-level-input')) return; // Fix for null error
    const level = parseInt(document.getElementById('buy-item-level-input').value) || 1;
    const grade = document.getElementById('buy-item-grade-input').value;
    let bonuses = [];
    
    const basePrice = getCraftedItemBasePrice(level, grade); 
    
    // Grade Penalty
    const itemGradeIdx = window.getGradeIndex(grade);
    const playerGradeIdx = window.getPlayerGradeIndex(window.playerData.level);
    const diff = Math.max(0, itemGradeIdx - playerGradeIdx);
    const gradePenaltyMult = 1 + (diff * 0.2);
    if (gradePenaltyMult > 1) bonuses.push(`Грейд +${Math.round((gradePenaltyMult-1)*100)}%`);

    let totalPercent = 0;
    const container = document.getElementById('window-content');
    const selectedProps = container ? container.querySelectorAll('.buy-prop-item.selected') : [];
    if (selectedProps.length === 0) {
        window.showCustomAlert("❌ Выберите хотя бы одно свойство.");
        return;
    }
    
    let isWeapon = false;
    let propsList = [];
    selectedProps.forEach(el => {
        totalPercent += parseFloat(el.dataset.percent);
        if (el.innerText.includes("Основа оружия")) isWeapon = true;
        propsList.push(el.innerText);
    });
    
    let finalPrice = basePrice * (totalPercent / 100) * gradePenaltyMult;
    
    const g = (window.playerData.guild || "").toLowerCase();
    let buyMult = 1.0;
    
    if (g.includes('торговц')) {
        const rank = window.playerData.rank || 0;
        const buyPercents = [95, 93.5, 92.5, 91.5, 90.5, 89.5, 88.5, 87.5, 86, 84, 82.5];
        const p = buyPercents[rank] || 95;
        buyMult = p / 100;
        bonuses.push(`Торговцы ${Math.round((buyMult-1)*100)}%`);
    }
    
    if (isWeapon) {
        const handMult = window.getHandPenaltyMult('hand-selector-main');
        if (handMult > 1) {
            buyMult *= handMult;
            bonuses.push(`Охотник (Рука) +${Math.round((handMult-1)*100)}%`);
        }
    }
    
    finalPrice *= buyMult;
    const cost = Math.floor(finalPrice);
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";

    window.showCustomConfirm(
        `Купить предмет (Lvl ${level}, ${grade})?<br>Свойств: ${selectedProps.length} (${totalPercent}%)<br>Цена: ${window.formatCurrency(cost)}${bonusText}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            if (currentMoney >= cost) {
                window.setMoneyFromYen(currentMoney - cost);
                const defName = `Item ${grade}-Grade`;
                window.showCustomPrompt("Название предмета", "Введите название:", defName, (name) => {
                    window.playerData.inventory.push({
                        id: Date.now(),
                        name: name,
                        grade: grade,
                        level: level,
                        buyPrice: cost,
                        isAncient: false,
                        isPrimal: false,
                        isCrafted: false,
                        properties: propsList
                    });
                    window.updateUI();
                    window.showCustomAlert(`✅ Предмет куплен!`);
                }, true);

                selectedProps.forEach(el => el.classList.remove('selected'));
            } else {
                window.showCustomAlert(`❌ Недостаточно средств!`);
            }
        }
    );
}
// --- ЛОГИКА ЗАЧАРОВАНИЯ (ИЗМЕНЕНИЕ СВОЙСТВ) ---

window.openEnchantModal = function() {
    const modal = document.getElementById('enchant-item-modal');
    const list = document.getElementById('enchant-inventory-list');
    const selector = document.getElementById('enchant-properties-selector');
    const subtitle = document.getElementById('enchant-subtitle');
    // Сброс позиции
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    list.style.display = 'block';
    selector.style.display = 'none';
    subtitle.innerText = "Выберите предмет (N и D грейды нельзя менять).";

    const inv = window.playerData.inventory || [];
    const validItems = inv.filter(i => i.grade !== 'N' && i.grade !== 'D');

    if (validItems.length === 0) {
        list.innerHTML = '<div style="color:#888; text-align:center; padding:10px;">Инвентарь пуст</div>';
    } else {
        list.innerHTML = validItems.map(item => {
            const rerolls = item.rerollCount || 0;
            // Определение процента стоимости
            let percent = 0.2; // Default 20% (Yellow/Orange)
            const g = (item.grade || "").toUpperCase();
            if (['A', 'S', 'S+', 'SPECTRUM', 'ANCIENT', 'PRIMAL'].includes(g) || g.includes('ANCIENT') || g.includes('PRIMAL')) {
                percent = 0.1;
            }
            
            let cost = Math.floor(item.buyPrice * percent * Math.pow(1.25, rerolls));

            // Скидки/Штрафы гильдий на зачарование
            const guild = (window.playerData.guild || "").toLowerCase();
            if (guild.includes('охотник на ☠️')) cost = Math.floor(cost * 0.8); // -20%
            else if (guild.includes('помощник охотника')) cost = Math.floor(cost * 0.9); // -10%
            else if (guild.includes('вор') && !guild.includes('воришка')) cost = Math.floor(cost * 0.75); // -25%
            else if (guild.includes('воришка')) cost = Math.floor(cost * 0.85); // -15%
            else if (guild.includes('громила')) cost = Math.floor(cost * 1.15); // +15%
        
            
            return `
                <div style="border-bottom: 1px solid #333; padding: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="color:#fff; font-weight:bold;">${item.name}</span> <span style="color:#888; font-size:0.8rem;">(${item.grade})</span><br>
                        <span style="color:#aaa; font-size:0.7rem;">Изменений: ${rerolls}</span>
                    </div>
                    <button class="craft-btn craft" style="font-size:0.7rem; padding:4px 8px;" onclick="window.openEnchantPropertySelector(${item.id}, ${cost})">
                        ${window.formatCurrency(cost)}
                    </button>
                </div>
            `;
        }).join('');
    }
    
    modal.style.display = 'flex';
}

window.openEnchantPropertySelector = function(itemId, cost) {
    const item = window.playerData.inventory.find(i => i.id === itemId);
    if (!item) return;

    window.enchantTarget = { itemId: itemId, cost: cost, oldProp: null, newProp: null };

    document.getElementById('enchant-inventory-list').style.display = 'none';
    document.getElementById('enchant-properties-selector').style.display = 'block';
    document.getElementById('enchant-subtitle').innerText = `Изменение: ${item.name} (Цена: ${window.formatCurrency(cost)})`;

    // Рендер текущих свойств
    const currentContainer = document.getElementById('enchant-current-props');
    currentContainer.innerHTML = (item.properties || []).map(p => 
        `<span class="sell-prop-item" onclick="window.selectOldEnchantProperty(this, '${p}')">${p}</span>`
    ).join('');

    // Рендер списка новых свойств (копируем из Buy/Sell логики)
    // Для простоты берем HTML из скрытого buy-ancient-modal или генерируем заново
    // Генерируем упрощенный список
    const newPropsContainer = document.getElementById('enchant-new-props-list');
    // Используем HTML из buy-ancient-modal как шаблон, но меняем onclick
    const sourceHTML = document.querySelector('.ancient-props-container').innerHTML;
    // Заменяем onclick="toggleBuyProperty..." на onclick="selectNewEnchantProperty..."
    newPropsContainer.innerHTML = sourceHTML.replace(/toggleBuyProperty\(this, \d+\)/g, "window.selectNewEnchantProperty(this)");
}

window.selectOldEnchantProperty = function(el, propName) {
    const container = document.getElementById('enchant-current-props');
    container.querySelectorAll('.selected').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
    window.enchantTarget.oldProp = propName;
}

window.selectNewEnchantProperty = function(el) {
    const target = window.enchantTarget;
    if (!target || !target.itemId) return;
    
    const item = window.playerData.inventory.find(i => i.id === target.itemId);
    if (!item) return;

    const propName = el.innerText;
    if (item.properties.includes(propName)) {
        window.showCustomAlert("❌ Этот предмет уже имеет данное свойство.");
        return;
    }

    const container = document.getElementById('enchant-new-props-list');
    container.querySelectorAll('.selected').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
    window.enchantTarget.newProp = el.innerText;
}

window.resetEnchantModal = function() {
    window.openEnchantModal();
}

window.confirmEnchantSwap = function() {
    const target = window.enchantTarget;
    if (!target || !target.oldProp || !target.newProp) {
        window.showCustomAlert("❌ Выберите старое и новое свойство.");
        return;
    }

    const cost = target.cost;
    const valError = window.validateGenericAction(cost, "Изменение свойства");
    if (valError) {
        window.showCustomAlert(valError);
        return;
    }
    const currentMoney = window.getAllMoneyInYen();
    if (currentMoney >= cost) {
        window.setMoneyFromYen(currentMoney - cost);
        const item = window.playerData.inventory.find(i => i.id === target.itemId);
        if (item) {
            item.rerollCount = (item.rerollCount || 0) + 1;
             // Замена свойства
            const idx = item.properties.indexOf(target.oldProp);
            if (idx !== -1) {
                item.properties[idx] = target.newProp;
            }
        }
        window.updateUI();
        window.openEnchantModal(); // Обновляем список (цены вырастут)
        window.showCustomAlert(`✅ Свойство изменено! Списано: ${window.formatCurrency(cost)}`);
    } else {
        window.showCustomAlert(`❌ Недостаточно средств! Нужно: ${window.formatCurrency(cost)}`);
    }
}

// --- ЛОГИКА КРАЖИ ---

window.getMaxTheftAttempts = function(level) {
    if (level < 10) return 5;
    if (level < 20) return 6;
    if (level < 30) return 7;
    if (level < 40) return 8;
    if (level < 50) return 10;
    if (level < 60) return 11;
    if (level < 70) return 13;
    // С 70 уровня: 15 + 1 за каждые 5 уровней
    // 70-74: 15, 75-79: 16, 80-84: 17...
    return 15 + Math.floor((level - 70) / 5);
}

window.toggleTheftMode = function() {
    const lvl = window.playerData.level;
    let rowId = "";
    if (lvl <= 19) rowId = "tr-theft-1";
    else if (lvl <= 39) rowId = "tr-theft-2";
    else rowId = "tr-theft-3";

    // Сброс подсветки
    document.querySelectorAll('.theft-row').forEach(r => r.classList.remove('active'));
    
    const row = document.getElementById(rowId);
    if (row) {
        row.classList.add('active');
        
    }
}

window.attemptTheft = function(grade, baseChance, rowNum) {
    // Проверка: можно нажимать только на подсвеченную строку
    const row = document.getElementById(`tr-theft-${rowNum}`);
    if (!row || !row.classList.contains('active')) return;

    // Проверка попыток
    const currentLvl = window.playerData.level;
    // Сброс счетчика, если уровень изменился
    if (window.playerData.theft_attempts_level !== currentLvl) {
        window.playerData.theft_attempts_level = currentLvl;
        window.playerData.theft_attempts_count = 0;
    }
    
    const maxAttempts = window.getMaxTheftAttempts(currentLvl);
    if (window.playerData.theft_attempts_count >= maxAttempts) {
        window.showCustomAlert(`❌ Попытки кражи на этом уровне исчерпаны (${maxAttempts}/${maxAttempts}).<br>Поднимите уровень, чтобы получить новые.`);
        return;
    }

    const cell = document.getElementById(`td-theft-${grade.toLowerCase()}-${rowNum}`);
    const chance = parseFloat(cell.dataset.chance); // Берем актуальный шанс с бонусом
    const input = document.getElementById('theft-item-level');
    const itemLvl = input ? parseInt(input.value) : window.playerData.level;
    const roll = Math.random() * 100;
    const isSuccess = roll <= chance;
    
    window.theftState = {
        success: isSuccess,
        grade: grade,
        level: itemLvl
    };

    // Открываем модалку выбора свойств
    const modal = document.getElementById('theft-modal');
    const title = document.getElementById('theft-modal-title');
    const status = document.getElementById('theft-modal-status');
    const btn = document.getElementById('theft-action-btn');
    
    document.getElementById('theft-grade-display').innerText = grade;
    document.getElementById('theft-level-display').innerText = itemLvl;

    if (isSuccess) {
        title.style.color = "#66ff66";
        status.innerHTML = `✅ УСПЕХ! (Шанс: ${chance.toFixed(1)}%)<br>Выберите свойства украденного предмета.`;
        btn.innerText = "ЗАБРАТЬ (БЕСПЛАТНО)";
    } else {
        title.style.color = "#ff4444";
        status.innerHTML = `❌ НЕУДАЧА! (Шанс: ${chance.toFixed(1)}%)<br>Вас поймали. Выберите свойства для расчета штрафа.`;
        btn.innerText = "ОПЛАТИТЬ ШТРАФ";
    }

    // Заполняем контейнер свойств (клонируем из Buy Ancient для простоты)
    const propsContainer = document.getElementById('theft-props-container');
    const sourceHTML = document.querySelector('.ancient-props-container').innerHTML;
    propsContainer.innerHTML = sourceHTML; // Используем стандартные toggleBuyProperty

    modal.style.display = 'block';
    
    // Сброс режима кражи
    document.querySelectorAll('.theft-row').forEach(r => r.classList.remove('active'));
}

window.finalizeTheft = function() {
    const state = window.theftState;
    const modal = document.getElementById('theft-modal');
    
    // Расчет стоимости предмета
    const basePrice = getCraftedItemBasePrice(state.level, state.grade);
    let totalPercent = 0;
    let propsList = [];
    const selectedProps = modal.querySelectorAll('.buy-prop-item.selected');
    
    if (selectedProps.length === 0) {
        window.showCustomAlert("❌ Выберите свойства.");
        return;
    }
    
    selectedProps.forEach(el => {
        totalPercent += parseFloat(el.dataset.percent);
        propsList.push(el.innerText);
    });
    
    const price = Math.floor(basePrice * (totalPercent / 100));

    // Списываем попытку
    window.playerData.theft_attempts_count = (window.playerData.theft_attempts_count || 0) + 1;
    window.playerData.theft_attempts_level = window.playerData.level;

    if (state.success) {
        // Добавляем предмет
        window.showCustomPrompt("Название предмета", "Введите название:", `Stolen ${state.grade}-Grade`, (name) => {
            window.playerData.inventory.push({
                id: Date.now(),
                name: name,
                grade: state.grade,
                level: state.level,
                buyPrice: price,
                isCrafted: false,
                isStolen: true,
                properties: propsList
            });
            window.playerData.steals++; // Увеличиваем счетчик краж
            window.updateUI();
            
            // Проверка на вступление в гильдию Воров
            if (window.pendingTheftJoin) {
                window.pendingTheftJoin.done++;
                const remaining = window.pendingTheftJoin.required - window.pendingTheftJoin.done;
                
                if (remaining <= 0) {
                    const joinData = window.pendingTheftJoin;
                    window.pendingTheftJoin = null;
                    
                    // Получаем правильный контент гильдии для виджета
                    let guildId = "";
                    if (joinData.guildTitle.toLowerCase().includes('воришка')) guildId = 'db_pickpocket';
                    else if (joinData.guildTitle.toLowerCase().includes('вор')) guildId = 'db_thief';
                    
                    let content = null;
                    if (guildId && window.gameData[guildId]) content = window.gameData[guildId].content;

                    window.selectProfileItem(joinData.guildTitle, joinData.path, true, content);
                    window.showCustomAlert(`✅ <b>Испытание пройдено!</b><br>Добро пожаловать в гильдию <b>${joinData.guildTitle}</b>.`);
                } else {
                    window.showCustomAlert(`✅ Предмет украден!<br>Осталось украсть для вступления: ${remaining}`);
                }
            } else {
                window.showCustomAlert(`✅ Предмет украден и добавлен в инвентарь!`);
            }

            // Проверка на повышение ранга/гильдии после кражи
            if (window.checkGuildProgression) window.checkGuildProgression();
        }, true);
    } else {
        // Штраф
        let fineAmount = price;
        const g = (window.playerData.guild || "").toLowerCase();
        
        // Применяем снижение штрафа для Воров
        if (g.includes('вор') && !g.includes('воришка')) {
            const rank = window.playerData.rank || 0;
            const finePercents = [100, 98, 95, 92, 89, 86, 82, 80, 77, 75, 70];
            const p = finePercents[Math.min(rank, 10)] || 100;
            fineAmount = Math.floor(price * (p / 100));
        }
        const currentMoney = window.getAllMoneyInYen();
        window.setMoneyFromYen(currentMoney - fineAmount);
        window.updateUI();
        window.showCustomAlert(`👮 Вас поймали! Оплачен штраф: ${window.formatCurrency(fineAmount)}`);
    }
    
    modal.style.display = 'none';
}

window.createClickSparks = function(x, y) {
    const count = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
        const spark = document.createElement('div');
        spark.className = 'click-spark';
        spark.style.left = x + 'px';
        spark.style.top = y + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 30 + Math.random() * 50;
        
        spark.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
        spark.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
        
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 500);
    }
}

window.createFireTrail = function(x, y) {
    const particle = document.createElement('div');
    particle.className = 'fire-trail-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 600);
}

window.createCollisionSparks = function(x, y, side) {
    const count = 20 + Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
        const spark = document.createElement('div');
        spark.className = 'collision-spark';
        spark.style.left = x + 'px';
        spark.style.top = y + 'px';
        
        let angleBase = 0;
        if (side === 'left') angleBase = 0; // Искры летят вправо
        else if (side === 'right') angleBase = Math.PI; // Искры летят влево
        else if (side === 'top') angleBase = Math.PI / 2; // Искры летят вниз
        else if (side === 'bottom') angleBase = -Math.PI / 2; // Искры летят вверх
        
       // Разброс +/- 80 градусов
        const angle = angleBase + (Math.random() * 2 - 1) * (Math.PI / 2.2);
        const velocity = 50 + Math.random() * 80;
        
        spark.style.setProperty('--tx', (Math.cos(angle) * velocity) + 'px');
        spark.style.setProperty('--ty', (Math.sin(angle) * velocity) + 'px');
        
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 600);
    }
}