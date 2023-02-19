window.addEventListener("keydown", function (e)
{
    if(e.key == '`')
    {
        UI_Helper.Toggle('cheat_sheet');
    }
});

(function()
{
    var inputClick = function()
    {
        if(this.innerText == 'off')
        {
            this.dataset.value = true;
            this.innerText = 'on';
        }
        else
        {
            this.dataset.value = false;
            this.innerText = 'off';
        }
    };

    var c = document.getElementById('ui_container');

    var CS_ui = document.createElement('div');
        CS_ui.id = 'cheat_sheet';
        CS_ui.className = 'ui text-stroke';
        CS_ui.style.setProperty('--stroke-color', 'black');
        CS_ui.style.setProperty('padding', '10px');
        CS_ui.dataset.keep_open = true;
        c.appendChild(CS_ui);

    var title = document.createElement('div');
        title.innerText = 'Cheat Sheet active [ ` ]';
        CS_ui.appendChild(title);

    var br = document.createElement('br');
        CS_ui.appendChild(br);

    var save = document.createElement('div');
        save.innerText = 'Save';
        save.style.pointerEvents = 'all';
        save.addEventListener('click', function(){Save()});
            CS_ui.appendChild(save);

    var lvl_up = document.createElement('div');
        lvl_up.innerText = 'Level Up';
        lvl_up.style.pointerEvents = 'all';
        lvl_up.addEventListener('click', function(){World.Player.LevelUp()});
            CS_ui.appendChild(lvl_up);

    var oxygen = document.createElement('div');
        oxygen.innerText = 'Add Oxygen';
        oxygen.style.pointerEvents = 'all';
        oxygen.addEventListener('click', function(){World.Player.coins += 100000});
                CS_ui.appendChild(oxygen);
        
    var hp_recover = document.createElement('div');
        hp_recover.innerText = 'Recover HP';
        hp_recover.style.pointerEvents = 'all';
        hp_recover.addEventListener('click', function(){World.Player.stats.HP = World.Player.stats.MAXHP});
        CS_ui.appendChild(hp_recover);

    var godmode = document.createElement('div');
        godmode.innerText = 'GodMode: ';
        CS_ui.appendChild(godmode);

    var godmode_input = document.createElement('span');
        godmode_input.innerText = 'off';
        godmode_input.style.pointerEvents = 'all';
        godmode_input.addEventListener('click', inputClick);
        godmode_input.addEventListener('click', function(){World.Player.godMode = toBool(this.dataset.value)});
        godmode.appendChild(godmode_input);

    var hitbox = document.createElement('div');
        hitbox.innerText = 'Show hitbox: ';
        CS_ui.appendChild(hitbox);

    var hitbox_input = document.createElement('span');
        hitbox_input.innerText = 'off';
        hitbox_input.style.pointerEvents = 'all';
        hitbox_input.addEventListener('click', inputClick);
        hitbox_input.addEventListener('click', function(){Main.ShowHitbox = toBool(this.dataset.value)});
        hitbox.appendChild(hitbox_input);


    var map = document.createElement('div');
        map.innerText = 'Unlock map: ';
        CS_ui.appendChild(map);

    var map_input = document.createElement('span');
        map_input.innerText = 'off';
        map_input.style.pointerEvents = 'all';
        map_input.addEventListener('click', inputClick);
        map_input.addEventListener('click', function(){Main.renderFullMap = toBool(this.dataset.value)});
        map.appendChild(map_input);



    var minimap = document.createElement('div');
        minimap.innerText = 'Unlock minimap: ';
        CS_ui.appendChild(minimap);

    var minimap_input = document.createElement('span');
        minimap_input.innerText = 'off';
        minimap_input.style.pointerEvents = 'all';
        minimap_input.addEventListener('click', inputClick);
        minimap_input.addEventListener('click', function(){Main.UnlockMiniMap = toBool(this.dataset.value)});
        minimap.appendChild(minimap_input);


})();
