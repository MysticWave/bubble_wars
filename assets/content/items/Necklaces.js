class NecklaceRegeneration extends ItemSpecial
{
	constructor()
	{
		super();
		
		this.Texture = "item.necklace.golden";
		this.name = "ITEM.NECKLACE.REGENERATION.NAME";
		this.Description = "ITEM.NECKLACE.REGENERATION.DESCRIPTION";

        this.Regeneration = 10;

		this.primary = 
		[
			new ItemBonus(STAT.MAX_HP, 20)
		];

        this.ARGS = {REGEN: this.Regeneration};
	}

    onEquipTick()
	{
        if(!World) return;
        if(!World.currentRoom) return;
        if(!World.Player) return;

        if(World.currentRoom.isCleared && !World.currentRoom.lastCleared) World.Player.Heal(this.Regeneration);
	}
}
ItemHelper.InitializeItem(NecklaceRegeneration);