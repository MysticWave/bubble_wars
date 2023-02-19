class Lake3 extends Lake1
{
	constructor()
	{
		super();
		this.Name = "LOCATION.LAKE.3.NAME";

		this.MapPos = {x: 5, y: 5};
		this.reqPrevLocation = ["Lake2"];

		this.BackgroundTheme = "interface.InGameCalm";

		this.nextLocation = "Lake4";
		this.prevLocation = "Lake2";

		this.RoomInfo =
		{
			MinRooms: 10,
			MaxRooms: 12,
			EntityTypes: [
				"EntityBubbleFormation3",
				"EntityBubbleFormation4",
				"EntityBubbleFormation5"
			],
			MaxEntityTypes: 3,
			BossTypes: [
				"TheFatOne"
			],
			availableNPC:
			{
				Boss: {id: 'Stylist', chance: 100},
				Secret: null,
				Start: null,
				Room: null,
			},
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
World.InitializeLocation(Lake3);