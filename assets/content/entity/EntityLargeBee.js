class EntityLargeBee extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.SPIDER.LAKE.QUEEN.NAME";
		this.description = "ENTITY.SPIDER.LAKE.QUEEN.DESCRIPTION";

		this.MAXHP = 2500;
		this.HP = this.MAXHP;
		this.AD = 10;
		this.ATTACK_SPEED = 1.5;
        this.ATTACK_RANGE = 1500;
		this.FOLLOW_RANGE = 750;
        this.BULLET_SPEED = 1800;
		this.SPD = 150;
		
        var bullet_stats = 
        {
            Scale: 1,
			Type: 'BulletSting',
			bullets: 0
        };

        this.AI.Apply(new AI_Wander(true, 4, 8));
		this.AI.Apply(new AI_AttackMelee(Player, this.AD));
        this.AI.Apply(new AI_Follow(World.Player, false, function(o){return o.aggressive || o.interestedIn}));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Observe(World.Player, this.ATTACK_RANGE, function(owner){return owner.isFlying && owner.aggressive;}));
        this.AI.Apply(new AI_AttackRange(World.Player, bullet_stats, {updateTrigger: function(owner){return owner.isFlying;}}));


        this.aggressive = false;
        this.isAggressive = false;
        this.isAggressiveOnHurt = true;

        this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		};

		this.HitBox.Scale = .5;

		var bodyHitBox = new HitBox();
			bodyHitBox.Scale = this.HitBox.Scale * 1.2;
			bodyHitBox.translationY = 0.72;

		this.advancedHitBox.push(bodyHitBox);

        this.Model = new LargeBeeModel(this);
		this.setScale(3);

        this.enragedAnimationDuration = 4 * Main.FPS;

        this.FlyDuration = 7 * Main.FPS;
        this.FlyTick = 0;

        this.DropHoneyChance = 3;

		this.invincibleScale = 3;
		this.LootTable = new LootTable();

        this.honeyPiecesOnTake = 2;
        this.interestedIn = null;
        this.canFlyAway = true;
        this.gotChunk = false;

        this.LookForHoneyDelay = MathHelper.randomInRange(10, 20) * Main.FPS;
        this.LookForHoneyTime = this.LookForHoneyDelay;
        this.timeToFlyAway = MathHelper.randomInRange(5, 10) * Main.FPS;

		this.honeyStats = {};
    }

    onHoneyGrab(){}

    onHurt()
    {
        this.Fly();
    }

    Fly()
    {
        if(this.isFlying) return;

        this.isFlying = true;
        this.SPD *= 5;
        this.FlyTick = 0;
    }

    FlyEnd()
    {
        if(!this.isFlying) return;

        this.isFlying = false;
        this.SPD /= 5;
        this.aggressive = false;

        this.AI.Wander.changeDir();
    }

    LookForHoney()
    {
        var honey = [];
        for(var i in World.Entities)
        {
            var e = World.Entities[i];
            if(!(e instanceof EntityHoneyChunk)) continue;
            honey.push(e);
        }

        if(honey.length)
        {
            var index = MathHelper.randomInRange(0, honey.length-1);
            this.interestedIn = honey[index];
            this.interestedIn.timeToSummon = this.interestedIn.ageInTicks + this.interestedIn.summonDelay;          //resets summon time of chunk
        }
    }

	SummonHoney()
	{
		var pos = MathHelper.getRandomPointInRange(World.CenterPoint, World.Radius*.9);
		var e = new EntityHoneyDrop(pos.x, pos.y);
		e.honeyStats = this.honeyStats;

		World.AddEntity(e);
	}

    Update()
    {
        super.Update();

        if(this.ageInTicks%60 == 0 && MathHelper.GetChance(this.DropHoneyChance)) this.SummonHoney();

        if(this.isFlying)
        {
            this.FlyTick++;
            if(this.FlyTick >= this.FlyDuration)
            {
                this.FlyEnd();
            }
        }

        if(this.ageInTicks >= this.LookForHoneyTime)
        {
            this.LookForHoney();
            this.LookForHoneyTime = this.ageInTicks + this.LookForHoneyDelay;
        }

        if(this.interestedIn)
        {
            if(!this.gotChunk)
            {
                var dist = MathHelper.GetDistance(this.interestedIn, this);
                if(dist > 50)
                {
                    this.AI.Follow.toFollow = this.interestedIn;
                    if(dist > 500) this.Fly();
                    // console.log('InterestedIn');
                }
                else
                {
                    this.AI.Follow.toFollow = World.Player;
                    this.FlyEnd();
                }

                if(dist <= 50)
                {
                    this.interestedIn.HP -= this.honeyPiecesOnTake;
                    this.Heal(5, true);
                    this.gotChunk = true;
                    this.timeToFlyAway += this.ageInTicks;
                    this.interestedIn = null;
                    // console.log('Chunk');

                    this.onHoneyGrab();
                }
            }
 

            if(!this.interestedIn?.isAlive) this.interestedIn = null;
        }

        if(this.gotChunk && !this.isFlyingAway && this.canFlyAway)
        {
            this.allowMove = false;
            if(this.ageInTicks >= this.timeToFlyAway)
            {
                var destination = 
                {
                    x: World.CenterPoint.x - World.Radius * 2,
                    y: World.CenterPoint.y - World.Radius * 2
                };

                this.AI = new AI();
                this.AI.Apply(new AI_Walk());

                this.FlyDuration = 999999;
                this.isFlying = false;
                this.Fly();

                var motion = Motion.Get(this, destination, this.SPD);
                this.moveX = motion.x;
                this.moveY = motion.y;
                this.Rotation = motion.angle+90;
                this.allowMove = true;

                this.ignoreBorder = true;
                this.isFlyingAway = true;
            }
        }

        
    }

}
// World.RegisterEntity(EntityLargeBee);




