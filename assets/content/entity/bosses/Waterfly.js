class Waterfly extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.WATERFLY.NAME";
		this.Title = "";

		this.MAXHP = 1500;
		this.HP = this.MAXHP;
		this.AD = 1;
		this.ATTACK_SPEED = 5;
        this.ATTACK_RANGE = 10000;
		this.FOLLOW_RANGE = 9999;
		// this.ATTACK_RANGE_MIN = this.FOLLOW_RANGE;
        this.BULLET_SPEED = 1000;
		this.SPD = 600;
        this.BULLETS_COUNT = 3;
        this.shootDuration = 5;
        this.dashed = false;
        this.Rotation = 180;
		

        // this.AI.Apply(new AI_Follow(World.Player, false));
		this.AI.Apply(new AI_AttackMelee(Player, 0, 20));
		this.AI.Apply(new AI_Walk());
        this.AI.Apply(new AI_AttackRange(World.Player, {Scale: 1.5}, {shootTrigger: function(o){return o.canShoot}}));
		this.AI.Apply(new AI_Observe(World.Player, this.FOLLOW_RANGE, function(owner){return (owner.canShoot && !owner.isDashing) || !owner.dashed;}))
		this.AI.Apply(new AI_Boss(this));
		this.AI.Apply(new AI_Enrage(this, 50));
        this.AI.Apply(new AI_Dash(this, Player, false, this.shootDuration, this.shootDuration, {dashMultiplier: 5, dashDuration: 25, dashesInRow: 1, dashesInRowDelay: 10}));


        this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		};

		this.HitBox.Scale = .5;
        this.canShoot = true;

        this.BossTheme = "interface.BossFight2";

        this.Model = new ModelWaterfly(this);
		this.setScale(7);

        this.enragedAnimationDuration = 4 * Main.FPS;

		this.invincibleScale = 1.5;

		this.LootTable = new LootTable([new LootTableItemData('TreasureOrbWaterfly', 100, 1, 1)]);

        this.TwisterDuration = 60;
        this.TwisterSlowDuration = 5;
        this.TwisterSlowStrength = 25;
    }

    onDashEnd()
    {
        this.canShoot = true;
    }

    onDashStart()
    {
        this.canShoot = false;
        this.dashed = true;

        if(this.isEnraged) this.SummonTwister();
    }

    SummonTwister()
    {
		var angle = this.AI.Dash.dashAngle;
        var target = MathHelper.lineToAngle([this.x, this.y], 9999, angle);

        var stats = {};
            stats.damage = this.AD * 20;
            stats.timeToDespawn = this.TwisterDuration * Main.FPS;
            stats.SlowDuration = this.TwisterSlowDuration;
            stats.SlowStrength = this.TwisterSlowStrength;
            stats.Scale = 5;
        
        var bullet = new BulletWaterTwister(this.x, this.y, stats);
            bullet.Shoot(this, target);
            
        World.AddProjectile(bullet);
    }

	Enrage()
    {
        this.ATTACK_SPEED = 10;
        // this.BULLET_SPEED = 1200;
        this.BULLETS_COUNT = 5;
        this.shootDuration = 2.5;

        this.AI.Dash.coolTimeMin = this.shootDuration;
        this.AI.Dash.coolTimeMax = this.shootDuration;
    }
}
World.RegisterEntity(Waterfly);





