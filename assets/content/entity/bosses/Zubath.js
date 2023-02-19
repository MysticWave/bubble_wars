class Zubath extends EntityBat
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.ZUBATH.NAME";

		this.Texture = "entity.bat.base";
        this.Eyes = 'entity.bat.eyes';
        this.wingTextureLeft = 'entity.bat.wing.left';
        this.wingTextureRight = 'entity.bat.wing.right';

		this.MAXHP = 3500;
		this.HP = this.MAXHP;
		this.AD = 15;
		this.ATTACK_SPEED = 0.2;
        this.ATTACK_RANGE = 1500;
		this.FOLLOW_RANGE = 350;
        this.BULLET_SPEED = 750;
		this.SPD = 300;
        this.BULLETS_COUNT = 15;
		
		var bulletStats = 
		{
			Type: "BulletSoundWave",
			Scale: 3,
            Bounce: 1
		};

		this.isAggressive = true;

		this.AI.Delete('AttackMelee');
		this.AI.Delete('AttackRange');

		this.AI.Apply(new AI_AttackMelee(Player, this.AD, 2));
		this.AI.Apply(new AI_AttackRange(World.Player, bulletStats,{maximalAngle: 150, updateTrigger: function(o){return !o.isUsingSonicBoom}}));

		this.AI.Apply(new AI_Boss(this));
		this.AI.Apply(new AI_Enrage(this, 50));

		this.HitBox.Scale = .5;

		this.LootTable = new LootTable();

        this.WingAnimation = new Transition(0, 4, .15, true, 0, 0, false);
		this.setScale(5);

		this.BossTheme = "interface.BossFight2";
		this.enragedAnimationDuration = 4 * Main.FPS;

		this.isUsingSonicBoom = false;
		this.sonicBoomDuration = 5 * Main.FPS;
		this.sonicBoomPreparationTime = 5 * Main.FPS;
		this.sonicBoomCoolTime = 10 * Main.FPS;
		this.sonicBoomStart = 0;
		this.baseSonicIndicatorFrequency = 120;
		this.sonicIndicatorFrequency = this.baseSonicIndicatorFrequency;
	}

	Update()
	{
		super.Update();

		if(this.isEnraged) this.EnrageUpdate();
	}


	onEnrageAnimationEnd()
    {
		this.sonicBoomStart = this.ageInTicks + (this.sonicBoomCoolTime / 2);
    }


    EnrageUpdate()
    {
		if(this.ageInTicks == this.sonicBoomStart) this.isUsingSonicBoom = true;

		if(this.isUsingSonicBoom)
		{
			this.allowMove = false;
			var tick = this.ageInTicks - this.sonicBoomStart;
			
			this.attack_frame = Math.floor(2 * (tick/60));
			if(this.attack_frame > 2) this.attack_frame = 2;

			if(tick <= this.sonicBoomPreparationTime)
			{
				//prepare sonic boom

				//om nom nom the player
				var strength = 550;
				if(Difficulty(2)) strength = 650;
				var motion = Motion.Get([World.Player.x, World.Player.y], [this.x, this.y], strength);
					World.Player.ApplyMove(motion);

				if(tick <= this.sonicBoomPreparationTime)
				{
					var freq = this.sonicIndicatorFrequency;
					if(tick%freq == 0)
					{
						var scale = 20 * this.Scale;
						var x = this.x;
						var y = this.y;
						Particle.Summon('effect.sonic_boom.indicator', x, y, 0, 0, scale, 0, 1, 20, 
						{
							liveTime: 30, 
							baseScale: scale,
							center: true,
							// globalAlpha: 0.5,
							RENDER_LAYER: Graphic.Layer.LightLevel+1,
							onUpdate: function(){this.Scale = this.baseScale - (this.baseScale * (this.ageInTicks / this.liveTime)); this.opacity = 1 - (this.ageInTicks / this.liveTime)}
						});

						this.sonicIndicatorFrequency /= 2;
					}
				}
			}
			else
			{
				var delay = 60;
				tick -= this.sonicBoomPreparationTime;
				if(tick <= this.sonicBoomDuration+delay)
				{
					//sonic booom
					if(tick >= delay) this.SonicBoomShoot();
				}
				else
				{
					this.isUsingSonicBoom = false;
					this.sonicBoomStart = this.ageInTicks + this.sonicBoomCoolTime;
					this.sonicIndicatorFrequency = this.baseSonicIndicatorFrequency;
					this.allowMove = true;
				}
			}
		}
    }

	SonicBoomShoot()
	{
		var delay = 2;
        if(this.ageInTicks%delay == 0)
        {
            var bullets = 1;
            var angle = MathHelper.getAngle2(this, World.Player);

            var stats = {};
                stats.spd = 2500;
                stats.Scale = 30;
                stats.damage = 1;
                stats.knockBack = 0;
                stats.Type = 'BulletEcho';
				stats.showParticle = false;
				stats.scaleGrow = .025;
				stats.Bounce = 0;
				stats.playerEffectChance = 100;
				stats.onPlayerCollisionEffects = [['Stun', 1, .5, false]];

            AI_ShotOnCircle.StaticShoot(this, stats, bullets, {angle: angle});
        }
	}
}
World.RegisterEntity(Zubath);



