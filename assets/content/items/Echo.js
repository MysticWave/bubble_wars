class TheEcho extends ItemWeapon
{
	constructor()
	{
		super(true);
		
		this.type = TYPE.CANNON;
		
		this.Texture = "item.bubbleCannon1";
		this.name = "ITEM.THE_ECHO.NAME";
		this.enchantSlots = 3;

		this.BulletType = 'BulletEcho';

		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 10),
			new ItemBonus(STAT.ATTACK_SPEED, 4)
		];

        this.isUnique = true;
		this.ammoCost = 20;

        // this.BULLET_SERIES = 4;
        this.BULLET_SERY_DELAY = 5;
	
		this.Model = new ModelCannonBase('model.item.bubbleCannon1');
	}

    GetAdditionalBulletStats()
    {
        var s = super.GetAdditionalBulletStats();
        s.spd = 1100;
        s.Scale = 10;
        s.Bounce = 1;
        s.Pierce = 5;

        return s;
    }
}
ItemHelper.InitializeItem(TheEcho);