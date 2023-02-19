class Particle
{
	constructor(type, x, y, liveTime, width, height, scale, onRender, onKill, data)
	{
		this.type = type;
		this.Texture = type;
		this.x = x || 0;
		this.y = y || 0;
		this.onUpdate = null;
		
		this.ageInTicks = 0;
		this.Frame = 0;
		this.Scale = scale;
		this.globalAlpha = 1;

		this.Origin = {x: 0, y: 0};
		
		var texture = TextureManager.Get(this.Texture);
		this.Frames = texture.height / texture.width;
		this.FrameDir = 1;
		
		this.liveTime = liveTime;
		this.frameDelay = (this.liveTime / this.Frames);
		
		this.onRender = onRender;
		this.onKill = onKill;
		
		this.width = width;
		this.height = height;

		this.moveX = 0;
		this.moveY = 0;

		this.opacity = 1;
		this.Rotation = 0;
		this.lightLevel = Particle.getLightLevel(type);

		if(data)
		{
			for(var i in data)
			{
				this[i] = data[i];
			}
		}
	}

	static getLightLevel(type)
	{
		switch(type)
		{
			
		}

		return 0;
	}

	static SilkShade()
	{
		var time = this.silkShade;
		if(this.ageInTicks <= time)
		{
			this.opacity = this.ageInTicks / time;
		}
		else if(this.ageInTicks >= this.liveTime - time)
		{
			this.opacity = 1 - ((this.ageInTicks - (this.liveTime - time)) / time);
		}

		if(this.opacity < 0) this.opacity = 0;
		if(this.opacity > 1) this.opacity = 1;
	}

	static Summon(type, x, y, destX, destY, scale = 1, spd = 0, count = 1, silkShade = 10, data = null)
	{
		var onRender = (!silkShade) ? null : Particle.SilkShade;
		
		if(!destX) destX = x;
		if(!destY) destY = y;

		for(var i = 0; i < count; i++)
		{
			var dist = MathHelper.GetDistance([x, y], [destX, destY]);
			var liveTime = ((dist - silkShade) / spd) * Main.FPS;

			var motion = Motion.Get([x, y], [destX, destY], spd);
			var particle = new Particle(type, x, y, liveTime, 32, 32, scale, onRender, null, data);
				particle.moveX = motion.x;
				particle.moveY = motion.y;
				particle.silkShade = silkShade;
				
			World.AddParticle(particle);
		}
	}

	/**
	 * 
	 * @param {String} type Texture to render
	 * @param {Number} x 
	 * @param {Number} y 
	 * @param {Number} spd 
	 * @param {Number} count 
	 * @param {Number} range 
	 * @param {Number} angle 
	 * @param {Number} angleStep 
	 * @param {Bool} moveOut 
	 * @param {Bool} silkShade 
	 */
	static SummonCirclePattern(type, x, y, scale = 1, spd = 0, count = 1, range = 1, angle = null, angleStep = null, moveOut = true, silkShade = 10, data = null)
	{
		if(angle == null)
		{
			angle = MathHelper.randomInRange(0, 360);
		}
		if(angleStep == null)
		{
			angleStep = (360 / count);
		}

		var onRender = (!silkShade) ? null : Particle.SilkShade;

		for(var i = 0; i < count; i++)
		{
			var pos = MathHelper.lineToAngle([x, y], range, angle + (i * angleStep) );
			var liveTime = ((range - silkShade) / spd) * Main.FPS;

			var motion = Motion.Get(pos, [x, y], spd);
			var particle = new Particle(type, pos.x, pos.y, liveTime, 32, 32, scale, onRender, null, data);
				particle.moveX = motion.x;
				particle.moveY = motion.y;
				particle.silkShade = silkShade;
				if(moveOut)
				{
					particle.moveX *= -1;
					particle.moveY *= -1;
					particle.x = x;
					particle.y = y;
				}
				
			World.AddParticle(particle);
		}
	}
	
	Render(context)
	{
		this.ageInTicks++;
		this.onUpdate?.();

		this.x += this.moveX * Main.DELTA;
		this.y += this.moveY * Main.DELTA;

		if(isFunction(this.onRender))
		{
			this.onRender();
		}
		

		if(this.liveTime)
		{
			if(this.ageInTicks % this.frameDelay == 0)
			{
				this.Frame+=this.FrameDir;
			}
			
			if(this.ageInTicks > this.liveTime)
			{
				this.Kill();
			}
		}

		if(!this.isOnScreen) return;
		
		var texture = TextureManager.Get(this.Texture);
		var x = this.x - Camera.xView;
		var y = this.y - Camera.yView;

		if(this.RENDER_LAYER!=null) 
		{
			ChangeLayer(this.RENDER_LAYER);
			context = ctx;
		}

			Graphic.DrawRotatedAnimatedImage(context, this.Frame, this.Frames, 'Y', 
				texture, x, y, this.width, this.width, this.Scale, this.Rotation, this.opacity * this.globalAlpha, this.Origin.x, this.Origin.y);


		if(this.RENDER_LAYER!=null) RestoreLayer();

		if(this.lightLevel)
		{
			var r = this.width * this.Scale / 2;
			Graphic.addLightSource(x, y, r * 2 * this.lightLevel);
		} 
	}
	
	Kill()
	{
		if(isFunction(this.onKill))
		{
			this.onKill();
		}
		World.RemoveParticle(this);
	}
}