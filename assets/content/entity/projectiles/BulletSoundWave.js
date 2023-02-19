class BulletSoundWave extends Projectile
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.width = 20;
		this.height = 20;

		this.Texture = "projectile.soundwave";
        this.TextureRotation = 270 - 45;
		this.moveParticle = null;

        this.baseScale = this.Scale;
        this.scaleTransition = new Transition(1, 0.5, 0.25, true, 0.02, 0.02);
	}

    Render(context)
	{
		this.Scale = this.baseScale * this.scaleTransition.Update();
		super.Render(context);
	}

    RenderTexture(context)
	{
		if(World.Location.getLightLevelInfo())
        {
            //make projectiles visible in cavern
            Graphic.addPostRenderFunction(Graphic.Layer.LightLevel, () => {
                    super.RenderTexture(ctx);
            });
        }
        else
        {
            super.RenderTexture(context);
        }
	}
}
Projectile.Types(BulletSoundWave);