class ItemWeapon extends ItemUpgradeAble
{
    constructor(enchantAble = true)
    {
        super(enchantAble);

        this.slot = SLOT.CANNON;
        this.BulletType = 'BulletBubble';
		this.ammoCost = 0;

        this.attackCharge = 9999;   //allows to shoot immediately on game enter
        this.requiredCharge = 60;
        this.bulletSery = 0;
        this.BULLET_SERY_DELAY = 5;
        this.BULLET_SERIES = 1;
        this.bulletDamageMultiplier = 1;
        this.bullets = 1;
        this.chargeBullets = 1;

        this.showRequiredMP = true;
        this.requiredMP = 0;
        this.currentMP = 0;
        this.fixedMP = null;
        this.MPgain = 'SHOOT';
        this.knockBack = .5;
        this.onUseKnockBack = 0;

        this.Owner;
        this.FILTER = 'WEAPON';

        this.lastProjectile = null;


        this.canIncreaseBaseBulletCount = false;
        this.canIncreaseChargeBulletCount = false;

        this.nextShootData = {};
        this.shootBeforeCharge = true;
        this.Charged = null;
    }

    canIncreaseBulletsCount()
    {
        if(this.canIncreaseBaseBulletCount) return true;
        if(this.canIncreaseChargeBulletCount) return true;
        return false;
    }

    CalculateBullets(base)
    {
        var bonus = 0;
        var bonus_p = 0;
        var bonusValue = 0;

        if(this.Grade != GRADE.NORMAL)
        {
            var gradeInfo = ItemHelper.GetGradeInfo(this.Grade);
            if(gradeInfo != null) bonusValue = gradeInfo.bonus;
        }

        for(var i in this.Enchants)
        {
            var enchant = this.Enchants[i];
            if(!enchant) continue;

            var value = Math.round(enchant.bonus.value + (enchant.bonus.value * bonusValue / 100));

            if(enchant.bonus.id == STAT.BULLETS_COUNT)
            {
                if(enchant.bonus.isPercent) bonus_p += value;
                else bonus += value;
            }
        }

        base += bonus;
        base *= (100 + bonus_p) / 100;

        return Math.ceil(base);
    }

    GetBulletCount(charged = false)
    {
        if(charged)
        {
            if(!this.canIncreaseChargeBulletCount) return this.chargeBullets;
            return this.CalculateBullets(this.chargeBullets);
        }

        if(!this.canIncreaseBaseBulletCount) return this.bullets;
        return this.CalculateBullets(this.bullets);
    }

    onSpecialCharge(){}

    UpdateSpecialCharge(owner)
    {
        if(!this.requiredMP) return;

        if(this.MPgain == 'SHOOT')
        {
            var mp = this.fixedMP ?? owner.getSpecialCharge();
            this.currentMP += mp;
        }

        if((this.currentMP >= this.requiredMP && !this.shootBeforeCharge) ||
        (this.currentMP > this.requiredMP && this.shootBeforeCharge))
        {
            this.currentMP = 0;
            this.onSpecialCharge();
            this.isChargedShot = true;
            return;
        }
    }

    UpdateSpecialChargeGauge(owner = this.Owner)
    {
        owner.specialAttackGauge = this.currentMP / this.requiredMP;

        if(this.MPgain == 'SHOOT')
        {
            //fill gauge if onwer get more mp than need
            var mp = this.fixedMP ?? owner.getSpecialCharge();
            if(mp >= this.requiredMP) owner.specialAttackGauge = 1;
        }
    }

    onOwnerUpdate(owner)
    {
        if(!owner) return;
        this.Owner = owner;

        this.UpdateAttackCharge();
        this.UpdateSpecialChargeGauge(owner);
    }

    UpdateAttackCharge(owner = this.Owner)
    {
        if(owner.isAttacking || (this.bulletSery < this.BULLET_SERIES && this.BULLET_SERIES > 1 && this.bulletSery > 0))
        {
            if (this.attackCharge >= this.requiredCharge)
            {
                if(this.shootBeforeCharge) this.Shoot(owner);
                this.UpdateSpecialCharge(owner);
                if(!this.shootBeforeCharge) this.Shoot(owner);

                this.bulletSery++;
                if(this.bulletSery >= this.BULLET_SERIES)
                {
                    this.attackCharge = 0;
                    this.bulletSery = 0;
                }
                else
                {
                    if(this.BULLET_SERY_DELAY) this.attackCharge -= this.BULLET_SERY_DELAY;
                }
            }
            else
            {
                this.attackCharge += owner.stats.ATTACK_SPEED;
            }
        }
        else
        {
            if (this.attackCharge < this.requiredCharge)
            {
                this.attackCharge += owner.stats.ATTACK_SPEED;
            }
            else
            {
                this.attackCharge = this.requiredCharge;
            }
        }

        owner.attackGauge = this.attackCharge / this.requiredCharge;
    }

