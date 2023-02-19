class EntityTadpole extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.TADPOLE.NAME";
		this.Title = "";

        this.Texture = 'entity.tadpole.base';
        this.TextureTail = 'entity.tadpole.tail';
        this.TailFrames = 12;
        this.TailAnimation = new Transition(0, this.TailFrames -1, .25, false, 0, 0, true);

		this.MAXHP = 100;
		this.HP = this.MAXHP;
		this.AD = 10;
		this.ATTACK_SPEED = 1.5;
        this.ATTACK_RANGE = 400;
		this.FOLLOW_RANGE = 1000;
        this.BULLET_SPEED = 950;
		this.SPD = 500;

		this.isAggressiveOnHurt = true;
	

		this.AI.Apply(new AI_Follow(World.Player, true));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Wander(true, 1, 2));
		this.AI.Apply(new AI_AttackMelee(Player, 0, 1));


        this.HitBox.Scale = .9;

		this.LootTable = new LootTable([]);

		this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		};

		this.setScale(1);
	}

    RenderTexture(context)
    {
        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;
        var height = this.height;
        var width = this.width;

        var rotation = this.Rotation;
        var scale = this.Scale;
        var alpha = this.Transparency;

        var textureBase = TextureManager.Get(this.Texture);
        var baseRotation = rotation + this.TextureRotation;

        var TextureTail = TextureManager.Get(this.TextureTail);
        var frame = this.TailAnimation.Update();

        Graphic.DrawRotatedAnimatedImage(context, frame, this.TailFrames, 'X', 
            TextureTail, x, y, width, height * 2, scale, baseRotation, alpha, 0, -height * 1.37);

        Graphic.DrawRotatedImage(context, textureBase, x, y, width, height, scale, baseRotation, alpha);
    }
}



class EntityLakeTadpole extends EntityTadpole
{
    constructor(x, y)
    {
        super(x, y);

        this.name = "ENTITY.TADPOLE.LAKE.NAME";
        this.Texture = 'entity.tadpole.blue.base';
        this.TextureTail = 'entity.tadpole.blue.tail';

		this.MAXHP = 25;
		this.HP = this.MAXHP;
		this.AD = 10;
		this.ATTACK_SPEED = 1.5;
		this.FOLLOW_RANGE = 700;
		this.SPD = 500;


		this.LootTable = new LootTable([]);

        this.timeToGrow = MathHelper.randomInRange(60, 120) * Main.FPS;
		this.minScale = .5;
		this.maxScale = 1;

        this.setScale(this.minScale);
    }

    Update()
	{
		super.Update();

		var growProgress = this.ageInTicks / this.timeToGrow;
		var scaleStep = this.maxScale - this.minScale;
		var new_scale = Math.round((this.minScale + (scaleStep * growProgress)) * 10) / 10;

		if(this.baseScale < new_scale) this.setScale(new_scale);

		if(growProgress >= 1) this.Grow();
	}

	Grow()
	{
		var largeVersion = new EntityLakeFrog();
			largeVersion.x = this.x;
			largeVersion.y = this.y;
			largeVersion.Rotation = this.Rotation;

		World.AddEntity(largeVersion);
		World.Kill(this);
	}
}
World.RegisterEntity(EntityLakeTadpole);



