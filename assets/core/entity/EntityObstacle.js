class Obstacle extends Entity
{
	constructor(x, y, stats)
	{
		super(x, y);
        this.canBeKnockedBack = false;
        this.showHpBar = false;

		this.knockBack = 1;
        this.knockBackTime = 5/60;
        this.isObstacle = true;
        this.blockPierce = true;

        this.Immunity.ALL = true;
		this.setStats(stats);

        this.setScale(10);
	}

	onPlayerCollision(player)
	{
        if(this.knockBack)
        {
            var spd;
            var angle = MathHelper.getAngle2([player.x, player.y], [this.x, this.y]);
            if(player.isDashing || (player.ageInTicks - player.dashEnd < 5)) spd = player.GetSPD() * player.stats[STAT.DASH_DISTANCE];
            else spd = MathHelper.GetMovementSpeed(player.velocityX, player.velocityY);
            
            var strength = (spd / 300) * 1.1;
            if(strength < .1) strength = 5;

            ApplyEffect(player, 'KnockBack', this.knockBack * strength, this.knockBackTime, angle-180);
        }
	}
		
	onEntityCollision(entity)
	{
		if(this.knockBack)
        {
            var angle = MathHelper.getAngle2([entity.x, entity.y], [this.x, this.y]);
            var spd = MathHelper.GetMovementSpeed(entity.moveX, entity.moveY);
            var strength = (spd / 300) * 1.1;

            ApplyEffect(entity, 'KnockBack', this.knockBack * strength, this.knockBackTime, angle-180);
        }
	}

	setStats(stats)
	{
		if(!stats) return;

		for(var property in stats)
		{
			this[property] = stats[property];
		}
	}

    Hurt()
    {
        return;
    }
}