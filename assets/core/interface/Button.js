class Button
{
	constructor(posX = 0, posY = 0, className = '', text = '', disabled = false, id = 'id', onUpdate = null, onHover = null, onClick = null, onRightClick = null, onShade = null)
	{
		this.style = {};
		this.className = className;
		this.id = id;
		this.text = text;
		this.onHover = onHover;
		this.onClick = onClick;
		this.onRightClick = onRightClick;
		this.onUpdate = onUpdate;
		this.onShade = onShade;
		
		this.hover = false;
		this.gotHover = false;
		this.click = false;
		this.rightClick = false;
		this.disabled = disabled;
		this.ageInTicks = 0;
		
		this.style = Style.GetStyleByName(this.className);
		this.width = this.style.width;
		this.height = this.style.height;
		
		this.x = posX;
		this.y = posY;
		this.opacity = 1;

		this.clickSound = 'effect.ButtonClick';
		this.clickTime = 0;
		this.focusAble = true;
		this.lockPlayerAttack = true;
	}
	
	Update()
	{
		Mouse.Check(this);
		this.ageInTicks++;
		this.style = Style.GetStyleByName(this.className);
		
		
		if(!this.disabled)
		{
			if(this.hover)
			{
				if(Mouse.click) this.clickTime++;
				else this.clickTime = 0;

				this.Hover();
			}
			else if(this.gotHover) this.MouseOut();
		
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
		
		Style.FillText(ctx, this, null, null, null, null, null, this.opacity);
	}
	
	Hover()
	{
		this.gotHover = true;
		this.style = Style.GetStyleByName(this.className, STATE.HOVER);
		Mouse.cursor = this.style.cursor ?? Mouse.cursor;
		
		if(isFunction(this.onHover))
		{
			this.onHover();
		}

		if(this.lockPlayerAttack) World.Player.allowAttack = false;
	}

	MouseOut()
	{
		this.gotHover = false;

		if(isFunction(this.onMouseOut))
		{
			this.onMouseOut();
		}
	}
	
	Click()
	{
		this.style = Style.GetStyleByName(this.className, STATE.CLICK);
		
		if(isFunction(this.onClick))
		{
			this.onClick();
		}

		if(this.clickSound)
		{
			SoundManager.Play(this.clickSound, "EFFECT");
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