class ProjectileRocket extends Projectile
{
	constructor(x, y, stats)
	{
		super(x, y);
		
		if(stats)
		{
			for(var property in stats)
			{
				this[property] = stats[property];
			}
		}
		
		var texture = TextureManager.Get(this.Texture);
		if(texture)
		{
			if(!this.width) this.width = texture.width;
			if(!this.height) this.height = texture.height;
		}

		this.explosionDamage = this.damage;
		this.damage = 0;
	}
	
	Shoot(source, target)
	{
		if(source && target)
		{	
			super.Shoot(source, target);

			this[STAT.ATTACK_RANGE] = MathHelper.GetDistance([source.x, source.y], [target.x, target.y]);
		}
	}
}