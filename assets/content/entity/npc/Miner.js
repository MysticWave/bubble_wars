class Miner extends EntityVillageNPC
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = Lang.Translate('NPC_MINER_NAME');
        this.TextureRotation = 180;

		this.SPD = 100;

		this.startDialog = 'MinerDialog';
        this.firstMetDialog = 'MinerMetDialog';

        this.Texture = 'entity.npc.miner';

		this.availableNames = 
        [
            'NPC.MINER.NAME.0',
            'NPC.MINER.NAME.1',
            'NPC.MINER.NAME.2',
            'NPC.MINER.NAME.3',
        ];

		this.setScale(2);

		this.AI.Apply(new AI_TradeAble(this));

		this.lightRadius = 100;
	}

	onTrade()
	{
		this.inventory = [];

		this.addItemToInventory(new EssenceGradeExtractor(), 1, true);
		this.addItemToInventory(new BlessingGrade(), 1, true);
	}
}
World.RegisterEntity(Miner);



