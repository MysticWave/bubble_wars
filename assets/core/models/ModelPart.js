class Part
{
	constructor(width, height, length, offsetX, offsetY)
	{
		this.x = 0;
		this.y = 0;
		this.endX = 0;
		this.endY = 0;

		this.Offset = {x: offsetX, y: offsetY};

		this.RotationOffset = {x: 0, y: 0};
		this.Rotation = 0;
		this.selfRotation = 0;
		this.lockRotation = false;

		this.Width = width;
		this.Height = height;
		this.Scale = 1.0;
		this.length = length;
		this.Axis = "y";
		this.visible = true;

		this.Mirrored = false;

		this.Texture = "";
		this.TextureWidth = 0;
		this.TextureHeight = 0;
		this.TextureOffset = {x: 0, y: 0};
		this.TextureTranslation = {x: 0, y: 0};
		this.TextureFlip = {x: 0, y: 0};
		this.FlipTextureOnMirror = true;
		this.useTexturesFamily = true;
	
		this.Parent = null;
		this.Childs = [];
		this.ArmorChilds = [];

		this.Transform = {x: 100, y: 100};
		this.Transparency = 1.0;
		this.Model;

		this.SaveDefaultProperties();
	}

	Update(model)
	{
		this.Model = model;
		this.Scale = model.scale;
		this.Mirrored = model.Mirrored;

		var _parent = (this.Parent) ? this.Parent : model;
		var lengthAcrossDiff = 0;

		this.x = _parent.endX;
		this.y = _parent.endY;

		if(this.Axis == "y")
		{
			lengthAcrossDiff = 90;
			this.length = this.Height * this.Transform.y / 100 - (2 * this.RotationOffset.y);
		}
		else
		{
			this.length = this.Width * this.Transform.x / 100 - (2 * this.RotationOffset.x);
		}

		if(this.lockRotation)
		{
			this.Rotation = this.selfRotation;					
		}
		else
		{
			this.Rotation = this.selfRotation + _parent.Rotation;
		}

		if(this.Mirrored)
		{
			var endX = (MathHelper.lineToAngle([this.x, this.y], (this.length * this.Scale), this.Rotation + lengthAcrossDiff)).x;
			var distance2 = -(this.x - endX);
			this.endX = this.x - distance2;
		}
		else
		{
			this.endX = (MathHelper.lineToAngle([this.x, this.y], (this.length * this.Scale), this.Rotation + lengthAcrossDiff)).x;
		}

		this.endY = (MathHelper.lineToAngle([this.x, this.y], (this.length * this.Scale), this.Rotation + lengthAcrossDiff)).y;


		for(var child in this.ArmorChilds)
		{
			this.ArmorChilds[child].Transform = this.Transform;
		}

		for(var child in this.Childs)
		{
			this.Childs[child].Update(model);
		}
	}

	Render(context)
	{
		if(this.visible)
		{
			var _textureFlip = [this.TextureFlip.x, this.TextureFlip.y];
			var lengthAcrossDiff = 180;

			var textureW = this.TextureWidth;
			var textureH = this.TextureHeight;

			var src = this.Model.textureFamily+this.Texture;
			if(!this.useTexturesFamily) src = this.Texture
			var texture = TextureManager.Get(src);

			if(this.Model.autoFitTexture)
			{
				var textureW = texture.width;
				var textureH = texture.height;
			}
			

			if(this.Axis == "y")
			{
				lengthAcrossDiff = 90;
			}

			if(this.Mirrored)
			{
				this.Rotation = MathHelper.getAngle2([this.x, this.y], [this.endX, this.endY]) - lengthAcrossDiff;
				
				if(this.FlipTextureOnMirror)
				{
					_textureFlip[0] *= -1;
				}
			}

			var txTranslation = {x: 0, y: 0};

			txTranslation.x = this.TextureTranslation.x;
			txTranslation.y = this.TextureTranslation.y;

			if(_textureFlip[1] == -1) txTranslation.y += (this.Height * this.Transform.y / 100) - (2 * this.RotationOffset.y);
			
			if(this.Transform.x != 100 && this.TextureTranslation.x != 0)
			{
				txTranslation.x = this.TextureTranslation.x + (textureW * (this.Transform[0] - 100) / 100);
			}

			if(this.Transform.y != 100 && this.TextureTranslation.y != 0)
			{
				txTranslation.y = this.TextureTranslation.y + (textureH * (this.Transform[1] - 100) / 100);
			}

			var alpha = this.Transparency * this.Model.Transparency;

			context.save();
			context.translate(this.x, this.y);
			context.rotate(this.Rotation * Math.PI/180);
			context.scale(_textureFlip[0], _textureFlip[1]);
			context.globalAlpha = alpha;
			context.drawImage(
				texture, this.TextureOffset.x, this.TextureOffset.y, textureW, textureH,
				-(this.RotationOffset.x * this.Scale) - txTranslation.x * this.Scale, -(this.RotationOffset.y * this.Scale) - txTranslation.y * this.Scale,
				(this.Width * this.Transform.x / 100 * this.Scale), (this.Height * this.Transform.y / 100 * this.Scale)
			);
			context.restore();

			for(var child in this.ArmorChilds)
			{
				this.ArmorChilds[child].Render(context);
			}

		}
	}

	/**
	 * 
	 * @param {Instance} itemSlot ITEM_SLOT
	 */
	BindItemSlot(itemSlot, model)
	{
		model.EquipsParts[itemSlot] = this;

		this.SaveDefaultProperties();
	}

	SetRotation(rotation, RotOffsetX = 0, RotOffsetY = 0)
	{
		this.selfRotation = rotation;
		this.RotationOffset = {x: RotOffsetX, y: RotOffsetY};

		this.SaveDefaultProperties();
	}

	SetTexture(texture, width, height, useTexturesFamily = true)
	{
		this.Texture = texture;
		this.TextureWidth = width;
		this.TextureHeight = height;
		this.useTexturesFamily = useTexturesFamily;

		this.SaveDefaultProperties();
	}

	SetTextureRender(_renderIndex, _mirrorIndex, translationX = 0, translationY = 0, offsetX = 0, offsetY = 0, flipX = 1, flipY = 1, flipOnMirror = true)
	{
		this.renderIndex = _renderIndex;
		this.mirrorIndex = _mirrorIndex;
		this.TextureTranslation.x = translationX;
		this.TextureTranslation.y = translationY;
		this.TextureOffset.x = offsetX;
		this.TextureOffset.y = offsetY;
		this.TextureFlip = {x: flipX, y: flipY};
		this.FlipTextureOnMirror = flipOnMirror;

		this.SaveDefaultProperties();
	}

	AddChild(child, armor)
	{
		if(child != this)
		{
			//Part cannot be Parent for himself
			child.Parent = this;
			this.Childs.push(child);
			if(armor)
			{
				this.ArmorChilds.push(child);
			}
		}

		this.SaveDefaultProperties();
	}

	SaveDefaultProperties()
	{
		var _default = {};

		var excluded = 'ArmorChilds/Childs/Default/Parent/mirrorIndex/renderIndex/x/y/endX/endY';

		for(var property in this)
		{
		   if(!excluded.includes(property))
		   {
				var value = this[property];

				set(_default, 'Default.'+property, value, true);
		   }
		}

		this.Default = JSON.parse(JSON.stringify(_default));
	}

	ResetProperties()
	{
		var _default = JSON.parse(JSON.stringify(this.Default));
		for(var property in _default)
		{
			this[property] = _default[property];
		}
	}
}