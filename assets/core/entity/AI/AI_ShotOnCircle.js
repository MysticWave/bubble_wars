class AI_ShotOnCircle
{
	constructor(stats, bulletStats, onlyOnaggressive, shotTrigger)
	{
		this.name = "ShotOnCircle";
		this.onlyOnaggressive = onlyOnaggressive;
		this.attackCharge = 30;
		
		this.shotDelayMin = 1;
		this.shotDelayMax = 5;
		this.shotCount = 4;
		this.bulletStats = {spd: 0};
		this.angle = 0;
		this.getStartAngleFromOwnerRotation = false;
		
		this.shotTrigger = shotTrigger;
		
		if(stats)
		{
			for(var stat in stats)
			{
				this[stat] = stats[stat];
			}
		}
		
		if(bulletStats)
		{
			for(var stat in bulletStats)
			{
				this.bulletStats[stat] = bulletStats[stat];
			}
		}
		
		this.shotDelay = MathHelper.randomInRange(this.shotDelayMin * Main.FPS, this.shotDelayMax * Main.FPS);
	}

	setShotDelay(min = this.shotDelayMin, max = this.shotDelayMax, resetCharge = true)
	{
		this.shotDelayMin = min;
		this.shotDelayMax = max;

		if(resetCharge)
		{
			this.attackCharge = 60;
			this.shotDelay = MathHelper.randomInRange(this.shotDelayMin * Main.FPS, this.shotDelayMax * Main.FPS);
		}
	}
	
	Update(owner)
	{
		if(this.onlyOnaggressive && !owner.aggressive)
		{
			return;
		}

		owner.shotOnCircleCharge = this.attackCharge / this.shotDelay * 100;
		
		if(this.shotTrigger)
		{
			if(!this.shotTrigger(owner))
			{
				return;
			}
		}
		
		if (this.attackCharge >= this.shotDelay)
		{
			this.Shoot(owner);
			this.attackCharge = 0;
			this.shotDelay = MathHelper.randomInRange(this.shotDelayMin * Main.FPS, this.shotDelayMax * Main.FPS);
		}
		else
		{
			this.attackCharge++;
		}
	}

	static StaticShoot(entity, bulletStats, bulletCount, stats = {})
	{
		stats.shotCount = bulletCount;
		
		var circle = new AI_ShotOnCircle(stats, bulletStats);
		circle.Shoot(entity);
	}
	
	Shoot(owner, stats)
	{
		var bulletStats = stats || {...this.bulletStats};
		
		bulletStats.damage = bulletStats.damage ?? owner.AD;
		if(!bulletStats.spd) bulletStats.spd = owner.BULLET_SPEED;

		var type = Projectile.Types();
		if(!bulletStats.Type) bulletStats.Type = "BulletBubbleEnemy";
		if(!type[bulletStats.Type]) return;

		var length = 300;
		var angle = this.angle;
		if(this.getStartAngleFromOwnerRotation) angle = owner.Rotation;
		var angleStep = 360 / this.shotCount;
		
		for(var i = 0; i < this.shotCount; i++)
		{
			var target = MathHelper.lineToAngle([owner.x, owner.y], length, angle);
			
			var bullet = new type[bulletStats.Type](owner.x, owner.y, bulletStats);
				bullet.shootAngle = angle;
				bullet.Shoot(owner, target);
				
			World.AddProjectile(bullet);
			
			angle += angleStep;
		}
	}
}