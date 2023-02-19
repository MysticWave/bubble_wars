class Reflector1 extends ItemSpecial
{
	constructor()
	{
		super(true);
		this.Texture = "item.reflector1";
		this.name = "Reflector I";

		this.primary = 
		[
			new ItemBonus(STAT.LIGHT_RANGE, 100)
			// new ItemBonus(STAT.ACCELERATION, acc)
		];
	
		// this.Model = new ItemModel("coreBase", 81, 31, 2, 0, -42);
	}
}
ItemHelper.InitializeItem(Reflector1);