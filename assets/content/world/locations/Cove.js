class Cove1 extends Location
{
	constructor()
	{
		super();
		this.Name = "LOCATION.THE_COVE.NAME";
		this.triggerPoints = [];
		this.ageInTicks = 0;
		this.specialIcon = 'brook';
		
		this.LocationFamily = 'Cove';


		this.MapPos = {x: 5, y: 1};
		this.reqPrevLocation = ["Lake1"];


		this.BackgroundTheme = "interface.InGameCalm";

		this.nextLocation = "Cavern1";
		this.prevLocation = "Lake1";

		this.RoomInfo =
		{
			MinRooms: 20,
			MaxRooms: 30,
			EntityTypes: [
				"EntityCoveFishPoison",
				"EntityCoveFishIce",
				"EntityCoveFishFire"
			],
			MinEntityTypes: 3,
			MaxEntityTypes: 3,
			BossTypes: [
				"TheCoveGuardian"
			],
			MinEntities: 0,
			MaxEntities: 3,
			MinRadius: 900,
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

	generateRandomRooms(RoomInfo, roomsNumber, min_empty)
	{
		var type1 = [
			['boss', 'room', 'room', 'room', 'room'],
			[null,   null,    null,   null,  'room'],
			['room', 'room',  true,   null,  'room'],
			['room', null,    null,   null,  'room'],
			['room', 'room', 'room', 'room', 'room']
		];

		var type2 = [
			['room', 'room', 'room', 'room', 'room'],
			['room',  null,   null,   null,  'room'],
			['room',  null,   true,  'room',  'room'],
			['room',  null,   null,   null,  null],
			['room', 'room', 'room', 'room', 'boss']
		];

		var types = [type1, type2];

		var rooms = types[MathHelper.randomInRange(0, 1)];
		return {rooms: rooms, startRoom: 12};
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
World.InitializeLocation(Cove1);