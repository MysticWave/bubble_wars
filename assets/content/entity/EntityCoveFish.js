class EntityCoveFishPoison extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.COVE.FISH.POISON.NAME";
		this.Title = "";

		this.Texture = "entity.cove.fish.poison.base";
        this.finTextureLeft = 'entity.cove.fish.fin.left';
        this.finTextureRight = 'entity.cove.fish.fin.right';

		// this.TextureRotation = 180;
		// this.Rotation = 180;

		this.MAXHP = 800;
		this.HP = this.MAXHP;
		this.AD = 20;
		this.ATTACK_SPEED = .5;
        this.ATTACK_RANGE = 1000;
		this.FOLLOW_RANGE = 500;
        this.BULLET_SPEED = 400;
		this.SPD = 400;

		this.isAggressive = true;

		this.AI.Apply(new AI_AttackMelee(Player, this.AD));
        this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Wander(false, 1));
		
		this.HitBox.Scale = .75;


		this.LootTable = new LootTable([
			new LootTableItemData("Emerald1", 25, 1, 1)
		]);

        this.Immunity[ELEMENT.POISON] = true;

        this.attackFrames = 6;
        this.attackFrame = 0;
        this.attackAnimationDuration = 18;

        this.specialAttackDelay = 8 * Main.FPS;
        this.specialAttackAnimationDelayIndicator = 1 * Main.FPS;       //how earlier animation should start
        this.lastSpecialAttack = MathHelper.randomInRange(0, this.specialAttackDelay/2);

        this.specialAttackDuration = 3 * Main.FPS;
        this.specialAttackTicks = 0;
        this.specialAttackTick = 0;
        this.specialAttackTimes = 0;

        this.Transparency = .8;
        this.finsAnimation = new Transition(-20, 20, .15, true, 0, 0, false);
		this.setScale(5);

        this.heartDropChance = 50;
		this.heartDropValue = 2;
        this.oxygenMultiplier = 10;
	}

    specialAttack()
    {
        this.allowMove = false;
        var delay = 45;
        if(this.specialAttackTick%delay == 0)
        {
            var bullets = 24;
            var angle = (this.specialAttackTick%(delay*2) == 0) ? 0 : (360/bullets)/2;
            var y = this.y;
            this.y += this.height * .25 * this.baseScale;

            var stats = {};
                stats.spd = this.BULLET_SPEED;
                stats[STAT.ATTACK_RANGE] = 9999;
                stats.Scale = 2;
                stats.damage = 0,
                stats.Texture = 'effect.poison',
                stats.onPlayerCollisionEffects = [['Poisoning', 1, 10, false]],
                stats.onEntityCollisionEffects = [['Poisoning', 1, 10, false]]

            AI_ShotOnCircle.StaticShoot(this, stats, bullets, {angle: angle});

            this.y = y;
        }
    }

    onSpecialAttackEnd()
    {
        this.allowMove = true;
        this.specialAttackTimes++;
    }

    specialAttackUpdate()
    {
        if(this.specialAttackTick >= this.specialAttackDuration)
        {
            this.specialAttackTick = 0;
            this.lastSpecialAttack = this.specialAttackTicks;
            this.onSpecialAttackEnd();
            return;
        }

        this.specialAttack();
        this.specialAttackTick++;
    }

    Update()
    {
        super.Update();
        if(this.NoAI || this.lockAI) return;

        this.specialAttackTicks++;

        var tickToAttack = this.lastSpecialAttack + this.specialAttackDelay;
        if(this.specialAttackTicks >= tickToAttack)
        {
            this.specialAttackUpdate();
        }


        if(this.specialAttackTicks >= tickToAttack - this.attackAnimationDuration-this.specialAttackAnimationDelayIndicator)
        {
            var p = (this.specialAttackTicks-(tickToAttack-this.attackAnimationDuration-this.specialAttackAnimationDelayIndicator)) / this.attackAnimationDuration;
            if(p > 1) p = 1;
            this.attackFrame = (this.attackFrames-1) * p;
        }

        if(this.specialAttackTimes && this.specialAttackTicks-this.lastSpecialAttack <= this.attackAnimationDuration)
        {
            var p = (this.specialAttackTicks-this.lastSpecialAttack) / this.attackAnimationDuration;
            this.attackFrame = (this.attackFrames-1) * (1-p);
        }
    }

    RenderTexture(context)
	{
		var fin_texture_left = TextureManager.Get(this.finTextureLeft);
		var fin_texture_right = TextureManager.Get(this.finTextureRight);
        var base_texture = TextureManager.Get(this.Texture);

        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;
        var s = this.width / 512;
        var width = 175 * s;
        var height = 100 * s;
        var rotation = this.finsAnimation.Update();

        var tX = (this.width / 2) * .67 * this.Scale;


        Graphic.DrawRotatedImage(context, fin_texture_left, x-tX, y, width, height, this.Scale, -rotation, this.Transparency, width/2, 0);
        Graphic.DrawRotatedImage(context, fin_texture_right, x+tX, y, width, height, this.Scale, rotation, this.Transparency, -width/2, 0);


        Graphic.DrawRotatedAnimatedImage(context, this.attackFrame, this.attackFrames, 'Y', 
            base_texture, x, y, this.width, this.height, this.Scale, 0, this.Transparency, 0, 0);
	}
}
World.RegisterEntity(EntityCoveFishPoison);







