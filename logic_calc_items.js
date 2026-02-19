// --- ПРЕДМЕТЫ, КРАФТ, ТОРГОВЛЯ ---

const gemPrices = [
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

    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';

    buttonsContainer.innerHTML = '';

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
    if (window.activeRiftMultiplier !== null && mode === 'sell') {
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
            singleCost = 0;
            operationText += " (Бесплатно для Торговцев)";
        }
    } else if (operation === 'sell') {
        let sellMult = 1;
        if (g.includes('торговц')) {
            const sellPercents = [10, 13, 15, 17, 19, 21, 23, 25, 28, 32, 35];
            const p = sellPercents[playerRank] || 10;
            sellMult = p / 5;
            bonuses.push(`Торговцы x${sellMult.toFixed(2)}`);
        }
        singleCost = priceData.sell * sellMult;
        if (g.includes('вампир')) {
            const penalties = [0.50, 0.48, 0.46, 0.44, 0.42, 0.40, 0.38, 0.36, 0.34, 0.30];
            const penalty = penalties[Math.min(playerRank - 1, 9)] || 0.50;
            singleCost *= (1 - penalty);
            bonuses.push(`Вампир -${(penalty * 100).toFixed(0)}%`);
        }
        if (g.includes('гэмблер')) {
            singleCost = Math.floor(singleCost * 0.75);
            bonuses.push(`Гэмблер -25%`);
        }
        operationText = `Продать ${quantity} 💎 ${gemRank} ранга`;
        isIncome = true;
    } else if (operation === 'rent') {
        singleCost = priceData.rent;
        operationText = `Арендовать ${quantity} 💎 ${gemRank} ранга`;
    }

    let totalCost = singleCost * quantity;
    if (isIncome && window.activeRiftMultiplier !== null) {
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

    closeGemModal();
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
            showCustomAlert(`✅ Услуга оплачена! Списано: `);
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
    });
}

