class UI_Helper
{
    static Init()
    {
        UI_Helper.History = [];
        UI_Helper.addHistory = true;
        
        UI_Helper.TranslateUI();
        UI_Helper.InitDraggableWindows();
        UI_Helper.InitSliders();

        UI_Helper.InitSettings();
        UI_Helper.InitMenu();
        UI_Helper.InitPause();
        UI_Helper.InitInGame();

        WorldMap.Init();
    }


    static CatchEscape()
    {
        var isHistoryEmpty = (UI_Helper.History.length == 0) ? true : false;

        if(isHistoryEmpty && Main.RUNNING == RUNNING.INGAME)
        {
            InGame.Pause();
            return;
        }

        if(isHistoryEmpty && Main.RUNNING == RUNNING.MENU)
        {
            //QUIT
            return;
        }

        UI_Helper.removeHistoryElement();
    }

    static addHistoryElement(element, property, value, id = '', onRemove, removeSound)
	{
		UI_Helper.History.push(
            {
                id: id,
                element: element,
                property: property,
                value: value,
                onRemove: onRemove,
                removeSound: removeSound
            }
        );
	}

    static getHistoryIndex(id)
    {
        for(var i in UI_Helper.History)
        {
            var entry = UI_Helper.History[i];
            if(entry.id == id) return i;
        }
        return -1;
    }

	static removeHistoryElement(id = null)
	{
		var index = UI_Helper.History.length - 1;

        if(id) index = UI_Helper.getHistoryIndex(id);
        if(index == -1) return;

        var entry = UI_Helper.History[index];
        if(!entry) return;

        var id = entry.id;
        var element = entry.element;
        var property = entry.property;
        var value = entry.value;
        var onRemove = entry.onRemove;
        var removeSound = entry.removeSound;

        if(removeSound) SoundManager.Play(removeSound, 'EFFECT');
        UI_Helper.History.splice(index, 1);
        if(isFunction(onRemove)) onRemove();

        if(property == 'remove')
        {
            element.remove();
            return;
        }

        set(element, property, value);
	}

    static TranslateUI()
    {
        var els = document.querySelectorAll('[data-translate]');
        els.forEach(e => {e.innerText = Lang.Get(e.dataset.translate)});
    }

    static setBarProgress(id, progress, updateContent = true, _content = false)
    {
        var bar = document.getElementById(id);
        if(!bar) return;
        bar.style.setProperty('--progress', progress);

        if(!updateContent) return;
        var content = bar.querySelector('.progress_bar_content');
        if(!content) return;

        var contentInner = (_content) ? _content : progress;
        set(content, 'innerText', contentInner, true);
    }

    static Fade(onEnd, duration = 2)
    {
        var remove = function(){this.remove()};
        var container = document.getElementById('ui_container');

        var fade_trans = document.createElement('div');
            fade_trans.className = 'fade-transition';
            fade_trans.style.animationDuration = duration + 's';
            fade_trans.addEventListener('animationend', onEnd);
            fade_trans.addEventListener('animationend', remove);

            container.appendChild(fade_trans);
    }


    static InitDraggableWindows()
    {
        DraggableWindow.Init(document.getElementById('settings_window_handle'));
        DraggableWindow.Init(document.getElementById('world_map_handle'));
        DraggableWindow.Init(document.getElementById('inventory_handle'));
        DraggableWindow.Init(document.getElementById('inventory_equips_handle'));
        DraggableWindow.Init(document.getElementById('player_stats_handle'));
        DraggableWindow.Init(document.getElementById('knowledge_handle'));
        DraggableWindow.Init(document.getElementById('quests_handle'));
    }

    static isOpen(id)
    {
        var el = document.getElementById(id);
        if(!el) return false;
        if(el.dataset.open != 'true') return false;

        return true;
    }


    static Open(id, hide = true, classSelector, onRemove)
    {
        classSelector = classSelector ?? 'ui';
        if(hide) UI_Helper.Hide('.' + classSelector);
        var el = document.getElementById(id);

        if(el.dataset.draggable == 'true' && Settings.General.AlwaysReposeWindows)
        {
            DraggableWindow.ResetPosition(el);
        }

        el.dataset.open = 'true';
        if(UI_Helper.addHistory) UI_Helper.addHistoryElement(el, 'dataset.open', false, id, onRemove);
        UI_Helper.addHistory = true;
    }

