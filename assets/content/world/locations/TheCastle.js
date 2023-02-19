class TheCastle extends Location
{
	constructor()
	{
		super();
		this.Name = "LOCATION.CASTLE.NAME";
		this.Texture = 'location.castle.room';
		this.TextureAlpha = 1;
		this.TextureScale = 1.22;

		this.Radius = 1200;
		this.BackgroundTheme = "world.boss_arena";

		this.nextLocation = null;
		this.prevLocation = null;

        this.MapPos = {x: 11, y: 5};
		this.reqPrevLocation = ["Lake7"];


		this.LocationFamily = '';
		// this.allowMap = false;
		

		this.RoomInfo =
		{
			MinRooms: 1,
			MaxRooms: 1,
			EntityTypes: [
	
			],
			MaxEntityTypes: 0,
			BossTypes: [
                'TheDestroyer'
            ],
			MinEntities: 0,
			MaxEntities: 0,
			MinRadius: this.Radius,
			MaxRadius: this.Radius,
			BossChambers: 1,
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

        this.Textures = 
        {
            Pillar: 'location.castle.pillar',
            Door: 'location.castle.door',
            LightSourceBack: 'location.castle.light.back',
            LightSource: 'location.castle.light',
            Fire: 'effect.fire.blue'
        };

        this.Pillars = 
        [
            -4,
            -15,
            -30,
            -45,
            -60,
            -75,
            -86,

            4,
            15,
            30,
            45,
            60,
            75,
            86,

            180-4,
            180-15,
            180-30,
            180-45,
            180-60,
            180-75,
            180-86,

            180+4,
            180+15,
            180+30,
            180+45,
            180+60,
            180+75,
            180+86
        ];

        this.LightSources = 
        [
            -9.25,
            -22.25,
            -37.25,
            -52.25,
            -67.25,
            -80.25,

            9.25,
            22.25,
            37.25,
            52.25,
            67.25,
            80.25,

            180-9.25,
            180-22.25,
            180-37.25,
            180-52.25,
            180-67.25,
            180-80.25,

            180+9.25,
            180+22.25,
            180+37.25,
            180+52.25,
            180+67.25,
            180+80.25
        ];

        this.PillarR = this.Radius - 10;
        this.DoorR = this.Radius - 40;

        this.lightR = this.Radius-100;
	}

    generateRandomRooms(RoomInfo, roomsNumber, min_empty)
	{
		var rooms = 
        [
            [null, 'boss', null],
            [null, true, null],
            [null, null, null]
        ]
		return {rooms: rooms, startRoom: 4};
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
		ctx.fillStyle = '#0A0A0A';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.restore();
	}

	RenderRoom()
	{
		super.RenderRoom();

        var doors = [];
        var sides = World.currentRoom.GetSides();

        if(sides.top) doors.push(0);
        if(sides.left) doors.push(-90);
        if(sides.bottom) doors.push(-180);
        if(sides.right) doors.push(90);


        var s = this.Radius/1000;
        var Scale = s * this.TextureScale;
        var pillarH = 190;
        var pillarR = (this.PillarR - (pillarH * s / 2)) * this.TextureScale;

        var doorH = 160;
        var doorR = (this.DoorR - (doorH * s / 2)) * this.TextureScale;

        var lightH = 26;
        var lightR = (this.lightR - (lightH * s / 2)) * this.TextureScale;

        for(var i in doors)
        {
            var pos = MathHelper.RotatePoint(World.CenterPoint, doors[i], [World.CenterPoint.x, World.CenterPoint.y - doorR]);
            Graphic.DrawRotatedImage(ctx, TextureManager.Get(this.Textures.Door), pos.x - Camera.xView, pos.y-Camera.yView, 114, doorH, Scale, doors[i], 1);
        }


        for(var i in this.Pillars)
        {
            var pos = MathHelper.RotatePoint(World.CenterPoint, this.Pillars[i], [World.CenterPoint.x, World.CenterPoint.y - pillarR]);
            Graphic.DrawRotatedImage(ctx, TextureManager.Get(this.Textures.Pillar), pos.x - Camera.xView, pos.y-Camera.yView, 40, pillarH, Scale, this.Pillars[i], 1);
        }


        for(var i in this.LightSources)
        {
            var pos = MathHelper.RotatePoint(World.CenterPoint, this.LightSources[i], [World.CenterPoint.x, World.CenterPoint.y - lightR]);
            var f_pos = MathHelper.RotatePoint(World.CenterPoint, this.LightSources[i], [World.CenterPoint.x, World.CenterPoint.y - lightR - (23*Scale)]);

            Graphic.DrawRotatedImage(ctx, TextureManager.Get(this.Textures.LightSourceBack), pos.x - Camera.xView, pos.y-Camera.yView, 30, lightH, Scale, this.LightSources[i], 1);

            var speed = 5;
            var frame = Math.floor(this.ageInTicks%(8*speed) / speed);

            Graphic.DrawRotatedAnimatedImage(ctx, frame, 8, 'Y',
                TextureManager.Get(this.Textures.Fire), f_pos.x - Camera.xView, f_pos.y-Camera.yView, 90, 160, Scale*.25, this.LightSources[i], 1);

            Graphic.DrawRotatedImage(ctx, TextureManager.Get(this.Textures.LightSource), pos.x - Camera.xView, pos.y-Camera.yView, 30, lightH, Scale, this.LightSources[i], 1);
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
World.InitializeLocation(TheCastle);