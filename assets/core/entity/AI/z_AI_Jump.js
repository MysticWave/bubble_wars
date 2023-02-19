class AI_Jump extends AI_Wander
{
	constructor(onlyOnPeaceful = true, directionChangeDelayMin = 10, directionChangeDelayMax, focusIfAggressive, data)
	{
		super(onlyOnPeaceful, directionChangeDelayMin, directionChangeDelayMax, data);

		this.name = "Jump";
		this.lastJump = false;

		this.focus = focusIfAggressive;
		this.focusPlayerOnPeaceful = data?.focusPlayerOnPeaceful ?? false;

		this.firstChangeAwait = MathHelper.randomInRange(5, this.directionChangeDelayMin * Main.FPS);
	}
	
	Update(owner)
	{
		owner.isJumping = false;
		this.fixedAngle = null;

		this.directionChangeDelayMin = owner.JumpDelay;
		this.directionChangeDelayMax = owner.JumpDelay;

		if(!this.fixedSteps) this.fixedSteps = owner.JumpDistance || owner.getSPD();
		this.SPD = this.fixedSteps / owner.JumpDuration;

		if(this.focus == Player && (owner.aggressive || this.focusPlayerOnPeaceful)) this.fixedAngle = MathHelper.getAngle2([owner.x, owner.y],[World.Player.x, World.Player.y]);
		if(this.focus == Entity) 
		{
			var entity = Entity.GetAvailableTargets(owner, this.fixedSteps);

			if(entity) this.fixedAngle = MathHelper.getAngle2([owner.x, owner.y],[entity.x, entity.y]);
		}

		super.Update(owner);

		if(this.timeSinceChange <= owner.JumpDuration*Main.FPS) owner.isJumping = true;
		if(this.timeSinceChange == 0)
		{
			owner.onJumpStart?.();
		}

		owner.toJumpProgress = this.timeSinceChange / this.changeDelay * 100;


		this.setOwnerScale(owner);

		if(this.lastJump && !owner.isJumping && this.ageInTicks > 5) 
		{
			if(owner.shakeOnJump) Camera.Shake(owner.shakeOnJump, false, 20);
			owner.onJumpEnd?.();
		}
		

		//add shadows

		this.lastJump = owner.isJumping;
	}

	setOwnerScale(owner)
	{
		if(!owner.isJumping)
		{
			owner.additionalScaleMultiplier = 1;
			return;
		}

		var s = 1;
		var additional_scale = .25;
		var jump_progress = this.timeSinceChange / (owner.JumpDuration * Main.FPS);
		var inc_scale_time = .4;
		var inc_scale_duration = (owner.JumpDuration * Main.FPS * inc_scale_time);
		
		if(jump_progress <= inc_scale_time) s += (this.timeSinceChange / inc_scale_duration) * additional_scale;
		if(jump_progress > inc_scale_time) s += additional_scale;
		if(jump_progress >= 1-inc_scale_time) s = 1 + (((owner.JumpDuration * Main.FPS) - this.timeSinceChange) / inc_scale_duration) * additional_scale;

		owner.additionalScaleMultiplier = s;
	}
}