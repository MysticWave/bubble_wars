class Entity
{
	constructor(x = 0, y = 0)
	{
		this.x = x;
		this.y = y;
		this.lastPos = {x: x, y: y};
		this.width = 64;
		this.height = 64;
		this.ageInTicks = 0;
		this.Scale = 1;
		this.additionalScaleMultiplier = 1;
		this.Rotation = 0;
		this.defaultRotation = 0;
		this.TextureRotation = 0;
		this.Origin = {x: 0, y: 0};
		this.TextureData = {};

		this.Hands = null;
		this.Transparency = 1;
		this.Model = null;
		this.isBouncing = false;
		this.Bounce = false;
		this.bounceTimes = 0;
		this.bounceTime = 2;
		this.isHurtAble = true;
		this.isAggressive = false;
		this.isAggressiveOnHurt = false;
		this.aggressive = false;
		this.isNPC = false;
		this.quote = null;
		this.description = '';

		this.maxCollisionStep = 20;
		
		this.level = 0;
		this.oxygen = null;
		this.oxygenMultiplier = 1;
		
		this.moveX = 0;
		this.moveY = 0;
		
		this.AI = new AI(this);
		this.NoAI = false;
		this.lockAI = false;
		this.unlockAI = '';
		this.preRenderFunctions = [];
		this.onRenderFunctions = [];

		this.Effects = new Effects();

		this.MAXHP = 1;
		this.AD = 0;
		this.SPD = 0;
		this.ATTACK_RANGE = 0;
		this.ATTACK_SPEED = 0;
		this.BULLETS_COUNT = 0;
		this.BULLET_SERIES = 0;
		this.BULLET_SPEED = 0;

		this.HP = this.MAXHP;

		this.lockMove = 
		{
			Top: false,
			Down: false,
			Right: false,
			Left: false
		};

		//calkowita odpornosc na dany zywiol
		this.Immunity = {};

		//slabosc na dany zywiol (2x obrazenia)
		this.Weakness = {};

		//odpornosc na zywiol (2x mniejsze obrazenia)
		this.Resistance = {};

		for(var name in ELEMENT)
		{
			this.Immunity[name] = false;
			this.Weakness[name] = false;
			this.Resistance[name] = false;
		}
		this.knockBackResistance = 0;
		this.canBeKnockedBack = true;

		this.lastHurtBy = null;

		this.DeathSound = "";
		this.HurtSound = "";
		this.LivingSound = "";
		this.moveParticle = null;
		this.moveParticleDelay = 5;
		this.moveParticleDiff = MathHelper.randomInRange(0, this.moveParticleDelay);

		this.isAlive = true;
		this.LootTable = new LootTable();
		
		this.HitBox = new HitBox();
		this.advancedHitBox = [];
		this.allowMove = true;

		this.Color = null;
		this.coloredTexture = {color: null, texture: null};
		this.showHpBar = true;
		this.alwaysRenderHpBar = false;
		this.showDamageReceived = true;

		this.allowRotationChange = true;

		this.RenderTransitions = {};
		this.UpdateTransitions = {};

		this.dropLoot = true;
		this.dropOxygen = true;

		this.Tier = 0;
		this.Slow = 0;

		this.isHidden = false;

		this.isPoisoned = false;
		this.ignoreBorder = false;
		this.killOnBorderOut = true;
		this.isStunned = false;

		this.invincibleScale = 1;
		this.lightRadius = 0;

		this.heartDropChance = 5;
		this.heartDropValue = 1;

		this.mustBeKilled = true;		//this entity has to be killed to clear room

		this.setScale(1);
	}

	static GetAvailableTargets(owner, distance = owner.ATTACK_RANGE)
	{
		for(var i in World.Entities)
		{
			var e = World.Entities[i];
			if(!e.isOnScreen) continue;
			if(e.isFromPlayer) continue;
			if(e instanceof Oxygen) continue;
			if(e.isNPC) continue;
			if(!e.isHurtAble) continue;

			if(MathHelper.GetDistance([e.x, e.y], [owner.x, owner.y]) <= distance) return e;
		}
	}

	onHeal(){}
	Heal(amount, percent = false, showIndicator = true)
	{
		if(percent) amount = Math.ceil(this.MAXHP * amount / 100);
		var healed = amount;

		if(this.HP >= this.MAXHP) return;

		this.HP += amount;
		if(this.HP > this.MAXHP)
		{
			healed -= (this.MAXHP - this.HP);
			this.HP = this.MAXHP;
		}

		if(showIndicator) DamageIndicator.AddObject(this.x, this.y, healed, "HEAL");
		this.onHeal();
	}

	onSummon(){}

	getSPD()
	{
		return this.SPD * ((100-this.Slow) / 100);
	}

	getId()
	{
		return this.constructor.name.toUpperCase();
	}

	getDisplayName()
	{
		if(this.displayName) return Lang.Get(this.displayName);
		if(this.name) return Lang.Get(this.name);
		return null;
	}

	getDescription()
	{
		return Lang.Get(this.description);
	}

	getOxygen()
	{
		if(this.oxygen != null) return this.oxygen;
		return this.level * 3 * this.oxygenMultiplier;
	}

	setLevel(level)
	{
		if(this.level) return;
		this.level = level;
		if(this.isBoss) this.level += 3;
		else this.level += this.Tier;
	}

	gotAI(id)
	{
		if(this.AI[id]) return true;
		return false;
	}

	setScale(new_scale)
	{
		this.baseScale = new_scale;
		this.Scale = new_scale;
	}

	Update()
	{
		this.isBouncing = false;
		this.ageInTicks++;

		for(var name in this.UpdateTransitions)
		{
			set(this, name, this.UpdateTransitions[name].Update(), true);
		}

		this.Width = this.width;
		this.Height = this.height;

		if(!this.NoAI)
		{
			this.AI.Update(this);
		}	
		this.Effects.Update(this);

		this.CheckCollisions();

		var distanceFromLastPosition = MathHelper.GetDistance([this.x, this.y], this.lastPos);
		if(distanceFromLastPosition > this.maxCollisionStep && this.ageInTicks > 1)
		{
			var steps = Math.ceil(distanceFromLastPosition / this.maxCollisionStep);
			var moveX =  this.x - this.lastPos.x;
			var moveY =  this.y - this.lastPos.y;

			var x = this.x;
			var y = this.y;

			for(var i = 1; i <= steps; i++)
			{
				if(!this.isAlive) break;
				this.x = this.lastPos.x + (moveX * (i / steps));
				this.y = this.lastPos.y + (moveY * (i / steps));

				this.CheckCollisions();
			}

			this.x = x;
			this.y = y;
		}

		
		if(this.isAggressive) this.aggressive = true;
		
		if(this.isHurtAble && this.HP <= 0)
		{
			this.Kill();
			return;
		}

		if(this.isBoss) if(isFunction(this.onBossUpdate)) this.onBossUpdate();

		this.HitBox.Update(this);
		for(var i in this.advancedHitBox)
		{
			this.advancedHitBox[i].Update(this);
		}

		if(this.Model)
		{
			this.Model.Update();
		}
		this.allowMove = true;
		this.disableObserve = false;
		this.allowFollow = true;

		this.lastPos = {x: this.x, y: this.y};
	}

	isLeavingBorder()
    {
        var dist = MathHelper.GetDistance(this, World.CenterPoint);
        var next_dist = MathHelper.GetDistance([this.x + this.moveX, this.y+this.moveY], World.CenterPoint);

        return dist < next_dist;
    }

	CheckCollisions()
	{
		Collision.Check(this);

		var distance = MathHelper.GetDistance([this.x, this.y], [World.CenterPoint.x, World.CenterPoint.y]);
		if(distance >= World.Radius && this.isLeavingBorder()) this.onCollision?.();
		if(this.killOnBorderOut && distance > World.Radius * 1.5) 
		{
			this.Kill();
		}

		var player = World.Player;
		if(Collision.AreColliding(player, this))
		{
			if(isFunction(this.onPlayerCollision))
			{
				this.onPlayerCollision(player);
			}
			
			if(this.AI.AttackMelee)
			{
				this.AI.AttackMelee.Hurt(this, player);
			}
		}

		if(this instanceof ProjectileLaserBeam)
		{
			this.checkForCollision(player);
		}



		if(isFunction(this.onEntityCollision) || (this.AI.AttackMelee && this.isFromPlayer))
		{
			for(var i = 0; i < World.Entities.length; i++)
			{
				var entity = World.Entities[i];

				//pomija sprawdzanie kolizji miedzy tlenkami
				if(entity instanceof Oxygen) continue;
				if(entity == this) continue;

				if(this instanceof ProjectileLaserBeam)
				{
					this.checkForCollision(entity);
					continue;
				}

				if( (this instanceof Projectile) && !this.lockApplyMove && this.followRange)
				{
					//tylko pociski gracza moga naprowadzac sie na przeciwnikow
					if(this.source instanceof Player)
					{
						if(!this.piercedEntities.includes(entity))
						{
							if(MathHelper.isInRange(this, entity, this.followRange))
							{
								var motion = Motion.Get(this, entity, this.spd);
								this.Rotation = motion.angle + 90;
								this.lockApplyMove = true;
								// this.ApplyMove(motion);
								this.moveX = motion.x;
								this.moveY = motion.y;
							}
						}
					}
				}

				if(Collision.AreColliding(entity, this))
				{
					this.onEntityCollision?.(entity);
					
					if(this.AI.AttackMelee) 
					{
						this.AI.AttackMelee.Hurt(this, entity);
					}

					//przerywa petle jesli byt juz umarl
					if(!this.isAlive) break;
				}
			}
		}
	}

	RenderHpBar(context)
	{
		var percent = this.HP / this.MAXHP;
		if(percent == 1 && !this.alwaysRenderHpBar) return;

		var size = 2;
		var width = this.Width * this.Scale;
		var height = 8;

		var x = this.x - Camera.xView - (width / 2);
		var y = this.y - Camera.yView - (this.Height / 2 * this.Scale) - height - 5;	

		var color = (this.isPoisoned) ? '#02fa40' : 'red';
		context.save();
		context.fillStyle = color;
		context.strokeStyle = 'white';
		context.lineWidth = size;
		Graphic.roundRect(ctx, x - (size / 2), y - (size / 2), (width * percent) + size, height + size, height, true, false);
		Graphic.roundRect(ctx, x - (size / 2), y - (size / 2), width + size, height + size, height, false, true);
		context.restore();
	}

	Render(context)
	{
		if(this.isHidden) return;
		if(this.additionalScaleMultiplier <= 0) this.additionalScaleMultiplier = 1;

		for(var i in this.preRenderFunctions)
		{
			this.preRenderFunctions[i](context, this);
		}
		
		for(var name in this.RenderTransitions)
		{
			var value = this.RenderTransitions[name].Update();
			if(name == 'Scale') value *= this.baseScale * this.additionalScaleMultiplier ?? this.Scale * this.additionalScaleMultiplier;

			set(this, name, value, true);
		}

		if(!this.RenderTransitions.Scale)
		{
			this.Scale = this.baseScale * this.additionalScaleMultiplier;
		}

		

		if(this.moveParticle)
		{
			var spd = MathHelper.GetMovementSpeed(this.moveX, this.moveY);
			if(spd >= 350)
			{
				if((this.ageInTicks - this.moveParticleDiff) % this.moveParticleDelay == 0)
				{
					var x = this.x + (this.width / 4 * this.Scale);
					var y = this.y + (this.height / 4 * this.Scale);


					Particle.SummonCirclePattern(this.moveParticle, x, y, 0.4, 2, 1, 11, null, null, false, 10, {Rotation: this.Rotation});
				}
			}
		}

		if(this.Model)
		{
			this.Model.Render(context);
		}
		else
		{
			if(this.Color)
			{
				if(this.coloredTexture.color != this.Color.toString())
				{
					if(this.Color == 'none') this.coloredTexture.texture = TextureManager.Get(this.Texture);
					else this.coloredTexture.texture = Graphic.ApplyMask(TextureManager.Get(this.Texture), this.Color);

					this.coloredTexture.color = this.Color.toString();
					this.coloredTexture.src = this.Texture;
				}
			}

			if(!this.coloredTexture.texture)
			{
				this.coloredTexture.texture = TextureManager.Get(this.Texture);
			}

			if(this.coloredTexture.src != this.Texture)
			{
				this.coloredTexture.color = 'none';
				this.coloredTexture.texture = TextureManager.Get(this.Texture);
				this.coloredTexture.src = this.Texture;
			}

			if(this.Hands) this.RenderHands(context);
			this.RenderTexture(context);
		}

		this.HitBox.Render();
		for(var i in this.advancedHitBox)
		{
			this.advancedHitBox[i].Render();
		}
		
		if(this.isHurtAble && this.showHpBar)
		{
			this.RenderHpBar(context);
		}

		if(this.quote)
		{
			this.style = Style.GetDefault();
			this.style.textAlign = 'center';
			Style.FillText(context, this, this.quote, this.x - Camera.xView, this.y - ((this.height / 2) * this.Scale) - 10  - Camera.yView, null, null, this.Transparency);
		}

		if(this.isBoss)
		{
			if(isFunction(this.onBossRender)) this.onBossRender();
		}

		for(var i in this.onRenderFunctions)
		{
			this.onRenderFunctions[i](context, this);
		}

		this.Effects.Render(context, this);

		if(this.lightRadius) Graphic.addLightSource(this.x - Camera.xView, this.y - Camera.yView, this.lightRadius*this.Scale);
	}

	RenderHands(context)
	{
		var hands = this.Hands;
		var handY = this.HandMove?.Update() ?? 0;

		for(var i = 0; i < hands.length; i++)
		{
			var hand = hands[i];
			var texture = TextureManager.Get(hand[0]);
			var tX = hand[1] ?? 0;
			var tY = hand[2] ?? 0;
			var width = hand[3] ?? 32;
			var height = hand[4] ?? 32;
			var rotation = hand[5] ?? 0;

			if(this.moveX != 0 || this.moveY != 0)
			{
				if(i%2 == 0) tY += handY*height;
				else tY -= handY*height;
			}

			context.save();
			context.translate(this.x - Camera.xView, this.y - Camera.yView);
			context.rotate((this.Rotation + rotation) * Math.PI/180);
			context.globalAlpha = this.Transparency;
			context.drawImage(
				texture, 0, 0, texture.width, texture.height,
				-((this.width / 2) + tX) * this.Scale, -((this.height / 2) + tY) * this.Scale,
				(width * this.Scale), (height * this.Scale)
			);
			context.restore();
		}
	}

	RenderTexture(context)
	{
		var texture = this.coloredTexture.texture;

		// context.save();
		// context.translate(this.x - Camera.xView, this.y - Camera.yView);
		// context.rotate((this.Rotation + this.TextureRotation) * Math.PI/180);
		// context.globalAlpha = this.Transparency;
		// context.drawImage(
		// 	texture, 0, 0, texture.width, texture.height,
		// 	-(this.width / 2 + this.Origin.x) * this.Scale, -(this.height / 2 + this.Origin.y) * this.Scale,
		// 	(this.width * this.Scale), (this.height * this.Scale)
		// );
		// context.restore();

        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;
        var height = this.height;
        var width = this.width;

        var rotation = this.Rotation + this.TextureRotation;
        var scale = this.Scale;
        var alpha = this.Transparency;

		var frame = this.TextureData.frame ?? 0;
		var frames = this.TextureData.frames ?? 1;
		var direction = this.TextureData.direction ?? 'Y';


		Graphic.DrawRotatedAnimatedImage(context, frame, frames, direction, 
            texture, x, y, width, height, scale, rotation, alpha, this.Origin.x, this.Origin.y);
	}
	
	/**
	 * 
	 * @param {Number} damage Amount of damage to deal.
	 * @param {Entity} source Entity which hurt this.
	 */
	Hurt(damage, source, data)
	{
		if(!this.isHurtAble) return;
		if(this.isInvincible) return;
		if(damage == 0) return;

		var type = data.ELEMENT;


		if(this.Resistance[type]) damage = Math.floor(damage / 2);
		if(this.Weakness[type]) damage *= 2;
		if(this.Immunity[type]) damage = 1;
		if(this.DefBreak) damage = Math.ceil(damage * (100 + this.DefBreak) / 100);

		
		this.lastHurtBy = source;

		if(isFunction(this.onHurt))
		{
			if(this.onHurt()) return;
		}

		if(this.isAggressiveOnHurt) this.aggressive = true;
		
		SoundManager.Play(this.HurtSound, "EFFECT");
		this.HP -= Math.round(damage);

		if(data.isCritical) Camera.Shake(5);
		else Camera.Shake(0.5);

		if(Settings.General.ShowDamageDealt && this.showDamageReceived)
		{
			DamageIndicator.AddObject(this.x, this.y, damage, "DEALT", null, data.isCritical);
		}

		if(this.HP <= 0) this.Kill();
	}

	ApplyMove(motion)
	{
		if(motion)
		{
			this.x += motion.x * Main.DELTA;
			this.y += motion.y * Main.DELTA;
		}
	}

	isMoving()
	{
		if(!this.allowMove) return false;
		if(this.moveX || this.moveY) return true;
		return false;
	}

	onKill(){return;}
	
	Kill()
	{
		if(this.lastHurtBy === World.Player)
		{
			//zostal zabity przez gracza
			if(this.isBoss)
			{
				World.Player.RunStats.defeatedBosses++;
			}
			else
			{
				World.Player.RunStats.defeatedEnemies++;
			}
		}


		this.isAlive = false;
		this.onKill();

		if(this.isBoss)
		{
			if(this.AI.Boss)
			{
				this.AI.Boss.onDeath(this);
			}
		}

		var oxygen = this.getOxygen();
		if(oxygen && this.dropOxygen) 
		{
			World.AddEntity(new Oxygen(this.x, this.y, oxygen, this.level, false, this.isBoss));

			if(MathHelper.GetChance(this.heartDropChance))
			{
				World.AddEntity(new Oxygen(this.x, this.y, this.heartDropValue, 1, true));
			}
		}

		if(this.LootTable && this.dropLoot)
		{
			var item = this.LootTable.GetItem();
			if(item)
			{
				World.AddEntity(new EntityItem(item, this.x, this.y));
			}
		}

		QuestList.CheckEntityDeath(this);

		SoundManager.Play(this.DeathSound, "EFFECT", this);
		
		if(!this.isAlive) World.Kill(this);
	}
}