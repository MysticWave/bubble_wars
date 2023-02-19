class Tile
{
	constructor(texture, width = TileSize, height = TileSize)
	{
		this.Texture = texture;
		this.Width = width;
		this.Height = height;
		this.x = 0;
		this.y = 0;
	}
	
	Render()
	{		
		ctx.drawImage(TextureManager.Get(this.Texture), this.x - Camera.xView, this.y - Camera.yView, this.Width, this.Height);
	}
}