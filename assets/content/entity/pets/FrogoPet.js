class FrogoPet extends Frogo
{
	constructor(x, y)
	{
		super(x, y, false);
		
		this.name = "ENTITY.FROGO.PET.NAME";

		this.AD = 10;
		this.SPD = 100;

        this.ATTACK_SPEED = 2;
        this.BULLET_SPEED = 6000;
        this.maxDistanceFromPlayer = 600;

        this.JumpDuration = .5;
        this.JumpDelay = 2;
        this.JumpDistance = this.SPD * 5;
        this.shakeOnJump = 0;
        this.knockBackResistance = 1;

        this.isFromPlayer = true;
        this.isBoss = false;
        this.isHurtAble = false;


        this.jumpDelays = {normal: 2, hurry: 1};

        // var bulletStats = 
		// {
		// 	Type: "BulletFrogTongue",
		// 	Scale: .1,
        //     damage: 0
		// };

        this.AI = new AI(this);

        this.AI.Apply(new AI_Jump(false, this.JumpDelay, this.JumpDelay, Entity, {focusPlayerOnPeaceful: true}));
		this.AI.Apply(new AI_AttackMelee(Entity, 0, 1));
        this.AI.Apply(new AI_Observe(Entity, this.JumpDistance, function(owner){return !owner.isJumping}));
		this.AI.Apply(new AI_Walk());
        // this.AI.Apply(new AI_AttackRange(Entity, bulletStats, {returnDeepInside: false, shootTrigger: function(o){return !o.isJumping}}));

        this.Model = new EntityFrogModel(this, 'entity.frogo.');

        this.defaultScale = 1;
        this.setScale(this.defaultScale);  

        this.LootTable = new LootTable([]);
        this.Immunity.ALL = true;
	}

    Update()
	{
		super.Update();

        if(!this.quote) this.quote = this.getDisplayName();

		var hide_time = Main.FPS * .5;
		var p = 0;
        var player = World.Player;
        var d = this.maxDistanceFromPlayer;

		if(World.isChangingLocation)
		{
			//hide when changing location
			p = 1 - (World.currentChangeTime / hide_time);
			if(p < 0) p = 0;
			this.Transparency = p;

            d /= 1000;

            if(p==0)
            {
                this.x = player.x;
                this.y = player.y;
            }
		}
		else
		{
			p = (World.timeSinceRoomChange / hide_time);
			if(p > 1) p = 1;

			this.Transparency = p;
		}

        if(MathHelper.GetDistance(this, World.Player) > d) 
        {
            this.AI.Jump.focus = Player;
            this.JumpDelay = this.jumpDelays.hurry;
            //tp to player if cannot jump to him
            if(MathHelper.GetDistance(this, World.CenterPoint) > World.Radius)
            {
                this.x = player.x;
                this.y = player.y;
            }
        }
        else 
        {
            this.AI.Jump.focus = Entity;
            this.JumpDelay = this.jumpDelays.normal;
        }
	}
}
World.RegisterEntity(FrogoPet);