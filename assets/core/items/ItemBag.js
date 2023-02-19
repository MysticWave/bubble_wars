class ItemBag extends Item
{
	constructor(name)
	{
		super();

		this.stackAble = true;
		this.maxStackSize = 99;
		this.upgradeAble = false;
		this.enchantAble = false;
		this.Items = [];
		this.Texture = 'treasureBag';

		this.Grade = GRADE.LEGENDARY;
		this.showGrade = false;
		this.name = name;
		this.Description = 'ITEM.BAG.DESCRIPTION';
		this.canBeSold = false;

		this.showInBubble = false;
		this.onFloorScale = 2;
	}

	getDescription()
	{
        if(this.Items.length == 0)
        {
            return ['Cannot be used.'];
        }

        var desc = Lang.Get(this.Description);

        for(var i in this.Items)
        {
            var itemData = this.Items[i];
			var item = Item.Get(itemData.Type);
            if(!item) continue;

            desc += '\n-'+item.getDisplayName();
        }

		desc += '\n\n'+Lang.Get('ITEM.CLICK_TO_OPEN.RIGHT');

        return desc.split('\n');
	}

	onUse(player)
	{
		this.count--;

		for(var i = 0; i < this.Items.length; i++)
		{
			var ItemData = this.Items[i];
			if(MathHelper.GetChance(ItemData.Chance))
			{
				var count = MathHelper.randomInRange(ItemData.Min, ItemData.Max);

				var item = ItemHelper.getInstanceOfItem(ItemData.Type);
				if(item)
				{
					if(item.stackAble)
					{
						item.count = count;
					}

					var dir = (MathHelper.GetChance(50)) ? 1 : -1;

					item.Drop(player.x, player.y, null, dir);
				}
			}
		}

		if(this.count <= 0)
		{
			var index = player.inventory.indexOf(this);
			if(index > -1)
			{
				player.inventory[index] = null;
			}
		}
	}
}