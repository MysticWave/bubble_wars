class EntityFrog extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.FROG.NAME";
		this.Title = "";

		this.MAXHP = 200;
		this.HP = this.MAXHP;
		this.AD = 20;
		this.ATTACK_SPEED = 1.5;
        this.ATTACK_RANGE = 400;
		this.FOLLOW_RANGE = 350;
        this.BULLET_SPEED = 950;
		this.SPD = 130;

        this.isJumping = false;
        this.JumpDuration = .5;
        this.JumpDelay = 3;
        this.JumpDistance = this.SPD * 5;
        this.shakeOnJump = 0;
		

		this.isAggressiveOnHurt = true;
		
		this.HitBox.Scale = .9;

		this.LootTable = new LootTable([]);


		this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		};

        this.Model = new EntityFrogModel(this);
		this.setScale(1);
	}

    setupAI()
    {
        this.AI.Apply(new AI_Jump(false, this.JumpDelay, this.JumpDelay, Player));
		this.AI.Apply(new AI_AttackMelee(Player, 0, 1));
        this.AI.Apply(new AI_Observe(Player, this.JumpDistance * 1.5, function(owner){return owner.aggressive && !owner.isJumping}))
		this.AI.Apply(new AI_Walk());
    }
}













class EntityLakeFrog extends EntityFrog
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.FROG.LAKE.NAME";

		this.MAXHP = 50;
		this.HP = this.MAXHP;
		this.AD = 20;
		this.SPD = 100;

        this.JumpDuration = .5;
        this.JumpDelay = 3;
        this.JumpDistance = this.SPD * 5;
		

		this.LootTable = new LootTable([
			new LootTableItemData("FlowInBottle", 5, 1, 1)
		]);

        this.setupAI();
		this.setScale(1.5);
	}
}
World.RegisterEntity(EntityLakeFrog);



class EntityGreenLakeFrog extends EntityFrog
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.FROG.LAKE.GREEN.NAME";

		this.MAXHP = 50;
		this.HP = this.MAXHP;
		this.AD = 10;
		this.SPD = 100;
		this.ATTACK_SPEED = 1;
		this.FOLLOW_RANGE = 700;
		this.ATTACK_RANGE = 500;
		this.BULLET_SPEED = 5000;

        this.JumpDuration = .5;
        this.JumpDelay = 2;
        this.JumpDistance = this.SPD * 5;
		

		this.LootTable = new LootTable([
			new LootTableItemData("Rifle1", 5, 1, 1)
		]);

		var bulletStats = 
		{
			Type: "BulletFrogTongue",
			Scale: .25,
            damage: this.AD,
			[STAT.ATTACK_RANGE]: this.ATTACK_RANGE-100
		};

		this.aggressive = true;

        this.setupAI();
		this.AI.Apply(new AI_AttackRange(World.Player, bulletStats, {shootTrigger: function(o){return o.isAttackingWithTongue}}));

        this.Model = new EntityFrogModel(this, 'entity.frogo.');

		this.setScale(1.5);
	}

	onJumpEnd()
    {
        this.isAttackingWithTongue = true;
    }

	onJumpStart()
	{
		this.isAttackingWithTongue = false;
	}
}
World.RegisterEntity(EntityGreenLakeFrog);



















