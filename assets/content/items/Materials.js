class HoneyPiece extends Item
{
	constructor()
	{
		super();

		this.stackAble = true;
		this.maxStackSize = 999;
		this.upgradeAble = false;
		this.enchantAble = false;

		this.Texture = 'item.honey.piece';
        this.name = "ITEM.HONEY.PIECE.NAME";
		
        this.Description = 'ITEM.HONEY.PIECE.DESCRIPTION';
	}

	onUse(player)
	{
		var pos = MathHelper.getRandomPointInRange(World.CenterPoint, World.Radius*.9);
        var e = new EntityHoneyDrop(pos.x, pos.y);

        World.AddEntity(e);

        this.count--;

		if(this.count <= 0)
		{
			var index = player.inventory.indexOf(this);
			if(index > -1) player.inventory[index] = null;
		}
	}
}
ItemHelper.InitializeItem(HoneyPiece);