class TheCoveGuardian extends EntityCoveFishPoison
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.THE_COVE_GUARDIAN.NAME";
		this.Texture = "entity.cove.fish.thunder.base";

		this.MAXHP = 3500;
		this.HP = this.MAXHP;
		this.AD = 50;
        this.ATTACK_RANGE = 1900;
		this.FOLLOW_RANGE = 500;
        this.BULLET_SPEED = 2000;
		this.SPD = 200;

        this.AI.Apply(new AI_Boss(this));
        this.AI.Apply(new AI_Enrage(this, 50));

		this.LootTable = new LootTable([
			new LootTableItemData("Topaz1", 50, 1, 1)
		]);

        this.enragedAnimationDuration = 4 * Main.FPS;

        this.specialAttackDelay = 4 * Main.FPS;
        this.specialAttackDuration = 4 * Main.FPS;

        this.lastSpecialAttack = 30;
        this.summoned = null;

        this.Immunity[ELEMENT.POISON] = false;
        this.Immunity[ELEMENT.THUNDER] = true;

		this.setScale(8);
	}

    specialAttack()
    {
        this.allowMove = false;

        if(this.isEnraged)
        {
            if(this.specialAttackTimes%10==3) return this.specialAttackSummons();
            if(this.specialAttackTimes%2==1) return this.specialAttackStorm();
            this.specialAttackSpark();
        }
        else
        {
            if(this.specialAttackTimes%10==3) return this.specialAttackSummons();
            this.specialAttackSpark();
        }
    }

    specialAttackSummons()
    {
        if(!this.summoned)
        {
            this.killLightning = false;

            var angle = MathHelper.randomInRange(0, 360);
            var r = 70 * this.Scale;

            var pos1 = MathHelper.lineToAngle(this, r, angle);
            var pos2 = MathHelper.lineToAngle(this, r, angle+120);
            var pos3 = MathHelper.lineToAngle(this, r, angle+240);

            var entity1 = new EntityCoveFishPoison(pos1.x, pos1.y);
                entity1.NoAI = true;
                entity1.Transparency = 0;
                entity1.isHurtAble = false;
            var entity2 = new EntityCoveFishFire(pos2.x, pos2.y);
                entity2.NoAI = true;
                entity2.Transparency = 0;
                entity2.isHurtAble = false;
            var entity3 = new EntityCoveFishIce(pos3.x, pos3.y);
                entity3.NoAI = true;
                entity3.Transparency = 0;
                entity3.isHurtAble = false;

            World.AddEntity(entity1);
            World.AddEntity(entity2);
            World.AddEntity(entity3);

            this.summoned = [entity1, entity2, entity3];

            var data = {fromTy: this.height * .25 * this.baseScale};
            World.AddParticle(new ParticleLightning(this, entity1, data));
            World.AddParticle(new ParticleLightning(this, entity2, data));
            World.AddParticle(new ParticleLightning(this, entity3, data));
        }
        else
        {
            for(var i in this.summoned)
            {
                var e = this.summoned[i];
                e.Transparency = this.specialAttackTick/this.specialAttackDuration;
            }
        }
    }

    onSpecialAttackEnd()
    {
        super.onSpecialAttackEnd();
        if(this.summoned)
        {
            for(var i in this.summoned)
            {
                var e = this.summoned[i];
                e.NoAI = false;
                e.isHurtAble = true;
            }
            this.summoned = null;
            this.killLightning = true;
        }
    }

    onKill()
    {
        if(this.summoned)
        {
            for(var i in this.summoned)
            {
                var e = this.summoned[i];
                e.Kill();
            }
        }
    }

    specialAttackStorm()
    {
        var delay = 1;
        if(this.specialAttackTick%delay == 0)
        {
            var pos = MathHelper.getRandomPointInRange(World.CenterPoint, World.Radius-50);

            var stats = {};
                stats.spd = 0;
                stats.Scale = 10;
                stats.damage = this.AD*2;
                stats.damage = 1;
                stats.knockBack = 0;
                stats.x = pos.x;
                stats.y = pos.y;
                stats.Type = 'ExplosionLightningStrike';
                stats.onPlayerCollisionEffects = [['Stun', 1, 2, false]];
                stats.onEntityCollisionEffects = [['Stun', 1, 2, false]];

            AI_ShotOnCircle.StaticShoot(this, stats, 1);
        }
    }

    specialAttackSpark()
    {
        var delay = 5;
        if(this.specialAttackTick%delay == 0)
        {
            var bullets = 1;
            var s = MathHelper.randomInRange(50, 150)/100;
            var angle = MathHelper.getAngle2(this, World.Player) + MathHelper.randomInRange(-60, 60);
            var range = MathHelper.GetDistance(this, World.Player) * 1.5;
            var y = this.y;
            this.y += this.height * .25 * this.baseScale;

            var stats = {};
                stats.spd = this.BULLET_SPEED;
                stats[STAT.ATTACK_RANGE] = range * (s/2);
                stats.Scale = 2 * this.Scale * s;
                stats.damage = this.AD*s;
                stats.knockBack = 0;
                stats.Type = 'CoveGuardianSpark';

            AI_ShotOnCircle.StaticShoot(this, stats, bullets, {angle: angle});

            this.y = y;
        }
    }

    RenderTexture(context)
    {
        if(this.isEnraged)
        {
            var texture = TextureManager.Get('spark_circle');

            var x = this.x - Camera.xView;
            var y = this.y - Camera.yView;

            var scale = 1.3 * this.Scale;
            var rotation = MathHelper.randomInRange(0, 360);

            Graphic.DrawRotatedImage(context, texture, x, y, this.width, this.height, scale, rotation, this.Transparency*.5);
        }

        super.RenderTexture(context);
    }
}
World.RegisterEntity(TheCoveGuardian);