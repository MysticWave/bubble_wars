class TestingChamber extends Location
{
	constructor()
	{
		super();
		this.Stage = 0;
		this.Radius = 1200;
		this.Title = "Bubble Wars";
		this.Subtitle = "Testing Chamber";
		this.Name = "Testing Chamber";
		this.triggerPoints = [];
		this.ageInTicks = 0;

		this.CenterPoint = {x: 0, y: 0};
		this.BackgroundTheme = "interface.InGameCalm";
		this.Room = 0;
		this.Rooms = [];


		this.nextLocation = null;
		this.prevLocation = "Carthage";

		this.RoomInfo =
		{
			// MinRooms: 5,
			// MaxRooms: 10,
			MinRooms: 100,
			MaxRooms: 100,
			EntityTypes: [
				// "EntityBubble",
				// "EntitySpikeBall"
			],
			MaxEntityTypes: 2,
			BossTypes: [
				"TheFatOne",
				"SpikySniper"
			],
			MinEntities: 5,
			MaxEntities: 10,
			MinRadius: 800,
			MaxRadius: this.Radius,
			BossChambers: 5,
			SecretChambers: 5,
			Titles:
			{
				Start: "Bubble Wars",
				Boss: "",
				Secret: "Secret Room",
				Room: ""
			},
			Subtitles:
			{
				Start: "Testing Chamber",
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
		if(this.ageInTicks % 2 == 0)
		{
			// this.Radius -= 0.2;
		}
		super.Update();
	}
	
	onLoad()
	{
		World.MinimalDeep = 10;
		this.DefaultLocationLoad();
		

		// Main.ShowHitbox = true;

		// this.triggerPoints[0] = new TriggerPoint(World.CenterPoint.x, World.CenterPoint.y, 320, "test", function(entity)
		// {
		// 	// var motion = Motion.Get([entity.x, entity.y], [this.x, this.y], 400);
		// 	// entity.ApplyMove(motion);
		// });
		
	}
}
World.InitializeLocation(TestingChamber);