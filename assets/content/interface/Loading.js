class Loading extends Interface
{
	static Initialize()
	{
		super.Initialize();
		this.UI_ID = 'loading_screen';
		this.ready = false;
	}
	
	static Update()
	{		
		if(this.ready) return;

		this.LoadProgress = Math.round( 
			(TextureManager.Loaded + SoundManager.Loaded) / 
			(TextureManager.ToLoad + SoundManager.ToLoad) * 100
		);

		UI_Helper.setBarProgress('loading_progress', this.LoadProgress + '%');

		if( (this.LoadProgress >= 100))
		{
			SoundManager.Ready = true;
			this.ready = true;
			document.getElementById('loading_ready').style.display = 'block';
			UI_Helper.Fade(function(){Menu.Run()}, 2);
		}
		
		super.Update();
	}
	
	static Render()
	{		
		ctx.save();
		ctx.fillStyle = "blue";
		ctx.globalAlpha = 0.5;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.restore();

		super.Render();
	}
}
InterfaceControl.InitializeInterface(Loading);