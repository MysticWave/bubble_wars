class ProjectileHook extends ProjectileBoomerang
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

        this.Hits = 1;
        this.Hooked = null;
        this.knockBack = 0;
        this.canHookWhileReturning = true;
    }


    Update()
    {
        if(this.isReturning && this.Hooked)
        {
            this.Hooked.x = this.x;
            this.Hooked.y = this.y;
        }
        super.Update();
    }

    onPlayerCollision(player)
    {
        if(!(this.source instanceof Player) && !this.source.isFromPlayer) 
        {
            if(player.canBeHurt() && (this.canHookWhileReturning || (!this.canHookWhileReturning && !this.isReturning)))
            {
                this.isReturning = true;
                player.allowControl = false;
                player.allowMove = false;
                this.Hooked = player;
            }

            return super.onPlayerCollision(player);
        }
    }


    onEntityCollision(entity)
    {
        if(entity.isHurtAble && ((World.Player === this.source) || this.hurtEntities || this.source.isFromPlayer))
        {
            if(this.canHookWhileReturning || (!this.canHookWhileReturning && !this.isReturning))
            {
                this.isReturning = true;
                entity.allowMove = false;
                this.Hooked = entity;
            }
        }

        super.onEntityCollision(entity);
    }

    onKill()
    {
        if(this.Hooked)
        {
            this.Hooked.allowControl = true;
            this.Hooked.allowMove = true;
        }
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