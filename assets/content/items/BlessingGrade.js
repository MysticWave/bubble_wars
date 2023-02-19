class BlessingGrade extends Item
{
	constructor()
	{
		super();

		this.type = TYPE.ITEM;
        this.Grade = GRADE.NORMAL;
		
		this.Texture = "item.blessing_stone";
		this.name = "ITEM.BLESSING_STONE.BROKEN.NAME";
		this.Description = "ITEM.BLESSING_STONE.BROKEN.DESCRIPTION";

		this.price = 1000;
	}
}
ItemHelper.InitializeItem(BlessingGrade);








class BlessingGrade0 extends Item
{
	constructor(grade = GRADE.COMMON)
	{
		super();

		this.type = TYPE.BLESSING;
        this.Grade = grade;
		
		this.Texture = "item.blessing_stone.common";
		this.name = "ITEM.BLESSING_STONE.NAME";
		this.Description = "ITEM.BLESSING_STONE.DESCRIPTION";

        this.ARGS = {GRADE: Lang.Get('NORMAL')};

		this.price = 1000;

        this.Recipe = new ItemRecipe(this, [
            ['BlessingGrade', 1],
            ['LiquidOxygen', 10],
            ['EssenceGrade0', 4]
        ]);
	}

    Require(item)
    {
        if(!item) return false;
        if(!item.enchantAble) return false;
        if(item.slot == SLOT.CORE) return false;

        var gradesOrder = ItemHelper.GetGradesOrder();
        var currentGrade = gradesOrder.indexOf(item.Grade);
        var myGrade = gradesOrder.indexOf(this.Grade);
        if(currentGrade == -1) return false;

        //this item can only be used on items with grade one less
        if(currentGrade == myGrade - 1) return true;

        return false;
    }

    Bless(item)
    {
        item.Grade = this.Grade;
    }
}
ItemHelper.InitializeItem(BlessingGrade0);







class BlessingGrade1 extends BlessingGrade0
{
	constructor()
	{
		super(GRADE.RARE);
        this.Texture = "item.blessing_stone.rare";

        this.ARGS = {GRADE: Style.InjectColor(GRADE.COMMON)};

        this.Recipe = new ItemRecipe(this, [
            ['BlessingGrade', 1],
            ['LiquidOxygen', 20],
            ['EssenceGrade1', 4]
        ]);
	}
}
ItemHelper.InitializeItem(BlessingGrade1);




class BlessingGrade2 extends BlessingGrade0
{
	constructor()
	{
		super(GRADE.MYTHICAL);
        this.Texture = "item.blessing_stone.mythical";

        this.ARGS = {GRADE: Style.InjectColor(GRADE.RARE)};

        this.Recipe = new ItemRecipe(this, [
            ['BlessingGrade', 1],
            ['LiquidOxygen', 50],
            ['EssenceGrade2', 4]
        ]);
	}
}
ItemHelper.InitializeItem(BlessingGrade2);


class BlessingGrade3 extends BlessingGrade0
{
	constructor()
	{
		super(GRADE.LEGENDARY);
		this.Texture = "item.blessing_stone.legendary";

        this.ARGS = {GRADE: Style.InjectColor(GRADE.MYTHICAL)};
        
        this.Recipe = new ItemRecipe(this, [
            ['BlessingGrade', 1],
            ['LiquidOxygen', 100],
            ['EssenceGrade3', 4]
        ]);
	}
}
ItemHelper.InitializeItem(BlessingGrade3);



class BlessingGrade4 extends BlessingGrade0
{
	constructor()
	{
		super(GRADE.ANGELIC);
		
		this.Texture = "item.blessing_stone.angelic";

        this.ARGS = {
            GRADE: Style.InjectColor(GRADE.LEGENDARY), 
            GRADE2: Style.InjectColor(GRADE.DEMONIC, 'DATA')
        };

        this.Description = "ITEM.BLESSING_STONE.DESCRIPTION.2";
        this.Recipe = null;
	}

    Require(item)
    {
        if(!item) return false;
        if(!item.enchantAble) return false;

        var gradesOrder = ItemHelper.GetGradesOrder();
        var currentGrade = gradesOrder.indexOf(item.Grade);
        if(currentGrade == -1) return false;

        //this item can only be used on items with grade one less
        //demonic got index one higher than angelic, but its the same tier
        if(item.Grade == GRADE.DEMONIC) return true;
        if(item.Grade == GRADE.LEGENDARY) return true;
    }
}
ItemHelper.InitializeItem(BlessingGrade4);


class BlessingGrade5 extends BlessingGrade0
{
	constructor()
	{
		super(GRADE.DEMONIC);

        this.ARGS = {
            GRADE: Style.InjectColor(GRADE.LEGENDARY), 
            GRADE2: Style.InjectColor(GRADE.ANGELIC, 'DATA')
        };

        this.Description = "ITEM.BLESSING_STONE.DESCRIPTION.2";
		
		this.Texture = "item.blessing_stone.demonic";
        this.Recipe = null;
	}

