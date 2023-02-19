class Village extends Location
{
	constructor()
	{
		super();
		this.Stage = 0;
		this.Radius = 1100;
		this.Title = "Bubble Wars";
		this.Subtitle = "";
		this.Name = "LOCATION.VILLAGE.NAME";
		this.triggerPoints = [];
		this.ageInTicks = 0;

		this.CenterPoint = {x: 0, y: 0};
		this.BackgroundTheme = "interface.Village";
		this.Room = 0;
		this.Rooms = [];

		this.nextLocation = null;
		this.prevLocation = null;


		this.LocationFamily = 'Village';


		this.MapPos = {x: 1, y: 3};
		this.allowMap = false;
		this.isVillage = true;

		this.startX = 0;
		this.startY = 128;

		this.alwaysShowBubbleTunnel = 
		{
			top: false,
			bottom: true,
			left: false,
			right: false
		};
		

		this.RoomInfo =
		{
			MinRooms: 1,
			MaxRooms: 1,
			EntityTypes: [
	
			],
			MaxEntityTypes: 0,
			BossTypes: [],
			MinEntities: 0,
			MaxEntities: 0,
			MinRadius: this.Radius,
			MaxRadius: this.Radius,
			BossChambers: 0,
			SecretChambers: 0,
			Titles:
			{
			},
			Subtitles:
			{
				Start: "Village"
			},
			onUpdates:
			{
				Start: null,
				Boss: null,
				Secret: null,
				Room: null
			}
		};

		this.lastTriggerUpdate = 0;
	}

	onBorderTrigger(trigger)
	{
		if(trigger.id != 'borderTrigger2') return;
		
		if(World.Location.lastTriggerUpdate+1 != World.ageInTicks && document.getElementById('world_map').dataset.open != 'true') UI_Helper.ToggleWorldMap();

		World.Location.lastTriggerUpdate = World.ageInTicks;
	}
	
	Update()
	{
		super.Update();
	}

	onExit()
	{
		World.Player.Effects.Clear('Regeneration');
	}


	summonNPC(_constructor, x, y)
	{
		var pos = MathHelper.getRandomPointInRange([World.CenterPoint.x, World.CenterPoint.y], this.Radius - 100, 150);
		World.Spawn(new _constructor(x ?? pos.x, y ?? pos.y));
	}
	
	onLoad()
	{
		this.DefaultLocationLoad();

		this.summonNPC(DevMerchant);

		this.summonNPC(Merchant);
		this.summonNPC(Sensei);
		this.summonNPC(Mage);
		

		if(isNPCMet('STYLIST')) this.summonNPC(Stylist);
		if(isNPCMet('MINER')) this.summonNPC(Miner);


		this.summonNPC(Statue, World.CenterPoint.x, World.CenterPoint.y);
		ApplyEffect(World.Player, 'Regeneration', 2, 999999, false, {});
	}
}
World.InitializeLocation(Village);