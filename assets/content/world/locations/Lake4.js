class Lake4 extends Lake1
{
	constructor()
	{
		super();
		this.Name = "LOCATION.LAKE.4.NAME";

		// this.MapPos = {x: 5, y: 1};
		this.MapPos = {x: 7, y: 5};
		this.reqPrevLocation = ["Lake2"];



		this.BackgroundTheme = "interface.InGameCalm";

		this.nextLocation = "Lake5";
		this.prevLocation = "Lake3";

		this.RoomInfo =
		{
			MinRooms: 10,
			MaxRooms: 12,
			EntityTypes: [
				// "EntityBubble",
				// "EntityBubbleTank"
			],
			MaxEntityTypes: 2,
			BossTypes: [
				"Waterfly"
			],
			MinEntities: 5,
			MaxEntities: 15,
			MinRadius: 1000,
			MaxRadius: 1200,
			BossChambers: 1,
			SecretChambers: 0,
			Titles:
			{
				Start: "",
				Boss: "",
				Secret: "",
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
World.InitializeLocation(Lake4);