class EntityFrogModel extends ModelBase
{
	constructor(owner, textureFamily = 'entity.frog.')
	{
		super(owner, textureFamily);

        this.Scale = 0.125;

		this.Width = 512;
		this.Height = 512;


		var body = new Part(512, 512, 100);
		body.SetTexture("base", 512, 512);
		body.SetTextureRender(0, 1);
		body.SetRotation(0, 256, 256);

		var hand_pivot_left = new Part(20, 115, 100);
		hand_pivot_left.SetTexture("hand", 20, 100);
		hand_pivot_left.SetTextureRender(-2, -2);
		hand_pivot_left.SetRotation(-240, 10, 0);
		hand_pivot_left.visible = false;

		var hand_left_1 = new Part(80, 166, 100);
		hand_left_1.SetTexture("hand.1", 80, 166);
		hand_left_1.SetTextureRender(3, 2);
		hand_left_1.SetRotation(305, 40, 31);

		var hand_left_2 = new Part(80, 166, 100);
		hand_left_2.SetTexture("hand.2", 80, 166);
		hand_left_2.SetTextureRender(2, 3);
		hand_left_2.SetRotation(-285, 40, 31);

		var hand_left_3 = new Part(180, 156, 100);
		hand_left_3.SetTexture("hand.3", 180, 156);
		hand_left_3.SetTextureRender(1, 4);
		hand_left_3.SetRotation(26, 90, 31);

		var hand_pivot_right = new Part(20, 115, 100);
		hand_pivot_right.SetTexture("hand", 20, 100);
		hand_pivot_right.SetTextureRender(-2, -2);
		hand_pivot_right.SetRotation(-120, 10, 0);
		hand_pivot_right.visible = false;

		var hand_right_1 = new Part(80, 166, 100);
		hand_right_1.SetTexture("hand.1", 80, 166);
		hand_right_1.SetTextureRender(6, 2);
		hand_right_1.SetRotation(55, 40, 31);

		var hand_right_2 = new Part(80, 166, 100);
		hand_right_2.SetTexture("hand.2", 80, 166);
		hand_right_2.SetTextureRender(5, 3);
		hand_right_2.SetRotation(-80, 40, 31);

		var hand_right_3 = new Part(180, 156, 100);
		hand_right_3.SetTexture("hand.3", 180, 156);
		hand_right_3.SetTextureRender(4, 4, 0, 0, 0, 0, -1, 1);
		hand_right_3.SetRotation(-16, 90, 31);

		var leg_pivot_left = new Part(20, 200, 100);
		leg_pivot_left.SetTexture("hand", 20, 100);
		leg_pivot_left.SetTextureRender(-2, -2);
		leg_pivot_left.SetRotation(25, 10, 10);
		leg_pivot_left.visible = false;

		var leg_left_1 = new Part(80, 180, 100);
		leg_left_1.SetTexture("leg.1", 80, 180);
		leg_left_1.SetTextureRender(10, 10);
		leg_left_1.SetRotation(-265, 40, 31);

		var leg_left_2 = new Part(80, 200, 100);
		leg_left_2.SetTexture("leg.2", 80, 200);
		leg_left_2.SetTextureRender(9, 11);
		leg_left_2.SetRotation(200, 40, 31);

		var leg_left_3 = new Part(80, 200, 100);
		leg_left_3.SetTexture("leg.3", 80, 200);
		leg_left_3.SetTextureRender(8, 12);
		leg_left_3.SetRotation(-220, 40, 31);

		var leg_left_4 = new Part(180, 156, 100);
		leg_left_4.SetTexture("hand.3", 180, 156);
		leg_left_4.SetTextureRender(7, 4);
		leg_left_4.SetRotation(20, 90, 31);

		var leg_pivot_right = new Part(20, 200, 100);
		leg_pivot_right.SetTexture("hand", 20, 100);
		leg_pivot_right.SetTextureRender(-2, -2);
		leg_pivot_right.SetRotation(-25, 10, 10);
		leg_pivot_right.visible = false;

		var leg_right_1 = new Part(80, 180, 100);
		leg_right_1.SetTexture("leg.1", 80, 180);
		leg_right_1.SetTextureRender(14, 10);
		leg_right_1.SetRotation(-95, 40, 31);

		var leg_right_2 = new Part(80, 200, 100);
		leg_right_2.SetTexture("leg.2", 80, 200);
		leg_right_2.SetTextureRender(13, 11);
		leg_right_2.SetRotation(146, 40, 31);

		var leg_right_3 = new Part(80, 200, 100);
		leg_right_3.SetTexture("leg.3", 80, 200);
		leg_right_3.SetTextureRender(12, 12);
		leg_right_3.SetRotation(-136, 40, 31);

		var leg_right_4 = new Part(180, 156, 100);
		leg_right_4.SetTexture("hand.3", 180, 156);
		leg_right_4.SetTextureRender(11, 4, 0, 0, 0, 0, -1, 1);
		leg_right_4.SetRotation(-20, 90, 31);

		hand_pivot_left.AddChild(hand_left_1);
		hand_left_1.AddChild(hand_left_2);
		hand_left_2.AddChild(hand_left_3);
		hand_pivot_right.AddChild(hand_right_1);
		hand_right_1.AddChild(hand_right_2);
		hand_right_2.AddChild(hand_right_3);
		leg_pivot_left.AddChild(leg_left_1);
		leg_left_1.AddChild(leg_left_2);
		leg_left_2.AddChild(leg_left_3);
		leg_left_3.AddChild(leg_left_4);
		leg_pivot_right.AddChild(leg_right_1);
		leg_right_1.AddChild(leg_right_2);
		leg_right_2.AddChild(leg_right_3);
		leg_right_3.AddChild(leg_right_4);

		this.Parts.body = body;
		this.Parts.hand_pivot_left = hand_pivot_left;
		this.Parts.hand_left_1 = hand_left_1;
		this.Parts.hand_left_2 = hand_left_2;
		this.Parts.hand_left_3 = hand_left_3;
		this.Parts.hand_pivot_right = hand_pivot_right;
		this.Parts.hand_right_1 = hand_right_1;
		this.Parts.hand_right_2 = hand_right_2;
		this.Parts.hand_right_3 = hand_right_3;
		this.Parts.leg_pivot_left = leg_pivot_left;
		this.Parts.leg_left_1 = leg_left_1;
		this.Parts.leg_left_2 = leg_left_2;
		this.Parts.leg_left_3 = leg_left_3;
		this.Parts.leg_left_4 = leg_left_4;
		this.Parts.leg_pivot_right = leg_pivot_right;
		this.Parts.leg_right_1 = leg_right_1;
		this.Parts.leg_right_2 = leg_right_2;
		this.Parts.leg_right_3 = leg_right_3;
		this.Parts.leg_right_4 = leg_right_4;

		this.ApplyArmorModel();
		this.ApplyModelAnimation(EntityFrogAnimationJump);
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






class EntityFrogAnimationJump extends AnimationBase
{
    constructor(model)
    {
        super(model);

        this.Duration = this.Owner.JumpDuration * Main.FPS;

        this.setAnimationSpacing(.3, .8);

        this.triggerFunction = function(anim){return anim.Owner.isJumping;};

        this.Data = 
        [
            new AnimationData('leg_left_1', 'Rotation', 360-265, 25),
            new AnimationData('leg_left_2', 'Rotation', 200, 360-70),
            new AnimationData('leg_left_3', 'Rotation', 360-220, 45),
            new AnimationData('leg_left_4', 'Rotation', 20, 0),


            new AnimationData('leg_right_1', 'Rotation', 360-95, 360-25),
            new AnimationData('leg_right_2', 'Rotation', 160, 70),
            new AnimationData('leg_right_3', 'Rotation', 360-140, 360-45),
            new AnimationData('leg_right_4', 'Rotation', 360-20, 360),

            new AnimationData('hand_right_1', 'Rotation', 55, -20),
            new AnimationData('hand_right_2', 'Rotation', -80, -30),
            new AnimationData('hand_right_3', 'Rotation', -15, 20),

            new AnimationData('hand_left_1', 'Rotation', 305, 360+20),
            new AnimationData('hand_left_2', 'Rotation', 360-280, 30),
            new AnimationData('hand_left_3', 'Rotation', 25, -20)
        ];
    }
}