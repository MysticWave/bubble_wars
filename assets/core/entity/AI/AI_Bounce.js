class AI_Bounce
{
	constructor(owner, startAngle = 0, getStartAngle, bounceTowardTarget = null)
	{
		this.name = "Bounce";
        this.timeSinceVectorChange = 120;
        this.changeVector = false;
        this.startAngle = startAngle;
        this.getStartAngle = getStartAngle;
        this.bounceTowardTarget = bounceTowardTarget;
        this.Owner = owner;

        owner.onCollision = () => {this.onBorderHit()};
	}

    GetTarget(owner)
	{
		if(this.bounceTowardTarget == World.Player || this.bounceTowardTarget == Player) return World.Player;

		return Entity.GetAvailableTargets(owner);
	}

    getStartMotion(owner)
    {
        var angle = this.startAngle;
        if(isFunction(this.getStartAngle)) angle = this.getStartAngle(owner);
        var end = MathHelper.lineToAngle(owner, 3000, angle);

        var motion =  Motion.Get([owner.x, owner.y], end, owner.getSPD());
            owner.moveX = motion.x;
            owner.moveY = motion.y;

        if(owner.allowRotationChange) owner.Rotation = motion.angle + 90 + owner.defaultRotation;
    }

    onBorderHit()
    {
        this.changeVector = true;
    }
	
	Update(owner)
	{	
        this.timeSinceVectorChange++;
        if(!owner.moveX && !owner.moveY) this.getStartMotion(owner);
        if(!this.changeVector) return;

        
        this.changeVector = false;
        if(this.bounceTowardTarget)
        {
            if(this.timeSinceVectorChange < 5) return;
            owner.onBounce?.();
			this.timeSinceVectorChange = 0;

            var target = this.GetTarget(owner);
            var angle =  MathHelper.getAngle2([owner.x, owner.y], [target.x, target.y]);
            var end = MathHelper.lineToAngle(owner, 3000, angle);

            var motion =  Motion.Get([owner.x, owner.y], end, owner.getSPD());

			owner.moveX = motion.x;
			owner.moveY = motion.y;
			if(owner.allowRotationChange) owner.Rotation = motion.angle + 90 + owner.defaultRotation;
            return;
        }

		if(this.timeSinceVectorChange >= 60 || owner.isLeavingBorder())
		{
			owner.onBounce?.();
			this.timeSinceVectorChange = 0;

            var distX = (owner.x - World.CenterPoint.x);
            var distY = (owner.y - World.CenterPoint.y);
            if(distX == 0) owner.moveY *= -1;
            if(distY == 0) owner.moveX *= -1;

            if(distX == 0 || distY == 0) 
            {
                if(owner.allowRotationChange) owner.Rotation -= 180;
                return;
            }

			var prev = 
			[
				owner.x - (owner.moveX / 10),
				owner.y - (owner.moveY / 10)
			];

			var a1 = distY / distX;
			var b1 = -(a1 * owner.x) + owner.y;

			var a2 = - (1 / a1);
			var b2 = -(a2 * prev[0]) + prev[1];

			var crossPoint = [];
			crossPoint[0] = (b2 - b1) / (a1 - a2);
			crossPoint[1] = (a1 * crossPoint[0]) + b1;

			var ViewPoint = [];
			ViewPoint[0] = crossPoint[0] - (prev[0] - crossPoint[0]);
			ViewPoint[1] = crossPoint[1] - (prev[1] - crossPoint[1]);

			var motion =  Motion.Get([owner.x, owner.y], ViewPoint, owner.getSPD());
			owner.moveX = motion.x;
			owner.moveY = motion.y;

			if(owner.allowRotationChange) owner.Rotation = motion.angle + 90 + owner.defaultRotation;
		}
	}
}