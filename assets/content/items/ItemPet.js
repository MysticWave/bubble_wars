class ItemPetFrogo extends ItemSpecial
{
	constructor()
	{
		super();
		
		this.Texture = "item.pet.frogo";
		this.name = "ITEM.PET.FROGO.NAME";

        this.DMG = 40;

		this.primary = 
		[
			new ItemBonus(STAT.SUMMON_DAMAGE, this.DMG)
		];
		
		this.summoned = null;
        this.dropLoot = false;

		this.Description = 'ITEM.PET.FROGO.DESCRIPTION';
	}

	unSummon()
	{
        this.summoned?.Kill();
		this.summoned = null;
	}

	onEquip()
	{
		this.unSummon();
		this.summon();
	}

	onTakeOut()
	{
		this.unSummon();
	}

	summon()
	{
        var entity = new FrogoPet();
            entity.x = World.Player.x;
            entity.y = World.Player.y;
            entity.AD = this.DMG;

        World.AddEntity(entity);
		this.summoned = entity;
	}

	onEquipTick()
	{
		if(!this.summoned) this.summon();
	}
}
ItemHelper.InitializeItem(ItemPetFrogo);