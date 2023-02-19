class OrbitTest extends EntityBubble
{
	constructor(x, y)
	{
		super(x, y);
		
		this.level = 5;
		this.name = "Orbit Test";
		this.Title = "NASA, can you hear me?";
		this.Subtitle = "";
		
		this.MAXHP = 2000;
		this.HP = 2000;
		this.AD = 40;
		this.ATTACK_SPEED = 1;
		
		this.oxygen = 200;
		
		this.AI.Delete("AttackRange");
		this.AI.Apply(new AI_AttackMelee(Player, this.AD));
		this.AI.Apply(new AI_Boss(this));

		this.BossTheme = "interface.BossFight2";
		
		this.HitBox.Scale = 1;

		Commands.ApplyEffect(this, 'regeneration', 5, 9999999);




		this.HitBox.Update(this);

		var angle = 0;
		var angleStep = 360 / 40;
		var radius = this.HitBox.Radius + 10;
		this.OrbitRadiusTransition = new Transition(1, 1.4, 1, true, 1, 1);

		for(var i = 0; i < 40; i++)
		{
			angle += angleStep;

			var entity = new EntityBubble();
				entity.AI.Apply(new AI_OrbitAround(this, 90, radius, angle));
				entity.AI.Apply(new AI_AttackMelee(Player, this.AD));

				entity.AI.Delete("AttackRange");
				entity.AI.Delete("Follow");
				entity.AI.Delete("Wander");


				entity.isHidden = true;
				entity.isAggressive = true;
				entity.oxygen = 0;
				entity.spawnHeart = false;
				entity.ATTACK_SPEED = Main.FPS;

			World.AddEntity(entity);
		}

		this.setScale(10);
	}

	Update()
	{
		super.Update();

		this.OrbitRadius = (this.HitBox.Radius + 10) * this.OrbitRadiusTransition.Update();
	}
}
World.RegisterEntity(OrbitTest);