    static Hide(classSelector = '.ui', removeHistory = true)
    {
        var id = classSelector.replace('.', '').replace('#', '');
        if(removeHistory && UI_Helper.getHistoryIndex(id) != -1) UI_Helper.removeHistoryElement(id);

        var uis = document.querySelectorAll(classSelector+':not([data-keep_open="true"])');
        uis.forEach(e => e.dataset.open = 'false');
    }

    static Toggle(id, onRemove, hide = false, classSelector = null)
    {
        var el = document.getElementById(id);
        if(el.dataset.open == 'true')
        {
            if(UI_Helper.getHistoryIndex(id) != -1) UI_Helper.removeHistoryElement(id);
            else UI_Helper.Hide('#' + id);
        }
        else
        {
            UI_Helper.Open(id, hide, classSelector, onRemove);
        }
    }

    static ToggleWorldMap()
    {
        var id = 'world_map';
        var el = document.getElementById(id);

        UI_Helper.Toggle(id);
        

        if(el.dataset.open == 'true')
        {
            //render
            WorldMap.Render();
        }
    }


    static ToggleQuestLog()
    {
        var id = 'quests';
        var el = document.getElementById(id);

        UI_Helper.Toggle(id);

        if(el.dataset.open == 'true') QuestList.CreateList();
    }

    // static ToggleDialog()
    // {
    //     var id = 'talk_with';
    //     var el = document.getElementById(id);

    //     UI_Helper.Toggle(id, DialogGUI.Close);

    //     UI_Helper.Open('talk_with', false, null, DialogGUI.Close);
    //     if(el.dataset.open == 'true') DialogGUI.Open();
    // }


    static TogglePlayerStats(ignoreInv)
    {
        var id = 'player_stats';
        var inv = document.getElementById('inventory');
        var el = document.getElementById(id);

        //cannot hide stats when inventory is open
        if(el.dataset.open == 'true' && inv.dataset.open == 'true' && !ignoreInv) return;

        UI_Helper.Toggle(id);

        if(el.dataset.open == 'false') el.dataset.selfopen = 'false';
    }


    static ToggleInventory(id = 'inventory', owner = World.Player, items_path = 'inventory')
    {
        var el = document.getElementById(id);

        UI_Helper.Toggle(id, () => {
            if(id == 'inventory') 
            {
                if(World.Player.hand)
                {
                    World.Player.addItemToInventory(World.Player.hand);
                    World.Player.hand = null;
                    InventoryGUI.UpdateHand();
                }

                UI_Helper.Hide('#inventory_equips');
                var stats = document.getElementById('player_stats');
                if(stats.dataset.selfopen != 'true' && stats.dataset.open == 'true') UI_Helper.TogglePlayerStats(true);
            }
        });

        if(el.dataset.open == 'true')
        {
            InventoryGUI.Update(id, owner, items_path);
            
            if(id == 'inventory')
            {
                UI_Helper.addHistory = false;
                UI_Helper.Open('inventory_equips', false);
                InventoryGUI.Update('inventory_equips', World.Player, 'equips');

                var stats = document.getElementById('player_stats');
                if(stats.dataset.open == 'true') stats.dataset.selfopen = 'true';
                else 
                {
                    UI_Helper.addHistory = false;
                    UI_Helper.TogglePlayerStats();
                }
            }
        }
    }

    static OpenShop(owner, items_path)
    {
        var remove = function()
        {
            World.Player.interactionWith?.endTrade();
            InventoryGUI.isShopOpen = false;
            UI_Helper.removeHistoryElement('shop');
            UI_Helper.removeHistoryElement('inventory');
        };

        InventoryGUI.isShopOpen = true;
        UI_Helper.Open('shop', false, null, remove);
        InventoryGUI.Update('shop', owner, items_path);

        UI_Helper.Open('inventory', false, null, remove);
        InventoryGUI.Update();

        //repose windows
        var container_rect = document.getElementById('game_container').getBoundingClientRect();
        var width = parseInt(getComputedStyle(document.getElementById('shop')).width.replace('px', ''));
        var x = (container_rect.width - (width * 2)) / 3;
        var x2 = (x * 2) + width;

        set('#inventory', 'style.left', x + 'px');
        set('#shop', 'style.left', x2 + 'px');
    }



