class LiquidOxygen extends Item
{
	constructor()
	{
		super();

		this.stackAble = true;
		this.maxStackSize = 999;
		this.upgradeAble = false;
		this.enchantAble = false;

		this.Texture = 'item.liquid_oxygen';
        this.name = "ITEM.LIQUID_OXYGEN.NAME";
		
		this.price = 100;
		this.inShopPrice = 500;

		
        this.Description = 'ITEM.LIQUID_OXYGEN.DESCRIPTION';
		this.ARGS = {PRICE: Style.DottedText(this.price)};
	}

	onUse(player)
	{
		this.count--;

		player.coins += this.price;

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
ItemHelper.InitializeItem(LiquidOxygen);








class ItemOxygen extends Item
{
	constructor()
	{
		super();

		this.stackAble = true;
		this.maxStackSize = 999999;
		this.upgradeAble = false;
		this.enchantAble = false;

		this.Texture = 'item.oxygen';
        this.name = "ITEM.OXYGEN.NAME";
		
		this.showPriceInfo = false;
	}

	onUse(player)
	{
		this.count--;

		player.coins += 1;

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
ItemHelper.InitializeItem(ItemOxygen);

