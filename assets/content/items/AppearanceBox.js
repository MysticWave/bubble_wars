class RandomAppearanceBox extends Item
{
	constructor()
	{
		super();

		this.stackAble = false;
		this.upgradeAble = false;
		this.enchantAble = false;

        this.type = TYPE.APPEARANCE_BOX;

		this.Texture = 'item.appearance_box.unknown';
        this.name = "ITEM.APPEARANCE_BOX.NAME";

        this.Grade = GRADE.LEGENDARY;
        this.showGrade = false;
        this.canBeSold = false;
		
        this.Description = 'ITEM.APPEARANCE_BOX.DESCRIPTION';
	}

    getAvailableSkins()
    {
        var all = Player.Skins;
        var owned = World.Player.Appearance.AvailableSkins;
        var available = [];

        for(var name in all)
        {
            if(owned[name]) continue;

            var id = name.replace('Skin', '');
            var appearance_box = Item.Get(id+'AppearanceBox');
            if(appearance_box) available.push(name);
        }

        for(var i in World.Player.inventory)
        {
            var item = World.Player.inventory[i];
            if(!item) continue;
            if(item.type != TYPE.APPEARANCE_BOX) continue;

            var index = available.indexOf('Skin'+item.Skin);
            if(index != -1) available.splice(index, 1)
        }

        return available;
    }

    getDescription()
	{
        var available = this.getAvailableSkins();
        if(available.length == 0)
        {
            return ['Cannot be used.'];
        }

        var desc = Lang.Get(this.Description);
        for(var i in available)
        {
            var skin = available[i];
            var id = skin.replace('Skin', '');
            var appearance_box = Item.Get(id+'AppearanceBox');
            if(!appearance_box) continue;

            desc += '\n-'+appearance_box.getDisplayName();
        }

        return desc.split('\n');
	}

	onUse(player)
	{
        var available = this.getAvailableSkins();
        if(available.length == 0) return;

        var skin = available[MathHelper.randomInRange(0, available.length-1)];

        var id = skin.replace('Skin', '');
        var appearance_box = Item.Get(id+'AppearanceBox');
        if(!appearance_box) return;

        player.addItemToInventory(appearance_box);

        this.count--;

		if(this.count <= 0)
		{
			var index = player.inventory.indexOf(this);
			if(index > -1) player.inventory[index] = null;
		}

        Save();
	}
}
ItemHelper.InitializeItem(RandomAppearanceBox);



class AppearanceBox extends RandomAppearanceBox
{
	constructor(type = '', name = null)
	{
		super();
		this.Texture = 'item.appearance_box.'+type.toLowerCase();
        this.name = "ITEM.APPEARANCE_BOX.FIXED.NAME";
		
        this.Description = "ITEM.APPEARANCE_BOX.FIXED.DESCRIPTION";
        this.Skin = type;

        if(!name) name = type.toUpperCase().replace('SKIN', '');
        this.ARGS = {TYPE: Lang.Get('SKIN.'+name+'.NAME')};
	}

    getDescription()
	{
        return Lang.Get(this.Description, this.ARGS).split('\n');
	}

	onUse(player)
	{
		player.Appearance.AvailableSkins['Skin'+this.Skin] = true;

        var index = player.inventory.indexOf(this);
        if(index > -1) player.inventory[index] = null;
        Save();
	}
}
ItemHelper.InitializeItem(AppearanceBox);



class KitsuneAppearanceBox extends AppearanceBox
{
	constructor(){super('Kitsune');}
}
ItemHelper.InitializeItem(KitsuneAppearanceBox);

class KitsuneAngelicAppearanceBox extends AppearanceBox
{
	constructor(){super('KitsuneAngelic', 'KITSUNE.ANGELIC');}
}
ItemHelper.InitializeItem(KitsuneAngelicAppearanceBox);



class ReaperAppearanceBox extends AppearanceBox
{
	constructor(){super('Reaper');}
}
ItemHelper.InitializeItem(ReaperAppearanceBox);
