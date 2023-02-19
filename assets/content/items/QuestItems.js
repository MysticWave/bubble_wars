class QuestItem extends Item
{
	constructor()
	{
		super();

		this.type = TYPE.QUEST_ITEM;
		
        this.Grade = GRADE.DIVINE;
        this.showGrade = false;
		this.canBeSold = false;
	}
}




class ViVisScissors extends QuestItem
{
	constructor()
	{
		super();

		this.Texture = 'item.quest.golden_scissors';
        this.Description = 'ITEM.VIVISCISSORS.DESCRIPTION';
        this.name = 'ITEM.VIVISCISSORS.NAME';

		this.stackAble = false;
	}
}
ItemHelper.InitializeItem(ViVisScissors);

