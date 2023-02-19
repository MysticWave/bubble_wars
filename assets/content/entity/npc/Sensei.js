class Sensei extends EntityVillageNPC
{
	constructor(x, y)
	{
		super(x, y);
		
        this.TextureRotation = 180;

		this.SPD = 100;

		this.startDialog = 'SenseiDialog';

        this.Texture = 'entity.npc.sensei';

        this.availableNames = 
        [
            'NPC.SENSEI.NAME.0',
            'NPC.SENSEI.NAME.1',
            'NPC.SENSEI.NAME.2',
            'NPC.SENSEI.NAME.3',
        ];

        this.setScale(2);
	}
}
World.RegisterEntity(Sensei);



