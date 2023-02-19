class TheFatOne extends EntityBubble
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.THE_FAT_ONE.NAME";
		this.Texture = 'entity.the_fat_one.base';
		this.TextureMouth = 'entity.the_fat_one.mouth';
		// this.Title = "";
		// this.Subtitle = "Don`t be afraid!";

		this.MAXHP = 1600;
		this.HP = this.MAXHP;
		this.AD = 10;
		this.ATTACK_SPEED = 1;
		this.SPD = 200;
		this.Color = null;

        this.BULLET_SPEED = 300;

		this.JumpDuration = .5;
        this.JumpDelay = 3;
        this.JumpDistance = this.SPD * 3;
        this.shakeOnJump = 3;
        this.jumps = 0;
        this.jumpsPerSpecialAttack = 3;
		this.napalmDuration = 6;
		this.napalmTicks = 0;
		this.napalmAnim = 0;

		this.AI = new AI(this);
        this.AI.Apply(new AI_Jump(false, this.JumpDelay, this.JumpDelay, Player));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_AttackMelee(Player, this.AD*2));
		this.AI.Apply(new AI_Boss(this));
        this.AI.Apply(new AI_Enrage(this, 50));

		var stats = 
		{
            shotCount: 4,
            shotDelayMin: 99999,
            shotDelayMax: 99999,
            getStartAngleFromOwnerRotation: true
		};
        this.AI.Apply(new AI_ShotOnCircle(stats,
        {
            Scale: 2,
			damage: 0,
			Texture: 'effect.poison',
			onPlayerCollisionEffects: [['Poisoning', 1, 10, false]],
			onEntityCollisionEffects: [['Poisoning', 1, 10, false]]
        }, true));

		this.BossTheme = "interface.BossFight2";
        this.enragedAnimationDuration = 4 * Main.FPS;

		this.defaultScale = 8;
		this.setScale(this.defaultScale);

        this.LootTable = new LootTable([new LootTableItemData('TreasureOrbTheFatOne', 100, 1, 1)]);

		this.isUsingNapalm = false;
		this.baseHeight = this.height;
		this.allowRotationChange = false;

		this.rotationSpeed = 1.25;
	}

	onJumpEnd()
    {
        var stats = {};
			stats.spd = 800;
			stats.damage = this.AD/2;
			stats[STAT.ATTACK_RANGE] = 9999;
			stats.Scale = 2;
            stats.knockBack = 2;

		AI_ShotOnCircle.StaticShoot(this, stats, 16);


		this.jumps++;

		if(this.jumps && this.jumps%this.jumpsPerSpecialAttack == 0) 
		{
			this.JumpDelay = this.napalmDuration + 2;
		}
		else this.JumpDelay = (this.isEnraged) ? 1.5 : 3;

		if((this.jumps-1)%this.jumpsPerSpecialAttack == 0 && this.jumps >= this.jumpsPerSpecialAttack-1) 
		{
			this.isUsingNapalm = true;
			this.napalmTicks = 0;
		}
    }

	onJumpStart()
	{
		this.isUsingNapalm = false;
	}

    Enrage()
    {
        this.isJumping = false;
        this.additionalScaleMultiplier = 1;
		this.JumpDelay = 1.5;
		this.jumps = 0;

        this.AI.Jump.timeSinceChange = 0;
        this.AI.Jump.end = null;

		this.toJumpProgress = 30;
		this.height = this.baseHeight

		this.napalmTicks = 0;
		this.isUsingNapalm = false;
		this.napalmAnim = 0;

		this.AI.ShotOnCircle.setShotDelay(9999, 9999);
		this.AI.ShotOnCircle.attackCharge = 0;
    }

    onEnrageAnimationProgress()
    {
        var new_scale = this.defaultScale + (2 * this.enrageAnimationProgress);
        this.setScale(new_scale);
    }

    EnrageUpdate()
    {
        if(this.isUsingNapalm)
		{
			//om nom nom the player
			var strength = 500;
			if(Difficulty(2)) strength = 600;
			var motion = Motion.Get([World.Player.x, World.Player.y], [this.x, this.y], strength);
				World.Player.ApplyMove(motion);

			var angle = MathHelper.randomInRange(0, 360);

			Particle.SummonCirclePattern("bubble", this.x, this.y, 0.4, 1000, 1, 
				World.Radius, angle, null, false);
		}
    }

	Update()
	{
        if(this.isEnraged) this.EnrageUpdate();
        super.Update();

		var height_transform = .4;

		if(this.toJumpProgress >= 80)
		{
			var p = 1 - ((this.toJumpProgress-80) / 20) * height_transform;
			this.height = this.baseHeight * p;
		}

		if(this.toJumpProgress <= 10)
		{
			var p = (1-height_transform) + (this.toJumpProgress / 10) * height_transform;
			this.height = this.baseHeight * p;
		}


		if(this.isUsingNapalm)
		{
			this.napalmTicks++;
			this.Rotation = (this.Rotation + this.rotationSpeed)%360;

			if(this.napalmTicks == 60) this.AI.ShotOnCircle.setShotDelay(.15, .15);
			if(this.napalmTicks == (this.napalmDuration + 1) * Main.FPS) this.AI.ShotOnCircle.setShotDelay(9999, 9999);

			if(this.napalmTicks <= 60) this.napalmAnim = this.napalmTicks / 60;
			if(this.napalmTicks > 60 && this.napalmTicks < (this.napalmDuration + 1) * Main.FPS)
			{
				var p = (this.napalmTicks%20) / 20;
				this.napalmAnim = 1 - (p * .1);
			}
			if(this.napalmTicks >= (this.napalmDuration + 1) * Main.FPS) this.napalmAnim = 1- (this.napalmTicks - (this.napalmDuration + 1) * Main.FPS) / 60;
		}
	}


	RenderTexture(context)
	{
		var texture = TextureManager.Get(this.Texture);
		var texture_m = TextureManager.Get(this.TextureMouth);

        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;
        var height = this.height;
        var width = this.width;

		var height_diff = this.baseHeight - this.height;
		y += height_diff / 2 * this.Scale;

        var rotation = this.TextureRotation;
        var scale = this.Scale;
        var alpha = this.Transparency;

		var frame = this.TextureData.frame ?? 0;
		var frames = this.TextureData.frames ?? 1;
		var direction = this.TextureData.direction ?? 'Y';

		var m_height = height * (.25 + (this.napalmAnim * .75));


		Graphic.DrawRotatedAnimatedImage(context, frame, frames, direction, 
            texture, x, y, width, height, scale, rotation, alpha, this.Origin.x, this.Origin.y);

		Graphic.DrawRotatedAnimatedImage(context, frame, frames, direction, 
			texture_m, x, y, width, m_height, scale, rotation, alpha * .75, this.Origin.x, this.Origin.y);
	}
}
World.RegisterEntity(TheFatOne);




