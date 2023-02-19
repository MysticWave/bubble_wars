class Effect
{
	constructor(strength, time, hideParticles)
	{
		this.ageInTicks = 0;
		this.Strength = strength;
		this.Time = time * Main.FPS;
		this.hideParticles = hideParticles;

		this.durationPercent = 0;
		this.keepStrongest = true;
		this.Icon = null;
		this.toClear = false;
		this.showIcon = true;

		this.Owner
	}

	getId()
	{
		return this.constructor.name.toUpperCase();
	}

	Update(owner, effects)
	{
		this.Owner = owner;
		this.ageInTicks++;
		this.durationPercent = (this.ageInTicks / this.Time) * 100;
		
		if(this.showIcon) owner.UpdateCooltime?.(this.getId(), this.ageInTicks, this.Time, this.Icon, true);

		if(this.ageInTicks >= this.Time)
		{
			this.toClear = true;
			return;
		}
	}

	Render(context, owner){}
	onApply(owner){}
	onClear(){}
}




class Effects
{
	constructor()
	{
		this.effectList = {};
	}

	static GetEffect(name)
	{
		return this.EffectsList[name.toUpperCase()];
	}

	static Initialize(effect)
	{
		var keyWord = "Effect_";
		var name = effect.name.replace(keyWord, "").toUpperCase();
		this.EffectsList = this.EffectsList || {};

		this.EffectsList[name] = effect;
	}


	GetActiveEffectById(id)
	{
		id = id.toUpperCase();
		
		for(var effectName in this.effectList)
			if(effectName.toUpperCase() == id) return this.effectList[effectName];
	}

	Apply(effect, owner)
	{
		if(this.effectList[effect.constructor.name] && effect.keepStrongest)
		{
			var current = this.effectList[effect.constructor.name];
			if(current.Strength > effect.Strength) return;
		}

		this.effectList[effect.constructor.name] = effect;
		effect.onApply(owner);
	}

	Clear(effect)
	{
		if(isString(effect)) effect = this.effectList[Effects.GetEffect(effect).name];
		if(!effect) return;
		
		effect.onClear();
		delete this.effectList[effect.constructor.name];
		effect.Owner.UpdateCooltime?.(effect.getId(), 1, 1, effect.Icon, true);
	}

	Update(owner)
	{
		for(var effectName in this.effectList)
		{
			var effect = this.effectList[effectName];

			effect.Update(owner, this);
			if(effect.toClear) this.Clear(effect)
		}
	}

	Render(context, owner)
	{
		for(var effectName in this.effectList)
		{
			var effect = this.effectList[effectName];

			effect.Render(context, owner);
		}
	}
}