window.getBaseNPriceForCraft = function(level) {
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

window.getHandPenaltyMult = function(containerId) {
    const g = (window.playerData.guild || "").toLowerCase();
    if (!g.includes('охотник')) return 1.0;

    const container = document.getElementById(containerId);
    if (!container) return 1.0;
    
    const radio = container.querySelector('input[type="radio"]:checked');
    if (!radio) return 1.0;
    
    if (radio.value === 'right') {
        if (g.includes('гоблин')) return 1.5;
        if (g.includes('на ☠️')) return 1.25;
        if (g.includes('помощник')) return 1.1;
    }
    return 1.0;
}

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

window.getPlayerGradeIndex = function(level) {
    if (level < 20) return 0;
    if (level < 40) return 1;
    if (level < 52) return 2;
    if (level < 61) return 3;
    if (level < 70) return 4;
    return 5;
}

window.getCraftedItemBasePrice = function(level, grade) {
    let baseVal = 0;
    switch(grade) {
        case 'N': baseVal = 300; break;
        case 'D': baseVal = 900; break;
        case 'C': baseVal = 900; break;
        case 'DC': baseVal = 900; break;
        case 'B': baseVal = 1200; break;
        case 'A': baseVal = 3200; break;
        case 'S': baseVal = 3200 * 1.5; break;
        case 'S+': baseVal = 3200 * 1.56; break;
        case 'Spectrum': baseVal = 3200 * 4.875; break;
        default: baseVal = 300;
    }
    return baseVal * Math.pow(1.1, level - 1);
}

window.getBulkItemPrice = function(level, multiplier = 1) {
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

    const handSelector = document.getElementById('hand-selector-main');
    const g = (window.playerData.guild || "").toLowerCase();
    if (handSelector) {
        handSelector.style.display = (g.includes('охотник')) ? 'flex' : 'none';
    }

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
        <label for="multi-sell-item-input-${r.type}" style="display: flex; justify-content: space-between; align-items: center;">
            <span>${r.name}</span>
            <input type="number" id="multi-sell-item-input-${r.type}" name="multi-sell-item-input-${r.type}" data-mult="${r.mult}" class="multi-sell-input" value="0" min="0" style="width: 80px; padding: 5px; background: #000; border: 1px solid #444; color: #fff;">
        </label>
    `).join('');

    const updateTotal = () => {
        let totalYen = 0;
        const currentLevelInput = document.getElementById('multi-sell-level');
        const level = parseInt(currentLevelInput.value) || 1;
        
        window.lastResourceSellLevel = level;
        const riftMult = (window.activeRiftMultiplier !== null) ? window.activeRiftMultiplier : 1;
        
        const basePrice = getBulkItemPrice(level, riftMult);
        const g = (window.playerData.guild || "").toLowerCase();
        let gamblerBonusLeft = window.playerData.gambler_bonus_sales_left || 0;

        let sellMultiplier = 1.0;
        if (g.includes('чародей') && !g.includes('ученик')) {
            const wizPenalties = [0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.75, 0.72, 0.70];
            const rank = window.playerData.rank || 0;
            const mult = wizPenalties[Math.max(0, Math.min(rank - 1, 9))] || 0.9;
            sellMultiplier *= mult;
        } else if (g.includes('ученик чародея')) {
            sellMultiplier *= 0.91;
        }
        if (g.includes('вор') && !g.includes('воришка')) sellMultiplier *= 1.5;
        if (g.includes('воришка')) sellMultiplier *= 1.2;
        if (g.includes('вампир')) {
            const penalties = [0.50, 0.48, 0.46, 0.44, 0.42, 0.40, 0.38, 0.36, 0.34, 0.30];
            const penalty = penalties[Math.min((window.playerData.rank || 1) - 1, 9)] || 0.50;
            sellMultiplier *= (1 - penalty);
        }

        inputsContainer.querySelectorAll('.multi-sell-input').forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const mult = parseFloat(input.dataset.mult);
           
            if (g.includes('гэмблер')) {
                let bonusCount = Math.min(quantity, gamblerBonusLeft);
                let normalCount = quantity - bonusCount;
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

    levelInput.onchange = updateTotal;
    inputsContainer.querySelectorAll('.multi-sell-input').forEach(input => {
        input.oninput = updateTotal;
    });

    okBtn.onclick = () => {
        updateTotal();
        
        let totalGain = 0;
        const level = parseInt(levelInput.value) || 1;
        const riftMult = (window.activeRiftMultiplier !== null) ? window.activeRiftMultiplier : 1;
        const basePrice = getBulkItemPrice(level, riftMult);
        let gamblerBonusLeft = window.playerData.gambler_bonus_sales_left || 0;
        const g = (window.playerData.guild || "").toLowerCase();
        let sellMultiplier = 1.0;
        
        if (g.includes('чародей') && !g.includes('ученик')) {
            const wizPenalties = [0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.75, 0.72, 0.70];
            const rank = window.playerData.rank || 0;
            const mult = wizPenalties[Math.max(0, Math.min(rank - 1, 9))] || 0.9;
            sellMultiplier *= mult;
        } else if (g.includes('ученик чародея')) {
            sellMultiplier *= 0.91;
        }
        if (g.includes('вор') && !g.includes('воришка')) sellMultiplier *= 1.5;
        if (g.includes('воришка')) sellMultiplier *= 1.2;
        if (g.includes('вампир')) {
            const penalties = [0.50, 0.48, 0.46, 0.44, 0.42, 0.40, 0.38, 0.36, 0.34, 0.30];
            const penalty = penalties[Math.min((window.playerData.rank || 1) - 1, 9)] || 0.50;
            sellMultiplier *= (1 - penalty);
        }

        inputsContainer.querySelectorAll('.multi-sell-input').forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const mult = parseFloat(input.dataset.mult);
            if (g.includes('гэмблер')) {
                let bonusCount = Math.min(quantity, gamblerBonusLeft);
                let normalCount = quantity - bonusCount;
                totalGain += bonusCount * basePrice * mult * 5;
                totalGain += normalCount * basePrice * mult * 1.25;
                gamblerBonusLeft -= bonusCount;
            } else {
                totalGain += quantity * basePrice * mult;
            }
        });
        if (g.includes('гэмблер')) {
            window.playerData.gambler_bonus_sales_left = gamblerBonusLeft;
        }

        totalGain *= sellMultiplier;

        if (totalGain > 0) {
            const currentMoney = getAllMoneyInYen();
            setMoneyFromYen(currentMoney + Math.floor(totalGain));
            updateUI();
            window.logEvent(`Продано ресурсов на ${window.formatCurrency(Math.floor(totalGain))}`, 'gain');
            showCustomAlert(`✅ Предметы проданы! Получено: ${window.formatCurrency(Math.floor(totalGain))}`);
        }
        modal.style.display = 'none';
        if (window.activeRiftMultiplier !== null) {
            setTimeout(() => window.openSellCraftedModal(), 500);
        }
    };

    cancelBtn.onclick = () => {
        modal.style.display = 'none';
         if (window.activeRiftMultiplier !== null) {
            setTimeout(() => window.openSellCraftedModal(), 500);
        }
    };

    updateTotal();
    modal.style.display = 'flex';
}

 window.toggleSellProperty = function(el, percent) {
    const propName = el.innerText;
    const bases = ["Основа оружия", "Основа брони", "Основа бижы"];
    
    if (bases.includes(propName) && !el.classList.contains('selected')) {
        const allSelected = document.querySelectorAll('.sell-prop-item.selected');
        allSelected.forEach(sel => {
            if (bases.includes(sel.innerText) && sel !== el) {
                sel.classList.remove('selected');
            }
        });
    }
    el.classList.toggle('selected');
    el.dataset.percent = percent;
}

window.openSellCraftedModal = function() {
    const modal = document.getElementById('sell-craft-modal');
    const title = modal.querySelector('h3');
    let btn = document.getElementById('craft-sell-action-btn');
    if (!btn) btn = modal.querySelector('.craft-btn');
    
    const handSelector = document.getElementById('hand-selector-craft');
    const g = (window.playerData.guild || "").toLowerCase();
    if (handSelector) {
        handSelector.style.display = 'none';
    }
    if (window.activeRiftMultiplier !== null) {
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

    if (window.activeRiftMultiplier !== null) {
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

    let price = getCraftedItemBasePrice(level, grade);
    let bonuses = [];

    if (window.activeRiftMultiplier !== null) {
        price = price * 0.05;
    }

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

    if (window.activeRiftMultiplier === null) {
        const g = (window.playerData.guild || "").toLowerCase();
        let guildMultiplier = 1.0;
        if (g.includes('салага') || g.includes('громила') || g.includes('лорд')) { guildMultiplier = 0.9; bonuses.push(`Соратники -10%`); }
        if (g.includes('вампир')) { 
            const penalties = [0.50, 0.48, 0.46, 0.44, 0.42, 0.40, 0.38, 0.36, 0.34, 0.30];
            const penalty = penalties[Math.min(playerRank - 1, 9)] || 0.50;
            guildMultiplier = (1 - penalty);
            bonuses.push(`Вампир -${(penalty * 100).toFixed(0)}%`); 
        }

        if (g.includes('чародей') && !g.includes('ученик')) {
            const wizPenalties = [0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.75, 0.72, 0.70];
            guildMultiplier = wizPenalties[Math.min(playerRank, 9)] || 0.9;
            bonuses.push(`Чародей ${Math.round((guildMultiplier-1)*100)}%`);
        }
        
        price = price * guildMultiplier;
    }
    if ((window.playerData.guild || "").toLowerCase().includes('гэмблер')) {
        price = Math.floor(price * 1.25);
    }
    if (window.activeRiftMultiplier !== null) {
        price *= window.activeRiftMultiplier;
    }
    const totalYen = Math.floor(price);
    
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";

    document.getElementById('sell-craft-modal').style.display = 'none';

    window.showCustomConfirm(
        `Продать предмет (Lvl , )?<br>Свойств: ${selectedProps.length} (%)<br>Цена: ${window.formatCurrency(totalYen)}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            window.setMoneyFromYen(currentMoney + totalYen);
            window.updateUI();
            window.logEvent(`Продан предмет: ${window.formatCurrency(totalYen)}`, 'gain');
            window.showCustomAlert(`✅ Предмет продан! Получено: ${window.formatCurrency(totalYen)}`);
            selectedProps.forEach(el => el.classList.remove('selected'));
            
            // Если мы в цепочке наград, открываем окно снова, чтобы можно было нажать "Далее"
            if (window.activeRiftMultiplier !== null) {
                setTimeout(() => window.openSellCraftedModal(), 500);
            }
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
    const that = this;
    const modal = document.getElementById('buy-sell-agrade-modal');
    const mode = modal.dataset.mode;
    const classMult = parseFloat(modal.dataset.classMult);
    const level = parseInt(document.getElementById('agrade-level-input').value) || window.playerData.level;
    const g = (window.playerData.guild || "").toLowerCase();

    const basePrice = 3200 * Math.pow(1.1, level - 1);
    let grade = 'A';
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
        const itemGradeIdx = 4;
        const playerGradeIdx = window.getPlayerGradeIndex(window.playerData.level);
        const diff = Math.max(0, itemGradeIdx - playerGradeIdx);
        const gradePenaltyMult = 1 + (diff * 0.2);
        finalPrice *= gradePenaltyMult;
        if (gradePenaltyMult > 1) bonuses.push(`Грейд +${Math.round((gradePenaltyMult-1)*100)}%`);

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
        finalPrice *= buyMult;
    }
    
    if (mode === 'sell') {
        finalPrice *= 0.05; // Базовая цена продажи 5%
        if (g.includes('вампир')) {
            const penalties = [0.50, 0.48, 0.46, 0.44, 0.42, 0.40, 0.38, 0.36, 0.34, 0.30];
            const penalty = penalties[Math.min((window.playerData.rank || 1) - 1, 9)] || 0.50;
            finalPrice *= (1 - penalty);
            bonuses.push(`Вампир -${(penalty * 100).toFixed(0)}%`);
            }
        if (g.includes('гэмблер')) {
            finalPrice *= 1.25;
            bonuses.push(`Гэмблер +25%`);
        }
        if (g.includes('чародей') && !g.includes('ученик')) {
            const wizPenalties = [0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.75, 0.72, 0.70];
            const rank = window.playerData.rank || 0;
            const mult = wizPenalties[Math.max(0, Math.min(rank - 1, 9))] || 0.9;
            finalPrice *= mult;
            bonuses.push(`Чародей ${Math.round((mult-1)*100)}%`);
        }
        if (g.includes('ученик чародея')) {
            finalPrice *= 0.91;
            bonuses.push(`Ученик -9%`);
        }
        if (g.includes('чародей') && !g.includes('ученик')) {
            const wizPenalties = [0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.75, 0.72, 0.70];
            const rank = window.playerData.rank || 0;
            const mult = wizPenalties[Math.max(0, Math.min(rank - 1, 9))] || 0.9;
            finalPrice *= mult;
            bonuses.push(`Чародей ${Math.round((mult-1)*100)}%`);
        }
        if (g.includes('ученик чародея')) {
            finalPrice *= 0.91;
            bonuses.push(`Ученик -9%`);
        }
        if (g.includes('вор') && !g.includes('воришка')) {
            finalPrice *= 1.5;
            bonuses.push(`Вор +50%`);
        }
        if (g.includes('воришка')) {
            finalPrice *= 1.2;
            bonuses.push(`Воришка +20%`);
        }
    }

    const cost = Math.floor(finalPrice);
    const valError = window.validateItemAction(cost, level, "A", mode);
    if (valError) {
        window.showCustomAlert(valError);
        return;
    }
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";

    if (mode === 'buy') {
        document.getElementById('buy-sell-agrade-modal').style.display = 'none';
    }

    if (mode === 'buy') {
        window.showCustomConfirm(
            `Купить предмет?<br>Цена: ${window.formatCurrency(cost)}`,
            () => {
                const currentMoney = window.getAllMoneyInYen();
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
                    window.logEvent(`Куплен предмет: ${name} (A)`, 'loot');
                        window.updateUI();
                    }, true);

                    selectedProps.forEach(el => el.classList.remove('selected'));
                } else {
                    window.showCustomAlert(`❌ Недостаточно средств! Нужно: ${window.formatCurrency(cost)}`);
                }
            }
        );
    } else {
        const currentMoney = window.getAllMoneyInYen();
        window.setMoneyFromYen(currentMoney + cost);
        window.updateUI();
        window.showCustomAlert(`✅ Предмет продан! Получено: ${window.formatCurrency(cost)}`);
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
    window.updateAncientInputs();
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

window.buyAncientImmediate = function(mode = 'buy') {
    const level = parseInt(document.getElementById('ancient-level-input').value) || 1;
    const grade = document.getElementById('ancient-grade-input').value || "B";
    const type = document.getElementById('ancient-type-input').value || "ancient";
    const itemClassMultEl = document.getElementById('ancient-item-class');
    const itemClassMult = itemClassMultEl ? (parseFloat(itemClassMultEl.value) || 1.0) : 1.0;
    
    let baseVal = (grade === 'B') ? 1200 : 3200;
    let basePrice = baseVal * Math.pow(1.1, level - 1);
    let bonuses = [];

    if (grade === 'A' && itemClassMult !== 1.0) {
        basePrice *= itemClassMult;
        bonuses.push(`Класс x`);
    }
    
    let typeMult = 1;
    if (type === 'ancient') typeMult = 1.5;
    else if (type === 'primal') typeMult = 2.5;
    
    const itemGradeIdx = (grade === 'B') ? 3 : 4;
    const playerGradeIdx = window.getPlayerGradeIndex(window.playerData.level);
    const diff = Math.max(0, itemGradeIdx - playerGradeIdx);
    const gradePenaltyMult = 1 + (diff * 0.2);
    if (mode === 'buy' && gradePenaltyMult > 1) bonuses.push(`Грейд +${Math.round((gradePenaltyMult-1)*100)}%`);

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
    
    let finalPrice = basePrice * typeMult * (totalPercent / 100);
    if (mode === 'buy') {
        finalPrice *= gradePenaltyMult;
    }
    
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
    
    if (mode === 'sell') {
        finalPrice *= 0.05; // Базовая цена продажи 5% (как вендору)
        
        if (g.includes('вампир')) {
            const penalties = [0.50, 0.48, 0.46, 0.44, 0.42, 0.40, 0.38, 0.36, 0.34, 0.30];
            const penalty = penalties[Math.min((window.playerData.rank || 1) - 1, 9)] || 0.50;
            finalPrice *= (1 - penalty);
            bonuses.push(`Вампир -${(penalty * 100).toFixed(0)}%`);
        }
        if (g.includes('гэмблер')) {
            finalPrice *= 1.25;
            bonuses.push(`Гэмблер +25%`);
        }
        if (g.includes('ученик чародея')) {
            finalPrice *= 0.91;
            bonuses.push(`Ученик -9%`);
        }
        if (g.includes('чародей') && !g.includes('ученик')) {
            const wizPenalties = [0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.75, 0.72, 0.70];
            const rank = window.playerData.rank || 0;
            const mult = wizPenalties[Math.max(0, Math.min(rank - 1, 9))] || 0.9;
            finalPrice *= mult;
            bonuses.push(`Чародей ${Math.round((mult-1)*100)}%`);
        }
        if (g.includes('ученик чародея')) {
            finalPrice *= 0.91;
            bonuses.push(`Ученик -9%`);
        }
        if (g.includes('вор') && !g.includes('воришка')) {
            finalPrice *= 1.5;
            bonuses.push(`Вор +50%`);
        }
        if (g.includes('воришка')) {
            finalPrice *= 1.2;
            bonuses.push(`Воришка +20%`);
        }
    }
    
    finalPrice *= buyMult;
    const cost = Math.floor(finalPrice);
    const valError = window.validateItemAction(cost, level, grade, mode);
    if (valError) {
        window.showCustomAlert(valError);
        return;
    }
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";

    document.getElementById('buy-ancient-modal').style.display = 'none';

    if (mode === 'buy') {
    window.showCustomConfirm(
        `Купить ${type === 'ancient' ? 'Древний' : 'Первозданный'} -grade?<br>Свойств: ${selectedProps.length} (%)<br>Цена: ${window.formatCurrency(cost)}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            if (currentMoney >= cost) {
                window.setMoneyFromYen(currentMoney - cost);
                const defName = `${type === 'ancient' ? 'Древний' : 'Первозданный'} `;
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
                    window.logEvent(`Куплен предмет: ${name} (${type})`, 'loot');
                    window.updateUI();
                    window.showCustomAlert(`✅ Предмет куплен!`);
                }, true);

                selectedProps.forEach(el => el.classList.remove('selected'));
            } else {
                window.showCustomAlert(`❌ Недостаточно средств!`);
            }
        }
    );
    } else {
        window.showCustomConfirm(
            `Продать ${type === 'ancient' ? 'Древний' : 'Первозданный'} -grade?<br>Свойств: ${selectedProps.length} (%)<br>Цена: ${window.formatCurrency(cost)}`,
            () => {
                const currentMoney = window.getAllMoneyInYen();
                window.setMoneyFromYen(currentMoney + cost);
                window.updateUI();
                window.showCustomAlert(`✅ Предмет продан! Получено: ${window.formatCurrency(cost)}`);
                selectedProps.forEach(el => el.classList.remove('selected'));
            }
        );
    }
}

window.buySetImmediate = function(mode = 'buy') {
    const level = parseInt(document.getElementById('set-level-input').value) || 1;
    const grade = document.getElementById('set-grade-input').value;
    const type = document.getElementById('set-type-input').value;
    const countVal = parseInt(document.getElementById('set-count-input').value);
    let bonuses = [];
    
    const baseAPrice = 3200 * Math.pow(1.1, level - 1);
    
    let gradeMult = (grade === 'S+') ? 1.56 : 4.875;
    let typeMult = (type === 'normal') ? 1 : (type === 'ancient' ? 1.5 : 2.5);
    
    const itemGradeIdx = 5;
    const playerGradeIdx = window.getPlayerGradeIndex(window.playerData.level);
    const diff = Math.max(0, itemGradeIdx - playerGradeIdx);
    const gradePenaltyMult = 1 + (diff * 0.2);
    if (mode === 'buy' && gradePenaltyMult > 1) bonuses.push(`Грейд +${Math.round((gradePenaltyMult-1)*100)}%`);

    let countMult = 1;
    if (grade === 'S+') {
        if (countVal === 1) countMult = 1;
        else if (countVal === 2) countMult = 1.5;
        else if (countVal === 4) countMult = 2;
        else if (countVal === 6) countMult = 4;
    } else {
        if (countVal === 1) countMult = 1;
        else if (countVal === 2) countMult = 2;
        else if (countVal === 4) countMult = 4;
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
        const handMult = window.getHandPenaltyMult('hand-selector-set');
        if (handMult > 1) {
            buyMult *= handMult;
            bonuses.push(`Охотник (Рука) +${Math.round((handMult-1)*100)}%`);
        }
    }
    
    if (mode === 'sell') {
        finalPrice *= 0.05; // Базовая цена продажи 5% (как вендору)
        
        if (g.includes('вампир')) {
            const penalties = [0.50, 0.48, 0.46, 0.44, 0.42, 0.40, 0.38, 0.36, 0.34, 0.30];
            const penalty = penalties[Math.min((window.playerData.rank || 1) - 1, 9)] || 0.50;
            finalPrice *= (1 - penalty);
            bonuses.push(`Вампир -${(penalty * 100).toFixed(0)}%`);
        }
        if (g.includes('гэмблер')) {
            finalPrice *= 1.25;
            bonuses.push(`Гэмблер +25%`);
        }
        if (g.includes('ученик чародея')) {
            finalPrice *= 0.91;
            bonuses.push(`Ученик -9%`);
        }
        if (g.includes('вор') && !g.includes('воришка')) {
            finalPrice *= 1.5;
            bonuses.push(`Вор +50%`);
        }
        if (g.includes('воришка')) {
            finalPrice *= 1.2;
            bonuses.push(`Воришка +20%`);
        }
    }

    finalPrice *= buyMult;

    const cost = Math.floor(finalPrice);
    const valError = window.validateItemAction(cost, level, grade, mode);
    if (valError) {
        window.showCustomAlert(valError);
        return;
    }
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";

    document.getElementById('buy-set-modal').style.display = 'none';

    if (mode === 'buy') {
    window.showCustomConfirm(
        `Купить  ()?<br>Свойств: ${selectedProps.length} (%)<br>Цена: ${window.formatCurrency(cost)}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            if (currentMoney >= cost) {
                window.setMoneyFromYen(currentMoney - cost);
                const defName = `Set  ()`;
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
                    window.logEvent(`Куплен комплект: ${name}`, 'loot');
                    window.updateUI();
                    window.showCustomAlert(`✅ Комплект куплен!`);
                }, true);

                selectedProps.forEach(el => el.classList.remove('selected'));
            } else {
                window.showCustomAlert(`❌ Недостаточно средств!`);
            }
        }
    );
    } else {
        window.showCustomConfirm(
            `Продать  ()?<br>Свойств: ${selectedProps.length} (%)<br>Цена: ${window.formatCurrency(cost)}`,
            () => {
                const currentMoney = window.getAllMoneyInYen();
                window.setMoneyFromYen(currentMoney + cost);
                window.updateUI();
                window.showCustomAlert(`✅ Комплект продан! Получено: ${window.formatCurrency(cost)}`);
                selectedProps.forEach(el => el.classList.remove('selected'));
            }
        );
    }
}

