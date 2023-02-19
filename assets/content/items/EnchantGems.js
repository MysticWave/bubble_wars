class EnchantGemAD extends Item
{
	constructor(bonus = 5)
	{
		super();

		this.stackAble = false;
		this.type = TYPE.ENCHANT;
		
		this.Texture = "item.enchant.gem.blue";
		this.name = "ITEM.ENCHANT.GEM.AD.NAME";
		this.shineStrength = 0;
		this.Grade = GRADE.NORMAL;

		this.bonus = new ItemBonus(STAT.ATTACK_DAMAGE, bonus);
		this.price = 1000;

		this.Description = 'ITEM.ENCHANT.GEM.DESCRIPTION';
	}

	Require(item)
	{
		if(item.slot == SLOT.CANNON) return true;

		return false;
	}
}
ItemHelper.InitializeItem(EnchantGemAD);


class EnchantGemAD2 extends EnchantGemAD
{
	constructor()
	{
		super(10);

		this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(EnchantGemAD2);


class EnchantGemAD3 extends EnchantGemAD
{
	constructor()
	{
		super(15);

		this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(EnchantGemAD3);

class EnchantGemAD4 extends EnchantGemAD
{
	constructor()
	{
		super(20);

		this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(EnchantGemAD4);

class EnchantGemAD5 extends EnchantGemAD
{
	constructor()
	{
		super(25);

		this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(EnchantGemAD5);







/*//////////////////////////////////////////       CHARGE       //////////////////////////////////////////*/

class EnchantGemMP extends EnchantGemAD
{
	constructor(bonus = 5)
	{
		super();

		this.Texture = "item.enchant.gem.yellow";
		this.name = "ITEM.ENCHANT.GEM.CHARGE.NAME";

		this.bonus = new ItemBonus(STAT.CHARGE, bonus);
	}

	Require(item)
	{
		if(item.requiredMP == 0) return false;
		if(item.fixedMP != null) return false;
		if(item.slot == SLOT.CANNON) return true;

		return false;
	}
}
ItemHelper.InitializeItem(EnchantGemMP);



class EnchantGemMP2 extends EnchantGemMP
{
	constructor()
	{
		super(10);
		this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(EnchantGemMP2);

class EnchantGemMP3 extends EnchantGemMP
{
	constructor()
	{
		super(15);
		this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(EnchantGemMP3);

class EnchantGemMP4 extends EnchantGemMP
{
	constructor()
	{
		super(20);
		this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(EnchantGemMP4);

class EnchantGemMP5 extends EnchantGemMP
{
	constructor()
	{
		super(25);
		this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(EnchantGemMP5);










/*//////////////////////////////////////////       HP       //////////////////////////////////////////*/

class EnchantGemHP extends EnchantGemAD
{
	constructor(bonus = 20)
	{
		super();

		this.Texture = "item.enchant.gem.violet";
		this.name = "ITEM.ENCHANT.GEM.HP.NAME";

		this.bonus = new ItemBonus(STAT.MAX_HP, bonus);
	}

	Require(item)
	{
		if(item.slot == SLOT.CORE) return true;

		return false;
	}
}
ItemHelper.InitializeItem(EnchantGemHP);



class EnchantGemHP2 extends EnchantGemHP
{
	constructor()
	{
		super(40);
		this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(EnchantGemHP2);

class EnchantGemHP3 extends EnchantGemHP
{
	constructor()
	{
		super(60);
		this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(EnchantGemHP3);

class EnchantGemHP4 extends EnchantGemHP
{
	constructor()
	{
		super(80);
		this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(EnchantGemHP4);

class EnchantGemHP5 extends EnchantGemHP
{
	constructor()
	{
		super(100);
		this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(EnchantGemHP5);







/*//////////////////////////////////////////       DEF       //////////////////////////////////////////*/

class EnchantGemDEF extends EnchantGemAD
{
	constructor(bonus = 5)
	{
		super();

		this.Texture = "item.enchant.gem.white";
		this.name = "ITEM.ENCHANT.GEM.DEF.NAME";

		this.bonus = new ItemBonus(STAT.DEFENSE, bonus);
	}

	Require(item)
	{
		if(item.slot == SLOT.CORE) return true;

		return false;
	}
}
ItemHelper.InitializeItem(EnchantGemDEF);



class EnchantGemDEF2 extends EnchantGemDEF
{
	constructor()
	{
		super(10);
		this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(EnchantGemDEF2);

class EnchantGemDEF3 extends EnchantGemDEF
{
	constructor()
	{
		super(15);
		this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(EnchantGemDEF3);

class EnchantGemDEF4 extends EnchantGemDEF
{
	constructor()
	{
		super(20);
		this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(EnchantGemDEF4);

class EnchantGemDEF5 extends EnchantGemDEF
{
	constructor()
	{
		super(25);
		this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(EnchantGemDEF5);





















/*//////////////////////////////////////////       AD%       //////////////////////////////////////////*/

class EnchantGemADp extends EnchantGemAD
{
	constructor(bonus = 5)
	{
		super();

		this.Texture = "item.enchant.gem.red";
		this.name = "ITEM.ENCHANT.GEM.AD.P.NAME";

		this.bonus = new ItemBonus(STAT.ATTACK_DAMAGE, bonus, true);
	}
}
ItemHelper.InitializeItem(EnchantGemADp);



class EnchantGemADp2 extends EnchantGemADp
{
	constructor()
	{
		super(10);
		this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(EnchantGemADp2);

class EnchantGemADp3 extends EnchantGemADp
{
	constructor()
	{
		super(15);
		this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(EnchantGemADp3);

class EnchantGemADp4 extends EnchantGemADp
{
	constructor()
	{
		super(20);
		this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(EnchantGemADp4);

class EnchantGemADp5 extends EnchantGemADp
{
	constructor()
	{
		super(25);
		this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(EnchantGemADp5);

















/*//////////////////////////////////////////       Attack Speed       //////////////////////////////////////////*/

class EnchantGemAS extends EnchantGemAD
{
	constructor(bonus = 0.1)
	{
		super();

		this.Texture = "item.enchant.gem.green";
		this.name = "ITEM.ENCHANT.GEM.AS.NAME";

		this.bonus = new ItemBonus(STAT.ATTACK_SPEED, bonus);
	}
}
ItemHelper.InitializeItem(EnchantGemAS);



class EnchantGemAS2 extends EnchantGemAS
{
	constructor()
	{
		super(0.2);
		this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(EnchantGemAS2);

class EnchantGemAS3 extends EnchantGemAS
{
	constructor()
	{
		super(0.3);
		this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(EnchantGemAS3);

class EnchantGemAS4 extends EnchantGemAS
{
	constructor()
	{
		super(0.4);
		this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(EnchantGemAS4);

class EnchantGemAS5 extends EnchantGemAS
{
	constructor()
	{
		super(0.5);
		this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(EnchantGemAS5);



