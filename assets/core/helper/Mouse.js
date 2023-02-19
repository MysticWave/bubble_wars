class Mouse
{
	static Initialize()
	{
		this.x = 0;
		this.y = 0;
		this.click = false;
		this.rightClick = false;
		this.lockClick = false;
		this.lockRightClick = false;
		this.lockHover = false;
		this.focus = false;
		this.id = null;
		this.Disabled = false;

		this.cursor = "default";
		// this.cursorAlpha = 1;
		// this.cursorScale = 1;
	}

	static CheckHoverState(x, y, width, height)
	{
		var endX = x + width;
		var endY = y + height;
		if( (this.x >= x) && (this.x <= endX) && (this.y >= y) && (this.y < endY) ) return true;
		return false;
	}
	
	static Check(object, applyCamera = false, returnState = false)
	{
		if(this.Disabled) return;
		var width, height;

		// var x = this.x + 7.5;
		var x = this.x;
		var y = this.y;
		var startX = object.x;
		var startY = object.y;

		var state = {hover: false, click: false, rightClick: false};

		if(applyCamera)
		{
			startX -= Camera.xView;
			startY -= Camera.yView;
		}
		
		if(object.style)
		{
			width = object.style.width;
			height = object.style.height;
		}
		else
		{
			width = object.width;
			height = object.height;
		}
		
		if(object.Scale)
		{
			width *= object.Scale;
			height *= object.Scale;
		}
		
		if(this.CheckHoverState(startX, startY, width, height))
		{
			if(!this.lockHover) 
			{
				if(returnState)
				{
					state.hover = true;
				}
				else
				{
					object.hover = true;
				}
			}
			
			if( (this.click) && (!this.lockClick) )
			{
				if(returnState)
				{
					state.click = true;
				}
				else
				{
					object.click = true;
					if(object.focusAble)
					{
						this.focus = object;
					}
				}
			}
			
			if( (this.rightClick) && (!this.lockRightClick) )
			{
				if(returnState)
				{
					state.rightClick = true;
				}
				else
				{
					object.rightClick = true;
				}
			}
		}
		else
		{
			if(!returnState)
			{
				object.hover = false;
				object.click = false;
				object.rightClick = false;
			}
		}


		return state;
	}
}