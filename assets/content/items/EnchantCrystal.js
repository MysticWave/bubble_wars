class EnchantCrystalAD extends Item
{
	constructor(bonus = 5)
	{
		super();

		this.stackAble = false;
		this.type = TYPE.ENCHANT;
		
		this.Texture = "item.enchant.crystal.blue";
		this.name = "ITEM.ENCHANT.CRYSTAL.AD.NAME";
		this.shineStrength = 0;
		this.Grade = GRADE.NORMAL;

		this.bonus = new ItemBonus(STAT.ATTACK_DAMAGE, bonus, true);

		this.Description = 'ITEM.ENCHANT.CRYSTAL.DESCRIPTION';
		this.price = 1000;
	}

	Require(item)
	{
		if(item.slot == SLOT.SPECIAL) return true;

		return false;
	}
}
ItemHelper.InitializeItem(EnchantCrystalAD);




class EnchantCrystalAD2 extends EnchantCrystalAD
{
	constructor()
	{
		super(10);

        this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(EnchantCrystalAD2);


class EnchantCrystalAD3 extends EnchantCrystalAD
{
	constructor()
	{
		super(15);

        this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(EnchantCrystalAD3);


class EnchantCrystalAD4 extends EnchantCrystalAD
{
	constructor()
	{
		super(20);

        this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(EnchantCrystalAD4);


class EnchantCrystalAD5 extends EnchantCrystalAD
{
	constructor()
	{
		super(25);

        this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(EnchantCrystalAD5);










class EnchantCrystalDEF extends EnchantCrystalAD
{
	constructor(bonus = 5)
	{
		super();
		
		this.Texture = "item.enchant.crystal.white";
		this.name = "ITEM.ENCHANT.CRYSTAL.DEF.NAME";
		this.bonus = new ItemBonus(STAT.DEFENSE, bonus, true);
	}
}
ItemHelper.InitializeItem(EnchantCrystalDEF);



class EnchantCrystalDEF2 extends EnchantCrystalDEF
{
	constructor()
	{
		super(10);

        this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(EnchantCrystalDEF2);


class EnchantCrystalDEF3 extends EnchantCrystalDEF
{
	constructor()
	{
		super(15);

        this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(EnchantCrystalDEF3);


class EnchantCrystalDEF4 extends EnchantCrystalDEF
{
	constructor()
	{
		super(20);

        this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(EnchantCrystalDEF4);


class EnchantCrystalDEF5 extends EnchantCrystalDEF
{
	constructor()
	{
		super(25);

        this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(EnchantCrystalDEF5);




























class EnchantCrystalBlock extends EnchantCrystalAD
{
	constructor(bonus = 5)
	{
		super();
		
		this.Texture = "item.enchant.crystal.black";
		this.name = "ITEM.ENCHANT.CRYSTAL.BLOCK.NAME";
		this.Description = "ITEM.ENCHANT.CRYSTAL.BLOCK.DESCRIPTION";
		this.bonus = new ItemBonus(STAT.BLOCK_CHANCE, bonus);
	}
}
ItemHelper.InitializeItem(EnchantCrystalBlock);



class EnchantCrystalBlock2 extends EnchantCrystalBlock
{
	constructor()
	{
		super(10);

        this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(EnchantCrystalBlock2);


class EnchantCrystalBlock3 extends EnchantCrystalBlock
{
	constructor()
	{
		super(15);

        this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(EnchantCrystalBlock3);


class EnchantCrystalBlock4 extends EnchantCrystalBlock
{
	constructor()
	{
		super(20);

        this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(EnchantCrystalBlock4);


class EnchantCrystalBlock5 extends EnchantCrystalBlock
{
	constructor()
	{
		super(25);

        this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(EnchantCrystalBlock5);





























class EnchantCrystalMastery extends EnchantCrystalAD
{
	constructor(bonus = 5)
	{
		super();
		
		this.Texture = "item.enchant.crystal.purple";
		this.name = "ITEM.ENCHANT.CRYSTAL.MASTERY.NAME";
		this.Description = "ITEM.ENCHANT.CRYSTAL.MASTERY.DESCRIPTION";
		this.bonus = new ItemBonus(STAT.ELEMENTAL_MASTERY, bonus);
	}
}
ItemHelper.InitializeItem(EnchantCrystalMastery);



class EnchantCrystalMastery2 extends EnchantCrystalMastery
{
	constructor()
	{
		super(10);

        this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(EnchantCrystalMastery2);


class EnchantCrystalMastery3 extends EnchantCrystalMastery
{
	constructor()
	{
		super(15);

        this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(EnchantCrystalMastery3);


class EnchantCrystalMastery4 extends EnchantCrystalMastery
{
	constructor()
	{
		super(20);

        this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(EnchantCrystalMastery4);


class EnchantCrystalMastery5 extends EnchantCrystalMastery
{
	constructor()
	{
		super(25);

        this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(EnchantCrystalMastery5);