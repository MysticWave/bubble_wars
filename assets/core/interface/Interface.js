class Interface
{
	constructor(){}
	
	static Initialize()
	{
		this.Buttons = [];
		this.Bars = [];
		this.UI_ID = null;
	}
	
	static Update()
	{
		for(var i = 0; i < this.Buttons.length; i++)
		{
			this.Buttons[i].Update();
		}
		
		for(var i = 0; i < this.Bars.length; i++)
		{
			this.Bars[i].Update();
		}
	}
	
	static Render()
	{
		this.transitionAlpha = 0;

		if(this.transition)
		{
			this.transitionDuration++;
			this.transitionAlpha = this.transitionDuration / this.transitionTime;
			
			if(this.transitionDuration >= this.transitionTime)
			{
				if(isFunction(this.onTransitionEnd))
				{
					this.onTransitionEnd();
				}
			}
		}

		if(!this.transition || (this.transition && this.showTransitionUI) )
		{
			for(var i = 0; i < this.Buttons.length; i++)
			{
				this.Buttons[i].Render();
			}
			
			for(var i = 0; i < this.Bars.length; i++)
			{
				this.Bars[i].Render();
			}
		}
		ctx.save();
		ctx.globalAlpha = this.transitionAlpha;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.restore();
	}
	
	static Run(preventInit)
	{
		if(!preventInit)
		{
			this.Initialize();
		}
		this.transition = false;
		Main.RUNNING = this.RUNNING;

		Graphic.hideShaders();
		
		if(this.UI_ID) 
		{
			UI_Helper.addHistory = false;
			UI_Helper.Open(this.UI_ID);
		}
	}

	static Transition(onEnd, time = 2, showTransitionUI = false)
	{
		SoundManager.StopMusic();
		this.showTransitionUI = showTransitionUI;
		this.transitionDuration = 0;
		this.transitionTime = time * Main.FPS;
		this.transition = true;
		this.onTransitionEnd = onEnd;
	}
}