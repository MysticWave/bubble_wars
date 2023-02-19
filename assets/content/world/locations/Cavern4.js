class Cavern4 extends Cavern2
{
	constructor()
	{
		super();
		this.Name = "LOCATION.CAVERN.4.NAME";



		this.MapPos = {x: 12, y: 2};
		this.reqPrevLocation = ["Cavern3"];


		this.BackgroundTheme = "interface.InGameCalm";

		this.nextLocation = "Cavern5";
		this.prevLocation = "Cavern3";

		this.RoomInfo =
		{
			MinRooms: 20,
			MaxRooms: 30,
			EntityTypes: [
				// "EntityBubble"
			],
			MaxEntityTypes: 1,
			BossTypes: [
				"TheFatOne"
			],
			MinEntities: 5,
			MaxEntities: 15,
			MinRadius: 600,
			MaxRadius: 1200,
			BossChambers: 1,
			SecretChambers: 0,
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
World.InitializeLocation(Cavern4);