class EntityLakeLargeBee extends EntityLargeBee
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.BEE.LAKE.LARGE.NAME";
		this.description = "ENTITY.BEE.LAKE.LARGE.DESCRIPTION";

		this.MAXHP = 80;
		this.HP = this.MAXHP;
		this.AD = 10;
		this.ATTACK_SPEED = 1.5;
        this.ATTACK_RANGE = 1500;
		this.FOLLOW_RANGE = 750;
        this.BULLET_SPEED = 1800;
		this.SPD = 150;

        this.aggressive = false;
        this.isAggressive = false;
        this.isAggressiveOnHurt = true;


        this.Model = new LargeBeeModel(this);
		this.setScale(2);

        this.FlyDuration = 7 * Main.FPS;

        this.DropHoneyChance = .1;
		this.LootTable = new LootTable([
            new LootTableItemData('NecklaceRegeneration', 10, 1, 1)
        ]);
    }
}
World.RegisterEntity(EntityLakeLargeBee);





class EntityLakeLittleBee extends EntityLargeBee
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.BEE.LAKE.LITTLE.NAME";
		this.description = "ENTITY.BEE.LAKE.LITTLE.DESCRIPTION";

		this.MAXHP = 40;
		this.HP = this.MAXHP;
		this.AD = 5;
		this.ATTACK_SPEED = 1.5;
        this.ATTACK_RANGE = 1500;
		this.FOLLOW_RANGE = 750;
        this.BULLET_SPEED = 1800;
		this.SPD = 150;

        this.aggressive = false;
        this.isAggressive = false;
        this.isAggressiveOnHurt = true;


        this.Model = new LargeBeeModel(this, 'entity.bubblebee.small.', true);
		this.setScale(1);

        this.FlyDuration = 5 * Main.FPS;

        this.DropHoneyChance = .1;
		this.LootTable = new LootTable([
            // new LootTableItemData('TreasureOrbAquamantula', 100, 1, 1)
        ]);
    }
}
World.RegisterEntity(EntityLakeLittleBee);










class EntityHoneyChunk extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.HONEY.CHUNK.NAME";
		this.description = "ENTITY.HONEY.CHUNK.DESCRIPTION";
        this.Texture = 'entity.honey.chunk.1';

		this.MAXHP = 10;
		this.HP = this.MAXHP;
		this.AD = 0;

		this.setScale(1);

		this.LootTable = new LootTable([
            new LootTableItemData('HoneyPiece', 10, 1, 2)
        ]);

        this.mustBeKilled = false;

        this.animationDuration = 30;

        this.EntitiesToSummon = [EntityLakeLittleBee];
        this.MaxEntities = 5;
        this.MinEntities = 3;

        this.summonDelay = MathHelper.randomInRange(30, 50) * Main.FPS;
        this.timeToSummon = this.summonDelay;
    }

    onPlayerCollision(p)
    {
        p.Heal(5, true);
        ApplyEffect(p, 'Slow', 90, .5);

        this.dropLoot = false;
        this.Kill();
    }

    Update()
    {
        super.Update();

        if(this.ageInTicks <= this.animationDuration)
        {
            var p = this.ageInTicks/this.animationDuration;
            this.Scale = this.baseScale * p;
        }

		if(!World.Location.isCleared)
		{
			if(this.ageInTicks == this.timeToSummon)
			{
				this.SummonEntities();
				this.timeToSummon = this.ageInTicks + this.summonDelay;
			}
		}
    }

    SummonEntities()
    {
        var entities = MathHelper.randomInRange(this.MinEntities, this.MaxEntities);
        for(var i = 0; i < entities; i++)
        {
            var pos = MathHelper.getRandomPointInRange(World.CenterPoint, World.Radius-50, World.Radius - 60);

            var eTypeNum = MathHelper.randomInRange(0, this.EntitiesToSummon.length-1);
            var entity = new this.EntitiesToSummon[eTypeNum](pos.x, pos.y);
                entity.interestedIn = this;

            World.AddEntity(entity);
        }
    }
}
World.RegisterEntity(EntityHoneyChunk);




