class Effect_DefBreak extends Effect
{
	constructor(strength, time, hideParticles)
	{
		super(strength, time, hideParticles);
		this.Icon = 'effect_dec_def';
	}

	Update(owner, effects)
	{
		super.Update(owner, effects);
        if(owner.Immunity.DEF_BREAK || owner.Immunity.ALL) return;

		owner.DefBreak = this.Strength;
	}

	onClear()
	{
		if(this.Owner) this.Owner.DefBreak = 0;
	}
}
Effects.Initialize(Effect_DefBreak);