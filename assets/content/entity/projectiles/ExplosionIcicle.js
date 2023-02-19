class ExplosionIcicle extends Explosion
{
	constructor(x, y, source, damage, radius, time, data = {})
	{
		super(x, y, source, damage, radius, time);

        this.Scale = 1;
		this.Texture = 'projectile.icicle';

        for(var i in data)
        {
            this[i] = data[i];
        }

        this.onPlayerCollisionEffects = [['Slow', 25, 10, false]];
        this.onEntityCollisionEffects = [['Slow', 25, 10, false]];

        this.setScale(this.Scale);
	}

	Update()
	{
		super.Update();
        this.x += this.moveX * Main.DELTA;
        this.y += this.moveY * Main.DELTA;
	}
}
Projectile.Types(ExplosionIcicle);