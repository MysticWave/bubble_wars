class AI_Observe
{
	constructor(target, r = 0, observationTrigger = null)
	{
		this.target = target;
		this.name = "Observe";
		this.Radius = r;
		this.observationTrigger = observationTrigger;
	}
	
	GetTarget(owner)
	{
		if(this.target == Player || this.target == World.Player) return World.Player;
		if(World.Entities.indexOf(this.target) != -1) return this.target;
		
		return Entity.GetAvailableTargets(owner, this.Radius);
	}

	Update(owner)
	{
		if(owner.disableObserve) return;
		if(!owner.allowRotationChange) return;
		if(isFunction(this.observationTrigger))
			if(!this.observationTrigger(owner)) return;

		var target = this.GetTarget(owner);
		if(!target) return;
		if(this.Radius)
		{
			var dist = MathHelper.GetDistance(target, owner);
			if(dist > this.Radius) return;
		}
		
		owner.Rotation = MathHelper.getAngle2([target.x, target.y], [owner.x, owner.y]) + 270 + owner.defaultRotation;
	}
}