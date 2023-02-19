class AI_TradeAble
{
	constructor(owner, slots = 63)
	{
		this.name = "TradeAble";
		this.Owner = owner;

		owner.inventory = [];
		owner.transactionValue = 0;
		if(!owner.stats) owner.stats = {};
		owner.stats.availableSlots = slots;

		for(var i = 0; i < owner.stats.availableSlots; i++)
		{
			owner.inventory[i] = null;
		}

		owner.addItemToInventory = this.addItemToInventory;
		owner.Buy = this.Buy;
		owner.Sell = this.Sell;
		owner.sellCountable = this.sellCountable;
		owner.Trade = this.Trade;
		owner.endTrade = this.endTrade;
	}

	Trade()
	{
		this?.onTrade();
		this.isTrading = true;
		World.Player.interactionWith = this;

		this.transactionValue = 0;
	}

	endTrade()
	{
		this.isTrading = false;
		World.Player.interactionWith = null;

		if(this.transactionValue)
		{
			//particles
		}
	}

	Update(owner)
	{
		if(owner.isTrading)
		{
			owner.allowMove = false;
			owner.moveX = 0;
			owner.moveY = 0;
			if(owner.allowRotationChange) owner.Rotation = MathHelper.getAngle2(owner, World.Player)+90;
		}
	}

	Buy(item, itemOwner, fromHand = true, count = 0)
	{
		if(!item) return;
		if(!item.canBeSold) return;

		count = count || item.count;

		if(fromHand)
		{
			itemOwner.hand.count -= count;
			if(itemOwner.hand.count == 0) itemOwner.hand = null;
		}

		var priceInfo = ItemHelper.GetItemPrice(item, count);
		itemOwner.coins += priceInfo.sell;

		var new_item = ItemHelper.CopyItem(item);
			new_item.isInShop = true;
			new_item.count = count;

		this.addItemToInventory(new_item);

		this.transactionValue += priceInfo.sell;
	}

	Sell(slot, newOwner, toHand = false, count = 0)
	{
		var item = this.inventory[slot];
		if(!item) return;

		count = count || item.count;

		var price = ItemHelper.GetItemPrice(item, count).buy;
		if(newOwner.coins < price) return;


		var new_item = ItemHelper.CopyItem(item);
			new_item.isInShop = false;
			new_item.isFromMerchant = false;
			new_item.count = count;


		if(toHand)
		{
			newOwner.hand = new_item;
		}
		else
		{
			newOwner.addItemToInventory(new_item);
		}
		
		//only items from merchant are infinite
		if(!item.isFromMerchant)
		{
			this.inventory[slot].count -= count;
			if(this.inventory[slot].count == 0) this.inventory[slot] = null;
		}


		if(isNaN(price)) return;
		newOwner.coins -= price;

		this.transactionValue += price;
	}

	addItemToInventory(item, count = 0, fromMerchant = false)
	{
		if(typeof item === 'string')
		{
			//podano nazwe przedmiotu, a nie przedmiot
			item = Item.Get(item);
		}

		if(!item) return;
		item.count = count || item.count;
		if(fromMerchant) item.isFromMerchant = true;

		var stacked = false;

		if (item != null)
		{
			item.showNewItemInfo = false;
			
			for (var i = 0; i < this.stats.availableSlots; i++)
			{
				if (this.inventory[i] != null)
				{				//w danym slocie znajduje sie przedmiot
					if (item.constructor.name == this.inventory[i].constructor.name)
					{		//item from merchant cannot be stacked with ones sold by player
						if (item.stackAble && !this.inventory[i].isFromMerchant)
						{
							if (this.inventory[i].count < this.inventory[i].maxStackSize)
							{
								if ((this.inventory[i].count + item.count) <= this.inventory[i].maxStackSize)
								{
									this.inventory[i].count += item.count;
									this.inventory[i].showNewItemInfo = true;
									stacked = true;
									break;
								}
								else
								{
									this.inventory[i].count += item.count;
									item.count = Math.abs(this.inventory[i].count - this.inventory[i].maxStackSize);
									this.inventory[i].count = this.inventory[i].maxStackSize;
									continue;
								}
							}
						}
					}
				}
			}


			if (!stacked)
			{
				for (var i = 0; i < this.stats.availableSlots; i++)
				{
					if (this.inventory[i] == null)
					{		//wartosc w inventory jest pusta
						this.inventory[i] = item;
						break;
					}
				}
			}
		}
	}
}