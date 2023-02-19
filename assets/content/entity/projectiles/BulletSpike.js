class BulletSpike extends Projectile
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.Texture = "projectile_spike";

		var texture = TextureManager.Get(this.Texture);
		if(texture)
		{
			this.width = texture.width;
			this.height = texture.height;
		}
	}
	
	Update()
	{
		super.Update();

		this.HitBox.ApplyRotation(this, this.Rotation);
	}
}
Projectile.Types(BulletSpike);