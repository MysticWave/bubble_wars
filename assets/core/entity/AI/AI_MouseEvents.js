class AI_MouseEvents
{
	constructor()
	{
		this.name = "MouseEvents";

		/*
			this.onMouseHover;
			this.onMouseClick;
			this.onMouseRightClick;
		*/
	}
	
	Update(owner)
	{
		owner.hover = false;
		owner.click = false;
		owner.rightClick = false;
		
		if(!Mouse.onCanvas) return;

		var state = Mouse.Check(owner.HitBox, true, true);
		var dist = MathHelper.GetDistance([owner.HitBox.x - Camera.xView, owner.HitBox.y - Camera.yView], Mouse);

		owner.hover = (dist <= owner.HitBox.Radius) ? true : false;
		owner.click = state.click;
		owner.rightClick = state.rightClick;

		if(owner.hover)
		{
			if(isFunction(owner.onMouseHover))
			{
				owner.onMouseHover();
			}
		}
		
		if (owner.click)
		{
			if(isFunction(owner.onMouseClick))
			{
				owner.onMouseClick();
			}
			Mouse.lockClick = true;
		}
		
		if (owner.rightClick)
		{
			if(isFunction(owner.onMouseRightClick))
			{
				owner.onMouseRightClick();
			}
			Mouse.lockRightClick = true;
		}
	}
}