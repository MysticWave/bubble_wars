class EntityFrostTurret extends EntityTurret
{
	constructor(x, y)
	{
		super(x, y);

		this.BULLET_SPEED = 50;
		this.AD = 0;
		this.BULLET_SERIES = 1;
		this.ATTACK_SPEED = 10;
		this.ATTACK_RANGE = 600;
		this.MAXHP = 200;
		this.HP = this.MAXHP;
		this.Texture = "frost_turret_head";
		this.isAggressive = true;
		
		this.slow = 80;
		
		this.bulletStats = 
		{
			Texture: "bullet_snowflake",
			Scale: 0.1,
			slow: this.slow,
			onPlayerCollision: function(player)
			{
				if( (player.isHurtAble) && (player !== this.source))
				{
					player.Hurt(this.damage, this.source);
					player.slow = this.slow;
					this.Kill();
				}
			}
		};

		this.AI.Apply(new AI_AttackRange(World.Player, this.bulletStats));
		this.AI.Apply(new AI_Observe(World.Player));
		
		this.isAggressiveOnHurt = true;

		this.setScale(2);
	}
}
World.RegisterEntity(EntityFrostTurret);