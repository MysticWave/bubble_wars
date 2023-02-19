class Lake8 extends Lake1
{
	constructor()
	{
		super();
		this.Stage = 0;
		this.Radius = 1000;
		this.Title = "Welcome to Bubble Wars!";
		this.Subtitle = "Use WSAD to move";
		this.Name = "LOCATION.LAKE.8.NAME";
		this.triggerPoints = [];
		this.ageInTicks = 0;


		this.MapPos = {x: 2, y: 5};
		this.reqPrevLocation = ["Lake7"];



		this.CenterPoint = {x: 0, y: 0};
		this.BackgroundTheme = "interface.InGameCalm";
		this.Room = 0;
		this.Rooms = [];

		this.nextLocation = 'Village';
		this.prevLocation = "Lake7";

		this.RoomInfo =
		{
			MinRooms: 10,
			MaxRooms: 20,
			EntityTypes: [
				// "EntityBubble",
				// "EntityBubbleTank"
			],
			MaxEntityTypes: 2,
			BossTypes: [
				"Celltipede"
			],
			MinEntities: 5,
			MaxEntities: 15,
			MinRadius: 1000,
			// MinRadius: 1200,
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
	}
	
	Update()
	{
		super.Update();
	}
	
	onLoad()
	{
		World.MinimalDeep = 0;
		this.DefaultLocationLoad();
	}
}
World.InitializeLocation(Lake8);