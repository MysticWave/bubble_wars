class Slider
{
	constructor(posX, posY, className, id, min, max, current, disabled, onUpdate, onChange)
	{
		this.className = className;
		this.id = id;

		this.value = current;
		this.lastValue = this.value;
		this.minValue = min;
		this.maxValue = max;

		this.onUpdate = onUpdate;
		this.onChange = onChange;
		
		this.hover = false;
		this.click = false;
		this.rightClick = false;
		this.disabled = disabled || false;
		this.ageInTicks = 0;
		
		this.style = Style.GetStyleByName(this.className);
		this.width = this.style.width;
		this.height = this.style.height;
		
		this.x = posX;
		this.y = posY;
		this.percent = (this.value / this.maxValue * 100);
		this.opacity = 1;
		this.focusAble = true;
	}
	
	Update()
	{
		Mouse.Check(this);
		this.ageInTicks++;
		this.style = Style.GetStyleByName(this.className);
		
		
		if(this.value != this.lastValue)
		{
			this.lastValue = this.value;
			if(isFunction(this.onChange))
			{
				this.onChange();
			}
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
				// Mouse.rightClick = true;
				this.rightClick = false;
			}

			if (this.shade)
			{
				this.Shade();
				this.shade = false;
			}
		
		}
		else
		{
			this.style = Style.GetStyleByName(this.className, STATE.DISABLED);
			this.rightClick = false;
			this.click = false;
		}
		
		if(isFunction(this.onUpdate))
		{
			this.onUpdate();
		}
	}
				
	Render()
	{			
		var width = this.style.width;
		var height = this.style.height;

		if(!this.style.backgroundImage)
		{
			var bSize = this.style.borderSize;
			ctx.save();
			ctx.globalAlpha = this.opacity;
			ctx.fillStyle = this.style.backgroundColor;
			
			if(this.style.borderRadius)
			{
				Graphic.roundRect(ctx, this.x - (bSize / 2), this.y - (bSize / 2), width + bSize, height + bSize, this.style.borderRadius, true, false);
			}
			else
			{
				ctx.fillRect(this.x - (bSize / 2), this.y - (bSize / 2), width + bSize, height + bSize);
			}
			
			ctx.restore();
		}
		else
		{
			ctx.save();
			ctx.globalAlpha = this.opacity;
			ctx.drawImage(TextureManager.Get(this.style.backgroundImage), this.x + this.style.borderSize, this.y + this.style.borderSize, width - (this.style.borderSize * 2), height - (this.style.borderSize * 2));	
			ctx.restore();
		}


		if(!this.style.borderImage)
		{
			var bSize = this.style.borderSize;
			ctx.save();
			ctx.globalAlpha = this.opacity;
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
			ctx.save();
			ctx.globalAlpha = this.opacity;
			ctx.drawImage(TextureManager.Get(this.style.borderImage), this.x, this.y, width, height);
			ctx.restore();
		}



		if(this.style.sliderPointer)
		{
			var width = (this.style.sliderPointer.width != null) ? this.style.sliderPointer.width : this.style.width;
			var height = (this.style.sliderPointer.height != null) ? this.style.sliderPointer.height : this.style.height;

			var backgroundColor = (this.style.sliderPointer.backgroundColor != null) ? this.style.sliderPointer.backgroundColor : this.style.backgroundColor;
			var borderColor = (this.style.sliderPointer.borderColor != null) ? this.style.sliderPointer.borderColor : this.style.borderColor;
			var borderRadius = (this.style.sliderPointer.borderRadius != null) ? this.style.sliderPointer.borderRadius : this.style.borderRadius;

			var bSize = borderRadius;

			var x = this.x + (this.percent * this.style.width / 100) - (width / 2);
			var y = this.y;

			ctx.save();
			ctx.globalAlpha = this.opacity;
			ctx.strokeStyle = borderColor;
			ctx.fillStyle = backgroundColor;
			ctx.lineWidth = bSize;

			if(borderRadius)
			{
				Graphic.roundRect(ctx, x - (bSize / 2), y - (bSize / 2), width + bSize, height + bSize, bSize, true, true);
			}
			else
			{
				ctx.strokeRect(x - (bSize / 2), y - (bSize / 2), width + bSize, height + bSize);
			}

			ctx.restore();
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

		if(Mouse.click)
		{
			var margin = 5;

			var x = (Mouse.x - margin) - this.x;
				x = (x < 0) ? 0 : x;

			var percent = (x / (this.style.width - 2 * margin) * 100);
				percent = (percent > 100) ? 100 : percent;

			this.percent = percent;
			this.value = Math.round(percent * (this.maxValue - this.minValue) / 100);
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