window.guildsData = {
    guilds: [
        { id: 'guilds_list', title: 'Гильдии' },
        { id: 'classes_list', title: 'Классы' }
    ],
    guilds_list: [
        { id: 'traders_guild', title: 'Гильдия Торговцев' },
        { id: 'hunters_guild', title: 'Гильдия Охотников' },
        { id: 'mages_college_menu', title: 'Коллегия магов' },
        { id: 'dark_brotherhood', title: 'Темное Братство' },
        { id: 'adventurers_menu', title: 'Искатели приключений' },
        { id: 'companions_menu', title: 'Соратники', }
    ],
    traders_guild: {
        title: 'Гильдия Торговцев',
        content: `
            <div style="border: 1px solid #d4af37; padding: 10px; background: rgba(212, 175, 55, 0.05); margin-bottom: 15px;">
                <p style="color: #66ff66; font-weight: bold; margin-bottom: 5px;">Плюсы ⬆️:</p>
                <p style="font-size: 0.9rem; line-height: 1.4;">
                📜🔺 Продажа 🧩 и 💎 (+лег) за 10%<br>
                📜🔺 Покупка 💍 за 95%<br>
                📜🔺 Аренда 💎. Встав/убр. оплачено.<br>
                📜🔺 Получение 💰 при расплавке: +2% за каждые 100 ⛑️
                </p>
            </div>
            <div style="border: 1px solid #ff4444; padding: 10px; background: rgba(255, 68, 68, 0.05); margin-bottom: 15px;">
                <p style="color: #ff4444; font-weight: bold; margin-bottom: 5px;">Минусы ⬇️:</p>
                <p style="font-size: 0.9rem; line-height: 1.4;">
                📜🔻 Получение 📖 и ⌛ только за ☠️ (Мобы = 0)<br>
                📜🔻 Нельзя платить ⌛ за смерть через пассивку.
                </p>
            </div>
            <p style="color: #ffcc00; font-size: 0.85rem; font-style: italic;">
                ❗ Выход из гильдии: 1🥇 за каждый макс. ⌛ за все время.
            </p>
            <hr>
            <p style="color: #d4af37; text-align: center; font-weight: bold;">💰 РАНГИ ГИЛЬДИИ</p>
            <table style="width: 100%; font-size: 0.85rem; text-align: left; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #5a0000; color: #d4af37;">
                    <th>Ранг</th><th>Условие</th><th>Бонус (Прод/Пок)</th>
                </tr>
                <tr><td>Наёмник</td><td>1к ⛑️</td><td>13% / 93.5%</td></tr>
                <tr><td>Слуга</td><td>2к ⛑️</td><td>15% / 92.5%</td></tr>
                <tr><td>Присягнувший</td><td>3к ⛑️</td><td>17% / 91.5%</td></tr>
                <tr><td>Законник</td><td>4к ⛑️</td><td>19% / 90.5%</td></tr>
                <tr><td>Кровный брат</td><td>5к ⛑️</td><td>21% / 89.5%</td></tr>
                <tr><td>Кузен</td><td>6к ⛑️</td><td>23% / 88.5%</td></tr>
                <tr><td>Брат</td><td>7к ⛑️</td><td>25% / 87.5%</td></tr>
                <tr><td>Отец</td><td>8к ⛑️</td><td>28% / 86%</td></tr>
                <tr><td>Зам</td><td>9к ⛑️</td><td>32% / 84%</td></tr>
                <tr style="color: #fff; background: rgba(212,175,55,0.2);">
                    <td>Глава</td><td>10к ⛑️</td><td>35% / 82.5%*</td>
                </tr>
            </table>
            <p style="font-size: 0.8rem; color: #aaa; margin-top: 5px;">* Глава получает полный опыт.</p>
        `
    },
    hunters_guild: [
        { id: 'goblin_hunter', title: 'Охотник на гоблинов' },
        { id: 'elite_hunter', title: 'Охотник на ☠️' },
        { id: 'hunter_helper', title: 'Помощник Охотника' }
    ],
    goblin_hunter: {
        content: `
            <div style="border: 1px solid #66ff66; padding: 10px; background: rgba(102, 255, 102, 0.05); margin-bottom: 10px;">
                <b style="color: #66ff66;">Плюсы ⬆️:</b><br>
                📜🔺 Получение 📖 и ⏳ на 20% ⏫<br>
                📜🔺 НП на 20% ⏬ по 💰
            </div>
            <div style="border: 1px solid #ff4444; padding: 10px; background: rgba(255, 68, 68, 0.05); margin-bottom: 10px;">
                <b style="color: #ff4444;">Минусы ⬇️:</b><br>
                📜🔻 Покупка оружия на 50% ⏫
            </div>
            <p>📢 <b>Условия вступления:</b> Убить гоблина самому (оплата 50%)</p>
            <p>Убить гоблина: 10🥉, 30🎭, 3📖 | 
			Убить гоблина самому: 32🥉, 100🎭, 15📖<br>
            👹 и 👹 портала: 5🥉, 30🎭</p>
            <p style="text-align: center; color: #d4af37;">💲: 💰 * 🌒 * Ранг</p>
            <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
                <tr style="color: #d4af37; border-bottom: 1px solid #5a0000;"><th>Ранг</th><th>🎭</th><th>Бонус ранга к 💰</th></tr>
                <tr><td>Слушатель</td><td>85</td><td>х1.5</td></tr>
                <tr><td>Уведомитель</td><td>215</td><td>х2.5</td></tr>
                <tr><td>Душитель</td><td>430</td><td>х4</td></tr>
                <tr><td>Палач</td><td>685</td><td>х6</td></tr>
                <tr><td>Убийца</td><td>1330</td><td>х9</td></tr>
                <tr><td>Истребитель</td><td>1870</td><td>х12</td></tr>
                <tr><td>Вагабонд</td><td>2315</td><td>х15</td></tr>
                <tr><td>Мастер</td><td>2750</td><td>х18</td></tr>
                <tr><td>Ликвидатор</td><td>3200</td><td>х21.5</td></tr>
                <tr><td>Ассасин</td><td>4000</td><td>х27</td></tr>
            </table>
        `
    },
    elite_hunter: {
        content: `
            <div style="border: 1px solid #66ff66; padding: 10px; background: rgba(102, 255, 102, 0.05); margin-bottom: 10px;">
                <b style="color: #66ff66;">Плюсы ⬆️:</b><br>
                📜🔺 Получение 📖 и ⏳ с ☠️ и 👹 на 33% ⏫<br>
                📜🔺 Изменение 💍 на 20% ⏬<br>
                📜🔺 Контракты: х3 💰 если убил 9/10 ☠️ в чате
            </div>
            <div style="border: 1px solid #ff4444; padding: 10px; background: rgba(255, 68, 68, 0.05); margin-bottom: 10px;">
                <b style="color: #ff4444;">Минусы ⬇️:</b><br>
                📜🔻 Покупка оружия (правая рука) на 25% ⏫
            </div>
            <p>📢 <b>Условия:</b> Убить 5 ☠️ (за 3 заплатят 💰 и 🎭)</p>
            <p>☠️: 1🥉, 3🎭 | 👹 и 👹 портала: 5🥉, 30🎭</p>
            <p style="text-align: center; color: #d4af37;">💲: 1🥉 * 🌒<sub>сред.</sub> * кол-во ☠️ * ⛓️</p>
            <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
                <tr style="color: #d4af37; border-bottom: 1px solid #5a0000;"><th>Ранг</th><th>🎭</th><th>Бонус ранга к 💰</th></tr>
                <tr><td>Слушатель</td><td>85</td><td>х1.5</td></tr>
                <tr><td>Уведомитель</td><td>215</td><td>х2.5</td></tr>
                <tr><td>Душитель</td><td>430</td><td>х4</td></tr>
                <tr><td>Палач</td><td>685</td><td>х6</td></tr>
                <tr><td>Убийца</td><td>1030</td><td>х9</td></tr>
                <tr><td>Истребитель</td><td>1370</td><td>х12</td></tr>
                <tr><td>Вагабонд</td><td>1715</td><td>х15</td></tr>
                <tr><td>Мастер</td><td>2050</td><td>х18</td></tr>
                <tr><td>Ликвидатор</td><td>2400</td><td>х21.5</td></tr>
                <tr><td>Ассасин</td><td>3000</td><td>х27</td></tr>
            </table>
            <hr>
            <p><small><b>Пример (Душитель, 25-27🌒):</b> 5 * 26 * 1🥉 * 4 = 5🥈20🥉 (5*3=15🎭)</small></p>
        `
    },
    hunter_helper: {
        content: `
            <div style="border: 1px solid #66ff66; padding: 10px; background: rgba(102, 255, 102, 0.05); margin-bottom: 10px;">
                <b style="color: #66ff66;">Плюсы ⬆️:</b><br>
                📜🔺Получение 📖 и ⏳ на 15% с элиток и боссов ⏫<br>
                📜🔺Изменение 💍 на 10% ⏬
            </div>
            <div style="border: 1px solid #ff4444; padding: 10px; background: rgba(255, 68, 68, 0.05); margin-bottom: 10px;">
                <b style="color: #ff4444;">Минусы ⬇️:</b><br>
                📜🔻 Покупка оружия (правая рука) на 10% ⏫
            </div>
            <p>❗ Элитный моб считается убитым если в чате игры именно герой добил ☠️</p>
            <p>📢 <b>Условия вступления:</b> убить 5 ☠️ (за всех заплатят 💰 и 🎭)</p>
            <p>☠️ 0.5🥉, 3🎭 | 👹 и 👹 портала 2.5🥉, 30🎭 — <b>Х твой 🌒</b></p>
        `
    },
    mages_college_menu: [
        { id: 'vampire_mage', title: 'Вампир' },
        { id: 'wizard_mage', title: 'Чародей' },
        { id: 'apprentice_mage', title: 'Ученик чародея' }
    ],
    vampire_mage: {
        content: `
            <button class="craft-btn smith-sell" onclick="sellRunes('вампир')" style="position: absolute; top: 55px; right: 20px; z-index: 100; font-size: 0.8rem; padding: 4px 8px;">Продать 📖</button>
            <div style="border: 1px solid #66ff66; padding: 10px; background: rgba(102, 255, 102, 0.05); margin-bottom: 10px;">
                <b style="color: #66ff66;">Плюсы ⬆️:</b><br>
                📜🔺 Бесплатные 💊<br>
                📜🔺 Шанс умереть 10%<br>
                📜🔺 Бесплатный парагон в восстановление<br>
                📜🔺 Уроки стоят на 30% больше за каждые 100🔮
            </div>
            <div style="border: 1px solid #ff4444; padding: 10px; background: rgba(255, 68, 68, 0.05); margin-bottom: 10px;">
                <b style="color: #ff4444;">Минусы ⬇️:</b><br>
                📜🔻 Все продажи на 50% ⏬<br>
                📜🔻 При смерти вы покидаете гильдию
            </div>
            <p>📢 <b>Условия вступления:</b> Умереть (учитывается только в боевой экипировке).</p>
            <hr>
            <p style="color: #d4af37; text-align: center; font-weight: bold;">⛓️ РАНГ</p>
            <table style="width: 100%; font-size: 0.8rem; border-collapse: collapse; text-align: left;">
                <tr style="color: #d4af37; border-bottom: 1px solid #5a0000;">
                    <th>Ранг</th><th>Условие</th><th>Бонус 📖⏳ / 💲 / Прод.</th>
                </tr>
                <tr><td>🌊 Союзник</td><td>1к🔮 / 50⏳</td><td>+10% / 15🥉 / 50%⏬</td></tr>
                <tr><td>🔥 Начинающий</td><td>2к🔮 / 100⏳</td><td>+13% / 31🥉 / 48%</td></tr>
                <tr><td>🌊 Странник</td><td>3к🔮 / 200⏳</td><td>+16% / 50🥉 / 46%</td></tr>
                <tr><td>🔥 Вызывающий</td><td>4к🔮 / 300⏳</td><td>+20% / 75🥉 / 44%</td></tr>
                <tr><td>🌊 Мистик</td><td>5к🔮 / 450⏳</td><td>+25% / 1.13🥈 / 42%</td></tr>
                <tr><td>🔥 Магиус</td><td>6к🔮 / 600⏳</td><td>+40% / 1.51🥈 / 40%</td></tr>
                <tr><td>🌊 Чернокнижник</td><td>7к🔮 / 700⏳</td><td>+50% / 1.89🥈 / 38%</td></tr>
                <tr><td>🔥 Волшебник</td><td>8к🔮 / 800⏳</td><td>+60% / 2.26🥈 / 36%</td></tr>
                <tr><td>🌊 Мастер В.</td><td>9к🔮 / 900⏳</td><td>+75% / 2.68🥈 / 34%</td></tr>
                <tr style="background: rgba(212,175,55,0.1);">
                    <td>🔥 Архимагиус</td><td>10к🔮 / 1000⏳</td><td>+100% / 3.78🥈 / 30%</td>
                </tr>
            </table>
            <hr>
            <p><strong>Пример1️⃣ (Продажа рун Чародеем):</strong><br>
            Интеллект 2754 - 340 (парагон) = 2414 / 100🔮 = 24.<br>
            108 * 30 * 24 / 100 = 7🥈78🥉 * 3 = <b>23🥈33🥉</b></p>
            <p><strong>Пример2️⃣ (Высасывание опыта):</strong><br>
            Герой (2150 инт) высасывает у соперника (3.45 📖):<br>
            3.45 * (0.003 * 21) = <b>0.22📖</b></p>
        `
    },
    wizard_mage: {
        content: `
            <button class="craft-btn smith-sell" onclick="sellRunes('чародей')" style="position: absolute; top: 55px; right: 20px; z-index: 100; font-size: 0.8rem; padding: 4px 8px;">Продать 📖</button>
            <div style="border: 1px solid #66ff66; padding: 10px; background: rgba(102, 255, 102, 0.05); margin-bottom: 10px;">
                <b style="color: #66ff66;">Плюсы ⬆️:</b><br>
                📜🔺 💊 на 55-100% ⏬<br>
                📜🔺 Уроки: +27.5% к цене за каждые 100 🔮<br>
                📜🔺 Продажа 1 📖 за 20🥉 (Ранг 1)
            </div>
            <div style="border: 1px solid #ff4444; padding: 10px; background: rgba(255, 68, 68, 0.05); margin-bottom: 10px;">
                <b style="color: #ff4444;">Минусы ⬇️:</b><br>
                📜🔻 Продажи 💍: Штраф растет с рангом
            </div>
            <p>📢 <b>Условие:</b> Обучить (продать) ≥ 25 📖 до выхода.</p>
            <hr>
            <table style="width: 100%; font-size: 0.8rem; border-collapse: collapse;">
                <tr style="color: #d4af37; border-bottom: 1px solid #5a0000;">
                    <th>Ранг</th><th>Условие</th><th>📖⏳</th><th>💲 / 💊</th><th>Штраф 💍</th>
                </tr>
                <tr><td>🌊 Союзник</td><td>1к🔮 / 50⏳</td><td>+15%</td><td>20🥉 / 55%</td><td>-10%</td></tr>
                <tr><td>🔥 Нач-щий</td><td>2к🔮 / 100⏳</td><td>+20%</td><td>37🥉 / 60%</td><td>-12%</td></tr>
                <tr><td>🌊 Странник</td><td>3к🔮 / 200⏳</td><td>+28%</td><td>60🥉 / 65%</td><td>-14%</td></tr>
                <tr><td>🔥 Вызывающий</td><td>4к🔮 / 300⏳</td><td>+35%</td><td>90🥉 / 70%</td><td>-16%</td></tr>
                <tr><td>🌊 Мистик</td><td>5к🔮 / 450⏳</td><td>+50%</td><td>1.35🥈 / 75%</td><td>-18%</td></tr>
                <tr><td>🔥 Магиус</td><td>6к🔮 / 600⏳</td><td>+75%</td><td>1.80🥈 / 80%</td><td>-20%</td></tr>
                <tr><td>🌊 Чернокниж.</td><td>7к🔮 / 700⏳</td><td>+100%</td><td>2.25🥈 / 85%</td><td>-22%</td></tr>
                <tr><td>🔥 Волшебник</td><td>8к🔮 / 800⏳</td><td>+125%</td><td>2.70🥈 / 90%</td><td>-25%</td></tr>
                <tr><td>🌊 Мастер В.</td><td>9к🔮 / 900⏳</td><td>+150%</td><td>3.20🥈 / 95%</td><td>-28%</td></tr>
                <tr style="background: rgba(162, 155, 254, 0.1);"><td>🔥 Архимагиус</td><td>10к🔮 / 1000⏳</td><td>+200%</td><td>4.50🥈 / Беспл</td><td>-30%</td></tr>
            </table>
        `
    },
    apprentice_mage: {
        content: `
            <button class="craft-btn smith-sell" onclick="sellRunes('ученик')" style="position: absolute; top: 55px; right: 20px; z-index: 100; font-size: 0.8rem; padding: 4px 8px;">Продать 📖</button>
            <div style="border: 1px solid #66ff66; padding: 10px; background: rgba(102, 255, 102, 0.05); margin-bottom: 10px;">
                <b style="color: #66ff66;">Плюсы ⬆️:</b><br>
                📜🔺 💊 на 30% ⏬ | 📖 и ⏳ на 10% ⏫<br>
                📜🔺 Уроки: +15% к цене за каждые 100 🔮<br>
                📜🔺 Продажа 1 📖 за 15🥉
            </div>
            <div style="border: 1px solid #ff4444; padding: 10px; background: rgba(255, 68, 68, 0.05); margin-bottom: 10px;">
                <b style="color: #ff4444;">Минусы ⬇️:</b><br>
                📜🔻 Продажи 💍 на 9% ⏬
            </div>
            <p>📢 <b>Условия:</b> Минимум на 5 🌒 (после 70 🌒 — на 2 🌒).</p>
        `
    },
    dark_brotherhood: [
        { id: 'db_info', title: 'Шанс кражи и Закены' },
        { id: 'db_gambler', title: 'Гэмблер' },
        { id: 'db_thief', title: 'Вор' },
        { id: 'db_pickpocket', title: 'Воришка' }
    ],
    db_info: {
        content: `
            <p style="color: #ff4444; border: 1px solid #5a0000; padding: 5px; text-align: center;">
                ❗ Красть можно только текущие вещи из магазина.
                ❗ Купленные 🔖 можно продать за 80% от цены.
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <p style="color: #d4af37; margin: 0;">🕵️ ШАНС КРАЖИ:</p>
                <div style="display:flex; align-items:center; gap:5px;">
                    <span style="font-size:0.8rem; color:#aaa;">Ур:</span>
                    <input type="number" id="theft-item-level" style="width:40px; background:#000; color:#fff; border:1px solid #444; padding:2px; text-align:center;" oninput="window.updateTheftTable()">
                    <button class="craft-btn sell" onclick="window.toggleTheftMode()">🧤 УКРАСТЬ</button>
                </div>
            </div>
            <table style="width: 100%; font-size: 0.75rem; text-align: center; border-collapse: collapse;">
                <tr style="color: #d4af37; border-bottom: 1px solid #5a0000;">
                    <th>🌒 Герой</th><th>📓 (N)</th><th>📘 (D)</th><th>📒 (C)</th>
                </tr>
                <tr id="tr-theft-1" class="theft-row"><td>01-19</td><td id="td-theft-n-1" class="theft-cell" onclick="window.attemptTheft('N', 50, 1)">50%</td><td id="td-theft-d-1" class="theft-cell" onclick="window.attemptTheft('D', 35, 1)">35%</td><td id="td-theft-c-1" class="theft-cell" onclick="window.attemptTheft('C', 25, 1)">25%</td></tr>
                <tr id="tr-theft-2" class="theft-row"><td>20-39</td><td id="td-theft-n-2" class="theft-cell" onclick="window.attemptTheft('N', 50, 2)">50%</td><td id="td-theft-d-2" class="theft-cell" onclick="window.attemptTheft('D', 50, 2)">50%</td><td id="td-theft-c-2" class="theft-cell" onclick="window.attemptTheft('C', 35, 2)">35%</td></tr>
                <tr id="tr-theft-3" class="theft-row"><td>40-70</td><td id="td-theft-n-3" class="theft-cell" onclick="window.attemptTheft('N', 50, 3)">50%</td><td id="td-theft-d-3" class="theft-cell" onclick="window.attemptTheft('D', 50, 3)">50%</td><td id="td-theft-c-3" class="theft-cell" onclick="window.attemptTheft('C', 50, 3)">50%</td></tr>
            </table>
            <p style="font-size: 0.8rem; margin: 10px 0; color: #888;">* Нажмите "УКРАСТЬ", затем выберите ячейку.</p>
            <hr>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <p style="color: #d4af37; margin: 0;">🔖 ЗАКЕНЫ (Только Братство):</p>
                <button class="calc-nav-btn" onclick="buyZakens('buy')">💰 КУПИТЬ</button>
            </div>
            <div style="column-count: 2; font-size: 0.85rem;">
                20🗡️-1.20🥈 | 25🗡️-2🥈<br>30🗡️-3🥈 | 35🗡️-5🥈<br>40🗡️-9🥈 | 45🗡️-13🥈<br>
                50🗡️-23🥈 | 55🗡️-35🥈<br>60🗡️-70🥈 | 65🗡️-82🥈<br>70🗡️-97🥈
            </div>
        `
    },
    db_gambler: {
        content: `
            <div style="border: 2px solid #66ff66; padding: 10px; background: rgba(102, 255, 102, 0.05); margin-bottom: 10px;">
                <b style="color: #66ff66;">Плюсы ⬆️:</b><br>
                📜🔺 Продажа 💍 х1.25💰 (после 2 покупок на ч.рынке, след. 10💍 по х5💰)
            </div>
            <div style="border: 2px solid #ff4444; padding: 10px; background: rgba(255, 68, 68, 0.05); margin-bottom: 10px;">
                <b style="color: #ff4444;">Минусы ⬇️:</b><br>
                📜🔻 Опыт на 25%⏬ | 💊 на 50%⏫<br>
                📜🔻 Продажа ресурсов и камней на 25%⏬
            </div>
            <p>❗ Только темное братство может покупать закены.</p>
            <p>📢 <b>Условие:</b> При выходе < 30 купленных 🔖 — штраф 10 🔖.</p>
            <table style="width: 100%; font-size: 0.8rem; border-collapse: collapse; text-align: left;">
                <tr style="color: #d4af37; border-bottom: 1px solid #5a0000;"><th>Ранг</th><th>🥢/сд.</th><th>🔖</th></tr>
                <tr><td>🎲 Лягуха</td><td>1к / 7</td><td>98%</td></tr>
                <tr><td>🎲 Мокроух</td><td>2к / 20</td><td>95%</td></tr>
                <tr><td>🎲 Топотун</td><td>3к / 45</td><td>92%</td></tr>
                <tr><td>🎲 Черношапка</td><td>4к / 70</td><td>89%</td></tr>
                <tr><td>🎲 Бригадир</td><td>5к / 100</td><td>86%</td></tr>
                <tr><td>🎲 Бандит</td><td>6к / 135</td><td>82%</td></tr>
                <tr><td>🎲 Занятой</td><td>7к / 170</td><td>80%</td></tr>
                <tr><td>🎲 Заправила</td><td>8к / 210</td><td>77%</td></tr>
                <tr><td>🎲 Матерый</td><td>9к / 255</td><td>75%</td></tr>
                <tr style="background: rgba(212,175,55,0.1);"><td>🎲 Мастер</td><td>10к / 313</td><td>70%</td></tr>
            </table>
        `
    },
    db_thief: {
        content: `
            <div style="border: 2px solid #66ff66; padding: 10px; background: rgba(102, 255, 102, 0.05); margin-bottom: 10px;">
                <b style="color: #66ff66;">Плюсы ⬆️:</b><br>
                📜🔺 Изменение 💍 на 25%⏬ | Продажа 💍 х1.5💰<br>
                📜🔺 Шанс кражи любой 💍 у торговцев (+0.4% за 100 🥢)
            </div>
            <div style="border: 2px solid #ff4444; padding: 10px; background: rgba(255, 68, 68, 0.05); margin-bottom: 10px;">
                <b style="color: #ff4444;">Минусы ⬇️:</b><br>
                📜🔻 Опыт -17.5% | 💊 +20%<br>
                📜🔻 Штраф за поимку — 100% стоимости 💍
            </div>
            <p> <b>Условие:</b> украсть 3 📘grade 💍 (выбросить).</p>
            <table style="width: 100%; font-size: 0.8rem; border-collapse: collapse; text-align: left;">
                <tr style="color: #d4af37; border-bottom: 1px solid #5a0000;"><th>Ранг</th><th>Успех</th><th>Штраф</th></tr>
                <tr><td>🎲 Лягуха</td><td>7</td><td>98%</td></tr>
                <tr><td>🎲 Мокроух</td><td>20</td><td>95%</td></tr>
                <tr><td>🎲 Топотун</td><td>45</td><td>92%</td></tr>
                <tr><td>🎲 Черношапка</td><td>70</td><td>89%</td></tr>
                <tr><td>🎲 Бригадир</td><td>100</td><td>86%</td></tr>
                <tr><td>🎲 Бандит</td><td>135</td><td>82%</td></tr>
                <tr><td>🎲 Занятой</td><td>170</td><td>80%</td></tr>
                <tr><td>🎲 Заправила</td><td>210</td><td>77%</td></tr>
                <tr><td>🎲 Матерый</td><td>255</td><td>75%</td></tr>
                <tr style="background: rgba(212,175,55,0.1);"><td>🎲 Мастер</td><td>300</td><td>70%</td></tr>
            </table>
        `
    },
    db_pickpocket: {
        content: `
            <div style="border: 2px solid #66ff66; padding: 10px; background: rgba(102, 255, 102, 0.05); margin-bottom: 10px;">
                <b style="color: #66ff66;">Плюсы ⬆️:</b><br>
                📜🔺 Изменение 💍 -15% | Продажа 💍 х1.2💰<br>
                📜🔺 Шанс кражи любой 💍 у торговцев (+0.4% за 100 🥢)<br>
                📜🔺 Продажа ворованных 💍 и с ч.рынка за 50%
            </div>
            <div style="border: 2px solid #ff4444; padding: 10px; background: rgba(255, 68, 68, 0.05); margin-bottom: 10px;">
                <b style="color: #ff4444;">Минусы ⬇️:</b><br>
                📜🔻 Опыт -10% | 💊 +10% | Штраф 100%
            </div>
            <p>📢 <b>Условие:</b> украсть 1 📘grade 💍 (выбросить).</p>
        `
    },
    adventurers_menu: [
        { id: 'adv_explorer', title: 'Искатель приключений' },
        { id: 'adv_wealth', title: 'Искатель богатства' },
        { id: 'adv_jimmy', title: 'Джимми' }
    ],
    adv_explorer: {
        content: `
            <div style="border: 2px solid #66ff66; padding: 10px; background: rgba(102, 255, 102, 0.05); margin-bottom: 10px;">
                <b style="color: #66ff66;">Плюсы ⬆️:</b><br>
                🔺Сундук: 0.5 📖/⏳ | Большой: 1.5 📖/⏳<br>
                🔺Сундук-задание | 🔺Каждый 11-й найденный 📒 ваш (без расходов)
            </div>
            <div style="border: 2px solid #ff4444; padding: 10px; background: rgba(255, 68, 68, 0.05); margin-bottom: 10px;">
                <b style="color: #ff4444;">Минусы ⬇️:</b><br>
                🔻Отдает каждый 10 📒<br>
                🔻На каждые 100💀: 10% шанс поломки предмета
            </div>
            <p>📢 <b>Условие:</b> Найти большой сундук.</p>
            <table style="width: 100%; font-size: 0.7rem; border-collapse: collapse; text-align: center;">
                <tr style="color: #d4af37; border-bottom: 1px solid #5a0000;">
                    <th>Ранг</th><th>Найдено</th><th>Отдаёт</th><th>Берёт</th><th>📖 (Обыч)</th><th>📖 (Бол)</th>
                </tr>
                <tr><td>Мечтающий</td><td>5</td><td>10-й</td><td>11-й</td><td>0.5</td><td>1.5</td></tr>
                <tr><td>Сломленный</td><td>10</td><td>9-й</td><td>10-й</td><td>0.55</td><td>1.7</td></tr>
                <tr><td>Осторожный</td><td>16</td><td>8-й</td><td>9-й</td><td>0.6</td><td>1.8</td></tr>
                <tr><td>Расчетливый</td><td>23</td><td>7-й</td><td>8-й</td><td>0.65</td><td>1.9</td></tr>
                <tr><td>Опытный</td><td>31</td><td>6-й</td><td>7-й</td><td>0.7</td><td>2.0</td></tr>
                <tr><td>Искатель</td><td>40</td><td>5-й</td><td>6-й</td><td>0.75</td><td>2.2</td></tr>
                <tr><td>Мастер</td><td>50</td><td>4-й</td><td>5-й</td><td>0.8</td><td>2.4</td></tr>
                <tr><td>Скрывающий</td><td>61</td><td>3-й</td><td>4-й</td><td>0.85</td><td>2.6</td></tr>
                <tr><td>Видящий</td><td>73</td><td>2-й</td><td>3-й</td><td>0.9</td><td>2.8</td></tr>
                <tr style="background: rgba(212,175,55,0.1);"><td>Лидер</td><td>90</td><td>-</td><td>2-й</td><td>1.0</td><td>3.0</td></tr>
            </table>
        `
    },
    adv_wealth: {
        content: `
            <div style="border: 2px solid #66ff66; padding: 10px; background: rgba(102, 255, 102, 0.05); margin-bottom: 10px;">
                <b style="color: #66ff66;">Плюсы ⬆️:</b><br>
                🔺Сундук: 0.7 📖/⏳ | Большой: 2 📖/⏳<br>
                🔺Каждый 11-й 📙,📕,📗 ваш (без расходов)
                🔺Сундук-задание
            </div>
            <div style="border: 2px solid #ff4444; padding: 10px; background: rgba(255, 68, 68, 0.05); margin-bottom: 10px;">
                <b style="color: #ff4444;">Минусы ⬇️:</b><br>
                🔻Отдает каждый 10 📒,📙,📕,📗<br>
                🔻На каждые 100💀: 15% шанс поломки
            </div>
            <p>📢 <b>Условие:</b> Найти большой сундук.</p>
            <table style="width: 100%; font-size: 0.7rem; border-collapse: collapse; text-align: center;">
                <tr style="color: #d4af37; border-bottom: 1px solid #5a0000;">
                    <th>Ранг</th><th>Найдено</th><th>Отдаёт</th><th>Берёт</th><th>📖 (Об)</th><th>📖 (Бол)</th>
                </tr>
                <tr><td>Мечтающий</td><td>8</td><td>10-й</td><td>11-й</td><td>0.7</td><td>2.0</td></tr>
                <tr><td>Сломленный</td><td>15</td><td>9-й</td><td>10-й</td><td>0.75</td><td>2.1</td></tr>
                <tr><td>Осторожный</td><td>24</td><td>8-й</td><td>9-й</td><td>0.75</td><td>2.2</td></tr>
                <tr><td>Расчетливый</td><td>35</td><td>7-й</td><td>8-й</td><td>0.75</td><td>2.35</td></tr>
                <tr><td>Опытный</td><td>47</td><td>6-й</td><td>7-й</td><td>0.8</td><td>2.5</td></tr>
                <tr><td>Искатель</td><td>60</td><td>5-й</td><td>6-й</td><td>0.9</td><td>2.8</td></tr>
                <tr><td>Мастер</td><td>75</td><td>4-й</td><td>5-й</td><td>1.0</td><td>3.1</td></tr>
                <tr><td>Скрывающий</td><td>92</td><td>3-й</td><td>4-й</td><td>1.1</td><td>3.4</td></tr>
                <tr><td>Видящий</td><td>110</td><td>2-й</td><td>3-й</td><td>1.2</td><td>3.7</td></tr>
                <tr style="background: rgba(212,175,55,0.1);"><td>Лидер</td><td>135</td><td>-</td><td>2-й</td><td>1.4</td><td>4.0</td></tr>
            </table>
        `
    },
    adv_jimmy: {
        content: `
            <div style="border: 2px solid #66ff66; padding: 10px; background: rgba(102, 255, 102, 0.05); margin-bottom: 10px;">
                <b style="color: #66ff66;">Плюсы ⬆️:</b><br>
                🔺Сундук: 0.3 📖/⏳ | Большой: 1 📖/⏳<br>
                🔺Каждый 12-й 📒,📙,📕,📗 ваш
            </div>
            <div style="border: 2px solid #ff4444; padding: 10px; background: rgba(255, 68, 68, 0.05); margin-bottom: 10px;">
                <b style="color: #ff4444;">Минусы ⬇️:</b><br>
                🔻Отдает каждый 11 📒,📙,📕,📗<br>
                🔻На каждые 100💀: 5% шанс поломки
            </div>
            <p>📢 <b>Условие:</b> Найти большой сундук.</p>
        `
    },
    companions_menu: [
        { id: 'comp_novice', title: 'Салага' },
        { id: 'comp_brute', title: 'Громила' },
        { id: 'comp_warlord', title: 'Лорд Войны' }
    ],
    comp_novice: {
        content: `
            <div style="border: 2px solid #66ff66; padding: 10px; background: rgba(102, 255, 102, 0.05); margin-bottom: 10px;">
                <b style="color: #66ff66;">Плюсы ⬆️:</b><br>
                📜🔺 За каждого 💀: 0.88🧧<br>
                📜🔺 Создание крафта за 130% | Продажа за 90%
            </div>
            <div style="border: 2px solid #ff4444; padding: 10px; background: rgba(255, 68, 68, 0.05); margin-bottom: 10px;">
                <b style="color: #ff4444;">Минусы ⬇️:</b><br>
                📜🔻📖 и ⏳ на 10% ⏬
            </div>
            <p>📢 <b>Условие:</b> убить 150 💀</p>
            <p style="text-align: center; color: #d4af37;">💲: 0.88🧧 * 🌒 * кол-во 💀</p>
        `
    },
    comp_brute: {
        content: `
            <div style="border: 2px solid #66ff66; padding: 10px; background: rgba(102, 255, 102, 0.05); margin-bottom: 10px;">
                <b style="color: #66ff66;">Плюсы ⬆️:</b><br>
                📜🔺 За каждого 💀: 1.75🧧<br>
                📜🔺 Создание крафта за 115% | Продажа за 90%<br>
                📜🔺Контракты: х3 💰 если убил больше 💀 чем напарник
            </div>
            <div style="border: 1px solid #ff4444; padding: 10px; background: rgba(255, 68, 68, 0.05); margin-bottom: 10px;">
                <b style="color: #ff4444;">Минусы ⬇️:</b><br>
                📜🔻Изменение 💍 на 15% ⏫ | 📖 и ⏳ на 20% ⏬
            </div>
            <p>📢 <b>Условие:</b> 1000 🏮 или 1700 💀</p>
            <p style="text-align: center; color: #d4af37;">💲: 1.75🧧 * 🌒 * кол-во 💀 * ⛓️</p>
            <table style="width: 100%; font-size: 0.75rem; border-collapse: collapse;">
                <tr style="color: #d4af37; border-bottom: 1px solid #5a0000;"><th>Ранг</th><th>🏮 или 💀</th><th>Бонус ранга к 💰</th></tr>
                <tr><td>🎑 Союзник</td><td>1к / 1.7к</td><td>х1.5</td></tr>
                <tr><td>🎑 Начинающий</td><td>2к / 4.3к</td><td>х2.5</td></tr>
                <tr><td>🎑 Странник</td><td>3к / 8.6к</td><td>х4</td></tr>
                <tr><td>🎑 Меченосец</td><td>4к / 13.7к</td><td>х6</td></tr>
                <tr><td>🎑 Протектор</td><td>5к / 20.6к</td><td>х9</td></tr>
                <tr><td>🎑 Защитник</td><td>6к / 27.4к</td><td>х12</td></tr>
                <tr><td>🎑 Охранитель</td><td>7к / 34.3к</td><td>х15</td></tr>
                <tr><td>🎑 Страж</td><td>8к / 41к</td><td>х18</td></tr>
                <tr><td>🎑 Победитель</td><td>9к / 48к</td><td>х21.5</td></tr>
                <tr style="background: rgba(212,175,55,0.1);"><td>🎑 Мастер</td><td>10к / 60к</td><td>х27</td></tr>
            </table>
        `
    },
    comp_warlord: {
        content: `
            <div style="border: 2px solid #66ff66; padding: 10px; background: rgba(102, 255, 102, 0.05); margin-bottom: 10px;">
                <b style="color: #66ff66;">Плюсы ⬆️:</b><br>
                📜🔺 За каждого 💀 получаешь 1.23🧧<br>
                📜🔺 На 7% ⏫ 📖<br>
                📜🔺 Создание крафта за 105% | Продажа за 90%<br>
                📜🔺 Контракты: х3 💰 если убил больше 💀 чем напарник
            </div>
            <p>📢 <b>Условие:</b> 1000 🏮 или 1700 💀</p>
            <p style="text-align: center; color: #d4af37;">💲: 1.23🧧 * 🌒 * кол-во 💀 * ⛓️</p>
            <table style="width: 100%; font-size: 0.75rem; border-collapse: collapse;">
                <tr style="color: #d4af37; border-bottom: 1px solid #5a0000;"><th>Ранг</th><th>🏮 или 💀</th><th>Бонус ранга к 💰</th></tr>
                <tr><td>🎑 Союзник</td><td>1к / 1.7к</td><td>х1.5</td></tr>
                <tr><td>🎑 Начинающий</td><td>2к / 4.3к</td><td>х2.5</td></tr>
                <tr><td>🎑 Странник</td><td>3к / 8.6к</td><td>х4</td></tr>
                <tr><td>🎑 Меченосец</td><td>4к / 13.7к</td><td>х6</td></tr>
                <tr><td>🎑 Протектор</td><td>5к / 20.6к</td><td>х9</td></tr>
                <tr><td>🎑 Защитник</td><td>6к / 27.4к</td><td>х12</td></tr>
                <tr><td>🎑 Охранитель</td><td>7к / 34.3к</td><td>х15</td></tr>
                <tr><td>🎑 Страж</td><td>8к / 41к</td><td>х18</td></tr>
                <tr><td>🎑 Победитель</td><td>9к / 48к</td><td>х21.5</td></tr>
                <tr style="background: rgba(212,175,55,0.1);"><td>🎑 Мастер</td><td>10к / 60к</td><td>х27</td></tr>
            </table>
        `
    }
};
