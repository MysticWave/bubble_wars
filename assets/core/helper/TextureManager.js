

class TextureManager
{
	static Load()
	{
		this.Textures = {};
		
		this.LoadProgress = 0;
		this.Loaded = 0;
		this.ToLoad = this.src.length;
		
		for (var num = 0; num < this.ToLoad; num++)
		{
			
			var name = this.src[num][0];
			var path = this.src[num][1];

			var texture = new Image();
				texture.src = path;
				texture.name = name;
				texture.onload = function()
				{
					TextureManager.Loaded++;
				};
				texture.onerror = function()
				{
					TextureManager.Loaded++;
					delete TextureManager.Textures[this.name];
				};
			this.Textures[name] = texture;
		}
	}
	
	static Get(name = "none")
	{
		if(this.Textures)
		{
			if(this.Textures[name] != undefined)
			{
				return this.Textures[name];
			}
			else
			{
				return this.Textures.none;
			}
		}
	}
}