class EntityHoneyDrop extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.HONEY.DROP.NAME";
		this.description = "ENTITY.HONEY.DROP.DESCRIPTION";
        this.Texture = 'entity.honey.drop';

		this.MAXHP = 10;
		this.HP = this.MAXHP;
		this.AD = 0;

        this.isHurtAble = false;

        this.mustBeKilled = false;
        this.animationDuration = .5 * Main.FPS;
        this.tY = -500;

		this.setScale(1);
    }

    onKill()
    {
		var e = new EntityHoneyChunk(this.x, this.y);
		for(var i in this.honeyStats)
		{
			e[i] = this.honeyStats[i];
		}
        World.AddEntity(e, false);
    }

    RenderTexture(context)
    {
        var p = this.ageInTicks/this.animationDuration;
        if(p > 1) return this.Kill();

        var texture = TextureManager.Get(this.Texture);
        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView + (this.tY * (1-p));

        var width = this.width;
        var height = this.height;
        var scale = this.Scale;
        var alpha = this.Transparency * (p * 5);

        Graphic.DrawRotatedAnimatedImage(context, 0, 1, 'X', 
            texture, x, y, width, height, scale, 0, alpha);
    }
}
World.RegisterEntity(EntityHoneyDrop);











class EntityHoneycomb extends Entity
{
	constructor(x, y, type = 5)
	{
		super(x, y);
		
		this.type = type;
		this.name = "ENTITY.HONEYCOMB.NAME";
		this.Texture = "entity.honey.comb."+type;

		this.MAXHP = 2**(3+type);
		this.HP = this.MAXHP;
		this.AD = 20;
		this.SPD = 500;

		this.FOLLOW_RANGE = 1000;
		this.Tier = 0;
		

		this.AI = new AI();
		this.AI.Apply(new AI_Walk());
        this.AI.Apply(new AI_AttackMelee(Player, 0, 1, {onCollisionEffects: [['Slow', 90, .5, false]]}));
		this.AI.Apply(new AI_Bounce(this, MathHelper.randomInRange(0, 360)));


		var rotationTime = 2;
        this.rotationSpeed = 360 / (rotationTime * Main.FPS);
        this.baseRotationSpeed = this.rotationSpeed;

		this.allowRotationChange = false;

		this.dropOxygen = false;
		this.dropLoot = false;

		this.LootTable = new LootTable([
			new LootTableItemData('HoneyPiece', 25, 1, 1)
		]);
		this.setScale(4);

		if(this.type == 1) 
		{
			this.dropOxygen = true;
			this.dropLoot = true;
		}

		var hs = .9;
		switch(type)
		{
			case 3: hs = .5
				break;

			case 2: hs = .4
				break;

			case 1: hs = .25
				break;
		}

		this.HitBox.Scale = hs;
	}

	onKill()
	{

		if(this.type <= 1) return;

		var angle = MathHelper.getAngle2(this, World.Player)+90;

		var e = new EntityHoneycomb(this.x, this.y, this.type-1);
			e.AI.Apply(new AI_Bounce(e, angle));
			e.level = this.level;
		World.AddEntity(e);

		var e2 = new EntityHoneycomb(this.x, this.y, this.type-1);
			e2.AI.Apply(new AI_Bounce(e2, angle-180));
			e2.level = this.level;
		World.AddEntity(e2);
	}

	Update()
	{
		super.Update();

		if(this.ageInTicks%3 == 0)
		{
			var scale = .5 * MathHelper.randomInRange(75, 125) / 100 * this.Scale;
			var r = (this.Width / 2 * this.Scale);
			var x = this.x + MathHelper.randomInRange(-r, r);
			var y = this.y + MathHelper.randomInRange(-r, r);
			var spd = 50;

			Particle.Summon('effect.honey_bubble', x, y, x, y-500, scale, spd, 1, 20, 
			{
				liveTime: 50, 
				// owner: owner,
				baseScale: scale,
				center: true,
				globalAlpha: 0.25,
				// RENDER_LAYER: Graphic.Layer.Particle0,
				onUpdate: function(){this.Scale = (this.baseScale * (this.ageInTicks / this.liveTime))}
			});
		}
	}

