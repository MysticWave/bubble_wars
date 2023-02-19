class Honeycomb extends Item
{
	constructor()
	{
		super();

		this.stackAble = true;
		this.maxStackSize = 999;
		this.upgradeAble = false;
		this.enchantAble = false;

		this.Texture = 'item.honey.comb';
        this.name = "ITEM.HONEY.COMB.NAME";
		
        this.Description = 'ITEM.HONEY.COMB.DESCRIPTION';

        this.Recipe = new ItemRecipe(this, [
            ['HoneyPiece', 20],
            ['LiquidOxygen', 5]
        ]);

        this.Regeneration = 40;
        this.Time = 20;
        this.ARGS = {REGEN: this.Regeneration, TIME: this.Time};
	}

	onUse(player)
	{
		ApplyEffect(player, 'Regeneration', this.Regeneration/this.Time, this.Time);

        this.count--;
		if(this.count <= 0)
		{
			var index = player.inventory.indexOf(this);
			if(index > -1) player.inventory[index] = null;
		}
	}
}
ItemHelper.InitializeItem(Honeycomb);