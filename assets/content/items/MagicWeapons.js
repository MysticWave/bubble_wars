class Icicle1 extends ItemWeapon
{
	constructor()
	{
		super(true);

		this.type = TYPE.CANNON;
		
		this.Texture = "projectile.frost_ball";
		this.name = 'ITEM.ICICLE.1.NAME';
		this.enchantSlots = 2;


		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 1),
			new ItemBonus(STAT.ATTACK_SPEED, 0.5)
		];

		// this.Description = 'ITEM.ROCKET_LAUNCHER.SPARK.DESCRIPTION';
		// this.Lore = "ITEM_BUBBLE_TERMINATOR_LORE";
	
		this.Model = new ModelMagicSphere('projectile.frost_ball', 0, .6, -0.15, .75);
        this.ChargeDescription = 'ITEM.SLOWING.DESCRIPTION';

		this.shootBeforeCharge = false;
		this.requiredMP = 40;
		this.ammoCost = 40;

        this.BulletType = 'BulletFrostBall';
        this.chargeBullets = 2;
		this.canIncreaseChargeBulletCount = true;

        this.SlowStrength = 25;
        this.SlowDuration = 5;

		this.Charged = 
		{
			// damage: {min: 1, max: 33},
			AD: 10,
			criticalChance: 0,
			criticalDamage: 0,
			element: ELEMENT.ICE
		};

        this.ARGS = {SLOW_S: this.SlowStrength, SLOW_D: this.SlowDuration};
	}

    GetAdditionalBulletStats()
    {
        var s = super.GetAdditionalBulletStats();
        s.spd = 300;
        s.Scale = 2;
        s.Bounce = 1;
        s.SlowDuration = this.SlowDuration;
        s.SlowStrength = this.SlowStrength

        return s;
    }

	GetBulletDamageInfo(owner = this.Owner)
    {
		if(!this.isChargedShot) return super.GetBulletDamageInfo(owner);
		return this.Charged;
    }
}
ItemHelper.InitializeItem(Icicle1);