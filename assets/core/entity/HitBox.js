class HitBox
{
	constructor(type = HITBOX.ROUND, translationX = 0, translationY = 0, Scale)
	{
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.Width = 0;
		this.height = 0;
		this.Height = 0;
		this.Scale = Scale || 1;
		this.Type = type;
		
		this.translationX = translationX;
		this.translationY = translationY;
	}
	
	Update(owner)
	{
		var width = owner.width || owner.Width;
		var height = owner.height || owner.Height;
		
		var x = (width * owner.Scale / 2);
		var y = (height * owner.Scale / 2);

		var scale = owner.Scale * this.Scale;

		this.x = owner.x - (x * this.Scale);
		this.y = owner.y - (y * this.Scale);

		if(this.translationX || this.translationY)
		{
            var endPoints = [
                this.x + (this.translationX * width * scale),
                this.y + (this.translationY * height * scale)
            ];
            var pos = MathHelper.RotatePoint([this.x, this.y], owner.Rotation, endPoints);
			this.x = pos.x;
			this.y = pos.y;
		}
		
		

		if(this.Type == HITBOX.RECTANGLE)
		{
			this.endX = this.x + (width * scale);
			this.endY = this.y + (height * scale);
			
			this.width = this.Width = width * scale;
			this.height = this.Height = height * scale;
		}
		else if(this.Type == HITBOX.ROUND)
		{
			this.Radius = (width * scale) / 2;
			this.x += this.Radius;
			this.y += this.Radius;
		}
	}

	ApplyRotation(owner, rotation)
	{
		rotation = (rotation) ? rotation : owner.Rotation;
		var end = MathHelper.lineToAngle([owner.x, owner.y], owner.Scale, rotation);
		this.x = end.x;
		this.y = end.y;
	}
	
	Render()
	{
		if(Main.ShowHitbox)
		{
			if(this.Type == HITBOX.RECTANGLE)
			{
				ctx.save();
				ctx.globalAlpha = 0.5;
				ctx.fillStyle = "red";
				ctx.fillRect(this.x - Camera.xView, this.y - Camera.yView, this.width, this.height);
				ctx.restore();
			}
			else if(this.Type == HITBOX.ROUND)
			{
				ctx.save();
				ctx.globalAlpha = 0.5;
				ctx.fillStyle = "red";
				ctx.beginPath();
				ctx.arc(this.x - Camera.xView, this.y - Camera.yView, this.Radius, 0, Math.PI * 2);
				ctx.fill();
				ctx.closePath();
				ctx.restore();
			}
		}
		
	}
}