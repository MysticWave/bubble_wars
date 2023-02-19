class BulletEcho extends Projectile
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.width = 20;
		this.height = 20;

		this.Texture = "projectile.echo";
        this.TextureRotation = 0;
		this.moveParticle = null;
        
        this.playerEffectChance = 5;
		this.entityEffectChance = 5;

        this.onPlayerCollisionEffects = [['Stun', 1, 1, false]];
        this.onEntityCollisionEffects = [['Stun', 1, 1, false]];
        this.scaleGrow = .04;

        this.showParticle = true;
        this.Bounce = 1;
        this.Pierce = 3;

        this.setStats(stats);

        this.setScale(this.Scale);
        this.additionalScaleMultiplier = 0;
        this.canBeLightSource = false;

        this.bulletSery = this.bulletSery ?? 0;
	}

    Update()
    {
        super.Update();

        if(this.additionalScaleMultiplier < (1 - (this.bulletSery * .1)))
            this.additionalScaleMultiplier+= this.scaleGrow;

            
        if(this.showParticle && this.ageInTicks%5 == 0)
        {
            var scale = this.Scale;
            var x = this.x;
            var y = this.y;
            Particle.Summon('projectile.echo', x, y, 0, 0, scale, 0, 1, 20, 
            {
                liveTime: 30, 
                baseScale: scale,
                center: true,
                // globalAlpha: 0.5,
                RENDER_LAYER: Graphic.Layer.LightLevel+1,
                onUpdate: function(){this.Scale = this.baseScale - (this.baseScale * (this.ageInTicks / this.liveTime)); this.opacity = 1 - (this.ageInTicks / this.liveTime)}
            });
        }
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
Projectile.Types(BulletEcho);