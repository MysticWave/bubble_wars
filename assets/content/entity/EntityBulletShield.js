class EntityBulletShield extends Entity
{
	constructor(x, y)
	{
		super(x, y);

		this.MAXHP = 10000;
		this.HP = this.MAXHP;
		this.oxygen = 0;
		this.Texture = "bubble";
		
		this.Scale = 0.5;
		this.HitBox.Scale = 1;

		this.baseScale = this.Scale;
		this.scaleTransition = new Transition(1, 0.95, 0.25, true, 0.02, 0.02);
		this.isFromPlayer = true;

		this.ChangedTick = null;
		this.Immunity.ALL = true;
	}

	Hurt(){return}
	
	Update()
	{
		super.Update();

		var r = this.AI.OrbitAround.radius;
		var hide_time = Main.FPS * .5;
		var p = 0;

		if(World.isChangingLocation)
		{
			//hide orbs when changing location
			p = 1 - (World.currentChangeTime / hide_time);
			if(p < 0) p = 0;

			this.OrbitRadius = r * p;
			this.Transparency = p;
		}
		else
		{
			
			p = (World.timeSinceRoomChange / hide_time);
			if(p > 1) p = 1;

			this.OrbitRadius = r * p;
			this.Transparency = p;
		}
	}

	Render(ctx)
	{
		this.Scale = this.baseScale * this.scaleTransition.Update();
		super.Render(ctx);
	}
}
World.RegisterEntity(EntityBulletShield);