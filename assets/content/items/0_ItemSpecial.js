class ItemSpecial extends ItemUpgradeAble
{
	constructor()
	{
		super(true);
		
		this.type = TYPE.SPECIAL;
		this.slot = SLOT.SPECIAL;

		this.upgradeAble = false;
		// this.Grade = GRADE.NORMAL;
		this.enchantSlots = 1;
	}
}