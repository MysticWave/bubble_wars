class BulletBubble extends Projectile
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
		if(!this.noKillParticle) World.AddParticle(new Particle("bubble_pop", this.HitBox.x, this.HitBox.y, 20, this.width, this.height, this.Scale, true));
		super.Kill();
	}
}
Projectile.Types(BulletBubble);