class EntityCoveFishFire extends EntityCoveFishPoison
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.COVE.FISH.FIRE.NAME";
		this.Texture = "entity.cove.fish.fire.base";

		this.MAXHP = 700;
		this.HP = this.MAXHP;
		this.AD = 20;
        this.ATTACK_RANGE = 1000;
		this.FOLLOW_RANGE = 500;
        this.BULLET_SPEED = 1200;
		this.SPD = 450;


		this.LootTable = new LootTable([
			// new LootTableItemData("BubbleTerminator", 5, 1, 1)
		]);

        this.Immunity[ELEMENT.POISON] = false;
        this.Immunity[ELEMENT.FIRE] = true;


        this.specialAttackDelay = 8 * Main.FPS;
        this.specialAttackDuration = 3 * Main.FPS;

        this.FireAnimationFrameDelay = 5;
        this.fireTick = 0;
		this.setScale(5);
	}

    specialAttack()
    {
        // this.allowMove = false;
        // var delay = 1;
        // if(this.specialAttackTick%delay == 0)
        // {
            var bullets = 1;
            var angle = MathHelper.getAngle2(this, World.Player) + MathHelper.randomInRange(-15, 15);
            var y = this.y;
            this.y += this.height * .25 * this.baseScale;

            var stats = {};
                stats.spd = this.BULLET_SPEED;
                stats[STAT.ATTACK_RANGE] = 9999;
                stats.Scale = 1.5 * this.Scale;
                stats.damage = this.AD/10;
                stats.knockBack = 0;
                stats.Type = 'BulletFlameStar';
                stats.Transparency = .5;

            AI_ShotOnCircle.StaticShoot(this, stats, bullets, {angle: angle});

            this.y = y;
        // }
    }

    RenderTexture(context)
    {
        super.RenderTexture(context);
        this.fireTick++;

        var fire_sprite = TextureManager.Get('effect.fire');
        var frames = 8;
        var frame = Math.floor((this.fireTick%(frames*this.FireAnimationFrameDelay))/this.FireAnimationFrameDelay);

        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;

        var scale = .15 * this.Scale;
        var width = fire_sprite.width;
        var height = fire_sprite.height/frames;
        var rotation = 0;

        var tX = this.width * .2 * this.Scale;
        var tY = this.height * .35 * this.Scale;

        Graphic.DrawRotatedAnimatedImage(context, frame, frames, 'Y',
            fire_sprite, x-tX, y-tY, width, height, scale, -rotation, this.Transparency);

        Graphic.DrawRotatedAnimatedImage(context, frame, frames, 'Y',
            fire_sprite, x+tX, y-tY, width, height, scale, rotation, this.Transparency);
    }
}
World.RegisterEntity(EntityCoveFishFire);







class EntityCoveFishIce extends EntityCoveFishPoison
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.COVE.FISH.ICE.NAME";
		this.Texture = "entity.cove.fish.ice.base";

		this.MAXHP = 1000;
		this.HP = this.MAXHP;
		this.AD = 20;
        this.ATTACK_RANGE = 1000;
		this.FOLLOW_RANGE = 500;
        this.BULLET_SPEED = 300;
		this.SPD = 250;


		this.LootTable = new LootTable([
			new LootTableItemData("Icicle1", 25, 1, 1),
			new LootTableItemData("Sapphire1", 25, 1, 1)
		]);


        this.specialAttackDelay = 8 * Main.FPS;
        this.specialAttackDuration = 4.5 * Main.FPS;

        this.Immunity[ELEMENT.POISON] = false;
        this.Immunity[ELEMENT.ICE] = true;

		this.setScale(5);
	}

    specialAttack()
    {
        this.allowMove = false;
        var delay = 90;
        if(this.specialAttackTick%delay == 0)
        {
            var bullets = 1;
            var angle = MathHelper.getAngle2(this, World.Player);
            var y = this.y;
            this.y += this.height * .25 * this.baseScale;

            var stats = {};
                stats.spd = this.BULLET_SPEED;
                stats[STAT.ATTACK_RANGE] = 9999;
                stats.Scale = 4;
                stats.Bounce = 1;
                stats.damage = this.AD;
                stats.Type = 'BulletFrostBall';
                stats.onPlayerCollisionEffects = [['Slow', 50, 10, false]];
                stats.onEntityCollisionEffects = [['Slow', 50, 10, false]];

            AI_ShotOnCircle.StaticShoot(this, stats, bullets, {angle: angle});

            this.y = y;
        }
    }
}
World.RegisterEntity(EntityCoveFishIce);





