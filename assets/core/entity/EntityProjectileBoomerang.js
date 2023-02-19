class ProjectileBoomerang extends Projectile
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

        this.isReturning = false;

        this.bounceTime = 999;
        this.Pierce = 999;
        this.Bounce = true;

        this.Hits = 10;

        this.returnDeepInside = false;  //true: projectile will get killed when it reach source x,y, not when colliding with source
    }

    onBounce()
    {
        this.onRangeOut();
    }

    onRangeOut()
    {
        this.isReturning = true;
        this.piercedEntities = [];
    }

    Update()
    {
        var hurtDelay = Math.round(Main.FPS / this.Hits);
        if(this.ageInTicks%hurtDelay == 0)
        {
            this.piercedEntities = [];
        }

        if(this.isReturning)
        {
            var target = this.source;
            var spd = this.spd;

            var angle = MathHelper.getAngle2([this.x, this.y], [target.x, target.y]);
            var end = MathHelper.lineToAngle([this.x, this.y], spd, angle);

            this.from = {x: this.x, y: this.y};
            
            this.moveX = end.x - this.x;
            this.moveY = end.y - this.y;
        }
        super.Update();
    }

    onPlayerCollision(player)
    {
        if(!this.source instanceof Player) return super.onPlayerCollision(player);

        if(this.isReturning && this.source == player)
        {
            if(!this.returnDeepInside) this.Kill();
            else
            {
                var spd = MathHelper.GetMovementSpeed(this.moveX, this.moveY);
                if(MathHelper.GetDistance([this.x, this.y], [this.source.x, this.source.y]) <= spd / Main.DELTA)
                {
                    this.Kill();
                }
            }
        }
    }

    onEntityCollision(entity)
    {
        if(this.source instanceof Player) return super.onEntityCollision(entity);
 
        if(this.isReturning && this.source == entity)
        {
            if(!this.returnDeepInside) this.Kill();
            else
            {
                var spd = MathHelper.GetMovementSpeed(this.moveX, this.moveY);
                if(MathHelper.GetDistance([this.x, this.y], [this.source.x, this.source.y]) <= spd * Main.DELTA)
                {
                    this.Kill();
                }
            }
        }
    }

    onKill()
    {
        this.Item.Throws--;
    }


    Shoot(source, target)
	{
		if(source && target)
		{	
			super.Shoot(source, target);

			// this[STAT.ATTACK_RANGE] = MathHelper.GetDistance([source.x, source.y], [target.x, target.y]);
            this.Rotation = 0;
		}
	}
}