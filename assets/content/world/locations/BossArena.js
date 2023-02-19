class BossArena extends Location
{
	constructor()
	{
		super();
		this.Name = "LOCATION.BOSS_ARENA.NAME";
		this.Texture = 'location.boss_arena.room';
		this.TextureAlpha = .5;
		// this.TunnelTexture = 'effect.honey_bubble';
		this.TextureScale = 1.145;

		this.Radius = 1500;
		this.BackgroundTheme = "world.boss_arena";

		this.nextLocation = null;
		this.prevLocation = null;


		this.LocationFamily = '';
		this.allowMap = false;
		

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
			},
			onUpdates:
			{
				Start: null,
				Boss: null,
				Secret: null,
				Room: null
			}
		};

		this.summonRotation = 0;
		this.summonTick = 0;
	}

	RenderGradient()
	{
		// var pos = World.GetBackgroundPosition();

		// var grd = ctx.createLinearGradient(pos.x, pos.y, 0, World.Height);
		// 	grd.addColorStop(0, "#C66C00");
		// 	grd.addColorStop(0.5, "#6D3900");
		// 	grd.addColorStop(1, "black");

		// ctx.save();
		// ctx.fillStyle = grd;
		// ctx.fillRect(-Camera.xView, -Camera.yView, World.Width, World.Height);
		// ctx.restore();

		ctx.save();
		ctx.fillStyle = '#110000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.restore();
	}

	RenderRoom()
	{
		super.RenderRoom();


		if(World.Boss && isFunction(World.Boss.onBossRender))
		{
			this.summonTick = 120;
		}
		else
		{
			this.summonTick--;
		}


		if(this.summonTick >= 0)
		{
			var size = 512;
			var scale = 2;
			var alpha = this.summonTick / 120;
			this.summonRotation+= 2;
			Graphic.DrawRotatedImage(ctx, TextureManager.Get('location.boss_arena.summon_circle'), 
				World.CenterPoint.x - Camera.xView, World.CenterPoint.y - Camera.yView, size, size, scale, this.summonRotation, alpha);
		}
	}
	
	Update()
	{
		super.Update();
	}
	
	onLoad()
	{
		this.DefaultLocationLoad();

		
	}
}
World.InitializeLocation(BossArena);