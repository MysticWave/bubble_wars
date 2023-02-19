class AI_AttackMelee
{
	constructor(target, damage, damageMultiplier, data = {})
	{
		this.name = "AttackMelee";
		this.target = target;
		this.attackDelay = 120;
		this.damage = damage || 1;
		this.damageMultiplier = damageMultiplier;
		this.element = ELEMENT.PHYSICAL;
		this.collisionEffectTrigger = null;
		this.onCollisionEffects = [];
		this.onlyOnAggressive = false;
		// this.passive = true;

		for(var i in data)
		{
			this[i] = data[i];
		}
	}

	Update(owner)
	{
		this.attackDelay += owner.ATTACK_SPEED;
		if(this.damageMultiplier) this.damage = owner.AD * this.damageMultiplier;
		if(!this.damage) this.damage = owner.AD;
	}

	getDamageData()
	{
		var data = {damage: 0, ELEMENT: this.element};
		var damage = this.damage;
		if(isNaN(this.damage))
		{
			damage = MathHelper.randomInRange(this.damage.min, this.damage.max);
		}

		data.damage = damage;

		return data;
	}

	isProperTarget(target)
	{
		return (target instanceof this.target && target.isAlive);
	}
	
	Hurt(owner, target)
	{
		if(owner.NoAI || owner.lockAI) return;
		if(this.onlyOnAggressive && !owner.aggressive) return;

		if(this.isProperTarget(target))
		{
			if(this.attackDelay >= Main.FPS)
			{
				owner.onMeleeAttack?.(target);
				var data = this.getDamageData();
				this.attackDelay = 0;
				target.Hurt(data.damage, owner, data);

				if(!this.collisionEffectTrigger || this.collisionEffectTrigger?.(owner, target))
				{
					for(var i in this.onCollisionEffects)
					{
						var e = this.onCollisionEffects[i];
						ApplyEffect(target, e[0], e[1], e[2], e[3]);
					}
				}
			}
		}
	}
}