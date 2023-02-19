class Tutorial extends Location
{
	constructor()
	{
		super();
		this.Stage = 0;
		this.Radius = 1000;
		this.Title = "Welcome to Bubble Wars!";
		this.Subtitle = "Use WSAD to move";
		this.Name = "LOCATION.TUTORIAL.NAME";
		this.triggerPoints = [];
		this.ageInTicks = 0;

		this.MapPos = {x: 3, y: 4};
		this.reqPrevLocation = ["Village"];

		this.LocationFamily = 'Tutorial';


		this.canSave = false;

		this.CenterPoint = {x: 0, y: 0};
		this.BackgroundTheme = "interface.Village";
		this.Room = 0;
		

		this.nextLocation = 'Village';
		this.prevLocation = null;

		this.RoomInfo =
		{
			MinRooms: 6,
			MaxRooms: 6,
			EntityTypes: [
				"TutorialBubble"
			],
			MaxEntityTypes: 1,
			BossTypes: [
				"RubberDuck"
			],
			availableNPC:
			{
				Boss: {id: 'Mage', chance: 100},
				Secret: null,
				Start: null,
				Room: null,
			},
			MinEntities: 5,
			MaxEntities: 15,
			MinRadius: 600,
			MaxRadius: 1200,
			BossChambers: 1,
			SecretChambers: 0,
			Titles:
			{
				Start: "",
				Boss: "",
				Secret: "Secret Room",
				Room: ""
			},
			Subtitles:
			{
				Start: "",
				Boss: "",
				Secret: "",
				Room: ""
			},
			onUpdates:
			{
				Start: null,
				Boss: null,
				Secret: null,
				Room: null
			}
		};


		this.arrowAlpha = new Transition(0.3, 1, 0.5, true, 0.2, 0.2);
		this.arrow = 0;


		var boss = new Room(3, 1100, [['RubberDuck', true]], false, true, false);
			boss.allowExpReward = false;
			boss.onUpdate = function()
			{
				if(World.Player.locationInfo.Tutorial.isCleared && World.Boss) World.Boss.LootTable = new LootTable([]);
			}

		var start = new Room(10, 750, [], true, false, false);
			start.Title = 'TUTORIAL.INFO.1';
			start.Subtitle = 'TUTORIAL.INFO.2';

		var room1 = new Room(9, 900, [['TutorialBubble', false], ['TutorialBubble', false]], false, false, false);
			room1.Title = '';
			room1.Subtitle = 'TUTORIAL.INFO.3';
			room1.allowExpReward = false;

		var room2 = new Room(13, 600, [], false, false, false);
			room2.Subtitle = "TUTORIAL.INFO.4";
			room2.isCleared = true;
			room2.allowExpReward = false;

		var room3 = new Room(5, 750, [
				['TutorialBubble', false],
				['TutorialBubble', false],
				['TutorialBubble', false],
				['TutorialBubble', false]
			], false, false, false);
			room3.Subtitle = 'TUTORIAL.INFO.5';
			room3.allowExpReward = false;
			room3.onUpdate = function()
			{
				if(this.isCleared)
				{
					World.Location.Subtitle = 'TUTORIAL.INFO.6';
				}
			};

		var room4 = new Room(4, 750, [
				['TutorialBubble', false],
				['TutorialBubble', false],
				['TutorialBubble', false],
				['TutorialBubble', false]
			], false, false, false);
			room4.allowExpReward = false;
			room4.onUpdate = function()
			{
				if(World.Player.stats.Level > 1) return;

				if(!this.setitemdrop)
				{
					if(World.Entities[3])
					{
						if(!(World.Entities[3] instanceof Oxygen))
						{
							World.Entities[3].onKill = function()
							{
								var item = new EnchantGemAD();
								World.AddEntity(new EntityItem(item, this.x, this.y));
							};
						}
					}

					if(World.Entities[2])
					{
						if(!(World.Entities[2] instanceof Oxygen))
						{
							World.Entities[2].onKill = function()
							{
								var item = new CannonBase();
									item.Grade = GRADE.COMMON;
								World.AddEntity(new EntityItem(item, this.x, this.y));
							};
						}
					}

					this.setitemdrop = true;
				}

				

				if(this.isCleared)
				{
					var showPickup = false;
					for(var i = 0; i < World.Entities.length; i++)
					{
						if(World.Entities[i] instanceof EntityItem)
						{
							showPickup = true;
							break;
						}
					}

					if(showPickup)
					{
						World.Location.Subtitle = 'TUTORIAL.INFO.7';
					}
					else
					{
						World.Location.Subtitle = 'TUTORIAL.INFO.8';
					}
				}
			};


		this.room5 = new Room(11, 750, [
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false]
		], false, false, false);
		this.room5.allowExpReward = false;
		this.room5.onUpdate = function()
			{
				
				for(var i = 0; i < World.Entities.length; i++)
				{
					if(World.Entities[i] instanceof Oxygen)
					{
						World.Entities[i].FOLLOW_RANGE = (World.Radius * 2);
						if(World.Player.stats.Level > 1)
						{
							World.Entities[i].value = 1;
						}
					}
				}

				if(World.Player.stats.Level > 1 && World.Player.oxygen > 20) return;

				if(this.isCleared)
				{
					World.Location.Subtitle = 'TUTORIAL.INFO.10';
				}
			};

		var room6 = new Room(7, 800, [
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false]
		], false, false, false);
			room6.allowExpReward = false;
			room6.onUpdate = function()
			{
				if(this.isCleared)
				{
					World.Location.Subtitle = 'TUTORIAL.INFO.11';
				}
			};


		var room7 = new Room(0, 750, [
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false],
			['TutorialBubble', false]
		], false, false, false);
		room7.allowExpReward = false;
		room7.onUpdate = function()
		{
			if(this.isCleared)
			{
				World.Location.Subtitle = 'TUTORIAL.INFO.9';
			}
		};
		room7.onEnter = function()
		{
			World.Location.UnlockRoom();
		}

		this.Rooms = 
		[
			[room7, null, null, boss],
			[room4, room3, null, room6],
			[null, room1, start, null],
			[null, room2, null, null]
		];
		
	}

	canOpenPortal()
	{
		return isNPCMet('Mage');
	}
	
	Update()
	{
		super.Update();

		if(document.getElementById('difficulty').dataset.open == 'true') World.Player.allowControl = false;
	}

	UnlockRoom()
	{
		this.Rooms[2][3] = this.room5;
		this.Rooms[2][2].Title = '';
		this.Rooms[2][2].Subtitle = 'TUTORIAL.INFO.12';
	}
	
	onLoad()
	{
		World.MinimalDeep = 0;
		
		InGame.GUI.Map.WorldMapShowing = "LOCATION";

		if(this.BackgroundTheme)
		{
			SoundManager.Play(this.BackgroundTheme, "BACKGROUND");
		}

		this.Rooms[2][2].Enter();
		World.deep = World.MinimalDeep + MathHelper.GetRoomByIndex(this.Rooms, this.Room).y;

		if(!World.Player.locationInfo.Tutorial?.isCleared) UI_Helper.OpenDifficulties();
	}
}
World.InitializeLocation(Tutorial);