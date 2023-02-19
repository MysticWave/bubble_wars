class AI_Walk
{
	constructor(BounceOnBorderHit = true)
	{
		this.name = "Walk";
		this.BounceOnBorderHit = BounceOnBorderHit;
	}
	
	Update(owner)
	{	
		if(!owner.allowMove) return;

		owner.x += owner.moveX * Main.DELTA;
		owner.y += owner.moveY * Main.DELTA;

		if(owner.ignoreBorder || !this.BounceOnBorderHit || owner.AI.Bounce) return;
		
		var distance = MathHelper.GetDistance([owner.x, owner.y], [World.CenterPoint.x, World.CenterPoint.y]);
		if( (distance > World.Radius-20) && (distance < World.Radius + 20)) 
		{
			owner.moveX *= -1;
			owner.moveY *= -1;
		}
	}
}