    ConsumeAmmo(owner = this.Owner)
    {
        var cost_reduction = owner.stats[STAT.AMMO_COST];

        var cost = this.ammoCost - cost_reduction;
        if(cost < 1) cost = (this.ammoCost) ? 1 : 0;

        var dir = (Mouse.x <= owner.posX) ? 1 : -1;

        if(cost <= owner.coins)
        {
            DamageIndicator.AddObject(owner.x, owner.y, -cost, "AMMO", dir);
            owner.coins -= cost;
            return true;
        }
        else
        {
            DamageIndicator.AddObject(owner.x, owner.y, Lang.Get('TEXT.NOT_ENOUGH_OXYGEN'), "RECEIVED", dir);
        }
        return false;
    }

    GetAdditionalBulletStats(){return {}}

    GetBulletDamageInfo(owner = this.Owner)
    {
        var info = 
        {
            AD: owner.stats.AD,
            criticalChance: owner.stats.CR,
            criticalDamage: owner.stats.CD,
            element: this.Element
        };
        return info;
    }

    Shoot(owner = this.Owner)
    {
        if(Main.RUNNING != RUNNING.INGAME) return;

        var type = Projectile.Types();
        var bulletType = this.nextShootData.BulletType || this.BulletType;
		if(!type[bulletType]) return;

        owner.UpdateBulletStats();

		var damageMultiplier = 1 * this.bulletDamageMultiplier;
        var haveEnoughOxygen = true;

        if(this.ammoCost) haveEnoughOxygen = this.ConsumeAmmo();

		// owner.target = Mouse;
		
		var maximalAngle = 90;
		var angleDiff = 10;
		var shotCount = this.GetBulletCount();
		
		
		var minAngle = shotCount * angleDiff;
		if(minAngle > maximalAngle) minAngle = maximalAngle;
		
		var targetAngle = MathHelper.getAngle2([owner.x, owner.y], [Mouse.x + Camera.xView, Mouse.y + Camera.yView]);
		var angle = targetAngle - (minAngle / 2);
		if(shotCount == 1) angle = targetAngle;

		var angleStep = minAngle / (shotCount - 1);

		//get bullet spawn position
		var startPos = owner.GetBulletStartPos();
		var distance = MathHelper.GetDistance([startPos.x - Camera.xView, startPos.y- Camera.yView], [Mouse.x, Mouse.y]);

		var damageInfo = {...this.GetBulletDamageInfo(owner)};
        if(!haveEnoughOxygen) 
        {
            damageInfo.AD = 1;
            damageMultiplier = 1;
        }


        var mp = this.fixedMP ?? owner.getSpecialCharge();
        if(this.MPgain != 'HIT') mp = 0;

		for(var i = 0; i < shotCount; i++)
		{
			var target = MathHelper.lineToAngle([startPos.x, startPos.y], distance, angle);

			var dmgValues = owner.GetDamageValues(Math.floor(damageInfo.AD * damageMultiplier), damageInfo.element);
			owner.bulletStats.damage = damageInfo.damage ?? dmgValues;
            owner.bulletStats.criticalChance = damageInfo.criticalChance;
            owner.bulletStats.criticalDamage = damageInfo.criticalDamage;
			
			var bullet = new type[bulletType](startPos.x, startPos.y, owner.bulletStats);
                bullet.setStats(this.GetAdditionalBulletStats());
				bullet.Shoot(owner, target);
                bullet.MP = mp;
                bullet.Item = this;
                bullet.bulletSery = this.bulletSery;
                if(bullet.knockBack) bullet.knockBack = this.knockBack;
                if(this.isChargedShot) bullet.bullets = this.GetBulletCount(true);
                else bullet.bullets = 0;
				
			World.AddProjectile(bullet);

			if(!World.currentRoom.isCleared)
			{
				owner.RunStats.totalShots++;
			}
				
			angle += angleStep;

            this.lastProjectile = bullet;
		}


        this.nextShootData = {};
        this.isChargedShot = false;

        if(this.onUseKnockBack)
        {
            ApplyEffect(owner, 'KnockBack', this.onUseKnockBack, .15, targetAngle-180);
        }
    }
}