	RenderTexture(context)
	{
		this.Rotation = (this.Rotation + this.rotationSpeed)%360;

        super.RenderTexture(context);
	}
}
World.RegisterEntity(EntityHoneycomb);





















class LargeBeeModel extends ModelBase
{
	constructor(owner, textureFamily = 'entity.bubblebee.', autoFitTexture = false)
	{
		super(owner, textureFamily, autoFitTexture);
		this.Scale = 0.125;
		
        this.Width = 1024;
		this.Height = 700;


		var base = new Part(256, 256, 100);
		base.SetTexture("base", 256, 256);
		base.SetTextureRender(35, 1);
		base.SetRotation(0, 128, 120);

		var tail_pivot = new Part(20, 100, 100);
		tail_pivot.SetTexture("hand", 20, 100);
		tail_pivot.SetTextureRender(0, 1);
		tail_pivot.SetRotation(0, 10, 10);
		tail_pivot.visible = false;

		var wing_pivot_left_1 = new Part(20, 65, 100);
		wing_pivot_left_1.SetTexture("hand", 20, 100);
		wing_pivot_left_1.SetTextureRender(14, 13);
		wing_pivot_left_1.SetRotation(60, 10, 10);
		wing_pivot_left_1.visible = false;

		var wing_pivot_right_1 = new Part(20, 65, 100);
		wing_pivot_right_1.SetTexture("hand", 20, 100);
		wing_pivot_right_1.SetTextureRender(15, 14);
		wing_pivot_right_1.SetRotation(-60, 10, 10);
		wing_pivot_right_1.visible = false;

		var wing_right_1 = new Part(380, 230, 100);
		wing_right_1.SetTexture("wing", 380, 230);
		wing_right_1.SetTextureRender(40, 17);
		wing_right_1.SetRotation(60, 10, 120);
		wing_right_1.Axis = "x";

		var wing_left_2 = new Part(380, 230, 100);
		wing_left_2.SetTexture("wing", 380, 230);
		wing_left_2.SetTextureRender(39, 20, 0, 0, 0, 0, -1, 1);
		wing_left_2.SetRotation(-60, 10, 120);
		wing_left_2.Axis = "x";

		var abdomen = new Part(256, 330, 100);
		abdomen.SetTexture("abdomen", 256, 330);
		abdomen.SetTextureRender(38, 10);
		abdomen.SetRotation(0, 128, 10);

		var antennae_pivot_right = new Part(20, 120, 100);
		antennae_pivot_right.SetTexture("hand", 20, 100);
		antennae_pivot_right.SetTextureRender(1, 7);
		antennae_pivot_right.SetRotation(-170, 10, 10);
		antennae_pivot_right.visible = false;

		var antennae_pivot_left = new Part(20, 120, 100);
		antennae_pivot_left.SetTexture("hand", 20, 100);
		antennae_pivot_left.SetTextureRender(2, 8);
		antennae_pivot_left.SetRotation(-190, 10, 10);
		antennae_pivot_left.visible = false;

		var antennae_right = new Part(30, 140, 100);
		antennae_right.SetTexture("antennae", 30, 140);
		antennae_right.SetTextureRender(36, 9, 0, 0, 0, 0, -1, -1);
		antennae_right.SetRotation(10, 8, 6);

		var antennae_left = new Part(30, 140, 100);
		antennae_left.SetTexture("antennae", 30, 140);
		antennae_left.SetTextureRender(37, 9, 0, 0, 0, 0, 1, -1);
		antennae_left.SetRotation(-10, 8, 6);

		var leg_pivot_1 = new Part(20, 64, 100);
		leg_pivot_1.SetTexture("hand", 20, 100);
		leg_pivot_1.SetTextureRender(3, 11);
		leg_pivot_1.SetRotation(-120, 10, 10);
		leg_pivot_1.visible = false;

		var leg_pivot_2 = new Part(20, 90, 100);
		leg_pivot_2.SetTexture("hand", 20, 100);
		leg_pivot_2.SetTextureRender(4, 12);
		leg_pivot_2.SetRotation(-70, 10, 10);
		leg_pivot_2.visible = false;

		var leg_pivot_3 = new Part(20, 110, 100);
		leg_pivot_3.SetTexture("hand", 20, 100);
		leg_pivot_3.SetTextureRender(5, 13);
		leg_pivot_3.SetRotation(-40, 10, 10);
		leg_pivot_3.visible = false;

		var leg_pivot_4 = new Part(20, 110, 100);
		leg_pivot_4.SetTexture("hand", 20, 100);
		leg_pivot_4.SetTextureRender(6, 14);
		leg_pivot_4.SetRotation(40, 10, 10);
		leg_pivot_4.visible = false;

		var leg_pivot_5 = new Part(20, 90, 100);
		leg_pivot_5.SetTexture("hand", 20, 100);
		leg_pivot_5.SetTextureRender(7, 15);
		leg_pivot_5.SetRotation(70, 10, 10);
		leg_pivot_5.visible = false;

		var leg_pivot_6 = new Part(20, 64, 100);
		leg_pivot_6.SetTexture("hand", 20, 100);
		leg_pivot_6.SetTextureRender(8, 16);
		leg_pivot_6.SetRotation(120, 10, 10);
		leg_pivot_6.visible = false;

		var leg_1 = new Part(30, 70, 100);
		leg_1.SetTexture("leg", 30, 70);
		leg_1.SetTextureRender(12, 17, 0, 0, 0, 0, 1, -1);
		leg_1.SetRotation(65, 15, 10);

		var leg_2 = new Part(30, 70, 100);
		leg_2.SetTexture("leg", 30, 70);
		leg_2.SetTextureRender(11, 18, 0, 0, 0, 0, 1, -1);
		leg_2.SetRotation(-96, 15, 10);

		var leg_3 = new Part(30, 70, 100);
		leg_3.SetTexture("leg", 30, 70);
		leg_3.SetTextureRender(10, 19, 0, 0, 0, 0, 1, -1);
		leg_3.SetRotation(-220, 15, 10);

		var leg_4 = new Part(30, 70, 100);
		leg_4.SetTexture("leg.end", 30, 70);
		leg_4.SetTextureRender(9, 20, 0, 0, 0, 0, -1, -1);
		leg_4.SetRotation(-30, 15, 10);

		var leg_5 = new Part(30, 70, 100);
		leg_5.SetTexture("leg", 30, 70);
		leg_5.SetTextureRender(16, 21, 0, 0, 0, 0, 1, -1);
		leg_5.SetRotation(33, 15, 10);

		var leg_6 = new Part(30, 70, 100);
		leg_6.SetTexture("leg", 30, 70);
		leg_6.SetTextureRender(15, 22, 0, 0, 0, 0, 1, -1);
		leg_6.SetRotation(-30, 15, 10);

		var leg_7 = new Part(30, 70, 100);
		leg_7.SetTexture("leg", 30, 70);
		leg_7.SetTextureRender(14, 23, 0, 0, 0, 0, 1, -1);
		leg_7.SetRotation(20, 15, 10);

		var leg_8 = new Part(30, 70, 100);
		leg_8.SetTexture("leg.end", 30, 70);
		leg_8.SetTextureRender(13, 24, 0, 0, 0, 0, -1, -1);
		leg_8.SetRotation(20, 15, 10);

		var leg_9 = new Part(40, 95, 100);
		leg_9.SetTexture("leg", 30, 70);
		leg_9.SetTextureRender(20, 25, 0, 0, 0, 0, 1, -1);
		leg_9.SetRotation(0, 20, 10);

		var leg_10 = new Part(40, 95, 100);
		leg_10.SetTexture("leg", 30, 70);
		leg_10.SetTextureRender(19, 26, 0, 0, 0, 0, 1, -1);
		leg_10.SetRotation(30, 20, 10);

		var leg_11 = new Part(40, 95, 100);
		leg_11.SetTexture("leg", 30, 70);
		leg_11.SetTextureRender(18, 27, 0, 0, 0, 0, 1, -1);
		leg_11.SetRotation(-20, 20, 10);

		var leg_12 = new Part(40, 95, 100);
		leg_12.SetTexture("leg.end", 30, 70);
		leg_12.SetTextureRender(17, 28, 0, 0, 0, 0, 1, -1);
		leg_12.SetRotation(20, 20, 10);

		var leg_13 = new Part(40, 95, 100);
		leg_13.SetTexture("leg", 30, 70);
		leg_13.SetTextureRender(24, 29, 0, 0, 0, 0, 1, -1);
		leg_13.SetRotation(4, 20, 10);

		var leg_14 = new Part(40, 95, 100);
		leg_14.SetTexture("leg", 30, 70);
		leg_14.SetTextureRender(23, 30, 0, 0, 0, 0, 1, -1);
		leg_14.SetRotation(-30, 20, 10);

		var leg_15 = new Part(40, 95, 100);
		leg_15.SetTexture("leg", 30, 70);
		leg_15.SetTextureRender(22, 31, 0, 0, 0, 0, 1, -1);
		leg_15.SetRotation(20, 20, 10);

		var leg_16 = new Part(40, 95, 100);
		leg_16.SetTexture("leg.end", 30, 70);
		leg_16.SetTextureRender(21, 32, 0, 0, 0, 0, -1, -1);
		leg_16.SetRotation(-20, 20, 10);

		var leg_17 = new Part(30, 70, 100);
		leg_17.SetTexture("leg", 30, 70);
		leg_17.SetTextureRender(28, 33, 0, 0, 0, 0, 1, -1);
		leg_17.SetRotation(-33, 15, 10);

		var leg_18 = new Part(30, 70, 100);
		leg_18.SetTexture("leg", 30, 70);
		leg_18.SetTextureRender(27, 34, 0, 0, 0, 0, 1, -1);
		leg_18.SetRotation(30, 15, 10);

		var leg_19 = new Part(30, 70, 100);
		leg_19.SetTexture("leg", 30, 70);
		leg_19.SetTextureRender(26, 35, 0, 0, 0, 0, 1, -1);
		leg_19.SetRotation(-20, 15, 10);

		var leg_20 = new Part(30, 70, 100);
		leg_20.SetTexture("leg.end", 30, 70);
		leg_20.SetTextureRender(25, 36, 0, 0, 0, 0, 1, -1);
		leg_20.SetRotation(-20, 15, 10);

		var leg_21 = new Part(30, 70, 100);
		leg_21.SetTexture("leg", 30, 70);
		leg_21.SetTextureRender(32, 37, 0, 0, 0, 0, 1, -1);
		leg_21.SetRotation(-64, 15, 10);

		var leg_22 = new Part(30, 70, 100);
		leg_22.SetTexture("leg", 30, 70);
		leg_22.SetTextureRender(31, 38, 0, 0, 0, 0, 1, -1);
		leg_22.SetRotation(-256, 15, 10);

		var leg_23 = new Part(30, 70, 100);
		leg_23.SetTexture("leg", 30, 70);
		leg_23.SetTextureRender(30, 39, 0, 0, 0, 0, 1, -1);
		leg_23.SetRotation(222, 15, 10);

		var leg_24 = new Part(30, 70, 100);
		leg_24.SetTexture("leg.end", 30, 70);
		leg_24.SetTextureRender(29, 40, 0, 0, 0, 0, 1, -1);
		leg_24.SetRotation(30, 15, 10);

        var honey_pivot = new Part(20, 100, 100);
		honey_pivot.SetTexture("hand", 20, 100);
		honey_pivot.SetTextureRender(33, -1);
		honey_pivot.SetRotation(-180, 10, 10);
		honey_pivot.visible = false;

		var honey = new Part(128, 128, 100);
		honey.SetTexture("item.honey.piece", 128, 128, false);
		honey.SetTextureRender(34, -1);
		honey.SetRotation(0, 64, 10);

		base.AddChild(tail_pivot);
		base.AddChild(wing_pivot_left_1);
		base.AddChild(wing_pivot_right_1);
		wing_pivot_right_1.AddChild(wing_right_1);
		wing_pivot_left_1.AddChild(wing_left_2);
		tail_pivot.AddChild(abdomen);
		base.AddChild(antennae_pivot_right);
		base.AddChild(antennae_pivot_left);
		antennae_pivot_right.AddChild(antennae_right);
		antennae_pivot_left.AddChild(antennae_left);
		base.AddChild(leg_pivot_1);
		base.AddChild(leg_pivot_2);
		base.AddChild(leg_pivot_3);
		base.AddChild(leg_pivot_4);
		base.AddChild(leg_pivot_5);
		base.AddChild(leg_pivot_6);
		leg_pivot_1.AddChild(leg_1);
		leg_1.AddChild(leg_2);
		leg_2.AddChild(leg_3);
		leg_3.AddChild(leg_4);
		leg_pivot_2.AddChild(leg_5);
		leg_5.AddChild(leg_6);
		leg_6.AddChild(leg_7);
		leg_7.AddChild(leg_8);
		leg_pivot_3.AddChild(leg_9);
		leg_9.AddChild(leg_10);
		leg_10.AddChild(leg_11);
		leg_11.AddChild(leg_12);
		leg_pivot_4.AddChild(leg_13);
		leg_13.AddChild(leg_14);
		leg_14.AddChild(leg_15);
		leg_15.AddChild(leg_16);
		leg_pivot_5.AddChild(leg_17);
		leg_17.AddChild(leg_18);
		leg_18.AddChild(leg_19);
		leg_19.AddChild(leg_20);
		leg_pivot_6.AddChild(leg_21);
		leg_21.AddChild(leg_22);
		leg_22.AddChild(leg_23);
		leg_23.AddChild(leg_24);
		base.AddChild(honey_pivot);
		honey_pivot.AddChild(honey);

		this.Parts.base = base;
		this.Parts.tail_pivot = tail_pivot;
		this.Parts.wing_pivot_left_1 = wing_pivot_left_1;
		this.Parts.wing_pivot_right_1 = wing_pivot_right_1;
		this.Parts.wing_right_1 = wing_right_1;
		this.Parts.wing_left_2 = wing_left_2;
		this.Parts.abdomen = abdomen;
		this.Parts.antennae_pivot_right = antennae_pivot_right;
		this.Parts.antennae_pivot_left = antennae_pivot_left;
		this.Parts.antennae_right = antennae_right;
		this.Parts.antennae_left = antennae_left;
		this.Parts.leg_pivot_1 = leg_pivot_1;
		this.Parts.leg_pivot_2 = leg_pivot_2;
		this.Parts.leg_pivot_3 = leg_pivot_3;
		this.Parts.leg_pivot_4 = leg_pivot_4;
		this.Parts.leg_pivot_5 = leg_pivot_5;
		this.Parts.leg_pivot_6 = leg_pivot_6;
		this.Parts.leg_1 = leg_1;
		this.Parts.leg_2 = leg_2;
		this.Parts.leg_3 = leg_3;
		this.Parts.leg_4 = leg_4;
		this.Parts.leg_5 = leg_5;
		this.Parts.leg_6 = leg_6;
		this.Parts.leg_7 = leg_7;
		this.Parts.leg_8 = leg_8;
		this.Parts.leg_9 = leg_9;
		this.Parts.leg_10 = leg_10;
		this.Parts.leg_11 = leg_11;
		this.Parts.leg_12 = leg_12;
		this.Parts.leg_13 = leg_13;
		this.Parts.leg_14 = leg_14;
		this.Parts.leg_15 = leg_15;
		this.Parts.leg_16 = leg_16;
		this.Parts.leg_17 = leg_17;
		this.Parts.leg_18 = leg_18;
		this.Parts.leg_19 = leg_19;
		this.Parts.leg_20 = leg_20;
		this.Parts.leg_21 = leg_21;
		this.Parts.leg_22 = leg_22;
		this.Parts.leg_23 = leg_23;
		this.Parts.leg_24 = leg_24;
		this.Parts.honey_pivot = honey_pivot;
		this.Parts.honey = honey;

		this.ApplyModelAnimation(LargeBeeFlyAnimation);
		this.ApplyModelAnimation(LargeBeeWalkAnimation);
		this.ApplyModelAnimation(LargeBeeWalkPosAnimation);
		this.ApplyModelAnimation(LargeBeeAbdomenAnimation);
		this.ApplyModelAnimation(LargeBeeAntennaeAnimation);
	}

