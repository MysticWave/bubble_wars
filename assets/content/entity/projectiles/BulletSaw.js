class BulletSaw extends Projectile
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.width = 64;
		this.height = 64;

        this.Texture = 'projectile.saw';
        this.RotationSpeed = 6;

        this.onPlayerCollisionEffects = [['DefBreak', 100, 5, false]];
        this.onEntityCollisionEffects = [['DefBreak', 100, 5, false]];
	}
	
	Update()
	{
		super.Update();

        this.Rotation += this.RotationSpeed;
	}
}
Projectile.Types(BulletSaw);