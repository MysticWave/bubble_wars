class RingPhysical extends ItemSpecial
{
	constructor()
	{
		super();
		
		this.Texture = "item.ring.golden";
		this.name = "ITEM.RING.PHYSICAL.NAME";

		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 10, true)
		];
	}
}
ItemHelper.InitializeItem(RingPhysical);