    static OpenLargeShop(owner, items_path)
    {
        var remove = function()
        {
            World.Player.interactionWith?.endTrade();
            InventoryGUI.isShopOpen = false;
            UI_Helper.removeHistoryElement('large_shop');
            UI_Helper.removeHistoryElement('inventory');
        };

        InventoryGUI.isShopOpen = true;
        UI_Helper.Open('large_shop', false, null, remove);
        InventoryGUI.Update('large_shop', owner, items_path);

        UI_Helper.Open('inventory', false, null, remove);
        InventoryGUI.Update();

        //repose windows
        var container_rect = document.getElementById('game_container').getBoundingClientRect();
        var width = parseInt(getComputedStyle(document.getElementById('large_shop')).width.replace('px', ''));
        var x = (container_rect.width - (width * 2)) / 3;
        var x2 = (x * 2) + width;

        set('#inventory', 'style.left', x + 'px');
        set('#large_shop', 'style.left', x2 + 'px');
    }




    


    static OpenAppearanceGUI()
    {
        var remove = function()
        {
            AppearanceGUI.Close();
            World.Player.interactionWith = null;
            Save();
            UI_Helper.removeHistoryElement('appearance');
        };

        UI_Helper.Open('appearance', false, null, remove);
        AppearanceGUI.Open();
    }



    static OpenSaveSelection()
    {
        document.getElementById('menu_buttons').style.display = 'none';

        var remove = function()
        {
            SaveSelectionGUI.Close();
            UI_Helper.removeHistoryElement('save_selection');
            document.getElementById('menu_buttons').style.display = ''
        };

        UI_Helper.Open('save_selection', false, null, remove);
        SaveSelectionGUI.Open();
    }



    static OpenKnowledgeGUI()
    {
        var remove = function()
        {
            KnowledgeGUI.Close();
            World.Player.interactionWith = null;
            UI_Helper.removeHistoryElement('knowledge');
        };

        UI_Helper.Open('knowledge', false, null, remove);
        KnowledgeGUI.Open();
    }


    static OpenDifficulties()
    {
        var i = 0;
        document.querySelectorAll('#difficulty .info').forEach(e => 
        {
            var difficultyInfo = GetDifficultyInfo(i);
            var description = Lang.Get(e.dataset.translate, difficultyInfo);

            e.innerText = description;
            i++
        });

        document.getElementById('difficulty').dataset.open = 'true';
    }


    static OpenCrafting()
    {
        var remove = function()
        {
            Crafting.Close();
            World.Player.interactionWith = null;
            UI_Helper.removeHistoryElement('crafting');
            UI_Helper.removeHistoryElement('inventory');
        };

        UI_Helper.Open('crafting', false, null, remove);

        UI_Helper.Open('inventory', false, null, remove);
        InventoryGUI.Update();

        //repose windows
        var container_rect = document.getElementById('game_container').getBoundingClientRect();
        var inv_width = parseInt(getComputedStyle(document.getElementById('inventory')).width.replace('px', ''));
        var craft_width = parseInt(getComputedStyle(document.getElementById('crafting')).width.replace('px', ''));

        var width = inv_width + craft_width + 100;
        var x = (container_rect.width - width) / 2;
        var x2 = x + inv_width+100;

        set('#inventory', 'style.left', x + 'px');
        set('#crafting', 'style.left', x2 + 'px');

        Crafting.Open();
    }



    static setTranscendentalText()
    {
        var els = document.querySelectorAll('[data-grade="'+GRADE.TRANSCENDENTAL+'"]');
        els.forEach(e => e.dataset.text = e.innerText);
    }


    static UpdateSlider(slider)
    {
        slider.dataset.value = slider.value;
        var progress = (slider.value * 1 - slider.min * 1) / (slider.max * 1 - slider.min * 1) * 100;
        slider.style.setProperty('--progress', progress + '%');
    }

    static UpdateSliders()
    {
        var els = document.querySelectorAll('input[type="range"]');
        els.forEach(e => UI_Helper.UpdateSlider(e));
    }

    static InitSliders()
    {
        var els = document.querySelectorAll('input[type="range"]');
        els.forEach(e => 
        {
            UI_Helper.UpdateSlider(e);
            e.addEventListener('input', function()
            {
                UI_Helper.UpdateSlider(this);
            });
        });
    }


