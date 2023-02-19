class Effect_Regeneration extends Effect
{
	constructor(strength, time, hideParticles)
	{
		super(strength, time, hideParticles);
		this.Icon = 'effect_regeneration';
	}

	Update(owner, effects)
	{
		super.Update(owner, effects);

		var time = Main.FPS;
		var showIndicator = false;

		if(this.ageInTicks % time == 0)
		{
			owner.Heal(this.Strength, false, !this.hideParticles);
		}
	}
}
Effects.Initialize(Effect_Regeneration);