class ModelWaterfly extends ModelBase
{
	constructor(owner)
	{
		super(owner);

		this.Width = 1024;
		this.Height = 700;

        this.Scale = 0.125;

		// this.Offset.x = -512;
		// this.Offset.y = -130;

		var base = new Part(256, 256, 100);
		base.SetTexture("entity.waterfly.base", 256, 256);
		base.SetTextureRender(1, 0);
		base.SetRotation(0, 128, 120);

		var tail_pivot = new Part(20, 130, 100);
		tail_pivot.SetTexture("hand", 20, 100);
		tail_pivot.SetTextureRender(2, 1);
		tail_pivot.SetRotation(0, 10, 10);
		tail_pivot.visible = false;

		var tail_1 = new Part(54, 54, 100);
		tail_1.SetTexture("entity.waterfly.tail", 54, 54);
		tail_1.SetTextureRender(3, 2);
		tail_1.SetRotation(0, 27, 5);

		var tail_2 = new Part(54, 54, 100);
		tail_2.SetTexture("entity.waterfly.tail", 54, 54);
		tail_2.SetTextureRender(4, 3);
		tail_2.SetRotation(0, 27, 5);

		var tail_3 = new Part(50, 50, 100);
		tail_3.SetTexture("entity.waterfly.tail", 54, 54);
		tail_3.SetTextureRender(5, 4);
		tail_3.SetRotation(0, 25, 5);

		var tail_4 = new Part(50, 50, 100);
		tail_4.SetTexture("entity.waterfly.tail", 54, 54);
		tail_4.SetTextureRender(6, 5);
		tail_4.SetRotation(0, 25, 5);

		var tail_5 = new Part(50, 50, 100);
		tail_5.SetTexture("entity.waterfly.tail", 54, 54);
		tail_5.SetTextureRender(7, 6);
		tail_5.SetRotation(0, 25, 5);

		var tail_6 = new Part(44, 44, 100);
		tail_6.SetTexture("entity.waterfly.tail", 54, 54);
		tail_6.SetTextureRender(8, 7);
		tail_6.SetRotation(0, 22, 5);

		var tail_7 = new Part(44, 44, 100);
		tail_7.SetTexture("entity.waterfly.tail", 54, 54);
		tail_7.SetTextureRender(9, 8);
		tail_7.SetRotation(0, 22, 5);

		var tail_8 = new Part(44, 44, 100);
		tail_8.SetTexture("entity.waterfly.tail", 54, 54);
		tail_8.SetTextureRender(10, 9);
		tail_8.SetRotation(0, 22, 5);

		var tail_9 = new Part(36, 36, 100);
		tail_9.SetTexture("entity.waterfly.tail", 54, 54);
		tail_9.SetTextureRender(11, 10);
		tail_9.SetRotation(0, 18, 5);

		var tail_10 = new Part(36, 36, 100);
		tail_10.SetTexture("entity.waterfly.tail", 54, 54);
		tail_10.SetTextureRender(12, 11);
		tail_10.SetRotation(0, 18, 5);

		var tail_11 = new Part(36, 36, 100);
		tail_11.SetTexture("entity.waterfly.tail", 54, 54);
		tail_11.SetTextureRender(13, 12);
		tail_11.SetRotation(0, 18, 5);

		var wing_pivot_left_1 = new Part(20, 54, 100);
		wing_pivot_left_1.SetTexture("hand", 20, 100);
		wing_pivot_left_1.SetTextureRender(14, 13);
		wing_pivot_left_1.SetRotation(62, 10, 10);
		wing_pivot_left_1.visible = false;

		var wing_pivot_right_1 = new Part(20, 54, 100);
		wing_pivot_right_1.SetTexture("hand", 20, 100);
		wing_pivot_right_1.SetTextureRender(15, 14);
		wing_pivot_right_1.SetRotation(-62, 10, 10);
		wing_pivot_right_1.visible = false;

		var wing_pivot_left_2waterfly = new Part(20, 76, 100);
		wing_pivot_left_2waterfly.SetTexture("hand", 20, 100);
		wing_pivot_left_2waterfly.SetTextureRender(16, 15);
		wing_pivot_left_2waterfly.SetRotation(31, 10, 10);
		wing_pivot_left_2waterfly.visible = false;

		var wing_pivot_right_2 = new Part(20, 76, 100);
		wing_pivot_right_2.SetTexture("hand", 20, 100);
		wing_pivot_right_2.SetTextureRender(17, 16);
		wing_pivot_right_2.SetRotation(-31, 10, 10);
		wing_pivot_right_2.visible = false;

		var wing_right_1 = new Part(500, 150, 100);
		wing_right_1.SetTexture("entity.waterfly.wing", 500, 150);
		wing_right_1.SetTextureRender(18, 17);
		wing_right_1.SetRotation(52, 10, 90);
		wing_right_1.Axis = "x";

		var wing_right_2 = new Part(500, 150, 100);
		wing_right_2.SetTexture("entity.waterfly.wing", 500, 150);
		wing_right_2.SetTextureRender(19, 18);
		wing_right_2.SetRotation(52, 10, 90);
		wing_right_2.Axis = "x";

		var wing_left_1 = new Part(500, 150, 100);
		wing_left_1.SetTexture("entity.waterfly.wing", 500, 150);
		wing_left_1.SetTextureRender(21, 19, 0, 0, 0, 0, -1, 1);
		wing_left_1.SetRotation(-52, 10, 90);
		wing_left_1.Axis = "x";

		var wing_left_2 = new Part(500, 150, 100);
		wing_left_2.SetTexture("entity.waterfly.wing", 500, 150);
		wing_left_2.SetTextureRender(20, 20, 0, 0, 0, 0, -1, 1);
		wing_left_2.SetRotation(-52, 10, 90);
		wing_left_2.Axis = "x";

		var tail_end = new Part(36, 24, 100);
		tail_end.SetTexture("entity.waterfly.tail.end", 55, 36);
		tail_end.SetTextureRender(0, -1);
		tail_end.SetRotation(0, 18, 0);

		base.AddChild(tail_pivot);
		tail_pivot.AddChild(tail_1);
		tail_1.AddChild(tail_2);
		tail_2.AddChild(tail_3);
		tail_3.AddChild(tail_4);
		tail_4.AddChild(tail_5);
		tail_5.AddChild(tail_6);
		tail_6.AddChild(tail_7);
		tail_7.AddChild(tail_8);
		tail_8.AddChild(tail_9);
		tail_9.AddChild(tail_10);
		tail_10.AddChild(tail_11);
		base.AddChild(wing_pivot_left_1);
		base.AddChild(wing_pivot_right_1);
		base.AddChild(wing_pivot_left_2waterfly);
		base.AddChild(wing_pivot_right_2);
		wing_pivot_right_1.AddChild(wing_right_1);
		wing_pivot_right_2.AddChild(wing_right_2);
		wing_pivot_left_2waterfly.AddChild(wing_left_1);
		wing_pivot_left_1.AddChild(wing_left_2);
		tail_11.AddChild(tail_end);

		this.Parts.base = base;
		this.Parts.tail_pivot = tail_pivot;
		this.Parts.tail_1 = tail_1;
		this.Parts.tail_2 = tail_2;
		this.Parts.tail_3 = tail_3;
		this.Parts.tail_4 = tail_4;
		this.Parts.tail_5 = tail_5;
		this.Parts.tail_6 = tail_6;
		this.Parts.tail_7 = tail_7;
		this.Parts.tail_8 = tail_8;
		this.Parts.tail_9 = tail_9;
		this.Parts.tail_10 = tail_10;
		this.Parts.tail_11 = tail_11;
		this.Parts.wing_pivot_left_1 = wing_pivot_left_1;
		this.Parts.wing_pivot_right_1 = wing_pivot_right_1;
		this.Parts.wing_pivot_left_2waterfly = wing_pivot_left_2waterfly;
		this.Parts.wing_pivot_right_2 = wing_pivot_right_2;
		this.Parts.wing_right_1 = wing_right_1;
		this.Parts.wing_right_2 = wing_right_2;
		this.Parts.wing_left_1 = wing_left_1;
		this.Parts.wing_left_2 = wing_left_2;
		this.Parts.tail_end = tail_end;

		this.ApplyArmorModel();
		this.ApplyModelAnimation(WaterflyWalkAnimation);
	}

	Update()
	{
		super.Update();
	}

	Render(context)
	{
		super.Render(context);
	}
}




class WaterflyWalkAnimation extends AnimationBase
{
    constructor(model)
    {
        super(model);

        this.setAnimationDuration(5);
        this.iterations = 'INFINITE';

        this.setAnimationSpacing(.5, .5);

        this.Data = 
        [
            new AnimationData('wing_right_1', 'Transform.x', 100, 30, 1),
            new AnimationData('wing_right_2', 'Transform.x', 100, 30, -1),

            new AnimationData('wing_left_1', 'Transform.x', 100, 30, -1),
            new AnimationData('wing_left_2', 'Transform.x', 100, 30, 1),
        ];
    }
}

