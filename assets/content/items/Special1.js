class Special1 extends ItemSpecial
{
	constructor()
	{
		super();
		
		this.Texture = "ShadowScythe";
		this.name = "Special I";

		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 100)
		];
		
		this.summoned = false;
		this.orbs = [];
		this.Radius = 150;
		this.orbsCount = 4;

		this.Lore = 'Summons 4 orbs to protect you.';
	}

	killOrbs()
	{
		for(var i = 0; i < this.orbs.length; i++)
		{
			this.orbs[i].Kill();
		}

		this.orbs = [];
	}

	onEquip()
	{
		this.killOrbs();
		this.summonOrbs();
	}

	onTakeOut()
	{
		this.killOrbs();
	}

	summonOrbs()
	{
		this.orbs = [];

		var radius = this.Radius;
		var angle = 0;
		var angleStep = 360 / this.orbsCount;

		for(var i = 0; i < this.orbsCount; i++)
		{
			var entity = new EntityBulletShield();
				entity.AI.Apply(new AI_OrbitAround(World.Player, 90, radius, angle));

			this.orbs.push(entity);
			World.AddEntity(entity);

			angle += angleStep;
		}

		this.summoned = true;
	}

	onEquipTick()
	{
		if(!this.summoned) this.summonOrbs();
	}
}
ItemHelper.InitializeItem(Special1);