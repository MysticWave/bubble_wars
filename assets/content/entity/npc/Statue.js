class Statue extends EntityVillageNPC
{
	constructor(x, y)
	{
		super(x, y);

        var e = new Obstacle();
        this.onPlayerCollision = e.onPlayerCollision;
        this.onEntityCollision = e.onEntityCollision;

        this.canBeKnockedBack = false;
        this.showHpBar = false;
        this.isHurtAble = true;
		this.knockBack = 1;
        this.knockBackTime = 5/60;
        this.isObstacle = true;

		this.SPD = 0;

		this.startDialog = 'StatueDialog';
        this.firstMetDialog = 'StatueMetDialog';

        this.Texture = 'entity.npc.statue';

        this.availableNames = 
        [
            'NPC.STATUE.NAME'
        ];

        this.allowRotationChange = false;
        this.AI = new AI(this);
        this.AI.Apply(new AI_Talk(this));
        this.AI.Apply(new AI_QuestIndicator(this));


        this.HitBox.Scale = .5;
        this.Hands = null;

        this.RenderTransitions = {};

        this.Immunity.All = true;

        this.setScale(4);
	}

    Sacrifice()
    {
        var current = World.Player.NPCData.STATUE.sacrifice;
        if(!current) current = 0;

        World.Player.NPCData.STATUE.sacrifice = current + World.Player.coins;
        World.Player.coins = 0;

        Save();
    }

    Hurt(){return;}
}
World.RegisterEntity(Statue);



