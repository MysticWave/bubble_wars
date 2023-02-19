class EntityBat extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.BAT.NAME";

		this.Texture = "entity.bat.base";
        this.Eyes = 'entity.bat.eyes';
        this.wingTextureLeft = 'entity.bat.wing.left';
        this.wingTextureRight = 'entity.bat.wing.right';

		// this.TextureRotation = 180;
		// this.Rotation = 180;

		this.MAXHP = 150;
		this.HP = this.MAXHP;
		this.AD = 20;
		this.ATTACK_SPEED = 1.5;
        this.ATTACK_RANGE = 400;
		this.FOLLOW_RANGE = 350;
        this.BULLET_SPEED = 950;
		this.SPD = 330;
		
		var bulletStats = 
		{
			Type: "BulletSoundWave",
			Scale: 2
		};

		this.isAggressive = true;

		this.AI.Apply(new AI_AttackMelee(Player, this.AD));
        this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Wander(false, 1));
		this.AI.Apply(new AI_AttackRange(World.Player, bulletStats));
		// this.AI.Apply(new AI_ShotOnCircle({
		// 	shotCount: 16,
		// 	shotDelayMin: 8,
		// 	shotDelayMax: 10
		// },
		// {
		// 	Texture: "bullet_enemy",
		// 	Scale: 2
		// }));
		
		this.HitBox.Scale = .5;
		this.attack_frame = 0;

		this.LootTable = new LootTable([
			new LootTableItemData("Cannon2", 5, 1, 1)
		]);

        this.WingAnimation = new Transition(0, 4, .15, true, 0, 0, false);
		this.setScale(1.5);
	}

	Update()
	{
		super.Update();

		if(this.AI.AttackRange)
		{
			var charge = this.AI.AttackRange.attackCharge;
			this.attack_frame = Math.round((charge - 50) / 5);
			if(this.attack_frame < 0) this.attack_frame = 0;
		}
	}

    RenderTexture(context)
	{
		var wing_texture_left = TextureManager.Get(this.wingTextureLeft);
		var wing_texture_right = TextureManager.Get(this.wingTextureRight);
        var base_texture = TextureManager.Get(this.Texture);
        var eyes_texture = TextureManager.Get(this.Eyes);;

        var wing_dist_x = 12 * this.Scale;

        var frame = Math.round(this.WingAnimation.Update());


        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;
        var size = wing_texture_left.width;

        var tX = -this.width * this.Scale / 2;
        var tY = (-this.height * this.Scale / 2) - (5 * this.Scale);

        var left_wing_tX = (tX - this.width * this.Scale / 2) - wing_dist_x;
        var right_wing_tX = (tX + this.width * this.Scale / 2) + wing_dist_x;

        //left wing
        context.save();
		context.translate(x, y);
		context.globalAlpha = this.opacity;
		context.drawImage(wing_texture_left, 0, frame * size, size, size, left_wing_tX, tY, this.width * this.Scale, this.height * this.Scale);
		context.restore();


        // //right wing
        context.save();
		context.translate(x, y);
		context.globalAlpha = this.opacity;
		context.drawImage(wing_texture_right, 0, frame * size, size, size, right_wing_tX, tY, this.width * this.Scale, this.height * this.Scale);
		context.restore();


        //base
        context.save();
		context.translate(x, y);
		context.globalAlpha = this.opacity;
		context.drawImage(base_texture, 0, this.attack_frame * size, size, size, tX, tY, this.width * this.Scale, this.height * this.Scale);
		context.restore();


		if(!this.Eyes) return;
         //Eyes
		Graphic.addPostRenderFunction(Graphic.Layer.LightLevel, () => {
			ChangeLayer(Graphic.Layer.LightLevel);

				ctx.save();
				ctx.globalCompositeOperation = 'source-atop';
				ctx.translate(x, y);
				ctx.globalAlpha = this.opacity;
				ctx.drawImage(eyes_texture, 0,  0, size, size, tX, tY, this.width * this.Scale, this.height * this.Scale);
				ctx.restore();

			RestoreLayer();
		});
	}
}
World.RegisterEntity(EntityBat);























