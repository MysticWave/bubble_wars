class TrapSpikes extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.AD = 20;
		this.ATTACK_SPEED = .25;
		this.ATTACK_RANGE = 1000;
		this.FOLLOW_RANGE = 1000;
		this.Texture = "entity.trap.spikes";
		this.TextureOpen = "entity.trap.spikes.open";
		
		this.HitBox.Scale = 1;

        this.AI.Apply(new AI_AttackMelee(Player, this.AD));

		this.LootTable = new LootTable([]);
        this.isOpen = false;
        this.openAt = 0;

        this.isHurtAble = false;
        this.mustBeKilled = false;
        this.Immunity.ALL = true;
		this.hideOnRadar = true;

		this.setScale(3);
	}

    onMeleeAttack()
    {
        this.isOpen = true;
        this.openAt = this.ageInTicks;
    }
	
	Update()
	{
		super.Update();
		
        if(this.isOpen)
        {
            var time = Main.FPS / this.ATTACK_SPEED;
            if(this.ageInTicks - this.openAt >= time / 4) this.isOpen = false;
        }
	}

    RenderTexture(context)
    {
        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;

        var w = this.width;
        var h = this.height;

        Graphic.DrawRotatedImage(context, TextureManager.Get(this.Texture), x, y, w, h, this.Scale, 0, .25);
        if(this.isOpen) Graphic.DrawRotatedImage(context, TextureManager.Get(this.TextureOpen), x, y, w, h, this.Scale * 2);
    }
}
World.RegisterEntity(TrapSpikes);