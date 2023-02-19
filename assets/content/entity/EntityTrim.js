class EntityTrim extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.TRIM.NAME";
		this.Texture = "entity.trim";

		this.TextureRotation = 180;
		this.Rotation = 180;

		this.Tier = 0;

		this.MAXHP = 50;
		this.HP = this.MAXHP;
		this.AD = 10;
		this.ATTACK_SPEED = .25;
		this.SPD = 350;

		this.ATTACK_RANGE = 1000;
		this.FOLLOW_RANGE = 1000;
		this.BULLET_SPEED = 900;

        var rotationTime = 1;
        this.rotationSpeed = 360 / (rotationTime * Main.FPS);
        this.baseRotationSpeed = this.rotationSpeed;

		this.allowRotationChange = false;
		
		var stats = 
		{
            shotCount: 3,
            shotDelayMin: 2,
            shotDelayMax: 5,
            getStartAngleFromOwnerRotation: true
		};

		this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Wander());
		this.AI.Apply(new AI_ShotOnCircle(stats,
		{
			Scale: 1
		}));
        this.AI.Apply(new AI_AttackMelee(Player, 0, 1));
		
		this.isAggressiveOnHurt = true;

		this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		}

		this.LootTable = new LootTable([
			new LootTableItemData("EnchantGemMP", 5, 1)
		]);
		this.canMoveWhileShooting = false;

		this.setScale(2);
	}

	Update()
	{
		if(this.shotOnCircleCharge >= 40)
		{
			this.allowMove = this.canMoveWhileShooting;
			this.allowFollow = this.canMoveWhileShooting;

			this.rotationSpeed = this.baseRotationSpeed * 2;
			if(this.shotOnCircleCharge >= 80) this.rotationSpeed = this.baseRotationSpeed * 3;
		}
		else
		{
			this.rotationSpeed = this.baseRotationSpeed;
		}
        
		super.Update();
	}

	RenderTexture(context)
	{
		if(!this.isBoss)this.Rotation = (this.Rotation + this.rotationSpeed)%360;
        this.Transparency = .2 + ((this.HP / this.MAXHP) * .8);

        super.RenderTexture(context);
	}
}
World.RegisterEntity(EntityTrim);














class EntityFatTrim extends EntityTrim
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.TRIM.FAT.NAME";
		this.Texture = "entity.trim.fat";

		this.MAXHP = 80;
		this.HP = this.MAXHP;
		this.AD = 20;
		this.ATTACK_SPEED = 1;
		this.SPD = 300;

		this.FOLLOW_RANGE = 1000;

		this.Tier = 1;


		this.AI.Delete('ShotOnCircle');


		this.LootTable = new LootTable([
			new LootTableItemData("EnchantGemAS", 5, 1),
			new LootTableItemData("RocketLauncher1", 5, 1)
		]);
		this.setScale(2);
	}
}
World.RegisterEntity(EntityFatTrim);











class EntityTrimFormation0 extends EntityTrim
{
	constructor(x, y, type = 3)
	{
		super(x, y);
		
		this.type = type;
		this.name = "ENTITY.TRIM.FORMATION.0.NAME";
		this.Texture = "entity.trim.formation.0."+type;

		this.MAXHP = 2**(3+type);
		this.HP = this.MAXHP;
		this.AD = 10;
		this.SPD = 400;

		this.FOLLOW_RANGE = 1000;
		this.Tier = 2;
		

		var stats = 
		{
            shotCount: 6,
            shotDelayMin: 4,
            shotDelayMax: 6,
            getStartAngleFromOwnerRotation: true
		};

		this.AI = new AI();
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_ShotOnCircle(stats,
		{
			Scale: 1
		}));
        this.AI.Apply(new AI_AttackMelee(Player, 0, 1));
		this.AI.Apply(new AI_Bounce(this, MathHelper.randomInRange(0, 360)));


		this.rotationSpeed /= 2;

		this.dropOxygen = false;
		this.dropLoot = false;

		this.LootTable = new LootTable([
			new LootTableItemData("EnchantGemADp", 5, 1)
		]);
		this.setScale(4);

		if(this.type == 1) 
		{
			this.dropOxygen = true;
			this.dropLoot = true;

			this.setScale(2);
		}
	}

	onKill()
	{

		if(this.type <= 1) return;

		var angle = MathHelper.getAngle2(this, World.Player)+90;

		var e = new EntityTrimFormation0(this.x, this.y, this.type-1);
			e.AI.Apply(new AI_Bounce(e, angle));
			e.level = this.level;
		World.AddEntity(e);

		var e2 = new EntityTrimFormation0(this.x, this.y, this.type-1);
			e2.AI.Apply(new AI_Bounce(e2, angle-180));
			e2.level = this.level;
		World.AddEntity(e2);
	}
}
World.RegisterEntity(EntityTrimFormation0);