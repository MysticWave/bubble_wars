class LakeSpiderQueen extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.SPIDER.LAKE.QUEEN.NAME";
		this.description = "ENTITY.SPIDER.LAKE.QUEEN.DESCRIPTION";
		this.Title = "";

        this.defaultRotation = 180;

		this.MAXHP = 2500;
		this.HP = this.MAXHP;
		this.AD = 20;
		this.ATTACK_SPEED = 1.5;
        this.ATTACK_RANGE = 10000;
		this.FOLLOW_RANGE = 9999;
		this.ATTACK_RANGE_MIN = this.FOLLOW_RANGE;
        this.BULLET_SPEED = 950;
		this.SPD = 750;
		

		this.AI.Apply(new AI_AttackMelee(Player, this.AD));
        this.AI.Apply(new AI_Follow(World.Player, true, function(owner){return !owner.isPreparingDash;}));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Observe(World.Player, this.FOLLOW_RANGE, function(owner){return owner.isPreparingDash;}))
		this.AI.Apply(new AI_LayEgg(3, 3, 3, 'EntityLakeEgg', {Scale: 2, entityCount: 9, timeToHatch: 15}, {eggTranslateY: 50}));
		this.AI.Apply(new AI_Boss(this));
		this.AI.Apply(new AI_Enrage(this, 50));


        this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		};

		this.HitBox.Scale = .65;

		var bodyHitBox = new HitBox();
			bodyHitBox.Scale = this.HitBox.Scale * 2.2;
			bodyHitBox.translationY = -0.72;

		this.advancedHitBox.push(bodyHitBox);

        this.BossTheme = "interface.BossFight2";

        this.Model = new SpiderQueenModel(this);
		this.setScale(3);

        this.enragedAnimationDuration = 4 * Main.FPS;
		this.isPreparingDash = false;

		this.invincibleScale = 3;

		this.LootTable = new LootTable([new LootTableItemData('TreasureOrbAquamantula', 100, 1, 1)]);
    }

	Update()
	{
		super.Update();

		if(this.isLayingEgg)
		{
			this.allowMove = false;
			this.allowRotationChange = false;
			this.Rotation = 0;
		}
		else
		{
			this.allowMove = true;
			this.allowRotationChange = true;
		}

		if(this.isEnraged) this.EnrageUpdate();
	}


	Enrage()
    {
		this.isLayingEgg = false;

		this.AI.Apply(new AI_Dash(this, Player, false, 5, 5, {dashMultiplier: 5, dashDuration: 15, dashesInRow: 4, dashesInRowDelay: 20}));
		this.AI.Delete('LayEgg');
    }


    EnrageUpdate()
    {
		if(this.isDashing) this.allowRotationChange = false;
		else this.allowRotationChange = true;

		if(this.toDashProgress >= 80)
		{
			this.allowMove = false;
			this.isPreparingDash = true;
		}
		else
		{
			this.allowMove = true;
			this.isPreparingDash = false;
		}
    }

	onDashCollision()
	{
		var stun_duration = 2;
		ApplyEffect(this, 'Stun', 1, stun_duration);
		this.AI.Dash.setCoolTime(null, stun_duration*Main.FPS);
	}
}
World.RegisterEntity(LakeSpiderQueen);





