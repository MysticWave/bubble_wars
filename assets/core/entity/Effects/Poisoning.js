class Effect_Poisoning extends Effect
{
	constructor(strength, time, hideParticles)
	{
		super(strength, time, hideParticles);
		this.Icon = 'effect_poisoning';
	}

	Update(owner, effects)
	{
		super.Update(owner, effects);
		if(owner.Immunity[ELEMENT.POISON] || owner.Immunity.ALL) return;

		owner.isPoisoned = true;

		var time = Main.FPS / 2;

		if(this.Strength && this.ageInTicks % time == 0)
			owner.Hurt(this.Strength, this, {ELEMENT: ELEMENT.POISON, IGNORE_REDUCTION: true, ALWAYS_HURT: true});

		if(!this.hideParticles && this.ageInTicks % 5 == 0) this.SummonParticle();
	}

	SummonParticle()
	{
		var owner = this.Owner;
		var scale = 1 * MathHelper.randomInRange(75, 125) / 100 * owner.Scale;
		var r = (owner.Width / 2 * owner.Scale);
		var x = owner.x + MathHelper.randomInRange(-r, r);
		var y = owner.y + MathHelper.randomInRange(-r, r);
		var spd = 50;

		Particle.Summon('effect.poison', x, y, x, y-500, scale, spd, 1, 20, 
		{
			liveTime: 60, 
			// owner: owner,
			baseScale: scale,
			center: true,
			// globalAlpha: 0.5,
			// RENDER_LAYER: Graphic.Layer.Particle0,
			onUpdate: function(){this.Scale = (this.baseScale * (this.ageInTicks / this.liveTime))}
		});
	}

	onClear()
	{
		if(this.Owner) this.Owner.isPoisoned = false;
	}
}
Effects.Initialize(Effect_Poisoning);