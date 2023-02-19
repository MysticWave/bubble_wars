class Projectile extends Entity
{
	constructor(x, y, stats)
	{
		super(x, y);
		this.moveX = 0;
		this.moveY = 0;
		this.Texture = "bullet.bubble.base";
		
		this.width = 0;
		this.height = 0;
		
		this.source = null;
		this.target = null;
		this.dontDespawnTime = 9999999999;
		this.timeToDespawn = this.dontDespawnTime;
		this.from = {x: null, y: null};

		this.isHurtAble = false;
		this.damage = 1;
		this.criticalChance = 0;
		this.criticalDamage = 0;
		this.hurtEntities = false;
		this.Pierce = 0;
		this.pierceTimes = 0;
		this.piercedEntities = [];
		this.knockBack = 1;
		this.knockOnPierce = false;
		this.spd = 0;
		

		this.followRange = 0;
		this.followSPD = 350;
		this.followTimes = 0;
		this.followTime = 5;
		this.missed = true;
		this.element = ELEMENT.PHYSICAL;

		this.killOnBorderHit = true;

		this.canBeLightSource = true;
		this.moveParticle = "bulletParticle";
		
		this.setStats(stats);

		
		var texture = TextureManager.Get(this.Texture);
		if(texture)
		{
			if(!this.width) this.width = texture.width;
			if(!this.height) this.height = texture.height;
		}

		this.timeSinceVectorChange = Main.FPS * 2;
		this.onPlayerCollisionEffects = [];
		this.onEntityCollisionEffects = [];

		this.playerEffectChance = 100;
		this.entityEffectChance = 100;
	}


	onCollision()
	{
		if(this.Bounce) this.isBouncing = true;

		if(!this.Bounce && this.killOnBorderHit) this.Kill();
	}

	getDamageData()
	{
		var data = {damage: 0, isCritical: false, ELEMENT: this.element};
		var damage = this.damage;
		if(isNaN(this.damage))
		{
			damage = MathHelper.randomInRange(this.damage.min, this.damage.max);
		}

		if(this.criticalChance)
		{
			if(MathHelper.GetChance(this.criticalChance))
			{
				damage *= (100 + this.criticalDamage) / 100;
				data.isCritical = true;
			}
		}

		data.damage = damage;

		return data;
	}
	
	onPlayerCollision(player)
	{
		if( (player.canBeHurt()) && !(this.source instanceof Player))
		{
			var data = this.getDamageData();

			if(this.Pierce)
			{
				if(!this.piercedEntities.includes(player))
				{
					this.pierceTimes++;
					this.piercedEntities.push(player);
					player.Hurt(data.damage, this.source, data);
				}
				else
				{
					return;
				}
			}
			else
			{
				player.Hurt(data.damage, this.source, data);
				this.Kill();
			}

			if(this.knockBack && (!this.Pierce || this.knockOnPierce))
			{
				var angle = MathHelper.getAngle2([this.x, this.y], [this.x+this.moveX, this.y+this.moveY]);
				ApplyEffect(player, 'KnockBack', this.knockBack, .2, angle);
			}

			for(var i in this.onPlayerCollisionEffects)
			{
				if(!MathHelper.GetChance(this.playerEffectChance)) continue;

				var e = this.onPlayerCollisionEffects[i];
				ApplyEffect(player, e[0], e[1], e[2], e[3]);
			}
		}
	}
		
	onEntityCollision(entity)
	{
		//projectiles from player cannot collide with player`s entities
		if(entity.isFromPlayer && this.source == World.Player) return;

		this.missed = false;
		if( (entity.isHurtAble) && ((World.Player === this.source) || this.hurtEntities || entity.isFromPlayer))
		{
			var data = this.getDamageData();

			if(this.Pierce)
			{
				if(!this.piercedEntities.includes(entity))
				{
					this.pierceTimes++;
					this.piercedEntities.push(entity);
					entity.Hurt(data.damage, this.source, data);

					if(entity.blockPierce || entity.isObstacle) return this.Kill();

					if(this.Item && this.MP) this.Item.currentMP += this.MP;
				}
				else
				{
					if(entity.blockPierce || entity.isObstacle) return this.Kill();
					return;
				}
			}
			else
			{
				entity.Hurt(data.damage, this.source, data);
				if(this.Item && this.MP) this.Item.currentMP += this.MP;
				
				this.Kill();
			}

			if(this.knockBack && (!this.Pierce || this.knockOnPierce))
			{
				var angle = MathHelper.getAngle2([this.x, this.y], [this.x+this.moveX, this.y+this.moveY]);
				ApplyEffect(entity, 'KnockBack', this.knockBack, .2, angle);
			}

			for(var i in this.onEntityCollisionEffects)
			{
				if(!MathHelper.GetChance(this.entityEffectChance)) continue;

				var e = this.onEntityCollisionEffects[i];
				ApplyEffect(entity, e[0], e[1], e[2], e[3]);
			}
		}	
	}

	setStats(stats)
	{
		if(!stats) return;

		for(var property in stats)
		{
			this[property] = stats[property];
		}


		this.setScale(this.Scale);
	}
	
	static Types(type)
	{
		if(type)
		{
			if(!this.types) this.types = {};
			var p = new type();
			this.types[p.constructor.name] = type;
		}
		else
		{
			return this.types;
		}
	}
	
	Shoot(source, target)
	{
		if(source && target)
		{			
			this.source = source;
			this.target = target;
			
			// var endX = target.x - Camera.xView;
			// var endY = target.y - Camera.yView;
			
			// if(target === Mouse)
			// {
			// 	endX = target.x;
			// 	endY = target.y + 7.5;
			// }
			
			var spd = this.spd || 10;

			var angle = MathHelper.getAngle2([this.x, this.y], [target.x, target.y]);
			var end = MathHelper.lineToAngle([this.x, this.y], spd, angle);

			this.from = {x: this.x, y: this.y};
			
			this.moveX = end.x - this.x;
			this.moveY = end.y - this.y;
			
			this.Rotation = angle + 90;

			this.onShoot();
			super.Update();
		}
	}
	
	Update()
	{
		this.x += this.moveX * Main.DELTA;
		this.y += this.moveY * Main.DELTA;
		this.lockApplyMove = false;

		super.Update();

		if(!this.lockApplyMove && this.followRange)
		{
			//tylko pociski przeciwnikow moga naprowadzac sie na gracza
			if(this.source instanceof Entity)
			{
				if(MathHelper.isInRange(this, player, this.followRange))
				{
					var motion = Motion.Get(this, player, this.followSPD);
					this.followTimes++;
					this.Rotation = motion.angle + 90;
					this.lockApplyMove = true;
					this.moveX = motion.x;
					this.moveY = motion.y;
				}
			}
		}
		
		this.timeSinceVectorChange++;
		
		if((this.isBouncing) && (this.timeSinceVectorChange > 3))
		{
			if(this.Pierce)
			{
				//po odbiciu moze ponownie uderzyc obiekty
				this.piercedEntities = [];
			}
			this.bounceTimes++;
			this.onBounce();

			this.timeSinceVectorChange = 0;

			var distX = (this.x - World.CenterPoint.x);
            var distY = (this.y - World.CenterPoint.y);
            if(distX == 0) this.moveY *= -1;
            if(distY == 0) this.moveX *= -1;

            if(distX == 0 || distY == 0) 
            {
                if(this.allowRotationChange) this.Rotation -= 180;
                return;
            }


			var prev = 
			[
				this.x - (this.moveX / 10),
				this.y - (this.moveY / 10)
			];

			var a1 = (this.y - World.CenterPoint.y) / (this.x - World.CenterPoint.x);
			var b1 = -(a1 * this.x) + this.y;

			var a2 = - (1 / a1);
			var b2 = -(a2 * prev[0]) + prev[1];

			var crossPoint = [];
			crossPoint[0] = (b2 - b1) / (a1 - a2);
			crossPoint[1] = (a1 * crossPoint[0]) + b1;

			var ViewPoint = [];
			ViewPoint[0] = crossPoint[0] - (prev[0] - crossPoint[0]);
			ViewPoint[1] = crossPoint[1] - (prev[1] - crossPoint[1]);

			var motion =  Motion.Get([this.x, this.y], ViewPoint, this.spd);
			this.moveX = motion.x;
			this.moveY = motion.y;
			this.Rotation = motion.angle + 90;

			// Main.postRender[0] = [
			// 	function(params)
			// 	{
			// 		ctx.save()
			// 		ctx.fillStyle = "red";
			// 		ctx.fillRect(params[0] - Camera.xView, params[1] - Camera.yView, 5, 5);
			// 		ctx.restore();
			// 	},
			// 	prev
			// ];
			// Main.postRender[1] = [
			// 	function(params)
			// 	{
			// 		ctx.save()
			// 		ctx.fillStyle = "green";
			// 		ctx.fillRect(params[0] - Camera.xView, params[1] - Camera.yView, 5, 5);
			// 		ctx.restore();
			// 	},
			// 	crossPoint
			// ];

			// Main.postRender[3] = [
			// 	function(params)
			// 	{
			// 		ctx.save()
			// 		ctx.fillStyle = "yellow";
			// 		ctx.fillRect(params[0] - Camera.xView, params[1] - Camera.yView, 5, 5);
			// 		ctx.restore();
			// 	},
			// 	ViewPoint
			// ];

			// Main.postRender[2] = [
			// 	function(params)
			// 	{
			// 		ctx.save();
			// 		ctx.beginPath();
			// 		ctx.moveTo(params[0] - Camera.xView, params[1] - Camera.yView);
			// 		ctx.lineTo(params[2] - Camera.xView, params[3] - Camera.yView);
			// 		ctx.stroke();
			// 		ctx.restore();
			// 	},
			// 	[this.x, this.y, World.CenterPoint.x, World.CenterPoint.y]
			// ];
		}

		if(this[STAT.ATTACK_RANGE] && !this.isLaser)
		{
			var distance = MathHelper.GetDistance([this.x, this.y], this.from);
			if(distance >= this[STAT.ATTACK_RANGE]) this.onRangeOut();
		}

		if(this.timeToDespawn <= this.ageInTicks)
		{
			this.Kill();
		}

		if(this.followTimes >= this.followTime * Main.FPS)
		{
			this.Kill();
		}
		
		if(this.Bounce && (this.bounceTimes > this.Bounce))
		{
			this.Kill();
		}

		if(this.Pierce)
		{
			if(this.pierceTimes > this.Pierce)
			{
				this.Kill();
			}
		}
	}

	onBounce(){}

	onRangeOut()
	{
		this.Kill();
	}

	onShoot(){}

	Render(ctx)
	{
		super.Render(ctx);

		if(World.Player === this.source && this.canBeLightSource)
		{
			var r = this.HitBox.Radius || this.HitBox.Width / 2;
			Graphic.addLightSource(this.x - Camera.xView, this.y - Camera.yView, r * 2);
		} 
	}

	Kill()
	{
		if(this.missed && !World.currentRoom.isCleared && World.Player === this.source) World.Player.RunStats.missedShots++;
		super.Kill();
	}
}