	Update()
	{
		super.Update();

        this.Parts.honey.visible = this.Owner.gotChunk ?? false;
	}

	Render(context)
	{
		super.Render(context);
	}
}

class LargeBeeAbdomenAnimation extends AnimationBase
{
    constructor(model)
    {
        super(model);

        this.setAnimationDuration(.25 * Main.FPS);
        this.iterations = 'INFINITE';

        this.setAnimationSpacing(.45, .55);

        this.Data = 
        [
            new AnimationData('abdomen', 'Rotation', 3, -3)
        ];
    }
}

class LargeBeeAntennaeAnimation extends AnimationBase
{
    constructor(model)
    {
        super(model);

        this.setAnimationDuration(.75 * Main.FPS);
        this.iterations = 'INFINITE';

        this.setAnimationSpacing(.45, .55);

        this.Data = 
        [
            new AnimationData('antennae_right', 'Rotation', 5, 15),
            new AnimationData('antennae_left', 'Rotation', -5, -15, -1)
        ];
    }
}




class LargeBeeFlyAnimation extends AnimationBase
{
    constructor(model)
    {
        super(model);

        this.setAnimationDuration(5);
        this.iterations = 'INFINITE';

        this.setAnimationSpacing(.5, .5);

        this.triggerFunction = function(anim){return anim.Owner.isFlying;};

        this.Data = 
        [
            new AnimationData('wing_left_2', 'Rotation', -60, -60),
            new AnimationData('wing_right_1', 'Rotation', 60, 60),

            new AnimationData('wing_right_1', 'Transform.x', 100, 30, 1),
            new AnimationData('wing_left_2', 'Transform.x', 100, 30, 1),
        ];
    }
}



