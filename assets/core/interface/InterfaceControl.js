class InterfaceControl
{
	static InitializeInterface(_interface)
	{
		this.Packages = this.Packages || [];
		this.Packages.push(_interface);
	}

	static Initialize()
	{
		for(var i = 0; i < this.Packages.length; i++)
		{
			this.Packages[i].Initialize();
		}
	}
	
	static Update()
	{
		var running = Main.RUNNING;
		
		for(var i = 0; i < this.Packages.length; i++)
		{
			if(running == this.Packages[i].RUNNING)
			{
				this.Packages[i].Update();
				break;
			}
		}
	}
	
	static Render()
	{
		var running = Main.RUNNING;
		
		for(var i = 0; i < this.Packages.length; i++)
		{
			if(running == this.Packages[i].RUNNING)
			{
				this.Packages[i].Render();
				break;
			}
		}
	}

	static getCurrent()
	{
		var running = Main.RUNNING;
		
		for(var i = 0; i < this.Packages.length; i++)
		{
			if(running == this.Packages[i].RUNNING)
			{
				return this.Packages[i];
			}
		}
	}
}