class Bubblebee extends EntityLargeBee
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.BUBBLEBEE.NAME";
		this.description = "ENTITY.BUBBLEBEE.DESCRIPTION";

		this.MAXHP = 2200;
		this.HP = this.MAXHP;
		this.AD = 10;
		this.ATTACK_SPEED = 1;
        this.ATTACK_RANGE = 1500;
		this.FOLLOW_RANGE = 9999;
        this.BULLET_SPEED = 1800;
		this.SPD = 100;
		
        var bullet_stats = 
        {
            Scale: 3,
			Type: 'BulletSting',
			bullets: 10
        };

        this.AI = new AI();
        if(World.Player?.haveItemInInventory('Honeycomb') != -1)
        {
            this.AI.Apply(new AI_Talk(this));

            this.startDialog = 'BubblebeeDialog';
            this.firstMetDialog = 'BubblebeeDialog';

            this.dialogLine = this.firstMetDialog;
        }


        this.AI.Apply(new AI_Wander(true, 4, 8));
		this.AI.Apply(new AI_AttackMelee(Player, this.AD, 2, {onlyOnAggressive: true}));
        this.AI.Apply(new AI_Follow(World.Player, false, function(o){return o.aggressive || o.interestedIn}));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Observe(World.Player, this.ATTACK_RANGE, function(owner){return !owner.interestedIn && owner.aggressive;}));
        this.AI.Apply(new AI_AttackRange(World.Player, bullet_stats, {updateTrigger: function(owner){return owner.aggressive && !owner.interestedIn && !owner.gotChunk;}}));

		this.AI.Apply(new AI_Boss(this));
		this.AI.Apply(new AI_Enrage(this, 50));

        this.aggressive = false;
        this.isAggressive = false;
        this.isAggressiveOnHurt = true;

        this.BossTheme = "interface.BossFight2";

        this.Model = new LargeBeeModel(this);
		this.setScale(5);

        this.enragedAnimationDuration = 4 * Main.FPS;

        this.FlyDuration = 10 * Main.FPS;

        this.DropHoneyChance = 10;

		this.invincibleScale = 1.5;
		this.LootTable = new LootTable([new LootTableItemData('TreasureOrbAquamantula', 100, 1, 1)]);

        this.canFlyAway = false;
        this.LookForHoneyDelay = MathHelper.randomInRange(10, 15) * Main.FPS;
        this.LookForHoneyTime = this.LookForHoneyDelay;
        this.timeToFlyAway = MathHelper.randomInRange(5, 10) * Main.FPS;

        this.honeyPiecesOnTake = 10;
        this.dinnerTimes = 0;

        this.honeyStats = 
        {
            summonDelay: 99999,
            MinEntities: 1,
            MaxEntities: 3
        };


        this.flyAwayTy = 100;
        this.isFlyingHome = false;
    }

    TakeHoney()
    {
        var s = World.Player.haveItemInInventory('Honeycomb');
        World.Player.inventory[s].count--;
        if(World.Player.inventory[s].count <= 0) World.Player.inventory[s] = null;

        Commands.GoToLocation('Lake9', 3, false);
        this.isFlyingHome = true;
        this.gotChunk = true;
        this.interestedIn = null;
        this.LookForHoneyTime = 9999999;
        this.killOnBorderOut = false;

        this.flyHome = this.ageInTicks + 60;
        this.timeToFlyAway = this.ageInTicks + 60;
        this.Fly();

        this.AI.Follow.observationTrigger = function(){return true;};
        this.AI.Delete('Wander');
    }

    onHurt()
    {
        this.AI.Delete('Talk');
        this.quote = null;
        this.AI.AttackMelee.onlyOnAggressive = false;

        super.onHurt();
    }

    Enrage()
    {
        this.BULLET_SPEED += 200;
        this.ATTACK_SPEED += .5;
    }

    onEnrageAnimationProgress()
    {
        if(this.ageInTicks%3 == 0)
        {
            this.honeyStats.summonDelay = MathHelper.randomInRange(60, 180) * Main.FPS
            this.SummonHoney();
        }
    }

    onWanderDestination()
    {
        if(this.isFlying) this.AI.Wander?.changeDir();
    }

    onHoneyGrab()
    {
        this.dinnerTimes++;

        this.setScale(5 + this.dinnerTimes * .5);
        this.AD += 2;
    }

    Update()
    {
        super.Update();

        if(this.gotChunk && this.ageInTicks%(5*60) == 0) this.gotChunk = false;
        if(this.isEnraged) this.aggressive = true;

        if(this.isFlyingAway)
        {
            this.Rotation = 180;

            World.Player.allowControl = false;
            World.Player.x = this.x;
            World.Player.y = this.y + this.flyAwayTy;
        }

        if(this.isFlyingHome)
        {
            this.gotChunk = true;

            if(this.ageInTicks == this.flyHome) 
            {
                this.canFlyAway = true;
            }
        }
    }
}
World.RegisterEntity(Bubblebee);