class LargeBeeWalkPosAnimation extends AnimationBase
{
    constructor(model)
    {
        super(model);

        this.setAnimationDuration((150 / this.Owner.SPD) * Main.FPS * 1.5);
        this.iterations = 'INFINITE';

        this.setAnimationSpacing(.5, .5);

        this.triggerFunction = function(anim){return !anim.Owner.isFlying;};

        this.Data = 
        [
            new AnimationData('wing_left_2', 'Rotation', -140, -140),
            new AnimationData('wing_right_1', 'Rotation', 140, 140),

            new AnimationData('leg_1', 'Rotation', 4, 4),
            new AnimationData('leg_2', 'Rotation', -30, -30),
            new AnimationData('leg_3', 'Rotation', 20, 20),
            new AnimationData('leg_4', 'Rotation', -30, -30),

            new AnimationData('leg_5', 'Rotation', -25, -25),
            new AnimationData('leg_6', 'Rotation', -30, -30),
            new AnimationData('leg_7', 'Rotation', -20, -20),
            new AnimationData('leg_8', 'Rotation', -20, -20),

            new AnimationData('leg_9', 'Rotation', 0, 0),
            new AnimationData('leg_10', 'Rotation', 20, 20),
            new AnimationData('leg_11', 'Rotation', -20, -20),
            new AnimationData('leg_12', 'Rotation', 20, 20),

            new AnimationData('leg_13', 'Rotation', 0, 0),
            new AnimationData('leg_14', 'Rotation', -20, -20),
            new AnimationData('leg_15', 'Rotation', 20, 20),
            new AnimationData('leg_16', 'Rotation', -20, -20),

            new AnimationData('leg_17', 'Rotation', 25, 25),
            new AnimationData('leg_18', 'Rotation', 30, 30),
            new AnimationData('leg_19', 'Rotation', 20, 20),
            new AnimationData('leg_20', 'Rotation', 20, 20),

            new AnimationData('leg_21', 'Rotation', 4, 4),
            new AnimationData('leg_22', 'Rotation', 30, 30),
            new AnimationData('leg_23', 'Rotation', -20, -20),
            new AnimationData('leg_24', 'Rotation', 30, 30)
        ];
    }
}


