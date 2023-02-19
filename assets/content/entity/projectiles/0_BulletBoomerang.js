class BulletBoomerang extends ProjectileBoomerang
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.rotationSpeed = 360;
	}
	
	Update()
	{
		super.Update();

        this.Rotation += this.rotationSpeed / 60;
	}
}
Projectile.Types(BulletBoomerang);