class KnowledgeGUI
{
    static Open()
    {
        this.isOpen = true;

        this.CreateLocationList();
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
    }


    static ShowLocationInfo(id)
    {
        var container = document.getElementById('knowledge_location_info');
            container.innerHTML = '';

        document.getElementById('knowledge_location_list').querySelectorAll('.item').forEach(e => e.dataset.selected = 'false');
        document.getElementById('knowledge_location_list').querySelector('.item[data-id="'+id+'"]').dataset.selected = 'true';

        var locations = World.LocationList;
        var locationInfo = World.Player.locationInfo;
        var location = locations[id];

        if(!location) return;
        if(!locationInfo[id].isCleared) return;

        if(!locationInfo[id].gotKnowledge) this.ShowBuyInfo(container, id);
        else this.ShowInfo(container, id);        
    }

    static GetKnowledgePrice(id)
    {
        var base_price = 1000;

        var locationsId = getLocationOrder(true);
        var index = locationsId.indexOf(id);

        return base_price * index;
    }

    static BuyKnowledge(id)
    {
        var price = this.GetKnowledgePrice(id);

        if(World.Player.coins >= price)
        {
            World.Player.coins -= price;
            World.Player.locationInfo[id].gotKnowledge = true;
            Save();

            this.ShowLocationInfo(id);
        }
    }

    static ShowBuyInfo(container, id)
    {
        var button = document.createElement('div');
            button.className = 'buy_knowledge';
            button.dataset.id = id;
            button.addEventListener('click', function(){KnowledgeGUI.BuyKnowledge(this.dataset.id)});

        var icon = document.createElement('div');
            icon.className = 'icon';
            icon.dataset.icon = 'knowledge';

        var title_container = document.createElement('div');
            title_container.className = 'title_container';
        
        var title = document.createElement('div');
            title.className = 'button_title';
            title.innerText = Lang.Get('MENU.KNOWLEDGE.UNLOCK');

        var price = document.createElement('div');
            price.className = 'price';
            price.innerText = Lang.Get('MENU.KNOWLEDGE.PRICE', {price: Style.DottedText(this.GetKnowledgePrice(id))});;

        button.appendChild(icon);
        button.appendChild(title_container);

        title_container.appendChild(title);
        title_container.appendChild(price);

        container.appendChild(button);
    }

    static UpdatePreviews()
    {
        document.querySelectorAll('#knowledge_location_info .preview .image_container').forEach(e => 
        {
            var id = e.dataset.entityid;
            var entity = KnowledgeGUI.Entities[id];
            if(!entity) return;

            if(entity.Model) entity.Model.Update();

            var _canvas = e.querySelector('canvas');
            var _ctx = _canvas.getContext('2d');

            _ctx.clearRect(0, 0, _canvas.width, _canvas.height);

            entity.Render(_ctx);
        });
    }


    static ShowInfo(container, id)
    {
        var locations = getLocationOrder(false, {VILLAGE: true});
        var locationsId = getLocationOrder(true, {VILLAGE: true});
        var locationInfo = World.Player.locationInfo;

        var location = locations[locationsId.indexOf(id)];
        var entities = location.RoomInfo.EntityTypes;
        var bosses = location.RoomInfo.BossTypes;
        var entityList = World.EntityList;

        var rank = locationInfo[id].rank ?? 'F';

        var rank_color = 'var(--color-rank-' + (rank.replace('+', '').replace('-', '').toLowerCase()) + ')';

        KnowledgeGUI.Location = id;
        KnowledgeGUI.Entities = [];

        var content = document.createElement('div');
            content.className = 'content';

        var title = document.createElement('div');
            title.className = 'title';

        var title_name = document.createElement('span');
            title_name.className = 'text-stroke-2';
            title_name.innerText = Lang.Get(location.Name);

        var grade = document.createElement('span');
            grade.className = 'grade';
            grade.innerText = rank;
            grade.style.setProperty('color', rank_color)

        title.appendChild(title_name);
        title.appendChild(grade);


        var preview_container = document.createElement('div');
            preview_container.className = 'preview';

        for(var i in entities)
        {
            var entity = new entityList[entities[i]]();
                entity.setLevel(getLocationLevel(KnowledgeGUI.Location));

            KnowledgeGUI.Entities.push(entity);
            
            var icon_img = Graphic.createEntityPreview(entity);

            var image_container = document.createElement('div');
                image_container.className = 'image_container';
                image_container.dataset.entityid = i;
                image_container.dataset.current = 'false';
                image_container.addEventListener('click', function()
                {
                    document.querySelectorAll('#knowledge_location_info .preview .image_container').forEach(e => 
                    {
                        e.dataset.current = 'false';
                    });

                    this.dataset.current = 'true';
                    KnowledgeGUI.showEntityInfo(this.dataset.entityid);
                });
            if(i == 0) image_container.dataset.current = 'true';

            image_container.appendChild(icon_img);
            preview_container.appendChild(image_container);
        }

        for(var j in bosses)
        {
            var entity = new entityList[bosses[j]]();
                entity.setLevel(getLocationLevel(KnowledgeGUI.Location));
                entity.knowledgeBoss = true;
            
            KnowledgeGUI.Entities.push(entity);
            
            var icon_img = Graphic.createEntityPreview(entity);

            var image_container = document.createElement('div');
                image_container.className = 'image_container boss';
                image_container.dataset.entityid = (j*1)+(i*1)+1;
                image_container.dataset.current = 'false';
                image_container.addEventListener('click', function()
                {
                    document.querySelectorAll('#knowledge_location_info .preview .image_container').forEach(e => 
                    {
                        e.dataset.current = 'false';
                    });

                    this.dataset.current = 'true';
                    KnowledgeGUI.showEntityInfo(this.dataset.entityid);
                });

            image_container.appendChild(icon_img);
            preview_container.appendChild(image_container);
        }




        var entity_info_container = document.createElement('div');
            entity_info_container.id = 'enemy_info_container';



        content.appendChild(title);
        content.appendChild(preview_container);
        content.appendChild(entity_info_container);

        container.appendChild(content);


        DraggableScroll.Init(document.querySelector('#enemy_info_container'), {accY: .1});
        this.showEntityInfo(0);
    }