class LargeBeeWalkAnimation extends AnimationBase
{
    constructor(model)
    {
        super(model);

        this.setAnimationDuration((150 / this.Owner.SPD) * Main.FPS * 1.5);
        this.iterations = 'INFINITE';

        this.setAnimationSpacing(.5, .5);

        this.triggerFunction = function(anim){return anim.Owner.isMoving() && !anim.Owner.isFlying;};

        this.Data = 
        [
            new AnimationData('leg_1', 'Transform.y', 100, 75, 1),
            new AnimationData('leg_2', 'Transform.y', 100, 75, 1),
            new AnimationData('leg_3', 'Transform.y', 100, 75, 1),
            new AnimationData('leg_4', 'Transform.y', 100, 75, 1),

            new AnimationData('leg_5', 'Transform.y', 100, 75, -1),
            new AnimationData('leg_6', 'Transform.y', 100, 75, -1),
            new AnimationData('leg_7', 'Transform.y', 100, 75, -1),
            new AnimationData('leg_8', 'Transform.y', 100, 75, -1),

            new AnimationData('leg_9', 'Transform.y', 100, 75, 1),
            new AnimationData('leg_10', 'Transform.y', 100, 75, 1),
            new AnimationData('leg_11', 'Transform.y', 100, 75, 1),
            new AnimationData('leg_12', 'Transform.y', 100, 75, 1),

            new AnimationData('leg_13', 'Transform.y', 100, 75, -1),
            new AnimationData('leg_14', 'Transform.y', 100, 75, -1),
            new AnimationData('leg_15', 'Transform.y', 100, 75, -1),
            new AnimationData('leg_16', 'Transform.y', 100, 75, -1),

            new AnimationData('leg_17', 'Transform.y', 100, 75, 1),
            new AnimationData('leg_18', 'Transform.y', 100, 75, 1),
            new AnimationData('leg_19', 'Transform.y', 100, 75, 1),
            new AnimationData('leg_20', 'Transform.y', 100, 75, 1),

            new AnimationData('leg_21', 'Transform.y', 100, 75, -1),
            new AnimationData('leg_22', 'Transform.y', 100, 75, -1),
            new AnimationData('leg_23', 'Transform.y', 100, 75, -1),
            new AnimationData('leg_24', 'Transform.y', 100, 75, -1)
        ];
    }
}





