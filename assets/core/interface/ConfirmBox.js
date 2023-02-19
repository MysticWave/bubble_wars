class ConfirmBox
{
	constructor(name, onTrue = null, onFalse = null, trueName = "Yes", falseName = "No")
	{
		this.Name = name;
		this.onTrue = onTrue;
		this.onFalse = onFalse;

		this.Margin = 10;

		this.Width = 200;
		this.Height = 100;
		this.ButtonHeight = 40;
		this.ButtonWidth = 50;

		var onTrueClick = function()
		{
			var index = Main.confirms.indexOf(this);
			if(index)
			{
				Main.confirms.splice(index, 1);
			}
			if(isFunction(onTrue))
			{
				onTrue();
			}
		}

		var onFalseClick = function()
		{
			var index = Main.confirms.indexOf(this);
			if(index)
			{
				Main.confirms.splice(index, 1);
			}
			if(isFunction(onFalse))
			{
				onFalse();
			}
		}
		
		this.Buttons =
		[
			new Button(0, 0, 'ConfirmBoxButton', trueName, false, "true", null, null, onTrueClick.bind(onTrueClick, onTrue)),
			new Button(0, 0, 'ConfirmBoxButton', falseName, false, "false", null, null, onFalseClick.bind(onFalseClick, onFalse)),
		];

		this.style = Style.GetStyleByName('confirmBox');

		if(isArray(this.Name))
		{
			for(var i = 0; i < this.Name.length; i++)
			{
				var size = Style.GetTextSize(this.Name[i], this.style);
				if(size.width > this.Width) this.Width = size.width;
				if(size.height > this.Height) this.Height = size.height;
			}
		}
		else
		{
			var size = Style.GetTextSize(this.Name, this.style);
			if(size.width > this.Width) this.Width = size.width;
			if(size.height > this.Height) this.Height = size.height;
		}
	}

	Update()
	{
		Mouse.Disabled = false;
		for(var i = 0; i < this.Buttons.length; i++)
		{
			this.Buttons[i].Update();
		}
		Mouse.Disabled = true;
	}

	Render()
	{
		this.x = (canvas.width / 2) - (this.Width / 2);
		this.y = (canvas.height / 2) - (this.Height / 2);

		ctx.save();
		ctx.globalAlpha = 0.6;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.restore();

		ctx.save();
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = "white";
		Graphic.roundRect(ctx, this.x - this.Margin, this.y - this.Margin, this.Width + 2 * this.Margin, this.Height + this.ButtonHeight + 2* this.Margin, 20, true);
		ctx.restore();

		var xStep = (this.Width - (2 * this.ButtonWidth)) / 3;
		var x = this.x + xStep;
		var y = this.y + this.Height;

		for(var i = 0; i < this.Buttons.length; i++)
		{
			this.Buttons[i].x = x + (i * (xStep + this.ButtonWidth));
			this.Buttons[i].y = y;
			this.Buttons[i].style.width = this.ButtonWidth;
			this.Buttons[i].style.height = this.ButtonHeight;
			this.Buttons[i].Render();
		}
	}
}