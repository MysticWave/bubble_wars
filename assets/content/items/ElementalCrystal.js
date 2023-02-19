class Sapphire1 extends Item
{
	constructor(bonus = 5)
	{
		super();

		this.stackAble = false;
		this.type = TYPE.ENCHANT;
		
		this.Texture = "item.sapphire";
		this.name = "ITEM.ENCHANT.SAPPHIRE.NAME";
		this.shineStrength = 0;
		this.Grade = GRADE.NORMAL;

		this.bonus = new ItemBonus(STAT.DAMAGE_ICE, bonus);

		this.Description = 'ITEM.ENCHANT.GEM.DESCRIPTION';
		this.price = 1000;
	}

	Require(item)
	{
		if(item.slot != SLOT.CANNON) return false;
        if(item.Element == ELEMENT.ICE) return true;
        if(item.Charged?.element == ELEMENT.ICE) return true;

		return false;
	}
}
ItemHelper.InitializeItem(Sapphire1);






class Sapphire2 extends Sapphire1
{
	constructor()
	{
		super(10);

		this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(Sapphire2);


class Sapphire3 extends Sapphire1
{
	constructor()
	{
		super(15);

		this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(Sapphire3);


class Sapphire4 extends Sapphire1
{
	constructor()
	{
		super(20);

		this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(Sapphire4);


class Sapphire5 extends Sapphire1
{
	constructor()
	{
		super(25);

		this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(Sapphire5);























class Topaz1 extends Item
{
	constructor(bonus = 5)
	{
		super();

		this.stackAble = false;
		this.type = TYPE.ENCHANT;
		
		this.Texture = "item.topaz";
		this.name = "ITEM.ENCHANT.TOPAZ.NAME";
		this.shineStrength = 0;
		this.Grade = GRADE.NORMAL;

		this.bonus = new ItemBonus(STAT.DAMAGE_THUNDER, bonus);

		this.Description = 'ITEM.ENCHANT.GEM.DESCRIPTION';
		this.price = 1000;
	}

	Require(item)
	{
		if(item.slot != SLOT.CANNON) return false;
        if(item.Element == ELEMENT.THUNDER) return true;
        if(item.Charged?.element == ELEMENT.THUNDER) return true;

		return false;
	}
}
ItemHelper.InitializeItem(Topaz1);






class Topaz2 extends Topaz1
{
	constructor()
	{
		super(10);

		this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(Topaz2);


class Topaz3 extends Topaz1
{
	constructor()
	{
		super(15);

		this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(Topaz3);


class Topaz4 extends Topaz1
{
	constructor()
	{
		super(20);

		this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(Topaz4);


class Topaz5 extends Topaz1
{
	constructor()
	{
		super(25);

		this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(Topaz5);
























class Emerald1 extends Item
{
	constructor(bonus = 1)
	{
		super();

		this.stackAble = false;
		this.type = TYPE.ENCHANT;
		
		this.Texture = "item.emerald";
		this.name = "ITEM.ENCHANT.EMERALD.NAME";
		this.shineStrength = 0;
		this.Grade = GRADE.NORMAL;

		this.bonus = new ItemBonus(STAT.DAMAGE_POISON, bonus);

		this.Description = 'ITEM.ENCHANT.GEM.DESCRIPTION';
		this.price = 1000;
	}

	Require(item)
	{
		if(item.slot != SLOT.CANNON) return false;
        if(item.Element == ELEMENT.POISON) return true;
        if(item.Charged?.element == ELEMENT.POISON) return true;

		return false;
	}
}
ItemHelper.InitializeItem(Emerald1);






class Emerald2 extends Emerald1
{
	constructor()
	{
		super(2);

		this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(Emerald2);


class Emerald3 extends Emerald1
{
	constructor()
	{
		super(3);

		this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(Emerald3);


class Emerald4 extends Emerald1
{
	constructor()
	{
		super(4);

		this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(Emerald4);


class Emerald5 extends Emerald1
{
	constructor()
	{
		super(5);

		this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(Emerald5);