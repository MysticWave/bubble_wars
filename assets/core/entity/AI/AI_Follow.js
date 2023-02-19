class AI_Follow
{
	constructor(ToFollow, onlyOnAggressive, observationTrigger = null, data = {})
	{
		this.name = "Follow";
		this.toFollow = ToFollow;
		this.onlyOnAggressive = onlyOnAggressive;

		this.canActiveWander = false;
		this.observationTrigger = observationTrigger;
		this.keepDistance = 0;


		for(var i in data)
		{
			this[i] = data[i];
		}
	}
	
	GetTarget(owner)
	{
		if(this.toFollow == Player || this.toFollow == World.Player) return World.Player;
		if(World.Entities.indexOf(this.toFollow) != -1) return this.toFollow;
		return Entity.GetAvailableTargets(owner, owner.FOLLOW_RANGE);
	}
	
	Update(owner)
	{
		if(!this.toFollow) return;
		if(!this.toFollow.isAlive) return;
		if(this.disabled) return;
		if(!owner.allowFollow) return;
		if(isFunction(this.observationTrigger))
			if(!this.observationTrigger(owner)) return;

		if(this.onlyOnAggressive && !owner.aggressive) return;
		owner.dirX = 1;
		owner.dirY = 1;
		
		var target = this.GetTarget(owner);
		var followRange = owner.FOLLOW_RANGE || 500;
		var step = Main.DELTA * owner.getSPD();
		
		var distance = MathHelper.GetDistance([owner.x, owner.y], [target.x, target.y]);
			
		if((distance > followRange) || (distance < step))
		{
			if(owner.gotAI('Wander'))
			{
				if(this.canActiveWander) 
				{
					owner.AI.Wander.changeDir();
					this.canActiveWander = false;
				}
				return;
			}
			owner.moveX = 0;
			owner.moveY = 0;
			return;
		}

		if(this.keepDistance && this.keepDistance > distance)
		{
			var angle = MathHelper.getAngle2(owner, target);
			owner.moveX = 0;
			owner.moveY = 0;
			if(owner.allowRotationChange) owner.Rotation = angle + owner.defaultRotation + 90;
			return;
		}

		var tX = target.x;
		var tY = target.y;
		var rotation = null;

		// if(this.keepDistance && distance < this.keepDistance)
		// {
		// 	var angle = MathHelper.getAngle2(owner, target);
		// 	if(this.keepDistance-distance < step) 
		// 	{
		// 		owner.moveX = 0;
		// 		owner.moveY = 0;
		// 		if(owner.allowRotationChange) owner.Rotation = angle + owner.defaultRotation + 90;
		// 		return;
		// 	}

		// 	var new_target = MathHelper.lineToAngle(owner, distance, angle-180);

		// 	tX = new_target.x;
		// 	tY = new_target.y;

		// 	rotation = angle + owner.defaultRotation + 90;
		// }
		
		
		if(target === Mouse)
		{
			tX = target.x + Camera.xView;
			tY = target.y + Camera.yView;
		}


		var motion = Motion.Get([owner.x, owner.y], [tX, tY], owner.getSPD());
		if(owner.allowRotationChange) 
		{
			owner.Rotation = motion.angle + 90 + owner.defaultRotation;
			if(rotation) owner.Rotation = rotation;
		}

		owner.moveX = motion.x;
		owner.moveY = motion.y;

		this.canActiveWander = true;
	}
}