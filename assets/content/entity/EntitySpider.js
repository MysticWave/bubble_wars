class EntitySpider extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "Spider";
		this.Title = "";

		this.Texture = "entity.spider.base";
        this.TextureLegLeft = 'entity.spider.leg.left';
        this.TextureLegRight = 'entity.spider.leg.right';
        this.TextureFangLeft = 'entity.spider.fang.left';
        this.TextureFangRight = 'entity.spider.fang.right';
        this.TextureBase2 = 'entity.spider.base.2';
        this.defaultRotation = 180;

		this.MAXHP = 50;
		this.HP = this.MAXHP;
		this.AD = 10;
		this.ATTACK_SPEED = 1.5;
        this.ATTACK_RANGE = 10000;
		this.FOLLOW_RANGE = 350;
		this.ATTACK_RANGE_MIN = this.FOLLOW_RANGE;
        this.BULLET_SPEED = 950;
		this.SPD = 800;
		
		var bulletStats = 
		{
			// Type: "BulletSoundWave",
			Scale: 1
		};

		

		this.AI.Apply(new AI_AttackMelee(Player, this.AD));
        this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Wander(true, .5, 2));
		this.AI.Apply(new AI_Observe(World.Player, this.ATTACK_RANGE, function(owner){return owner.aggressive;}));
		this.AI.Apply(new AI_AttackRange(World.Player, bulletStats));
		

		this.isAggressiveOnHurt = true;
		this.HitBox.Scale = .75;

        this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		};

		this.legsAnimDuration = (150 / this.SPD) * .5;

        this.legsAnimation = new Transition(-10, 10, this.legsAnimDuration, true, 0, 0, false);
        this.tailAnim = new Transition(1, .9, .5, true, 0, 0, false);

		var bodyHitBox = new HitBox();
			bodyHitBox.Scale = this.HitBox.Scale;
			bodyHitBox.translationY = -.95;

		this.advancedHitBox.push(bodyHitBox);

		// this.setScale(1);
	}

    RenderTexture(context)
	{
        var base = TextureManager.Get(this.Texture);
        var base2 = TextureManager.Get(this.TextureBase2);
		var legLeft = TextureManager.Get(this.TextureLegLeft);
		var legRight = TextureManager.Get(this.TextureLegRight);
        var fangLeft = TextureManager.Get(this.TextureFangLeft);
        var fangRight = TextureManager.Get(this.TextureFangRight);


        var ratio = this.width / 512;

        var legs = {width: 100, height: 300, length: 190 * ratio, tY: 60 * ratio / 2, textureSpaceY: 15 * ratio, angles: 
        [
            -50, -75, -105, -130
        ], 
        baseRotation:
        [
            160, 140, 35, 15,
            -15, -35, -140, -160
        ]};
        var fangs = {width: 50, height: 100, angles: [-165, -195], tY: 10 * ratio, textureSpaceY: 3 * ratio};


        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;
        var width = this.width;
        var height = this.height;
        var rotation = this.Rotation;
        var alpha = this.Transparency;
        var scale = this.Scale;

        var legAnim = this.legsAnimation.Update();
        var tailHeight = this.tailAnim.Update();

        //render base
        Graphic.DrawRotatedImage(context, base, x, y, width, height, scale, rotation, alpha);
        Graphic.DrawRotatedImage(context, base2, x, y, width, height * tailHeight, scale, rotation, alpha, 0, (height * .43 + (height * tailHeight)) / 2);


        //render legs
        for(var i = 0; i < 8; i++)
		{
            var texture = legRight;
            if(i == 2 || i == 3 || i == 6 || i == 7) texture = legLeft;

            var rotAnimDir = (i%2 == 0) ? 1 : -1;

            var angle = (i < 4) ? 180 : 0;
            angle += (i < 4) ? legs.angles[i] : legs.angles[i-4];

            var endPoints = [
                x,
                y + legs.length * scale
            ];
            var pos = MathHelper.RotatePoint([x, y], rotation + angle, endPoints);

			// var rotation = weaponHandPose.rotation ?? hand[5] ?? 0;

            var l_width = legs.width * ratio;
            var l_height = legs.height * ratio;

			context.save();
			context.translate(pos.x, pos.y);
			context.rotate((rotation + legs.baseRotation[i] + legAnim * rotAnimDir) * Math.PI/180);
			context.globalAlpha = alpha;
			context.drawImage(
				texture, 0, 0, texture.width, texture.height,
				-((l_width / 2)) * scale, -(legs.tY + legs.textureSpaceY) * scale,
				(l_width * scale), (l_height * scale)
			);
			context.restore();
		}



        //render fangs
        for(var i = 0; i < 2; i++)
		{
            var texture = fangLeft;
            var rotAnimDir = -1;
            if(i == 1) 
            {
                texture = fangRight;
                rotAnimDir = 1;
            }

            var angle = 180 + fangs.angles[i];

            var endPoints = [
                x,
                y + legs.length * scale * .9
            ];
            var pos = MathHelper.RotatePoint([x, y], rotation + angle, endPoints);

			// var rotation = weaponHandPose.rotation ?? hand[5] ?? 0;

            var f_width = fangs.width * ratio;
            var f_height = fangs.height * ratio;

			context.save();
			context.translate(pos.x, pos.y);
			context.rotate((rotation + legAnim * rotAnimDir) * Math.PI/180);
			context.globalAlpha = alpha;
			context.drawImage(
				texture, 0, 0, texture.width, texture.height,
				-((f_width / 2)) * scale, -(fangs.tY + fangs.textureSpaceY) * scale,
				(f_width * scale), (f_height * scale)
			);
			context.restore();
		}

        return;
	}
}
World.RegisterEntity(EntitySpider);











