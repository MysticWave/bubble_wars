class EntityBubbleFormation0 extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = 'ENTITY.BUBBLE_FORMATION.1.NAME';
		this.Texture = "entity.bubble.formation.0";
		this.Textures = 
		{
			Base: "entity.bubble.formation.0",
			BaseFrames: 4,
			Shine: "entity.bubble.base.shine"
		};
		this.TextureRotation = 180;
		this.Rotation = 180;

		this.Tier = 1;

		this.MAXHP = 35;
		this.HP = this.MAXHP;
		this.AD = 10;
		this.ATTACK_SPEED = .5;
		this.SPD = 200;

		this.ATTACK_RANGE = 1000;
		this.FOLLOW_RANGE = 1000;
		this.BULLET_SPEED = 800;

        var rotationTime = 1;
        this.rotationSpeed = 360 / (rotationTime * Main.FPS);
        this.baseRotationSpeed = this.rotationSpeed;

		this.allowRotationChange = false;
		
		var bulletStats = 
		{
			Scale: 1
		};

		this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Wander());
		this.AI.Apply(new AI_AttackRange(World.Player, bulletStats));
		
		this.isAggressiveOnHurt = true;

		this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		}

		this.LootTable = new LootTable([
			new LootTableItemData("EnchantGemHP", 5, 1)
		]);

		this.setScale(1);
	}

	Update()
	{
		if(this.AttackRangeCharge >= 40)
		{
			this.allowMove = false;
			this.allowFollow = false;

			this.rotationSpeed = this.baseRotationSpeed * 2;
			if(this.AttackRangeCharge >= 80) this.rotationSpeed = this.baseRotationSpeed * 3;
		}
		else
		{
			this.rotationSpeed = this.baseRotationSpeed;
		}
        
		super.Update();
	}

	RenderTexture(context)
	{
		this.Rotation = (this.Rotation + this.rotationSpeed)%360;

        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;
        var height = this.height;
        var width = this.width;

        var rotation = this.Rotation + this.TextureRotation;
        var scale = this.Scale;
        var alpha = this.Transparency;
		var f = Math.floor((1 - (this.HP / this.MAXHP)) * this.Textures.BaseFrames);

        var textureBase = TextureManager.Get(this.Textures.Base);
        var textureShine = TextureManager.Get(this.Textures.Shine);

        Graphic.DrawRotatedAnimatedImage(context, f, this.Textures.BaseFrames, 'Y', 
			textureBase, x, y, width, height, scale, rotation, alpha);

        Graphic.DrawRotatedImage(context, textureShine, x, y, width, height, scale, 0, alpha);
	}
}
World.RegisterEntity(EntityBubbleFormation0);















class EntityBubbleFormation2 extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = 'ENTITY.BUBBLE_FORMATION.2.NAME';
		this.Textures = 
		{
			Base: "entity.bubble",
			Shine: "entity.bubble.base.shine",
			Shield: "entity.bubble.formation.2.shield"
		};
		this.TextureRotation = 180;
		this.Rotation = 180;

		this.Tier = 2;

		this.MAXHP = 30;
		this.HP = this.MAXHP;
		this.AD = 20;
		this.ATTACK_SPEED = .25;
		this.SPD = 150;

		this.FOLLOW_RANGE = 2000;

        var rotationTime = 1;
        this.rotationSpeed = 360 / (rotationTime * Main.FPS);
        this.baseRotationSpeed = this.rotationSpeed;

		this.allowRotationChange = false;
		

		this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Wander());
		this.AI.Apply(new AI_AttackMelee(Player, 0, 1));
		
		this.isAggressive = true;

		this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		}

		this.Resistance[ELEMENT.PHYSICAL] = true;

		this.LootTable = new LootTable([
			new LootTableItemData("EnchantGemDEF", 5, 1)
		]);

		this.setScale(1);
	}

	RenderTexture(context)
	{
		this.Rotation = (this.Rotation + this.rotationSpeed)%360;

        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;
        var height = this.height;
        var width = this.width;

        var rotation = this.Rotation + this.TextureRotation;
        var scale = this.Scale;
        var alpha = this.Transparency;

        var textureBase = TextureManager.Get(this.Textures.Base);
        var textureShine = TextureManager.Get(this.Textures.Shine);
        var textureShield = TextureManager.Get(this.Textures.Shield);
		var tY = height;
		var shields = 4;
		var angle = 360 / shields;

        Graphic.DrawRotatedImage(context, textureBase, x, y, width, height, scale, this.TextureRotation, alpha);
        Graphic.DrawRotatedImage(context, textureShine, x, y, width, height, scale, 0, alpha);

		for(var i = 0; i < shields; i++)
		{
			Graphic.DrawRotatedImage(context, textureShield, x, y, width, height, scale, rotation + (i*angle), alpha, -tY);
		}
	}
}
World.RegisterEntity(EntityBubbleFormation2);







class EntityBubbleFormation3 extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		this.name = 'ENTITY.BUBBLE_FORMATION.3.NAME';
		
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
		this.Texture = "entity.bubble.formation.3";
		
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
		}

		this.LootTable = new LootTable([
			new LootTableItemData("RingPhysical", 5, 1, 1)
		]);

		this.setScale(2);
	}
}
World.RegisterEntity(EntityBubbleFormation3);








class EntityBubbleFormation4 extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		this.name = 'ENTITY.BUBBLE_FORMATION.4.NAME';

		this.BULLET_SPEED = 900;
		this.AD = 5;
		this.ATTACK_SPEED = 1;
		this.FOLLOW_RANGE = 600;
		this.MAXHP = 90;
		this.SPD = 300;
		this.HP = this.MAXHP;
		this.Texture = "entity.bubble.formation.4";

		this.AI.Apply(new AI_AttackMelee(Player, 0, 2));
		this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Dash(this, Player, false, 3, 5, {dashMultiplier: 5, dashDuration: 15}));
		
		this.aggressive = true;
		
		this.HitBox.Scale = 1;

		this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		}

		this.LootTable = new LootTable([
			// new LootTableItemData("RingPhysical", 5, 1, 1)
		]);

		this.setScale(2);
	}
}
World.RegisterEntity(EntityBubbleFormation4);










class EntityBubbleFormation5 extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		this.name = 'ENTITY.BUBBLE_FORMATION.5.NAME';

		this.BULLET_SPEED = 900;
		this.AD = 10;
		this.BULLET_SERIES = 9;
		this.BULLET_SERY_DELAY = 5;
		this.BULLET_SPEED = 1100;

		this.ATTACK_SPEED = 1;
		this.ATTACK_RANGE = 850;
		this.FOLLOW_RANGE = 600;
		this.MAXHP = 100;
		this.SPD = 250;
		this.HP = this.MAXHP;
		this.Texture = "entity.bubble.formation.5";

		this.AI.Apply(new AI_AttackMelee(Player, 0, 2));
		this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Dash(this, Player, false, 5, 7, {dashMultiplier: 5, dashDuration: 15}));
		this.AI.Apply(new AI_AttackRange(World.Player, {Scale: 1, knockBack: 2}, {shootTrigger: function(o){return !o.isDashing}}));
		
		this.aggressive = true;
		
		this.HitBox.Scale = 1;

		this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		}

		this.LootTable = new LootTable([
			new LootTableItemData('MachineGunBase', 5, 1, 1)
		]);

		this.setScale(2);
	}
}
World.RegisterEntity(EntityBubbleFormation5);







