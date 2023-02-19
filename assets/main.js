class Main
{
	
	static LoadContent()
	{
		// this.RUNNING = RUNNING.LOADING;
		TextureManager.Load();
		SoundManager.Load();
		Style.Load();

		Loading.Run();
	}
	
	
	static Initialize()
	{
		if(typeof TREAT_AS_DATA !== 'undefined') return;
		
		this.Keys = {};
		this.lastKey = null;

		this.frameRenderTime = 0;
		
		this.FPS = 60;
		this.ageInTicks = 0;
		this.DELTA = 0;
		this.maxDelta = 1000 / this.FPS / 1000;
		this.lastTime = (new Date()).getTime();
		this.currentTime = 0;
		this.ShowHitbox = false;
		this.BorderLess = false;
		this.SaveSlot = 'PLAYER_SAVE_0';


		this.renderFullMap = false;
		this.UnlockMiniMap = false;


		this.CurrentInterface = null;

		
		Settings.Init();

		Mouse.Initialize();
		Graphic.Initialize();
		
		SoundManager.Initialize();
		
		Lang.Initialize(Settings.General.Lang);
		this.ItemHelper = ItemHelper;
		this.ItemHelper.Initialize();

		UI_Helper.Init();
		DialogGUI.Initialize();

		this.LoadContent();
		this.AddEventListeners();
		
		InterfaceControl.Initialize();
		DamageIndicator.Initialize();


		this.interval = 1000 / Main.FPS;
		this.performanceRenderTimes = [];

		Settings.Apply();

		ItemHelper.InitializeRecipes();


		// this.LOOP = setInterval(function(){Main.Update()}, this.interval);
		this.Update();
	}
	
	static AddEventListeners()
	{
		document.getElementById('game_container').addEventListener('contextmenu', function(e)
		{
			if(DEVELOPER_MODE && Main.lastKey?.toUpperCase() != 'CONTROL') e.preventDefault();
		});

		window.addEventListener('resize', Main.Resize);

		window.addEventListener("keydown", function(e){
			if(e.key == "Tab") e.preventDefault();
			Main.Keys[e.key] = true;
			Main.lastKey = e.key;
			Settings.Controls.Update(e.key, true);
		}, false);
		
		window.addEventListener("keyup", function(e){
			if(e.key == "Tab")
			{
				e.preventDefault();
			}
			Main.Keys[e.key] = false;
			Settings.Controls.Update(e.key, false);
		}, false);

		
		
		
		
		
		window.addEventListener('mousemove',function(e){
			var rect = document.getElementById('game_container').getBoundingClientRect();

			Mouse.absX = e.clientX;
			Mouse.absY = e.clientY;

			Mouse.x = (e.clientX- rect.left)  / Main.Scale;
			Mouse.y = (e.clientY - rect.top) / Main.Scale;

			if(World?.Player?.hand) InventoryGUI.UpdateHand(true);
		},false);

		Graphic.mainCanvas.addEventListener('mousedown',function(evt){	
			if(evt.button == 0) {		//lewy przycisk myszy
				Mouse.click = true;
			}
			
			if(evt.button == 2) {		//prawy przycisk myszy
				Mouse.rightClick = true;
			}
			
			Mouse.focus = this;
			
		},false);

		Graphic.mainCanvas.addEventListener('mouseover',function(evt){	
			Mouse.onCanvas = true;	
		},false);

		Graphic.mainCanvas.addEventListener('mouseout',function(evt){	
			Mouse.onCanvas = false;
		},false);

		window.addEventListener('mouseup',function(evt){
			Mouse.click = false;
			Mouse.rightClick = false;
			Mouse.lockClick = false;
			Mouse.lockRightClick = false;
			Mouse.lockHover = false;
		},false);

		window.addEventListener("beforeunload", function(e)
		{
			// if(Main.RUNNING == RUNNING.INGAME)
			// {
			// 	e = e || window.event;

			// 	// For IE and Firefox prior to version 4
			// 	if (e)
			// 	{
			// 		e.returnValue = 'Sure?';
			// 	}

			// 	// For Safari
			// 	return 'Sure?';
			// }
		});

	}

	static Resize()
	{
		var game_container = document.getElementById('game_container');
		var gameCanvas = document.getElementById('canvas');
		
		var ratio = gameCanvas.width / gameCanvas.height;
		var newWidth = window.innerWidth;
		var newHeight = window.innerHeight;
		var new_ratio = newWidth / newHeight;
		
		if (new_ratio > ratio) newWidth = newHeight * ratio;
		else newHeight = newWidth / ratio;
		
		// gameCanvas.width = newWidth;
		// gameCanvas.height = newHeight;
		
		game_container.style.width = newWidth + 'px';
		game_container.style.height = newHeight + 'px';
			
		game_container.style.marginTop = (-newHeight / 2) + 'px';
		game_container.style.marginLeft = (-newWidth / 2) + 'px';

		Main.Scale = newHeight / gameCanvas.height;
	}


	static isDesktopVersion()
	{
		return (typeof process !== 'undefined');
	}

	static Exit()
	{
		if(Main.isDesktopVersion()) process.exit();
	}

	
	static Update()
	{
		window.requestAnimationFrame(function(){Main.Update()});
		
		this.currentTime = (new Date()).getTime();
		this.DELTA = (this.currentTime-this.lastTime) / 1000;
		if(this.DELTA > this.maxDelta) this.DELTA = this.maxDelta;
		
		// Graphic.mainCtx.imageSmoothingEnabled = true;

		this.ageInTicks++;
		Mouse.cursor = 'default';
		
		SoundManager.Update();
		if(!Mouse.Disabled) InterfaceControl.Update();

		document.body.dataset.cursor = Mouse.cursor;
		document.body.dataset.mousedown = Mouse.click;
		
		this.Render();
		this.lastTime = this.currentTime;
	}
	
	
	static Render()
	{
		Graphic.Clear();
		
		InterfaceControl.Render();

		const now = performance.now();
		while (this.performanceRenderTimes.length > 0 && this.performanceRenderTimes[0] <= now - 1000)
		{
			this.performanceRenderTimes.shift();
		}
		this.performanceRenderTimes.push(now);


		if((this.RUNNING == RUNNING.INGAME) && Settings.General.showFPS)
		{
			ChangeLayer(Graphic.Layer.GUI);
			var fps = this.performanceRenderTimes.length;
			fps = (fps > this.FPS) ? this.FPS : fps;

			var style = Style.GetStyleByName('MenuInfo');
				style.textAlign = 'right';

			Style.FillText(ctx, {style: style}, 'FPS: ' + fps, canvas.width - 15, 5);
		}

		Graphic.Render();
	}
}
	/*
window.gamepads = {};

	function gamepadHandler(event, connecting) {
	  var gamepad = event.gamepad;
	  // Note:
	  // gamepad === navigator.getGamepads()[gamepad.index]

	  if (connecting) {
		gamepads[gamepad.index] = gamepad;
	  } else {
		delete gamepads[gamepad.index];
	  }
	}

	window.addEventListener("gamepadconnected", function(e) { gamepadHandler(e, true); }, false);
	window.addEventListener("gamepaddisconnected", function(e) { gamepadHandler(e, false); }, false);
		*/