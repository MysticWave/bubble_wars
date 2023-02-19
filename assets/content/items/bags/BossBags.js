class StarterBag extends ItemBag
{
	constructor()
	{
		super('ITEM.BAG.STARTER.NAME');
		this.Texture = 'item.treasure_orb.lake';

		this.Items = 
		[
			new LootTableItemData('LiquidOxygen', 100, 10, 10),
			new LootTableItemData('EssenceGrade0', 100, 4, 4),
			new LootTableItemData('ConcentratedBossAura', 100, 1, 1)
			,new LootTableItemData('DevBag', 100, 1, 1)
		];

		// this.Texture = "ShadowScythe";
	}
}
ItemHelper.InitializeItem(StarterBag);



class DevBag extends ItemBag
{
	constructor()
	{
		super('ITEM.BAG.DEV.NAME');
		this.Texture = 'item.treasure_orb.lake';

		this.Items = 
		[
			new LootTableItemData('LiquidOxygen', 100, 999, 999),
			new LootTableItemData('RandomAppearanceBox', 100, 1, 1),
			new LootTableItemData('RandomAppearanceBox', 100, 1, 1),
			new LootTableItemData('RandomAppearanceBox', 100, 1, 1),
			new LootTableItemData('RandomAppearanceBox', 100, 1, 1),
			new LootTableItemData('BlessingGrade', 100, 99, 99),
			new LootTableItemData('BlessingGrade1', 100, 99, 99),
			new LootTableItemData('BlessingGrade2', 100, 99, 99),
			new LootTableItemData('BlessingGrade3', 100, 99, 99),
			new LootTableItemData('BlessingGrade4', 100, 99, 99),
			new LootTableItemData('BlessingGrade5', 100, 99, 99),
			new LootTableItemData('BlessingGrade6', 100, 99, 99),
			new LootTableItemData('EssenceGradeExtractorPermanent', 100, 1, 1),

			new LootTableItemData('SummonScrollOxyCell', 100, 99, 99),
			new LootTableItemData('SummonScrollTrimago', 100, 99, 99),
			new LootTableItemData('SummonScrollFrogo', 100, 99, 99),
			new LootTableItemData('SummonScrollAquamantula', 100, 99, 99),
			new LootTableItemData('SummonScrollCelltipede', 100, 99, 99),

			new LootTableItemData('TheVirtuoso', 100, 1, 1),
			new LootTableItemData('BubbleTerminator', 100, 1, 1),
			new LootTableItemData('RocketLauncher0', 100, 1, 1),
			new LootTableItemData('HolyLauncher', 100, 1, 1),
			new LootTableItemData('InfinityStoneOfSpace', 100, 1, 1)
		];

		// this.Texture = "ShadowScythe";
	}
}
ItemHelper.InitializeItem(DevBag);








class TreasureOrbOxyCell extends ItemBag
{
	constructor()
	{
		super('ITEM.BAG.OXY_CELL.NAME');
		this.Texture = 'item.treasure_orb.lake';

		this.Items = 
		[
			// new LootTableItemData('HolyStoneBullet1', 25, 1, 1),
			// new LootTableItemData('MachineGunBase', 25, 1, 1),
			new LootTableItemData('LiquidOxygen', 100, 1, 3),
			new LootTableItemData('SummonScrollOxyCell', 25, 1, 1),
			new LootTableItemData('ConcentratedBossAura', 5, 1, 1)
		];
	}
}
ItemHelper.InitializeItem(TreasureOrbOxyCell);

class TreasureOrbTrimago extends ItemBag
{
	constructor()
	{
		super('ITEM.BAG.TRIMAGO.NAME');
		this.Texture = 'item.treasure_orb.lake';

		this.Items = 
		[
			new LootTableItemData('HolyStoneRange1', 25, 1, 1),
			
			new LootTableItemData('LiquidOxygen', 100, 1, 5),
			new LootTableItemData('SummonScrollTrimago', 25, 1, 1),
			new LootTableItemData('ConcentratedBossAura', 5, 1, 1)
		];
	}
}
ItemHelper.InitializeItem(TreasureOrbTrimago);


class TreasureOrbTheFatOne extends ItemBag
{
	constructor()
	{
		super('ITEM.BAG.THE_FAT_ONE.NAME');
		this.Texture = 'item.treasure_orb.lake';

		this.Items = 
		[
			new LootTableItemData('HolyStoneBullet1', 25, 1, 1),
			
			new LootTableItemData('LiquidOxygen', 100, 2, 6),
			new LootTableItemData('SummonScrollTheFatOne', 25, 1, 1),
			new LootTableItemData('ConcentratedBossAura', 5, 1, 1)
		];
	}
}
ItemHelper.InitializeItem(TreasureOrbTheFatOne);




class TreasureOrbWaterfly extends ItemBag
{
	constructor()
	{
		super('ITEM.BAG.WATERFLY.NAME');
		this.Texture = 'item.treasure_orb.lake';

		this.Items = 
		[
			new LootTableItemData('HolyStoneAS1', 25, 1, 1),
			new LootTableItemData('WaterTwister', 25, 1, 1),

			new LootTableItemData('LiquidOxygen', 100, 2, 6),
			new LootTableItemData('SummonScrollWaterfly', 25, 1, 1),
			new LootTableItemData('ConcentratedBossAura', 5, 1, 1)
		];
	}
}
ItemHelper.InitializeItem(TreasureOrbWaterfly);





class TreasureOrbFrogo extends ItemBag
{
	constructor()
	{
		super('ITEM.BAG.FROGO.NAME');
		this.Texture = 'item.treasure_orb.lake';

		this.Items = 
		[
			// new LootTableItemData('HolyStoneBullet1', 25, 1, 1),
			// new LootTableItemData('MachineGunBase', 25, 1, 1),
			new LootTableItemData('LiquidOxygen', 100, 2, 7),
			new LootTableItemData('ItemPetFrogo', 25, 1, 1),
			new LootTableItemData('SummonScrollFrogo', 25, 1, 1),
			new LootTableItemData('ConcentratedBossAura', 5, 1, 1)
		];
	}
}
ItemHelper.InitializeItem(TreasureOrbFrogo);

class TreasureOrbAquamantula extends ItemBag
{
	constructor()
	{
		super('ITEM.BAG.AQUAMANTULA.NAME');
		this.Texture = 'item.treasure_orb.lake';

		this.Items = 
		[
			new LootTableItemData('LiquidOxygen', 100, 3, 9),
			new LootTableItemData('SummonScrollLakeSpiderQueen', 25, 1, 1),
			new LootTableItemData('ConcentratedBossAura', 5, 1, 1)
		];
	}
}
ItemHelper.InitializeItem(TreasureOrbAquamantula);


class TreasureOrbCelltipede extends ItemBag
{
	constructor()
	{
		super('ITEM.BAG.CELLTIPEDE.NAME');
		this.Texture = 'item.treasure_orb.lake';

		this.Items = 
		[
			// new LootTableItemData('HolyStoneBullet1', 25, 1, 1),
			// new LootTableItemData('MachineGunBase', 25, 1, 1),
			new LootTableItemData('LiquidOxygen', 100, 5, 10),
			new LootTableItemData('SummonScrollCelltipede', 25, 1, 1),
			new LootTableItemData('ConcentratedBossAura', 5, 1, 1)
		];
	}
}
ItemHelper.InitializeItem(TreasureOrbCelltipede);




