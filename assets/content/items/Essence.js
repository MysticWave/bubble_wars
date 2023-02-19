class EssenceGradeExtractor extends Item
{
	constructor()
	{
		super();

		this.type = TYPE.BLESSING;
		
		this.Texture = "item.essence_extractor";
		this.name = "ITEM.ESSENCE_EXTRACTOR.NAME";
		this.Description = "ITEM.ESSENCE_EXTRACTOR.DESCRIPTION";

		this.price = 1000;
	}

    Require(item)
    {
        if(!item) return false;
        if(!item.equipAble) return false;
        if(!item.Grade) return false;
        if(item.Grade == GRADE.NORMAL) return false;
        // if(item.slot == SLOT.SPECIAL) return false;     //cannot extract accessories

        var id = ItemHelper.GetGradesOrder(item.Grade);
        var grade_essence = Item.Get('EssenceGrade' + (id - 1));
        if(!grade_essence) return false;

        return true;
    }

    Bless(item, isGhostItem = false)
    {
        var amount = 2;
        var grade = item.Grade;
        var id = ItemHelper.GetGradesOrder(grade);
        if(item.slot == SLOT.CANNON) amount = 1;

        var grade_essence = Item.Get('EssenceGrade' + (id - 1));
        if(!grade_essence) return false;

        if(!isGhostItem) World.Player.addItemToInventory(grade_essence, amount);
        item.Grade = GRADE.NORMAL;
    }
}
ItemHelper.InitializeItem(EssenceGradeExtractor);



class EssenceGradeExtractorPermanent extends EssenceGradeExtractor
{
	constructor()
	{
		super();
        this.Grade = GRADE.TRANSCENDENTAL;

        this.name = "ITEM.ESSENCE_EXTRACTOR.PERMANENT.NAME";

        this.stackAble = false;
        this.showGrade = false;
        this.canBeSold = false;
		this.isUnique = true;
	}

    Bless(item, isGhostItem = false)
    {
        super.Bless(item, isGhostItem);

        if(!isGhostItem) this.count++;
    }
}
ItemHelper.InitializeItem(EssenceGradeExtractorPermanent);



class EssenceGrade0 extends Item
{
	constructor(grade = GRADE.COMMON)
	{
		super();
        this.Grade = grade;
		
		this.Texture = "item.essence.common";
		this.name = "Essence";
		this.Description = "ITEM.ESSENCE_GRADE.DESCRIPTION";

        this.ARGS = {GRADE: Style.InjectColor(this.Grade)};

		this.price = 250;
	}
}
ItemHelper.InitializeItem(EssenceGrade0);

class EssenceGrade1 extends EssenceGrade0
{
	constructor()
	{
		super(GRADE.RARE);
		
		this.Texture = "item.essence.rare";
	}
}
ItemHelper.InitializeItem(EssenceGrade1);

class EssenceGrade2 extends EssenceGrade0
{
	constructor()
	{
		super(GRADE.MYTHICAL);
		
		this.Texture = "item.essence.mythical";
	}
}
ItemHelper.InitializeItem(EssenceGrade2);

class EssenceGrade3 extends EssenceGrade0
{
	constructor()
	{
		super(GRADE.LEGENDARY);
		
		this.Texture = "item.essence.legendary";
	}
}
ItemHelper.InitializeItem(EssenceGrade3);

