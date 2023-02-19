class BulletWaterTwister extends Projectile
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.width = 64;
		this.height = 64;

        this.spd = 120;
        this.Scale = 3;

        this.Texture = 'projectile.water_twister';
        var rotationTime = 1;
        this.rotationSpeed = 360 / (rotationTime * Main.FPS);
        this.baseRotationSpeed = this.rotationSpeed;

        this.SlowStrength = 40;
        this.SlowDuration = 10;

        this.scaleTransitionTime = 60;
        this.Bounce = true;
        this.bounceTime = 9999;
        this.Pierce = 9999;
        this.element = ELEMENT.ICE;

        this.Hits = 2;

        this.setStats(stats);
        this.setScale(this.Scale);

        this.onPlayerCollisionEffects = [['Slow', this.SlowStrength, this.SlowDuration, false]];
		this.onEntityCollisionEffects = [['Slow', this.SlowStrength, this.SlowDuration, false]];
	}
	
	Update()
	{
        var hurtDelay = Math.round(Main.FPS / this.Hits);
        if(this.ageInTicks%hurtDelay == 0)
        {
            this.piercedEntities = [];
        }
		super.Update();

        if(this.ageInTicks <= this.scaleTransitionTime)
        {
            var p = this.ageInTicks / this.scaleTransitionTime;
            this.additionalScaleMultiplier = p;
        }

        if(this.ageInTicks > this.timeToDespawn - this.scaleTransitionTime)
        {
            var p = (this.timeToDespawn-this.ageInTicks) / this.scaleTransitionTime;
            this.additionalScaleMultiplier = p;
        }
	}

    Render(context)
    {
        this.Rotation = (this.Rotation + this.rotationSpeed)%360;
        super.Render(context);
    }
}
Projectile.Types(BulletWaterTwister);