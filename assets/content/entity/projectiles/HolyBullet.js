class HolyBullet extends Projectile
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.width = 20;
		this.height = 20;

		this.Texture = "particleShine";
		this.Pierce = 20;
		this.Transparency = 0.9;
		this.moveParticle = null;

		//wbicie levela nie psuje accuracy
		this.missed = false;
	}
	
	Update()
	{
		this.Rotation += 20;
		if(this.ageInTicks%2 == 0)
		{
			this.Transparency = MathHelper.randomInRange(0.6, 1);
		}
		super.Update();
	}
}
Projectile.Types(HolyBullet);