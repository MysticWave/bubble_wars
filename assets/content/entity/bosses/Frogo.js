class Frogo extends EntityFrog
{
	constructor(x, y, isBoss = true)
	{
		super(x, y);
		
		this.name = "ENTITY.FROGO.NAME";
        this.Rotation = 180;

		this.MAXHP = 1600;
		this.HP = this.MAXHP;
		this.AD = 20;
		this.SPD = 100;

        this.ATTACK_SPEED = 1;
        this.ATTACK_RANGE = 9999;
        this.BULLET_SPEED = 6000;

        this.JumpDuration = .5;
        this.JumpDelay = 3;
        this.JumpDistance = this.SPD * 5;
        this.shakeOnJump = 3;
        this.jumps = 0;
        this.rageJumps = 4;

        this.isAttackingWithTongue = false;


        this.enragedAnimationDuration = 4 * Main.FPS;

        var bulletStats = 
		{
			Type: "BulletFrogTongue",
			Scale: 1,
            damage: 0
		};


        this.AI.Apply(new AI_Jump(false, this.JumpDelay, this.JumpDelay, Player));
		this.AI.Apply(new AI_AttackMelee(Player, 0, 2));
        this.AI.Apply(new AI_Observe(Player, 999999, function(owner){return owner.aggressive && !owner.isJumping}));
		this.AI.Apply(new AI_Walk());
        this.AI.Apply(new AI_AttackRange(World.Player, bulletStats, {shootTrigger: function(o){return o.isAttackingWithTongue}}));
        if(isBoss)
        {
            this.AI.Apply(new AI_Boss(this));
            this.AI.Apply(new AI_Enrage(this, 50));
        }
        
       

		this.LootTable = new LootTable([new LootTableItemData('TreasureOrbFrogo', 100, 1, 1)]);


        this.BossTheme = "interface.BossFight2";


        this.modelTextureF = 'entity.frogo.';
        this.modelTextureEnragedF = 'entity.frogo.enraged.';
        this.Model = new EntityFrogModel(this, 'entity.frogo.');

        this.defaultScale = 7;
        this.setScale(this.defaultScale);  
	}

    onJumpEnd()
    {
        var stats = {};
			stats.spd = 800;
			stats.damage = this.AD/2;
			stats[STAT.ATTACK_RANGE] = 9999;
			stats.Scale = 2;
            stats.knockBack = 2;

		if(this.isBoss) AI_ShotOnCircle.StaticShoot(this, stats, 16);

        this.jumps++;

        if(this.isEnraged)
        {
            if(this.jumps && this.jumps%this.rageJumps == 0) this.JumpDelay = 4;
            else this.JumpDelay = 1;

            if((this.jumps-1)%this.rageJumps == 0) 
            {
                this.AI.AttackRange.attackCharge = 0;
                this.isAttackingWithTongue = true;
            }
        }
    }

    onJumpStart()
    {
        this.isAttackingWithTongue = false;
    }

    Enrage()
    {
        this.isJumping = false;
        this.additionalScaleMultiplier = 1;
        this.AI.Jump.timeSinceChange = 0;
        this.AI.Jump.end = null;
        this.jumps = 1;
        this.JumpDelay = 1;

        var stats = {};
			stats.spd = 1000;
			stats.damage = this.AD;
			stats[STAT.ATTACK_RANGE] = 9999;
			stats.Scale = 3;
            stats.knockBack = 10;

        if(Difficulty(2))
        {
            this.Resistance[ELEMENT.PHYSICAL] = true;
            stats.damage = this.AD * 3;
        }
        
		AI_ShotOnCircle.StaticShoot(this, stats, 64);
        Camera.Shake(2, true, 25);
    }

    onEnrageAnimationProgress()
    {
        var new_scale = this.defaultScale + (2 * this.enrageAnimationProgress);
        this.setScale(new_scale);
    }

    onEnrageAnimationEnd()
    {
        this.Model.textureFamily = this.modelTextureEnragedF;
    }

    Render(context)
    {
        super.Render(context);

        if(this.isEnraged && this.lockAI)
        {
            this.Model.textureFamily = this.modelTextureEnragedF;
            this.Model.Transparency = this.enrageAnimationProgress;
            this.Model.Render(context);
            this.Model.textureFamily = this.modelTextureF;
        }
    }
}
World.RegisterEntity(Frogo);