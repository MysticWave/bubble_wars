class BubblebeeQueen extends EntityLargeBee
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.BUBBLEBEE.QUEEN.NAME";
		this.description = "ENTITY.BUBBLEBEE.QUEEN.DESCRIPTION";

		this.MAXHP = 5000;
		this.HP = this.MAXHP;
		this.AD = 5;
		this.ATTACK_SPEED = 1;
        this.ATTACK_RANGE = 1500;
		this.FOLLOW_RANGE = 9999;
        this.BULLET_SPEED = 2500;
		this.SPD = 70;
		
        var bullet_stats = 
        {
            Scale: 5,
			Type: 'BulletSting',
			bullets: 15
        };

        this.AI = new AI();
        // if(World.Player?.haveItemInInventory('Honeycomb') != -1)
        // {
        //     this.AI.Apply(new AI_Talk(this));

        //     this.startDialog = 'BubblebeeDialog';
        //     this.firstMetDialog = 'BubblebeeDialog';

        //     this.dialogLine = this.firstMetDialog;
        // }


        this.AI.Apply(new AI_Wander(true, 4, 8));
		this.AI.Apply(new AI_AttackMelee(Player, this.AD, 1, {onlyOnAggressive: true}));
        this.AI.Apply(new AI_Follow(World.Player, false, function(o){return o.aggressive || o.interestedIn}));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Observe(World.Player, this.ATTACK_RANGE, function(owner){return (!owner.interestedIn && owner.aggressive) || owner.isUsingSpecialAttack;}));
        this.AI.Apply(new AI_AttackRange(World.Player, bullet_stats, {updateTrigger: function(owner){return owner.aggressive && !owner.interestedIn && !owner.gotChunk && !owner.isUsingSpecialAttack}}));

		this.AI.Apply(new AI_Boss(this));
		this.AI.Apply(new AI_Enrage(this, 50));

        this.aggressive = false;
        this.isAggressive = false;
        this.isAggressiveOnHurt = true;


        this.BossTheme = "interface.BossFight2";

        this.Model = new LargeBeeModel(this);
        this.Model.Parts.base.Texture = 'base.queen';
        this.Model.Parts.abdomen.Texture = 'abdomen.queen';
		this.setScale(10);

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



        this.isUsingSpecialAttack = false;
       
        this.specialAttackDelay = 10 * Main.FPS;
        this.specialAttackAnimationDelayIndicator = 5 * Main.FPS;       //how earlier animation should start
        this.lastSpecialAttack = MathHelper.randomInRange(0, this.specialAttackDelay/2);

        this.specialAttackDuration = 5 * Main.FPS;
        this.specialAttackTicks = 0;
        this.specialAttackTick = 0;
        this.specialAttackTimes = 0;

        this.currentAttackType = null;
        this.battleStart = false;

        this.honeyStats = 
        {
            summonDelay: 99999,
            MinEntities: 1,
            MaxEntities: 2
        };
    }

    onHurt()
    {
        this.AI.Delete('Talk');
        this.quote = null;
        this.AI.AttackMelee.onlyOnAggressive = false;
        this.battleStart = true;

        super.onHurt();
    }

    Enrage()
    {
        this.BULLET_SPEED += 500;
        this.ATTACK_SPEED = 2.5;
    }

    onEnrageAnimationProgress()
    {
        if(this.ageInTicks%3 == 0)
        {
            this.honeyStats.summonDelay = MathHelper.randomInRange(60, 240) * Main.FPS
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

        this.setScale(10 + this.dinnerTimes/2);
        this.AD += 1;
    }

    Update()
    {
        super.Update();

        if(this.gotChunk && this.ageInTicks%(5*60) == 0) this.gotChunk = false;
        if(this.battleStart) this.aggressive = true;

        if(this.NoAI || this.lockAI || !this.battleStart) return;

        this.specialAttackTicks++;

        var tickToAttack = this.lastSpecialAttack + this.specialAttackDelay;
        if(this.specialAttackTicks >= tickToAttack+this.specialAttackAnimationDelayIndicator)
        {
            this.specialAttackUpdate();
        }

        if(this.specialAttackTicks >= tickToAttack && this.specialAttackTicks < tickToAttack +this.specialAttackAnimationDelayIndicator)
        {
            this.prepareSpecialAttack();
        }
    }












    prepareSpecialAttack()
    {
        this.allowMove = false;
        this.isUsingSpecialAttack = true;

        var tickToAttack = this.lastSpecialAttack + this.specialAttackDelay;
        var p = (this.specialAttackTicks-(tickToAttack-this.specialAttackAnimationDelayIndicator)) / this.specialAttackAnimationDelayIndicator;
        if(p > 1) p = 1;

        if(this.getSpecialAttackType() == 'STINGS')
        {
            if(this.ageInTicks%3 == 0)
            {
                var scale = .5 * MathHelper.randomInRange(75, 125) / 100 * this.Scale;
                var r = (this.Width / 2 * this.Scale);
                var x = this.x + MathHelper.randomInRange(-r, r);
                var y = this.y + MathHelper.randomInRange(-r, r);
                var spd = 50;

                Particle.Summon('effect.poison', x, y, x, y-500, scale, spd, 1, 20, 
                {
                    liveTime: 60, 
                    // owner: owner,
                    baseScale: scale,
                    center: true,
                    // globalAlpha: 0.5,
                    // RENDER_LAYER: Graphic.Layer.Particle0,
                    onUpdate: function(){this.Scale = (this.baseScale * (this.ageInTicks / this.liveTime))}
                });
            }
        }

        if(this.getSpecialAttackType() == 'HONEY')
        {
            if(this.ageInTicks%3 == 0)
            {
                var scale = .5 * MathHelper.randomInRange(75, 125) / 100 * this.Scale;
                var r = (this.Width / 2 * this.Scale);
                var x = this.x + MathHelper.randomInRange(-r, r);
                var y = this.y + MathHelper.randomInRange(-r, r);
                var spd = 50;

                Particle.Summon('effect.honey_bubble', x, y, x, y-500, scale, spd, 1, 20, 
                {
                    liveTime: 60, 
                    // owner: owner,
                    baseScale: scale,
                    center: true,
                    // globalAlpha: 0.5,
                    // RENDER_LAYER: Graphic.Layer.Particle0,
                    onUpdate: function(){this.Scale = (this.baseScale * (this.ageInTicks / this.liveTime))}
                });
            }
        }

        if(this.getSpecialAttackType() == 'BEES')
        {
            var freq = 60;
            if(this.specialAttackTicks%freq == 0)
            {
                var scale = 20 * this.Scale;
                var x = this.x;
                var y = this.y;
                Particle.Summon('effect.sonic_boom.indicator', x, y, 0, 0, scale, 0, 1, 20, 
                {
                    liveTime: 30, 
                    baseScale: scale,
                    center: true,
                    // globalAlpha: 0.5,
                    // RENDER_LAYER: Graphic.Layer.LightLevel+1,
                    onUpdate: function(){this.Scale = (this.baseScale * (this.ageInTicks / this.liveTime)); this.opacity = 1 - (this.ageInTicks / this.liveTime)}
                });
            }
        }
    }


    getSpecialAttackType()
    {
        if(this.specialAttackTimes%3 == 0) return 'STINGS';
        if(this.specialAttackTimes%3 == 1) return 'BEES';
        if(this.specialAttackTimes%3 == 2) return 'HONEY';
    }

    specialAttack()
    {
        this.allowMove = false;
        if(this.getSpecialAttackType() == 'STINGS') return this.specialAttackStings();
        if(this.getSpecialAttackType() == 'BEES') return this.specialAttackSummonBees();
        if(this.getSpecialAttackType() == 'HONEY') return this.specialAttackSummonHoney();
    }


    specialAttackStings()
    {
        var delay = 45;
        if(this.specialAttackTick%delay == 0)
        {
            var bullets = 24;
            var angle = (this.specialAttackTick%(delay*2) == 0) ? 0 : (360/bullets)/2;

            var stats = {};
                stats.Type = 'BulletSting';
                stats.spd = this.BULLET_SPEED * .75;
                stats.bullets = 0;
                stats[STAT.ATTACK_RANGE] = 9999;
                stats.Scale = 5;
                stats.damage = this.AD/2,
                stats.moveParticle = 'effect.poison',
                stats.onPlayerCollisionEffects = [['Poisoning', 1, 15, false]],
                stats.onEntityCollisionEffects = [['Poisoning', 1, 15, false]],

            AI_ShotOnCircle.StaticShoot(this, stats, bullets, {angle: angle});
        }
    }

    specialAttackSummonBees()
    {
        var delay = 30;
        if(this.specialAttackTick%delay == 0)
        {
            var pos = MathHelper.getRandomPointInRange(World.CenterPoint, World.Radius-50, World.Radius-150);
            var e = new EntityLakeLargeBee(pos.x, pos.y);
                e.dropOxygen = false;
                e.dropLoot = false;
                // e.isAggressive = true;
                e.FlyDuration = 9999999;
                e.LookForHoneyTime = 99999999;
                e.ATTACK_RANGE = 800;
                e.Fly();
            
            World.AddEntity(e, false);
        }
    }

    specialAttackSummonHoney()
    {
        var delay = 30;
        if(this.specialAttackTick%delay == 0)
        {
            var e = new EntityHoneycomb(this.x, this.y);
                e.level = 0;
                e.LootTable = new LootTable();
            
            World.AddEntity(e, false);
        }
    }

    onSpecialAttackEnd()
    {
        this.allowMove = true;
        this.isUsingSpecialAttack = false;
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
}
World.RegisterEntity(BubblebeeQueen);