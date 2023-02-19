class BubbleTerminator extends ItemWeaponLaser
{
	constructor()
	{
		super(true);

		this.type = TYPE.CANNON;
		
		this.Texture = "ShadowScythe";
		this.name = "MD Bubble Terminator 3000";
		this.enchantSlots = 3;

		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 20),
			new ItemBonus(STAT.DURATION, 120),
			new ItemBonus(STAT.COOLTIME, 60),
			new ItemBonus(STAT.ATTACK_RANGE, 3000)
			// new ItemBonus(STAT.MAX_HP, [10, 20, 30, 40, 50], true, true),
		];

		this.Lore = "ITEM_BUBBLE_TERMINATOR_LORE";
	
		this.Model = new ModelCannonBase('model.item.bubbleCannon1');
	}
}
ItemHelper.InitializeItem(BubbleTerminator);