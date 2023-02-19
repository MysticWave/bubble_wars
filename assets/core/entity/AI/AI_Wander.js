class AI_Wander
{
	constructor(onlyOnPeaceful = true, directionChangeDelayMin = 10, directionChangeDelayMax, additionalData = {})
	{
		this.name = "Wander";
		this.directionChangeDelayMin = directionChangeDelayMin;
		this.directionChangeDelayMax = directionChangeDelayMax ?? directionChangeDelayMin;

		this.timeSinceChange = MathHelper.randomInRange(0, this.directionChangeDelayMin * Main.FPS);
		this.onlyOnPeaceful = onlyOnPeaceful;
		this.changeDelay = this.directionChangeDelayMin * Main.FPS;
		// this.maxDistance = 1000;
		this.end = null;
		this.lastUpdated = false;
		this.fixedSteps = null;
		this.SPD = null;

		this.firstChangeAwait = null;
		this.ageInTicks = 0;

		this.fixedAngle = null;

		this.R = null;
		this.r = null;

		for(var i in additionalData)
		{
			this[i] = additionalData[i];
		}
	}
	
	Update(owner)
	{
		this.ageInTicks++;
		if(!owner.allowMove) return;
		if(this.onlyOnPeaceful && owner.aggressive) 
		{
			if(this.lastUpdated) this.clearMove(owner);
			return;
		}
		if(this.firstChangeAwait && this.firstChangeAwait > this.ageInTicks) return;
		if(this.updateTrigger && !this.updateTrigger(owner)) return;
		
		this.timeSinceChange++;


		var spd = (this.SPD || owner.getSPD());
		var step = Main.DELTA * spd;
		
		if(this.timeSinceChange >= this.changeDelay || !this.end)
		{
			var r = this.r ?? 0;
			var R = this.R ?? World.Radius-100;

			if(!this.fixedSteps)
			{
				this.end = MathHelper.getRandomPointInRange(World.CenterPoint, R, r);
			}
			else
			{
				var tries = 0;
				var angle = this.fixedAngle ?? MathHelper.randomInRange(0, 360);
				
				//entity will wander by fixed distance
				while(true)
				{
					this.end = MathHelper.lineToAngle([owner.x, owner.y], this.fixedSteps, angle);

					//check if new destination is inside room
					if(MathHelper.GetDistance(this.end, World.CenterPoint) <= R + 50) break;
					tries++;

					angle = MathHelper.randomInRange(0, 360);

					if(tries >= 50)
					{
						//cannot set new point with fixed distance, so set any
						this.end = MathHelper.getRandomPointInRange(World.CenterPoint, R, r);
						break;
					}
				}
			}
			
			this.timeSinceChange = 0;
			this.setDelay();
			this.waitForNewPoint = false;
		}

		
		var motion = Motion.Get([owner.x, owner.y], [this.end.x, this.end.y], spd);
		if(owner.allowRotationChange) owner.Rotation = motion.angle + 90 + owner.defaultRotation;

		if(!this.waitForNewPoint)
		{
			owner.moveX = motion.x;
			owner.moveY = motion.y;
		}

		
		this.lastUpdated = true;

		var distance = MathHelper.GetDistance([owner.x, owner.y], [this.end.x, this.end.y]);	
		if(distance < step)
		{
			this.clearMove(owner);
			owner.onWanderDestination?.();
			return;
		}

		distance = MathHelper.GetDistance([owner.x, owner.y], [World.CenterPoint.x, World.CenterPoint.y]);
		if(distance >= World.Radius - 50)
		{
			owner.moveX *= -1;
			owner.moveY *= -1;
			this.changeDir();
		}
	}

	clearMove(owner)
	{
		owner.moveX = 0;
		owner.moveY = 0;
		this.waitForNewPoint = true;
	}

	changeDir()
	{
		this.timeSinceChange = this.changeDelay * Main.FPS;
		this.setDelay();
	}

	setDelay()
	{
		var min = this.directionChangeDelayMin * Main.FPS;
		var max = this.directionChangeDelayMax * Main.FPS;
		this.changeDelay = MathHelper.randomInRange(min, max);
	}
}