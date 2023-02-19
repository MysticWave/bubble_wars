class Drive1 extends ItemUpgradeAble
{
	constructor()
	{
		super(true);
		
		this.type = TYPE.DRIVE;
		this.slot = SLOT.DRIVE;
		
		this.Texture = "item.drive1";
		this.name = "Drive I";
		this.enchantSlots = 1;

		this.primary = 
		[
			new ItemBonus(STAT.MOVEMENT_SPEED, 10)
			// new ItemBonus(STAT.ACCELERATION, acc)
		];
	
		this.Model = new ItemModel("driveBase", 81, 31, 2, 0, -42);
	}
}
// ItemHelper.InitializeItem(Drive1);
