class ExplosionLightningStrike extends Explosion
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.width = 17;
		this.height = 50;

		this.Texture = "effect.lightning.strike";
        this.Indicator = 'effect.lightning.strike.indicator';
		this.moveParticle = null;
        this.element = ELEMENT.THUNDER;

        this.isKilled = false;
        this.strikeFrames = 6;
        this.strikeFrameDelay = 3;
        this.damageDealDuration = this.strikeFrameDelay * this.strikeFrames;
        this.timeToExplode = Main.FPS * 1;

        this.timeToDespawn = this.damageDealDuration+this.timeToExplode;
        this.lightningTicks = 0;
        this.isStriking = false;
        this.IndicatorDuration = 6;

        this.showIndicator = true;
        this.scaleTransition = false;

        this.setStats(stats);
	}

	Update()
	{
        this.moveX = 0;
        this.moveY = 0;
		super.Update();
        
        if(this.ageInTicks >= this.timeToExplode) 
        {
            this.isStriking = true;
            this.lightningTicks++;
        }
	}

    onPlayerCollision(player)
	{
		if(!this.isStriking) return;
        super.onPlayerCollision(player);
	}
		
	onEntityCollision(entity)
	{
		if(!this.isStriking) return;
        super.onEntityCollision(entity);
	}

    RenderTexture(context)
    {
        var texture = TextureManager.Get(this.Texture);
        var indicator = TextureManager.Get(this.Indicator);
        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;

        var width = this.width;
        var height = this.height * 2;
        var scale = this.Scale;

        var tY = (height * .6) * scale;

        var frame = Math.floor(this.lightningTicks/this.strikeFrameDelay);

        if(!this.isStriking) 
        {
            if(this.ageInTicks <= this.IndicatorDuration)
            {
                var alpha = 1 - (this.ageInTicks / (this.IndicatorDuration-5));
                var s = scale * .1 * (1.5-alpha);

                Graphic.DrawRotatedAnimatedImage(context, 0, 1, 'X', 
                indicator, x, y, width, width, s, 0, alpha);
            }
            return;
        }

        Graphic.DrawRotatedAnimatedImage(context, frame, this.strikeFrames, 'X', 
            texture, x, y-tY, width, height, scale, 0, this.Transparency);
    }
}
Projectile.Types(ExplosionLightningStrike);
