class RubberDuck extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.level = 2;
		this.name = "Rubber Duck";
		this.Title = "";
		this.Subtitle = "Don`t be afraid!";
		this.Texture = "entity.rubberDuck";
		this.TextureRotation = 180;
		this.Rotation = 180;

		this.MAXHP = 500;
		this.HP = this.MAXHP;
		this.AD = 10;
		this.ATTACK_SPEED = 1;
		this.SPD = 200;
		this.BULLET_SPEED = 350;
		this.FOLLOW_RANGE = 99999;
		// this.Color = new Color(0, 255, 0);

		this.oxygen = (World.Player?.stats.Level == 2 && World.Player?.oxygen < 100) ? 83 : 1;

		this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_AttackMelee(Player, this.AD));
		this.AI.Apply(new AI_Boss(this));
		this.AI.Apply(new AI_ShotOnCircle({
			shotCount: 16,
			shotDelayMin: 8,
			shotDelayMax: 10
		},
		{
			Scale: 2
		}));

		this.BossTheme = "interface.BossFight2";
		
		this.HitBox.Scale = .95;

		this.LootTable = new LootTable([new LootTableItemData('StarterBag', 100, 1, 1)]);

		this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		};

		this.setScale(10);
	}

	Update()
	{
		if(this.shotOnCircleCharge >= 80)
		{
			this.allowMove = false;
			this.allowFollow = false;

			if(this.ageInTicks%10 == 0)
			{
				this.Color = (this.Color == 'none' || !this.Color) ? new Color(200, 0, 0) : 'none';
			}
		}
		else
		{
			this.Color = 'none';
		}
		super.Update();
	}
}
World.RegisterEntity(RubberDuck);



