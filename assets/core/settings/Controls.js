class Controls
{
	constructor()
	{
		this.PlayerMoveUp = "W";
		this.PlayerMoveDown = "S";
		this.PlayerMoveRight = "D";
		this.PlayerMoveLeft = "A";
		this.OpenInventory = "E";
		this.SwitchWeapons = "Q";
		this.OpenPlayerStats = "C";
		this.Bounce = " ";
		this.UseItemSkill = " ";
		this.Escape = "ESCAPE";
		this.OpenMap = "TAB";
		this.OpenWorldMap = "M";
		this.OpenQuestLog = 'V';
		this.Interact = 'F';
		this.UseItem = 'F';
		
		this.StateMoveUp = false;
		this.StateMoveDown = false;
		this.StateMoveLeft = false;
		this.StateMoveRight = false;
		this.StateOpenInventory = false;
		this.StateOpenPlayerStats = false;
		this.StateSwitchWeapons = false;
		this.StateBounce = false;
		this.StateUseItemSkill = false;
		this.StateEscape = false;
		this.StateMap = false;
		this.StateInteract = false;
		this.StateUseItem = false;

		this.AlwaysDashTowardCursor = false;
	}

	Update(key, KeyDown)
	{
		var interaction = World.Player.interactionWith;

		switch(key.toUpperCase())
		{
			case this.PlayerMoveUp:
				this.StateMoveUp = KeyDown;
				break;
				
			case this.PlayerMoveDown:
				this.StateMoveDown = KeyDown;
				break;
				
			case this.PlayerMoveRight:
				this.StateMoveRight = KeyDown;
				break;
				
				
			case this.PlayerMoveLeft:
				this.StateMoveLeft = KeyDown;
				break;

			case this.OpenInventory:
				if(this.canToggleIngameGUI(KeyDown) && !interaction) UI_Helper.ToggleInventory();
				// this.StateOpenInventory = KeyDown;
				break;

			case this.OpenPlayerStats:
				if(this.canToggleIngameGUI(KeyDown) && !interaction) UI_Helper.TogglePlayerStats();
				this.StateOpenPlayerStats = KeyDown;
				break;
				
			// case this.Bounce:
			// 	this.StateBounce = KeyDown;
			// 	break;

			case this.UseItemSkill:
				this.StateUseItemSkill = KeyDown;
				break;
				
			case this.Escape:
				this.StateEscape = KeyDown;
				if(KeyDown) UI_Helper.CatchEscape();
				break;

			case this.OpenMap:
				this.StateMap = KeyDown;
				break;

			case this.OpenWorldMap:
				if(this.canToggleIngameGUI(KeyDown) && !interaction) UI_Helper.ToggleWorldMap();
				break;

			case this.OpenQuestLog:
				if(this.canToggleIngameGUI(KeyDown) && !interaction) UI_Helper.ToggleQuestLog();
				break;

			case this.Interact:
				if(World?.Player?.Interact() && this.canToggleIngameGUI(!KeyDown) && DialogGUI.canBeOpened())
				{
					DialogGUI.Open();
					this.StateInteract = KeyDown;
				}

			case this.UseItem:
				this.StateUseItem = KeyDown;
				break;
		}
	}

	canToggleIngameGUI(KeyDown, ignorePause = false)
	{
		if(Main.RUNNING != RUNNING.INGAME) return false;
		if(!ignorePause && InGame.pause) return false;
		if(KeyDown) return false;
		return true;
	}
}