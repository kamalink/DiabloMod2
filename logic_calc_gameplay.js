// --- ГЕЙМПЛЕЙ, СЛОЖНОСТЬ, ПОРТАЛЫ ---

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
    
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(inp => {
        if (inp.id === 'diff-multipliers') inp.value = "";
        else if (inp.id.includes('mult')) inp.value = 1;
        else if (inp.id === 'diff-tough-multipliers') inp.value = "";
        else if (inp.type === 'text') inp.value = "";
        else inp.value = 0;
    });
    window.loadDifficultyCalcData();

    if (window.partnerData && window.partnerData.dmg) {
        document.getElementById('diff-partner-dmg').value = window.partnerData.dmg;
        document.getElementById('diff-partner-tough').value = window.partnerData.tough;
    }

    let maxDmg = 0;
    let bestSkillName = "Нет";
    const cls = window.playerData.className;
    const learned = window.playerData.learnedSkills || {};

    if (cls && window.skillDB[cls]) {
        for (const [sName, runes] of Object.entries(learned)) {
            const skillObj = window.skillDB[cls].find(s => s.name === sName);
            if (skillObj) {
                runes.forEach(rName => {
                    const runeObj = skillObj.runes.find(r => r.name === rName);
                    if (runeObj) {
                        const totalRuneDmg = (runeObj.dmg || 0) + (runeObj.dmg2 || 0) + (runeObj.passiveDmg || 0);
                        if (totalRuneDmg > maxDmg) {
                            maxDmg = totalRuneDmg;
                            bestSkillName = `${sName} ()`;
                        }
                    }
                });
            }
        }
    }
    
    let skillToughTotal = 0;
    let passToughTotal = 0;
    
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
    calcInputs.forEach(inp => inp.oninput = window.calculateDifficulty);
    
    const selects = modal.querySelectorAll('select');
    selects.forEach(sel => sel.onchange = window.calculateDifficulty);

    window.calculateDifficulty();
    modal.style.display = 'block';
}

