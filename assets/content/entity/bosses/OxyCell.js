class OxyCell extends EntityBubbleFormation0
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.OXY_CELL.NAME";
		this.Title = "";
		this.Subtitle = "Don`t be afraid!";

		this.MAXHP = 1000;
		this.HP = this.MAXHP;
		this.AD = 10;
		this.ATTACK_SPEED = 1;
		this.SPD = 300;
		this.Color = null;

        this.BULLET_SPEED = 800;

		
		this.AI.Delete("AttackRange");
		this.AI.Apply(new AI_AttackMelee(Player, this.AD*2));
		this.AI.Apply(new AI_Boss(this));
		this.AI.Apply(new AI_ShotOnCircle({
			shotCount: 20,
			shotDelayMin: 3,
			shotDelayMax: 3
		},
		{
			Scale: 2,
            knockBack: 3
		}));
        this.AI.Apply(new AI_Enrage(this, 50, {showAnimation: false, invincibleOnRage: false}));


		this.BossTheme = "interface.BossFight2";
        this.enragedAnimationDuration = Main.FPS;

		this.setScale(10);

        this.Clones = [];
        this.CloneSummons = 0;
        this.lastSummonTick = 0;
        this.SummonCD = 6 * Main.FPS;

        this.LootTable = new LootTable([new LootTableItemData('TreasureOrbOxyCell', 100, 1, 1)]);
        
	}

    Enrage()
    {
        this.isHurtAble = false;

        this.SPD*=1.5;
        this.BULLET_SPEED*=1.5;
        this.AI.ShotOnCircle.setShotDelay(2, 2);
    }

    onEnrageAnimationProgress()
    {
        this.AI.ShotOnCircle.attackCharge = 0;

        var new_scale = 10 - (5 * this.enrageAnimationProgress);
        this.setScale(new_scale);
    }

    onEnrageAnimationEnd()
    {
        this.isHurtAble = true;
    }

    EnrageUpdate()
    {
        if(!this.isHurtAble) return;

        var alive = 0;
        for(var i = 0; i < this.Clones.length; i++)
        {
            if(this.Clones[i].isAlive) 
            {
                alive++;
                break;
            }
        }
        
        if(alive == 0) 
        {
            if(this.lastSummonTick + this.SummonCD < this.ageInTicks) this.SummonClones();
        }
    }

    SummonClones()
    {
        var end, move, clone;
        var clones = 4;
        var cloneSpd = this.SPD * 3;
        this.Clones = [];

        var angle = (this.CloneSummons%2 == 0) ? 45 : 0;
        var angleStep = 360 / clones;
        var selfClone = MathHelper.randomInRange(0, clones-1);

        for(var i = 0; i < clones; i++)
        {
            end = MathHelper.lineToAngle(this, World.Radius*.66, angle);
            move = Motion.Get([this.x, this.y], [end.x, end.y], cloneSpd);
            clone = new OxyCellClone(this.x, this.y, move, this);
            if(i == selfClone) clone.isSelfClone = true;

            World.AddEntity(clone);
            this.Clones.push(clone);
            angle += angleStep;
        }

        this.CloneSummons++;

        // this.Transparency = 0;
        this.isHidden = true;
        this.allowMove = true;
        this.isHurtAble = false;
        this.lastSummonTick = this.ageInTicks;
    }

    onSelfCloneDeath(clone)
    {
        this.x = clone.x;
        this.y = clone.y;

        this.Transparency = 1;
        this.isHidden = false;
        this.allowMove = false;
        this.isHurtAble = true;
    }

	Update()
	{
        if(this.isEnraged) this.EnrageUpdate();
        super.Update();

		if(this.shotOnCircleCharge >= 40)
		{
			this.allowMove = false;
			this.allowFollow = false;

			this.rotationSpeed = this.baseRotationSpeed * 2;
			if(this.shotOnCircleCharge >= 80) this.rotationSpeed = this.baseRotationSpeed * 3;
		}
		else
		{
			this.rotationSpeed = this.baseRotationSpeed;
		}
		
	}
}
World.RegisterEntity(OxyCell);



class OxyCellClone extends OxyCell
{
	constructor(x, y, move, owner = World.Boss)
	{
		super(x, y);
		this.LootTable = new LootTable();

        this.isHurtAble = false;
        this.owner = owner;

        this.AI = new AI(this);
        this.isBoss = false;
        this.AI.Apply(new AI_AttackMelee(Player, this.AD*2));
        this.AI.Apply(new AI_Walk());

        this.moveX = move.x ?? 0;
        this.moveY = move.y ?? 0;

        this.Transparency = .25;
        this.setScale(owner.Scale);

        this.lockAI = false;
        this.isSelfClone = false;
	}

	Update()
	{
		super.Update();
        this.HP = this.owner.HP;

        var r = this.width * this.Scale;
		var distance = MathHelper.GetDistance([this.x, this.y], [World.CenterPoint.x, World.CenterPoint.y]);
		if(distance >= World.Radius - (r + 10)) this.Kill();
	}

    onKill()
    {
        if(this.isSelfClone) this.owner.onSelfCloneDeath(this);
    }
}
World.RegisterEntity(OxyCellClone);



