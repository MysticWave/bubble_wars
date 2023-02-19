class EntityItem extends Entity
{
	constructor(item, x, y, dirX = 1)
	{
		super(x, y);

		this.width = 64;
		this.height = 64;
		this.PickUpDelay = 2 * Main.FPS;
		this.isHurtAble = false;
		this.Visible = true;
		this.value = 1;

		this.item = item;
		this.Texture = item.Texture;
		this.item.showNewItemInfo = true;
		this.Scale = 0.5;
		this.dirX = dirX;

		this.onPlayerCollision = function(player)
		{
			if(this.ageInTicks > this.PickUpDelay)
			{
				if(this.hover) ItemInfo.Hide();
				this.item.Pick(player, this);
				this.item = null;
			}
		};

		this.SPD = 350;
		this.FOLLOW_RANGE = 50;
		this.AI.Apply(new AI_Follow(World.Player));
		this.AI.Apply(new AI_Walk());


		if(dirX == -1)
		{
			this.x -= this.width * this.Scale;
		}

		this.fX = function(x, p, q)
		{
			return 0.125 * ((x - p) * (x - p)) + q;
		};

		this.throwDistance = 40;
		this.p = this.x + ((this.throwDistance / 2) * this.dirX);
		this.q = this.y - 60;
		

		this.alphaTransition = new Transition(0.2, 1, 0.15, true, 0.02, 0.02);
		this.yTransition = new Transition(1, 10, 1.5, true, 0.1, 0.1);
		this.HitBox = new HitBox();
		this.HitBox.Scale = 1.75;

		this.AI.Apply(new AI_MouseEvents());
	}

	Update()
	{
		super.Update();

		if(this.ageInTicks < this.throwDistance)
		{
			this.x += this.dirX;
			this.y = this.fX(this.x, this.p, this.q);
		}

		if(this.ageInTicks < this.PickUpDelay) this.NoAI = true;
		else this.NoAI = false;

		if(this.hover && this.item) 
		{
			ItemInfo.Hide();
			ItemInfo.Show(this.item, null, null, null, true);
		}
		else if(this.lastHover) ItemInfo.Hide();

		this.lastHover = this.hover;
	}

	Render()
	{
		var alpha = 1;
		if(this.ageInTicks < this.PickUpDelay)
		{
			alpha = this.alphaTransition.Update();
		}

		if(this.Visible)
		{
			var scale = this.Scale * this.item.onFloorScale;
			var y = this.y - Camera.yView - (this.height * scale / 2);
			var x = this.x - Camera.xView - (this.width * scale / 2);

			if(this.ageInTicks > this.throwDistance + 10)
			{
				y += this.yTransition.Update();
			}


			ctx.save();
			ctx.globalAlpha = alpha;
			ctx.drawImage(TextureManager.Get(this.Texture), x, y, this.width * scale, this.height * scale);
			ctx.restore();

			this.item.DrawShine(x + (15 * scale), y + (15 * scale), scale);


			if(this.item?.showInBubble)
			{
				ctx.save();
				ctx.globalAlpha = alpha - 0.15;
				var sc = 0.2;
				ctx.drawImage(TextureManager.Get("bubble"), x- this.width * sc, y - this.height * sc, this.width * (scale + 2 * sc), this.height * (scale + 2 * sc));
				ctx.restore();
			}

			// if(this.hover)
			// {
			// 	// var grade = Lang.Get(this.item.Grade) +' ';
			// 	// var color = 'white';

			// 	// if(this.item.Grade == GRADE.NORMAL) grade = '';
			// 	// else 
			// 	// {
			// 	// 	color = getCssVariable(document.body, '--color-grade-'+this.item.Grade.toLowerCase());
			// 	// }
			// 	// var name = "[" + grade + ItemInfo.GetItemName(this.item).name + "]";

			// 	// Style.FillText(ctx, this, name, Mouse.x, Mouse.y, color);

			// 	// ItemInfo.Hide();
			// 	console.log('show');
			// 	ItemInfo.Show(this.Item);
			// }
			// else if(this.lastHover) ItemInfo.Hide();

			// this.lastHover = this.hover;

			var r = this.HitBox.Radius || this.HitBox.Width / 2;
			Graphic.addLightSource(this.x - Camera.xView, this.y - Camera.yView, r * 2);

			this.HitBox.Render();
		}
	}
}