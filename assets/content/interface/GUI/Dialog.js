class Dialog
{
	constructor()
	{
		this.Open = false;

		this.LayoutHeight = 100;
		this.LayoutFrame = 0;
		this.LayoutFrames = Main.FPS / 2;
		this.x = 0;
		this.y = 0;
		this.Width = 0;
		this.Height = 100;
		this.innerMargin = 20;
		this.outerMargin = 100;

		this.charactersNum = 0;
		this.currentDialog = null;
	}

	static AddDialogLine(dialogLine)
	{
		if(!Dialog.DialogLines) Dialog.DialogLines = {};

		Dialog.DialogLines[dialogLine.id] = dialogLine;
	}

	Update()
	{
		return;
		if(InGame.pause) return;

		World.Player.isTalking = this.Open;
		if(!World.Player.canTalkWith) return;

		if((Settings.Controls.StateTalk) && (!this.lockOpen) && !InGame.GUI.Map.Open)
		{
			if(!InGame.GUI.Inventory.isShopOpen)
			{
				for(var name in InGame.GUI)
				{
					InGame.GUI[name].Open = false;
				}

				this.currentDialog = World.Player.canTalkWith.GetDialogLine();
				this.Open = true;
				this.lockOpen = true;
			}
		}
		else
		{
			if(!Settings.Controls.StateTalk)
			{
				this.lockOpen = false;
			}

			if(Settings.Controls.StateEscape) 
			{
				if(this.Open)
				{
					InGame.lockEscape = true;
					this.Open = false;
				}
			}
		}

		if(!this.Open)
		{
			this.charactersNum = 0;
		}
		else
		{
			Mouse.cursor = 'default';
		}

		


		this.Width = canvas.width - 2 * this.outerMargin;
		this.x = (canvas.width / 2) - (this.Width / 2);
		this.y = canvas.height - (this.LayoutHeight + this.Height + 50);
	}

	Render()
	{
		if(InGame.pause) 
		{
			this.LayoutFrame = 0;
			return;
		}

		this.LayoutFrame += (this.Open) ? 1 : -1;
		if(this.LayoutFrame < 0) 
		{
			this.LayoutFrame = 0;
			return;
		}

		if(this.LayoutFrame > this.LayoutFrames) this.LayoutFrame = this.LayoutFrames;

		this.charactersNum++;

		ChangeLayer(Graphic.Layer.GUI + 1);

			var margin = this.innerMargin;
			var height = this.LayoutHeight * (this.LayoutFrame / this.LayoutFrames);

			ctx.save();
			ctx.fillRect(0, 0, canvas.width, height);
			ctx.fillRect(0, canvas.height - height, canvas.width, height);
			ctx.restore();


			if(this.Open)
			{
				ctx.save();
				ctx.globalAlpha = 0.1;
				ctx.fillStyle = 'white';
				Graphic.roundRect(ctx, this.x - margin, this.y - margin, this.Width + 2 * margin, this.Height + 2 * margin, margin * 2, true, false);
				ctx.restore();



				if(this.currentDialog)
				{
					var optionsWidth = 150;
					var text = this.currentDialog.Text;
					var options = this.currentDialog.GetOptions();
					var x = this.x;
					var y = this.y;
					var maxTextWidth = this.Width - (optionsWidth + 50);

					this.style = Style.GetStyleByName("MenuInfo");
					this.style.fontSize = 20;
					this.style.textAlign = 'left';
					this.style.color = "lightblue";
					this.style.strokeColor = "#569af3";
					this.style.strokeSize = 3;

					var drawnCharacters = 0;

					var lines = Graphic.WrapText(text, maxTextWidth, this.style);
					var interline = 25;
					var drawOptions = true;

					for(var i = 0; i < lines.length; i++)
					{
						var textToDraw = " ";
						var line = lines[i];
						if(drawnCharacters + line.length < this.charactersNum)
						{
							textToDraw = line;
							drawnCharacters += line.length;

							Style.FillText(ctx, this, textToDraw, x, y + (interline * i));
						}
						else
						{
							var new_length = this.charactersNum - drawnCharacters;
							textToDraw = line.slice(0, new_length);

							Style.FillText(ctx, this, textToDraw, x, y + (interline * i));
							drawOptions = false;
							break;
						}
					}

					if(drawOptions)
					{
						this.style.textAlign = 'right';
						x = this.x + this.Width - (this.innerMargin / 2);
						for(var i = 0; i < options.length; i++)
						{
							text = options[i].Text;
							if(x - optionsWidth <= Mouse.x && x >= Mouse.x && y + (interline * i) < Mouse.y && y + (interline *(i + 1)) > Mouse.y)
							{
								text = "> " + text;
								if(Mouse.click)
								{
									if(isFunction(options[i].onClick)) options[i].onClick();
									Mouse.click = false;
								}
							}
							Style.FillText(ctx, this, text, x, y + (interline * i));
						}
					}
				}
			}
			

		RestoreLayer();

	}
}