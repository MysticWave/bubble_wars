class EntityShadow extends Entity
{
	constructor(x, y, owner, data = {})
	{
		super(x, y);
		this.Owner = owner;
		this.Texture = 'entity.shadow';

		this.MAXHP = 1;
		this.HP = this.MAXHP;
        this.isHurtAble = false;

		this.knockBackResistance = 1;
		this.Immunity.ALL = true;
		this.hideOnRadar = true;
        this.Transparency = .5;

        this.AI.Apply(new AI_Walk());

        for(var i in data) this[i] = data[i];
	}

	Update()
	{
		super.Update();

		if(!this.Owner.isAlive) this.Kill();
	}
}
World.RegisterEntity(EntityShadow);
