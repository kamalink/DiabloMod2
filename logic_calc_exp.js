// --- КАЛЬКУЛЯТОР ОПЫТА ---

window.openExpCalculator = function() {
    const modal = document.getElementById('exp-calc-modal');
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';

    document.getElementById('exp-calc-modal').style.display = 'block';
    document.getElementById('exp-mobs').value = 0;
    document.getElementById('exp-elites').value = 0;
    document.getElementById('exp-bosses').value = 0;
    
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
    
    const chestRow = document.getElementById('exp-chests-row');
    const bigChestRow = document.getElementById('exp-big-chests-row');
    if (chestRow) { chestRow.style.display = 'none'; document.getElementById('exp-chests').value = 0; }
    if (bigChestRow) { bigChestRow.style.display = 'none'; document.getElementById('exp-big-chests').value = 0; }

    const g = (window.playerData.guild || "").toLowerCase();
    
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

    const dMobs = Math.max(0, mobs - (window.playerData.last_input_mobs || 0));
    const dElites = Math.max(0, elites - (window.playerData.last_input_elites || 0));

    const partnerKillsEl = document.getElementById('exp-partner-kills');
    if (window.partnerData && window.partnerData.last_kills !== undefined) {
        partnerKillsEl.style.display = 'inline';
        partnerKillsEl.innerText = `(Нап: ${window.partnerData.last_kills})`;
    }

    let runesBase = (dMobs * 0.01) + (dElites * 0.1) + (bosses * 3);
    let paraBase = (dMobs * 0.01) + (dElites * 0.1) + (bosses * 3);
    let chestsRunes = 0;
    let chestsPara = 0;

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
        const rank = window.playerData.rank || 1;
        // Ранги 1-10: Обычный сундук
        const normMults = [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 1.0];
        // Ранги 1-10: Большой сундук
        const bigMults = [1.5, 1.7, 1.8, 1.9, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0];
        const norm = normMults[Math.min(rank - 1, 9)] || 0.5;
        const big = bigMults[Math.min(rank - 1, 9)] || 1.5;
        chestsRunes = (chests * norm) + (bigChests * big);
        chestsPara = (chests * norm) + (bigChests * big);
    } else if (g.includes('искатель богатства')) {
        const rank = window.playerData.rank || 1;
        const normMults = [0.7, 0.75, 0.75, 0.75, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4];
        const bigMults = [2.0, 2.1, 2.2, 2.35, 2.5, 2.8, 3.1, 3.4, 3.7, 4.0];
        const norm = normMults[Math.min(rank - 1, 9)] || 0.7;
        const big = bigMults[Math.min(rank - 1, 9)] || 2.0;
        chestsRunes = (chests * norm) + (bigChests * big);
        chestsPara = (chests * norm) + (bigChests * big);
    } else if (g.includes('джимми')) {
        chestsRunes = (chests * 0.3) + (bigChests * 1.0);
        chestsPara = (chests * 0.3) + (bigChests * 1.0);
    }

    if (window.playerData.adventurer_loc_penalty) {
        chestsRunes *= 0.5;
        chestsPara *= 0.5;
    }

    const totalRunes = ((runesBase * runesMod) + chestsRunes).toFixed(2);
    const totalPara = ((paraBase * paraMod) + chestsPara).toFixed(2);

    let riftMsg = "";
    if (riftMult !== 1) {
        riftMsg = `<br><span style="color:#ffd700; font-size:0.8rem;">(Множитель: x${riftMult.toFixed(2)})</span>`;
    }
    if (window.playerData.adventurer_loc_penalty) {
        riftMsg += `<br><span style="color:#ff4444; font-size:0.8rem;">(Штраф локации: Сундуки -50%)</span>`;
    }

    const diffText = (dMobs > 0 || dElites > 0) ? `<br><span style="font-size:0.8rem; color:#aaa;">(+💀, +☠️)</span>` : "";
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
    
    const dMobs = Math.max(0, mobs - (window.playerData.last_input_mobs || 0));
    const dElites = Math.max(0, elites - (window.playerData.last_input_elites || 0));
    
    window.playerData.last_run_kills = dMobs;

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

    if (window.playerData.is_vp && !window.playerData.vp_close_mode) {
        window.showCustomAlert("⚠️ В ВП опыт начисляется только после закрытия портала.");
        return;
    }

    window.playerData.runes = parseFloat((window.playerData.runes + addRunes).toFixed(2));
    window.playerData.para = parseFloat((window.playerData.para + addPara).toFixed(2));
    window.playerData.kills += dMobs;
    if (g.includes('салага') || g.includes('громила') || g.includes('лорд войны')) {
        window.playerData.kills += dElites;
    }
    window.playerData.elites_solo += dElites;
    window.playerData.bosses += bosses;
    window.playerData.chests_found += (chests + bigChests);
    
    if (window.playerData.kills > (window.playerData.highest_kills || 0)) {
        window.playerData.highest_kills = window.playerData.kills;
    }

    // Синхронизация полей ввода в UI, чтобы updateUI не сбросил значения
    const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
    setVal('input-kills', window.playerData.kills);
    setVal('input-elites-solo', window.playerData.elites_solo);
    setVal('input-bosses', window.playerData.bosses);
    setVal('input-chests', window.playerData.chests_found);

    let rewardMsg = "";
    if (dMobs > 0 && (g.includes('салага') || g.includes('громила') || g.includes('лорд войны'))) {
        let mult = 0;
        if (g.includes('салага')) mult = 0.88;
        else if (g.includes('громила')) mult = 1.75;
        else if (g.includes('лорд войны')) mult = 1.23;
        
        const rank = window.playerData.rank || 0;
        const rankMultipliers = [0, 1.5, 2.5, 4, 6, 9, 12, 15, 18, 21.5, 27];
        const rankMult = (rank > 0) ? (rankMultipliers[rank] || 1) : 1;

        if (contractCheck && contractCheck.checked && (g.includes('громила') || g.includes('лорд войны'))) {
            mult *= 3;
        }
        
        const reward = Math.floor(dMobs * mult * window.playerData.level * rankMult);
        window.addYen(reward);
        rewardMsg = `<br>💰 Получено: ${window.formatCurrency(reward)}`;
    }

    if (g.includes('охотник') || g.includes('помощник')) {
        const rank = window.playerData.rank || 0;
        const rankMultipliers = [0, 1.5, 2.5, 4, 6, 9, 12, 15, 18, 21.5, 27];
        const rankMult = (rank > 0) ? (rankMultipliers[rank] || 1) : 1;
        const lvl = window.playerData.level;

        let hYen = 0;
        let hRep = 0;

        if (g.includes('охотник на гоблинов')) {
            if (bosses > 0) {
                hYen += bosses * 500 * lvl * rankMult;
                hRep += bosses * 30;
            }
        } else if (g.includes('охотник на ☠️')) {
            if (dElites > 0) {
                hYen += dElites * 100 * lvl * rankMult;
                hRep += dElites * 3;
            }
            if (bosses > 0) {
                hYen += bosses * 500 * lvl * rankMult;
                hRep += bosses * 30;
            }
        } else if (g.includes('помощник охотника')) {
            if (dElites > 0) { hYen += dElites * 50 * lvl; hRep += dElites * 3; }
            if (bosses > 0) { hYen += bosses * 250 * lvl; hRep += bosses * 30; }
        }

        if (hYen > 0 || hRep > 0) {
            window.addYen(hYen);
            window.playerData.reputation += hRep;
            rewardMsg += `<br>💰 Охота: ${window.formatCurrency(hYen)}${hRep > 0 ? ` | 🎭 +` : ''}`;
        }
    }

    // --- ЛОГИКА ПОЛОМКИ ПРЕДМЕТОВ (ИСКАТЕЛИ / ДЖИММИ) ---
    let brokenItems = [];
    if (dMobs > 0 && (g.includes('искатель') || g.includes('джимми'))) {
        const oldKillCount = window.playerData.kills - dMobs;
        const newKillCount = window.playerData.kills;
        
        // Считаем, сколько "сотен" мы пересекли
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
    if (brokenItems.length > 0) {
        rewardMsg += `<br><br><span style="color:#ff4444">💔 СЛОМАНО ПРЕДМЕТОВ:</span><br>${brokenItems.join('<br>')}`;
    }

    if (window.playerData.vp_close_mode) {
        window.playerData.is_vp = false;
        window.playerData.vp_close_mode = false;
        window.playerData.is_in_np = false;
        window.playerData.vp_empowered = false;
        window.playerData.current_rift_cost = 0;
    }
    
    if (window.playerData.adventurer_loc_penalty) {
        window.playerData.adventurer_loc_penalty = false;
    }

    window.saveToStorage();
    window.updateUI();
    document.getElementById('exp-calc-modal').style.display = 'none';
    
    let progressionTriggered = false;
    if (window.checkGuildProgression) {
        progressionTriggered = window.checkGuildProgression();
    }

    if (!progressionTriggered) {
        window.showCustomAlert(`✅ Получено: ${addRunes} 📖 и ${addPara} ⏳${rewardMsg}<br>Статистика обновлена.`);
    }
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