    Require(item)
    {
        if(!item) return false;
        if(!item.enchantAble) return false;

        var gradesOrder = ItemHelper.GetGradesOrder();
        var currentGrade = gradesOrder.indexOf(item.Grade);
        if(currentGrade == -1) return false;

        //this item can only be used on items with grade one less
        //demonic got index one higher than angelic, but its the same tier
        if(item.Grade == GRADE.LEGENDARY) return true;
        if(item.Grade == GRADE.ANGELIC) return true;

        return false;
    }
}
ItemHelper.InitializeItem(BlessingGrade5);





class BlessingGrade6 extends BlessingGrade0
{
	constructor()
	{
		super(GRADE.DIVINE);

		this.Texture = "item.blessing_stone.divine";

        this.ARGS = {
            GRADE: Style.InjectColor(GRADE.ANGELIC, 'DATA'), 
            GRADE2: Style.InjectColor(GRADE.DEMONIC, 'DATA')
        };

        this.Description = "ITEM.BLESSING_STONE.DESCRIPTION.2";
        this.Recipe = null;
	}

    Require(item)
    {
        if(!item) return false;
        if(!item.enchantAble) return false;

        var gradesOrder = ItemHelper.GetGradesOrder();
        var currentGrade = gradesOrder.indexOf(item.Grade);
        if(currentGrade == -1) return false;

        //this item can only be used on items with grade one less
        //demonic got index one higher than angelic, but its the same tier
        if(item.Grade == GRADE.DEMONIC) return true;
        if(item.Grade == GRADE.ANGELIC) return true;

        return false;
    }
}
ItemHelper.InitializeItem(BlessingGrade6);
























class ConcentratedBossAura extends Item
{
	constructor()
	{
		super();

		this.type = TYPE.ITEM;
        this.Grade = GRADE.DEMONIC;
        this.showGrade = false;
		
		this.Texture = "item.aura.boss";
		this.name = "ITEM.CONCENTRATED_AURA.BOSS.NAME";
		this.Description = "ITEM.CONCENTRATED_AURA.BOSS.DESCRIPTION";

		this.price = 1000;
	}
}
ItemHelper.InitializeItem(ConcentratedBossAura);




class ConcentratedAura0 extends Item
{
	constructor(grade = GRADE.COMMON)
	{
		super();

		this.type = TYPE.BLESSING;
        this.Grade = grade;
		
		this.Texture = "item.aura.common";
		this.name = "ITEM.CONCENTRATED_AURA.NAME";
		this.Description = "ITEM.CONCENTRATED_AURA.DESCRIPTION";

        this.ARGS = {GRADE: Lang.Get('NORMAL')};

		this.price = 1000;

        this.Recipe = new ItemRecipe(this, [
            ['ConcentratedBossAura', 1],
            ['LiquidOxygen', 10],
            ['EssenceGrade0', 4]
        ]);
	}

    Require(item)
    {
        if(!item) return false;
        if(!item.enchantAble) return false;
        if(item.slot != SLOT.CORE) return false;

        var gradesOrder = ItemHelper.GetGradesOrder();
        var currentGrade = gradesOrder.indexOf(item.Grade);
        var myGrade = gradesOrder.indexOf(this.Grade);
        if(currentGrade == -1) return false;

        //this item can only be used on items with grade one less
        if(currentGrade == myGrade - 1) return true;

        return false;
    }

    Bless(item)
    {
        item.Grade = this.Grade;
    }
}
ItemHelper.InitializeItem(ConcentratedAura0);



class ConcentratedAura1 extends ConcentratedAura0
{
	constructor()
	{
		super(GRADE.RARE);
        this.Texture = "item.aura.rare";

        this.ARGS = {GRADE: Style.InjectColor(GRADE.COMMON)};

        this.Recipe = new ItemRecipe(this, [
            ['ConcentratedBossAura', 1],
            ['LiquidOxygen', 20],
            ['EssenceGrade1', 4]
        ]);
	}
}
ItemHelper.InitializeItem(ConcentratedAura1);

class ConcentratedAura2 extends ConcentratedAura0
{
	constructor()
	{
		super(GRADE.MYTHICAL);
        this.Texture = "item.aura.mythical";

        this.ARGS = {GRADE: Style.InjectColor(GRADE.RARE)};

        this.Recipe = new ItemRecipe(this, [
            ['ConcentratedBossAura', 1],
            ['LiquidOxygen', 50],
            ['EssenceGrade2', 4]
        ]);
	}
}
ItemHelper.InitializeItem(ConcentratedAura2);


class ConcentratedAura3 extends ConcentratedAura0
{
	constructor()
	{
		super(GRADE.LEGENDARY);
        this.Texture = "item.aura.legendary";

        this.ARGS = {GRADE: Style.InjectColor(GRADE.MYTHICAL)};

        this.Recipe = new ItemRecipe(this, [
            ['ConcentratedBossAura', 1],
            ['LiquidOxygen', 100],
            ['EssenceGrade3', 4]
        ]);
	}
}
ItemHelper.InitializeItem(ConcentratedAura3);