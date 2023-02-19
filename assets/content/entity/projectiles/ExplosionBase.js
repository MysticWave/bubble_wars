class ExplosionBase extends Explosion
{
	constructor(x, y, source, damage, radius, time)
	{
		super(x, y, source, damage, radius, time);

		this.Texture = 'ExplosionBase';
	}
}
Projectile.Types(ExplosionBase);