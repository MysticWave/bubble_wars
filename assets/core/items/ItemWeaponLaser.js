class ItemWeaponLaser extends ItemWeapon
{
    constructor(enchantAble = true)
    {
        super(enchantAble);

        this.BulletType = 'BulletLaserBeam';

        this.Duration = 120;
        this.Cooltime = 60;
        this.hurtDelay = 5;
        this.rotationSpeed = 180;
    }

    GetDuration()
    {
        return ItemBonus.GetBonusValue(STAT.DURATION, this.primary) ?? this.Duration;
    }

    GetCooltime()
    {
        var cooltime = ItemBonus.GetBonusValue(STAT.COOLTIME, this.primary) ?? this.Cooltime;
        var duration = this.GetDuration();

        return cooltime + duration;
    }

    UpdateAttackCharge(owner = this.Owner)
    {
        this.attackCharge++;
        var cooltime = this.GetCooltime();

        if(owner.isAttacking)
        {
            if(this.attackCharge >= cooltime)
            {
                this.UpdateSpecialCharge(owner);
                this.Shoot();
                this.attackCharge = 0;
            }
        }
        
        if(this.attackCharge > cooltime) this.attackCharge = cooltime;

        owner.attackGauge = this.attackCharge / cooltime;
    }

    GetAdditionalBulletStats()
    {
        var s =
        {
            hurtDelay: this.hurtDelay,
            rotationSpeed: this.rotationSpeed,
            laserDuration: this.GetDuration()
        };
        return s;
    }
}