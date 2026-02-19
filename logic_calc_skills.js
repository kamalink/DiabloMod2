// --- КАЛЬКУЛЯТОР НАВЫКОВ ---

window.openSkillCalculator = function() {
    const modal = document.getElementById('skill-calc-modal');
    const classSelect = document.getElementById('calc-class-select');
    
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';

    classSelect.innerHTML = '';
    const playerClass = window.playerData.className;

    if (playerClass && window.skillDB[playerClass] && playerClass !== "Класс не выбран") {
        classSelect.innerHTML = `<option value="${playerClass}">${playerClass}</option>`;
        classSelect.value = playerClass;
    } else {
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
    
    if (cls && window.skillDB[cls] && window.skillDB[cls][skillIdx]) {
        const skillName = window.skillDB[cls][skillIdx].name;
        const runeName = window.skillDB[cls][skillIdx].runes[runeIdx].name;
        if (window.playerData.learnedSkills[skillName] && window.playerData.learnedSkills[skillName].includes(runeName)) {
            buyBtn.innerText = "ИЗУЧЕНО";
            buyBtn.disabled = true;
            buyBtn.style.background = "#333";
            buyBtn.style.color = "#aaa";
            buyBtn.style.border = "1px solid #555";
            buyBtn.style.display = "inline-block";
        } else {
            buyBtn.innerText = "ИЗУЧИТЬ";
            buyBtn.disabled = false;
            buyBtn.style.background = "";
            buyBtn.style.color = "";
            buyBtn.style.display = "inline-block";

            if (runeIdx == 0) {
                const learnedRunes = window.playerData.learnedSkills[skillName];
                if (learnedRunes && learnedRunes.length > 0) {
                    buyBtn.style.display = "none";
                }
            }
            
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
            
            const synergyBox = document.getElementById('calc-synergy-box');
            if (runeData.dmgAmp > 0) {
                synergyBox.style.display = 'block';
                const synSelect = document.getElementById('calc-synergy-skill');
                
                synSelect.innerHTML = '<option value="">-- Выберите навык --</option>';
                window.skillDB[cls].forEach((s, i) => {
                    s.runes.forEach((r, ri) => {
                        if (r.dmg > 0) {
                            if (runeData.elemSynergy && !r.name.includes(runeData.elemSynergy)) return;
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

            let blockBox = document.getElementById('calc-block-box');
            if (!blockBox) {
                const synergyBox = document.getElementById('calc-synergy-box');
                if (synergyBox && synergyBox.parentNode) {
                    blockBox = document.createElement('div');
                    blockBox.id = 'calc-block-box';
                    blockBox.style.display = 'none';
                    blockBox.style.marginTop = '10px';
                    blockBox.innerHTML = `<label style="color:#d4af37;">🛡️ Шанс блока (%): <input type="number" id="calc-block-chance" value="20" style="width:50px; background:#000; color:#fff; border:1px solid #444; text-align:center;" oninput="window.calculateSkillCost()"></label>`;
                    synergyBox.parentNode.insertBefore(blockBox, synergyBox.nextSibling);
                }
            }
            if (blockBox) {
                blockBox.style.display = (runeData.blockDmg > 0) ? 'block' : 'none';
            }
            
            const skillName = window.skillDB[cls][skillIdx].name;
            const runeName = window.skillDB[cls][skillIdx].runes[runeIdx].name;
            document.getElementById('calc-skill-cost-box').style.display = (runeName === "Призма" || runeName === "Сила бури") ? 'block' : 'none';

        } else {
            document.getElementById('calc-skill-cost-box').style.display = 'none';
            document.getElementById('calc-synergy-box').style.display = 'none';
        }
    }
    window.calculateSkillCost();
}

window.calculateRuneCostFromDB = function(className, skillIdx, runeIdx) {
    if (!window.skillDB[className] || !window.skillDB[className][skillIdx]) return { cost: 0, details: [] };
    
    const runeData = window.skillDB[className][skillIdx].runes[runeIdx];
    if (!runeData) return { cost: 0, details: [] };

    const isPassive = window.skillDB[className][skillIdx].category === "Пассивные";

    const dmg = runeData.dmg || 0;
    let aoeMult = runeData.aoe || 1;
    
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
    const passiveDmg = runeData.passiveDmg || 0;
    const passiveSlow = runeData.passiveSlow || 0;
    const blockDmg = runeData.blockDmg || 0;
    const thornsDmg = runeData.thornsDmg || 0;
    
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

    let cooldown = 0;
    if (!runeData.noCdDiscount) {
        const descText = runeData.desc || "";
        let cdMatch = descText.match(/(?:Время восстановления|КД)[^0-9]*(\d+(?:\.\d+)?) сек/i);
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
    
    // Парсинг длительности для DoT (Урон со временем)
    let duration = 0;
    const descText = runeData.desc || "";
    // Ищем "в течение X сек" или "за X сек"
    let durMatch = descText.match(/(?:в течение|за)\s*(\d+(?:\.\d+)?)\s*сек/i);
    if (durMatch) {
        duration = parseFloat(durMatch[1]);
    }

    if (dmg > 0) {
        let baseDmgCost = (dmg / 100) * 2 * aoeMult;
        if (cooldown > 0) baseDmgCost /= cdDiscount;

        let finalDmgCost = baseDmgCost;
        let formula = `Урон (${dmg}% / 100 * 2 [База] * ${aoeMult} [AOE])`;
        
        // Новое правило для DoT (DPS + Множители времени)
        if (duration > 0) {
            const dps = dmg / duration;
            let timeMult = 1;
            if (duration >= 15) timeMult = 2;
            else if (duration >= 10) timeMult = 3;
            else if (duration >= 5) timeMult = 4;
            
            baseDmgCost = (dps / 100) * 2 * aoeMult * timeMult;
            if (cooldown > 0) baseDmgCost /= cdDiscount;
            
            finalDmgCost = baseDmgCost;
            formula = `DoT (${dps.toFixed(1)}% DPS / 100 * 2 * ${aoeMult} [AOE] * ${timeMult} [Время ${duration}с])`;
        }

        if (cooldown > 0) formula += ` / ${cdDiscount.toFixed(1)} [КД]`;

        if (totalEffInc > 0) {
            formula += ` * (1 + ${totalEffInc.toFixed(0)}%/100 [Эфф])`;
            finalDmgCost = baseDmgCost * (1 + totalEffInc / 100);
        }
        
        cost += finalDmgCost;
        details.push(`${formula} = ${finalDmgCost.toFixed(2)}`);
    }

    if (blockDmg > 0) {
        const blockChance = parseFloat(document.getElementById('calc-block-chance')?.value) || 0;
        const addedDmg = blockDmg * (blockChance / 100);
        
        let blockCost = (addedDmg / 100) * 2 * aoeMult;
        if (cooldown > 0) blockCost /= cdDiscount;
        
        if (totalEffInc > 0) {
            blockCost = blockCost * (1 + totalEffInc / 100);
        }
        
        cost += blockCost;
        details.push(`Урон от Блока (${blockDmg}% от ${blockChance}% Блока = ${addedDmg.toFixed(1)}% / 100 * 2 * ${aoeMult} [AOE]) = ${blockCost.toFixed(2)}`);
    }

    if (thornsDmg > 0) {
        let thornsCost = (thornsDmg / 100) * 2 * aoeMult;
        let formula = `Урон от Шипов (${thornsDmg}% / 100 * 2 * ${aoeMult} [AOE])`;

        if (cooldown > 0) {
            thornsCost /= cdDiscount;
            formula += ` / ${cdDiscount.toFixed(1)} [КД]`;
        }
        if (totalEffInc > 0) {
            thornsCost *= (1 + totalEffInc / 100);
        }
        cost += thornsCost;
        details.push(`${formula} = ${thornsCost.toFixed(2)}`);
    }

    if (dmg2 > 0) {
        if (aoe2 === 2.5) {
            if (className === "Чародей" || className === "Колдун") aoe2 = 1.6;
            else if (className === "Охотник на демонов") aoe2 = 1.9;
        }
        let dmg2Cost = (dmg2 / 100) * 2 * aoe2;
        if (cooldown > 0) dmg2Cost /= cdDiscount;
        
        if (totalEffInc > 0) {
            dmg2Cost = dmg2Cost * (1 + totalEffInc / 100);
            details.push(`Доп. Урон (${dmg2}%${cooldown > 0 ? ' / ' + cdDiscount.toFixed(1) + ' [КД]' : ''}) * (1 + ${totalEffInc.toFixed(0)}% [Эфф]) = ${dmg2Cost.toFixed(2)}`);
        } else {
            details.push(`Доп. Урон (${dmg2}% / 100 * 2 [База] * ${aoe2} [AOE]${cooldown > 0 ? ' / ' + cdDiscount.toFixed(1) + ' [КД]' : ''}) = ${dmg2Cost.toFixed(2)}`);
        }
        cost += dmg2Cost;
    }

    if (passiveDmg > 0) {
        let val = (passiveDmg / 100) * 2;
        cost += val;
        details.push(`Пассивный Урон (${passiveDmg}% / 100 * 2) = ${val.toFixed(2)}`);
    }

    if (passiveSlow > 0) {
        let baseVal = (passiveSlow / 20) * 4;
        let val = baseVal * slowMult;
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
        if (isPassive) multiplier = 5;
        let val = (buffDmg / 10) * multiplier;
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
            if (isPassive) multiplier = 3.75;

            let val = (buff.val / 5) * multiplier;
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
            if (isBuffAoe) val *= 0.75;

            cost += val; 
            let desc = "";
            if (isPassive) {
                desc = `Бафф Защиты ${idx+1} (${buff.val}% * 0.75 [Пассивка]${typeMult > 1 ? ' * ' + typeMult + typeName : ''})`;
            } else {
                desc = `Бафф Защиты ${idx+1} (${buff.val}% / 5 [База] * ${multiplier} [Тип]${typeMult > 1 ? ' * ' + typeMult + typeName : ''})`;
            }
            if (isBuffAoe) {
                desc += ` * 0.75 [Командный]`;
                let costFor2nd = val / 3;
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

    const maxResources = { "Чародей": 100, "Колдун": 750, "Монах": 250, "Варвар": 100, "Крестоносец": 100, "Охотник на демонов": 125 };
    if (resGain > 0 && maxResources[className]) {
        const maxRes = maxResources[className];
        const resGainPercent = (resGain / maxRes) * 100;
        
        let val = 0;
        let formula = "";
        
        if (runeData.resGainInstant) {
            val = (resGainPercent / 5) * 1; // 5% = 1 руна (Мгновенное)
            formula = `Мгновенное восст. (${resGain} / ${maxRes} = ${resGainPercent.toFixed(1)}% / 5 [База])`;
        } else {
            val = (resGainPercent / 2) * 1; // 2% = 1 руна (Обычное)
            formula = `Восст. ресурса (${resGain} / ${maxRes} = ${resGainPercent.toFixed(1)}% / 2 [База])`;
        }

        cost += val;
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
            if (dmg === 0 && dmg2 === 0 && totalEffInc > 0) costFor2nd *= (1 + totalEffInc / 100);
            details.push(`<span style="color:#ff7979; font-weight:bold; margin-left:10px;">👤 2-й игрок платит: ${costFor2nd.toFixed(2)} 📖</span>`);
        } else {
            cost += cc;
            details.push(`${desc}: ${cc}`);
        }
    }

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
                    const addedCost = targetCost * (dmgAmp / 100);
                    cost += addedCost;
                    details.push(`Эффективность КД: ${targetCost.toFixed(2)} [Цена цели] * ${dmgAmp}% = ${addedCost.toFixed(2)}`);
                } else {
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
    
    // Расчет множителя на основе порядка изучения (learnedSkillsOrder)
    if (!window.playerData.learnedSkillsOrder) {
        window.playerData.learnedSkillsOrder = Object.keys(window.playerData.learnedSkills || {});
    }

    const isLearned = window.playerData.learnedSkills && window.playerData.learnedSkills[skillName];
    let relevantIndex = 0;
    
    for (const sName of window.playerData.learnedSkillsOrder) {
        if (isLearned && sName === skillName) break; // Дошли до текущего навыка
        
        const sObj = window.skillDB[className].find(s => s.name === sName);
        if (sObj) {
            const sPassive = sObj.category === "Пассивные";
            if (sPassive === isPassive) {
                relevantIndex++;
            }
        }
    }

    // Экспоненциальное увеличение стоимости сверх лимита (6 активных, 4 пассивных)
    const activeSoftCap = 6;
    const passiveSoftCap = 4;

    if (!isPassive && relevantIndex >= activeSoftCap) {
        const excess = relevantIndex - activeSoftCap + 1;
        const mult = Math.pow(1.3, excess);
        let oldCost = cost;
        cost *= mult;
        details.push(`<span style="color:#ffcc00">⚠️ Доп. навык (${excess}-й сверх лимита): ${oldCost.toFixed(2)} * ${mult.toFixed(2)} = ${cost.toFixed(2)}</span>`);
    } else if (isPassive && relevantIndex >= passiveSoftCap) {
        const excess = relevantIndex - passiveSoftCap + 1;
        const mult = Math.pow(1.3, excess);
        let oldCost = cost;
        cost *= mult;
        details.push(`<span style="color:#ffcc00">⚠️ Доп. пассивка (${excess}-я сверх лимита): ${oldCost.toFixed(2)} * ${mult.toFixed(2)} = ${cost.toFixed(2)}</span>`);
    }

    return { cost: cost, details: details };
}

window.calculateSkillCost = function() {
    const className = document.getElementById('calc-class-select').value;
    const skillIdx = document.getElementById('calc-skill-select').value;
    const runeIdx = document.getElementById('calc-rune-select').value;

    if (!className || skillIdx === '' || runeIdx === '') return;

    const currentCalc = window.calculateRuneCostFromDB(className, skillIdx, runeIdx);
    let finalCost = currentCalc.cost;
    let details = currentCalc.details;

    const skillName = window.skillDB[className][skillIdx].name;
    const learnedRunes = window.playerData.learnedSkills[skillName];
    const isAnyRuneLearned = learnedRunes && learnedRunes.length > 0;

    if (isAnyRuneLearned) {
        const baseCalc = window.calculateRuneCostFromDB(className, skillIdx, 0);
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
             window.showCustomAlert(`❌ Вы не можете изучить навык класса <span style="color:#d4af37"></span>.<br><br>Ваш класс: <span style="color:#66ccff">${window.playerData.className}</span>.`);
             return;
        }
    }

    const validationError = window.validateSkillCost(className, skillIdx, runeIdx);
    if (validationError) {
        window.showCustomConfirm(
            `⚠️ Обнаружена потенциальная ошибка в расчетах!<br><br><span style="color:#ffcc00;"></span><br><br>Продолжить покупку?`,
            () => proceedWithPurchase()
        );
    } else {
        proceedWithPurchase();
    }
}

window.proceedWithPurchase = function() {
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
    
    let maxActive = 1;
    if (window.playerData.professions[1]) maxActive += 2;
    if (window.playerData.professions[2]) maxActive += 2;
    if (window.playerData.professions[3]) maxActive += 2;

    if (window.playerData.build_2) maxActive += 7;

    let maxPassive = 0;
    if (window.playerData.professions[1]) maxPassive += 1;
    if (window.playerData.professions[2]) maxPassive += 1;
    if (window.playerData.professions[3]) maxPassive += 3;

    if (window.playerData.build_2) maxPassive += 5;

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
                    if (!window.playerData.learnedSkillsOrder) window.playerData.learnedSkillsOrder = [];
                    window.playerData.learnedSkillsOrder.push(skillName);
                    
                    // Восстановление забытых рун
                    if (window.playerData.forgottenSkillRunes && window.playerData.forgottenSkillRunes[skillName]) {
                        const restored = window.playerData.forgottenSkillRunes[skillName];
                        window.playerData.learnedSkills[skillName] = [...restored];
                        delete window.playerData.forgottenSkillRunes[skillName];
                        window.showCustomAlert(`✅ Память вернулась! Все руны навыка "${skillName}" восстановлены.`);
                    }
                }
                if (!window.playerData.learnedSkills[skillName].includes(runeName)) {
                    window.playerData.learnedSkills[skillName].push(runeName);
                }

                window.saveToStorage();
                window.logEvent(`Изучен навык: ${skillName} (${runeName})`, 'info');
                window.updateUI();
                window.showCustomAlert("✅ Навык успешно изучен!");
                
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
