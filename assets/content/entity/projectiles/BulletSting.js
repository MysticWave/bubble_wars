class BulletSting extends Projectile
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.width = 20;
		this.height = 20;
        this.TextureRotation = 135+180;
        this.Texture = 'projectile.sting';
        this.explosionScale = .5;

        this.setStats(stats);
	}
	
	
	Kill()
	{
		var bullets = this.bullets;
		var startAngle = MathHelper.randomInRange(0, 360);
		for(var i = 0; i < bullets; i++)
		{
			var angle = startAngle + ((360/bullets) * i);
			var dest = MathHelper.lineToAngle(this, 9999, angle);
			var motion = Motion.Get(this, dest, this.spd);

			var data = {};
				data.moveX = motion.x;
				data.moveY = motion.y;
				data.Rotation = angle+90;
                data.bullets = 0;
                data.source = this.source;
                data.damage = this.damage;
                data.Scale = this.Scale * this.explosionScale;

			World.AddProjectile(new BulletSting(this.x, this.y, data));
		}
		
		super.Kill();
	}
}
Projectile.Types(BulletSting);
