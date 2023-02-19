class EntityLaserTurret extends EntityTurret
{
	constructor(x, y)
	{
		super(x, y);

		this.BULLET_SPEED = 1000;
		this.AD = 2;
		this.BULLET_SERIES = 500;
		this.ATTACK_SPEED = 0.1;
		this.ATTACK_RANGE = 1000;
		this.MAXHP = 200;
		this.HP = this.MAXHP;
		this.Texture = "laser_turret_head";
		this.isAggressive = true;
		
		this.slow = 70 + (this.level * 5);
		if(this.slow > 90)
		{
			this.slow = 90;
		}
		
		var stats = 
		{
			spd: this.BULLET_SPEED,
			Texture: "laser_part",
			Scale: 2.4,
			onPlayerCollision: function(player)
			{
				if( (player.isHurtAble) && (player !== this.source))
				{
					player.Hurt(this.damage, this.source);
					this.damage = 0;
				}
			}
		};

		this.AI.Apply(new AI_AttackRange(World.Player, stats));
		this.AI.Apply(new AI_Observe(World.Player));
		
		this.isAggressiveOnHurt = true;
		this.setScale(2);
	}
}
World.RegisterEntity(EntityLaserTurret);