    static showConfirm(confirm = '', Yes = '', No = '', onYes = null, onNo = null)
	{
		var id = 'confirm_' + Date.now();

		var container = document.createElement('div');
			container.className = 'confirm_container';
			container.id = id;
		
		var box = document.createElement('div');
			box.className = 'box';
		
		var warning = document.createElement('div');
			warning.className = 'warning';
			warning.innerText = 'Uwaga!';

		var message = document.createElement('p');
			// message.innerText = text;

		var question = document.createElement('p');
			question.innerText = Lang.Get(confirm);

		var nav_bottom = document.createElement('div');

		var button_yes = document.createElement('div');
            button_yes.className = 'button';
			button_yes.innerText = Lang.Get(Yes);
			button_yes.addEventListener('click', ()=>{UI_Helper.hideConfirm(id); onYes?.();});

		var button_no = document.createElement('div');
            button_no.className = 'button';
			button_no.innerText = Lang.Get(No);
			button_no.addEventListener('click', ()=>{UI_Helper.hideConfirm(id); onNo?.()});


		document.body.appendChild(container);
		container.appendChild(box);
		box.appendChild(warning);
		// box.appendChild(message);
		box.appendChild(question);
		box.appendChild(nav_bottom);
		nav_bottom.appendChild(button_yes);
		nav_bottom.appendChild(button_no);

        UI_Helper.addHistoryElement(container, 'remove', '', id);
	}

    static hideConfirm(id)
	{
        UI_Helper.removeHistoryElement(id);
	}


    static InitMenu()
    {
		// if(DEVELOPER_MODE)
		// {
		// 	document.getElementById('menu_testing_chamber').addEventListener('click', function()
		// 	{
		// 		Menu.Transition(function()
		// 		{
        //             Main.inTestMode = true;
                    
		// 			InGame.Run();
		// 			World.Initialize();
		// 			World.LoadMap("TestingChamber", true);
		// 		});
		// 	});
		// }

		document.getElementById('menu_game_ver').innerText = "v." + VERSION;


        document.getElementById('menu_settings').addEventListener('click', function()
		{
            document.getElementById('menu_buttons').style.display = 'none';
            var onRemove = function()
            {
                document.getElementById('menu_buttons').style.display = '';
                Settings.Save();
            };
            
            var settings_window = document.getElementById('settings_window');
            if(!settings_window.style.top) settings_window.style.top = '60%';
			UI_Helper.Open('settings', false, null, onRemove);
		});


        document.getElementById('menu_start').addEventListener('click', function()
		{
			UI_Helper.OpenSaveSelection();
		});

        document.getElementById('menu_credits').addEventListener('click', function()
		{
            var open = document.getElementById('shader_flare').dataset.open;
            var _remove = () => {document.getElementById('shader_flare').dataset.open = open};
            document.getElementById('shader_flare').dataset.open = 'false';
            
			UI_Helper.Open('credits', false, null, _remove);
		});

        document.getElementById('menu_quit').addEventListener('click', function()
		{
            Main.Exit();
		});
    }



