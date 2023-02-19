class Lake1 extends Location
{
	constructor()
	{
		super();
		this.Name = "LOCATION.LAKE.1.NAME";
		this.LocationFamily = 'Lake';


		this.MapPos = {x: 4, y: 2};
		this.reqPrevLocation = ["Tutorial"];

		this.BackgroundTheme = "interface.InGameCalm";

		this.nextLocation = "Lake2";
		this.prevLocation = "Village";

		this.RoomInfo =
		{
			MinRooms: 6,
			MaxRooms: 10,
			EntityTypes: [
				"EntityBubble",
				"EntityBubbleFormation0",
				"EntityBubbleFormation2"
			],
			MaxEntityTypes: 3,
			BossTypes: [
				"OxyCell"
			],
			MinEntities: 10,
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
World.InitializeLocation(Lake1);