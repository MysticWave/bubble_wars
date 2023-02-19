class Lake7 extends Lake1
{
	constructor()
	{
		super();
		this.Name = "LOCATION.LAKE.7.NAME";


		// this.MapPos = {x: 5, y: 1};
		this.MapPos = {x: 3, y: 8};
		this.reqPrevLocation = ["Lake6"];


		this.BackgroundTheme = "interface.InGameCalm";


		this.nextLocation = "Lake8";
		this.prevLocation = "Lake6";

		this.RoomInfo =
		{
			MinRooms: 12,
			MaxRooms: 15,
			EntityTypes: [
				"EntityLittleLakeSpider",
				"EntityLakeSpider",
				"EntityDashingLakeSpider"
			],
			MaxEntityTypes: 3,
			BossTypes: [
				"LakeSpiderQueen"
			],
			MinEntities: 10,
			MaxEntities: 15,
			MinRadius: 1000,
			MaxRadius: 1400,
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
World.InitializeLocation(Lake7);