    static InitInGame()
    {
        var s = AppearanceGUI.GetSkinScrollStep();
        DraggableScroll.Init(document.querySelector('#skins'), {step: s});
        DraggableScroll.Init(document.querySelector('#knowledge_location_list'), {accY: .1});
        DraggableScroll.Init(document.querySelector('#quest_list'), {accY: .1});


        



        document.querySelector('#appearance').querySelectorAll('.slider_arrow').forEach(e => 
        {
            e.addEventListener('click', AppearanceGUI.SkinListArrowsClick);
        });


        InventoryGUI.Init();
        InventoryGUI.Init('shop');
        if(DEVELOPER_MODE) InventoryGUI.Init('large_shop', ItemHelper.totalItems, 'SHOP');
        InventoryGUI.InitEquips();

        Crafting.Init();

        var height = document.querySelector('#inventory').style.getPropertyValue('--window-height');
        document.getElementById('player_stats').style.setProperty('--window-height', height);

        UI_Helper.CreatePlayerHealthBar();
        UI_Helper.InitDeathScreen();
        UI_Helper.InitPlayerStats();


        document.getElementById('bottom_nav_icons').addEventListener('click', function()
        {
            // this.dataset.hide = (this.dataset.hide == 'false') ? 'true' : 'false';
            UI_Helper.Toggle(this.id);
        });

        document.getElementById('ingame_button_world_map').addEventListener('click', function()
        {
            UI_Helper.ToggleWorldMap();
        });
        document.getElementById('ingame_button_pause').addEventListener('click', function()
        {
            InGame.Pause();
            UI_Helper.Hide('#bottom_nav_icons');
        });



        document.getElementById('difficulty_icon').addEventListener('mousemove', function()
        {
            var difficultyInfo = GetDifficultyInfo();

            var text = Lang.Get('DIFFICULTY') + ': '+ Lang.Get('DIFFICULTY.'+difficultyInfo.Name.toUpperCase()+'.NAME');
            var description = Lang.Get('DIFFICULTY.'+difficultyInfo.Name.toUpperCase()+'.DESCRIPTION', difficultyInfo);

            UI_Helper.ShowTooltip(text, description);
        });

        document.getElementById('difficulty_icon').addEventListener('mouseout', function()
        {
            ItemInfo.Hide();
        });

        DraggableScroll.Init(document.querySelector('#world_map .content'));


        document.getElementById('difficulty_select_easy').addEventListener('click', function()
        {
            World.Player.Difficulty = 0;
            document.getElementById('difficulty').dataset.open = 'false';
            UI_Helper.setDifficultyInfo()
        });

        document.getElementById('difficulty_select_normal').addEventListener('click', function()
        {
            World.Player.Difficulty = 1;
            document.getElementById('difficulty').dataset.open = 'false';
            UI_Helper.setDifficultyInfo()
        });

        document.getElementById('difficulty_select_hard').addEventListener('click', function()
        {
            World.Player.Difficulty = 2;
            document.getElementById('difficulty').dataset.open = 'false';
            UI_Helper.setDifficultyInfo()
        });

    }

    static ShowTooltip(text, description = null)
    {
        var item = new Item();
        item.price = null;
        item.name = text;
        item.Description = description;

        ItemInfo.Hide();
        ItemInfo.Show(item); 
    }

    static InitPlayerStats()
    {
        var container = document.getElementById('player_stat_sp_stats');
        var sp_buttons = container.querySelectorAll('.sp_button');
        var sp_stat_names = container.querySelectorAll('.sp_stat_name');

        sp_buttons.forEach(e => 
        {
            e.addEventListener('click', function()
            {
                World.Player.UseSPpoint(STAT[this.dataset.stat]);
            })
        });


        sp_stat_names.forEach(e => 
        {
            e.addEventListener('mousemove', function()
            {
                var params = {};
                var sp_data = World.Player.SPstats[STAT[this.dataset.translate]];

                params.value = sp_data[0] * sp_data[2];
                var text = Lang.Get('SP.'+this.dataset.translate+'.TITLE', params);

                UI_Helper.ShowTooltip(text);
            });

            e.addEventListener('mouseout', function()
            {
                ItemInfo.Hide();
            });
        });

        var defense_name = document.getElementById('player_stat_defense_name');
        defense_name.addEventListener('mousemove', function()
        {
            var params = {};

            params.def = World.Player.stats[STAT.DEFENSE];
            params.reduction = World.Player.getDamageReduction();

            var text = Lang.Get('STAT.DEFENSE.TITLE', params);

            UI_Helper.ShowTooltip(text);
        });
        defense_name.addEventListener('mouseout', function()
        {
            ItemInfo.Hide();
        });
    }

    static InitDeathScreen()
    {
        document.querySelector('#death_screen_respawn').addEventListener('click', function()
        {
            World.Player.Respawn();
            UI_Helper.removeHistoryElement('death_screen');
        });
    }


    static TriggerHeartAnimation(index = 0)
    {
        var heart = document.querySelector('.heart[data-index="'+index+'"]');
            heart.dataset.beat = 'true';
    }

    static HeartAnimationEnd(el)
    {
        el.dataset.beat = 'false';

        var index = el.dataset.index * 1;
        var next_index = index + 1;
        var next_el = document.querySelector('.heart[data-index="'+next_index+'"]');
        if(next_el) 
        {
            if(next_el.style.getPropertyValue('--health-ratio') != '0')
            {
                UI_Helper.TriggerHeartAnimation(next_index);
                return;
            }
        }

        InGame.setHeartAnimationDelay();
    }

