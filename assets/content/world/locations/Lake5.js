class Lake5 extends Lake1
{
	constructor()
	{
		super();

		this.Name = "LOCATION.LAKE.5.NAME";

		// this.MapPos = {x: 5, y: 1};
		this.MapPos = {x: 6, y: 6};
		this.reqPrevLocation = ["Lake3", "Lake4"];

		this.BackgroundTheme = "interface.InGameCalm";
		
		this.nextLocation = "Lake6";
		this.prevLocation = "Lake4";

		this.RoomInfo =
		{
			MinRooms: 10,
			MaxRooms: 16,
			EntityTypes: [
				"EntityHoneyChunk",
				"EntityLakeLittleBee",
				"EntityLakeLargeBee"
			],
			MaxEntityTypes: 3,
			BossTypes: [
				"Bubblebee"
			],
			MinEntities: 10,
			MaxEntities: 20,
			MinRadius: 1000,
			MaxRadius: 1200,
			BossChambers: 3,
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
World.InitializeLocation(Lake5);