class AI_Boss
{
	constructor(owner, preventAnimation = false)
	{
		this.name = "Boss";

		owner.isBoss = true;
		owner.spawnHeart = true;
		owner.isAggressive = true;
		owner.oxygenMultiplier = 10;
		if(owner.knockBackResistance == 0) owner.knockBackResistance = .5;

		if(!preventAnimation)
		{
			owner.lockAI = true;
			owner.HP = 1;
			owner.isHurtAble = false;
			owner.Transparency = 0.5;

			owner.onBossUpdate = function()
			{
				this.AI.Boss.Update(this);

				var prepareTime = 6 * Main.FPS;
				var prepareDelay = 2 * Main.FPS;

				if(this.HP >= this.MAXHP)
				{
					this.HP = this.MAXHP;
					this.onBossRender = null;
					this.Transparency = 1;

					if(this.ageInTicks >= prepareDelay + prepareTime)
					{
						this.onBossUpdate = null;
						this.lockAI = false;
						this.isHurtAble = true;
						this.onBossAnimationEnd?.();
					}
				}
				else
				{
					var hp_step = this.MAXHP / prepareTime;
					this.HP += hp_step;

					this.Transparency = 0.5 + ((this.HP / this.MAXHP) / 2);
				}
			};

			owner.onBossRender = function()
			{
				var angle = MathHelper.randomInRange(0, 360);
				var count = 1;

				if(this.ageInTicks % 2 == 0)
				{
					Particle.SummonCirclePattern("bubble", this.x, this.y, 0.4, 500, count, 
						World.Radius, angle, null, false);
				}
			};
		}
	}

	Update(owner)
	{
		World.Boss = owner;
		if(!this.createdIcon) 
		{
			owner.AI.Enrage?.CreateEnrageIcon();
			this.createdIcon = true;
		}

		if(owner.BossTheme)
		{
			if(SoundManager.Playing.Background)
			{
				if((SoundManager.Playing.Background.name != owner.BossTheme) && !SoundManager.isPlayingBossTheme)
				{
					if(SoundManager.GetAudio(owner.BossTheme))
					{
						SoundManager.Play(owner.BossTheme, "BACKGROUND");
					}
				}
			}
		}
	}

	onDeath(owner)
	{
		// Upgrade.Spawn(World.Player, owner.x, owner.y);
		World.Boss = null;

		if(owner.spawnHeart)
		{
			World.AddEntity(new Oxygen(owner.x, owner.y, 4, owner.level, true, true));
		}

		if(owner.BossTheme)
		{
			if(SoundManager.Playing.Background)
			{
				if(SoundManager.Playing.Background.name == owner.BossTheme)
				{
					setTimeout(function(){SoundManager.Play(World.Location.BackgroundTheme, "BACKGROUND"); SoundManager.isPlayingBossTheme = false}, 2000);
				}
			}
		}
	}
}