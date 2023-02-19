class QuestLine
{
    constructor()
    {
        this.requiredLevel = 0;
        this.requiredQuest = null;

        this.name = 'QUEST';
        this.Description = '';
        this.Icon = 'quest';
        this.NPC = null;
        this.dialogLine = this.constructor.name;
        this.dialogLineComplete = this.dialogLine+'Complete';
    }

    getDisplayName(isComplete = false)
    {
        var name = Lang.Get(this.name);
        if(isComplete) name += ' ('+Lang.Get('QUEST.COMPLETE')+')';

        return name;
    }

    getDescription()
    {
        return Lang.Get(this.Description);
    }

    getId()
    {
        return this.constructor.name.toUpperCase();
    }

    isCompleted()
    {
        return World.Player.QuestData[this.getId()]?.complete;
    }

    checkForCompletion()
    {
        return false;
    }

    Update()
    {
        if(this.isCompleted()) return;
    }

    isAvailable()
    {
        if(this.isActive()) return false;
        if(this.requiredQuest) 
            if(!World.Player.QuestData[this.requiredQuest.toUpperCase()]?.complete) return false;

        return (World.Player.stats.Level >= this.requiredLevel);
    }

    isActive()
    {
        return World.Player.QuestData[this.getId()]?.active;
    }


    Activate()
    {
        if(!this.isAvailable()) return;

        World.Player.QuestData[this.getId()] = new QuestData();
        Save();
    }


    Complete()
    {
        World.Player.QuestData[this.getId()].complete = true;

        this.GetReward();

        Save();
    }

    GetProgress(){return 0;}

    GetReward()
    {

    }

    CheckEntityDeath(entityId, entity)
    {

    }
}






class QuestLineFindItem extends QuestLine
{
    constructor()
    {
        super();

        this.requiredItem = '';
        this.Chance = 100;
        this.EntityList = [];
        this.WholeLocation = '';
    }

    checkForCompletion()
    {
        if(World.Player.haveItemInInventory(this.requiredItem) > -1) return true;

        return super.checkForCompletion();
    }

    CheckEntityDeath(entity)
    {
        var id = entity.constructor.name;
        if(this.WholeLocation) 
            this.EntityList = get(World, 'LocationList.'+this.WholeLocation+'.RoomInfo.EntityTypes').concat(get(World, 'LocationList.'+this.WholeLocation+'.RoomInfo.BossTypes'));
        
        if(this.EntityList.indexOf(id) == -1) return;
        
        if(MathHelper.GetChance(this.Chance))
        {
            var item = Item.Get(this.requiredItem);

            World.AddEntity(new EntityItem(item, entity.x, entity.y));
        }
    }

    Complete()
    {
        var slot_id = World.Player.haveItemInInventory(this.requiredItem);
        World.Player.inventory[slot_id] = null;

        super.Complete();
    }
}




class QuestList
{
    static Init(quest)
    {
        if(!this.List) this.List = {};

        var id = quest.name.toUpperCase();
        this.List[id] = new quest();
    }

    static Accept(id)
    {
        id = id.toUpperCase();
        if(!this.List[id]) return;

        this.List[id].Activate();
    }

    static Complete(id)
    {
        id = id.toUpperCase();
        if(!this.List[id]) return;

        this.List[id].Complete();
    }

    static GetAvailableQuests(npc_id = null)
    {
        if(npc_id) npc_id = npc_id.toUpperCase();
        var available = [];
        for(var i in this.List)
        {
            var quest = this.List[i];
            if(quest.isAvailable()) 
            {
                if(!npc_id || quest.NPC == npc_id) available.push(quest);
            }
        }

        return available;
    }

    static GetQuestsToComplete(npc_id = null)
    {
        if(npc_id) npc_id = npc_id.toUpperCase();

        var to_complete = [];
        for(var i in this.List)
        {
            var quest = this.List[i];
            if(!quest.isCompleted() && quest.isActive() && quest.checkForCompletion()) 
            {
                if(!npc_id || quest.NPC == npc_id) to_complete.push(quest);
            }
        }

        return to_complete;
    }

    static GetCompletedQuests(npc_id = null)
    {
        if(npc_id) npc_id = npc_id.toUpperCase();

        var completed = [];
        for(var i in this.List)
        {
            var quest = this.List[i];
            if(quest.isCompleted()) 
            {
                if(!npc_id || quest.NPC == npc_id) completed.push(quest);
            }
        }

        return completed;
    }


    static GetActiveQuests(npc_id = null)
    {
        if(npc_id) npc_id = npc_id.toUpperCase();

        var active = [];
        for(var i in this.List)
        {
            var quest = this.List[i];
            if(!quest.isCompleted() && quest.isActive()) 
            {
                if(!npc_id || quest.NPC == npc_id) active.push(quest);
            }
        }

        return active;
    }

    static CheckEntityDeath(entity)
    {
        var quest_to_check = this.GetActiveQuests();

        for(var i in quest_to_check)
        {
            var quest = quest_to_check[i];
                quest.CheckEntityDeath(entity);
        }
    }



    static CreateList()
    {
        var container = document.getElementById('quest_list');
            container.innerHTML = '';

        var active = this.GetActiveQuests();
        var completed = this.GetCompletedQuests();

        var list = active.concat(completed);
        for(var i in list)
        {
            var quest = list[i];
            var progress = quest.GetProgress();
            var completed = quest.isCompleted();
            var img = TextureManager.Get(quest.Icon);
            if(completed) progress = 100;

            var item = document.createElement('div');
                item.className = 'item';
                item.dataset.completed = completed;
            
            var icon = document.createElement('div');
                icon.className = 'icon';
                icon.dataset.icon = quest.Icon;

            var title = document.createElement('div');
                title.className = 'quest_title';
                title.innerText = quest.getDisplayName();

            var description = document.createElement('div')
                description.className = 'quest_description';
                description.innerHTML = quest.getDescription();

            var quest_bar = document.createElement('div');
                quest_bar.className = 'progress_bar';
                quest_bar.style.setProperty('--progress', progress+'%');

            var quest_bar_bg_container = document.createElement('div');
                quest_bar_bg_container.className = 'progress_bar_background_container';

            var quest_bar_bg = document.createElement('div');
                quest_bar_bg.className = 'progress_bar_background bubble-progress';

            item.appendChild(icon);
            item.appendChild(title);
            item.appendChild(description);
            item.appendChild(quest_bar);

            quest_bar.appendChild(quest_bar_bg_container);
            quest_bar_bg_container.appendChild(quest_bar_bg);

            container.appendChild(item);

            if(img.name != 'none')
            {
                var _img = document.createElement('img');
                _img.src = img.src;
                icon.appendChild(_img);
            }
        }
    }
}


class QuestData
{
    constructor()
    {
        this.complete = false;
        this.active = true;
    }
}