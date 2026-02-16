// --- ЭКОНОМИКА И ВАЛЮТА ---

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
    
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    
    const lvl = window.playerData.level;

    const g = (window.playerData.guild || "").toLowerCase();
    if (!g.includes('гэмблер') && !g.includes('вор') && !g.includes('воришка')) {
        window.showCustomAlert("❗ Только члены Темного Братства могут покупать закены.");
        return;
    }

    if (mode === 'buy') {
        if (lvl < 20) {
            window.showCustomAlert("❌ Покупка закенов доступна с 20 уровня.");
            return;
        }
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
    modal.dataset.mode = mode;
    window.updateZakenTotalCost();
    
    modal.style.display = 'block';
}

window.updateZakenTotalCost = function() {
    const count = parseInt(document.getElementById('zaken-count-input').value) || 0;
    const modal = document.getElementById('zaken-buy-modal');
    const mode = modal.dataset.mode;
    const lvl = window.playerData.level;
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
        window.playerData.deals += count;
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

        const costPerUnit = 100000;
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
        const pricePerUnit = 50000;
        let sellMult = 1.0;
        let bonuses = [];

        if (g.includes('торговц')) {
             const sellPercents = [10, 13, 15, 17, 19, 21, 23, 25, 28, 32, 35];
             const p = sellPercents[playerRank] || 10;
             sellMult = p / 5;
             bonuses.push(`Торговцы x${sellMult.toFixed(2)}`);
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
            if (lvl <= 20) pricePerPotion = 1000;
            else if (lvl <= 40) pricePerPotion = 4000;
            else if (lvl <= 52) pricePerPotion = 20000;
            else if (lvl <= 61) pricePerPotion = 40000;
            else if (lvl <= 66) pricePerPotion = 80000;
            else pricePerPotion = 200000;
        } else {
            const basePrice = 200000;
            const maxVp = playerData.maxVp || 0;
            pricePerPotion = basePrice * Math.pow(1.05, maxVp);
        }

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

window.getSmithSellPrice = function(level) {
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
    return 25;
}

window.sellResources = function() {
    const modal = document.getElementById('multi-sell-modal');
    const inputsContainer = document.getElementById('multi-sell-inputs');
    const totalDisplay = document.getElementById('multi-sell-total');
    const okBtn = document.getElementById('multi-sell-ok-btn');
    const cancelBtn = document.getElementById('multi-sell-cancel-btn');
    const levelInput = document.getElementById('multi-sell-level');

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
        <label for="multi-sell-input-${r.type}" style="display: flex; justify-content: space-between; align-items: center;">
            <span>${r.name} (x${r.mult})<br><small style="color:#888">В наличии: ${r.stock}</small></span>
            <input type="number" id="multi-sell-input-${r.type}" name="multi-sell-input-${r.type}" data-type="${r.type}" data-mult="${r.mult}" class="multi-sell-input" value="0" min="0" style="width: 80px; padding: 5px; background: #000; border: 1px solid #444; color: #fff;">
        </label>
    `).join('');

    const updateTotal = () => {
        let totalYen = 0;
        const currentLevelInput = document.getElementById('multi-sell-level');
        const level = parseInt(currentLevelInput.value) || 1;
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
        if (g.includes('гэмблер')) {
            sellMult *= 0.75;
            bonuses.push(`Гэмблер -25%`);
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
        totalDisplay.innerHTML = `Итого: ${window.formatCurrency(Math.floor(totalYen))}`;
    };

    levelInput.onchange = updateTotal;
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
        if (g.includes('гэмблер')) {
            sellMult *= 0.75;
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
    if (!g.includes(guildType)) {
        window.showCustomAlert("❌ Вы не можете использовать эту услугу.");
        return;
    }

    let pricePerRune = 0;
    const rank = window.playerData.rank || 1;
    
    if (g.includes('чародей') && !g.includes('ученик')) {
        const prices = [0, 2000, 3700, 6000, 9000, 13500, 18000, 22500, 27000, 32000, 45000];
        const basePrice = prices[rank] || 2000;
        const bonusPercent = 27.5 * (window.playerData.stat_int / 100);
        pricePerRune = basePrice * (1 + bonusPercent / 100);
    } else if (g.includes('ученик')) {
        const basePrice = 1500;
        const bonusPercent = 15 * (window.playerData.stat_int / 100);
        pricePerRune = basePrice * (1 + bonusPercent / 100);
    } else if (g.includes('вампир')) {
        const basePrice = 1500;
        const bonusPercent = 30 * (window.playerData.stat_int / 100);
        pricePerRune = basePrice * (1 + bonusPercent / 100);
    }

    window.showCustomPrompt("Продажа Рун", `Цена за 1 📖: ${window.formatCurrency(pricePerRune)}<br>У вас: ${window.playerData.runes} 📖`, "1", (quantity) => {
        if (isNaN(quantity) || quantity <= 0) return;
        if (g.includes('чародей')) {
            quantity = Math.floor(quantity);
        }
        if (window.playerData.runes < quantity) { window.showCustomAlert("Недостаточно рун."); return; }
        
        window.playerData.runes -= quantity;
        window.playerData.runes_sold += quantity;
        
        let totalGain = Math.floor(pricePerRune * quantity);
        if (g.includes('вампир')) {
            totalGain = Math.floor(totalGain * 0.5);
        }
        window.playerData.gold_y += totalGain;
        
        while (window.playerData.gold_y >= 100) { window.playerData.gold_y -= 100; window.playerData.gold_c++; }
        while (window.playerData.gold_c >= 100) { window.playerData.gold_c -= 100; window.playerData.gold_s++; }
        while (window.playerData.gold_s >= 100) { window.playerData.gold_s -= 100; window.playerData.gold_g++; }
        
        window.updateUI();
        window.showCustomAlert(`✅ Продано ${quantity} 📖 за ${window.formatCurrency(totalGain)}`);
    });
}

window.buyRunes = function() {
    const lvl = window.playerData.level;
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
                gold_g: 0, gold_s: 0, gold_c: 0, gold_y: 0,
                runes: 0, para: 0, zakens: 0, maxVp: 0, potions: 0, death_breath: 0,
                guild_html: "", class_html: "",
                stat_str: 0, stat_dex: 0, stat_int: 0, stat_vit: 0,
                kills: 0, base_kills: 0, base_elites: 0,
                elites_solo: 0, bosses: 0, gobs_solo: 0, gobs_assist: 0, 
                found_legs: 0, found_yellows: 0,
                res_n: 0, res_dc: 0, res_b: 0, res_a: 0, reagents: 0,
                runes_sold: 0, reputation: 0, deals: 0, chests_found: 0,
                steals: 0,
                theft_fine: "", zaken_discount: "", xp_bonus: "", potion_price: "",
                lvl70_portal: "", active_rents: [], forgottenSkills: {},
                professions: { 1: false, 2: false, 3: false }, claimed_torments: [], claimed_ranks: [],
                refused_wizard_promotion: false,
                difficulty: "Высокий",
                penta_1: false, penta_2: false, penta_3: false,
                inventory: [],
                learnedSkills: {},
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

window.openAddMoneyModal = function() {
     const modal = document.getElementById('add-money-modal');
    document.getElementById('add-gold-g').value = 0;
    document.getElementById('add-gold-s').value = 0;
    document.getElementById('add-gold-c').value = 0;
    document.getElementById('add-gold-y').value = 0;
    
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
