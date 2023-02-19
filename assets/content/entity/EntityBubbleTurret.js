class EntityTurret extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.BULLET_SPEED = 300;
		this.AD = 10;
		this.BULLET_SERIES = 3;
		this.ATTACK_SPEED = 3;
		this.ATTACK_RANGE = 600;
		this.MAXHP = 150;
		this.HP = this.MAXHP;
		this.Texture = "bubble_turret_head";
		this.isAggressive = true;
		
		this.rangeFromCenter = 30;
		this.scaleRangeFromCenter = true;
		
		this.bulletStats = 
		{
			Texture: "bullet_enemy",
			Scale: 0.6
		};

		this.AI.Apply(new AI_AttackRange(World.Player, this.bulletStats));
		this.AI.Apply(new AI_Observe(World.Player));
		
		this.isAggressiveOnHurt = true;
		
		this.HitBox.Scale = 0.5;
		this.setScale(2);
	}
	
	Update()
	{
		super.Update();
	}
	
	Render()
	{
		var texture = TextureManager.Get("bubble_turret_base");
			
		ctx.save();
		ctx.translate(this.x - Camera.xView, this.y - Camera.yView);
		ctx.rotate(0);
		ctx.globalAlpha = this.Transparency;
		if(this.Color)
		{
			texture = Graphic.ApplyMask(texture, this.Color);
		}
		ctx.drawImage(
			texture, 0, 0, texture.width, texture.height,
			-(this.width / 2) * this.Scale, -(this.height / 2) * this.Scale,
			(this.width * this.Scale), (this.height * this.Scale)
		);
		ctx.restore();
			
			
			
		texture = TextureManager.Get(this.Texture);
		ctx.save();
		ctx.translate(this.x - Camera.xView, this.y - Camera.yView);
		ctx.rotate(this.Rotation * Math.PI/180);
		ctx.globalAlpha = this.Transparency;
		if(this.Color)
		{
			texture = Graphic.ApplyMask(texture, this.Color);
		}
		ctx.drawImage(
			texture, 0, 0, texture.width, texture.height,
			-(this.width / 2) * this.Scale, -(this.height / 2) * this.Scale,
			(this.width * this.Scale), (this.height * this.Scale)
		);
		ctx.restore();
		
		if(this.isHurtAble)
		{
			var text = "[" + this.HP + "/" + this.MAXHP + "]";
			
			Style.FillText(ctx, this, text, this.x - Camera.xView, this.y - Camera.yView);
		}
		
		this.HitBox.Render();
	}
}
World.RegisterEntity(EntityTurret);