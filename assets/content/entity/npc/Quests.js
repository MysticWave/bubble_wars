class QuestLineLevelUp1 extends QuestLine
{
    constructor()
    {
        super();

        this.requiredLevel = 1;

        this.levelToComplete = 10;
        this.NPC = 'SENSEI';
        this.name = 'QUEST.LEVELUP.1.NAME';
        this.Description = 'QUEST.LEVELUP.1.DESCRIPTION';
    }

    GetProgress()
    {
        return World.Player.stats.Level / this.levelToComplete * 100;
    }

    checkForCompletion()
    {
        if(World.Player.stats.Level >= this.levelToComplete) return true;

        return super.checkForCompletion();
    }

    GetReward()
    {
        var reward = new TheStick();
            reward.Grade = GRADE.NORMAL;
            reward.showNewItemInfo = true;
        World.Player.addItemToInventory(reward);
    }
}
QuestList.Init(QuestLineLevelUp1);





class QuestLineLevelUp2 extends QuestLineLevelUp1
{
    constructor()
    {
        super();
        this.levelToComplete = 20;
        this.requiredQuest = 'QuestLineLevelUp1';

        this.name = 'QUEST.LEVELUP.2.NAME';
        this.Description = 'QUEST.LEVELUP.2.DESCRIPTION';
    }
}
QuestList.Init(QuestLineLevelUp2);




class QuestLineLevelUp3 extends QuestLineLevelUp1
{
    constructor()
    {
        super();
        this.levelToComplete = 30;
        this.requiredQuest = 'QuestLineLevelUp2';

        this.name = 'QUEST.LEVELUP.3.NAME';
        this.Description = 'QUEST.LEVELUP.3.DESCRIPTION';
    }
}
QuestList.Init(QuestLineLevelUp3);














class QuestLineViViScissors extends QuestLineFindItem
{
    constructor()
    {
        super();

        this.requiredLevel = 10;

        this.NPC = 'STYLIST';
        this.name = 'QUEST.VIVISCISSORS.NAME';
        this.Description = 'QUEST.VIVISCISSORS.DESCRIPTION';
        this.Icon = 'item.quest.golden_scissors';

        this.requiredItem = 'ViVisScissors';
        this.Chance = 5;
        this.WholeLocation = 'Lake7';
    }

    GetReward()
    {
        World.Player.coins += 20000;
        World.Player.oxygen += 1500;

        var reward = new RandomAppearanceBox();
            reward.showNewItemInfo = true;
        World.Player.addItemToInventory(reward);
    }
}
QuestList.Init(QuestLineViViScissors);