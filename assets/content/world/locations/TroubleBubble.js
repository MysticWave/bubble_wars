class TroubleBubble extends Location
{
	constructor()
	{
		super();
		this.Radius = 1000;
		this.Stage = 0;
		this.Title = " ";
		this.Subtitle = " ";
		this.Perfect = false;
		this.isCleared = true;
		this.BackgroundTheme = "interface.InGameCalm";
	}

	onLoad()
	{
		SoundManager.Play(this.BackgroundTheme, "BACKGROUND");
	}
	
	Update()
	{
		this.isCleared = true;
		for(var i = 0; i < World.Entities.length; i++)
		{
			if( (!(World.Entities[i] instanceof Oxygen)) && (!(World.Entities[i] instanceof EntityUpgrade)))
			{
				this.isCleared = false;
				break;
			}
		}

		if( this.isCleared && !InGame.stageClear)
		{
			this.StageClear();
		}
		
		this.Title = " ";
		this.Subtitle = " ";

		var stage = (this.isCleared) ? this.Stage + 1 : this.Stage;
		
		if(stage == 1)
		{
			this.Title = "Welcome to Bubble Wars!";
			this.Subtitle = "Use WSAD to move";
		}
		
		if(stage == 3)
		{
			this.Subtitle = "Watch out for Mines!";
		}
		
		if(stage == 5)
		{
			this.Subtitle = "The fat one...";
		}
	}
	
	StageClear()
	{
		if(World.Player)
		{
			InGame.stageClear = true;
			this.Perfect = false;
			
			var reward = World.Player.requiredOxygen * 20 / 100;
			if(!World.Player.hurted)
			{
				this.Perfect = true;
				reward *= 2;
			}

			if(this.Stage)
			{
				World.AddEntity(new Oxygen(World.CenterPoint.x, World.CenterPoint.y, reward));
				if((this.Stage > 5) && this.Perfect)
				{
					//generuje przedmiot przy odrobinie szczescia, gdy gracz przeszedl
					//poziom powyzej 5 na perfect

					var chance = 5;
					var luck = MathHelper.randomInRange(0, 100);
					
					if(chance > luck) Upgrade.Spawn(World.Player, World.CenterPoint.x, World.CenterPoint.y);
				}
			}
		}
	}

	NewStage()
	{
		InGame.stageClear = false;
		InGame.stageClearTime = 0;
		InGame.stageClearTitleTime = 0;
		World.Player.hurted = false;
		this.Stage++;
		
		
		var stage = this.Stage;
		
		var enemies = 4 + stage;
		var enemyList = [];
		
		for(var entity in World.EntityList)
		{
			if( (World.EntityList[entity].level <= this.Stage) && (World.EntityList[entity].maxLevel >= this.Stage))
			{
				if(World.EntityList[entity].isBoss)
				{
					if(World.EntityList[entity].level == this.Stage)
					{
						World.AddEntity(new World.EntityList[entity].constructor(World.CenterPoint.x, World.CenterPoint.y));
					}
				}
				else
				{
					enemyList.push(World.EntityList[entity]);
				}
			}
		}


		
		if(stage == 10)
		{
			//boss
			enemies = 0;
		}
		
		if(stage == 15)
		{
			//boss
			var boss = new EntityFrostTurret(World.Width * TileSize / 2, World.Height * TileSize / 2, 20);
				boss.isBoss = true;
				boss.name = "Turret from Howling Abbys";
				boss.Scale = 10;
				boss.MAXHP = 1500;
				boss.HP = 1500;
				boss.oxygen = 500;
				boss.AD = 1;
				boss.ATTACK_RANGE = 2000;
				boss.BULLET_SPEED = 400;
				boss.ATTACK_SPEED = 60;
				boss.AI.Apply(new AI_ShotOnCircle({shotCount: 16, shotDelayMin: 0.5, shotDelayMax: 2}, {spd: 600, damage: 30, Texture: "projectile_spike", Scale: 2, width: 15, height: 28}));
			World.AddEntity(boss);
			
			enemies = 0;
		}
		
		if(stage == 20)
		{
			//boss
			var boss = new EntityLaserTurret(World.Width * TileSize / 2, World.Height * TileSize / 2, 20);
				boss.isBoss = true;
				boss.name = "The Destroyer";
				boss.Scale = 10;
				boss.MAXHP = 10000;
				boss.HP = 10000;
				boss.oxygen = 1000;
				boss.AD = 5;
				boss.ATTACK_RANGE = 2000;
			World.AddEntity(boss);
			
			enemies = 10;
			enemyList = [EntityFrostTurret];
		}
		
		for(var i = 0; i < enemies; i++)
		{
			var entityType = MathHelper.randomInRange(0, enemyList.length - 1);
			
			var pos = MathHelper.getRandomPointInRange([World.CenterPoint.x, World.CenterPoint.y], World.Radius - 100);
			
			var entity = new enemyList[entityType].constructor(pos.x, pos.y);
			World.AddEntity(entity);
		}
	}
	
	Render()
	{
		
		// super.Render();
	}
}
World.InitializeLocation(TroubleBubble);