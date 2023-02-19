class EnchantLock extends Item
{
	constructor()
	{
		super();

		this.stackAble = false;
		this.type = TYPE.ENCHANT;
		
		this.Texture = "enchantGemLock";
		this.name = "ITEM.ENCHANT.LOCK.NAME";
		this.shineStrength = 0;
		this.Grade = GRADE.NORMAL;

		this.bonus = null;

	}
}
ItemHelper.InitializeItem(EnchantLock);