class BoomerangBase extends ItemWeaponBoomerang
{
	constructor()
	{
		super(true);

		this.type = TYPE.BOOMERANG;
		
		this.Texture = "ShadowScythe";
		this.name = "Boomerang 1";
		this.enchantSlots = 2;

		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 40),
            new ItemBonus(STAT.ATTACK_SPEED, 1),
            new ItemBonus(STAT.CR, 10),
			new ItemBonus(STAT.ATTACK_RANGE, 1500)
		];

		this.Lore = "ITEM_BUBBLE_TERMINATOR_LORE";
	
		this.Model = new ModelCannonBase('model.item.bubbleCannon1');
	}

    canIncreaseBulletsCount()
    {
        return true;
    }
}
ItemHelper.InitializeItem(BoomerangBase);




class TheStick extends BoomerangBase
{
	constructor()
	{
		super(true);

        this.BulletType = "BulletBambooStick";

		this.Texture = "item.bamboo_stick";
		this.name = "ITEM.BAMBOO_STICK.NAME";
		this.enchantSlots = 3;

		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 1),
            new ItemBonus(STAT.ATTACK_SPEED, 2.5),
            new ItemBonus(STAT.ATTACK_RANGE, 650)
		];

		this.Lore = "ITEM.BAMBOO_STICK.LORE";
        this.Description = ['ITEM.BAMBOO_STICK.DESCRIPTION'];
	
		this.Model = new ModelBoomerangBase('item.bamboo_stick', 0, 1.75, -.5, -.2);

        this.requiredMP = 400;
        this.MPgain = 'HIT';
		this.knockBack = .5;
	}

    onSpecialCharge()
    {
        this.lastProjectile.isCharged = true;
    }
}
ItemHelper.InitializeItem(TheStick);




