class SaveSelectionGUI
{
    static Open()
    {
        this.CtxList = {};
        this.PreviewList = {};
        this.SavesPreviews = {};
        this.PreviewWidth = 0;
        this.PreviewHeight = 0;

        this.saveSlots = 3;

        this.Dummies = [];
        this.isOpen = true;

        this.CreateList();
        this.OpenedAt = Main.ageInTicks;
    }

    static Close()
    {
        this.isOpen = false;
    }

    static Update()
    {
        if(!this.isOpen) return;
    }

    static Render()
    {
        if(!this.isOpen) return;

        for(var i in this.Dummies)
        {
            var _canvas = this.PreviewList[i];
            var _ctx = this.CtxList[i];
            var dummy = this.Dummies[i];

            _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
            dummy.Render(_ctx);
        }
    }


    static CreateList()
    {
        this.Dummies = {};
        var container = document.getElementById('saves');
            container.innerHTML = '';

        var delete_container = document.getElementById('saves_nav_bottom');
            delete_container.innerHTML = '';


        var canvas_width = getCssVariable('#save_selection_gui', '--save-block-canvas-width', true);
        var canvas_height = getCssVariable('#save_selection_gui', '--save-block-canvas-height', true);

        this.PreviewWidth = canvas_width;
        this.PreviewHeight = canvas_height;

        for(var i = 0; i < this.saveSlots; i++)
        {
            var gotSavedData = false;
            var save_id = "PLAYER_SAVE_"+i;
            var save = localStorage.getItem(save_id);

		    if(save && save != 'null' && isJSON(save))
            {
                var Dummy = new Player();
                    Dummy.LoadData(save);
                    Dummy.Update();
                    Dummy.Rotation = 180;
                    Dummy.Scale = 2;
                    Dummy.x = this.PreviewWidth / 2;
                    Dummy.y = this.PreviewHeight * .6;
                    Dummy.ChangeSkin(Dummy.Appearance.Skin);
                this.Dummies[i] = Dummy;

                gotSavedData = true;
            }

            var save_container = document.createElement('div');
                save_container.className = 'save';
                if(!gotSavedData) 
                {
                    save_container.className +=' empty';
                    save_container.innerText = Lang.Get('SAVE_SLOT.EMPTY');
                }
                save_container.dataset.save = save_id;
                save_container.addEventListener('click', function()
                {
                    if(Main.ageInTicks <= SaveSelectionGUI.OpenedAt + Main.FPS/2) return;

                    Main.SaveSlot = this.dataset.save;
                    Menu.Transition(function()
                    {
                        InGame.Run();
                        World.Initialize();
                        World.Player.Load();
                    });
                });

            var preview = document.createElement('canvas');
                preview.className = 'preview';
                preview.width = canvas_width;
                preview.height = canvas_height;
                save_container.appendChild(preview);

            this.PreviewList[i] = preview;
            this.CtxList[i] = preview.getContext('2d');

            var info = document.createElement('div');
                info.className = 'info';
                save_container.appendChild(info);

            var div = document.createElement('div');
                div.innerText = Lang.Get('MENU.LOADING.READY');
                div.className = 'start';
                info.appendChild(div);

            if(gotSavedData)
            {
                var data = 
                {
                    'LOCATION': World.LocationList[Dummy.startLocation]?.Name,
                    'STAT.LEVEL': Dummy.stats.Level,
                    'DIFFICULTY': Dummy.Difficulty == 0 ? 'DIFFICULTY.EASY.NAME' : Dummy.Difficulty == 1 ? 'DIFFICULTY.MEDIUM.NAME' : 'DIFFICULTY.HARD.NAME'
                };

                for(var j in data)
                {
                    var div = document.createElement('div');
                        div.innerText = Lang.Get(j) + ': ' + Lang.Get(data[j]);
                    info.appendChild(div);
                }
            }

            container.appendChild(save_container);




            var delete_icon = document.createElement('div');
                delete_icon.className = 'delete icon';
                delete_icon.dataset.icon = 'icon_trash';
                if(gotSavedData)
                {
                    delete_icon.dataset.save = save_id;
                    delete_icon.addEventListener('click', function()
                    {
                        if(Main.ageInTicks <= SaveSelectionGUI.OpenedAt + Main.FPS/2) return;

                        UI_Helper.showConfirm('SAVE_SLOT.DELETE', 'CONFIRM.YES', 'CONFIRM.NO', ()=>{localStorage.setItem(this.dataset.save, null); SaveSelectionGUI.CreateList()});    
                    });
                }
                else
                {
                    delete_icon.style.opacity = 0;
                }
                delete_container.appendChild(delete_icon);
        }
    }
}