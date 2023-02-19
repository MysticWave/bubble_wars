class Lake9 extends Lake1
{
	constructor()
	{
		super();
		this.Name = "LOCATION.BEEHIVE.NAME";
		this.Texture = 'location.beehive.room';
		this.TextureAlpha = .5;
		this.TunnelTexture = 'effect.honey_bubble';
		this.TextureScale = 1.25;

		this.MapPos = {x: 4, y: 6};
		this.reqPrevLocation = null;
		this.specialIcon = 'beehive';

		this.BackgroundTheme = "interface.InGameCalm";
		
		this.nextLocation = "Village";
		this.prevLocation = "Lake5";

		this.RoomInfo =
		{
			MinRooms: 10,
			MaxRooms: 16,
			EntityTypes: [
				"EntityHoneyChunk",
				"EntityHoneycomb",
				"EntityLakeLargeBee"
			],
			MaxEntityTypes: 3,
			BossTypes: [
				"BubblebeeQueen"
			],
			MinEntities: 10,
			MaxEntities: 20,
			MinRadius: 1000,
			MaxRadius: 1200,
			BossChambers: 1,
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

	RenderGradient()
	{
		var pos = World.GetBackgroundPosition();

		var grd = ctx.createLinearGradient(pos.x, pos.y, 0, World.Height);
			grd.addColorStop(0, "#C66C00");
			grd.addColorStop(0.5, "#6D3900");
			grd.addColorStop(1, "black");

		ctx.save();
		ctx.fillStyle = grd;
		ctx.fillRect(-Camera.xView, -Camera.yView, World.Width, World.Height);
		ctx.restore();
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
World.InitializeLocation(Lake9);