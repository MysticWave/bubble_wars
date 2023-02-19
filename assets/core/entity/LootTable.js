class LootTable
{
	/**
	 * 
	 * @param {Array} itemList Array of LootTableItemData
	 */
	constructor(itemList = [])
	{
		this.itemList = itemList;
	}

	GetItem()
	{
		for(var i = 0; i < this.itemList.length; i++)
		{
			var ItemData = this.itemList[i];

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

					return item;
				}
			}
		}

		return null;
	}
}

class LootTableItemData
{
	/**
	 * 
	 * @param {Item} type Type of item
	 * @param {Number} chance Chance of drop in %
	 * @param {Number} min Minimal count
	 * @param {Number} max Maximal count
	 */
	constructor(type, chance = 0, min = 1, max)
	{
		if(typeof type === "function")
		{
			type = type.name;
		}
		this.Type = type;
		this.Chance = chance;
		this.Min = min;
		this.Max = max ?? min;
	}
}