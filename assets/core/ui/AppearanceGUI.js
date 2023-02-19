class AppearanceGUI
{
    static Open()
    {
        this.CtxList = {};
        this.PreviewList = {};
        this.SkinPreviews = {};
        this.PreviewWidth = 0;
        this.PreviewHeight = 0;

        this.ScrollToPosition = 0;
        this.isScrolling = false;
        this.ScrollDuration = .25;
        this.ScrollStart = 0;

        this.Dummy = new PlayerDummy(World.Player);

        this.isOpen = true;

        this.CreateSkinList();
    }

    static Close()
    {
        this.isOpen = false;
    }

    static Update()
    {
        if(!this.isOpen) return;

        this.Dummy.x = this.PreviewWidth / 2 + Camera.xView;
        this.Dummy.y = this.PreviewHeight * .65 + Camera.yView;
        this.Dummy.Appearance.Scale = 2;

        this.ScrollUpdate();

        var i = 0;
        var scroll = document.querySelector('#skins').scrollLeft;
        var step = this.GetSkinScrollStep();
        var s, pos, diff;
        var skins = document.querySelector('#skins').querySelectorAll('.skin');
        var current = -1;
        var lockLeft = false;
        var lockRight = false;

        skins.forEach(e => 
            {
                pos = step * (i-1);
                diff = Math.abs(scroll - pos);
                s = 1 - (diff / 2000);
                if(s < .8) s = .8;
                if(s > 1) s = 1;

                e.style.transform = 'scale('+s+')';
                
                var c = (World.Player.Appearance.Skin == e.dataset.id) ? 'true' : 'false';
                e.dataset.current = c;

                if(s >= .98) 
                {
                    e.dataset.selected = 'true';
                    AppearanceGUI.selected = e;
                    current = i;
                }
                else e.dataset.selected = 'false';

                i++;

                if(e.className.includes('empty')) return;

                var name = Lang.Get(AppearanceGUI.SkinPreviews[e.dataset.id]?.Name);

                this.PreviewList[e.dataset.id].dataset.variant = '-1';
                var variants = Player.Skins[e.dataset.id]?.Variants;

                if(variants && variants.length > 0)
                {
                    for(var j = -1; j < variants.length; j++)
                    {
                        var v = variants[j] || null;
                        var div = e.querySelector('.variant[data-variant="'+j+'"]');

                        div.dataset.current = 'false';
                        if(v)
                        {
                            if(World.Player.Appearance.Skin == v.name) 
                            {
                                div.dataset.current = 'true';
                                e.dataset.current = 'true';
                                this.PreviewList[e.dataset.id].dataset.variant = j;
                                name = Lang.Get(AppearanceGUI.SkinPreviews[v.name]?.Name);
                            }
                        }
                        else
                        {
                            div.dataset.current = c;
                        }
                    }
                }
                
                set(document.querySelector('.skin[data-id="'+e.dataset.id+'"] .nav_bottom'), 'innerText', name, true);
            });

        if(current == 1) lockLeft = true;
        if(current == i-2) lockRight = true;

        set('#appearance .slider_arrow.left', 'dataset.locked', lockLeft, true);
        set('#appearance .slider_arrow.right', 'dataset.locked', lockRight, true);
    }

    static Scroll(position, ignoreAnimation = false)
    {
        this.ScrollToPosition = position;
        this.isScrolling = true;
        this.ScrollStart = Main.ageInTicks;

        this.ScrollUpdate(ignoreAnimation);
    }

    static GetCurrentScrollPos()
    {
        var scroll = document.querySelector('#skins').scrollLeft;
        return Math.round(scroll / this.GetSkinScrollStep());
    }

    static GetSkinScrollStep()
    {
        return (getCssVariable('#appearance', '--skin-block-width', true) + 2 * (getCssVariable('#appearance', '--skin-block-margin', true))) * Settings.Video.UI_Scale / 100;
    }

    static ScrollUpdate(ignoreAnimation)
    {
        if(!this.isScrolling) return;

        var progress = (Main.ageInTicks - this.ScrollStart) / (Main.FPS * this.ScrollDuration);

        if(progress > 1) 
        {
            this.isScrolling = false;
            return;
        }

        var container = document.querySelector('#skins');
        if(progress == 0) this.scrollFrom = container.scrollLeft;

        var step_size = this.GetSkinScrollStep();
        var scrollTo = (this.ScrollToPosition -1) * step_size;
        var scrollDiff = this.scrollFrom - scrollTo;

        var p = 1 - Math.pow(1 - progress, 1.675);
        if(ignoreAnimation) p = 1;

        var new_pos = this.scrollFrom - (scrollDiff * p);
        container.scrollLeft = new_pos;

        if(new_pos == scrollTo)
        {
            this.isScrolling = false;
            return;
        }
    }

    static Render()
    {
        if(!this.isOpen) return;

        for(var name in this.PreviewList)
        {
            var skin_name = name;
            var _canvas = this.PreviewList[name];
            var _ctx = this.CtxList[name];

            if(_canvas.dataset.variant != '-1')
            {
                var s = Player.Skins[name]?.Variants[_canvas.dataset.variant];
                if(s) skin_name = s.name;
            }
            var skin = this.SkinPreviews[skin_name];

            _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
            skin.Render(_ctx, this.Dummy);
        }
    }

    static SkinListArrowsClick()
    {
        if(DraggableScroll.Scrolling) return;

        var pos = AppearanceGUI.GetCurrentScrollPos() + 1;
        var s = parseInt(this.dataset.step);
        pos += s;
        AppearanceGUI.Scroll(pos);
    }

    static ChangeSkinVariant()
    {
        var skin = Player.Skins[this.dataset.name];
        if(!skin) return;

        var variant = skin.Variants[this.dataset.variant];
        if(this.dataset.variant == -1) variant = skin;
        if(!variant) return;

        World.Player.ChangeSkin(variant.name);
    }

    static CreateSkinList()
    {
        var container = document.getElementById('skins');
            container.innerHTML = '';

        var list = document.createElement('span');
            list.id = 'skin_list';
            list.addEventListener('wheel', function(e)
            {
                var pos = AppearanceGUI.GetCurrentScrollPos() + 1;
                if(e.deltaY > 0) pos += 1;
                else pos -= 1;
                AppearanceGUI.Scroll(pos);
            });
            container.appendChild(list);

        var skins = Player.Skins;
        var available = World.Player.Appearance.AvailableSkins;

        var canvas_width = getCssVariable('#appearance', '--skin-block-canvas-width', true);
        var canvas_height = getCssVariable('#appearance', '--skin-block-canvas-height', true);

        this.PreviewWidth = canvas_width;
        this.PreviewHeight = canvas_height;
        var i = 1;
        var current = 0;

        var skin_container = document.createElement('div');
            skin_container.className = 'skin empty';
            list.appendChild(skin_container);

        for(var name in skins)
        {
            var variants = skins[name].Variants;
            var s = new skins[name](this.Dummy);
            this.SkinPreviews[name] = s;

            if(skins[name].isVariant) continue;
            if(World.Player.Appearance.Skin == name) current = i;

            skin_container = document.createElement('div');
                skin_container.className = 'skin';
                skin_container.dataset.index = i;
                skin_container.dataset.id = name;
                skin_container.addEventListener('click', function()
                {
                    if(DraggableScroll.Scrolling) return;
                    AppearanceGUI.Scroll(this.dataset.index*1);
                });
                skin_container.addEventListener('click', function()
                {
                    if(AppearanceGUI.isScrolling) return;
                    if(AppearanceGUI.selected != this) return;
                    if(this.dataset.current=='true') return;
                    
                    World.Player.ChangeSkin(this.dataset.id);
                });
                if(!available[name]) skin_container.dataset.locked = 'true';

            var nav_top = document.createElement('div');
                nav_top.className = 'nav_top';
                skin_container.appendChild(nav_top);

            if(variants && variants.length > 0)
            {
                for(var j = -1; j < variants.length; j++)
                {
                    var v = variants[j] || null;

                    var div = document.createElement('div');
                        div.className = 'variant';
                        div.dataset.variant = j;
                        div.dataset.name = name;
                        div.addEventListener('click', AppearanceGUI.ChangeSkinVariant);

                    nav_top.appendChild(div);

                    if(v)
                    {
                        if(World.Player.Appearance.Skin == v.name) current = i;
                    }
                    
                }
            }

            var preview = document.createElement('canvas');
                preview.className = 'preview';
                preview.width = canvas_width;
                preview.height = canvas_height;
                preview.dataset.variant = '-1';
                skin_container.appendChild(preview);

            this.PreviewList[name] = preview;
            this.CtxList[name] = preview.getContext('2d');

            var nav_bottom = document.createElement('div');
                nav_bottom.className = 'nav_bottom';
                nav_bottom.innerText = Lang.Get(s.Name);
                skin_container.appendChild(nav_bottom);

            list.appendChild(skin_container);
            i++;
        }

        skin_container = document.createElement('div');
            skin_container.className = 'skin empty';
            list.appendChild(skin_container);

        this.Scroll(current, true);
    }
}