class EntityFatBat extends EntityBat
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.BAT.FAT.NAME";

		this.Texture = "entity.bat.fat.base";

		this.Tier = 1;

		this.MAXHP = 200;
		this.HP = this.MAXHP;
		this.AD = 20;
		this.ATTACK_SPEED = 1.5;
        this.ATTACK_RANGE = 600;
		this.FOLLOW_RANGE = 500;
        this.BULLET_SPEED = 950;
		this.SPD = 300;

		this.isAggressive = true;

		this.AI.Delete('AttackRange');

		this.AI.Apply(new AI_AttackMelee(Player, this.AD));
        this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Wander(false, 1));


		this.LootTable = new LootTable([
			// new LootTableItemData("Cannon2", 5, 1, 1)
		]);

		this.setScale(2.5);

		this.attackAnimationDuration = 30;

		this.isUsingAttack = false;
		this.attackDuration = 5 * Main.FPS;
		this.attackCoolTime = 10 * Main.FPS;
		this.attackStart = MathHelper.randomInRange(3, 5) * Main.FPS;
	}

	Update()
	{
		super.Update();

		var t = this.attackStart - this.ageInTicks;
		if(t <= this.attackAnimationDuration)
		{
			var p = t / this.attackAnimationDuration;
			if(p > 1) p = 1;
			if(p < 0) p = 0;
			this.attack_frame = Math.floor(5 * (1-p));
		}

		if(this.ageInTicks == this.attackStart) this.isUsingAttack = true;

		if(this.isUsingAttack)
		{
			this.allowMove = false;
			var tick = this.ageInTicks-this.attackStart;

			if(MathHelper.GetDistance(this, World.Player) <= this.ATTACK_RANGE)
			{
				var strength = 400;
				var motion = Motion.Get([World.Player.x, World.Player.y], [this.x, this.y], strength);
					World.Player.ApplyMove(motion);
			}

			var angle = MathHelper.randomInRange(0, 360);
			Particle.SummonCirclePattern("bubble", this.x, this.y, 0.4, 1000, 1, 
				this.ATTACK_RANGE, angle, null, false);


			if(tick >= this.attackDuration) 
			{
				this.isUsingAttack = false;
				this.attackStart = this.ageInTicks + this.attackCoolTime;
				this.allowMove = true;
			}
		}


		var t = this.ageInTicks - (this.attackStart - this.attackCoolTime);
		if(t <= this.attackAnimationDuration)
		{
			var p = t / this.attackAnimationDuration;
			if(p > 1) p = 1;
			if(p < 0) p = 0;
			this.attack_frame = Math.floor(5 * (1-p));
		}
	}
}
World.RegisterEntity(EntityFatBat);



















class EntityBlindBat extends EntityBat
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.BAT.BLIND.NAME";

		this.Texture = "entity.bat.blind.base";
        this.Eyes = null;

		this.Tier = 2;

		this.MAXHP = 130;
		this.HP = this.MAXHP;
		this.AD = 30;
		this.ATTACK_SPEED = 0.1;
        this.ATTACK_RANGE = 1000;
		this.FOLLOW_RANGE = 450;
        this.BULLET_SPEED = 2000;
		this.SPD = 290;
		
		var bulletStats = 
		{
			Type: "BulletEcho",
			Scale: 10,
			Bounce: 1,
			Pierce: 1,
			playerEffectChance: 100
		};

		this.AI.Delete('AttackRange');
		this.AI.Apply(new AI_AttackRange(World.Player, bulletStats));
	
		this.LootTable = new LootTable([
			// new LootTableItemData("Cannon2", 5, 1, 1)
		]);


		this.setScale(2);
	}

	Update()
	{
		super.Update();

		if(this.ageInTicks%45 == 0)
		{
			var scale = 20 * this.Scale;
			var x = this.x;
			var y = this.y;
			Particle.Summon('effect.sonic_boom.indicator', x, y, 0, 0, scale, 0, 1, 20, 
			{
				liveTime: 30, 
				owner: this,
				baseScale: scale,
				center: true,
				globalAlpha: 0.5,
				RENDER_LAYER: Graphic.Layer.LightLevel+1,
				onUpdate: function(){this.x = this.owner.x, this.y = this.owner.y;this.Scale = this.baseScale - (this.baseScale * (this.ageInTicks / this.liveTime))}
			});
		}
	}
}
World.RegisterEntity(EntityBlindBat);





