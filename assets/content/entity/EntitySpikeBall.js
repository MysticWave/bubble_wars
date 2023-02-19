class EntitySpikeBall extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.AD = 20;
		this.SPD = 250;
		this.BULLET_SPEED = 450;
		this.ATTACK_SPEED = 1;
		this.MAXHP = 100;
		this.HP = this.MAXHP;
		this.FOLLOW_RANGE = 350;
		this.Texture = "spike_ball";
		

		this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Wander());
		this.AI.Apply(new AI_AttackMelee(Player, this.AD * 1.5));
		this.AI.Apply(new AI_ShotOnCircle({shotCount: 8}, null, null, function(){return false;}));
		
		this.isAggressive = true;
		
		this.onPlayerCollision = function(player)
		{
			//nie daje expa jesli wybuchnie uderzajac w gracza
			this.oxygen = 0;
			this.Kill();
		};
		
		this.onKill = function()
		{
			var stats = 
			{
				Type: "BulletSpike",
				damage: this.AD,
				Scale: 1.5,
				spd: this.BULLET_SPEED,
				hurtEntities: true
			};
			this.AI.ShotOnCircle.Shoot(this, stats);
		};

		this.setScale(1);
	}
	
	Update()
	{
		super.Update();
	}
}
World.RegisterEntity(EntitySpikeBall);