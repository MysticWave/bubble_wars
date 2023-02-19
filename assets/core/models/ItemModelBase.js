class ItemModel
{
	constructor(texture, width = null, height = null, scale = null, tX = null, tY = null, onUpdate)
	{
		this.Texture = texture;
		this.Scale = scale;
		this.Width = width;
		this.Height = height;
		this.Translation =
		{
			x: tX,
			y: tY
		};
		this.onUpdate = onUpdate;
		this.frame = 0;
		this.frames = 1;
	}
}


function itemCannonUpdate(owner)
{
	var _texture = (typeof this.Texture === "string") ? TextureManager.Get(this.Texture) : this.Texture;
	this.frames = _texture.height / this.Height;
	this.frame = Math.round((this.frames - 1) * owner.attackGauge);
}