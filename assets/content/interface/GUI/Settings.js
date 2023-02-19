class SettingsGUI
{
	constructor(useShadow)
	{
		this.Open = false;
		this.lastOpen = this.Open;
		this.useShadow = useShadow;

		this.margin = 20;

		this.x = 0;
		this.y = 0;
		this.Width = 500;
		this.Height = 0;


		this.SetX = 0;

		this.backgroundColor = "white";

		this.className = "menu_subtitle";
		this.style;
		this.hover = false;

		this.currentOption = "General";

		this.Buttons =
		[
			new Button(-200, -200, "OptionsButton", "General", false, "General", null, false, function(){this.Owner.currentOption = this.id;}, false, false),
			new Button(-200, -200, "OptionsButton", "Sound", false, "Sound", null, false, function(){this.Owner.currentOption = this.id;}, false, false),
			new Button(-200, -200, "OptionsButton", "Controls", false, "Controls", null, false, function(){this.Owner.currentOption = this.id;}, false, false),
			new Button(-200, -200, "OptionsButton", "Back", false, "OptionsBack", null, false, function(){this.Owner.Open = false;}, false, false)
		];

		this.SoundSliders =
		{
			"General": new Slider(0, 0, "SettingsSlider", "General", 0, 100, Settings.Sound.General * 100, false, null, function(){Settings.Sound.General = this.value / 100}),
			"Music": new Slider(0, 0, "SettingsSlider", "Music", 0, 100, Settings.Sound.Music * 100, false, null, function(){Settings.Sound.Music = this.value / 100;}),
			"Effects": new Slider(0, 0, "SettingsSlider", "Effects", 0, 100, Settings.Sound.Effects * 100, false, null, function(){Settings.Sound.Effects = this.value / 100;})
		};






		var controlsUpdate = function()
		{
			if(this.text == "")
			{
				this.text = Settings.Controls[this.id];
			}

			if(Mouse.focus === this)
			{
				this.style.color = "#569af3";
				if(Main.lastKey != this.lastKey && Main.lastKey.toUpperCase() != this.text.toUpperCase())
				{
					this.text = Main.lastKey.toUpperCase();
					Settings.Controls[this.id] = Main.lastKey.toUpperCase();
					Mouse.focus = null;
				}
			}

			if(this.text == " ")
			{
				this.text = "SPACE";
			}

			if(this.text.includes("ARROW"))
			{
				this.text = this.text.replace("ARROW", "");
			}
		};

		var controlsClick = function()
		{
			this.lastKey = Main.lastKey;
		};


		this.controlsError = false;

		this.ControlsButtons =
		{
			MoveUp: new Button(-200, -200, "OptionsControlsButton", "", false, "PlayerMoveUp", controlsUpdate, null, controlsClick),
			MoveDown: new Button(-200, -200, "OptionsControlsButton", "", false, "PlayerMoveDown", controlsUpdate, null, controlsClick),
			MoveLeft: new Button(-200, -200, "OptionsControlsButton", "", false, "PlayerMoveLeft", controlsUpdate, null, controlsClick),
			MoveRight: new Button(-200, -200, "OptionsControlsButton", "", false, "PlayerMoveRight", controlsUpdate, null, controlsClick),

			Bounce: new Button(-200, -200, "OptionsControlsButton", "", false, "Bounce", controlsUpdate, null, controlsClick),
			OpenInventory: new Button(-200, -200, "OptionsControlsButton", "", false, "OpenInventory", controlsUpdate, null, controlsClick),
			OpenPlayerStats: new Button(-200, -200, "OptionsControlsButton", "", false, "OpenPlayerStats", controlsUpdate, null, controlsClick),
			OpenMap: new Button(-200, -200, "OptionsControlsButton", "", false, "OpenMap", controlsUpdate, null, controlsClick)
		};


		var checkboxUpdate = function()
		{
			this.checked = Settings.General[this.id];
			this.style.backgroundColor = (this.checked) ? '#2ce92c' : 'gray';
		};

		var checkboxClick = function()
		{
			this.checked = (this.checked) ? false : true;
			Settings.General[this.id] = this.checked;
		};

		this.GeneralCheckboxes =
		{
			showFPS: new Button(-200, -200, "OptionsCheckbox", "", false, "showFPS", checkboxUpdate, null, checkboxClick),
			showMinimap: new Button(-200, -200, "OptionsCheckbox", "", false, "showMinimap", checkboxUpdate, null, checkboxClick),
			showRadar: new Button(-200, -200, "OptionsCheckbox", "", false, "showRadar", checkboxUpdate, null, checkboxClick),
			AlwaysShowItemPrice:  new Button(-200, -200, "OptionsCheckbox", "", false, "AlwaysShowItemPrice", checkboxUpdate, null, checkboxClick)
		};
	}
	
	
	Update()
	{
		this.style = Style.GetStyleByName(this.className);

		if(Settings.Controls.StateEscape)
		{
			if(this.Open)
			{
				InGame.lockEscape = true;
				InGame.pause = true;
				this.Open = false;
			}
		}


		if(this.lastOpen != this.Open)
		{
			this.lastOpen = this.Open;
			Settings.Save();
		}

		if(!this.Open) return;

		
		this.Height = canvas.height * 60 / 100;
		this.y = (canvas.height / 2) - (this.Height / 2);
		this.x = (canvas.width / 2) - (this.Width / 2);

		this.SetX = this.x + this.Buttons[0].style.width + this.margin;
		
		var interline = 0;

		for(var i = 0; i < this.Buttons.length; i++)
		{
			this.Buttons[i].disabled = (this.Buttons[i].id == this.currentOption) ? true : false;

			this.Buttons[i].Owner = this;
			if(this.Buttons[i].id == "OptionsBack")
			{
				this.Buttons[i].y = this.y + this.Height - this.Buttons[i].style.height;
				this.Buttons[i].x = this.x + 10;
			}
			else
			{
				this.Buttons[i].x = this.x + 10;
				this.Buttons[i].y = this.y + ((interline * this.Buttons[i].style.height) + 10);
				interline++;
			}
			this.Buttons[i].Update();
		}

	}
	
	Render()
	{
		if(!this.Open) return;

		ChangeLayer(Graphic.Layer.Pause);

		var margin = this.margin;
		var alpha = 0.2;

		if(this.useShadow)
		{
			ctx.save();
			ctx.fillStyle = "black";
			ctx.globalAlpha = 0.7;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.restore();

			alpha = 0.3;
		}

		ctx.save();
		ctx.fillStyle = this.backgroundColor;
		ctx.globalAlpha = alpha;
		Graphic.roundRect(ctx, this.x, this.y - margin, this.Width + 2 * margin, this.Height + 2 * margin, margin * 2, true, false);
		ctx.restore();


		for(var i = 0; i < this.Buttons.length; i++)
		{
			this.Buttons[i].Render();
		}



		//line
		ctx.save();
		ctx.fillStyle = this.backgroundColor;
		ctx.globalAlpha = 1;
		ctx.fillRect(this.SetX, this.y - margin / 2, 2, this.Height + margin);
		ctx.restore();



		//title
		var setWidth = this.Width - (this.SetX - this.x);
		var x = this.SetX + (setWidth / 2);
		var y = this.y + margin / 2;
		var text = this.currentOption;
		Style.FillText(ctx, this, text, x, y);

		if(isFunction(this["Draw" + this.currentOption + "Options"]))
		{
			this["Draw" + this.currentOption + "Options"]();
		}


		RestoreLayer();
	}

	DrawGeneralOptions()
	{
		this.style = Style.GetStyleByName("MenuInfo");
		this.style.fontSize = 20;

		var text = "";
		var x = this.SetX + 20;
		var y = this.y + this.margin + 30;
		var buttonsMarginX = 270;
		var buttonsMarginY = -5;
		var lineHeight = 15;



		for(var name in this.GeneralCheckboxes)
		{
			var box = this.GeneralCheckboxes[name];
				box.x = x + buttonsMarginX;
				box.y = y + buttonsMarginY;
				box.Update();
				box.Render();

			text = Lang.Get('OPTIONS_GENERAL_' + name.toUpperCase());
			Style.FillText(ctx, this, text, x, y);

			y = box.y + box.style.height + lineHeight;
		}
	}

	DrawSoundOptions()
	{	
		this.style = Style.GetStyleByName("MenuInfo");
		this.style.fontSize = 25;

		var text = "";
		var x = this.SetX + 20;
		var y = this.y + this.margin + 30;


		//General
		text = "General";
		Style.FillText(ctx, this, text, x, y);

		var slider = this.SoundSliders.General;
			slider.x = x;
			slider.y = y + Style.GetTextSize(text, this.style).height + 10;

			slider.Update();
			slider.Render();

		text = slider.value + "%";
		Style.FillText(ctx, this, text, slider.x + slider.style.width + 20, slider.y);




		y = slider.y + slider.style.height + 40;

		//Music
		text = "Music";
		Style.FillText(ctx, this, text, x, y);

		slider = this.SoundSliders.Music;
			slider.x = x;
			slider.y = y + Style.GetTextSize(text, this.style).height + 10;

			slider.Update();
			slider.Render();

		text = slider.value + "%";
		Style.FillText(ctx, this, text, slider.x + slider.style.width + 20, slider.y);










		y = slider.y + slider.style.height + 40;

		//Effects
		text = "Effects";
		Style.FillText(ctx, this, text, x, y);

		slider = this.SoundSliders.Effects;
			slider.x = x;
			slider.y = y + Style.GetTextSize(text, this.style).height + 10;

			slider.Update();
			slider.Render();

		text = slider.value + "%";
		Style.FillText(ctx, this, text, slider.x + slider.style.width + 20, slider.y);
	}




	DrawControlsOptions()
	{	
		this.style = Style.GetStyleByName("MenuInfo");
		this.style.fontSize = 20;

		var text = "";
		var x = this.SetX + 20;
		var y = this.y + this.margin + 30;
		var buttonsMarginX = 170;
		var buttonsMarginY = -5;
		var lineHeight = 15;

		var usedKeys = {};


		text = "Move Up";
		Style.FillText(ctx, this, text, x, y);

		var button = this.ControlsButtons.MoveUp;
			button.x = x + buttonsMarginX;
			button.y = y + buttonsMarginY;
			button.Update();
			if(usedKeys[button.text]) button.style.color = "#ff0000";
			usedKeys[button.text] = true;
			button.Render();

		y = button.y + button.style.height + lineHeight;




		text = "Move Down";
		Style.FillText(ctx, this, text, x, y);

		button = this.ControlsButtons.MoveDown;
			button.x = x + buttonsMarginX;
			button.y = y + buttonsMarginY;
			button.Update();
			if(usedKeys[button.text]) button.style.color = "#ff0000";
			usedKeys[button.text] = true;
			button.Render();

		y = button.y + button.style.height + lineHeight;



		text = "Move Left";
		Style.FillText(ctx, this, text, x, y);

		button = this.ControlsButtons.MoveLeft;
			button.x = x + buttonsMarginX;
			button.y = y + buttonsMarginY;
			button.Update();
			if(usedKeys[button.text]) button.style.color = "#ff0000";
			usedKeys[button.text] = true;
			button.Render();

		y = button.y + button.style.height + lineHeight;



		text = "Move Right";
		Style.FillText(ctx, this, text, x, y);

		button = this.ControlsButtons.MoveRight;
			button.x = x + buttonsMarginX;
			button.y = y + buttonsMarginY;
			button.Update();
			if(usedKeys[button.text]) button.style.color = "#ff0000";
			usedKeys[button.text] = true;
			button.Render();

		y = button.y + button.style.height + lineHeight;




		text = "Bounce";
		Style.FillText(ctx, this, text, x, y);

		button = this.ControlsButtons.Bounce;
			button.x = x + buttonsMarginX;
			button.y = y + buttonsMarginY;
			button.Update();
			if(usedKeys[button.text]) button.style.color = "#ff0000";
			usedKeys[button.text] = true;
			button.Render();

		y = button.y + button.style.height + lineHeight;



		text = "Open Inventory";
		Style.FillText(ctx, this, text, x, y);

		button = this.ControlsButtons.OpenInventory;
			button.x = x + buttonsMarginX;
			button.y = y + buttonsMarginY;
			button.Update();
			if(usedKeys[button.text]) button.style.color = "#ff0000";
			usedKeys[button.text] = true;
			button.Render();

		y = button.y + button.style.height + lineHeight;




		text = "Open Map";
		Style.FillText(ctx, this, text, x, y);

		button = this.ControlsButtons.OpenMap;
			button.x = x + buttonsMarginX;
			button.y = y + buttonsMarginY;
			button.Update();
			if(usedKeys[button.text]) button.style.color = "#ff0000";
			usedKeys[button.text] = true;
			button.Render();

		y = button.y + button.style.height + lineHeight;



		text = "Open Stats";
		Style.FillText(ctx, this, text, x, y);

		button = this.ControlsButtons.OpenPlayerStats;
			button.x = x + buttonsMarginX;
			button.y = y + buttonsMarginY;
			button.Update();
			if(usedKeys[button.text]) button.style.color = "#ff0000";
			usedKeys[button.text] = true;
			button.Render();

		y = button.y + button.style.height + lineHeight;



	}
}