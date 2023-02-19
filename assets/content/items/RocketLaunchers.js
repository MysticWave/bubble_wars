class RocketLauncher1 extends ItemWeapon
{
	constructor()
	{
		super(true);

		this.type = TYPE.CANNON;
		
		this.Texture = "ShadowScythe";
		this.name = 'ITEM.ROCKET_LAUNCHER.1.NAME';
		this.enchantSlots = 2;


		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 20),
			new ItemBonus(STAT.ATTACK_SPEED, 0.75),
			new ItemBonus(STAT.ATTACK_RANGE, 800)
		];

		this.BulletType = 'BulletBubbleRocket';

		// this.Description = 'ITEM.ROCKET_LAUNCHER.SPARK.DESCRIPTION';
		// this.Lore = "ITEM_BUBBLE_TERMINATOR_LORE";
	
		this.Model = new ModelCannonBase('model.item.cannonBase');

		this.onUseKnockBack = 3;
		this.shootBeforeCharge = false;
		this.requiredMP = 30;
		this.ammoCost = 15;

		this.chargeBullets = 3;
		this.canIncreaseChargeBulletCount = true;

		this.Charged = 
		{
			// damage: {min: 1, max: 33},
			AD: 30,
			criticalChance: 0,
			criticalDamage: 0,
			element: ELEMENT.PHYSICAL
		};
	}

	onSpecialCharge()
	{
		this.nextShootData.BulletType = 'BulletRocketSmoke';
	}

	GetBulletDamageInfo(owner = this.Owner)
    {
		if(!this.isChargedShot) return super.GetBulletDamageInfo(owner);
		return this.Charged;
    }
}
ItemHelper.InitializeItem(RocketLauncher1);





















class SparkRocketLauncher extends ItemWeapon
{
	constructor()
	{
		super(true);

		this.type = TYPE.CANNON;
		
		this.Texture = "ShadowScythe";
		this.name = 'ITEM.ROCKET_LAUNCHER.SPARK.NAME';
		this.enchantSlots = 2;


		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 70),
			new ItemBonus(STAT.ATTACK_SPEED, 0.5),
			new ItemBonus(STAT.ATTACK_RANGE, 800)
		];

		// this.Description = 'ITEM.ROCKET_LAUNCHER.SPARK.DESCRIPTION';
		// this.Lore = "ITEM_BUBBLE_TERMINATOR_LORE";
	
		this.Model = new ModelCannonBase('model.item.cannonBase');

		this.onUseKnockBack = 3;
		this.shootBeforeCharge = false;
		this.requiredMP = 40;
		this.ammoCost = 50;

		this.Charged = 
		{
			// damage: {min: 1, max: 33},
			AD: 33,
			criticalChance: 0,
			criticalDamage: 0,
			element: ELEMENT.THUNDER
		};
	}

	onSpecialCharge()
	{
		this.nextShootData.BulletType = 'BulletRocketSpark';
	}

	GetBulletDamageInfo(owner = this.Owner)
    {
		if(!this.isChargedShot) return super.GetBulletDamageInfo(owner);
		return this.Charged;
    }
}
ItemHelper.InitializeItem(SparkRocketLauncher);