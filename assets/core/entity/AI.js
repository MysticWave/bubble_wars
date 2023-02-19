class AI
{
	constructor()
	{
		this.actions = [];
	}


	/**
	 * Apply AI to entity`s AI list.
	 * @param {Class} ai AI to be apllied.
	 */
	Apply(ai, override = false)
	{
		if(override && this[ai.name])
		{
			this[ai.name] = ai;
			return;
		}
		
		this.actions.push(ai.name);
		this[ai.name] = ai;
	}
	
	/**
	 * Delete specific AI from entity`s AI list.
	 * @param {String} name Name of AI
	 */
	Delete(name)
	{
		delete this[name];
		for(var i = 0; i < this.actions.length; i++)
		{
			if(this.actions[i] == name)
			{
				this.actions.splice(i, 1);
				break;
			}
		}
	}
	
	Update(owner)
	{
		for(var i = 0; i < this.actions.length; i++)
		{
			var ai = this[this.actions[i]];
			if(!ai) continue;
			if(owner.lockAI && !owner.unlockAI?.includes(ai.name)) continue;
			if(ai.passive) continue;
			if(owner.isStunned && !ai.ignoreStuns) continue;

			ai.Update(owner);
		}
	}
}