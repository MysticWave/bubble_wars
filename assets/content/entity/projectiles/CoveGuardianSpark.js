class CoveGuardianSpark extends Projectile
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.width = 20;
		this.height = 20;

		this.Texture = "spark_circle";
		this.moveParticle = null;
        this.element = ELEMENT.THUNDER;

        this.isKilled = false;
        this.damageDealDuration = 10;
        this.timeToExplode = Main.FPS * .5;
	}

	Update()
	{
		super.Update();
        if(this.baseMoveX == null) this.baseMoveX = this.moveX;
        if(this.baseMoveY == null) this.baseMoveY = this.moveY;

        if(!this.isKilled)
        {
            var range = this[STAT.ATTACK_RANGE] ?? 0;
            var distance = MathHelper.GetDistance([this.x, this.y], this.from);
            
            var p = distance/range;

            this.moveX = this.baseMoveX * (1-(p*p*p));
            this.moveY = this.baseMoveY * (1-(p*p*p));

            this.Transparency = p/2;

            if(p >= .98) this.Kill();
        }
        else 
        {
            if(this.ageInTicks >= this.damageDealDuration+this.timeToExplode) this.Kill();
            if(this.ageInTicks >= this.timeToExplode) this.Transparency = 1;
        }

		// if(this.ageInTicks % (Main.FPS / 5) == 0)
		// {
		// 	this.piercedEntities = [];
		// }

		// this.Rotation += MathHelper.randomInRange(70, 110);
	}

    onPlayerCollision(player)
	{
		if(!this.isKilled || this.ageInTicks < this.timeToExplode) return;
        super.onPlayerCollision(player);
	}
		
	onEntityCollision(entity)
	{
		if(!this.isKilled || this.ageInTicks < this.timeToExplode) return;
        super.onEntityCollision(entity);
	}

	Kill()
	{
		if(this.isKilled) return super.Kill();

        this[STAT.ATTACK_RANGE]*=100;
		this.ageInTicks = 0;
		this.isKilled = true;

        this.moveX = 0;
        this.moveY = 0;
	}
}
Projectile.Types(CoveGuardianSpark);
