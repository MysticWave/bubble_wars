class Camera
{
	static Initialize()
	{
		this.xView = 0;
		this.yView = 0;
		
		this.Locked = false;
		
		this.shake = false;
		this.shakeStrength = 0;
		this.ShakeTime = 0;
		this.ShakeDirection = 1;
		this.ShakeDuration = 10;
		this.Scale = 1.0;

		this.smoothTime = 0;
		this.smoothTick = 0;
		this.smoothPos = {};

		this.lastX = 0;
		this.lastY = 0;
		this.lastPosX = 0;
		this.lastPosY = 0;
	}

	static Smooth(x, y, time)
	{
		if(this.smoothTime) return;
		
		this.smoothLock = this.Locked;
		this.Locked = true;

		this.smoothTime = time * Main.FPS;
		this.smoothTick = Main.ageInTicks;
		this.smoothPos = {from: {x: this.lastX, y: this.lastY}, to: {x, y}};
	}
	
	static Update(x, y, posX, posY, rePosition)
	{
		if (!this.Locked)
		{
			this.UpdateView(x, y, posX, posY, rePosition);
		}
		else if(this.smoothTime)
		{
			var p = (Main.ageInTicks - this.smoothTick) / this.smoothTime;

			if(p >= 1)
			{
				this.smoothTime = 0;
				this.Locked = this.smoothLock;
				this.UpdateView(x, y, posX, posY, rePosition);
				return;
			}
			else
			{
				var playerDiffX = this.smoothPos.to.x - x;
				var playerDiffY = this.smoothPos.to.y - y;

				var diffX = this.smoothPos.from.x - this.smoothPos.to.x;
				var diffY = this.smoothPos.from.y - this.smoothPos.to.y;

				x = this.smoothPos.from.x - (diffX * p) - playerDiffX;
				y = this.smoothPos.from.y - (diffY * p) - playerDiffY;
				this.UpdateView(x, y, posX, posY, rePosition);
			}
		}
	}

	static UpdateView(x, y, posX, posY, rePosition)
	{
		this.lastX = x;
		this.lastY = y;

		this.lastPosX = posX;
		this.lastPosY = posY;

		this.xView = x - posX;
		this.yView = y - posY;

		var width = World.Width;
		var height = World.Height;

		if(!rePosition)
		{
			if (this.xView >= width - canvas.width)
			{
				this.xView = width - canvas.width;
			}

			if (this.xView < 0)
			{
				this.xView = 0;
			}


			if (this.yView > height - canvas.height)
			{
				this.yView = height - canvas.height;
			}

			if (this.yView < 0)
			{
				this.yView = 0;
			}
		}

		if (this.shake)
		{
			if (this.ShakeTime <= this.ShakeDuration)
			{
				this.ShakeTime++;

				if (this.ShakeTime % 4 == 0)
				{
					//zmiana kierunku drzen
					var chance = Math.random() * 100;

					if (chance > 50)
					{
						this.ShakeDirection *= -1;
					}
				}

				var power = Math.random() * 3;

				this.xView += power * this.ShakeStrength * this.ShakeDirection;
				this.yView += power * this.ShakeStrength * this.ShakeDirection;
			}
			else
			{
				this.shake = false;
			}
		}
	}
	
	static Shake(strength, priority = false, time = 10)
	{
		if (!this.shake || priority)
		{
			this.ShakeTime = 0;
			this.ShakeDuration = time;
			this.ShakeStrength = strength;
			this.shake = true;
		}
	}
}