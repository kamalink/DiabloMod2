window.economyData = {
    econ: [
        { 
            id: 'enchant', 
            title: 'Зачарование', 
            content: `
                <div class="craft-row"><p>Продажа 🧪 — 5🥈</p><button class="craft-btn sell" onclick="sellDeathBreath()">Продать</button></div>
                <div class="craft-row"><p>Покупка реагента — 10🥈</p><button class="craft-btn buy" onclick="buyReagent()">Купить</button></div>
                <hr>
                <p style="color: #d4af37;"><strong>Создание зелий:</strong></p>
                <div class="craft-row">🔹 Зелье здоровья — 1🧪 + 1 реагент<button class="craft-btn craft" onclick="craftHealthPotion()">Скрафтить</button></div>
                <hr>
                <p style="color: #d4af37;"><strong>Изменение свойств:</strong></p>
                📒 — 💰 20% * 1.25<br>
                📙 — 💰 20% * 1.25<br>
                A, S, S+ — 💰 10% * 1.25<br>
                Spectrum — 💰 10% * 1.25
                <div class="craft-row" style="justify-content: center; margin-top: 10px;"><button class="craft-btn craft" onclick="window.openEnchantModal()">🔮 ИЗМЕНИТЬ СВОЙСТВО</button></div>
            ` 
        },
        { 
            id: 'potions', 
            title: 'Штрафы и Зелья', 
            content: `
                <div class="craft-row"><p style="color: #ff4444; font-weight: bold;">🚨 Неизученное умение:</p><button class="craft-btn sell" onclick="applySkillPenalty()">Использовал</button></div>
                <p style="font-size:0.8rem; text-align:center;">1-20🌒: 10🥉 | 20-40🌒: 25🥉 | 40-60🌒: 50🥉 | 60+🌒: 1🥈</p>
                <hr>
                <div class="craft-row"><p style="color: #ff4444; font-weight: bold;">🚨 Спас-способности:</p><button class="craft-btn sell" onclick="applyEscapePenalty()">Использовал</button></div>
                <p style="font-size:0.8rem; text-align:center;">1-20🌒: 1🥈 | 20-40🌒: 3🥈 | 40-60🌒: 6🥈 | 61-69🌒: 10🥈<br>70-75🌒: 30🥈 | 76-85🌒: 1🥇 | 86-99🌒: 5🥇</p>
                <hr>
                <div class="craft-row"><p style="color: #d4af37; font-weight: bold;">💰 Экстренная покупка 💊:</p><button class="craft-btn sell" onclick="buyPotion()">Купить</button></div>
                <p>📓 grade — 10🥉<br>📘 grade — 40🥉<br>📒 grade — 2🥈<br>📙 grade — 4🥈<br>📕 grade — 8🥈<br>📗 grade — 20🥈</p>
                <p style="font-size: 0.9rem; border-top: 1px solid #333; padding-top: 5px;">После 70 🌒: 20🥈 * 1.05<sup>макс. ВП</sup></p>
            `
        },
        { id: 'smith_jewel', title: 'Ювелирка и Кузница' },
        { 
            id: 'buy', 
            title: 'Покупка/Продажа предметов', 
            content: `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; background: rgba(0,0,0,0.3); padding: 10px; border: 1px solid #444;">
                    <div style="display:flex; flex-direction:column; gap:5px;">
                        <label>Уровень: 
                            <input type="number" id="buy-item-level-input" value="1" min="1" style="width: 60px; padding: 5px; background: #000; border: 1px solid #444; color: #fff; text-align: center;">
                        </label>
                        <label>Грейд: 
                            <select id="buy-item-grade-input" style="background: #000; color: #fff; border: 1px solid #444; width: 60px; cursor: pointer;">
                                <option value="N">N</option>
                                <option value="D">D</option>
                                <option value="C">C</option>
                                <option value="B">B</option>
                            </select>
                        </label>
                    </div>
                    <div style="display:flex; gap:5px;">
                        <button class="craft-btn sell" onclick="window.openSellInventory('vendor')">ПРОДАТЬ</button>
                        <button class="craft-btn buy" onclick="buyItemImmediate()">КУПИТЬ</button>
                    </div>
                </div>
                <div id="hand-selector-main" style="display:none; justify-content:center; gap:15px; margin-bottom:10px;">
                    <label style="color:#ff4444; cursor:pointer;"><input type="radio" name="hand-sel-main" value="right" checked> Правая рука</label>
                    <label style="color:#66ccff; cursor:pointer;"><input type="radio" name="hand-sel-main" value="left"> Левая рука</label>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                    <div style="flex: 1 1 45%; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; padding: 8px; border-radius: 4px;">
                        <div style="color: #d4af37; font-weight: bold; border-bottom: 1px solid #5a0000; margin-bottom: 5px; text-align: center;">40%</div>
                        <div style="font-size: 0.85rem; text-align: center;"><span class="buy-prop-item" onclick="toggleBuyProperty(this, 40)">Основа оружия</span></div>
                    </div>
                    <div style="flex: 1 1 45%; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; padding: 8px; border-radius: 4px;">
                        <div style="color: #d4af37; font-weight: bold; border-bottom: 1px solid #5a0000; margin-bottom: 5px; text-align: center;">30%</div>
                        <div style="font-size: 0.85rem; text-align: center;"><span class="buy-prop-item" onclick="toggleBuyProperty(this, 30)">Основа брони</span><br><span class="buy-prop-item" onclick="toggleBuyProperty(this, 30)">Основа бижы</span><br><span class="buy-prop-item" onclick="toggleBuyProperty(this, 30)">Живучесть</span><br><span class="buy-prop-item" onclick="toggleBuyProperty(this, 30)">Осн.Хар.</span><br><span class="buy-prop-item" onclick="toggleBuyProperty(this, 30)">Гнездо (голова/оруж)</span></div>
                    </div>
                    <div style="flex: 1 1 45%; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; padding: 8px; border-radius: 4px;">
                        <div style="color: #d4af37; font-weight: bold; border-bottom: 1px solid #5a0000; margin-bottom: 5px; text-align: center;">20%</div>
                        <div style="font-size: 0.85rem; text-align: center;"><span class="buy-prop-item" onclick="toggleBuyProperty(this, 20)">Восстановление</span></div>
                    </div>
                    <div style="flex: 1 1 45%; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; padding: 8px; border-radius: 4px;">
                        <div style="color: #d4af37; font-weight: bold; border-bottom: 1px solid #5a0000; margin-bottom: 5px; text-align: center;">15%</div>
                        <div style="font-size: 0.85rem; text-align: center;"><span class="buy-prop-item" onclick="toggleBuyProperty(this, 15)">Все сопротивления</span><br><span class="buy-prop-item" onclick="toggleBuyProperty(this, 15)">Крит урон</span><br><span class="buy-prop-item" onclick="toggleBuyProperty(this, 15)">Крит шанс</span></div>
                    </div>
                    <div style="flex: 1 1 100%; background: rgba(212, 175, 55, 0.05); border: 1px solid #888; padding: 8px; border-radius: 4px;">
                        <div style="color: #d4af37; font-weight: bold; border-bottom: 1px solid #5a0000; margin-bottom: 5px; text-align: center;">10%</div>
                        <div style="font-size: 0.85rem; display: grid; grid-template-columns: 1fr 1fr; gap: 5px; text-align: center;">
                            <span class="buy-prop-item" onclick="toggleBuyProperty(this, 10)">Не Осн.Хар.</span><span class="buy-prop-item" onclick="toggleBuyProperty(this, 10)">Броня</span>
                            <span class="buy-prop-item" onclick="toggleBuyProperty(this, 10)">Здоровье</span><span class="buy-prop-item" onclick="toggleBuyProperty(this, 10)">Ур. в бижутерии</span>
                            <span class="buy-prop-item" onclick="toggleBuyProperty(this, 10)">Скор. атак</span><span class="buy-prop-item" onclick="toggleBuyProperty(this, 10)">Гнездо (броня)</span>
                            <span class="buy-prop-item" onclick="toggleBuyProperty(this, 10)">Урон стихии</span><span class="buy-prop-item" onclick="toggleBuyProperty(this, 10)">Урон умения</span>
                            <span class="buy-prop-item" onclick="toggleBuyProperty(this, 10)">+ Ур. к скилу</span><span class="buy-prop-item" onclick="toggleBuyProperty(this, 10)">Сниж. затрат / КДР</span>
                            <span class="buy-prop-item" onclick="toggleBuyProperty(this, 10)" style="grid-column: span 2;">Урон по области</span>
                        </div>
                    </div>
                    <div style="flex: 1 1 100%; background: rgba(212, 175, 55, 0.05); border: 1px solid #888; padding: 8px; border-radius: 4px;">
                        <div style="color: #d4af37; font-weight: bold; border-bottom: 1px solid #5a0000; margin-bottom: 5px; text-align: center;">5%</div>
                        <div style="font-size: 0.85rem; text-align: center;"><span class="buy-prop-item" onclick="toggleBuyProperty(this, 5)">Одно сопрот.</span> | <span class="buy-prop-item" onclick="toggleBuyProperty(this, 5)">Скор. передвижения</span> | <span class="buy-prop-item" onclick="toggleBuyProperty(this, 5)">Урон уменьшен</span></div>
                    </div>
                </div>
            `
        },
        { id: 'items_menu', title: 'Предметы и цены' }
    ],
    smith_jewel: [
        { 
            id: 'smith_only', 
            title: 'Кузница', 
            content:  `
                <div class="craft-row"><p>🔹 Продажа Крафта — 100%</p><button class="craft-btn smith-sell" onclick="window.openSellInventory('smith')">ПРОДАТЬ КРАФТ</button></div>
                <div class="craft-row"><p>🔹 Крафт предмета — 150%</p><button class="craft-btn craft" onclick="window.openCraftModal()">СКРАФТИТЬ</button></div>
                <div class="craft-row"><p>🔹 Расплавление — 4.4%</p><button class="craft-btn sell" onclick="window.openMeltModal()">РАСПЛАВИТЬ</button></div>
                <div class="craft-row" style="border-top: 1px solid #333; padding-top: 10px; margin-top: 10px;">
                    <p>🔹 Продажа ресурсов:</p>
                    <button class="craft-btn smith-sell" onclick="sellResources()">Продать ресурсы</button>
                </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: center;">
                    <tr style="color: #d4af37; border-bottom: 1px solid #5a0000;">
                        <th>📜 LVL</th><th>Цена</th><th>Множитель</th>
                    </tr>
                    <tr><td>1-5</td><td>📓 25🧧</td><td>📘,📒 х3 | 📙 х4</td></tr>
                    <tr><td>6-10</td><td>📓 30🧧</td><td>—</td></tr>
                    <tr><td>11-15</td><td>📓 40🧧</td><td>—</td></tr>
                    <tr><td>16-20</td><td>📓 55🧧</td><td>—</td></tr>
                    <tr><td>21-25</td><td>📓 1🥉</td><td>—</td></tr>
                    <tr><td>26-30</td><td>📓 2🥉</td><td>—</td></tr>
                    <tr><td>31-35</td><td>📓 2🥉80🧧</td><td>—</td></tr>
                    <tr><td>36-40</td><td>📓 4🥉60🧧</td><td>—</td></tr>
                    <tr><td>41-45</td><td>📓 6🥉50🧧</td><td>—</td></tr>
                    <tr><td>46-50</td><td>📓 11🥉</td><td>—</td></tr>
                    <tr><td>51-55</td><td>📓 18🥉</td><td>—</td></tr>
                    <tr><td>56-60</td><td>📓 27🥉</td><td>—</td></tr>
                    <tr><td>61-65</td><td>📓 45🥉</td><td>—</td></tr>
                    <tr><td>66-69</td><td>📓 70🥉</td><td>—</td></tr>
                    <tr><td>70</td><td>📓 87🥉</td><td>—</td></tr>
                </table>
                <hr>
                <p style="color: #ff4444;">❗ Расплавление легендарных 💍 выше обычного B-gr приносят столько же ресурсов, сколько они стоят на покупку.</p>
                <p style="background: rgba(255,255,255,0.05); padding: 5px;">
                    <strong>Пример:</strong><br>
                    Spectrum обычный — 4.875 * 2.66 = 13 🧩 <span class="grade-b">B-gr</span>
                </p>
            `
        },
        { id: 'jewel_submenu', title: 'Ювелирка' }
    ],
    jewel_submenu: [
        { 
            id: 'jewel_services', 
            title: 'Услуги по 💎', 
            content: `
                <div class="craft-row" style="justify-content: space-around; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 10px;">
                    <button class="craft-btn buy" onclick="openGemServices('main')">Услуги</button>
                    <button class="craft-btn craft" onclick="openGemServices('rent')">Аренда</button>
                </div>
                <p style="color: #d4af37; text-align: center; font-size: 0.9rem;">🔹 Для оружия х1, для остального х0.5.</p>
                <table>
                    <tr style="color: #d4af37;">
                        <th>💎</th><th>Вст/Убр</th><th>Прод(5%)</th><th>Аренда</th>
                    </tr>
                    <tr><td>1.</td><td>80🥉</td><td>13🥉</td><td>30🥉</td></tr>
                    <tr><td>2.</td><td>1🥈60🥉</td><td>25🥉</td><td>55🥉</td></tr>
                    <tr><td>3.</td><td>3🥈30🥉</td><td>50🥉</td><td>1🥈</td></tr>
                    <tr><td>4.</td><td>5🥈</td><td>75🥉</td><td>1🥈70🥉</td></tr>
                    <tr><td>5.</td><td>10🥈</td><td>1🥈50🥉</td><td>3🥈30🥉</td></tr>
                    <tr><td>6.</td><td>11🥈</td><td>1🥈75🥉</td><td>3🥈50🥉</td></tr>
                    <tr><td>7.</td><td>23🥈</td><td>3🥈50🥉</td><td>7🥈50🥉</td></tr>
                    <tr><td>8.</td><td>38🥈</td><td>5🥈75🥉</td><td>13🥈</td></tr>
                    <tr><td>9.</td><td>76🥈</td><td>11🥈50🥉</td><td>25🥈</td></tr>
                    <tr><td>10.</td><td>1🥇15🥈</td><td>17🥈25🥉</td><td>40🥈</td></tr>
                </table>
            `
        },
        { 
            id: 'jewel_legendary', 
            title: 'Легендарные 💎', 
            content: `
                <table>
                    <tr style="color: #d4af37;"><th>Класс</th><th>Действие</th></tr>
                    <tr><td>3 кл. (1.5🥇)</td><td><button class="craft-btn buy" style="font-size:0.7rem; padding:2px 5px;" onclick="manageLegendaryGem(3, 'insert')">Вставить</button> <button class="craft-btn sell" style="font-size:0.7rem; padding:2px 5px;" onclick="manageLegendaryGem(3, 'remove')">Убрать</button></td></tr>
                    <tr><td>2 кл. (4.5🥇)</td><td><button class="craft-btn buy" style="font-size:0.7rem; padding:2px 5px;" onclick="manageLegendaryGem(2, 'insert')">Вставить</button> <button class="craft-btn sell" style="font-size:0.7rem; padding:2px 5px;" onclick="manageLegendaryGem(2, 'remove')">Убрать</button></td></tr>
                    <tr><td>1 кл. (7🥇)</td><td><button class="craft-btn buy" style="font-size:0.7rem; padding:2px 5px;" onclick="manageLegendaryGem(1, 'insert')">Вставить</button> <button class="craft-btn sell" style="font-size:0.7rem; padding:2px 5px;" onclick="manageLegendaryGem(1, 'remove')">Убрать</button></td></tr>
                </table>
                <hr>
                <p style="color: #ff4444;">❗ Продажа лег. камней: <button class="calc-nav-btn" onclick="sellLegendaryGem()" style="padding: 2px 8px; font-size: 0.7rem;">ПРОДАТЬ</button></p>
                <p style="font-size: 0.9rem; text-align: center;">5%💰 * 1.1<sup>Ур. Камня</sup></p>
                <p style="color: #d4af37;"><strong>Класс самоцветов:</strong></p>
                <p><strong>1🔹</strong> Наследие снов, Тхегык, Чип боярски, Сила простоты, Гогок, Желудок дикого зверя, Трансформация, Зеев камень, Головорез, Проклятие плененных.</p>
                <p><strong>2🔹</strong> Действенный токсин, Проклятие сильных, Проклятие пораженных, Усилитель боли, Мораторий.</p>
                <p><strong>3🔹</strong> Сияние льда, Венец молний, Окрыляющий, Самоцвет лёгкости, Дар стяжателя, Слеза ткача.</p>
            `
        }
    ],
    items_menu: [
        { id: 'bulk_sale', title: 'Продажа предметов оптом', content: `
            <div class="craft-row">
                <button class="craft-btn smith-sell" onclick="sellItemsBulk()">ПРОДАТЬ ПРЕДМЕТЫ</button>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: center;">
                <tr style="color: #d4af37; border-bottom: 2px solid #5a0000;">
                    <th>📜 LVL</th><th>📓 (N)</th><th>📘,📒 х3</th><th>📙 х4</th>
                </tr>
                <tr><td>1-5</td><td>25🧧</td><td>х3</td><td>х4</td></tr>
                <tr><td>6-10</td><td>35🧧</td><td>—</td><td>—</td></tr>
                <tr><td>11-15</td><td>50🧧</td><td>—</td><td>—</td></tr>
                <tr><td>16-20</td><td>1🥉</td><td>—</td><td>—</td></tr>
                <tr><td>21-25</td><td>1🥉40🧧</td><td>—</td><td>—</td></tr>
                <tr><td>26-30</td><td>2🥉</td><td>—</td><td>—</td></tr>
                <tr><td>31-35</td><td>3🥉</td><td>—</td><td>—</td></tr>
                <tr><td>36-40</td><td>6🥉</td><td>—</td><td>—</td></tr>
                <tr><td>41-45</td><td>9🥉</td><td>—</td><td>—</td></tr>
                <tr><td>46-50</td><td>14🥉</td><td>—</td><td>—</td></tr>
                <tr><td>51-55</td><td>23🥉</td><td>—</td><td>—</td></tr>
                <tr><td>56-60</td><td>35🥉</td><td>—</td><td>—</td></tr>
                <tr><td>61-65</td><td>60🥉</td><td>—</td><td>—</td></tr>
                <tr><td>66-69</td><td>93🥉</td><td>—</td><td>—</td></tr>
                <tr style="background: rgba(212, 175, 55, 0.1);"><td>70</td><td>1🥈20🥉</td><td>—</td><td>—</td></tr>
            </table>
        ` },
        { id: 'grades_abc_menu', title: 'A grade' },
        { id: 'grade_ssplus', title: 'S, S+, Spectrum grade', content: `
            <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 20px; padding: 10px;">
                <button class="d2-button sub-btn" onclick="openBuyAncientModal()">КУПИТЬ ДРЕВНИЙ / ПЕРВОЗДАННЫЙ</button>
                <button class="d2-button sub-btn" onclick="openBuySetModal()">КУПИТЬ КОМПЛЕКТ (S+ / SPECTRUM)</button>
            </div>
        ` }
    ],
    grades_abc_menu: [
        { 
            id: 'g_cl1', 
            title: '1 класс — 150%', 
            content: `
            <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                <div style="flex: 1; min-width: 250px;">
                    <p style="color: #d4af37; font-size: 1.2rem; border-bottom: 1px solid #5a0000; margin-bottom: 10px;">🗡️ ОРУЖИЕ</p>
                    <p style="font-size: 0.95rem;">
                        <b style="color: #ff9900;">Оберег:</b> Взгляд смерти, Гомункул, Ухкапианский змей, Хватка Вилкена, Злоба<br><br>
                        <b style="color: #ff9900;">Сфера:</b> Гравированный знак, Триумвират, Сфера бездонной пропасти<br><br>
                        <b style="color: #ff9900;">Колчан:</b> Ищущие грех, Стрелы Света, Рюкзак бомбардира, Девятый ранец Цирри, Походный колчан Эмимеи, Панацея Августины, Наследие мертвеца<br><br>
                        <b style="color: #ff9900;">Топор:</b> Завет Мордуллу<br><br>
                        <b style="color: #ff9900;">Булава:</b> Шеферский молот, Отголосок ярости<br><br>
                        <b style="color: #ff9900;">Кинжал:</b> Веер лорда Гринстоуна, Жало Карли<br><br>
                        <b style="color: #ff9900;">Копье:</b> Трехсотое копье<br><br>
                        <b style="color: #ff9900;">Меч:</b> Лазурная ярость, Меч злой воли, Желание Смерти, Осколок ненависти, Меч вихрей, Верная память, Плеть, Уничтожитель Сталгарда, Клинок пророчества<br><br>
                        <b style="color: #ff9900;">Церем. Нож:</b> Кинжал-дротик, Священный пожинатель, Брадобрей, Кукри из звездного металла, Шинкователь Ву<br><br>
                        <b style="color: #ff9900;">Кистевое:</b> Хрустальный кулак, Терзатель плоти, Шраморез, Кулак Аз'Турраска, Вон Ким Лау, Клинок Киоширо, Ветер мщения, Львиные когти<br><br>
                        <b style="color: #ff9900;">Кистень:</b> Свет во тьме, Когти кречета, Довод Джоанны, Дополнение Аккана, Удел свирепых, Золоченый свежеватель, Снисходительность Аккана<br><br>
                        <b style="color: #ff9900;">Мощное:</b> Прорубатель фьордов, Гордость Амбо, Клинок полководца, Клятвохранитель, Оскверненное наследие, Почет Бастиона, Ярость исчезнувшей вершины, Молот правосудия, Клинок легендарного племени<br><br>
                        <b style="color: #ff9900;">Посох:</b> Посох рукокрылых, Великий визирь, Нестабильный скипетр, Змеиный жезл, Жезл Во, Элемент судьбы, Эфирный странник<br><br>
                        <b style="color: #ff9900;">Дайбо:</b> Равновесие, Поток вечности, Ароматический храмовый факел<br><br>
                        <b style="color: #ff9900;">Лук:</b> Изогнутый лук Яна, Львиный лук Хашира, Погибель Одиссея<br><br>
                        <b style="color: #ff9900;">2арб:</b> Мантикора, Натиск воджанни<br><br>
                        <b style="color: #ff9900;">1арб:</b> Утренняя заря
                    </p>
                </div>
                <div style="flex: 1; min-width: 250px;">
                    <p style="color: #d4af37; font-size: 1.2rem; border-bottom: 1px solid #5a0000; margin-bottom: 10px;">🛡️ БРОНЯ</p>
                    <p style="font-size: 0.95rem;">
                        <b style="color: #ff9900;">Тело:</b> Железное сердце, Кираса акилы, Плащ Бекинсейл, Плащ гарвульфа<br><br>
                        <b style="color: #ff9900;">Голова:</b> Сломанная корона, Боевой шлем Кассара, Гьяна на касу, Законы Сефа, Глаз Пешкова, Камень безумия, Злобная карнавальная маска, Маска Йерама, Кровожадный оскал, Корона Примаса, Свами, Судья<br><br>
                        <b style="color: #ff9900;">Наплечники:</b> Наплечники стража смерти, Монолог Лефевр, Оплечье поддержания, Ярость Древних, Мерзкий страж<br><br>
                        <b style="color: #ff9900;">Запястья:</b> Кровавые наручи Ашнагарра, Доспехи Гунгдо, Реликвия Кесаря, Гордость Пинто, Скрепы малых богов, Кандалы Аккана, Обвязки Мортика, Латные щитки Сечерона, Наруч ярости, Витки первого паука, Обмотки ясности, Наручи Йерама, Наручи первожителей, Безрассудство Ранслора, Наручи разрушения<br><br>
                        <b style="color: #ff9900;">Перчатки:</b> Таскер и Тео<br><br>
                        <b style="color: #ff9900;">Пояс:</b> Шафрановый кушак, Ведьмин пояс, Вериги ушедшей, Позор Дельсира, Душа Киоширо, Пояс из лианы Бакули, Невероятная цепь Фазулы, Путы Хергбраша<br><br>
                        <b style="color: #ff9900;">Ноги:</b> Зачумленные штаны, Штаны Хаммера, Проклятые штаны господина Яна, Болотные штаны, Покорители подземных глубин<br><br>
                        <b style="color: #ff9900;">Ступни:</b> Очень простые сапоги, Танцевальные туфли Риверы, Чулки Лута, Сапоги пренебрежения, Гордость Нильфур<br><br>
                        <b style="color: #ff9900;">Амулет:</b> Ожерелье Попрыгушки, Благодать предков<br><br>
                        <b style="color: #ff9900;">Кольцо:</b> Кольцо силы, Кольцо королевской роскоши, Исцеление Манальда, Ореол Карини, Палец низкорослого человека, Кольцо Найджела, Обсидиановое кольцо зодиака, Свет справедливости<br><br>
                        <b style="color: #ff9900;">Щит:</b> Отпор, Эберли-каро, Башня из слоновой кости, Щит ярости, Йеканборг, Пробуждение Акарата, Пиро Марелла, Щит Джоанны, Гнев Фридейра
                    </p>
                </div>
            </div>
            `
        },
        { 
            id: 'g_cl2', 
            title: '2 класс — 100%', 
            content: `
                <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                    <div style="flex: 1; min-width: 250px;">
                        <p style="color: #d4af37; font-size: 1.2rem; border-bottom: 1px solid #5a0000; margin-bottom: 10px;">🗡️ ОРУЖИЕ</p>
                        <p style="font-size: 0.95rem;">
                            <b style="color: #ff9900;">Оберег:</b> Триумф Шукрани, Нечто из глубин, Искания Генриха, Отвратительный улей<br><br>
                            <b style="color: #ff9900;">Сфера:</b> Зимний ветер, Отражающий свет шар, Свет добродетели, Сгусток ненависти Микена, Око, Неземной берег, Первородная душа<br><br>
                            <b style="color: #ff9900;">Колчан:</b> Шипы лютой ненависти<br><br>
                            <b style="color: #ff9900;">Топор:</b> Секач, Раскалыватель небес, Палач, Вспышка ярости, Похититель Мессершмитта, Пылающая головня, Пылающий колун, Завистливый клинок<br><br>
                            <b style="color: #ff9900;">Булава:</b> Искра жизни Артефа, Горнило, Небесный страж, Сын Одина, Скипетр безумного монарха, Молот бдительности Джейса<br><br>
                            <b style="color: #ff9900;">Кинжал:</b> Чародейский шип, Юн-Чан-До<br><br>
                            <b style="color: #ff9900;">Копье:</b> Арреатский закон, Резное копье, Осада, Бдительность<br><br>
                            <b style="color: #ff9900;">Меч:</b> Громовая Ярость, Ледяное сердце, Громовержец, Ин-Гиом, Максимус, Возражение Кэма, Кровный брат, Оскверненный Испепелитель<br><br>
                            <b style="color: #ff9900;">Церем. Нож:</b> Смертельное перерождение, Свежеватель Рен'хо, Последний вздох, Хватка паучьей королевы, Лезвие Анессази, Гидбинн<br><br>
                            <b style="color: #ff9900;">Кистевое:</b> Зубодробитель, Удар безумия, Золоченая плеть<br><br>
                            <b style="color: #ff9900;">Кистень:</b> Милость Юстиниана, Стремительный кистень, Воздаяние Кассара, Непоколебимая вера, Кистень Вознесшегося, Губительный осколок, Ужас смертности<br><br>
                            <b style="color: #ff9900;">Мощное:</b> Немилосердная булава, Скорбь Мадавка<br><br>
                            <b style="color: #ff9900;">Посох:</b> Прорицатель Су Вон, Аварион, Полынь, Звездный огонь, Жест Орфея<br><br>
                            <b style="color: #ff9900;">Дайбо:</b> Боевой посох генерала Цюана, Летящий дракон<br><br>
                            <b style="color: #ff9900;">Лук:</b> Крайдершот<br><br>
                            <b style="color: #ff9900;">2арб:</b> Буриза-до кэнону, Стреломет Ченона<br><br>
                            <b style="color: #ff9900;">1арб:</b> Пленитель Преисподней, Наследство Валлы, К'мар Тенклип, Катастрофа, Крылья Лианны, Крепостная баллиста, Погибель демона
                        </p>
                    </div>
                    <div style="flex: 1; min-width: 250px;">
                        <p style="color: #d4af37; font-size: 1.2rem; border-bottom: 1px solid #5a0000; margin-bottom: 10px;">🛡️ БРОНЯ</p>
                        <p style="font-size: 0.95rem;">
                            <b style="color: #ff9900;">Тело:</b> Пепельный мундир, Доспех доброго регента, Чёрное перо, Накидка темной ночи<br><br>
                            <b style="color: #ff9900;">Голова:</b> Лицо Гюнса, Корона леорика, Низложение гордыни, Клобук предсказателя смерти, Резонирующий череп, Лик Андариэль, Глаз разума, Несломимый дух Кекеги, Взгляд Тзо Крина, Кетцалькоатль, Лицо Гьюа, Тикланский лик, Колпак темного мага, Викалике архимага, Бархатный камарал<br><br>
                            <b style="color: #ff9900;">Наплечники:</b> —<br><br>
                            <b style="color: #ff9900;">Запястья:</b> Кровавые латные щитки, Наручи возмездия, Древние защитники Парты, Наручи силача<br><br>
                            <b style="color: #ff9900;">Перчатки:</b> Перчатки поклонения, Каменные рукавицы, Вызов святого Арчью, Магические кулаки, Обжигающий холод<br><br>
                            <b style="color: #ff9900;">Пояс:</b> Златотканная перевязь, Ненасытный пояс, Священная перевязь, Пояс из ушей, Ночной кошмар Себора, Всепоражающий удар, Пояс-ножны, Навязчивый ремень, Обмотки Хводжа, Цепь Омрина, Вервие Шермы, Цепь Теней<br><br>
                            <b style="color: #ff9900;">Ноги:</b> Сделка со смертью<br><br>
                            <b style="color: #ff9900;">Ступни:</b> Призрачные башмаки, Огнеупорные сапоги, Сапоги для хождения по льду<br><br>
                            <b style="color: #ff9900;">Амулет:</b> Покровительство лунного света, Всепоглощающее желание, Талисман Араноха, Камея графини Юлии, Суть Йохана, Дух времени, Золото Кимбо, Калейдоскоп Мары, Звезда Азкаранта, Амулет Ксефирии, Восшествие Гальциона<br><br>
                            <b style="color: #ff9900;">Кольцо:</b> Петля Пандемония, Нарушенные обещания, Палец высокого человека, Воровское кольцо Решель, Кольцо залов сожаления, Огромная печатка Рогара, Знак судьбы<br><br>
                            <b style="color: #ff9900;">Щит:</b> Атрибут культа, Шипы Во'Тойяза, Замораживающий отклонитель, Защитник Вестмарша, Спасение, Последний свидетель, Священный оплот, Возвышенные убеждения, Адский череп, Неумолимая фаланга
                        </p>
                    </div>
                </div>
            ` 
        },
        { 
            id: 'g_cl3', 
            title: '3 класс — 50%', 
            content: `
                <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                    <div style="flex: 1; min-width: 250px;">
                        <p style="color: #d4af37; font-size: 1.2rem; border-bottom: 1px solid #5a0000; margin-bottom: 10px;">🗡️ ОРУЖИЕ</p>
                        <p style="font-size: 0.95rem;">
                            <b style="color: #ff9900;">Оберег / Сфера / Колчан:</b> — <br><br>
                            <b style="color: #ff9900;">Топор:</b> Гендзанику, Крюк Мясника, Пылающий топор Санкиса, Разделочный нож Мясника<br><br>
                            <b style="color: #ff9900;">Булава:</b> Крушитель душ, Катаклизм, Разлом, Соланиум, Сотрясатель земли<br><br>
                            <b style="color: #ff9900;">Кинжал:</b> Свинорез, Клинок кровавой магии, Острие кровавой магии<br><br>
                            <b style="color: #ff9900;">Копье:</b> Коровий бердыш<br><br>
                            <b style="color: #ff9900;">Меч:</b> Разрубатель, Рассекатель небес<br><br>
                            <b style="color: #ff9900;">Посох:</b> Жезл арреатских недр, Наказание Валтека, Средоточие Малота, Мучитель, Безумие Слорака<br><br>
                            <b style="color: #ff9900;">Лук:</b> Крыло ворона, Дурной глаз<br><br>
                            <b style="color: #ff9900;">2арб:</b> Орудие демона, Гноестрел, Адский пригвоздитель<br><br>
                            <b style="color: #ff9900;">Цер. Нож / Кистевое / Кистень / Мощное / Дайбо / 1арб:</b> —
                        </p>
                    </div>
                    <div style="flex: 1; min-width: 250px;">
                        <p style="color: #d4af37; font-size: 1.2rem; border-bottom: 1px solid #5a0000; margin-bottom: 10px;">🛡️ БРОНЯ</p>
                        <p style="font-size: 0.95rem;">
                            <b style="color: #ff9900;">Тело:</b> Кольчуга, Хаори ши мидзу, Золотая кожа, Обманный плащ<br><br>
                            <b style="color: #ff9900;">Голова:</b> Грозовой ворон<br><br>
                            <b style="color: #ff9900;">Наплечники:</b> Наплечные щитки возвращения, Наплечье Короля-скелета, Наплеч Закары<br><br>
                            <b style="color: #ff9900;">Запястья:</b> Варжечанские боевые наручи, Кастерианские накулачники, Обещание славы<br><br>
                            <b style="color: #ff9900;">Перчатки:</b> Рукавицы гладиатора<br><br>
                            <b style="color: #ff9900;">Пояс:</b> Сила Громовержца, Ремень для правки бритв<br><br>
                            <b style="color: #ff9900;">Ноги:</b> — <br><br>
                            <b style="color: #ff9900;">Ступни:</b> Грязеступы Железной Ноги<br><br>
                            <b style="color: #ff9900;">Амулет:</b> Золотое ожерелье Леорика, Энергетическая ловушка Дову, Осколок жизни Ракова, Одержимость Вахо<br><br>
                            <b style="color: #ff9900;">Кольцо:</b> Кольцо алчности, Кольцо-головоломка, Аркстон, Обручальное кольцо Бул-Катоса<br><br>
                            <b style="color: #ff9900;">Щит:</b> Костяная стена, Воинский вал
                        </p>
                    </div>
                </div>
            ` 
        }
    ]
};
