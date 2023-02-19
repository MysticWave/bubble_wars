class ProgressBar
{
	constructor(posX, posY, className, value, currValue, onUpdate, onHover, onClick)
	{
		this.x = posX || 0;
		this.y = posY || 0;
		this.style = {};
		this.className = className;
		this.text = "";
		
		this.value = value || 0;				//wartosc maksymalna
		this.currentValue = currValue || 0;	//wartosc aktualna
		this.progress = (this.currentValue / this.value) || 0;
		this.onHover = onHover;
		this.onClick = onClick;
		this.onUpdate = onUpdate;
		this.ageInTicks = 0;
		
		this.hover = false;
		this.click = false;
		
		this.style = Style.GetStyleByName(this.className);
		this.width = this.style.width;
		this.height = this.style.height;
		this.visible = true;
		
		this.ShowText = true;
		this.reverseProgressDisplay = false;
		this.focusAble = true;
		this.disabled = false;
	}
	
	Update()
	{
		Mouse.Check(this);
		this.ageInTicks++;
		this.style = Style.GetStyleByName(this.className);

		if(this.style.Animation)
		{
			this.style.Animation.Update();
		}

		if(!this.disabled)
		{
			if(this.hover)
			{
				this.Hover();
			}
		
			if (this.click)
			{
				this.Click();
				Mouse.lockClick = true;
				this.click = false;
			}
			
			if (this.rightClick)
			{
				this.RightClick();
				Mouse.lockRightClick = true;
				Mouse.rightClick = true;
				this.rightClick = false;
			}

			if (this.shade)
			{
				this.Shade();
				this.shade = false;
			}
		}
		
		this.progress = (this.currentValue / this.value) || 0;
		
		if(this.style.progressDisplay == "%")
		{
			this.text = Math.floor(this.progress * 100) + "%";
		}
		else if(this.style.progressDisplay == "none")
		{
			this.text = "";
		}
		else
		{
			this.text = this.currentValue + "/" + this.value;
		}
		
		if(isFunction(this.onUpdate))
		{
			this.onUpdate();
		}
	}
	
	Render()
	{
		if(!this.visible) return;
		
		var height = this.style.height;
		var width = this.style.width;

		if(this.style.backgroundImage == false)
		{
			ctx.save();
			ctx.fillStyle = this.style.backgroundColor;
			ctx.fillRect(this.x + this.style.borderSize, this.y + this.style.borderSize, width - (this.style.borderSize * 2), height - (this.style.borderSize * 2));
			ctx.restore();
		}
		else
		{
			ctx.drawImage(TextureManager.Get(this.style.backgroundImage), this.x + this.style.borderSize, this.y + this.style.borderSize, width - (this.style.borderSize * 2), height - (this.style.borderSize * 2));
		}
		
		
		if(!this.style.progressImage)
		{
			var progress = (this.progress <= 1) ? this.progress : 1;
			var bSize = this.style.borderSize;

			ctx.save();
			ctx.fillStyle = this.style.progressBar;
			
			if(this.reverseProgressDisplay)
			{
				if(this.style.borderRadius)
				{
					ctx.fillRect(this.x + width, this.y, -(width * progress), height);
					// Graphic.roundRect(ctx, this.x + width - (bSize / 2), this.y - (bSize / 2), -(width * progress) + bSize, height + bSize, this.style.borderRadius, true, false);
				}
				else
				{
					ctx.fillRect(this.x + width, this.y, -(width * progress), height);
				}
				
			}
			else
			{
				if(this.style.borderRadius)
				{
					Graphic.roundRect(ctx, this.x - (bSize / 2), this.y - (bSize / 2), (width * progress) + bSize, height + bSize, this.style.borderRadius, true, false);
				}
				else
				{
					ctx.fillRect(this.x, this.y, (width * progress), height);
				}
			}
			ctx.restore();
		}
		else
		{
			var frame = 0;
			var FrameHeight = height;

			if(this.style.Animation)
			{
				frame = this.style.Animation.Frame;
			}

			var texture = TextureManager.Get(this.style.progressImage);
			// ctx.drawImage(texture, 0, frame * height, (texture.width * this.progress), height, this.x + this.style.borderSize, this.y + this.style.borderSize, (width * this.progress) - (this.style.borderSize * 2), height - (this.style.borderSize * 2));
			ctx.drawImage(texture, 0, frame * height, (texture.width * this.progress), height, this.x, this.y, (width * this.progress), height);
		}
		
		if(this.style.borderImage == false)
		{
			var bSize = this.style.borderSize;
			ctx.save();
			ctx.strokeStyle = this.style.borderColor;
			ctx.lineWidth = bSize;
			
			if(this.style.borderRadius)
			{
				Graphic.roundRect(ctx, this.x - (bSize / 2), this.y - (bSize / 2), width + bSize, height + bSize, this.style.borderRadius, false, true);
			}
			else
			{
				ctx.strokeRect(this.x - (bSize / 2), this.y - (bSize / 2), width + bSize, height + bSize);
			}
			
			ctx.restore();
		}
		else
		{
			ctx.drawImage(TextureManager.Get(this.style.borderImage), this.x, this.y, width, height);
		}
		
		if(this.ShowText)
		{
			Style.FillText(ctx, this);
		}
	}
	
	Hover()
	{
		this.style = Style.GetStyleByName(this.className, STATE.HOVER);
		Mouse.cursor = this.style.cursor ?? Mouse.cursor;
		
		if(isFunction(this.onHover))
		{
			this.onHover();
		}
	}
	
	Click()
	{
		this.style = Style.GetStyleByName(this.className, STATE.CLICK);
		
		if(isFunction(this.onClick))
		{
			this.onClick();
		}
	}
	
	RightClick()
	{
		this.style = Style.GetStyleByName(this.className, STATE.RIGHTCLICK);
		
		if(isFunction(this.onRightClick))
		{
			this.onRightClick();
		}
	}
	
	Shade()
	{
		this.style = Style.GetStyleByName(this.className, STATE.SHADE);
		
		if(isFunction(this.onShade))
		{
			this.onShade();
		}
	}
}