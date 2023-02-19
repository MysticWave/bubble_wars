class EntityBubble extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.BULLET_SPEED = 800 + (this.level * 20);
		this.AD = 10;
		this.BULLET_SERIES = 1;
		this.ATTACK_SPEED = 1;
		this.ATTACK_RANGE = 1000;
		this.FOLLOW_RANGE = 1000;
		this.MAXHP = 20;
		this.HP = this.MAXHP;
		this.Texture = "bubble";
		this.name = 'ENTITY.BUBBLE.NAME';
		
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

		this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		};

		this.LootTable = new LootTable([
			new LootTableItemData("Cannon1", 10, 1, 1),
			new LootTableItemData("EnchantGemAD", 5, 1, 1)
		]);

		this.setScale(1);
	}
	
	Update()
	{
		super.Update();
		if(!this.isBoss)
		{
			if(this.aggressive)
			{
				this.SPD = 240 + (this.level * 10);
				this.Color = new Color(255, 0, 0);
			}
			else
			{
				this.SPD = 90 + (this.level * 10);
			}
		}
	}
}
World.RegisterEntity(EntityBubble);