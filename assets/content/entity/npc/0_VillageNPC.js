class EntityVillageNPC extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.isHurtAble = false;
		this.isNPC = true;
		
		this.AI.Apply(new AI_Talk(this));
		this.AI.Apply(new AI_Walk());
		this.AI.Apply(new AI_Wander(true, 7, 10, {r: 150}));
        this.AI.Apply(new AI_QuestIndicator(this));

		this.startDialog = 'MinerTest';
        this.firstMetDialog = 'MinerTest';

        this.dialogLine = this.firstMetDialog;

        this.Hands = 
        [
            ['entity.npc.hand.right', -54, -54, 16, 16, 180],
            ['entity.npc.hand.left', 6, -54, 16, 16, 180]
        ];

        this.availableNames = null;
		
        this.HandMove = new Transition(-.5, .5, 1, true, 0, 0, false);

        this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.5, true, 0.02, 0.02)
		};
	}

    onKnockBack()
    {
        this.AI.Wander?.changeDir();
    }

    Update()
    {
        if(World.Boss) this.isHidden = true;
        else this.isHidden = false;
        
        super.Update();

        this.dialogLine = isNPCMet(this.getId()) ? this.startDialog : this.firstMetDialog;
    }

    getDisplayName()
    {
        var id = this.getId();
        if(isNPCMet(id)) 
        {
            if(World?.Player?.NPCData[id])
            {
                var name = World.Player.NPCData[id].displayName;
                if(name) return Lang.Get(name);

                if(this.availableNames)
                {
                    name = this.availableNames[MathHelper.randomInRange(0, this.availableNames.length-1)];
                    World.Player.NPCData[id].displayName = name;
                    return Lang.Get(name);
                }
            }

            return super.getDisplayName();
        }
        return '???';
    }
}



