class InGame extends Interface
{
	static Initialize()
	{
		super.Initialize();
		this.RUNNING = RUNNING.INGAME;
		this.showMinimap = true;
		this.stageClear = false;
		this.stageClearTime = 5 * 60;
		this.pause = false;
		this.pauseTime = 0;
		this.lockEscape = false;
		this.stageClearTitleTime = 0;
		this.itemTitle = "";
		this.DeathScreenQuote = " ";
		this.levelInfoPos = [0, -50];

		this.UI_ID = 'ingame';

		this.heartTransition = new Transition(1, 1.5, 0.1, true, 0.05, 0.05);
		this.heartAnimation = -2;
		this.failScreenAlpha = new Transition(0, 0.8, 3);


		this.GUI = 
		{
			Map: new Map(),
			// Settings: new SettingsGUI(true),
			RunInfo: new RunInfo()
			// Dialog: new Dialog()
		};

		this.Scale = 1;
		this.heartAnimationLastTick = 0;
		this.heartDelay = 0;
		
		
		// this.Bars =
		// [
		// 	// new ProgressBar(20, 20, "barHP", World.Players[0].stats.MAXHP, World.Players[0].stats.MAXHP, function(){this.currentValue = World.Players[0].stats.HP; this.value = World.Players[0].stats.MAXHP}),
		// 	// new ProgressBar(20, 20, "barShield", World.Players[0].shield, World.Players[0].stats.MAXHP, function(){this.currentValue = World.Players[0].shield; this.value = World.Players[0].stats.MAXHP / 2; this.reverseProgressDisplay = true;}),
		// 	// new ProgressBar(19, 43, "barMP", 60, 0, function(){this.currentValue = Math.floor(World.Players[0].attackCharge); this.value = 60}),
			
		// 	new ProgressBar(50, 0, "barEXP", false, false, function()
		// 	{
		// 		this.style.width = canvas.width - 100;
		// 		this.y = canvas.height - 50;
				
		// 		this.currentValue = World.Players[0].oxygen;
		// 		this.value = World.Players[0].requiredOxygen;

		// 		InGame.levelInfoPos[0] = this.x;
		// 		InGame.levelInfoPos[1] = this.y - 15;
		// 		this.focusAble = false;
		// 		this.disabled = true;
		// 	}),
			
		// 	new ProgressBar(300, 0, "bossHP", false, false, function()
		// 	{
		// 		this.visible = false;
		// 		if(!World.Boss) return;
				
		// 		this.style.width = canvas.width - 600;
		// 		this.y = 30;
				
	
		// 		this.visible = true;
		// 		this.currentValue = World.Boss.HP;
		// 		this.value = World.Boss.MAXHP; 
		// 		this.innerHTML = "[BOSS] " + World.Boss.name;
		// 		this.focusAble = false;
		// 	})
		// ];

		// this.Buttons =
		// [
		// 	new Button(10, 0, 'ingameButton', '', false, 'options', function()
		// 	{
		// 		//Update
		// 		this.y = canvas.height - this.style.height - 10;
		// 		this.style.backgroundImage = 'gui.cog';
		// 	}, null, 
		// 	function()
		// 	{
		// 		InGame.pause = true;
		// 	})
		// ];
		
		this.PauseButtons =
		[
			new Button(-200, -200, "LargeButton", "Continue", false, "InGameContinue", function(){var center = Style.getCenterPosition("LargeButton"); this.x = center.x; this.y = center.y - 150}, false, function(){InGame.pause = false;}, false, false),
			new Button(-200, -200, "LargeButton", "Settings", false, "InGameContinue", function(){var center = Style.getCenterPosition("LargeButton"); this.x = center.x; this.y = center.y}, false, function(){InGame.GUI.Settings.Open = true;}, false, false),
			new Button(-200, -200, "LargeButton", "Quit", false, "InGameBack", function(){var center = Style.getCenterPosition("LargeButton"); this.x = center.x; this.y = center.y + 150}, false, function(){InGame.Transition(function(){Menu.Run();})}, false, false)
		];

		World.Initialize();
	}

	static Run()
	{
		super.Run();
		Graphic.showShader('background_transition');

		this.setHeartAnimationDelay();
	}

	static Pause()
	{
		this.pause = true;
		UI_Helper.Open('pause', false, null, function(){InGame.Resume()});
	}

