class Explosion extends Projectile
{
	constructor(x, y, source, damage = 1, radius = 100, time = 1)
	{
		super(x, y);


		this.source = source;
		this.width = radius;
		this.height = radius;
		this.Pierce = 999;

		this.Scale = 0;
		this.timeToDespawn = time * Main.FPS;
		this.scaleTime = this.timeToDespawn;
		this.damage = damage;

		this.killOnBorderHit = false;
		this.knockBack = 0;
		this.scaleTransition = true;
	}


	Update()
	{
		if(this.ageInTicks <= this.scaleTime && this.scaleTransition)
		{
			this.Scale = this.ageInTicks / this.scaleTime;
		}

		if(this.ageInTicks >= this.timeToDespawn) this.Kill();

		super.Update();
	}
	
	Shoot(source, target)
	{
		return;
	}
}