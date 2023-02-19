class FlowInBottle extends ItemSpecial
{
	constructor()
	{
		super();

		this.type = TYPE.ITEM_DASH;
        this.restrictTypes = 1;
		
		this.Texture = "item.bottle.flow";
		this.name = "ITEM.FLOW_IN_BOTTLE.NAME";
        this.Description = 'ITEM.FLOW_IN_BOTTLE.DESCRIPTION';

		this.primary = 
		[
			new ItemBonus(STAT.DASH_COOLTIME, 2),
			new ItemBonus(STAT.DASH_DURATION, 10),
			new ItemBonus(STAT.DASH_DISTANCE, 5),
		];
	}
}
ItemHelper.InitializeItem(FlowInBottle);