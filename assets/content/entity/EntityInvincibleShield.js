class EntityInvincibleShield extends Entity
{
	constructor(x, y, owner)
	{
		super(x, y);
		this.Owner = owner;
		
		this.name = "ENTITY.INVINCIBLE.SHIELD";
		this.Textures = 
		{
			base: 'effect.invincible.base',
			sprite: 'effect.invincible.sprite',
			particle: 'effect.invincible.0',
			idle: 'effect.invincible.idle',
		};

		this.MAXHP = 1;
		this.HP = this.MAXHP;
		
		this.HitBox.Scale = .9;

		this.knockBackResistance = 1;

		this.spriteAnimationDuration = 24;
		this.spriteAnimationFrames = [4, 3];

		this.idleAnimationDuration = 15;
		this.idleAnimationFrames = 15;
		this.idleAnimationDelayMin = 1;
		this.idleAnimationDelayMax = 3;
		this.idleAnimationTime = this.idleAnimationDelayMin * Main.FPS;

		this.animationTicks = 0;
		this.invincibleScale = 1.25;

		this.OpacityTransition = new Transition(.8, 0.5, .5, true, 0.02, 0.02);
		this.OpacityTransitionEnd = new Transition(.8, 0.3, .25, true, 0.02, 0.02);

		this.Immunity.ALL = true;
		this.hideOnRadar = true;
	}


	Update()
	{
		this.x = this.Owner.x;
		this.y = this.Owner.y;
		super.Update();

		if(this.ageInTicks >= this.spriteAnimationDuration && this.isKilled) this.Kill();
		if(!this.Owner.isAlive) this.Kill();
	}


	Hurt()
	{
		if(Settings.General.ShowDamageDealt)
		{
			DamageIndicator.AddObject(this.x, this.y, Lang.Get('TEXT.INVINCIBLE'), "DEALT", null);
		}

	}

	Kill()
	{
		if(this.isKilled) return super.Kill();

		this.ageInTicks = 0;
		this.isKilled = true;
		this.isHurtAble = false;
	}

    RenderTexture(context)
	{
		this.Scale = this.Owner.Scale * this.Owner.invincibleScale * this.invincibleScale;

		var base_texture = TextureManager.Get(this.Textures.base);
		var sprite_texture = TextureManager.Get(this.Textures.sprite);
		var particle_texture = TextureManager.Get(this.Textures.particle);
        var idle_texture = TextureManager.Get(this.Textures.idle);
		var x = this.x - Camera.xView;
		var y = this.y - Camera.yView;
		var opacity = (this.isEnding) ? this.OpacityTransitionEnd.Update()  : this.OpacityTransition.Update();


		if(this.ageInTicks < this.spriteAnimationDuration)
		{
			var p = this.ageInTicks / this.spriteAnimationDuration;
			if(this.isKilled) p = 1 - p;
			var frames = this.spriteAnimationFrames[0] * this.spriteAnimationFrames[1];
			var frame = Math.floor(p*frames);

			Graphic.DrawRotatedAnimatedImage(context, frame, this.spriteAnimationFrames, 'XY', 
				sprite_texture, x, y, this.width, this.width, this.Scale, this.Rotation, opacity);

			return;
		}

		
		Graphic.DrawRotatedImage(context, base_texture, x, y, this.width, this.height, this.Scale, this.Rotation, opacity);
		
		this.animationTicks++;
		if(this.idleAnimationTime <= this.animationTicks)
		{
			var p = (this.animationTicks - this.idleAnimationTime) / this.idleAnimationDuration;
			var frame = Math.floor(p*this.idleAnimationFrames);

			Graphic.DrawRotatedAnimatedImage(context, frame, this.idleAnimationFrames, 'Y', 
				idle_texture, x, y, this.width, this.width, this.Scale, this.Rotation, opacity);

			if(p>=1) this.idleAnimationTime = this.ageInTicks + (MathHelper.randomInRange(this.idleAnimationDelayMin, this.idleAnimationDelayMax) * Main.FPS);
		}


		// Graphic.addPostRenderFunction(Graphic.Layer.LightLevel, () => {
		// 	ChangeLayer(Graphic.Layer.LightLevel);

		// 		ctx.save();
		// 		ctx.globalCompositeOperation = 'source-atop';
		// 		ctx.translate(x, y);
		// 		ctx.globalAlpha = this.opacity;
		// 		ctx.drawImage(eyes_texture, 0,  0, size, size, tX, tY, this.width * this.Scale, this.height * this.Scale);
		// 		ctx.restore();

		// 	RestoreLayer();
		// });
	}
}
World.RegisterEntity(EntityInvincibleShield);



