window.worldData = {
    portals: [
        { id: 'portals_rating', title: 'Таблица рейтинга' },
        { id: 'portals_pentagram', title: 'Пентограмма душ' },
        { id: 'portals_vp', title: 'ВП' },
        { id: 'portals_np', title: 'НП + Локации' }
    ],
    portals_rating: {
        content: `
            <p style="color: #ff4444; text-align: center;">❗ (2 игрока, хардкор) 2024 – 2025</p>
            <hr>
            <p style="color: #d4af37;"><b>🔹 Награда за вхождение в таблицу:</b></p>
            <p>До 100🏛️: 6🥇 * 1.04<sup>ур</sup></p>
            <p>После 100🏛️: 6🥇 * 1.05<sup>ур</sup></p>
            <hr>
            <p style="color: #d4af37;"><b>🔹 Награда за каждый Torment (1 раз):</b></p>
            <p>До 100🏛️: 1🥇 * 1.04<sup>ур</sup></p>
            <p>После 100🏛️: 1🥇 * 1.05<sup>ур</sup></p>
            <hr>
            <p style="font-size: 0.85rem; background: rgba(255,255,255,0.05); padding: 10px;">
                ❗ Награда в 💰 выдаётся только на рейтингах:<br>
                <b>600, 500, 400, 300, 200, 100, 50, 25, 10, 5, 2 и 1</b>
            </p>
        `
    },
    portals_pentagram: {
        content: `
            <p style="text-align: center; color: #66ccff; font-weight: bold;">Пентограмма Душ — это Куб Канаи</p>
            
            <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; margin-bottom: 10px; border: 1px solid #333;">
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; margin-bottom: 5px;">
                    <input type="checkbox" id="penta_1" onchange="togglePentagram('penta_1')"> 
                    <span>1️⃣ вкладка — закрытие 25🏛️</span>
                </label>
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; margin-bottom: 5px;">
                    <input type="checkbox" id="penta_2" onchange="togglePentagram('penta_2')"> 
                    <span>2️⃣ вкладка — закрытие 60🏛️</span>
                </label>
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <input type="checkbox" id="penta_3" onchange="togglePentagram('penta_3')"> 
                    <span>3️⃣ вкладка — закрытие 100🏛️</span>
                </label>
            </div>
            <hr>
            <p style="color: #ff4444;">❗ Чтобы использовать изученные вещи в кубе, нужно найти и купить их в этой жизни.</p>
            <p><b>Слоты:</b> 1-й (Босс), 2-й (Босс +1), 3-й (Босс +2)</p>
            <hr>
            <p style="color: #d4af37;"><b>🛠️ СВОЙСТВА И УСЛОВИЯ:</b></p>
            <p>🔹 <b>Извлечение свойства:</b> купить 💍</p>
            <p>🔹 <b>Улучшение редкого:</b> редкий 💍 + 10 дыханий + 3 B-gr рес. + 10📖 или 30⌛</p>
            <p>🔹 <b>Конвертация комплекта:</b> 💍 + 30 дыханий + 10 B-gr рес. + 30📖 или 90⌛</p>
            <p>🔹 <b>Усилить древний:</b> ❗ Древние и обычные самоцветы нужно купить 🙏</p>
        `
    },
    portals_vp: {
        content: `
            <p>🔹 <b>Стоимость входа:</b> 💰 х2.5 от НП</p>
            <p style="color: #ff4444; border: 1px solid #5a0000; padding: 10px;">
                ‼️ В ВП не считаются 📖, ⏳ и 💀, ☠️ пока портал не закрыт. Если завалили — ничего не засчитывается.
            </p>
            <p>🔹 Повышение уровня лег. камней входит в цену.<br>
            🔹 Улучшить портал (+1 к камням): <b>+10% 💰</b></p>
            
            <hr>
            <p style="color: #d4af37; text-align: center;">🕝 <b>МНОЖИТЕЛИ ВРЕМЕНИ (Для 💰):</b></p>
            <table style="width: 100%; font-size: 0.8rem; text-align: center; border-collapse: collapse;">
                <tr><td>>15м: <b>х2</b></td><td>15м: <b>х1.8</b></td><td>14м: <b>х1.6</b></td><td>13м: <b>х1.4</b></td></tr>
                <tr><td>12м: <b>х1.2</b></td><td>11м: <b>х1.1</b></td><td>10м: <b>х1</b></td><td>9м: <b>х0.8</b></td></tr>
                <tr><td>8м: <b>х0.6</b></td><td>7м: <b>х0.4</b></td><td>6м: <b>х0.3</b></td><td>5м: <b>х0.2</b></td></tr>
                <tr><td>4м: <b>х0.1</b></td><td>3м: <b>х0.066</b></td><td>2м: <b>х0</b></td><td>1м: <b>х0</b></td></tr>
            </table>
            <hr>
            <p style="color: #66ccff; text-align: center;">💪🏽 <b>МНОЖИТЕЛИ СЛОЖНОСТИ (💰 в 🏦):</b></p>
            <p>✅ <b>Если ВОВРЕМЯ:</b></p>
            <table style="width: 100%; font-size: 0.85rem; text-align: center;">
                <tr style="color: #d4af37;"><th>+0</th><th>-1</th><th>-2</th><th>-3</th></tr>
                <tr><td>х1.75</td><td>х1.17</td><td>х0.78</td><td>х0.52</td></tr>
            </table>
            <p>❌ <b>Если НЕ ВОВРЕМЯ:</b></p>
            <table style="width: 100%; font-size: 0.85rem; text-align: center;">
                <tr style="color: #d4af37;"><th>+0</th><th>-1</th><th>-2</th><th>-3</th></tr>
                <tr><td>х1</td><td>х0.67</td><td>х0.44</td><td>х0.29</td></tr>
            </table>
        `
    },
    portals_np: {
        content: `
            <p style="color: #d4af37; text-align: center;">💰 <b>СТОИМОСТЬ 1 ЛОКАЦИИ:</b></p>
            <div style="column-count: 2; font-size: 0.85rem; line-height: 1.5;">
                Высокий: 23🥈<br>Эксперт: 29🥈<br>Мастер: 37🥈<br>Т1: 44🥈<br>Т2: 55🥈<br>
                Т3: 69🥈<br>Т4: 86🥈<br>Т5: 1.08🥇<br>Т6: 1.35🥇<br>Т7: 1.55🥇<br>
                Т8: 1.79🥇<br>Т9: 2.06🥇<br>Т10: 2.36🥇<br>Т11: 2.72🥇<br>Т12: 3.29🥇<br>
                Т13: 3.61🥇<br>Т14: 3.98🥇<br>Т15: 4.38🥇<br>Т16: 4.81🥇
            </div>
            <p style="font-size: 0.8rem; color: #888; margin-top: 5px;">* После T6 х1.15, после T11 х1.1.</p>
            
            <hr>
            <p style="color: #66ff66; text-align: center;">📖 И ⏳ И 💰 в 💼</p>
            <table style="width: 100%; font-size: 0.9rem; text-align: center;">
                <tr style="color: #d4af37;"><th>+1</th><th>+0</th><th>-1</th><th>-2</th></tr>
                <tr><td>х1.5</td><td>х1</td><td>х0.66</td><td>х0.44</td></tr>
            </table>
            <p style="color: #ffcc00; font-size: 0.85rem; text-align: center; margin-top: 10px;">
                ❗ Перепрохождение актовых локаций стоит <b>х0.5 от НП</b>.
            </p>
        `
    },
    death_root: [
        { id: 'professions_menu', title: 'Профессии' },
        { id: 'difficulty_table', title: 'Уровень сложности' },
        { id: 'definitions_info', title: 'Обозначения', content: 'В разработке...' },
        { id: 'death_rules', title: 'Смерти', content: 'В разработке...' }
    ],
    professions_menu: [
        { id: 'prof_1', title: '1 Профессия' },
        { id: 'prof_2', title: '2 Профессия' },
        { id: 'prof_3', title: '3 Профессия' }
    ],
    prof_1: {
        content: `
            <p style="color: #66ccff; text-align: center;">❗ Уровень сложности: <b>Мастер</b></p>
            <hr>
            <p>✅ +2 Активных умения</p>
            <p>✅ +1 Пассивное умение</p>
            <p>✅ +1.5 📖 и ⏳</p>
            <p>✅ +1 🥈</p>
            <div style="text-align: center; margin-top: 15px;">
                <button class="claim-reward-btn" onclick="claimProfessionReward(1)">💰 ПОЛУЧИТЬ НАГРАДУ</button>
            </div>
        `
    },
    prof_2: {
        content: `
            <p style="color: #ffcc00; text-align: center;">❗ Уровень сложности: <b>Т1</b></p>
            <hr>
            <p>✅ +2 Активных умения</p>
            <p>✅ +1 Пассивное умение</p>
            <p>✅ +10 🥈</p>
            <div style="text-align: center; margin-top: 15px;">
                <button class="claim-reward-btn" id="btn-prof-2" onclick="claimProfessionReward(2)">💰 ПОЛУЧИТЬ НАГРАДУ</button>
            </div>
        `
    },
    prof_3: {
        content: `
            <p>Пройти 🏛️ в одиночку на уровне сложности по шкале 70 уровня.</p>
            <p><small>❗ Время закрытия 🏛️ не важно.</small></p>
            <p style="font-size: 0.85rem; color: #ff7979;">❗ Если с 68 по 70 🌒 урон был занижен вне города, сложность считается от макс. урона за игру.</p>
            <hr>
            <p>✅ +1 Активное умение</p>
            <p>✅ +2 Пассивных умения</p>
            <p>✅ +💍 С 👹 уже ваши</p>
            <div style="text-align: center; margin-top: 15px;">
                <button class="claim-reward-btn" id="btn-prof-3" onclick="claimProfessionReward(3)">💰 ПОЛУЧИТЬ НАГРАДУ</button>
            </div>
        `
    },
    difficulty_table: {
        content: `
            <p style="text-align: center; color: #ff4444; font-weight: bold;">👥 РАСЧЕТ ДЛЯ 2 ИГРОКОВ</p>
            <p style="font-size: 0.9rem;">🌒 01-19: Высокий | 🌒 20-39: Эксперт<br>🌒 40-60: Мастер | 🌒 61-65: Т1 | 🌒 66-69: Т2</p>
            <hr>
            <p style="font-size: 0.85rem; color: #d4af37;"><b>Как считается УРОН (🔹 Умножение):</b><br>
            Урон героя 🔹 Множитель умения на вещах 🔹 % умения 🔹 Стихии 🔹 Лег.камни 🔹 Куб</p>
            <hr>
            <p style="color: #66ff66;"><b>🛡️ КАК СЧИТАЕТСЯ ЖИВУЧЕСТЬ:</b></p>
            <p style="font-size: 0.85rem;">(⛑️ + Восстановление) 🔹 ⛑️ от легендарок 🔹 ⛑️ в скиллах 🔹 ⛑️ в пассивках</p>
            <hr>
            <p style="color: #d4af37; text-align: center;"><b>📈 ТАБЛИЦА ПРОГРЕССИИ (T1-T16):</b></p>
            <table style="width: 100%; font-size: 0.75rem; border-collapse: collapse; text-align: center;">
                <tr style="color: #d4af37; border-bottom: 2px solid #5a0000;">
                    <th>Torment</th><th>⚔️ Урон</th><th>🛡️ Живучесть</th><th>💰 Мод.</th>
                </tr>
                <tr><td>T1</td><td>2кк</td><td>4.34кк</td><td>—</td></tr>
                <tr><td>T2</td><td>3.2кк</td><td>7.14кк</td><td>—</td></tr>
                <tr><td>T3</td><td>6кк</td><td>11.46кк</td><td>—</td></tr>
                <tr><td>T4</td><td>9.75кк</td><td>18.12кк</td><td>—</td></tr>
                <tr><td>T5</td><td>15.6кк</td><td>29.4кк</td><td>—</td></tr>
                <tr><td>T6</td><td>25кк</td><td>47.1кк</td><td>—</td></tr>
                <tr><td>T7</td><td>55кк</td><td>75.36кк</td><td>—</td></tr>
                <tr><td>T8</td><td>121кк</td><td>120.58кк</td><td>х1.1</td></tr>
                <tr><td>T9</td><td>266кк</td><td>192.93кк</td><td>х1.1</td></tr>
                <tr><td>T10</td><td>586кк</td><td>308.69кк</td><td>х1.2</td></tr>
                <tr><td>T11</td><td>1.29ккк</td><td>494кк</td><td>х1.2</td></tr>
                <tr><td>T12</td><td>2.83ккк</td><td>790кк</td><td>х1.3</td></tr>
                <tr><td>T13</td><td>6.23ккк</td><td>1.264ккк</td><td>х1.3</td></tr>
                <tr><td>T14</td><td>8.54ккк</td><td>2.023ккк</td><td>х1.4</td></tr>
                <tr><td>T15</td><td>18.8ккк</td><td>3.237ккк</td><td>х1.4</td></tr>
                <tr><td>T16</td><td>41.4ккк</td><td>5.179ккк</td><td>х1.5</td></tr>
            </table>
        `
    },
    definitions_info: {
        content: `
            <p style="text-align: center; color: #d4af37; font-size: 1.2rem; border-bottom: 2px double #5a0000; margin-bottom: 15px;">📜 ГЛОССАРИЙ МОДА</p>
            <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                <div style="flex: 1; min-width: 200px;">
                    <p style="color: #66ccff; border-bottom: 1px solid #333;"><b>📊 ОСНОВНОЕ:</b></p>
                    <p>📖 — Руна (навыки) | ⏳ — Парагон</p>
                    <p>💀 — Обычный моб | ☠️ — Элитный моб</p>
                    <p>🌒 — Уровень героя / вещи | 💪🏽 — Сложность</p>
                    <p>👹 — Любой босс | ⭐ — Гоблин</p>
                    <p style="color: #ffd700; border-bottom: 1px solid #333; margin-top: 15px;"><b>💰 ЭКОНОМИКА:</b></p>
                    <p>🥇 Золото | 🥈 Серебро | 🥉 Медь | 🧧 Йена</p>
                    <p>💰 Баланс | 💴 Заработок | 💊 Банка HP | 🧪 Дыхание Смерти</p>
                </div>
                <div style="flex: 1; min-width: 200px;">
                    <p style="color: #ff9900; border-bottom: 1px solid #333;"><b>⚔️ СНАРЯЖЕНИЕ:</b></p>
                    <p>💎 Камни | 💍 Вещи | 🧩 Ресурсы</p>
                    <p>⚔️ Оружие | 🛡️ Ультимативный сет</p>
                    <p>👣 Пассивки | 🐾 Навыки</p>
                    <p style="color: #a29bfe; border-bottom: 1px solid #333; margin-top: 15px;"><b>🔮 СТАТЫ:</b></p>
                    <p>🏮 Сила | 🥢 Ловкость | 🔮 Интеллект | ⛑️ Живучесть</p>
                </div>
            </div>
            <hr style="border-color: #333;">
            <p style="color: #d4af37;"><b>📦 ГРЕЙДЫ ВЕЩЕЙ:</b></p>
            <p>📓 <b>1-20🌒:</b> Белые (No Grade)</p>
            <p>📘 <b>21-40🌒:</b> Синие (D Grade)</p>
            <p>📒 <b>41-52🌒:</b> Жёлтые (C Grade)</p>
            <p>📙 <b>52-61🌒:</b> Легенда без св-ва (B Grade)</p>
            <p>📕 <b>61-66🌒:</b> Легенда со св-вом (A Grade)</p>
            <p>📗 <b>66+🌒:</b> Древние / S Grade / Spectrum</p>
            <hr style="border-color: #333;">
            <p style="color: #ff7979;"><b>⚠️ ПРАВИЛА И ГИЛЬДИИ:</b></p>
            <p>🫳 Кража | 🎭 Репутация | 🔖 Закены</p>
            <p>🧾 Ранг | 📢 Вступление | ‼️ Крит. правило</p>
            <p>� Позитив | 🔻 Негатив | 🔹/🌀 Пункты</p>
        `
    },
    death_rules: {
        content: `
            <div style="text-align: center; margin-bottom: 20px;">
                <button class="death-btn" onclick="processDeath()">☠️ Я УМЕР</button>
                <button class="death-confirm-btn" style="background: #444; border-color: #888; font-size: 0.8rem; margin-left: 10px;" onclick="processPartnerDeath()">Напарник умер</button>
            </div>
            <div style="border: 2px solid #ff4444; padding: 15px; background: rgba(255, 68, 68, 0.05); border-radius: 8px;">
                <p style="color: #ff4444; font-weight: bold; text-align: center; font-size: 1.1rem;">💀 ПОСЛЕДСТВИЯ СМЕРТИ ГЕРОЯ:</p>
                <hr style="border-color: #5a0000;">
                <p>🔹 <b>Предметы:</b> Потеря 1 надетого предмета.</p>
                <p>🔹 <b>Гильдии:</b> -10% ресурса ранга (Торговцы: -20%💰).</p>
                <p>🔹 <b>Руны:</b> -10% 📖 от текущего количества ⏳.</p>
                <p>🔹 <b>Навыки:</b> 5% шанс забыть рандомный скилл.</p>
            </div>
            <div style="margin-top: 15px; font-size: 0.9rem; color: #bbb;">
                <p>❗ <b>Группа:</b> Другие игроки теряют в 2 раза меньше и НЕ теряют предмет.</p>
                <p>❗ <b>Маги:</b> Коллегия не теряет 📖 при сопутствующем уроне.</p>
            </div>
        `
    }
};