	static Resume()
	{
		this.pause = false;
		UI_Helper.removeHistoryElement('pause');
	}

	static Quit()
	{
		this.Transition(function(){Menu.Run();});
		this.pause = true;
	}
	
	static Update()
	{
		this.backgroundTransparency = 0;
		Mouse.cursor = "default";

		if(!this.pause)
		{
			if(!World.Player.hand) Mouse.cursor = "ingame";
			World.Update();
			DamageIndicator.Update();

			InventoryGUI.updateItemsShine();
			DialogGUI.Update();
			AppearanceGUI.Update();
		}
		else
		{
			// Mouse.cursor = 'default';
			// if(!this.transition)
			// {
			// 	if(!this.GUI.Settings.Open)
			// 	{
			// 		for(var i = 0; i < this.PauseButtons.length; i++)
			// 		{
			// 			this.PauseButtons[i].Update();
			// 		}
			// 	}
			// }
		}


		this.Scale = (this.Scale > 2) ? 2 : this.Scale;
		this.Scale = (this.Scale < 1) ? 1 : this.Scale;

		//Skalowanie swiata
		if(Graphic.layersInfo[Graphic.Layer.BackgroundDecoration]) Graphic.layersInfo[Graphic.Layer.BackgroundDecoration].scale = this.Scale;
		if(Graphic.layersInfo[Graphic.Layer.Background]) Graphic.layersInfo[Graphic.Layer.Background].scale = this.Scale;
		if(Graphic.layersInfo[Graphic.Layer.Main]) Graphic.layersInfo[Graphic.Layer.Main].scale = this.Scale;
		if(Graphic.layersInfo[Graphic.Layer.Particle]) Graphic.layersInfo[Graphic.Layer.Particle].scale = this.Scale;

		if(World.Boss)
		{
			var boss_hp_progress = Math.round(World.Boss.HP / World.Boss.MAXHP * 100 * 100) / 100 + '%';
			var boss_hp_content = Math.round(World.Boss.HP) + ' / ' + World.Boss.MAXHP;

			UI_Helper.setBarProgress('boss_hp_bar', boss_hp_progress, true, boss_hp_content);
			set('#boss_name', 'dataset.name', World.Boss.getDisplayName(), true);
			set('#boss_hp_bar_container', 'style.display', '', true);
			set('#boss_hp_bar_container', 'dataset.poisoned', World.Boss.isPoisoned, true);
		}
		else
		{
			//thanks to this if, the boss hp bar will stay on screen after player death
			if(World.Player.isAlive) set('#boss_hp_bar_container', 'style.display', 'none', true);
		}
		
		if(!World.Player.isAlive)
		{
			Mouse.cursor = "default";
			return;
		} 

		// if((Settings.Controls.StateEscape) && (!this.GUI.Inventory.Open) && (!this.lockEscape) && (!this.GUI.Map.Open)&& (!this.GUI.Dialog.Open) && (!this.GUI.RunInfo.Open))
		// {
		// 	this.pause = (this.pause) ? false : true;
		// 	this.lockEscape = true;
		// }
		// else if(!Settings.Controls.StateEscape)
		// {
		// 	this.lockEscape = false;
		// }


		for(var name in this.GUI)
		{
			this.GUI[name].Update();
		}

		this.updateHeartAnimationDelay();
			
		super.Update();
	}

	static updateHeartAnimationDelay()
	{
		if(!this.heartDelay) return;

		if(this.heartAnimationLastTick + this.heartDelay <= Main.ageInTicks) 
		{
			UI_Helper.TriggerHeartAnimation();
			this.heartDelay = 0;
		}
	}

	static setHeartAnimationDelay(delay = 8 * Main.FPS)
	{
		this.heartDelay = delay;
		this.heartAnimationLastTick = Main.ageInTicks;
	}
	