window.manageLegendaryGem = function(classType, action) {
    let cost = 0;
    if (classType === 3) cost = 1500000;
    else if (classType === 2) cost = 4500000;
    else if (classType === 1) cost = 7000000;

    const g = (window.playerData.guild || "").toLowerCase();
    if (g.includes('торговц') && (action === 'insert' || action === 'remove')) {
        cost = 0;
    }

    const actionName = action === 'insert' ? "Вставить" : "Убрать";
    
    window.showCustomConfirm(
        ` Легендарный камень ( кл.)?<br>Стоимость: ${window.formatCurrency(cost)}`,
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

window.confirmSellLegendaryGem = function() {
    const classType = parseInt(document.getElementById('sell-gem-class').value);
    const level = parseInt(document.getElementById('sell-gem-level').value);
    
    if (isNaN(level) || level < 0) {
        window.showCustomAlert("❌ Некорректный уровень.");
        return;
    }
    
    let baseVal = 0;
    if (classType === 3) baseVal = 1500000 * 0.05;
    else if (classType === 2) baseVal = 4500000 * 0.05;
    else if (classType === 1) baseVal = 7000000 * 0.05;
    
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
        const penalties = [0.50, 0.48, 0.46, 0.44, 0.42, 0.40, 0.38, 0.36, 0.34, 0.30];
        const penalty = penalties[Math.min(playerRank - 1, 9)] || 0.50;
        sellMult *= (1 - penalty);
        bonuses.push(`Вампир -${(penalty * 100).toFixed(0)}%`);
         // Гэмблер -25% (штраф на камни тоже)
        if (g.includes('гэмблер')) { sellMult *= 0.75; bonuses.push(`Гэмблер -25%`); }
    }

    const sellPrice = baseVal * Math.pow(1.1, level) * sellMult;
    const totalYen = Math.floor(sellPrice);
    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";

    document.getElementById('sell-leg-gem-modal').style.display = 'none';

    window.showCustomConfirm(
        `Продать Лег. камень (Кл. , Ур. )?<br>Цена: ${window.formatCurrency(totalYen)}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            window.setMoneyFromYen(currentMoney + totalYen);
            window.updateUI();
            window.showCustomAlert(`✅ Камень продан! Получено: ${window.formatCurrency(totalYen)}`);
        }
    );
}

window.openCraftModal = function() {
    const modal = document.getElementById('sell-craft-modal');
    const title = modal.querySelector('h3');
    let btn = document.getElementById('craft-sell-action-btn');
    if (!btn) btn = modal.querySelector('.craft-btn');
    
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
    
    let price = getCraftedItemBasePrice(level, grade);

    let totalPercent = 0;
    let propsList = [];
    const modal = document.getElementById('sell-craft-modal');
    const selectedProps = modal.querySelectorAll('.sell-prop-item.selected');
    if (selectedProps.length === 0) {
        window.showCustomAlert("❌ Выберите хотя бы одно свойство.");
        return;
    }
    
    selectedProps.forEach(el => {
        totalPercent += parseFloat(el.dataset.percent);
        if (el.innerText.includes("Основа оружия")) isWeapon = true;
        propsList.push(el.innerText);
    });

    const itemGradeIdx = window.getGradeIndex(grade);
    const playerGradeIdx = window.getPlayerGradeIndex(window.playerData.level);
    const diff = Math.max(0, itemGradeIdx - playerGradeIdx);
    const gradePenaltyMult = 1 + (diff * 0.2);
    if (gradePenaltyMult > 1) bonuses.push(`Грейд +${Math.round((gradePenaltyMult-1)*100)}%`);

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
    
    document.getElementById('sell-craft-modal').style.display = 'none';

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
                    window.logEvent(`Скрафчен предмет: ${name} (${grade})`, 'loot');
                    window.updateUI();
                    
                    if (window.craftSound) {
                        window.craftSound.currentTime = 0;
                        window.craftSound.play().catch(() => {});
                    }
                    window.showCustomAlert(`✅ Предмет скрафчен!`);
                }, true);

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
    const playerRank = window.playerData.rank || 0;

    let baseVal = 0;
    if (grade === 'S+' || grade === 'Spectrum' || grade === 'S') {
        baseVal = 3200;
        if (grade === 'S') baseVal *= 1.5;
        if (grade === 'S+') baseVal *= 1.56;
        if (grade === 'Spectrum') baseVal *= 4.875;
    } else {
        baseVal = getCraftedItemBasePrice(level, grade);
    }

    let typeMult = 1;
    if (type === 'ancient') typeMult = 1.5;
    if (type === 'primal') typeMult = 2.5;

    const estimatedBuyPrice = baseVal * typeMult; 
    
    const meltValue = Math.floor(estimatedBuyPrice * 0.044);
    let finalMeltValue = meltValue;

    const g = (window.playerData.guild || "").toLowerCase();
    if (g.includes('торговц')) {
        const vit = window.playerData.stat_vit || 0;
        const bonusMult = 1 + (Math.floor(vit / 100) * 0.02);
        finalMeltValue = Math.floor(meltValue * bonusMult);
        if (bonusMult > 1) bonuses.push(`Торговцы +${Math.round((bonusMult-1)*100)}%`);
    }
    
    if (g.includes('вампир')) {
        const penalties = [0.50, 0.48, 0.46, 0.44, 0.42, 0.40, 0.38, 0.36, 0.34, 0.30];
        const penalty = penalties[Math.min(Math.max(0, playerRank - 1), 9)] || 0.50;
        finalMeltValue = Math.floor(finalMeltValue * (1 - penalty));
        bonuses.push(`Вампир -${(penalty * 100).toFixed(0)}%`);
    }
    
    if (g.includes('гэмблер')) {
        finalMeltValue = Math.floor(finalMeltValue * 0.75);
        bonuses.push(`Гэмблер -25%`);
    }

    const bonusText = bonuses.length ? `<br><span style="font-size:0.8rem; color:#aaa;">(${bonuses.join(', ')})</span>` : "";

    const m = document.getElementById('melt-item-modal');
    if(m) m.style.display = 'none';

    window.showCustomConfirm(
        `Расплавить предмет?<br>Получите: ${window.formatCurrency(finalMeltValue)}`,
        () => {
            const currentMoney = window.getAllMoneyInYen();
            window.setMoneyFromYen(currentMoney + finalMeltValue);
            window.updateUI();
            window.logEvent(`Расплавлен предмет: +${window.formatCurrency(finalMeltValue)}`, 'gain');
            window.showCustomAlert(`✅ Предмет расплавлен!`);
        }
    );
}

window.toggleItemLock = function(itemId) {
    const item = window.playerData.inventory.find(i => i.id === itemId);
    if (item) {
        item.isLocked = !item.isLocked;
        window.saveToStorage();
        window.renderInventoryWidget();
    }
}

window.openSellInventory = function(mode) {
    const inv = window.playerData.inventory || [];
    const playerRank = window.playerData.rank || 0;
    let itemsToShow = [];
    let title = "";
    
    if (mode === 'smith') {
        title = "⚒️ ПРОДАЖА КРАФТА (100%)";
        itemsToShow = inv.filter(i => i.isCrafted);
    } else {
        title = "💰 ПРОДАЖА ПРЕДМЕТОВ (50%)";
        itemsToShow = inv;
    }

    if (itemsToShow.length === 0) {
        window.showCustomAlert(mode === 'smith' ? "🎒 Нет скрафченных предметов." : "🎒 Инвентарь пуст.");
        return;
    }

    let html = `<h3 style="color:${mode === 'smith' ? '#d4af37' : '#ff4444'}; margin-top:0; text-align:center;">${title}</h3>`;
    html += `<div style="max-height: 300px; overflow-y: auto; text-align: left;">`;
    
    itemsToShow.forEach((item) => {
        let sellPrice = 0;
        
        if (mode === 'smith') {
            sellPrice = Math.floor(window.getCraftedItemBasePrice(item.level, item.grade));
        } else {
            const g = (item.grade || "").toUpperCase();
            // Пересчет цены для обычных предметов (чтобы убрать наценку за грейд при покупке)
            if (['N', 'D', 'C', 'B', 'A'].includes(g) && item.properties && item.properties.length > 0) {
                let base = window.getCraftedItemBasePrice(item.level, g);
                if (item.isPrimal) base *= 2.5;
                else if (item.isAncient) base *= 1.5;
                
                const propertyValues = {
                    "Основа оружия": 40, "Основа брони": 30, "Основа бижы": 30, "Живучесть": 30, "Осн.Хар.": 30, "Гнездо (голова/оруж)": 30,
                    "Восстановление": 20, "Все сопротивления": 15, "Крит урон": 15, "Крит шанс": 15,
                    "Не Осн.Хар.": 10, "Броня": 10, "Здоровье": 10, "Ур. в бижутерии": 10, "Скор. атак": 10, "Гнездо (броня)": 10, "Урон стихии": 10, "Урон умения": 10, "+ Ур. к скилу": 10, "Сниж. затрат / КДР": 10, "Урон по области": 10,
                    "Одно сопрот.": 5, "Скор. передвижения": 5, "Урон уменьшен": 5
                };
                let percent = 0;
                item.properties.forEach(p => percent += (propertyValues[p] || 0));
                sellPrice = Math.floor(base * (percent / 100) * 0.5);
            } else {
                sellPrice = Math.floor(item.buyPrice * 0.5);
            }
            
            if (window.activeRiftMultiplier) {
                sellPrice = Math.floor(sellPrice * window.activeRiftMultiplier);
            }
        }

        const lockBtn = item.isLocked ? `<span style="margin-right:5px;">🔒</span>` : "";
        const sellBtn = item.isLocked ? `<span style="color:#555; font-size:0.7rem;">Заблокировано</span>` : `<button class="craft-btn sell" style="font-size: 0.7rem; padding: 2px 5px;" onclick="window.processSellItem(${item.id}, ${sellPrice})">Продать (${window.formatCurrency(sellPrice)})</button>`;
        const rowStyle = item.isLocked ? "background: rgba(80, 20, 20, 0.3);" : "";

        html += `<div style="border-bottom: 1px solid #333; padding: 5px; display: flex; justify-content: space-between; align-items: center; ${rowStyle}">
            <span style="font-size:0.9rem;">${lockBtn}${item.name} <span style="color:#888">(${item.grade})</span></span>
            ${sellBtn}
        </div>`;
    });
    html += `</div>`;
    let closeAction = "document.getElementById('custom-confirm-modal').style.display='none'";
    let closeText = "ЗАКРЫТЬ";
    if (window.activeRiftMultiplier !== null && mode === 'smith') {
        closeAction = "document.getElementById('custom-confirm-modal').style.display='none'; window.sellResources();";
        closeText = "ДАЛЕЕ (Ресурсы) >>";
    }
    html += `<div style="text-align:center; margin-top:10px;"><button class="death-cancel-btn" onclick="${closeAction}">${closeText}</button></div>`;
    window.showCustomAlert(html);
    document.getElementById('confirm-yes-btn').style.display = 'none';
}

window.processSellItem = function(itemId, sellPrice) {
    const index = window.playerData.inventory.findIndex(i => i.id === itemId);
    if (index === -1) return;
    const item = window.playerData.inventory[index];
    
    if (item.isLocked) {
        window.showCustomAlert("❌ Предмет заблокирован.");
        return;
    }
    
    window.playerData.inventory.splice(index, 1);
    const currentMoney = window.getAllMoneyInYen();
    window.setMoneyFromYen(currentMoney + sellPrice);
    
    window.logEvent(`Продан предмет: ${item.name} (+${window.formatCurrency(sellPrice)})`, 'gain');
    window.updateUI();
    document.getElementById('custom-confirm-modal').style.display = 'none';
    window.showCustomAlert(`✅ Продано: ${item.name} за ${window.formatCurrency(sellPrice)}`);
}

window.buyItemImmediate = function() {
    if (!document.getElementById('buy-item-level-input')) return;
    const level = parseInt(document.getElementById('buy-item-level-input').value) || 1;
    const grade = document.getElementById('buy-item-grade-input').value;
    let bonuses = [];
    
    const basePrice = getCraftedItemBasePrice(level, grade); 
    
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
                    window.logEvent(`Куплен предмет: ${name} (${grade})`, 'loot');
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

window.toggleBuyProperty = function(el, percent) {
    const propName = el.innerText;
    const bases = ["Основа оружия", "Основа брони", "Основа бижы"];
    
    if (bases.includes(propName) && !el.classList.contains('selected')) {
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

window.openEnchantModal = function() {
    const modal = document.getElementById('enchant-item-modal');
    const list = document.getElementById('enchant-inventory-list');
    const selector = document.getElementById('enchant-properties-selector');
    const subtitle = document.getElementById('enchant-subtitle');
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
            let percent = 0.2;
            const g = (item.grade || "").toUpperCase();
            if (['A', 'S', 'S+', 'SPECTRUM', 'ANCIENT', 'PRIMAL'].includes(g) || g.includes('ANCIENT') || g.includes('PRIMAL')) {
                percent = 0.1;
            }
            
            let cost = Math.floor(item.buyPrice * percent * Math.pow(1.25, rerolls));

            const guild = (window.playerData.guild || "").toLowerCase();
            if (guild.includes('охотник на ☠️')) cost = Math.floor(cost * 0.8);
            else if (guild.includes('помощник охотника')) cost = Math.floor(cost * 0.9);
            else if (guild.includes('вор') && !guild.includes('воришка')) cost = Math.floor(cost * 0.75);
            else if (guild.includes('воришка')) cost = Math.floor(cost * 0.85);
            else if (guild.includes('громила')) cost = Math.floor(cost * 1.15);
        
            return `
                <div style="border-bottom: 1px solid #333; padding: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="color:#fff; font-weight:bold;">${item.name}</span> <span style="color:#888; font-size:0.8rem;">(${item.grade})</span><br>
                        <span style="color:#aaa; font-size:0.7rem;">Изменений: </span>
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

    const currentContainer = document.getElementById('enchant-current-props');
    currentContainer.innerHTML = (item.properties || []).map(p => 
        `<span class="sell-prop-item" onclick="window.selectOldEnchantProperty(this, '${p}')">${p}</span>`
    ).join('');

    const newPropsContainer = document.getElementById('enchant-new-props-list');
    const sourceHTML = document.querySelector('.ancient-props-container').innerHTML;
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

    document.getElementById('enchant-item-modal').style.display = 'none';

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
            const idx = item.properties.indexOf(target.oldProp);
            if (idx !== -1) {
                item.properties[idx] = target.newProp;
            }
        }
        window.updateUI();
        window.openEnchantModal();
        window.showCustomAlert(`✅ Свойство изменено! Списано: ${window.formatCurrency(cost)}`);
    } else {
        window.showCustomAlert(`❌ Недостаточно средств! Нужно: ${window.formatCurrency(cost)}`);
    }
}
