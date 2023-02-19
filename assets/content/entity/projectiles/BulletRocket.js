class BulletRocketSmoke extends ProjectileRocket
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.width = 20;
		this.height = 20;
	}
	
	Update()
	{
		super.Update();
	}
	
	Kill()
	{
		var bullets = this.bullets;
		var startAngle = MathHelper.randomInRange(0, 360);
		for(var i = 0; i < bullets; i++)
		{
			var angle = startAngle + ((360/bullets) * i);
			var dest = MathHelper.lineToAngle(this, 9999, angle);
			var motion = Motion.Get(this, dest, MathHelper.randomInRange(20, 40));

			var data = {};
				data.moveX = motion.x;
				data.moveY = motion.y;
				data.Rotation = angle;

			World.AddProjectile(new ExplosionSmoke(this.x, this.y, this.source, this.explosionDamage, 50, 1, data));
		}
		
		super.Kill();
	}
}
Projectile.Types(BulletRocketSmoke);














class BulletRocketSpark extends ProjectileRocket
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.width = 20;
		this.height = 20;
	}
	
	Update()
	{
		super.Update();
	}
	
	Kill()
	{
		World.AddProjectile(new ExplosionSpark(this.x, this.y, this.source, this.explosionDamage, 250, 0.1));
		super.Kill();
	}
}
Projectile.Types(BulletRocketSpark);