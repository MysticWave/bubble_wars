class ExplosionSpark extends Explosion
{
	constructor(x, y, source, damage, radius, time)
	{
		super(x, y, source, damage, radius, time);

		this.Texture = 'spark_circle';
		this.timeToDespawn += 2 * Main.FPS;
	}

	Update()
	{
		super.Update();

		if(this.ageInTicks % (Main.FPS / 5) == 0)
		{
			this.piercedEntities = [];
		}

		this.Rotation += MathHelper.randomInRange(70, 110);
		this.Rotation = MathHelper.ToAllowedAngle(this.Rotation);
	}
}
Projectile.Types(ExplosionSpark);