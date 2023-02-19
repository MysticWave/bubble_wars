class Oxygen extends Entity
{
	constructor(x, y, value = 0, level, isHeart = false, isFromBoss = false, motion)
	{
		super(x, y);
		this.isHurtAble = false;
		this.Texture = "bubble";
		this.level = level;
		this.isHeart = isHeart;
		this.isFromBoss = isFromBoss;
		this.moveParticle = "";

		this.width = 45;
		this.height = 45;
		
		this.value = value;
		this.SPD = 350;
		this.FOLLOW_RANGE = 150;
		this.oxygen = 0;

		if(motion)
		{
			this.moveX = motion.x;
			this.moveY = motion.y;
		}
		else
		{
			this.AI.Apply(new AI_Follow(World.Player));
		}
		
		this.DeathSound = "effect.BubblePop";

		this.AI.Apply(new AI_Walk());
		
		this.onPlayerCollision = function(player){this.Collect(player)};
		
		if((this.value > 50 && !this.isHeart) || (this.value > 2 && this.isHeart))
		{
			this.Split();
		}

		this.Scale = 0.45 + ((this.value / 5) * 0.01);
		
		
		if(this.value == 0)
		{
			this.Scale = 0;
			this.DeathSound = "";
		}

		if(this.isHeart)
		{
			this.Scale = 1;
			this.maxHeartScale = 1.2;
			this.minHeartScale = 0.8;
			this.heartScaleTransition = new Transition(this.minHeartScale, this.maxHeartScale, 0.1, true, 0.05, 10.05);
			this.heartScaleTransition.RandomizeDelay(true, 50);

			this.beatTimes = 2;
			this.beatTime = 0;

			if(this.value == 2)
			{
				this.Texture = "heart";
			}
			else
			{
				this.Texture = "heart_half";
			}
		}

		this.baseScale = this.Scale;
	}
	
	Split()
	{
		var value = (this.isHeart) ? this.value * 10 : this.value;
		while(value > 20)
		{
			value = Math.ceil(value * 0.5);
			this.value = Math.ceil(this.value * 0.5);
			var pos = MathHelper.getRandomPointInRange([this.x, this.y], 150);
		
			World.AddEntity(new Oxygen(pos.x, pos.y, this.value, this.level, this.isHeart));
		}
	}
	
	Update()
	{
		super.Update();
		if(World.Location.isCleared && !this.isHeart)
		{
			this.FOLLOW_RANGE = (World.Radius * 2);
			this.SPD = 900;
		}
		if(this.isHeart)
		{
			this.Scale = this.heartScaleTransition.Update();
			this.AI.Follow.disabled = false;

			
			if(this.heartScaleTransition.isUnreverseTick)
			{
				if(this.beatTime >= this.beatTimes - 1)
				{
					this.beatTime = 0;
				}
				else
				{
					this.beatTime++;
					this.heartScaleTransition.reverseTicks = this.heartScaleTransition.unreverseDelay;
				}			
			}

			//zapobiega odwracaniu sie serca podczas podazania do gracza
			this.Rotation = 0;

			//serce nie podaza za graczem jesli ma pelne zdrowie
			if(World.Player.stats.HP == World.Player.stats.MAXHP)
			{
				this.AI.Follow.disabled = true;


				var delay = 0.9;
				this.moveX *= delay;
				this.moveX = (this.moveX > 0) ? Math.floor(this.moveX) : Math.ceil(this.moveX);

				this.moveY *= delay;
				this.moveY = (this.moveY > 0) ? Math.floor(this.moveY) : Math.ceil(this.moveY);
			}

		}
	}

	static GetOxygenValue(value, playerLevel, oxygenLevel, isBoss)
	{
		var exp = value;
		var maxLevelDiff = 5;
		var lostPerLevel = (isBoss) ? 10 : 20;		//%

		var levelDifference = Math.abs(oxygenLevel - playerLevel);
		if(levelDifference > maxLevelDiff)
		{
			var times = levelDifference - maxLevelDiff;
			exp -= Math.floor(exp * (times * lostPerLevel) / 100);
		}
		exp = (exp < 1) ? 1 : exp;

		return exp;
	}
	
	Collect(player)
	{
		if(this.isHeart)
		{
			//gracz nie moze zebrac serca jesli ma pelne zdrowie
			if(player.stats.HP == player.stats.MAXHP) return;

			var value = (this.value * Player.GetHeartValue());
			player.stats.HP += value;
			player.stats.HP = (player.stats.HP > player.stats.MAXHP) ? player.stats.MAXHP : player.stats.HP;
			DamageIndicator.AddObject(this.x, this.y, value, "HEAL");
		}
		else
		{
			var exp = Oxygen.GetOxygenValue(this.value, player.stats.Level, this.level, this.isFromBoss);

			var coins = this.value * 2;

			player.oxygen += exp;
			player.oxygenGainedInRoom += exp;
			player.coins += coins;

			player.RunStats.totalExperienceEarned += exp;
			player.RunStats.totalGoldEarned += coins;
		}
		
		this.Kill();
		World.Spawn(new Particle("bubble_pop", this.HitBox.x, this.HitBox.y, 20, this.width, this.height, this.Scale, true));
	}
}
World.RegisterEntity(Oxygen);