class EntityBubbleTank extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.BULLET_SPEED = 900;
		this.AD = 10;
		this.BULLET_SERIES = 3;
		this.BULLET_SERY_DELAY = 10;
		this.ATTACK_SPEED = 2;
		this.ATTACK_RANGE = 850;
		this.FOLLOW_RANGE = 850;
		this.MAXHP = 60;
		this.SPD = 150;
		this.HP = this.MAXHP;
		this.Texture = "bubbleTank";
		
		var bulletStats = 
		{
			Scale: 1
		};

		this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Wander());
		this.AI.Apply(new AI_AttackRange(World.Player, bulletStats));
		
		this.isAggressiveOnHurt = true;
		
		// this.Color = new Color(255, 64, 64);
		this.HitBox.Scale = 1;

		this.scaleTransition = new Transition(1, 0.95, 0.25, true, 0.02, 0.02);

		this.LootTable = new LootTable([
			new LootTableItemData("RingPhysical", 5, 1, 1)
		]);

		this.setScale(2);
	}
	
	Update()
	{
		var distance = MathHelper.GetDistance([this.x, this.y], [World.Player.x, World.Player.y]);
		if(distance < 250)
		{
			this.aggressive = true;
		}
		else if(this.lastHurtBy == World.Player)
		{
			this.aggressive = true;
		}
		
		super.Update();
	}

	Render(ctx)
	{
		this.Scale = this.baseScale * this.scaleTransition.Update();
		super.Render(ctx);
	}
}
World.RegisterEntity(EntityBubbleTank);