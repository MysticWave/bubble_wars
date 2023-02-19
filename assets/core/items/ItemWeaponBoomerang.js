class ItemWeaponBoomerang extends ItemWeapon
{
    constructor(enchantAble = true)
    {
        super(enchantAble);

        this.Throws = 0;
        this.refillCharge = false;

        this.BulletType = 'BulletBoomerang';
    }

    GetMaxThrows()
    {
        //scales with bullet count
        return this.CalculateBullets(1);
    }

    GetAvailableThrows()
    {
        var max = this.GetMaxThrows();
        return max - this.Throws;
    }

    GetAdditionalBulletStats()
    {
        var s = super.GetAdditionalBulletStats();
        s.Item = this;

        return s;
    }

    Shoot(owner)
    {
        if(this.GetAvailableThrows() <= 0)
        {
            this.refillCharge = true;
            return;
        }

        super.Shoot(owner);
        this.Throws++;
    }

    UpdateAttackCharge(owner = this.Owner)
    {
        super.UpdateAttackCharge(owner);

        if(this.refillCharge)
        {
            this.attackCharge = this.requiredCharge;
            this.refillCharge = false;

            owner.attackGauge = this.attackCharge / this.requiredCharge;
        }
    }
}