	static Render()
	{
		World.Render();

		ChangeLayer(Graphic.Layer.GUI);
		
		super.Render();
		// if(World.Boss)
		// {
		// 	var obj = {};
		// 	obj.x = this.Bars[1].x;
		// 	obj.y = this.Bars[1].y + 2;
		// 	obj.style = Style.GetStyleByName("default");
		// 	obj.style.width = this.Bars[1].style.width;
		// 	obj.style.height = this.Bars[1].style.height;
		// 	obj.style.textAlign = "center";

		// 	var text = Math.round(World.Boss.HP) + "/" + World.Boss.MAXHP;
			
		// 	Style.FillText(ctx, obj, text);
		// }

		if(!this.transition)
		{
			// this.drawHearts();

			// var text = "Level: " + World.Player.stats.Level;
			// this.style = Style.GetStyleByName("menu");
			
			
			// this.style.fontSize = 20;
			// this.style.textAlign = "left";
			// Style.FillText(ctx, this, text, this.levelInfoPos[0], this.levelInfoPos[1]);
			

			if(Settings.General.showRadar) LocationRadar.Render();
			
			for(var name in this.GUI)
			{
				this.GUI[name].Render();
			}

			AppearanceGUI.Render();

			

			
			
			// var x = canvas.width - 150 - 10;
			
			// this.style.fontSize = 20;
			// this.style.width = 150;
			// this.style.textAlign = "center";
			// Style.FillText(ctx, this, text, x, 30);
			
			if(this.itemTitle)
			{
				this.style = Style.GetStyleByName("menu");
				this.style.fontSize = 30;
				Style.FillText(ctx, this, '"' + this.itemTitle + '"', canvas.width / 2, 150, null, null, 0.8);
			}

		}
		
		if(!World.Player.isAlive)
		{
			if(!UI_Helper.isOpen('death_screen'))
			{
				set('#death_screen_quote', 'innerText', this.DeathScreenQuote, true);
				UI_Helper.Open('death_screen', false);
			}
			

			// ChangeLayer(Graphic.Layer.Pause);

			// 	var alpha = this.failScreenAlpha.Update();

			// 	ctx.save();
			// 	ctx.fillStyle = "black";
			// 	ctx.globalAlpha = alpha;
			// 	ctx.fillRect(0, 0, canvas.width, canvas.height);
			// 	ctx.restore();

			// 	if(alpha == this.failScreenAlpha.To)
			// 	{
			// 		this.style = Style.GetStyleByName();
			// 		this.style.fontSize = 50;
			// 		Style.FillText(ctx, this, this.DeathScreenQuote, canvas.width / 2, canvas.height / 2 - 100);


			// 		this.style.fontSize = 30;
			// 		Style.FillText(ctx, this, 'Click to respawn', canvas.width / 2, canvas.height / 2 + 50);


			// 		if(Mouse.click)
			// 		{
			// 			Mouse.click = false;
			// 			World.Player.Respawn();
			// 		}
			// 	}
				

			// RestoreLayer();

			return;
		}
		
		if(this.pause)
		{
			// ChangeLayer(Graphic.Layer.Pause);
			// if(!this.transition && !this.GUI.Settings.Open)
			// {
			// 	var alpha = this.pauseTime / 3 / 10;
			// 	if(alpha > 0.7) alpha = 0.7;
				
			// 	ctx.save();
			// 	ctx.fillStyle = "black";
			// 	ctx.globalAlpha = alpha;
			// 	ctx.fillRect(0, 0, canvas.width, canvas.height);
			// 	ctx.restore();
				
			// 	for(var i = 0; i < this.PauseButtons.length; i++)
			// 	{
			// 		this.PauseButtons[i].Render();
			// 	}
				
			// 	this.pauseTime++;
			// }
			// RestoreLayer();
		}
		else 
		{
			if(this.showLevelUp)
			{
				this.showLevelUpMessage();
			}

			if(this.isRoomCleared)
			{
				if(!this.GUI.RunInfo.Open)
				{
					this.ShowTitle();
				}
			}

			this.pauseTime = 0;
		}
		
		if(!this.transition)
		{
			DamageIndicator.Render();

			if(World.Player.slow)
			{
				ctx.save();
				ctx.globalAlpha = 0.3;
				ctx.fillStyle = "white";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.restore();
			}
			
			var hurtTime = 8;
			if( (World.Player.timeSinceHurt > 0) && (World.Player.timeSinceHurt <= hurtTime))
			{
				var alpha = (Math.floor(World.Player.timeSinceHurt / (hurtTime / 2)) + (World.Player.timeSinceHurt % hurtTime) / 2) / 10;
				var width = canvas.width / 2;
				var height = canvas.height / 2;
				
				ctx.save();
				ctx.globalAlpha = alpha;
				
				var grd = ctx.createRadialGradient(width, height, 200, width, height, 800);
					grd.addColorStop(0, "rgba(255, 255, 255, 0)");
					grd.addColorStop(1, "red");
					
				ctx.fillStyle = grd;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.restore();
			}
		}

		set('#shader_background_transition', 'style.opacity', this.backgroundTransparency);

		if(KnowledgeGUI.isOpen) KnowledgeGUI.UpdatePreviews();
	}

