class ModelBase
{
	constructor(owner, textureFamily = '', autoFitTexture = false)
	{
		this.textureFamily = textureFamily;
		this.autoFitTexture = autoFitTexture;
		
		this.Width = 64;
		this.Height = 64;

		this.Scale = 1.0;
		this.Mirrored = false;
		this.visible = true;

		this.Offset = {x: 0, y: 0};
		this.x = 0;
		this.y = 0;

		this.endX = 0;
		this.endY = 0;

		this.Rotation = 0;
		this.selfRotation = 0;

		this.Parts = {};
		this.RenderOrder = null;
		this.MirrorOrder = null;
		this.Owner = owner;
		this.Animations = {};
		this.ArmorModel = null;

		this.EquipsParts = [];
		this.Transparency = 1.0;
	}

	Update(noAnimation = false)
	{
		this.Rotation = this.selfRotation + this.Owner.Rotation;

		this.scale = this.Scale * Camera.Scale * this.Owner.Scale;
		this.Transparency = this.Owner.Transparency;

		this.x = this.Owner.x - (this.Offset.x * this.scale) - Camera.xView;
		this.y = this.Owner.y - (this.Offset.y * this.scale) - Camera.yView;

		this.endX = this.x;
		this.endY = this.y;

		if(!noAnimation)
		{
			for(var i in this.Animations) this.Animations[i].Update();
		}

		for(var part in this.Parts)
		{
			if(this.Parts[part].Parent == null)
			{
				this.Parts[part].Update(this);
			}
		}

		
	}

	ApplyArmorModel(armor_model)
	{
		if(armor_model)
		{
			this.ArmorModel = new armor_model(this);
		}  
	}

	ApplyModelAnimation(animation)
	{
		if(animation)
		{
			var name = animation.name;
			this.Animations[name] = new animation(this);
		}
	}

	UpdateEquipParts()
	{
		var equips = this.Owner.equips;

		for(var slot in equips)
		{
			var item = this.Owner.equips[slot];
			if(this.EquipsParts[slot])
			{
				if(item)
				{
					this.EquipItem(this.EquipsParts[slot], item);
				}
				else
				{
					this.EquipsParts[slot].visible = false;
				}
			}
		}
	}

	EquipItem(part, item)
	{
		var itemModel = JSON.parse(item.Model);

		if(part)
		{
			part.visible = true;
			for(var property in itemModel)
			{
				if(property != "Scale" && property != "Rotation")
				{
					part[property] = itemModel[property];
				}
			}

			if(!itemModel.Width)
			{
				part.Width = TextureManager.Get(itemModel.Texture).width;
			}
			if(!itemModel.Height)
			{
				part.Height = TextureManager.Get(itemModel.Texture).height;
			}

			if(!itemModel.TextureWidth)
			{
				part.TextureWidth = TextureManager.Get(itemModel.Texture).width;
			}
			if(!itemModel.TextureHeight)
			{
				part.TextureHeight = TextureManager.Get(itemModel.Texture).height;
			}

			if(itemModel.Rotation)
			{
				part.selfRotation = itemModel.Rotation;
			}

			if(itemModel.Scale)
			{
				part.RotationOffset.x *= itemModel.Scale;
				part.RotationOffset.y *= itemModel.Scale;

				part.Transform.x = itemModel.Scale * 100;
				part.Transform.y = itemModel.Scale * 100;
			}
		}
	}

	Render(context)
	{
		if(!this.RenderOrder)
		{
			this.RenderOrder = this.GetRenderOrder();
			this.MirrorOrder = this.GetRenderOrder(true);
		}

		if(this.visible)
		{
			if(this.Mirrored)
			{
				for(var part in this.MirrorOrder)
				{
					this.MirrorOrder[part].Render(context);
				}
			}
			else
			{
				for(var part in this.RenderOrder)
				{
					this.RenderOrder[part].Render(context);
				}
			}
		}
	}

	GetRenderOrder(mirrored)
	{
		var order = [];
			
		for(var part in this.Parts)
		{
			if(this.Parts[part] != null)
			{
				if(mirrored)
				{
					order[this.Parts[part].mirrorIndex] = this.Parts[part];
				}
				else
				{
					order[this.Parts[part].renderIndex] = this.Parts[part];
				}
			}
		}
			
		return order;
	}

}