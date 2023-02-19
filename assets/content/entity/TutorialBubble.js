class TutorialBubble extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.level = 1;
		this.BULLET_SPEED = 700;
		this.AD = 5;
		this.BULLET_SERIES = 1;
		this.ATTACK_SPEED = 0.5;
		this.ATTACK_RANGE = 1000;
		this.FOLLOW_RANGE = 1000;
		this.MAXHP = 15;
		this.HP = this.MAXHP;
		this.oxygen = (World.Player?.stats.Level == 1) ? 6 : 1;
		this.Texture = "bubble";
		this.name = 'ENTITY.BUBBLE.NAME';
		
		var bulletStats = 
		{
			Color: new Color(255, 0, 0),
			Scale: 1
		};

		this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Wander());
		this.AI.Apply(new AI_AttackRange(World.Player, bulletStats));
		
		this.isAggressiveOnHurt = true;
		
		this.Color = new Color(255, 64, 64);
		this.HitBox.Scale = 1;

		this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		};

		this.LootTable = new LootTable([]);

		this.setScale(1);
	}
	
	Update()
	{
		super.Update();

		if(this.aggressive)
		{
			this.SPD = 250;
			this.Color = new Color(255, 0, 0);
		}
		else
		{
			this.SPD = 100;
		}
	}
}
World.RegisterEntity(TutorialBubble);