	static showLevelUpMessage(init)
	{
		if(init)
		{
			this.levelUpTicks = 0;
			this.showLevelUp = true;
			this.levelUpTransition = new Transition(0, 1, 0.15, true, 0.5);
		}

		var time = 0.8 * Main.FPS;
		if(this.levelUpTicks > time)
		{
			this.showLevelUp = false;
			return;
		}

		var text = "Level Up!";
		var spd = 250;
		var x = World.Player.x - Camera.xView;
		var y = World.Player.y - Camera.yView;

		y -= this.levelUpTicks * spd * Main.DELTA;

		var alpha = this.levelUpTransition.Update();

		this.style.textAlign = 'center';
		this.style.fontSize = 35;

		Style.FillText(ctx, this, text, x, y, null, null, alpha);

		this.levelUpTicks++;
	}

	static ShowTitle(init, text)
	{
		if(init)
		{
			this.clearRoomTransition = new Transition(0, 1, 1.5, true, 1);
			this.isRoomCleared = true;
			this.customText = text;
		}

		var text = (World.Location.Perfect) ? "Perfect!" : "Clear!";
		if(this.customText)
		{
			text = this.customText;
		}
		this.style = Style.GetStyleByName("menu");
		this.style.fontSize = 150;

		var alpha = this.clearRoomTransition.Update();
		if(alpha == this.clearRoomTransition.From)
		{
			this.isRoomCleared = false;
		}

		var width = Style.GetTextSize(text, this.style);
		var scale = (canvas.width * .9) / width;

		if(scale < 1) this.style.fontSize *= scale;

		Style.FillText(ctx, this, text, canvas.width / 2, canvas.height / 2 - 40, null, null, alpha);
	}
	
	static StageClear()
	{
		var timeTo = Math.round(10 - (this.stageClearTime / 60));
		
		this.stageClearTime++;
		var text, text2;
		
		text = "";
		this.style = Style.GetStyleByName("menu");
		this.style.fontSize = 150;
		var alpha = 0.7;
		
		if(timeTo > 4)
		{
			text = (World.Location.Perfect) ? "Perfect!" : "Clear!";
			
			if(timeTo > 8)
			{
				alpha = (this.stageClearTime / 10) / 10;
			}
			else
			{
				alpha = 1 - ((this.stageClearTime -3 * 60) / 10) / 10;
			}
			
			if(alpha >= 0.7)
			{
				alpha = 0.7;
			}
			
			if(alpha < 0)
			{
				alpha = 0;
			}
			
			Style.FillText(ctx, this, text, canvas.width / 2, canvas.height / 2 - 40, null, null, alpha);

		}
		else
		{
			text = (timeTo - 1 > 0) ? timeTo - 1 : "Start!";			
			
			Style.FillText(ctx, this, text, canvas.width / 2, canvas.height / 2 - 40, null, null, alpha);
		}

		
		if(timeTo == 0)
		{
			if(World.Location instanceof TroubleBubble)
			{
				World.Location.NewStage();
			}
		}
	}
	
