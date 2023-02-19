class ProjectileLaserBeam extends Projectile
{
	constructor(x, y, stats)
	{
		super(x, y);

		this.Textures = 
		{
			start: 'projectile.laser.base.start',
			mid: 'projectile.laser.base.mid',
			end: 'projectile.laser.base.end'
		};
		this.BeamImage = null;
		this.BeamTexture = null;
		// this.Texture = "laser_part";
		
		this.width = 0;
		
		this.alwaysRender = true;
		this.isLaser = true;
		this.element = ELEMENT.PHYSICAL;

		this.moveParticle = "bulletParticle";
		this.hurtDelay = 5;
		this.end = {x: 0, y: 0};
		this.hurted = [];
		this.maxAllowedTargets = 9999;
		this.entitiesToCollide = [];
		this.killOnTargetReach = false;
		
		this.size = 50;
		this.visibleSize = this.size;
		this.visibleSizeTransition = true;
		this.resizeTick = 0;
		this.resizeTime = Main.FPS / 3;
		this.startPosDistance = 20;
		this.timeToDespawn = Main.FPS;
		this.laserDuration = this.dontDespawnTime;

		this.allowedAngleDifference = 90;
		this.allowSelfRotationChange = true;

		

		this.rotationSpeed = 180;
		this.dir = 1;

		this.laserSizeTransition = new Transition(0.95, 1.05, 0.05, true, 0.05, 0.05);
		this.laserAlphaTransition = new Transition(0.8, 1, 0.1, true, 0.05, 0.05);

		this.setStats(stats);
		this.Radius = (this[STAT.ATTACK_RANGE]) ? this[STAT.ATTACK_RANGE] : World.Radius * 2;

		this.isControlAble = true;
		this.DeathSound = null;

		this.knockBack = 0;
		this.selfRotation = 0;
	}

	onCollision()
	{
		return;
	}
		
	onPlayerCollision(player)
	{
		super.onPlayerCollision(player);
	}
		
	onEntityCollision(entity)
	{
		if( (entity.isHurtAble) && ((World.Player === this.source) || this.hurtEntities))
		{
			var available = this.getAvailableTargets();
			if(available == 0) return;
			if(this.killOnTargetReach && available == 1) this.Kill();

			this.missed = false;
			var data = this.getDamageData();

			//laser needs to warm up to deal damage
			if(this.ageInTicks < this.hurtDelay) return;

			//there is cooldown only at already damaged entities
			if(this.hurted.indexOf(entity) != -1)
			{
				if(this.ageInTicks % this.hurtDelay == 0)
				{
					entity.Hurt(data.damage, this.source, data);
				}
			}
			else
			{
				entity.Hurt(data.damage, this.source, data);
				this.hurted.push(entity);
			}
		}	
	}

	getAvailableTargets()
	{
		return (this.maxAllowedTargets + this.Pierce) - this.hurted.length;
	}

	setStats(stats)
	{
		super.setStats(stats);

		this.timeToDespawn = this.laserDuration;

		if(this.timeToDespawn < Main.FPS)
		{
			this.resizeTime = this.timeToDespawn / 3;
		}
	}

	onShoot()
	{
		this.Rotate();
		// console.log(this.Pierce)
	}

	Rotate()
	{
		var rot_step = this.rotationSpeed / Main.FPS;

		var sR = MathHelper.ToAllowedAngle(this.source.Rotation + 270);

		var diff = (sR - (this.Rotation-this.selfRotation));

		if(this.ageInTicks <= 1)
		{
			this.Rotation = sR + this.selfRotation;
			this.source.laserRotation = sR + 90;
			return;
		}

		if(!this.isControlAble) return;

		if(Math.abs(diff) > rot_step)
		{
			var dir = 1;

			
			if(diff > 0)
			{
				dir = 1;
				if(diff > 180)
				{
					dir = -1;
				}
			}
			else
			{
				dir = -1;
				if(diff < -180)
				{
					dir = 1;
				}
			}

			this.Rotation += rot_step * dir;

			this.Rotation = MathHelper.ToAllowedAngle(this.Rotation);
		}
		else
		{
			this.Rotation = sR + this.selfRotation;
		}

		this.source.laserRotation = this.Rotation + 90;
	}

	checkForCollision(entity)
	{
		if(this.ageInTicks <= 1) return;
		if(entity instanceof EntityItem) return;
		if(entity instanceof Oxygen) return;
		// console.log(this.Rotation);

		// var xDiff = this.end.x - this.x;
		// var xDiffe = entity.HitBox.x - this.x;

		// var yDiff = this.end.y - this.y;
		// var yDiffe = entity.HitBox.y - this.y;

		// if(
		// 	!(((xDiff > 0 && xDiffe > 0) || (xDiff < 0 && xDiffe < 0)) &&
		// 	((yDiff > 0 && yDiffe > 0) || (yDiff < 0 && yDiffe < 0)))
		// )
		// {
		// 	return;
		// }



		var isInRange = (MathHelper.GetDistance([entity.HitBox.x, entity.HitBox.y], [this.x, this.y]) <= this.Radius) ? true : false;
		if(!isInRange) return;


		var distance, size, hitBox, angleToEnemy, angleDiff;
		var hitBoxes = ([entity.HitBox]).concat(entity.advancedHitBox ?? []);
		for(var i in hitBoxes)
		{
			hitBox = hitBoxes[i];
			angleToEnemy = (MathHelper.getAngle2([this.x, this.y], [hitBox.x, hitBox.y])+360)%360;
			angleDiff = Math.abs(angleToEnemy - this.Rotation)%360;

			if(angleDiff >= this.allowedAngleDifference) break;

			distance = MathHelper.GetPointDistanceFromLine([hitBox.x, hitBox.y], [this.x, this.y], [this.end.x, this.end.y]);

			if(hitBox.Type == HITBOX.ROUND) size = hitBox.Radius;
			else size = hitBox.Width;

			if(distance <= size + (this.size / 2))
			{
				this.entitiesToCollide.push(entity);
				break;
			}
		}
	}

	applyEntitiesCollisions()
	{
		//can hurt every enemy, no need to sort them
		var availableTargets = this.getAvailableTargets();
		if(availableTargets >= this.entitiesToCollide.length)
		{
			for(var i in this.entitiesToCollide)
			{
				var e = this.entitiesToCollide[i];
				if(e instanceof Entity) this.onEntityCollision(e);
				if(e instanceof Player) this.onPlayerCollision(e);
			}
		}
		else if(availableTargets > 0)
		{
			var sorted = {};
			for(var i in this.entitiesToCollide)
			{
				var target = this.entitiesToCollide[i];
				var distance = Math.round(MathHelper.GetDistance([this.x, this.y], [target.x, target.y]));
				sorted[distance] = target;
			}

			// console.log(availableTargets);	
			for(var j in sorted)
			{
				var e = this.sorted[j];
				if(e instanceof Entity) this.onEntityCollision(e);
				if(e instanceof Player) this.onPlayerCollision(e);

				availableTargets--;
				if(availableTargets <= 0) break;
			}
		}

		this.entitiesToCollide = [];
	}
	
	Shoot(source, target)
	{
		if(source && target)
		{			
			this.source = source;
			this.target = target;

			if(this.shootAngle && this.allowSelfRotationChange) this.selfRotation = this.shootAngle;
		}
	}
	
	Update()
	{
		super.Update();
		
		if(this.timeToDespawn < this.dontDespawnTime)
		{
			if(this.ageInTicks + this.resizeTime < this.timeToDespawn)
			{
				this.resizeTick++;
			}
			else
			{
				this.resizeTick--;
			}	
		}
		else
		{
			if(this.source.isAttacking || this.source instanceof Entity)
			{
				this.resizeTick++;
			}
			else
			{
				this.resizeTick--;
			}
		}


		if(this.ageInTicks % this.hurtDelay == 0) this.piercedEntities = [];


		this.resizeTick = (this.resizeTick < 0) ? 0 : this.resizeTick;
		this.resizeTick = (this.resizeTick > this.resizeTime) ? this.resizeTime : this.resizeTick;

		if(this.visibleSizeTransition)
		{
			this.visibleSize = this.size * (this.resizeTick / this.resizeTime);
		}
		else
		{
			this.visibleSize = this.size;
		}
		

		this.Rotate();
		this.end = MathHelper.lineToAngle([this.x, this.y], this.Radius, this.Rotation);

		this.applyEntitiesCollisions();

		// if(this.resizeTick == 0)
		if(this.ageInTicks >= this.timeToDespawn)
		{
			this.Kill();
		}
	}

	Render(context)
	{
		if(this.startPosDistance)
		{
			var startPos = MathHelper.lineToAngle([this.source.x, this.source.y], this.startPosDistance, this.Rotation);
			this.x = startPos.x;
			this.y = startPos.y;
		}
		else
		{
			this.x = this.source.x;
			this.y = this.source.y;
		}

		if(this.visibleSize < 2) return;


		var size = this.visibleSize;
		var alpha = 0.9;

		if(this.visibleSize == this.size)
		{
			if(this.visibleSizeTransition) size *= this.laserSizeTransition.Update();
			alpha = this.laserAlphaTransition.Update();
		}
	

		var img_start = TextureManager.Get(this.Textures.start);
		var img_mid = TextureManager.Get(this.Textures.mid);
		var img_end = TextureManager.Get(this.Textures.end);
		var rotation = this.Rotation - 90;

		var x = this.x - Camera.xView;
		var y = this.y - Camera.yView;
		var scale = this.Scale;
		var mid_length = this.Radius - 2 * this.size;

		var startTranslationY = -this.size;
		var midTranslationY = startTranslationY - this.size/2 + .5;
		var endTranslationY = midTranslationY - mid_length - this.size/2 + .5;

		var cropFunc = function(ctx)
		{
			ctx.beginPath();
			ctx.arc(World.CenterPoint.x - Camera.xView, World.CenterPoint.y - Camera.yView, World.Radius, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();
		};



		if(this.RENDER_LAYER!=null) 
		{
			ChangeLayer(this.RENDER_LAYER);
			context = ctx;
		}

			Graphic.DrawRotatedImage(context, img_start, x, y, size, this.size, scale, rotation, alpha, 0, startTranslationY);
			Graphic.DrawRotatedImage(context, img_mid, x, y, size, mid_length, scale, rotation, alpha, 0, midTranslationY - mid_length/2, cropFunc);
			Graphic.DrawRotatedImage(context, img_end, x, y, size, this.size, scale, rotation, alpha, 0, endTranslationY, cropFunc);

		if(this.RENDER_LAYER!=null) RestoreLayer();



		if(World.Player === this.source)
		{
			Graphic.addLightSource(this.x - Camera.xView, this.y - Camera.yView, this.Radius, 'LINE', size * 2, this.end.x - Camera.xView, this.end.y - Camera.yView);
		}

		return;

		var texture = TextureManager.Get(this.Texture);

		//poczatek lasera (polokrag)
		var tCanvas = document.createElement('canvas');
			tCanvas.width = size;
			tCanvas.height = size / 2;
		var tCtx = tCanvas.getContext('2d');

		tCtx.save();
		tCtx.beginPath();
		tCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
		tCtx.closePath();
		
		tCtx.clip();

		tCtx.drawImage(texture, 0, 0, size, size / 2);
		tCtx.restore();

		//clip laser inside world bubble
		ctx.save();
		ctx.beginPath();
		ctx.arc(World.CenterPoint.x - Camera.xView, World.CenterPoint.y - Camera.yView, World.Radius, 0, Math.PI * 2);
		ctx.closePath();	
		ctx.clip();
		
		ctx.translate(this.x - Camera.xView, this.y - Camera.yView);
		ctx.rotate((this.Rotation - 90) * Math.PI/180);
		ctx.globalAlpha = alpha;

		ctx.drawImage(
			tCanvas, 0, 0, tCanvas.width, tCanvas.height,
			-(size / 2), 0,
			size, size / 2
		);

		ctx.drawImage(
			texture, 0, 0, texture.width, texture.height,
			-(size / 2), size / 2 - 1,
			size, this.Radius - size / 2
		);


		ctx.restore()
		
	}

	Kill()
	{
		this.source.laserRotation = null;

		super.Kill();
	}
}