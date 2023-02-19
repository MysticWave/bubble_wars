class AI_OrbitAround
{
	constructor(target, speed = 360, radius = 300, startAngle = 0, onTargetDeath = function(owner){owner.Kill()}, direction = 1)
	{
		this.name = "OrbitAround";
		this.target = target;
		this.spd = speed / Main.FPS;
		this.direction = direction;
		this.radius = radius;
		this.startAngle = startAngle;
		this.ageInTicks = 0;
		this.onTargetDeath = onTargetDeath;
	}

	Update(owner)
	{
		owner.allowMove = true;

		if(!this.target) return;
		if(!this.target.isAlive)
		{
			if(isFunction(this.onTargetDeath))
			{
				this.onTargetDeath(owner);
			}
		}

		var angle = this.startAngle + (this.ageInTicks * this.spd * this.direction);
		var radius = this.target.OrbitRadius ?? owner.OrbitRadius ?? this.radius;

		var pos = MathHelper.lineToAngle([this.target.x, this.target.y], radius, angle);

		owner.x = pos.x;
		owner.y = pos.y;

		this.ageInTicks++;
		owner.allowMove = false;
	}
}