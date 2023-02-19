class Trimago extends EntityTrim
{
	constructor(x, y, isBoss = true)
	{
		super(x, y);
		
		this.name = "ENTITY.TRIMAGO.NAME";
        this.BossTheme = "interface.BossFight2";

		this.MAXHP = 1000;
		this.HP = this.MAXHP;
		this.AD = 10;
		this.ATTACK_SPEED = 1;
		this.SPD = 500;

		this.ATTACK_RANGE = 1500;
		this.FOLLOW_RANGE = 1500;
		this.BULLET_SPEED = 800;
		
		var stats = 
		{
            shotCount: 18,
            shotDelayMin: 5,
            shotDelayMax: 5,
            getStartAngleFromOwnerRotation: true
		};

        this.AI = new AI(this);
        this.AI.Apply(new AI_Bounce(this, 0, function(o){return MathHelper.getAngle2(o, World.Player)}, Player));
        this.AI.Apply(new AI_Walk());
        this.AI.Apply(new AI_AttackMelee(Player, 0, 1));
        this.AI.Apply(new AI_ShotOnCircle(stats,
        {
            Scale: 2
        }, true));
        if(isBoss)
        {
            this.AI.Apply(new AI_Boss(this));
            this.AI.Apply(new AI_Enrage(this, 50));
        }
		
		this.isAggressive = true;
		this.LootTable = new LootTable([new LootTableItemData('TreasureOrbTrimago', 100, 1, 1)]);

		this.setScale(8);

        this.canMoveWhileShooting = true;

        this.enragedAnimationDuration = 4 * Main.FPS;
        this.enragedAnimationEnd = false;

        this.napalmTicks = 0;
        this.napalmDuration = 6 * Main.FPS;
        this.napalmCooltime = 6 * Main.FPS;
        this.napalmCooltimeTicks = 0;

        this.Immunity.SLOW = true;
        this.timeToEat = 30;
	}

    Enrage()
    {
        this.SPD*=1.5;
        this.BULLET_SPEED = 300;

        this.shotOnCircleCharge = 0;
        this.AI.ShotOnCircle.setShotDelay(9999, 9999);
        this.AI.ShotOnCircle.shotCount = 3;
    }

    onEnrageAnimationProgress()
    {
        this.AI.ShotOnCircle.attackCharge = 0;

        var new_scale = 8 - (4 * this.enrageAnimationProgress);
        this.setScale(new_scale);
    }

    onEnrageAnimationEnd()
    {
        this.enragedAnimationEnd = true;

        var trims = 11;
        this.trimsAlive = trims;
        this.enrageTicks = 0;
        this.Trims = [];
        ApplyEffect(this, 'Invincibility', 1, this.timeToEat);
        for(var i = 0; i < trims; i++)
        {
            var angle = (360/trims) * i;
            var trim  = new Trimago(this.x, this.y, false);
                trim.AI = new AI(trim);
                trim.AI.Apply(new AI_Bounce(trim, angle));
                trim.AI.Apply(new AI_Walk());
                trim.AI.Apply(new AI_AttackMelee(Player, 0, 2));
                trim.MAXHP = (this.MAXHP / 2) / (trims+1);
                trim.HP = trim.MAXHP;
                trim.isAggressive = true;
                trim.onKill = function(){this.Master.trimsAlive--;}
                trim.LootTable = new LootTable();
                trim.setScale(this.Scale);
                trim.Master = this;

            this.Trims.push(trim);
            World.AddEntity(trim);
        }
    }

    EnrageUpdate()
    {
        if(!this.enragedAnimationEnd) return;

        this.enrageTicks++;
        this.napalmCooltimeTicks++; 

        if((this.napalmCooltimeTicks >= this.napalmCooltime))
        {
            this.napalmTicks++;
            if(this.napalmTicks < this.napalmDuration)
            {
                if(this.napalmTicks == 1) this.AI.ShotOnCircle.setShotDelay(.15, .15);
            }
            else
            {
                this.napalmCooltimeTicks = 0;
                this.napalmTicks = 0;
                this.AI.ShotOnCircle.setShotDelay(9999, 9999);
            }
        }

        if((this.napalmCooltimeTicks >= this.napalmCooltime*.5))
        {
            var p = (this.napalmCooltimeTicks-this.napalmCooltime*.5) / (this.napalmCooltime*.5);
            if(p>1) p = 1;
            this.rotationSpeed = this.baseRotationSpeed * (1-(p*.75));
        }

        if(this.trimsAlive == 0)
        {
            this.Effects.Clear('Invincibility');
            this.Trims = null;
        }

        if(this.enrageTicks >= this.timeToEat * Main.FPS && this.Trims)
        {
            for(var i in this.Trims)
            {
                var t = this.Trims[i];
                if(!t.isAlive) continue;

                t.AI.Delete('Bounce');
                t.AI.Apply(new AI_Follow(this));
                t.canBeEaten = true;
                t.SPD = this.SPD * 2;
            }

            this.Trims = null;
        }
    }

	Update()
	{
		super.Update();
        if(this.isEnraged) this.EnrageUpdate();
        this.Rotation = (this.Rotation + this.rotationSpeed)%360;

        if(this.Master && !this.Master.isAlive) return this.Kill();

        if(this.canBeEaten)
        {
            if(MathHelper.GetDistance(this, this.Master) <= this.Master.width * this.Master.Scale)
            {
                this.Master.HP += this.HP;
                this.Kill();
            }
        }
	}
}
World.RegisterEntity(Trimago);