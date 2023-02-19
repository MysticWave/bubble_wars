class Menu extends Interface
{
	static Initialize()
	{
		super.Initialize();
		this.RUNNING = RUNNING.MENU;
		this.UI_ID = 'menu';
		this.ageInTicks = 0;

		var date = new Date();
		this.isValentineDay = (date.getDate() + "." + (date.getMonth() + 1) == "14.2") ? true : false;
		this.isChildrensDay = (date.getDate() + "." + (date.getMonth() + 1) == "1.6") ? true : false;
		
		this.bubbles = [];
		this.BubbleCount = 1024;
		this.currentBubbles = this.BubbleCount;
		
		for(var i = 0; i < this.BubbleCount; i++)
		{
			var scale = (MathHelper.randomInRange(8, 18) / 100);

			var x = MathHelper.randomInRange(0, canvas.width - 10);
			var y = MathHelper.randomInRange(0, canvas.height * 2);
			this.bubbles.push({x: x, y: y, scale: scale, texture: "bubble"});
		}
		
		this.Cwidth = canvas.width;
		
		this.titleY = -30;
		this.titleLoop = false;
		this.titleSpd = 350;
		this.titleRot = -1;
		this.bubbleSpd = 300;
		this.timeSinceShoot = 0;


		// this.Settings = new SettingsGUI();
	}

	static Run()
	{
		super.Run();
		SoundManager.Play("interface.MenuBackground", "BACKGROUND");
		Graphic.showShader('flare');
	}
	
	static Update()
	{			
		if(this.isShooting) Mouse.cursor = "ingame";

		if(!this.transition)
		{
			super.Update();

			SaveSelectionGUI.Update();
		}
	}
	
	static Render()
	{
		this.ageInTicks++;
		this.timeSinceShoot++;
		
		ctx.save();
		ctx.fillStyle = "#4a63e8";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.restore();
		
		var sc = 1;
		if(this.Cwidth < canvas.width)
		{
			sc = canvas.width / this.Cwidth;
		}
		
		for(var i = 0; i < this.bubbles.length; i++)
		{
			var bubble = this.bubbles[i];

			var texture = TextureManager.Get(bubble.texture);
			if(this.isValentineDay && bubble.texture != "bubble_pop")
			{
				texture = TextureManager.Get("valentineBubble");
			}
			if(this.isChildrensDay && bubble.texture != "bubble_pop")
			{
				texture = TextureManager.Get("valentineBubble");
			}
			
			if(bubble.texture == "bubble_pop")
			{
				var frames = texture.height / texture.width;
				if(this.ageInTicks % 5 ==0)
				{
					bubble.frame++;
				}
				
				if(bubble.frame >= frames)
				{
					bubble.frame = frames - 1;
					this.bubbles.splice(i, 1);
					i--;
				}
			}
			else
			{
				bubble.frame = 0;
				bubble.y -= this.bubbleSpd * bubble.scale * Main.DELTA;
				
				if(bubble.y < -100)
				{
					if(!this.transition)
					{
						bubble.y = canvas.height + 50;
					}
					else
					{
						this.bubbles.splice(i, 1);
						i--;
					}
				}

				var width = texture.width * bubble.scale;
				var height = texture.width * bubble.scale;
				
				
				if(!this.transition)
				{
					if(!Settings.Controls.StateMoveLeft) this.lockOsuKeyA = false;
					if(!Settings.Controls.StateMoveDown) this.lockOsuKeyS = false;

					//Klikniecie na babelki
					if(
						(Mouse.x >= bubble.x* sc) && (Mouse.x <= bubble.x* sc + width) && 
						(Mouse.y >= bubble.y) && (Mouse.y <= bubble.y + height) && 
						(
							(Mouse.click && !Mouse.lockClick) || 
							//for osu players xD
							(Settings.Controls.StateMoveLeft && !this.lockOsuKeyA) || 
							(Settings.Controls.StateMoveDown && !this.lockOsuKeyS)
						)
					)
					{
						this.bubbles[i].texture = "bubble_pop";

						texture = TextureManager.Get("bubble_pop");

						this.currentBubbles--;
						this.timeSinceShoot = 0;
						SoundManager.Play("effect.BubblePop", "EFFECT");
						Mouse.lockClick = true;

						if(Settings.Controls.StateMoveLeft) this.lockOsuKeyA = true;
						if(Settings.Controls.StateMoveDown) this.lockOsuKeyS = true;
					}
				}
			}
			
			var x = bubble.x * sc;
				
			ctx.drawImage(texture, 0, bubble.frame * texture.width, texture.width, texture.width, x, bubble.y, texture.width * bubble.scale, texture.width * bubble.scale);
		}
		
		var tittle = "Bubble Wars";
		var subtitle = " ";
		if(this.isValentineDay) subtitle = "Happy Valentine`s Day!";

		if(this.isChildrensDay) subtitle = "Happy Children`s Day! :)";

		this.style = Style.GetStyleByName("menu");
		
		
		this.titleY -= (this.titleSpd * Main.DELTA * this.titleRot) / 5;
		// var loop_y_min = 85;
		// var loop_y_max = 135;
		var loop_y_min = canvas.height * .12;	//12%
		var loop_y_max = canvas.height * .16;	//16%


		if(this.titleLoop)
		{
			if((this.titleY < loop_y_min) || (this.titleY > loop_y_max))
			{
				this.titleRot *= -1;
			}
		}
		
		if((this.titleY > loop_y_max - 5) && !this.titleLoop)
		{
			this.titleLoop = true;
			this.titleSpd = 150;
		}
		

		var bubbles_container = document.getElementById('menu_game_bubbles');
			bubbles_container.innerText = '';
		
		if(!this.transition)
		{
			Style.FillText(ctx, this, tittle, canvas.width / 2, this.titleY, null, null);
			this.style = Style.GetStyleByName("menu_subtitle");
			Style.FillText(ctx, this, subtitle, canvas.width / 2, this.titleY + 50, null, null);

			if(this.currentBubbles <= 1000)
			{
				this.isShooting = (this.timeSinceShoot < 2) ? true : this.isShooting;

				bubbles_container.innerText = "Bubbles: " + this.currentBubbles;
			}

			if(Settings.Controls.StateEscape)
			{
				if(this.timeSinceShoot < 3 * Main.FPS)
				{
					this.timeSinceShoot = 3 * Main.FPS;
				}
			}

			if(this.timeSinceShoot > 3 * Main.FPS) this.isShooting = false;

			document.getElementById('menu_buttons').dataset.fade = this.isShooting;

			SaveSelectionGUI.Render();
		}

		super.Render();
	}
	
	static Transition(onEnd)
	{
		UI_Helper.Hide();
		Graphic.hideShaders();
		this.bubbleSpd = 6000;
		super.Transition(onEnd);
	}
}
InterfaceControl.InitializeInterface(Menu);