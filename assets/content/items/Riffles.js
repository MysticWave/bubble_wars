class RiffleBase extends ItemWeaponLaser
{
	constructor()
	{
		super(true);

		this.type = TYPE.RIFFLE;
		
		this.Texture = "ShadowScythe";
		this.name = "Riffle 1";
		this.enchantSlots = 3;

		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 40),
            new ItemBonus(STAT.ATTACK_SPEED, 1),
            new ItemBonus(STAT.CR, 10),
			new ItemBonus(STAT.ATTACK_RANGE, 1500)
		];

		this.Lore = "ITEM_BUBBLE_TERMINATOR_LORE";
	
		this.Model = new ModelCannonBase('model.item.bubbleCannon1');


        this.Duration = 3;
        this.rotationSpeed = 360;
        this.hurtDelay = 60;
	}

    GetAdditionalBulletStats()
    {
        var s = super.GetAdditionalBulletStats();

        s.hurtDelay = 1;
        s.maxAllowedTargets = 1;
        s.size = 20;

        return s;
    }

    GetCooltime()
    {
        var cooltime = ItemBonus.GetBonusValue(STAT.ATTACK_SPEED, this.primary) ?? 1;
        return 60 / cooltime;
    }
}
ItemHelper.InitializeItem(RiffleBase);




class Rifle1 extends ItemWeapon
{
	constructor()
	{
		super(true);
		
		this.type = TYPE.CANNON;
		
		this.Texture = "item.rifle.1";
		this.name = "ITEM.RIFLE.1.NAME";
		this.enchantSlots = 2;

		this.BulletType = 'BulletBubbleBullet';

		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 20),
            new ItemBonus(STAT.ATTACK_SPEED, 0.75),
            new ItemBonus(STAT.CR, 10),
			new ItemBonus(STAT.ATTACK_RANGE, 1500)
		];

		this.ammoCost = 10;
	
		this.Model = new ModelRifle('model.item.rifle');
	}

    GetAdditionalBulletStats()
    {
        var s = super.GetAdditionalBulletStats();
        s.spd = 3000;

        return s;
    }
}
ItemHelper.InitializeItem(Rifle1);





class TheVirtuoso extends RiffleBase
{
	constructor()
	{
		super(true);
        this.BulletType = 'BulletVirtuoso';
		
		this.Texture = "item.riffle.the_virtuoso";
		this.name = "ITEM.THE_VIRTUOSO.NAME";
		this.enchantSlots = 4;

		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 444),
            new ItemBonus(STAT.ATTACK_SPEED, 1),
			new ItemBonus(STAT.CR, -100),
			new ItemBonus(STAT.ATTACK_RANGE, 3000)
		];

		this.Lore = "ITEM.THE_VIRTUOSO.LORE";
		this.Description = "ITEM.THE_VIRTUOSO.DESCRIPTION";
	
		this.Model = new ModelCannonBase('model.item.the_virtuoso', null, 1.2, .25, -.35);
        this.requiredMP = 3;
        this.fixedMP = 0;

        this.showRequiredMP = false;

        this.Duration = 6;
	}

    GetAdditionalBulletStats()
    {
        var s = super.GetAdditionalBulletStats();
        s.Item = this;
        delete s.size;

        if(this.currentMP >= this.requiredMP)
        {
            s.Pierce = this.Owner.bulletStats.Pierce + 3;
        }

        return s;
    }

    GetBulletDamageInfo(ownerAD)
    {
        var data = super.GetBulletDamageInfo(ownerAD);
        if(this.currentMP >= this.requiredMP)
        {
            data.AD *= 4;
            data.criticalChance = 100;
        }
        return data;
    }

    Shoot(owner = this.Owner)
    {
        super.Shoot(owner);
    }
}
ItemHelper.InitializeItem(TheVirtuoso);