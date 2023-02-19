class BulletFlameStar extends Projectile
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.width = 20;
		this.height = 20;

		this.Texture = "projectile.flame_star";
		this.moveParticle = null;
        this.element = ELEMENT.FIRE;
	}
    
    Update()
    {
        super.Update();
    }
}
Projectile.Types(BulletFlameStar);