window.calculateDifficulty = function() {
    const lvl = window.playerData.level || 1;

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
    }

    const heroDmg = parseFloat(document.getElementById('diff-hero-dmg').value) || 0;
    const skillPct = parseFloat(document.getElementById('diff-skill-pct').value) || 0;
    const partnerDmg = parseFloat(document.getElementById('diff-partner-dmg').value) || 0;

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

    const skillMult = skillPct > 0 ? (skillPct / 100) : 1;
    const totalHeroDmg = heroDmg * skillMult * additionalMult;
    const totalDmg = totalHeroDmg + partnerDmg;

    window.playerData.calculated_dmg = totalHeroDmg;
    document.getElementById('diff-total-dmg').innerText = totalDmg.toLocaleString('ru-RU', { maximumFractionDigits: 0 });

    const baseTough = parseFloat(document.getElementById('diff-base-tough').value) || 0;
    
    let damageTakenMult = 1.0;
    document.querySelectorAll('.calc-reduce-dmg').forEach(inp => {
        const val = parseFloat(inp.value) || 0;
        if (val > 0 && val < 100) {
            damageTakenMult *= (1 - val / 100);
        }
    });
    const reductionMult = 1 / damageTakenMult;

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

    window.playerData.calculated_tough = totalTough - partnerTough;
    document.getElementById('diff-total-tough').innerText = totalTough.toLocaleString('ru-RU', { maximumFractionDigits: 0 });

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
        window.selectRiftDifficulty(cost, name, diff, true);
        return;
    }
    if (type === 'np') {
        window.selectRiftDifficulty(cost, name, diff, false);
        return;
    }
    if (type === 'np') {
                const currentAct = window.playerData.act || 1;

        const count = window.playerData.np_count || 0;
        const isNGPlus = currentAct > 5;
        const maxCount = isNGPlus ? 12 : 6;
        const discountStep = isNGPlus ? 0.05 : 0.1;
        // Для НГ+ лимит скидки 60% (12 * 5%), для обычного 50% (5 * 10%, 6-й уже макс)
        const maxDiscount = isNGPlus ? 0.6 : 0.5; 

        if (count >= maxCount) {
            window.showCustomAlert(`⚠️ В этом акте уже пройдено ${maxCount} НП (максимум).<br>Смените акт для сброса.`);
            return;
        }
        const discount = Math.min(maxDiscount, count * discountStep);
        cost = cost * (1 - discount);
        if (discount > 0) name += ` (-${discount*100}%)`;
    }

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
                
                if (g.includes('искатель') || g.includes('джимми')) {
                    window.playerData.adventurer_loc_penalty = true;
                    window.saveToStorage();
                }

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
    window.pendingRift = { name: name, diff: diff, isVP: isVP };
    document.getElementById('rift-diff-cost-display').innerHTML = `Выберите уровень сложности относительно вашего текущего (${diff}):`;
    
    const container = document.getElementById('rift-diff-buttons-container');
    
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
    
        const currentAct = window.playerData.act || 1;

    const count = window.playerData.np_count || 0;
    const isNGPlus = currentAct > 5;
    const discountStep = isNGPlus ? 0.05 : 0.1;
    const maxDiscount = isNGPlus ? 0.6 : 0.5;
    
    const discount = isVP ? 0 : Math.min(maxDiscount, count * discountStep); // Скидка только для НП
    const g = (window.playerData.guild || "").toLowerCase();
    const isGoblinHunter = g.includes('охотник на гоблинов');
    
    const empCheckbox = document.getElementById('vp-empowered');
    const isEmpowered = empCheckbox && empCheckbox.checked;

    const currentIndex = window.difficultyOrder.indexOf(diff);
    let html = '';
    let offsets = [];
    if (isVP) {
        offsets = [
            { val: 0, mult: "x1.75 / x1", bg: '#2d5a3a', border: '#66ff66' },
            { val: -1, mult: "x1.17 / x0.67", bg: '#444', border: '#888' },
            { val: -2, mult: "x0.78 / x0.44", bg: '#5a4a2d', border: '#d4af37' },
            { val: -3, mult: "x0.52 / x0.29", bg: '#5a2d2d', border: '#ff4444' }
        ];
    } else {
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
            if (isVP) base = base * 2.5;
            if (isGoblinHunter && !isVP) base *= 0.8;
            if (isVP && isEmpowered) base *= 1.1;
            
            const finalCost = Math.floor(base * (1 - discount));
            const displayCost = finalCost; 
 
            const costStr = window.formatCurrency(Math.floor(displayCost));
            const label = opt.val > 0 ? `+${opt.val}` : `${opt.val}`;

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
    const empCheckbox = document.getElementById('vp-empowered');

    const currentMoney = window.getAllMoneyInYen();
    if (currentMoney >= finalCost) {
        window.setMoneyFromYen(currentMoney - Math.floor(finalCost));
        
        window.playerData.is_in_np = true;
        if (!params.isVP) {
            window.playerData.np_count = (window.playerData.np_count || 0) + 1;
        }
        window.playerData.current_run_diff = offset;
        if (params.isVP) {
            window.playerData.is_vp = true;
            window.playerData.vp_empowered = (empCheckbox && empCheckbox.checked);
        }
        window.playerData.current_rift_cost = Math.floor(finalCost);

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
        baseCost *= 2.5;
        if (window.playerData.vp_empowered) {
            baseCost *= 1.1;
        }
        finalCost = Math.floor(baseCost);
    } else {
        const g = (window.playerData.guild || "").toLowerCase();
        if (g.includes('охотник на гоблинов')) {
            baseCost *= 0.8;
        }
                const currentAct = window.playerData.act || 1;

        const count = window.playerData.np_count || 1;
const isNGPlus = currentAct > 5;
        const discountStep = isNGPlus ? 0.05 : 0.1;
        const maxDiscount = isNGPlus ? 0.6 : 0.5;
        const discount = Math.min(maxDiscount, Math.max(0, (count - 1) * discountStep));        finalCost = Math.floor(baseCost * (1 - discount));
    }
    
    const currentMoney = window.getAllMoneyInYen();
    if (currentMoney >= finalCost) {
        window.setMoneyFromYen(currentMoney - finalCost);
        window.playerData.current_rift_cost = (window.playerData.current_rift_cost || 0) + finalCost;

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

    if (window.playerData.is_vp) {
        if (!success) {
            window.playerData.is_vp = false;
            window.playerData.is_in_np = false;
            window.playerData.vp_is_solo = false;
            window.playerData.vp_empowered = false;
            window.playerData.current_rift_cost = 0;
            window.playerData.saved_rift_multiplier = null;
            window.playerData.saved_rift_exp_multiplier = null;

            window.saveToStorage();
            window.updateActiveRiftModal();
            window.showCustomAlert("❌ ВП провален. Награды потеряны.");
            return;
        }

        let options = `<option value=">15">> 15 мин</option>`;
        for (let i = 15; i >= 1; i--) {
            options += `<option value="${i}">${i} мин</option>`;
        }
        
        const msg = `<p>Выберите время прохождения:</p><select id="vp-close-time" style="background:#000; color:#fff; padding:5px; font-size:1rem;"></select>`;
        
        window.showCustomConfirm(msg, () => {
            const timeVal = document.getElementById('vp-close-time').value;
            window.finishVPClose(timeVal);
        });
        return;
    }

    document.getElementById('active-rift-modal').style.display = 'none';

    window.playerData.is_in_np = false;
    window.saveToStorage();

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
    
    setTimeout(() => {
        window.nextRiftSequenceStep(1);
    }, 1500);
}

window.finishVPClose = function(timeVal) {
    const offset = window.playerData.current_run_diff || 0;
    
    const timeMultMap = {
        ">15": 2.0, "15": 1.8, "14": 1.6, "13": 1.4, "12": 1.2, "11": 1.1,
        "10": 1.0, "9": 0.8, "8": 0.6, "7": 0.4, "6": 0.3, "5": 0.2,
        "4": 0.1, "3": 0.066, "2": 0, "1": 0
    };
    const timeMult = timeMultMap[timeVal] || 0;

    const isLate = (timeVal === ">15"); 
    
    let diffMult = 1.0;
    if (isLate) {
        if (offset === 0) diffMult = 1.0;
        else if (offset === -1) diffMult = 0.67;
        else if (offset === -2) diffMult = 0.44;
        else if (offset === -3) diffMult = 0.29;
    } else {
        if (offset === 0) diffMult = 1.75;
        else if (offset === -1) diffMult = 1.17;
        else if (offset === -2) diffMult = 0.78;
        else if (offset === -3) diffMult = 0.52;
    }

    const totalMultiplier = timeMult * diffMult;
    window.activeRiftMultiplier = totalMultiplier;
    
    let refundMsg = "";
    if (!isLate) {
        const totalCost = window.playerData.current_rift_cost || 0;
        if (totalCost > 0) {
            const refund = Math.floor(totalCost * 0.25);
            window.addYen(refund);
            refundMsg = `<br><span style="color:#66ff66">Возврат 25%: ${window.formatCurrency(refund)}</span>`;
        }
    }

    window.playerData.vp_close_mode = true;

    document.getElementById('active-rift-modal').style.display = 'none';
    window.saveToStorage();
    window.updateUI();

    window.showCustomAlert(`✅ ВП закрыт!<br>Время: ${timeVal} мин<br>Множитель: x${totalMultiplier.toFixed(2)}${refundMsg}<br>Введите статистику убийств для начисления наград.`);
    
    setTimeout(() => {
        window.nextRiftSequenceStep(1);
    }, 1500);
}

window.nextRiftSequenceStep = function(step) {
    switch(step) {
        case 1:
            window.openExpCalculator();
            const expBtn = document.querySelector('#exp-calc-modal .exp-apply-btn');
            expBtn.onclick = function() {
                window.applyExpCalculation();
                if (window.activeRiftMultiplier) setTimeout(() => window.nextRiftSequenceStep(2), 500);
            };
            break;
        case 2:
            window.sellItemsBulk();
            break;
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
    
    const diffLabel = offset > 0 ? `+` : (offset < 0 ? `` : `+0`);
    
    document.getElementById('active-rift-info').innerHTML = `
        Сложность: <span style="color:#fff">${diff} (${diffLabel})</span><br>
        Акт: <span style="color:#d4af37">${act}</span> | Портал №: <span style="color:#d4af37">${count}</span>
    `;
    
    modal.style.display = 'flex';
}

window.getMaxTheftAttempts = function(level) {
    if (level < 10) return 5;
    if (level < 20) return 6;
    if (level < 30) return 7;
    if (level < 40) return 8;
    if (level < 50) return 10;
    if (level < 60) return 11;
    if (level < 70) return 13;
    return 15 + Math.floor((level - 70) / 5);
}

window.toggleTheftMode = function() {
    const lvl = window.playerData.level;
    let rowId = "";
    if (lvl <= 19) rowId = "tr-theft-1";
    else if (lvl <= 39) rowId = "tr-theft-2";
    else rowId = "tr-theft-3";

    document.querySelectorAll('.theft-row').forEach(r => r.classList.remove('active'));
    
    const row = document.getElementById(rowId);
    if (row) {
        row.classList.add('active');
    }
}

window.attemptTheft = function(grade, baseChance, rowNum) {
    const row = document.getElementById(`tr-theft-${rowNum}`);
    if (!row || !row.classList.contains('active')) return;

    const currentLvl = window.playerData.level;
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
    const chance = parseFloat(cell.dataset.chance);
    const input = document.getElementById('theft-item-level');
    const itemLvl = input ? parseInt(input.value) : window.playerData.level;
    const roll = Math.random() * 100;
    const isSuccess = roll <= chance;
    
    window.theftState = {
        success: isSuccess,
        grade: grade,
        level: itemLvl
    };

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

    const propsContainer = document.getElementById('theft-props-container');
    const sourceHTML = document.querySelector('.ancient-props-container').innerHTML;
    propsContainer.innerHTML = sourceHTML;

    modal.style.display = 'block';
    document.querySelectorAll('.theft-row').forEach(r => r.classList.remove('active'));
}

window.finalizeTheft = function() {
    const state = window.theftState;
    const modal = document.getElementById('theft-modal');
    
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

    window.playerData.theft_attempts_count = (window.playerData.theft_attempts_count || 0) + 1;
    window.playerData.theft_attempts_level = window.playerData.level;

    if (state.success) {
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
            window.playerData.steals++;
            window.updateUI();
            
            if (window.pendingTheftJoin) {
                window.pendingTheftJoin.done++;
                const remaining = window.pendingTheftJoin.required - window.pendingTheftJoin.done;
                
                if (remaining <= 0) {
                    const joinData = window.pendingTheftJoin;
                    window.pendingTheftJoin = null;
                    
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

            if (window.checkGuildProgression) window.checkGuildProgression();
        }, true);
    } else {
        let fineAmount = price;
        const g = (window.playerData.guild || "").toLowerCase();
        
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
        if (side === 'left') angleBase = 0;
        else if (side === 'right') angleBase = Math.PI;
        else if (side === 'top') angleBase = Math.PI / 2;
        else if (side === 'bottom') angleBase = -Math.PI / 2;
        
        const angle = angleBase + (Math.random() * 2 - 1) * (Math.PI / 2.2);
        const velocity = 50 + Math.random() * 80;
        
        spark.style.setProperty('--tx', (Math.cos(angle) * velocity) + 'px');
        spark.style.setProperty('--ty', (Math.sin(angle) * velocity) + 'px');
        
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 600);
    }
}
