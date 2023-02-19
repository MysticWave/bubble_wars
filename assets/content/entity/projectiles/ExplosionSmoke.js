class ExplosionSmoke extends Explosion
{
	constructor(x, y, source, damage, radius, time, data = {})
	{
		super(x, y, source, damage, radius, time);

        this.Scale = 1;
		this.Texture = 'explosion.smoke';
		// this.timeToDespawn += 2 * Main.FPS;

        for(var i in data)
        {
            this[i] = data[i];
        }

        this.setScale(this.Scale);
	}

	Update()
	{
		super.Update();
        this.x += this.moveX * Main.DELTA;
        this.y += this.moveY * Main.DELTA;

		// if(this.ageInTicks % (Main.FPS / 5) == 0)
		// {
		// 	this.piercedEntities = [];
		// }


        if(this.ageInTicks < this.timeToDespawn/2)
        {
            var p = this.ageInTicks / (this.timeToDespawn/2);
            this.Transparency = p;
        }
        else
        {
            var p = (this.ageInTicks - this.timeToDespawn/2) / (this.timeToDespawn/2);
            this.Transparency = 1-p;
        }

        this.Scale = this.baseScale + (this.baseScale * (this.ageInTicks / this.timeToDespawn));
	}
}
Projectile.Types(ExplosionSmoke);