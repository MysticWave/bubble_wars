class Merchant extends EntityVillageNPC
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = Lang.Translate('NPC_MERCHANT_NAME');

		this.SPD = 100;
		
		this.AI.Apply(new AI_TradeAble(this));

		this.startDialog = 'MerchantTest';
		this.setScale(1);
	}

	onTrade()
	{
		this.inventory = [];

		var itemList = ItemHelper.GetItemsInLocationOrder('WEAPON');
		this.addItemToInventory(new LiquidOxygen(), 100, true);

		for(var i = 0; i < itemList.length; i++)
		{
			var item = Item.Get(itemList[i]);
			if(item.enchantAble) item.Enchant(new EnchantLock());
			item.Grade = GRADE.NORMAL;

			this.addItemToInventory(item, 1, true);
		}
	}
}
World.RegisterEntity(Merchant);



