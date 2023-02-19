class AI_AttackRange
{
	constructor(target, bulletStats, stats)
	{
		this.name = "AttackRange";
		this.bulletSery = 0;
		this.attackCharge = 30;
		this.target = target;
		this.bulletStats = {};
		this.rangeFromCenter = false;

		this.maximalAngle = 45;
		this.angleDiff = 10;
		this.requiredCharge = Main.FPS;
		this.updateTrigger = null;
		this.shootTrigger = null;
		
		for(var stat in bulletStats)
		{
			this.bulletStats[stat] = bulletStats[stat];
		}

		for(var stat in stats)
		{
			this[stat] = stats[stat];
		}
	}

	GetTarget(owner)
	{
		if(this.target == World.Player) return World.Player;
		if(World.Entities.indexOf(this.target) != -1) return this.target;

		return Entity.GetAvailableTargets(owner);
	}
	
	Update(owner)
	{
		if(!this.target) return;
		if(this.updateTrigger && !this.updateTrigger(owner)) return;
		if(!owner.aggressive && !owner.isFromPlayer) return;
		
		if(owner.bulletStats) this.bulletStats = owner.bulletStats;
		if(owner.rangeFromCenter) 
		{
			this.rangeFromCenter = owner.rangeFromCenter;
			if(owner.scaleRangeFromCenter)
			{
				this.rangeFromCenter *= owner.Scale;
			}
		}

		var target = this.GetTarget(owner);
		if(!target) return;

		owner.AttackRangeCharge = this.attackCharge / this.requiredCharge * 100;
		
		var distance = MathHelper.GetDistance([owner.x, owner.y], [target.x, target.y]);
		if(distance > owner.ATTACK_RANGE || (owner.ATTACK_RANGE_MIN && distance < owner.ATTACK_RANGE_MIN)) return;
		
		if (this.attackCharge >= this.requiredCharge)
		{
			this.Shoot(owner);
			this.bulletSery++;

			if(this.bulletSery >= owner.BULLET_SERIES)
			{
				this.attackCharge = 0;
				this.bulletSery = 0;
			}
			else
			{
				if(owner.BULLET_SERY_DELAY) this.attackCharge -= owner.BULLET_SERY_DELAY;
			}
		}
		else
		{
			this.attackCharge += owner.ATTACK_SPEED;
		}
	}
	
	Shoot(owner)
	{
		if(this.shootTrigger && !this.shootTrigger(owner)) return;

		var type = Projectile.Types();
		if(!this.bulletStats.Type) this.bulletStats.Type = "BulletBubbleEnemy";
		if(!type[this.bulletStats.Type]) return;

		var target = this.GetTarget(owner);
		if(!target.isAlive) return;
		
		this.bulletStats.spd = owner.BULLET_SPEED;
		this.bulletStats.damage = owner.AD;
		
		
		var shotCount = owner.BULLETS_COUNT || 1;
		
		var x, y;
		
		x = owner.x;
		y = owner.y;
		
		var minAngle = shotCount * this.angleDiff;
		if(minAngle > this.maximalAngle)
		{
			minAngle = this.maximalAngle;
		}
		
		var targetAngle = MathHelper.getAngle2([owner.x, owner.y], [target.x, target.y]);
		var angle = targetAngle - (minAngle / 2);
		if(shotCount == 1)
		{
			angle = targetAngle;
		}

		var angleStep = minAngle / (shotCount - 1);
		
		for(var i = 0; i < shotCount; i++)
		{
			
			if(this.rangeFromCenter)
			{
				var center = MathHelper.lineToAngle([owner.x, owner.y], this.rangeFromCenter, angle);
				x = center.x;
				y = center.y;
			}
			
			var _target = MathHelper.lineToAngle([x, y], 300, angle);
			
			var bullet = new type[this.bulletStats.Type](x, y, this.bulletStats);
				bullet.Shoot(owner, _target);
				
			World.AddProjectile(bullet);
				
			angle += angleStep;
		}
		
	}
}