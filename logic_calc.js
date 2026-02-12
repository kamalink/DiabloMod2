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
            "Мастерство": 4, "Защита": 5, "Чары": 6, "Другое": 99
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
    const descText = runeData.desc || "";
    const cdMatch = descText.match(/(?:Время восстановления|КД)[^0-9]*(\d+(?:\.\d+)?) сек/i);
    if (cdMatch) {
        cooldown = parseFloat(cdMatch[1]);
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
        cost += val; 
        details.push(`Лечение/Щит (${heal}% / 5 [База] * 2 [Множ]) = ${val.toFixed(2)}`); 
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
            if (isBuffAoe) {
                val *= aoeMult;
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
                desc += ` * ${aoeMult} [AOE] * 0.75 [Командный]`;
                
                // Расчет стоимости для второго игрока (25%)
                // val - это 75%. Полная цена = val / 0.75. 2-й игрок платит 25% от полной (или 1/3 от val).
                const costFor2nd = val / 3;
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
        const val = (resGainPercent / 5) * 1;
        cost += val;
        details.push(`Восст. ресурса (${resGain} / ${maxRes} [Макс] / 5% [База]) = ${val.toFixed(2)}`);
    }

    const runeDB = window.skillDB[className] && window.skillDB[className][skillIdx] && window.skillDB[className][skillIdx].runes[runeIdx];
    if (runeDB && runeDB.customCost !== undefined) {
        let cc = runeDB.customCost;
        cost += cc;
        let desc = runeDB.customCostDesc || `Доп. эффект`;
        details.push(`${desc}: ${cc}`);
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
                    const part2 = (dmgAmp / 10) * multiplier * aoeMult;
                    const addedCost = part1 + part2;
                    
                    cost += addedCost;
                    details.push(`Синергия: (${targetCost.toFixed(2)} [Цена цели] * ${dmgAmp}% [Усил]) + (${(dmgAmp/10*multiplier).toFixed(1)} [Бафф] * ${aoeMult} [AOE]) = ${addedCost.toFixed(2)}`);
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
    let maxSkills = 1;
    if (window.playerData.professions[1]) maxSkills += 2;
    if (window.playerData.professions[2]) maxSkills += 2;
    if (window.playerData.professions[3]) maxSkills += 1;

    // Считаем только уникальные названия навыков (не руны)
    const currentSkillCount = Object.keys(window.playerData.learnedSkills).length;

    // Если навык новый (еще не в списке), проверяем лимит
    if (!window.playerData.learnedSkills[skillName] && currentSkillCount >= maxSkills) {
        window.showCustomAlert(`❌ Достигнут лимит навыков (${currentSkillCount}/${maxSkills}).`);
        return;
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
    let g = Math.floor(yen / 1000000);
    let remainder = yen % 1000000;
    let s = Math.floor(remainder / 10000);
    remainder = remainder % 10000;
    let c = Math.floor(remainder / 100);
    let y = remainder % 100;

    let parts = [];
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
    window.calculateExp();
}

window.calculateExp = function() {
    const mobs = parseInt(document.getElementById('exp-mobs').value) || 0;
    const elites = parseInt(document.getElementById('exp-elites').value) || 0;
    const bosses = parseInt(document.getElementById('exp-bosses').value) || 0;

    // Считаем разницу от последнего введенного
    const dMobs = Math.max(0, mobs - (window.playerData.last_input_mobs || 0));
    const dElites = Math.max(0, elites - (window.playerData.last_input_elites || 0));
    // Боссы считаются как есть (вводятся за раз)

    let runesBase = (dMobs * 0.01) + (dElites * 0.1) + (bosses * 3);
    let paraBase = (dMobs * 0.01) + (dElites * 0.1) + (bosses * 3);

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
        runesMod += bonus; paraMod += bonus;
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
    }

    const totalRunes = (runesBase * runesMod).toFixed(2);
    const totalPara = (paraBase * paraMod).toFixed(2);

    const diffText = (dMobs > 0 || dElites > 0) ? `<br><span style="font-size:0.8rem; color:#aaa;">(+${dMobs}💀, +${dElites}☠️)</span>` : "";
    document.getElementById('exp-result-display').innerHTML = `
        <span style="color:#fff">Награда:</span><br>
        <span style="color:#66ccff; font-size:1.2rem;">${totalRunes} 📖</span> | 
        <span style="color:#d4af37; font-size:1.2rem;">${totalPara} ⏳</span>${diffText}
    `;
}

window.applyExpCalculation = function() {
    const mobs = parseInt(document.getElementById('exp-mobs').value) || 0;
    const elites = parseInt(document.getElementById('exp-elites').value) || 0;
    const bosses = parseInt(document.getElementById('exp-bosses').value) || 0;
    
    // Считаем разницу для статистики
    const dMobs = Math.max(0, mobs - (window.playerData.last_input_mobs || 0));
    const dElites = Math.max(0, elites - (window.playerData.last_input_elites || 0));

    window.calculateExp();
    const resHTML = document.getElementById('exp-result-display').innerHTML;
    const runesMatch = resHTML.match(/([\d\.]+) 📖/);
    const paraMatch = resHTML.match(/([\d\.]+) ⏳/);
    
    const addRunes = runesMatch ? parseFloat(runesMatch[1]) : 0;
    const addPara = paraMatch ? parseFloat(paraMatch[1]) : 0;

    window.playerData.runes = parseFloat((window.playerData.runes + addRunes).toFixed(2));
    window.playerData.para = parseFloat((window.playerData.para + addPara).toFixed(2));
    window.playerData.kills += dMobs;
    window.playerData.elites_solo += dElites;
    window.playerData.bosses += bosses;
    
    window.saveToStorage();
    window.updateUI();
    document.getElementById('exp-calc-modal').style.display = 'none';
    window.showCustomAlert(`✅ Получено: ${addRunes} 📖 и ${addPara} ⏳<br>Статистика обновлена.`);
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
    const sellBtn = document.getElementById('btn-confirm-sell');
    
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
        sellBtn.style.display = 'none';
        document.getElementById('zaken-price-display').innerText = "";
    } else {
        title.innerText = '📉 ПРОДАЖА ЗАКЕНОВ';
        title.style.color = '#ff4444';
        modal.style.borderColor = '#ff4444';
        buyBtn.style.display = 'none';
        sellBtn.style.display = 'inline-block';
        // Цена продажи рассчитывается в updateZakenTotalCost, здесь просто текст
        document.getElementById('zaken-price-display').innerText = `Цена продажи зависит от уровня`;
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
    
    if (mode === 'sell') {
        priceYen = priceYen * 0.8;
        // Вампирский штраф
        if (g.includes('вампир')) {
            priceYen *= 0.5;
        }
    }

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
    const currentYen = window.getAllMoneyInYen();

    if (currentYen >= totalCostYen) {
        window.setMoneyFromYen(currentYen - totalCostYen);
        window.playerData.zakens += count;
        window.playerData.black_market += count;
        window.updateUI();
        document.getElementById('zaken-buy-modal').style.display = 'none';
        window.showCustomAlert(`✅ Куплено ${count} 🔖 за ${window.formatCurrency(totalCostYen)}.`);
    } else {
        const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";
        window.showCustomAlert(`❌ Недостаточно средств!<br>Нужно: ${window.formatCurrency(totalCostYen)}${bonusText}`);
    }
}

window.confirmSellZakens = function() {
    const count = parseInt(document.getElementById('zaken-count-input').value);
    const lvl = window.playerData.level;
    
    if (isNaN(count) || count <= 0) {
        window.showCustomAlert("Некорректное число.");
        return;
    }

    if (window.playerData.zakens < count) {
        window.showCustomAlert(`❌ Недостаточно закенов!<br>У вас: ${window.playerData.zakens}`);
        return;
    }

    // Расчет цены продажи
    const g = (window.playerData.guild || "").toLowerCase();
    let basePrice = window.getZakenPrice(lvl);
    let sellPricePerUnit = basePrice * 0.8; // 80% от цены
    // Вампирский штраф
    if (g.includes('вампир')) {
        sellPricePerUnit *= 0.5;
    }
    const totalSellYen = Math.floor(sellPricePerUnit * count);
   

    window.playerData.zakens -= count;
    window.playerData.gold_y += totalSellYen;
    // Нормализация валюты происходит в updateUI -> calculateRank -> но лучше сделать тут или использовать addMoney
    // Проще добавить напрямую и нормализовать
    while (window.playerData.gold_y >= 100) { window.playerData.gold_y -= 100; window.playerData.gold_c++; }
    while (window.playerData.gold_c >= 100) { window.playerData.gold_c -= 100; window.playerData.gold_s++; }
    while (window.playerData.gold_s >= 100) { window.playerData.gold_s -= 100; window.playerData.gold_g++; }

    window.updateUI();
    document.getElementById('zaken-buy-modal').style.display = 'none';
    window.showCustomAlert(`✅ Продано ${count} 🔖 за ${window.formatCurrency(totalSellYen)}.`);
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
        if (g.includes('вампир')) {
            sellMult *= 0.5;
            bonuses.push(`Вампир -50%`);
        }
        
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
    modal.style.top = '50%';
    modal.style.left = '50%';
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
            bonuses.push(`Вампир -50%`);
        }

        inputsContainer.querySelectorAll('.multi-sell-input').forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const mult = parseFloat(input.dataset.mult);
            totalYen += quantity * basePrice * mult * sellMult;
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

        inputsContainer.querySelectorAll('.multi-sell-input').forEach(input => {
            const resType = input.dataset.type;
            const quantity = parseInt(input.value) || 0;
            quantities[resType] = (quantities[resType] || 0) + quantity;

            if (quantity > (window.playerData[`res_${resType}`] || 0)) {
                error = true;
            }
            totalGain += quantity * basePrice * parseFloat(input.dataset.mult) * sellMult;
        });
        
        if (error) {
            showCustomAlert("❌ Недостаточно ресурсов одного из типов!");
            return;
        }

        if (totalGain > 0) {
            for (const resType in quantities) {
                window.playerData[`res_${resType}`] -= quantities[resType];
            }
            const currentMoney = getAllMoneyInYen();
            setMoneyFromYen(currentMoney + Math.floor(totalGain));
            updateUI();
            showCustomAlert(`✅ Ресурсы проданы! Получено: ${window.formatCurrency(Math.floor(totalGain))}`);
        }
        modal.style.display = 'none';
    };

    cancelBtn.onclick = () => {
        modal.style.display = 'none';
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
        pricePerRune = prices[rank] || 2000;
    } else if (g.includes('ученик')) {
        pricePerRune = 1500; // Фикс 15 бронзы
    } else if (g.includes('вампир')) {
        // Вампир: Уроки стоят на 30% больше за каждые 100 Интеллекта
        const basePrice = 1500;
        const bonusPercent = 30 * (window.playerData.stat_int / 100);
        pricePerRune = basePrice * (1 + bonusPercent / 100);
    }

    window.showCustomPrompt("Продажа Рун", `Цена за 1 📖: ${window.formatCurrency(pricePerRune)}<br>У вас: ${window.playerData.runes} 📖`, "1", (quantity) => {
        if (isNaN(quantity) || quantity <= 0) return;
        if (window.playerData.runes < quantity) { window.showCustomAlert("Недостаточно рун."); return; }
        
        window.playerData.runes -= quantity;
        window.playerData.runes_sold += quantity;
        
        const totalGain = Math.floor(pricePerRune * quantity);
        window.playerData.gold_y += totalGain;
        
        // Нормализация денег
        while (window.playerData.gold_y >= 100) { window.playerData.gold_y -= 100; window.playerData.gold_c++; }
        while (window.playerData.gold_c >= 100) { window.playerData.gold_c -= 100; window.playerData.gold_s++; }
        while (window.playerData.gold_s >= 100) { window.playerData.gold_s -= 100; window.playerData.gold_g++; }
        
        window.updateUI();
        window.showCustomAlert(`✅ Продано ${quantity} 📖 за ${window.formatCurrency(totalGain)}`);
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
                steals: 0, black_market: 0,
                
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
    }
    
    buttonsContainer.innerHTML += `<button class="death-cancel-btn" onclick="closeGemModal()">Отмена</button>`;
    
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
        // Вампирский штраф
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
    if (operation === 'rent') totalCost *= rentDuration;
    const costFormatted = formatCurrency(totalCost);
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

function getBulkItemPrice(level) {
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

window.sellItemsBulk = function() {
    const modal = document.getElementById('multi-sell-modal');
    const inputsContainer = document.getElementById('multi-sell-inputs');
    const totalDisplay = document.getElementById('multi-sell-total');
    const okBtn = document.getElementById('multi-sell-ok-btn');
    const cancelBtn = document.getElementById('multi-sell-cancel-btn');
    const levelInput = document.getElementById('multi-sell-level');

    // Сброс позиции
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    levelInput.value = (window.lastResourceSellLevel && window.lastResourceSellLevel >= 5) ? window.lastResourceSellLevel : (window.playerData.level || 5);

    document.getElementById('multi-sell-title').innerText = "Продажа предметов";
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
        const labelText = document.getElementById('multi-sell-label-text');
        if (labelText) labelText.innerText = "Уровень предметов:";
        window.lastResourceSellLevel = level; // Запоминаем уровень (общий с ресурсами)
        const basePrice = getBulkItemPrice(level);

        inputsContainer.querySelectorAll('.multi-sell-input').forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const mult = parseFloat(input.dataset.mult);
            totalYen += quantity * basePrice * mult;
        });
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
        const basePrice = getBulkItemPrice(level);
        const g = (window.playerData.guild || "").toLowerCase();
        let sellMultiplier = 1.0;
        if (g.includes('вампир')) {
            sellMultiplier = 0.5;
        }

        inputsContainer.querySelectorAll('.multi-sell-input').forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const mult = parseFloat(input.dataset.mult);
            totalGain += quantity * basePrice * mult;
        });

        totalGain *= sellMultiplier;

        if (totalGain > 0) {
            const currentMoney = getAllMoneyInYen();
            setMoneyFromYen(currentMoney + Math.floor(totalGain));
            updateUI();
            showCustomAlert(`✅ Предметы проданы! Получено: ${window.formatCurrency(Math.floor(totalGain))}`);
        }
        modal.style.display = 'none';
    };

    cancelBtn.onclick = () => {
        modal.style.display = 'none';
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
    title.innerText = "⚒️ ПРОДАЖА КРАФТА";
    title.style.color = "#d4af37";
    if (btn) {
        btn.innerText = "ПРОДАТЬ";
        btn.className = "craft-btn smith-sell";
        btn.onclick = window.sellCraftedItemFromModal;
    }

    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.display = 'block';
}

