class Cavern1 extends Location
{
	constructor()
	{
		super();
		this.Name = "LOCATION.CAVERN.1.NAME";

        this.lightLevel = .1;
        this.specialIcon = 'cavern_entrance';
		this.LocationFamily = 'Cavern';


		this.MapPos = {x: 7, y: 1};
		this.reqPrevLocation = ["Cove1"];



		this.CenterPoint = {x: 0, y: 0};
		this.BackgroundTheme = "interface.InGameCalm";

		this.nextLocation = "Cavern2";
		this.prevLocation = "Cove1";

		this.RoomInfo =
		{
			MinRooms: 10,
			MaxRooms: 20,
			EntityTypes: [
				"EntityBat",
				"EntityFatBat",
				"EntityBlindBat"
			],
			MaxEntityTypes: 3,
			BossTypes: [
				"Zubath"
			],
			availableNPC:
			{
				Boss: null,
				Secret: {id: 'Miner', chance: 50},
				Start: null,
				Room: null,
			},
			MinEntities: 5,
			MaxEntities: 15,
			MinRadius: 1000,
			MaxRadius: 1500,
			BossChambers: 3,
			SecretChambers: 3,
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
World.InitializeLocation(Cavern1);