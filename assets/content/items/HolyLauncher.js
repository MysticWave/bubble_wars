class HolyLauncher extends ItemWeapon
{
	constructor()
	{
		super(true);

		this.type = TYPE.CANNON;
		
		this.Texture = "ShadowScythe";
		this.name = "Holy Cannon";
		this.enchantSlots = 0;

		this.BulletType = 'HolyBullet';
        this.upgradeAble = false;

		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 9999),
			new ItemBonus(STAT.ATTACK_SPEED, 60),
            new ItemBonus(STAT.ATTACK_RANGE, 9999)
		];

		this.Lore = "ITEM_HOLY_LAUNCHER_LORE";
	
		this.Model = new ModelCannonBase('model.item.bubbleCannon1', null, 1.1);

        this.Grade = GRADE.TRANSCENDENCE;
	}

    GetAdditionalBulletStats()
    {
        var s = 
        {
            Pierce: 999,
            Bounce: 4,
            Scale: 4,
            spd: 1000
        };
        return s;
    }
}
ItemHelper.InitializeItem(HolyLauncher);