    static CreatePlayerHealthBar(maxHP = 400, avoidUpdate = false)
    {
        var heartValue = Player.GetHeartValue() * 2;
        var hearts = Math.ceil(maxHP / heartValue);

        var el = document.getElementById('player_health_container');
            el.innerHTML = '';
        var el_style = getComputedStyle(el);

        var heartsInRow = el_style.getPropertyValue('--hearts-in-row') * 1;
        var rows = Math.ceil(hearts / heartsInRow);
        var drawedHearts = 0;

        for(var i = 0; i < rows; i++)
        {
            var row = document.createElement('div');
                row.className = 'row';
                row.style.zIndex = i + 1;

            for(var j = 0; j < heartsInRow; j++)
            {
                if(drawedHearts > hearts) break;

                var heart_container = document.createElement('div');
                    heart_container.className = 'heart icon';
                    heart_container.dataset.icon = 'heart-empty';
                    // heart_container.style.setProperty('--index', drawedHearts);
                    heart_container.dataset.index = drawedHearts;
                    heart_container.dataset.beat = 'false';
                    heart_container.addEventListener('animationend', function(){UI_Helper.HeartAnimationEnd(this)});

                row.appendChild(heart_container);

                drawedHearts++;
            }

            el.appendChild(row);
        }

        if(!avoidUpdate) UI_Helper.UpdatePlayerHealthBar(70, 100);
    }


    static UpdatePlayerHealthBar(currentHealth, maxHealth)
    {
        var heartValue = Player.GetHeartValue() * 2;
        var visible_hearts = Math.ceil(maxHealth / heartValue);

        var i = 0;
        var heart_elements = document.querySelectorAll('.heart');
        if(visible_hearts > heart_elements.length) 
        {
            //force hearts recreate if max health is higher than default
            UI_Helper.CreatePlayerHealthBar(maxHealth, true);
            UI_Helper.UpdatePlayerHealthBar(currentHealth, maxHealth);
            return;
        }

        heart_elements.forEach(e => 
        {
            var currentHealthRatio = currentHealth / heartValue;
                if(currentHealthRatio > 1) currentHealthRatio = 1;
                if(currentHealthRatio < 0) currentHealthRatio = 0;

            e.style.setProperty('--health-ratio', currentHealthRatio);
            e.style.opacity = (i >= visible_hearts) ? 0 : 1;
            e.style.setProperty('--animation-speedup', '');
            e.dataset.critical = 'false';

            if(currentHealth <= heartValue && i == 0 && currentHealth > 0)
            {
                //only first heart can apply critical animations
                e.dataset.critical = 'true';
                if(currentHealth <= heartValue / 2) e.style.setProperty('--animation-speedup', '.75');

                InGame.setHeartAnimationDelay();        //avoid stoping animation cycles
            }

            i++;
            currentHealth -= heartValue;
        });

    }

    static setDifficultyInfo()
    {
        var icon = 'difficulty_easy';
		if(Difficulty() == 1) icon = 'difficulty_normal';
		if(Difficulty() == 2) icon = 'difficulty_hard';
		
		set('#difficulty_icon', 'dataset.icon', icon, true);
    }

    static updateCooltimeIcons()
    {
        var cooltimes = World.Player.Cooltimes;
        var container = document.getElementById('player_cooltime_container');
        container.querySelectorAll('.item').forEach(e => {e.dataset.hidden = 'true'});

        for(var id in cooltimes)
        {
            var el = container.querySelector('.item.'+id);
            if(!el) el = UI_Helper.createCooltimeIcon(container, id, cooltimes[id].icon);

            el.style.setProperty('--progress', cooltimes[id].progress);
            if(!cooltimes[id].isEffect) el.dataset.hidden = cooltimes[id].progress >= 100 ? 'true' : 'false';
            else el.dataset.hidden = cooltimes[id].progress <= 0 ? 'true' : 'false';
        }

        container.querySelectorAll('.item[data-hidden="true"]').forEach(e => {e.remove()});
    }

    static createCooltimeIcon(container, id, icon)
    {
        var el = document.createElement('div');
            el.className = 'item icon '+id;
            el.dataset.icon = icon.toLowerCase();
            el.dataset.id = id;
            el.addEventListener('mousemove', function()
            {
                var params = {};
                var effect = World.Player.Effects.GetActiveEffectById(this.dataset.id);
                if(!effect) return;

                var id = this.dataset.id.replace('EFFECT_', '');
                params.STRENGTH = effect.Strength;

                var text = Lang.Get('EFFECT.'+id+'.NAME');
                var desc = Lang.Get('EFFECT.'+id+'.DESCRIPTION', params);

                UI_Helper.ShowTooltip(text, desc);
            });
            el.addEventListener('mouseout', function()
            {
                ItemInfo.Hide();
            });

        
        container.appendChild(el);

        return el;
    }