	static DrawMiniMap()
	{
		return;

		var width = 150;
		var height = 150;
		var point_size = 7;
		var entity_point = point_size - 2;
		
		var w_scale = (World.Radius * 2) / width;
		var h_scale = (World.Radius * 2) / height;
		
		var marginRight = 15;
		var x = canvas.width - width - marginRight;
		var y = 15;
		
		ctx.save();
		// ctx.fillStyle = "black";
		// ctx.globalAlpha = 0.2;
		ctx.fillStyle = "white";
		ctx.globalAlpha = 0.1;
		ctx.beginPath();
		ctx.arc(x + width / 2, y + height / 2, width / 2 + 5, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();
		
		ctx.save();
		ctx.lineWidth = 5;
		ctx.strokeStyle  = "lightgray";
		ctx.beginPath();
		ctx.arc(x + width / 2, y + height / 2, (width / 2) + 5, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.restore();
		
		if(World.isChangingLocation) return;
		//nie wyswietla obiektow podczas zmiany lokacji

		for(var i = 0; i < World.Entities.length; i++)
		{
			var s = 0;
			var color = "red";
			var entity = World.Entities[i];
			if(entity.isHidden) continue;
			if(entity.isFromPlayer) continue;		//do not show player dummies

			if( (entity instanceof Oxygen) || (entity instanceof EntityItem))
			{
				s = 3;
				color = "white";
				if(!entity.value)
				{
					//nie wyswietla na minimapie "pustych" tlenkow
					continue;
				}
			}
			
			if(entity instanceof EntityUpgrade)
			{
				s = 1;
				color = "yellow";
			}

			if(entity.isNPC)
			{
				color = 'white';
			}
			
			var px = (entity.x / w_scale) - ((World.Width / 2 - World.Radius) / w_scale) - entity_point - s + (marginRight / 2);
			var py = (entity.y / h_scale) - ((World.Width / 2 - World.Radius) / w_scale) - entity_point - s + (marginRight / 2);
			
			ctx.save();
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(x + px, y + py, entity_point - s, 0, 2 * Math.PI);
			ctx.fill();
			ctx.restore();
		}
		
		var px = (World.Players[0].x / w_scale) - ((World.Width / 2 - World.Radius) / w_scale) - point_size + (marginRight / 2);
		var py = (World.Players[0].y / h_scale) - ((World.Width / 2 - World.Radius) / w_scale) - point_size + (marginRight / 2);
		
		ctx.save();
		ctx.fillStyle = "blue";
		ctx.beginPath();
		ctx.arc(x + px, y + py, point_size, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

	static drawHearts()
	{
		this.heartAnimationTick = this.heartAnimationTick || 0;
		var heartAnimationDelay = 4 * Main.FPS;

		var heartValue = Player.GetHeartValue();

		var heartsInRow = 10;
		var heartFull = TextureManager.Get("heart");
		var heartHalf = TextureManager.Get("heart_half");
		var heartEmpty = TextureManager.Get("heart_empty");
		var heart;

		var hp = World.Player.stats.HP;
		var x = 10;
		var y = 10;
		var size = 32;
		var xStep = size;
		var yStep = (size / 2);

		var scale = this.heartTransition.Update();

		if(hp <= 2 * heartValue)
		{
			heartAnimationDelay = 0;
			if(hp == heartValue)
			{
				//dwa razy szybciej
				scale = this.heartTransition.Update();
			}
		}
		

		if(this.heartAnimation < hp / (2 * heartValue))
		{
			if(scale == this.heartTransition.From)
			{
				if(!this.lockHeartAnimation)
				{
					this.heartAnimation++;
					this.lockHeartAnimation = true;
				}
			}
			else
			{
				this.lockHeartAnimation = false;
			}
		}
		else
		{
			this.heartAnimationTick++;
			if(this.heartAnimationTick > heartAnimationDelay)
			{
				this.heartAnimation = 0;
				this.heartAnimationTick = 0;
				this.heartTransition.ageInTicks = 0;
			}
		}

		

		for(var i = 0; i < Math.floor(World.Player.stats.MAXHP / (2 * heartValue)); i++)
		{
			if(hp - 2 * heartValue >= 0)
			{
				heart = heartFull;
				hp -= 2 * heartValue;
			}
			else
			{
				heart = heartHalf;
				hp -= heartValue;
			}

			if(hp < 0)
			{
				heart = heartEmpty;
				hp -= 2 * heartValue;
			}

			if((this.heartAnimation == i) && (heart != heartEmpty))
			{
				ctx.drawImage(heart, x + (size - (size * scale)) / 2, y+ (size - (size * scale)) / 2, size * scale, size * scale);
			}
			else
			{
				ctx.drawImage(heart, x, y, size, size);
			}

			x += xStep;

			if(((i + 1) % heartsInRow == 0) && i != 0)
			{
				y += yStep;
				x -= xStep * heartsInRow;
			}
		}
	}
}
InterfaceControl.InitializeInterface(InGame);