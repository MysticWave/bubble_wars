class Lake2 extends Lake1
{
	constructor()
	{
		super();
		this.Name = "LOCATION.LAKE.2.NAME";

		this.MapPos = {x: 6, y: 3};
		this.reqPrevLocation = ["Lake1"];


		this.BackgroundTheme = "interface.InGameCalm";

		this.nextLocation = 'Lake3';
		this.prevLocation = "Lake1";

		this.RoomInfo =
		{
			MinRooms: 6,
			MaxRooms: 10,
			EntityTypes: [
				"EntityTrim",
				"EntityFatTrim",
				"EntityTrimFormation0"
			],
			MaxEntityTypes: 3,
			BossTypes: [
				"Trimago"
			],
			MinEntities: 5,
			MaxEntities: 15,
			MinRadius: 1000,
			MaxRadius: 1200,
			BossChambers: 2,
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
World.InitializeLocation(Lake2);