    static InitPause()
    {
        document.getElementById('pause_continue').addEventListener('click', function()
        {
            InGame.Resume();
        });

        document.getElementById('pause_settings').addEventListener('click', function()
		{
            document.getElementById('pause_buttons').style.display = 'none';
            var onRemove = function()
            {
                document.getElementById('pause_buttons').style.display = '';
                Settings.Save();
            };

            var settings_window = document.getElementById('settings_window');
                settings_window.style.top = '';

			UI_Helper.Open('settings', false, null, onRemove);
		});


        document.getElementById('pause_quit').addEventListener('click', function()
		{
            UI_Helper.removeHistoryElement('pause');
            InGame.Quit();
            Main.inTestMode = false;
		});
    }




    static InitSettings()
    {
        var els = document.querySelectorAll('[data-opensection]');
        els.forEach(e => 
        {
            e.addEventListener('click', function()
            {
                var id = this.dataset.opensection;
                var sectionClass = this.dataset.sectionclass;

                UI_Helper.addHistory = false;
                UI_Helper.Open(id, true, sectionClass);

                var els = document.querySelectorAll('[data-opensection]');
                els.forEach(e => e.dataset.locked = false);
                this.dataset.locked = true;
            });
            var target = document.getElementById(e.dataset.opensection);
            if(target) 
                if(!target.dataset.open) target.dataset.open = 'false';
        });

        document.getElementById('settings_apply').addEventListener('click', function()
        {
            UI_Helper.removeHistoryElement('settings');
        });


        document.getElementById('settings_reset').addEventListener('click', function()
        {
            var locked_setting_button = document.querySelector('[data-opensection][data-locked="true"][data-sectionclass="settings_scene"]');
            var setting_type = locked_setting_button.dataset.setting;
            Settings.RestoreDefault(setting_type);
            UI_Helper.ReloadSettingsUI();
        });




        var inputs = document.querySelectorAll('[data-setting]');
        inputs.forEach(e => 
        {
            e.addEventListener('input', function()
            {
                var path = this.dataset.setting;
                var value = this.value;
                if(this.type == 'checkbox') value = this.checked;
                if(this.type == 'range' || this.type == 'number') value = parseFloat(value);
                if(this.type == 'text' && value == 'SPACE') value = ' ';

                set(Settings, path, value);
            });
        });






        var els = document.querySelectorAll('[data-type="key"]');
        els.forEach(e => 
        {
            e.addEventListener('keydown', function(e)
            {
                this.value = e.key.toUpperCase();
                if(this.value == ' ') this.value = 'SPACE';
                e.preventDefault();     //prevent from adding key to value

                var event = new Event('input');
                this.dispatchEvent(event);
            });
        });






        UI_Helper.ReloadSettingsUI();
    }

    static ReloadSettingsUI()
    {
        var change = function()
        {
            var resolutions = Settings.Video.getResolutions();
            if(resolutions[this.value]) Settings.Video.Resolution = resolutions[this.value];
        };

        var resolutions = Settings.Video.getResolutions();
        var res_options = [];
        var current = null;
        for(var i in resolutions)
        {
            var res = resolutions[i];
            var opt = {value: i, name: res[0] + ' x ' + res[1], disabled: false, icon: null};
            res_options.push(opt);


            if(res[0] == Settings.Video.Resolution[0] && res[1] == Settings.Video.Resolution[1]) current = i;
        }

        var select = CustomSelect.Create('settings_video_resolution', res_options, current, change);

        var select_container = document.getElementById('settings_video_resolution_container');
            select_container.innerHTML = '';
            select_container.appendChild(select);
        


        var inputs = document.querySelectorAll('[data-setting]');
        inputs.forEach(e => 
        {
            if(e.type == 'checkbox') e.checked = get(Settings, e.dataset.setting);
            else e.value = get(Settings, e.dataset.setting);

            if(e.type == 'text' && e.value == ' ') e.value = 'SPACE';
        });
        UI_Helper.UpdateSliders();
    }
}