window.sellCraftedItemFromModal = function() {
    const level = parseInt(document.getElementById('modal-sell-level').value) || 1;
    const grade = document.getElementById('modal-sell-grade').value;
    
    // Set level to player level by default if not set
    if (!document.getElementById('modal-sell-level').dataset.touched) {
         // Logic to auto-set level could go here, but input is manual
    }

    // 1. Получаем базовую 100% цену
    let price = getCraftedItemBasePrice(level, grade);
    let bonuses = [];

    // 2. Считаем бонус от выбранных свойств
    let totalPercent = 0;
    const selectedProps = document.querySelectorAll('.sell-prop-item.selected');
    if (selectedProps.length === 0) {
        window.showCustomAlert("❌ Выберите хотя бы одно свойство.");
        return;
    }
    
    selectedProps.forEach(el => {
        totalPercent += parseFloat(el.dataset.percent);
    });

    price = price * (totalPercent / 100);

    // 3. Применяем бонус/штраф гильдии
    const g = (window.playerData.guild || "").toLowerCase();
    let guildMultiplier = 1.0; // Базовая продажа 100%
    if (g.includes('салага') || g.includes('громила') || g.includes('лорд войны')) { guildMultiplier = 0.9; bonuses.push(`Соратники -10%`); }
    if (g.includes('вампир')) { guildMultiplier = 0.5; bonuses.push(`Вампир -50%`); }
    
    price = price * guildMultiplier;
    const totalYen = Math.floor(price);
    
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";

    window.showCustomConfirm(
        `Продать предмет (Lvl ${level}, ${grade})?<br>Свойств: ${selectedProps.length} (${totalPercent}%)<br>Цена: ${window.formatCurrency(totalYen)}${bonusText}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            window.setMoneyFromYen(currentMoney + totalYen);
            window.updateUI();
            window.showCustomAlert(`✅ Предмет продан! Получено: ${window.formatCurrency(totalYen)}`);
            document.getElementById('sell-craft-modal').style.display = 'none';
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
        finalPrice *= buyMult;
    }
    
    if (mode === 'sell') {
        // Vampire Penalty for selling
        if (g.includes('вампир')) {
            finalPrice *= 0.5;
            bonuses.push(`Вампир -50%`);
        }
        // Traders bonus is already in base price? No, traders usually have bonus on sell too.
        // Adding Trader bonus for selling A-grade if applicable (assuming standard 5% base logic applies or custom)
        // The prompt didn't specify Trader bonus for A-grade sell, but usually it exists. 
        // Let's stick to the requested Vampire penalty fix for now.
    }

    const cost = Math.floor(finalPrice);
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
    document.getElementById('set-level-input').value = window.playerData.level;
    modal.style.display = 'block';
}

window.buyAncientImmediate = function() {
        const level = parseInt(document.getElementById('ancient-level-input').value) || 1;
    const grade = document.getElementById('ancient-grade-input').value;
    const type = document.getElementById('ancient-type-input').value;
    const itemClassMult = parseFloat(document.getElementById('ancient-item-class').value) || 1.0;
    
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
        if (g.includes('охотник на гоблинов')) { buyMult += 0.5; bonuses.push(`Охотник +50%`); }
        else if (g.includes('охотник на ☠️')) { buyMult += 0.25; bonuses.push(`Охотник +25%`); }
        else if (g.includes('помощник охотника')) { buyMult += 0.10; bonuses.push(`Охотник +10%`); }
    }
    
    finalPrice *= buyMult;
    const cost = Math.floor(finalPrice);
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
        if (g.includes('охотник на гоблинов')) { buyMult += 0.5; bonuses.push(`Охотник +50%`); }
        else if (g.includes('охотник на ☠️')) { buyMult += 0.25; bonuses.push(`Охотник +25%`); }
        else if (g.includes('помощник охотника')) { buyMult += 0.10; bonuses.push(`Охотник +10%`); }
    }
    finalPrice *= buyMult;

    const cost = Math.floor(finalPrice);
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
        if (inp.id.includes('mult') || (inp.id.includes('tough') && !inp.id.includes('base'))) inp.value = 1;
        else inp.value = 0;
    });

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
                    if (runeObj && runeObj.dmg > maxDmg) {
                        maxDmg = runeObj.dmg;
                        bestSkillName = `${sName} (${rName})`;
                    }
                });
            }
        }
    }
    
    document.getElementById('diff-skill-pct').value = maxDmg;
    document.getElementById('diff-auto-skill-name').innerText = bestSkillName;
    
    // Add listeners for live calculation
    inputs.forEach(inp => inp.oninput = window.calculateDifficulty);
    
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
    const itemSkillPct = parseFloat(document.getElementById('diff-item-skill-pct').value) || 0;
    const skillPct = parseFloat(document.getElementById('diff-skill-pct').value) || 0;
    const elemPct = parseFloat(document.getElementById('diff-elem-pct').value) || 0;
    const gemsPct = parseFloat(document.getElementById('diff-gems-pct').value) || 0;
    const partnerDmg = parseFloat(document.getElementById('diff-partner-dmg').value) || 0;

    // Cube Logic
    let cubeDmgMult = 1;
    let cubeToughMult = 1;

    for (let i = 1; i <= 3; i++) {
        const type = document.getElementById(`diff-cube-${i}-type`).value;
        const val = parseFloat(document.getElementById(`diff-cube-${i}-val`).value) || 0;
        
        if (val > 0) {
            if (type === 'dmg' || type === 'skill') {
                // Treat both General and Skill damage from cube as multipliers for simplicity/mod rules
                cubeDmgMult *= (1 + val / 100);
            } else if (type === 'tough') {
                cubeToughMult *= (1 + val / 100);
            }
        }
    }

    // Formula: Hero * (1 + ItemSkill%) * (Skill%/100) * (1 + Elem%) * (1 + Gems%) * Cube
    // Note: Skill% is usually e.g. 740, so we multiply by 7.4.
    // If skillPct is 0 (no skill), we assume x1 to not zero out damage? No, usually 100% weapon damage is base.
    // But here we take specific skill %. If 0, it means 0 damage from skills.
    
    const skillMult = skillPct > 0 ? (skillPct / 100) : 1;

    const totalHeroDmg = heroDmg * (1 + itemSkillPct/100) * skillMult * (1 + elemPct/100) * (1 + gemsPct/100) * cubeDmgMult;
    const totalDmg = totalHeroDmg + partnerDmg;

    document.getElementById('diff-total-dmg').innerText = totalDmg.toLocaleString('ru-RU', { maximumFractionDigits: 0 });

    // Toughness
    const baseTough = parseFloat(document.getElementById('diff-base-tough').value) || 0;
    const legTough = parseFloat(document.getElementById('diff-leg-tough').value) || 1;
    const skillTough = parseFloat(document.getElementById('diff-skill-tough').value) || 1;
    const passTough = parseFloat(document.getElementById('diff-pass-tough').value) || 1;

    const totalTough = baseTough * legTough * skillTough * passTough * cubeToughMult;

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
}

window.applyDifficulty = function() {
    const tier = document.getElementById('diff-result-tier').dataset.tier;
    window.playerData.difficulty = tier;
    window.saveToStorage();
    window.updateUI();
    document.getElementById('difficulty-calc-modal').style.display = 'none';
    window.showCustomAlert(`✅ Уровень сложности обновлен: ${tier}`);
}

// --- НОВЫЕ ФУНКЦИИ (ПОКУПКА ЛОКАЦИЙ, ОБМЕН, КАМНИ) ---

const npCosts = {
    "Высокий": 230000, "Эксперт": 290000, "Мастер": 370000,
    "T1": 440000, "T2": 550000, "T3": 690000, "T4": 860000,
    "T5": 1080000, "T6": 1350000, "T7": 1550000, "T8": 1790000,
    "T9": 2060000, "T10": 2360000, "T11": 2720000, "T12": 3290000,
    "T13": 3610000, "T14": 3980000, "T15": 4380000, "T16": 4810000
};

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

    // Охотник на гоблинов: НП на 20% дешевле (только НП и Акт, ВП обычно не скидывается, но по логике "от НП" может и скидываться. Оставим скидку на базу)
    const g = (window.playerData.guild || "").toLowerCase();
    if (g.includes('охотник на гоблинов') && type !== 'vp') {
        cost *= 0.8;
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
    const selectedProps = document.querySelectorAll('.buy-prop-item.selected');
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
    const selectedProps = document.querySelectorAll('.sell-prop-item.selected');
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
        if (g.includes('охотник на гоблинов')) { buyMult += 0.5; bonuses.push(`Охотник +50%`); }
        else if (g.includes('охотник на ☠️')) { buyMult += 0.25; bonuses.push(`Охотник +25%`); }
        else if (g.includes('помощник охотника')) { buyMult += 0.10; bonuses.push(`Охотник +10%`); }
    }

    // Crafting Multiplier (150%)
    let craftMult = 1.5;
    if (g.includes('салага')) { craftMult = 1.3; bonuses.push(`Соратники (130%)`); }
    else if (g.includes('громила')) { craftMult = 1.15; bonuses.push(`Соратники (115%)`); }
    else if (g.includes('лорд войны')) { craftMult = 1.05; bonuses.push(`Соратники (105%)`); }

    const finalPrice = Math.floor(price * (totalPercent / 100) * gradePenaltyMult * buyMult * craftMult);
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
            // Продажа крафта: 100% от БАЗОВОЙ цены (независимо от того, за сколько купили)
            const basePrice = getCraftedItemBasePrice(item.level, item.grade);
            sellPrice = Math.floor(basePrice);
            
            // Бонус/Штраф гильдии для крафта (репликация логики sellCraftedItemFromModal)
            const g = (window.playerData.guild || "").toLowerCase();
            if (g.includes('салага') || g.includes('громила') || g.includes('лорд войны')) sellPrice = Math.floor(sellPrice * 0.9);
            if (g.includes('вампир')) sellPrice = Math.floor(sellPrice * 0.5);
        } else {
            // Вендор: 50% от цены покупки
            sellPrice = Math.floor(item.buyPrice * 0.5);
            
            // Штраф вампира на продажу
            const g = (window.playerData.guild || "").toLowerCase();
            if (g.includes('вампир')) sellPrice = Math.floor(sellPrice * 0.5);
        }

        html += `<div style="border-bottom: 1px solid #333; padding: 5px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size:0.9rem;">${item.name} <span style="color:#888">(${item.grade})</span></span>
            <button class="craft-btn sell" style="font-size: 0.7rem; padding: 2px 5px;" onclick="window.processSellItem(${item.id}, ${sellPrice})">Продать (${window.formatCurrency(sellPrice)})</button>
        </div>`;
    });
    html += `</div>`;
    html += `<div style="text-align:center; margin-top:10px;"><button class="death-cancel-btn" onclick="document.getElementById('custom-confirm-modal').style.display='none'">ЗАКРЫТЬ</button></div>`;

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
    const selectedProps = document.querySelectorAll('.buy-prop-item.selected');
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
        if (g.includes('охотник на гоблинов')) { buyMult += 0.5; bonuses.push(`Охотник +50%`); }
        else if (g.includes('охотник на ☠️')) { buyMult += 0.25; bonuses.push(`Охотник +25%`); }
        else if (g.includes('помощник охотника')) { buyMult += 0.10; bonuses.push(`Охотник +10%`); }
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
