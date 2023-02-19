class Carthage extends Location
{
	constructor()
	{
		super();
		this.Stage = 0;
		this.Radius = 1000;
		this.Title = "Welcome to Bubble Wars!";
		this.Subtitle = "Use WSAD to move";
		this.Name = "Carthage";
		this.triggerPoints = [];
		this.ageInTicks = 0;


		// this.MapPos = {x: 20, y: 20};
		// this.reqPrevLocation = "Village";



		this.CenterPoint = {x: 0, y: 0};
		this.BackgroundTheme = "interface.InGameCalm";
		this.Room = 0;
		this.Rooms = [];

		this.nextLocation = null;
		this.prevLocation = "TestingChamber";

		this.RoomInfo =
		{
			// MinRooms: 5,
			// MaxRooms: 10,
			MinRooms: 100,
			MaxRooms: 100,
			EntityTypes: [
				// "EntityBubble",
				"EntitySpikeBall"
			],
			MaxEntityTypes: 2,
			BossTypes: [
				"TheFatOne",
				"SpikySniper"
			],
			MinEntities: 5,
			MaxEntities: 15,
			MinRadius: 600,
			MaxRadius: 1200,
			BossChambers: 5,
			SecretChambers: 5,
			Titles:
			{
				Start: "Welcome to Bubble Wars!",
				Boss: "",
				Secret: "Secret Room",
				Room: ""
			},
			Subtitles:
			{
				Start: "Use WSAD to move",
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
World.InitializeLocation(Carthage);