class EntityLittleLakeSpider extends EntitySpider
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.SPIDER.LITTLE.LAKE.NAME";
		this.description = "ENTITY.SPIDER.LITTLE.LAKE.DESCRIPTION";
		this.Title = "";

		this.MAXHP = 30;
		this.HP = this.MAXHP;
		this.AD = 10;
		this.ATTACK_SPEED = 1.5;
        this.ATTACK_RANGE = 10000;
		this.FOLLOW_RANGE = 350;
		this.ATTACK_RANGE_MIN = this.FOLLOW_RANGE;
        this.BULLET_SPEED = 950;
		this.SPD = 800;
		
		var bulletStats = 
		{
			// Type: "BulletSoundWave",
			Scale: 1
		};

		this.AI = new AI();

		this.AI.Apply(new AI_AttackMelee(Player, this.AD));
        this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Wander(true, .5, 2));
		this.AI.Apply(new AI_Observe(World.Player, this.ATTACK_RANGE, function(owner){return owner.aggressive;}));
		this.AI.Apply(new AI_AttackRange(World.Player, bulletStats));
		

		this.LootTable = new LootTable([
			new LootTableItemData("EnchantCrystalAD", 5, 1, 1)
		]);


		this.timeToGrow = MathHelper.randomInRange(60, 120) * Main.FPS;
		this.minScale = .75;
		this.maxScale = 1.4;

		this.setScale(.75);
	}

	Update()
	{
		super.Update();

		var growProgress = this.ageInTicks / this.timeToGrow;
		var scaleStep = this.maxScale - this.minScale;
		var new_scale = Math.round((this.minScale + (scaleStep * growProgress)) * 10) / 10;

		if(this.baseScale < new_scale) this.setScale(new_scale);

		if(growProgress >= 1) this.Grow();
	}

	Grow()
	{
		console.log('grow');
		var largeVersion = new EntityLakeSpider();
			largeVersion.x = this.x;
			largeVersion.y = this.y;
			largeVersion.Rotation = this.Rotation;

		World.AddEntity(largeVersion);
		World.Kill(this);
	}
}
World.RegisterEntity(EntityLittleLakeSpider);






class EntityLakeSpider extends EntitySpider
{
	constructor(x, y)
	{
		super(x, y);

		this.TextureBase2 = 'entity.spider.base.2.medium';
		
		this.name = "ENTITY.SPIDER.LAKE.NAME";
		this.description = "ENTITY.SPIDER.LAKE.DESCRIPTION";
		this.Title = "";


		this.Tier = 1;

		this.MAXHP = 75;
		this.HP = this.MAXHP;
		this.AD = 15;
		this.ATTACK_SPEED = 1.5;
        this.ATTACK_RANGE = 10000;
		this.FOLLOW_RANGE = 350;
		this.ATTACK_RANGE_MIN = this.FOLLOW_RANGE;
        this.BULLET_SPEED = 950;
		this.SPD = 700;
		
		var bulletStats = 
		{
			// Type: "BulletSoundWave",
			Scale: 1
		};

		this.AI = new AI();

		this.AI.Apply(new AI_AttackMelee(Player, this.AD));
        this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Wander(true, 2, 4));
		this.AI.Apply(new AI_Observe(World.Player, this.ATTACK_RANGE, function(owner){return owner.aggressive;}));
		this.AI.Apply(new AI_AttackRange(World.Player, bulletStats));