class SpiderQueenModel extends ModelBase
{
	constructor(owner, textureFamily = '')
	{
		super(owner, textureFamily);

		this.Width = 2048;
		this.Height = 2048;

		this.Scale = 0.125;
		// this.Offset.x = -256;
		// this.Offset.y = -256;

		var body = new Part(512, 512, 100);
		body.SetTexture("entity.spider.queen.base", 512, 512);
		body.SetTextureRender(38, 1);
		body.SetRotation(0, 256, 256);

		var leg_right_3_pivot = new Part(20, 190, 100);
		leg_right_3_pivot.SetTexture("hand", 20, 100);
		leg_right_3_pivot.SetTextureRender(0, 1);
		leg_right_3_pivot.SetRotation(-80, 10, 10);
		leg_right_3_pivot.visible = false;

		var leg_right_4_pivot = new Part(20, 190, 100);
		leg_right_4_pivot.SetTexture("hand", 20, 100);
		leg_right_4_pivot.SetTextureRender(1, 2);
		leg_right_4_pivot.SetRotation(-60, 10, 10);
		leg_right_4_pivot.visible = false;

		var leg_right_2_pivot = new Part(20, 190, 100);
		leg_right_2_pivot.SetTexture("hand", 20, 100);
		leg_right_2_pivot.SetTextureRender(2, 3);
		leg_right_2_pivot.SetRotation(-100, 10, 10);
		leg_right_2_pivot.visible = false;

		var leg_right_1_pivot = new Part(20, 190, 100);
		leg_right_1_pivot.SetTexture("hand", 20, 100);
		leg_right_1_pivot.SetTextureRender(3, 4);
		leg_right_1_pivot.SetRotation(-120, 10, 10);
		leg_right_1_pivot.visible = false;

		var leg_left_1_pivot = new Part(20, 190, 100);
		leg_left_1_pivot.SetTexture("hand", 20, 100);
		leg_left_1_pivot.SetTextureRender(4, 5);
		leg_left_1_pivot.SetRotation(-240, 10, 10);
		leg_left_1_pivot.visible = false;

		var leg_left_2_pivot = new Part(20, 190, 100);
		leg_left_2_pivot.SetTexture("hand", 20, 100);
		leg_left_2_pivot.SetTextureRender(5, 6);
		leg_left_2_pivot.SetRotation(-260, 10, 10);
		leg_left_2_pivot.visible = false;

		var leg_left_3_pivot = new Part(20, 190, 100);
		leg_left_3_pivot.SetTexture("hand", 20, 100);
		leg_left_3_pivot.SetTextureRender(6, 7);
		leg_left_3_pivot.SetRotation(80, 10, 10);
		leg_left_3_pivot.visible = false;

		var leg_left_4_pivot = new Part(20, 190, 100);
		leg_left_4_pivot.SetTexture("hand", 20, 100);
		leg_left_4_pivot.SetTextureRender(7, 8);
		leg_left_4_pivot.SetRotation(60, 10, 10);
		leg_left_4_pivot.visible = false;

		var abdomen_pivot = new Part(20, 170, 100);
		abdomen_pivot.SetTexture("hand", 20, 100);
		abdomen_pivot.SetTextureRender(8, 9);
		abdomen_pivot.SetRotation(-180, 10, 10);
		abdomen_pivot.visible = false;

		var fang_left_pivot = new Part(20, 180, 100);
		fang_left_pivot.SetTexture("hand", 20, 100);
		fang_left_pivot.SetTextureRender(9, 10);
		fang_left_pivot.SetRotation(15, 10, 10);
		fang_left_pivot.visible = false;

		var abdomen = new Part(1024, 1024, 100);
		abdomen.SetTexture("entity.spider.queen.abdomen", 512, 512);
		abdomen.SetTextureRender(10, 11, 0, 0, 0, 0, -1, -1);
		abdomen.SetRotation(0, 512, 100);

		var fang_right_pivot = new Part(20, 180, 100);
		fang_right_pivot.SetTexture("hand", 20, 100);
		fang_right_pivot.SetTextureRender(11, 12);
		fang_right_pivot.SetRotation(-15, 10, 10);
		fang_right_pivot.visible = false;

		var fang_left = new Part(50, 100, 100);
		fang_left.SetTexture("entity.spider.fang.left", 50, 100);
		fang_left.SetTextureRender(12, 13);
		fang_left.SetRotation(-15, 25, 10);

		var fang_right = new Part(50, 100, 100);
		fang_right.SetTexture("entity.spider.fang.right", 50, 100);
		fang_right.SetTextureRender(13, 14);
		fang_right.SetRotation(15, 25, 10);

		var leg_4_1 = new Part(40, 460, 100);
		leg_4_1.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_4_1.SetTextureRender(14, 15, 0, 0, 0, 0, -1, -1);
		leg_4_1.SetRotation(30, 20, 10);

		var leg_4_2 = new Part(40, 460, 100);
		leg_4_2.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_4_2.SetTextureRender(15, 16, 0, 0, 0, 0, -1, 1);
		leg_4_2.SetRotation(15, 20, 10);

		var leg_4_3 = new Part(40, 460, 100);
		leg_4_3.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_4_3.SetTextureRender(16, 17, 0, 0, 0, 0, -1, -1);
		leg_4_3.SetRotation(-15, 20, 10);

		var leg_3_1 = new Part(40, 345, 100);
		leg_3_1.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_3_1.SetTextureRender(17, 18, 0, 0, 0, 0, -1, -1);
		leg_3_1.SetRotation(25, 20, 10);

		var leg_3_2 = new Part(40, 345, 100);
		leg_3_2.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_3_2.SetTextureRender(18, 19, 0, 0, 0, 0, -1, 1);
		leg_3_2.SetRotation(20, 20, 10);

		var leg_3_3 = new Part(40, 345, 100);
		leg_3_3.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_3_3.SetTextureRender(19, 20, 0, 0, 0, 0, -1, -1);
		leg_3_3.SetRotation(-20, 20, 10);

		var leg_2_1 = new Part(40, 345, 100);
		leg_2_1.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_2_1.SetTextureRender(20, 21, 0, 0, 0, 0, -1, -1);
		leg_2_1.SetRotation(-25, 20, 10);

		var leg_2_2 = new Part(40, 345, 100);
		leg_2_2.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_2_2.SetTextureRender(21, 22, 0, 0, 0, 0, -1, 1);
		leg_2_2.SetRotation(-20, 20, 10);

		var leg_2_3 = new Part(40, 345, 100);
		leg_2_3.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_2_3.SetTextureRender(22, 23, 0, 0, 0, 0, -1, -1);
		leg_2_3.SetRotation(20, 20, 10);

		var leg_1_1 = new Part(40, 460, 100);
		leg_1_1.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_1_1.SetTextureRender(23, 24, 0, 0, 0, 0, -1, -1);
		leg_1_1.SetRotation(-20, 20, 10);

		var leg_1_2 = new Part(40, 460, 100);
		leg_1_2.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_1_2.SetTextureRender(24, 25, 0, 0, 0, 0, -1, 1);
		leg_1_2.SetRotation(-25, 20, 10);

		var leg_1_3 = new Part(40, 460, 100);
		leg_1_3.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_1_3.SetTextureRender(25, 26, 0, 0, 0, 0, -1, -1);
		leg_1_3.SetRotation(15, 20, 10);

		var leg_8_1 = new Part(40, 460, 100);
		leg_8_1.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_8_1.SetTextureRender(26, 27, 0, 0, 0, 0, 1, -1);
		leg_8_1.SetRotation(20, 20, 10);

		var leg_8_2 = new Part(40, 460, 100);
		leg_8_2.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_8_2.SetTextureRender(27, 28);
		leg_8_2.SetRotation(25, 20, 10);

		var leg_8_3 = new Part(40, 460, 100);
		leg_8_3.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_8_3.SetTextureRender(28, 29, 0, 0, 0, 0, 1, -1);
		leg_8_3.SetRotation(-15, 20, 10);

		var leg_7_1 = new Part(40, 345, 100);
		leg_7_1.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_7_1.SetTextureRender(29, 30, 0, 0, 0, 0, 1, -1);
		leg_7_1.SetRotation(25, 20, 10);

		var leg_7_2 = new Part(40, 345, 100);
		leg_7_2.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_7_2.SetTextureRender(30, 31);
		leg_7_2.SetRotation(20, 20, 10);

		var leg_7_3 = new Part(40, 345, 100);
		leg_7_3.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_7_3.SetTextureRender(31, 32, 0, 0, 0, 0, 1, -1);
		leg_7_3.SetRotation(-20, 20, 10);

		var leg_6_1 = new Part(40, 345, 100);
		leg_6_1.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_6_1.SetTextureRender(32, 33, 0, 0, 0, 0, 1, -1);
		leg_6_1.SetRotation(-25, 20, 10);

		var leg_6_2 = new Part(40, 345, 100);
		leg_6_2.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_6_2.SetTextureRender(33, 34);
		leg_6_2.SetRotation(-20, 20, 10);

		var leg_6_3 = new Part(40, 345, 100);
		leg_6_3.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_6_3.SetTextureRender(34, 35, 0, 0, 0, 0, 1, -1);
		leg_6_3.SetRotation(20, 20, 10);

		var leg_5_1 = new Part(40, 460, 100);
		leg_5_1.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_5_1.SetTextureRender(35, 36, 0, 0, 0, 0, 1, -1);
		leg_5_1.SetRotation(-29, 20, 10);

		var leg_5_2 = new Part(40, 460, 100);
		leg_5_2.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_5_2.SetTextureRender(36, 37);
		leg_5_2.SetRotation(-15, 20, 10);

		var leg_5_3 = new Part(40, 460, 100);
		leg_5_3.SetTexture("entity.spider.queen.leg", 40, 230);
		leg_5_3.SetTextureRender(37, 38, 0, 0, 0, 0, 1, -1);
		leg_5_3.SetRotation(15, 20, 10);

		body.AddChild(leg_right_3_pivot);
		body.AddChild(leg_right_4_pivot);
		body.AddChild(leg_right_2_pivot);
		body.AddChild(leg_right_1_pivot);
		body.AddChild(leg_left_1_pivot);
		body.AddChild(leg_left_2_pivot);
		body.AddChild(leg_left_3_pivot);
		body.AddChild(leg_left_4_pivot);
		body.AddChild(abdomen_pivot);
		body.AddChild(fang_left_pivot);
		abdomen_pivot.AddChild(abdomen);
		body.AddChild(fang_right_pivot);
		fang_left_pivot.AddChild(fang_left);
		fang_right_pivot.AddChild(fang_right);
		leg_right_4_pivot.AddChild(leg_4_1);
		leg_4_1.AddChild(leg_4_2);
		leg_4_2.AddChild(leg_4_3);
		leg_right_3_pivot.AddChild(leg_3_1);
		leg_3_1.AddChild(leg_3_2);
		leg_3_2.AddChild(leg_3_3);
		leg_right_2_pivot.AddChild(leg_2_1);
		leg_2_1.AddChild(leg_2_2);
		leg_2_2.AddChild(leg_2_3);
		leg_right_1_pivot.AddChild(leg_1_1);
		leg_1_1.AddChild(leg_1_2);
		leg_1_2.AddChild(leg_1_3);
		leg_left_1_pivot.AddChild(leg_8_1);
		leg_8_1.AddChild(leg_8_2);
		leg_8_2.AddChild(leg_8_3);
		leg_left_2_pivot.AddChild(leg_7_1);
		leg_7_1.AddChild(leg_7_2);
		leg_7_2.AddChild(leg_7_3);
		leg_left_3_pivot.AddChild(leg_6_1);
		leg_6_1.AddChild(leg_6_2);
		leg_6_2.AddChild(leg_6_3);
		leg_left_4_pivot.AddChild(leg_5_1);
		leg_5_1.AddChild(leg_5_2);
		leg_5_2.AddChild(leg_5_3);

		this.Parts.body = body;
		this.Parts.leg_right_3_pivot = leg_right_3_pivot;
		this.Parts.leg_right_4_pivot = leg_right_4_pivot;
		this.Parts.leg_right_2_pivot = leg_right_2_pivot;
		this.Parts.leg_right_1_pivot = leg_right_1_pivot;
		this.Parts.leg_left_1_pivot = leg_left_1_pivot;
		this.Parts.leg_left_2_pivot = leg_left_2_pivot;
		this.Parts.leg_left_3_pivot = leg_left_3_pivot;
		this.Parts.leg_left_4_pivot = leg_left_4_pivot;
		this.Parts.abdomen_pivot = abdomen_pivot;
		this.Parts.fang_left_pivot = fang_left_pivot;
		this.Parts.abdomen = abdomen;
		this.Parts.fang_right_pivot = fang_right_pivot;
		this.Parts.fang_left = fang_left;
		this.Parts.fang_right = fang_right;
		this.Parts.leg_4_1 = leg_4_1;
		this.Parts.leg_4_2 = leg_4_2;
		this.Parts.leg_4_3 = leg_4_3;
		this.Parts.leg_3_1 = leg_3_1;
		this.Parts.leg_3_2 = leg_3_2;
		this.Parts.leg_3_3 = leg_3_3;
		this.Parts.leg_2_1 = leg_2_1;
		this.Parts.leg_2_2 = leg_2_2;
		this.Parts.leg_2_3 = leg_2_3;
		this.Parts.leg_1_1 = leg_1_1;
		this.Parts.leg_1_2 = leg_1_2;
		this.Parts.leg_1_3 = leg_1_3;
		this.Parts.leg_8_1 = leg_8_1;
		this.Parts.leg_8_2 = leg_8_2;
		this.Parts.leg_8_3 = leg_8_3;
		this.Parts.leg_7_1 = leg_7_1;
		this.Parts.leg_7_2 = leg_7_2;
		this.Parts.leg_7_3 = leg_7_3;
		this.Parts.leg_6_1 = leg_6_1;
		this.Parts.leg_6_2 = leg_6_2;
		this.Parts.leg_6_3 = leg_6_3;
		this.Parts.leg_5_1 = leg_5_1;
		this.Parts.leg_5_2 = leg_5_2;
		this.Parts.leg_5_3 = leg_5_3;

		this.ApplyArmorModel();
		this.ApplyModelAnimation(SpiderQueenFangsAnimation);
		this.ApplyModelAnimation(SpiderQueenAbdomenAnimation);
		this.ApplyModelAnimation(SpiderQueenWalkAnimation);
		this.ApplyModelAnimation(SpiderQueenLayAnimation);
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










class SpiderQueenFangsAnimation extends AnimationBase
{
    constructor(model)
    {
        super(model);

        this.setAnimationDuration((150 / this.Owner.SPD) * Main.FPS);
        this.iterations = 'INFINITE';

        this.setAnimationSpacing(.45, .55);

        // this.triggerFunction = function(anim){return anim.Owner.isJumping;};

        this.Data = 
        [
            new AnimationData('fang_left', 'Rotation', -5, -30),
            new AnimationData('fang_right', 'Rotation', 5, 30)
        ];
    }
}


class SpiderQueenAbdomenAnimation extends AnimationBase
{
    constructor(model)
    {
        super(model);

        this.setAnimationDuration(.5 * Main.FPS);
        this.iterations = 'INFINITE';

        this.setAnimationSpacing(.45, .55);

        this.Data = 
        [
            new AnimationData('abdomen', 'Transform.y', 100, 90)
        ];
    }
}







class SpiderQueenWalkAnimation extends AnimationBase
{
    constructor(model)
    {
        super(model);

        this.setAnimationDuration((150 / this.Owner.SPD) * Main.FPS * 1.5);
        this.iterations = 'INFINITE';

        this.setAnimationSpacing(.5, .5);

        this.triggerFunction = function(anim){return anim.Owner.isMoving() && !anim.Owner.isLayingEgg;};

        this.Data = 
        [
            new AnimationData('leg_2_1', 'Rotation', -25, -15, 1),
            new AnimationData('leg_3_1', 'Rotation', 25, 15),
            new AnimationData('leg_6_1', 'Rotation', -25, -15),
            new AnimationData('leg_7_1', 'Rotation', 25, 15),


            new AnimationData('leg_1_1', 'Transform.y', 100, 50, 1),
            new AnimationData('leg_1_2', 'Transform.y', 100, 50, 1),
            new AnimationData('leg_1_3', 'Transform.y', 100, 50, 1),

            new AnimationData('leg_2_1', 'Transform.y', 100, 75, -1),
            new AnimationData('leg_2_2', 'Transform.y', 100, 75, -1),
            new AnimationData('leg_2_3', 'Transform.y', 100, 75, -1),

            new AnimationData('leg_3_1', 'Transform.y', 100, 75, 1),
            new AnimationData('leg_3_2', 'Transform.y', 100, 75, 1),
            new AnimationData('leg_3_3', 'Transform.y', 100, 75, 1),

            new AnimationData('leg_4_1', 'Transform.y', 100, 50, -1),
            new AnimationData('leg_4_2', 'Transform.y', 100, 50, -1),
            new AnimationData('leg_4_3', 'Transform.y', 100, 50, -1),

            new AnimationData('leg_5_1', 'Transform.y', 100, 50, 1),
            new AnimationData('leg_5_2', 'Transform.y', 100, 50, 1),
            new AnimationData('leg_5_3', 'Transform.y', 100, 50, 1),

            new AnimationData('leg_6_1', 'Transform.y', 100, 75, -1),
            new AnimationData('leg_6_2', 'Transform.y', 100, 75, -1),
            new AnimationData('leg_6_3', 'Transform.y', 100, 75, -1),

            new AnimationData('leg_7_1', 'Transform.y', 100, 75, 1),
            new AnimationData('leg_7_2', 'Transform.y', 100, 75, 1),
            new AnimationData('leg_7_3', 'Transform.y', 100, 75, 1),

            new AnimationData('leg_8_1', 'Transform.y', 100, 50, -1),
            new AnimationData('leg_8_2', 'Transform.y', 100, 50, -1),
            new AnimationData('leg_8_3', 'Transform.y', 100, 50, -1)
        ];
    }

	// getAnimationDuration()
	// {
	// 	return ((150 / this.Owner.getSPD()) * Main.FPS * 1.5);
	// }
}








class SpiderQueenLayAnimation extends AnimationBase
{
    constructor(model)
    {
        super(model);

        this.setAnimationDuration(3 * Main.FPS / 10);
        this.iterations = 'INFINITE';

        this.setAnimationSpacing(.4, .6);

        this.triggerFunction = function(anim){return anim.Owner.isLayingEgg;};

        this.Data = 
        [
            new AnimationData('leg_1_1', 'Rotation', -30, -25, 1),
            new AnimationData('leg_1_2', 'Rotation', -30, -40, 1),
            new AnimationData('leg_1_3', 'Rotation', -30, -60, 1),

            new AnimationData('leg_2_1', 'Rotation', -20, 15, -1),
            new AnimationData('leg_2_2', 'Rotation', 60, 100, -1),
            new AnimationData('leg_2_3', 'Rotation', 65, 90, -1),

            new AnimationData('leg_3_1', 'Rotation', -30, 15, 1),
            new AnimationData('leg_3_2', 'Rotation', 60, 100, 1),
            new AnimationData('leg_3_3', 'Rotation', 65, 60, 1),

            new AnimationData('leg_4_1', 'Rotation', -30, -10, -1),
            new AnimationData('leg_4_2', 'Rotation', 60, 100, -1),
            new AnimationData('leg_4_3', 'Rotation', 65, 110, -1),

            new AnimationData('leg_5_1', 'Rotation', 30, 10, 1),
            new AnimationData('leg_5_2', 'Rotation', -60, -100, 1),
            new AnimationData('leg_5_3', 'Rotation', -65, -60, 1),

            new AnimationData('leg_6_1', 'Rotation', 30, -15, -1),
            new AnimationData('leg_6_2', 'Rotation', -60, -100, -1),
            new AnimationData('leg_6_3', 'Rotation', -65, -90, -1),

            new AnimationData('leg_7_1', 'Rotation', 20, -35, 1),
            new AnimationData('leg_7_2', 'Rotation', -60, -100, 1),
            new AnimationData('leg_7_3', 'Rotation', -65, -110, 1),

            new AnimationData('leg_8_1', 'Rotation', 30, 25, -1),
            new AnimationData('leg_8_2', 'Rotation', 30, 40, -1),
            new AnimationData('leg_8_3', 'Rotation', 30, 60, -1)
        ];
    }
}


