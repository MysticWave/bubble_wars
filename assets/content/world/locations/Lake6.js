class Lake6 extends Lake1
{
	constructor()
	{
		super();
		this.Name = "LOCATION.LAKE.6.NAME";


		// this.MapPos = {x: 5, y: 1};
		this.MapPos = {x: 5, y: 8};
		this.reqPrevLocation = ["Lake5"];


		this.BackgroundTheme = "interface.InGameCalm";

		this.nextLocation = "Lake7";
		this.prevLocation = "Lake5";

		this.RoomInfo =
		{
			MinRooms: 10,
			MaxRooms: 13,
			EntityTypes: [
				"EntityLakeTadpole",
				"EntityLakeFrog",
				"EntityGreenLakeFrog"
			],
			MaxEntityTypes: 3,
			BossTypes: [
				"Frogo"
			],
			MinEntities: 8,
			MaxEntities: 16,
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
World.InitializeLocation(Lake6);