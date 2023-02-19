class Effect_Slow extends Effect
{
	constructor(strength, time, hideParticles)
	{
		super(strength, time, hideParticles);
		this.Icon = 'effect_slow';
	}

	Update(owner, effects)
	{
		super.Update(owner, effects);
        if(owner.Immunity.SLOW || owner.Immunity.ALL) return;

		owner.Slow = this.Strength;

		if(!this.hideParticles && this.ageInTicks % 5 == 0) this.SummonParticle();
	}

	onApply(owner)
    {
		if(owner == World.Player)
		{
			owner.velocityX = 0;
			owner.velocityY = 0;
		}
    }

	SummonParticle()
	{
		var owner = this.Owner;
		var scale = .5 * MathHelper.randomInRange(75, 125) / 100 * owner.Scale;
		var r = (owner.Width / 2 * owner.Scale);
		var x = owner.x + MathHelper.randomInRange(-r, r);
		var y = owner.y + MathHelper.randomInRange(-r, r);
		var spd = 30;

		Particle.Summon('effect.slow', x, y, x, y+500, scale, spd, 1, 20, 
		{
			liveTime: 60, 
			// owner: owner,
			baseScale: scale,
			center: true,
			// globalAlpha: 0.5,
			// RENDER_LAYER: Graphic.Layer.Particle0,
			// onUpdate: function(){this.Scale = (this.baseScale * (this.ageInTicks / this.liveTime))}
		});
	}

	onClear()
	{
		if(this.Owner) this.Owner.Slow = 0;
	}
}
Effects.Initialize(Effect_Slow);