    static showEntityInfo(id)
    {
        // var entityList = World.EntityList;
        // var entity = new entityList[id]();
        //     entity.setLevel(getLocationLevel(KnowledgeGUI.Location));
        var entity = KnowledgeGUI.Entities[id];

        var container = document.getElementById('enemy_info_container');
            container.innerHTML = '';

        if(!entity) return;

        var display_name = entity.getDisplayName() ?? "";
        if(entity.isBoss || entity.knowledgeBoss) display_name = '[BOSS] ' + display_name;

        var lootTable = entity.LootTable?.itemList ?? [];

        var name = document.createElement('div');
            name.className = 'name text-stroke';
            name.innerText = display_name;

        var level_container = document.createElement('div');
            level_container.className = 'level text-stroke';

        var level = document.createElement('span');
            level.innerText = Lang.Get('MENU.KNOWLEDGE.LEVEL', {LEVEL: entity.level});

        var xp = document.createElement('span');
            xp.innerText = Lang.Get('MENU.KNOWLEDGE.XP', {XP: Oxygen.GetOxygenValue(entity.getOxygen(), World.Player.stats.Level, entity.level, entity.isBoss)});

        var section_top = document.createElement('div');
            section_top.className = 'section_top text-stroke';

        var hp_stat_container = document.createElement('div');
            hp_stat_container.className = 'stat';

        var hp_icon = document.createElement('div');
            hp_icon.className = 'icon';
            hp_icon.dataset.icon = 'heart';

        var hp = document.createElement('div');
            hp.innerText = Style.DottedText(entity.MAXHP);

        var description = document.createElement('div');
            description.className = 'description text-stroke';
            description.innerText = entity.getDescription() ?? '';

        var drop_list = document.createElement('div');
            drop_list.className = 'drop_list';

        var drop_items = [new LootTableItemData('ItemOxygen')].concat(lootTable);

        for(var i in drop_items)
        {
            var item_id = drop_items[i].Type;
            var item = ItemHelper.getInstanceOfItem(item_id, {Grade: GRADE.NORMAL, count: 1});
            if(item_id == 'ItemOxygen') item = ItemHelper.getInstanceOfItem(item_id, {Grade: GRADE.NORMAL, count: entity.getOxygen()*2});

            var slot = InventoryGUI.getEmptyInventorySlot();
                slot.dataset.item = item_id;
                slot.style.setProperty('--order', i)
                slot.addEventListener('mousemove', function()
                {
                    if(!KnowledgeGUI.showingItem)
                    {
                        KnowledgeGUI.showingItem = ItemHelper.getInstanceOfItem(this.dataset.item, {Grade: GRADE.NORMAL, count: 1});
                    }
                    ItemInfo.Show(KnowledgeGUI.showingItem);
                });
                slot.addEventListener('mouseout', function()
                {
                    KnowledgeGUI.showingItem = false;
                    InventoryGUI.clearHighlights(this);
                });

            InventoryGUI.UpdateSlot(slot, item);

            drop_list.appendChild(slot);
        }

        
        level_container.appendChild(level);
        level_container.appendChild(xp);

        hp_stat_container.appendChild(hp_icon);
        hp_stat_container.appendChild(hp);

        section_top.appendChild(name);
        section_top.appendChild(level_container);
        section_top.appendChild(hp_stat_container);

        container.appendChild(section_top);
        container.appendChild(description);
        container.appendChild(drop_list);
    }


    static CreateLocationList()
    {
        var container = document.getElementById('knowledge_location_list');
            container.innerHTML = '';

        var location, id, cleared;
        var locations = getLocationOrder(false, {VILLAGE: true});
        var locationsId = getLocationOrder(true, {VILLAGE: true});
        var locationInfo = World.Player.locationInfo;

        for(var i in locationsId)
        {
            id = locationsId[i];
            location = locations[i];

            cleared = locationInfo[id].isCleared;

            var item = document.createElement('div');
                item.className = 'item';
                item.innerText = location.GetDisplayName();
                item.dataset.id = id;
                item.addEventListener('click', function(){KnowledgeGUI.ShowLocationInfo(this.dataset.id)});

            if(!cleared)
            {
                item.innerText = '???';
                item.dataset.locked = 'true';
            }

            container.appendChild(item);
        }



        this.ShowLocationInfo(locationsId[0]);
    }
}