		this.AI.Apply(new AI_LayEgg(10, 30, 5, 'EntityLakeEgg'));
		

		this.LootTable = new LootTable([
			new LootTableItemData("EnchantCrystalDEF", 5, 1, 1)
		]);

		this.setScale(1.5);

		this.isLayingEgg = false;
	}

	Update()
	{
		super.Update();

		if(this.isLayingEgg)
		{
			this.allowMove = false;
			this.allowRotationChange = false;
			this.Rotation = 0;
			this.aggressive = false;
		}
		else
		{
			this.allowMove = true;
			this.allowRotationChange = true;
		}
	}
}
World.RegisterEntity(EntityLakeSpider);


class EntityLakeEgg extends EntityEgg
{
	constructor(x, y, owner, stats = {})
	{
		super(x, y, owner, stats);
		
		this.name = "Lake Egg";
		this.Title = "";

		this.webTexture = 'entity.spider.web';

		this.MAXHP = 150;
		this.HP = this.MAXHP;


		var entityType = stats.entityType ?? 'EntityLittleLakeSpider';
		var entityCount = stats.entityCount ?? MathHelper.randomInRange(1, 4);

		var entities = entityCount
		for(var i = 0; i < entities; i++)
		{
			this.contains[i] = entityType;
		}
	}

	RenderTexture(context)
	{
		var webTexture = TextureManager.Get(this.webTexture);

		var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;
        var width = this.width;
        var height = this.height;
        var rotation = 0;
        var alpha = this.Transparency;
        var scale = this.Scale * 2;

        Graphic.DrawRotatedImage(context, webTexture, x, y, width, height, scale, rotation, alpha);

		super.RenderTexture(context);
	}
}
World.RegisterEntity(EntityLakeEgg);















class EntityDashingLakeSpider extends EntitySpider
{
	constructor(x, y)
	{
		super(x, y);

		this.TextureBase2 = 'entity.spider.base.2.dash';
		this.Texture = 'entity.spider.base.dash';
		this.TextureLegLeft = 'entity.spider.leg.left.dash';
        this.TextureLegRight = 'entity.spider.leg.right.dash';
		
		this.name = "ENTITY.SPIDER.DASHING.LAKE.NAME";
		this.description = "ENTITY.SPIDER.DASHING.LAKE.DESCRIPTION";

		this.Tier = 2;

		this.MAXHP = 80;
		this.HP = this.MAXHP;
		this.AD = 15;
		this.ATTACK_SPEED = 1;
		this.FOLLOW_RANGE = 750;
		this.SPD = 650;
		
		this.AI = new AI();
		this.AI.Apply(new AI_AttackMelee(Player, this.AD, 1, {onCollisionEffects: [['Stun', 1, 1, false]], collisionEffectTrigger: function(owner){return owner.isDashing;}}));
        this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Wander(true, 2, 4));
		this.AI.Apply(new AI_Observe(World.Player, this.FOLLOW_RANGE, function(owner){return owner.isPreparingDash;}));
		this.AI.Apply(new AI_Dash(this, Player, true, 3, 6, {timeToDash: 30, targetRange: this.FOLLOW_RANGE, dashMultiplier: 4, dashDuration: 10, dashesInRow: 2, dashesInRowDelay: 30}));

		this.LootTable = new LootTable([
			new LootTableItemData("EnchantCrystalBlock", 5, 1, 1)
		]);

		this.isPreparingDash = false;

		this.setScale(1.5);
	}

	Update()
	{
		super.Update();

		if(this.isDashing) this.allowRotationChange = false;
		else this.allowRotationChange = true;

		if(this.toDashProgress >= 80)
		{
			this.allowMove = false;
			this.isPreparingDash = true;
		}
		else
		{
			this.allowMove = true;
			this.isPreparingDash = false;
		}
	}
}
World.RegisterEntity(EntityDashingLakeSpider);





