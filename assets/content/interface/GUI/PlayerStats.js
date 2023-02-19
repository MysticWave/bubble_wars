class PlayerStats
{
	constructor(owner)
	{
		this.Owner = owner;
		this.Open = false;
		this.SelfOpen = false;

		this.margin = 20;

		this.x = this.margin;
		this.y = 0;
		this.Width = 150;
		this.Height = 0;

		this.backgroundColor = "rgba(255, 255, 255, 0.1)";
		this.style = Style.GetStyleByName("Default");
		this.hover = false;
		

		var SPbuttonOnClick = function()
		{
			this.Owner.UseSPpoint(this.id);
		};

		var SPbuttonOnUpdate = function()
		{
			if(this.clickTime > Main.FPS / 2)
			{
				var spd = 10;

				if(this.clickTime >  Main.FPS)
				{
					spd = 15;
				}

				if(this.clickTime > 2 * Main.FPS)
				{
					spd = 30;
				}

				if(this.clickTime % (Main.FPS / spd) == 0)
				{
					this.Click();
				}
			}
		};

		this.SPbuttons = 
		[
			new Button(0, 0, "SPbutton", "[+]", false, "MAXHP", SPbuttonOnUpdate, null, SPbuttonOnClick),
			new Button(0, 0, "SPbutton", "[+]", false, "AD", SPbuttonOnUpdate, null, SPbuttonOnClick),
			new Button(0, 0, "SPbutton", "[+]", false, "ATTACK_SPEED", SPbuttonOnUpdate, null, SPbuttonOnClick),
			new Button(0, 0, "SPbutton", "[+]", false, "SPD", SPbuttonOnUpdate, null, SPbuttonOnClick),
			new Button(0, 0, "SPbutton", "[+]", false, "LUCK", SPbuttonOnUpdate, null, SPbuttonOnClick)
		];
	}
	
	
	Update()
	{
		return;
		if(InGame.pause) return;

		if((Settings.Controls.StateOpenPlayerStats) && (!this.lockKey) && !InGame.lookingAtMap)
		{
			this.SelfOpen = (this.SelfOpen) ? false : true;
			this.lockKey = true;
		}
		else
		{
			if(!Settings.Controls.StateOpenPlayerStats)
			{
				this.lockKey = false;
			}
		}

		this.Open = (this.SelfOpen) ? true : this.Open;

		if(!this.Open) return;
		if(InGame.GUI.Map.Open) return;
		if(InGame.GUI.RunInfo.Open) return;
		if(InGame.GUI.Dialog.Open) return;

		
		this.Height = InGame.GUI.Inventory.Height;
		this.y = (canvas.height / 2) - (this.Height / 2);
		

		//zapobiega na strzelanie podczas przesuwania przedmiotow
		this.hover = false;
		if(
			Mouse.CheckHoverState(this.x, this.y - this.margin, this.Width + 2 * this.margin, this.Height + 2 * this.margin)
		)
		{
			this.Owner.allowAttack = false;
			this.hover = true;
			Mouse.cursor = 'default';
		}
	}
	
	Render()
	{
		if(!this.Open) return;
		if(InGame.GUI.Map.Open) return;
		if(InGame.pause) return;
		if(InGame.GUI.RunInfo.Open) return;
		if(InGame.GUI.Dialog.Open) return;

		var margin = this.margin;
		var infoColor = "lightblue";
		var hoverColor = '#00ff00';
		var infoStroke = "#569af3";
		var text = "";
		var color = infoColor;
		var interline = 25;


		//player stats background
		ctx.save();
		ctx.fillStyle = this.backgroundColor;
		Graphic.roundRect(ctx, this.x, this.y - margin, this.Width + 2 * margin, this.Height + 2 * margin, margin, true, false);
		ctx.restore();
		
		
		var x = this.x + (this.margin / 2);
		var y = this.y;
		text = "Exp:  " + this.Owner.oxygen + " / " + this.Owner.requiredOxygen;
		Style.FillText(ctx, this, text, x, y, infoColor, infoStroke);

		y += interline;
		y += interline;
		text = "Life:  " + this.Owner.stats.HP + " / " + this.Owner.stats.MAXHP;
		color = (this.SPbuttons[0].hover) ? hoverColor : infoColor;
		Style.FillText(ctx, this, text, x, y, color, infoStroke);


		y += interline;
		var dmg = World.Player.GetDamageValues();
		text = "Damage:  " + dmg.min + " - " + dmg.max;
		color = (this.SPbuttons[1].hover) ? hoverColor : infoColor;
		Style.FillText(ctx, this, text, x, y, color, infoStroke);

		y += interline;
		var as = (this.Owner.stats.ATTACK_SPEED == parseInt(this.Owner.stats.ATTACK_SPEED)) ? this.Owner.stats.ATTACK_SPEED + ".0" : this.Owner.stats.ATTACK_SPEED;
		text = "Attack Speed:  " + as;
		color = (this.SPbuttons[2].hover) ? hoverColor : infoColor;
		Style.FillText(ctx, this, text, x, y, color, infoStroke);

		y += interline;
		text = "Attack Range:  " + this.Owner.stats.ATTACK_RANGE;
		Style.FillText(ctx, this, text, x, y, infoColor, infoStroke);




		y += interline;
		text = "SPD:  " + this.Owner.stats.SPD;
		color = (this.SPbuttons[3].hover) ? hoverColor : infoColor;
		Style.FillText(ctx, this, text, x, y, color, infoStroke);


		var plusButtonMargin = 0;

		y += interline * 2;
		if(this.Owner.stats.availableSP > 0)
		{
			plusButtonMargin = 20;
			text = "SP:  " + this.Owner.stats.availableSP;
			this.style.textAlign = "right";
			Style.FillText(ctx, this, text, x + this.Width + (margin / 2), y, infoColor, infoStroke);
			this.style.textAlign = "left";
		}


		y += interline;
		this.SPbuttons[0].Owner = this.Owner;
		this.SPbuttons[0].y = y;
		text = "Resistance:  " + this.Owner.SPstats.MAXHP[0];
		Style.FillText(ctx, this, text, x + plusButtonMargin, y, infoColor, infoStroke);



		y += interline;
		this.SPbuttons[1].Owner = this.Owner;
		this.SPbuttons[1].y = y;
		text = "Power:  " + this.Owner.SPstats.AD[0];
		Style.FillText(ctx, this, text, x + plusButtonMargin, y, infoColor, infoStroke);


		y += interline;
		this.SPbuttons[2].Owner = this.Owner;
		this.SPbuttons[2].y = y;
		text = "Dexterity:  " + this.Owner.SPstats.ATTACK_SPEED[0];
		Style.FillText(ctx, this, text, x + plusButtonMargin, y, infoColor, infoStroke);


		y += interline;
		this.SPbuttons[3].Owner = this.Owner;
		this.SPbuttons[3].y = y;
		text = "Swiftness:  " + this.Owner.SPstats.SPD[0];
		Style.FillText(ctx, this, text, x + plusButtonMargin, y, infoColor, infoStroke);

		y += interline;
		this.SPbuttons[4].Owner = this.Owner;
		this.SPbuttons[4].y = y;
		text = "Luck:  " + this.Owner.stats.LUCK;
		Style.FillText(ctx, this, text, x + plusButtonMargin, y, infoColor, infoStroke);

		
			for(var i = 0; i < this.SPbuttons.length; i++)
			{
				var button = this.SPbuttons[i];

				// y += interline;
				// button.Owner = this.Owner;
				// button.y = y;
				// text = "Resistance:  " + this.Owner.SPstats.MAXHP[0];
				// Style.FillText(ctx, this, text, x + plusButtonMargin, y, infoColor, infoStroke);

				if(plusButtonMargin)
				{
					button.x = x;
					button.y += 10;
					button.Update();
					button.opacity = (button.hover) ? 1 : 0.5;

					button.style.color = infoColor;
					button.style.strokeColor = infoStroke;
					button.Render();
				}
				else
				{
					button.clickTime = 0;
					button.hover = false;
				}
			}
	}
}