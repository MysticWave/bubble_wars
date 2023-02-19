/*//////////////////////////////////////////       BULLETS       //////////////////////////////////////////*/

class HolyStoneBullet1 extends EnchantGemAD
{
	constructor(bonus = 1, percent = false)
	{
		super();

		this.Texture = "item.holy_stone.bullet";
		this.name = "ITEM.HOLY_STONE.BULLET.NAME";

		this.bonus = new ItemBonus(STAT.BULLETS_COUNT, bonus, percent);
	}

	Require(item)
	{
		if(item.slot != SLOT.CANNON) return false;
		if(!item.canIncreaseBulletsCount()) return false;

		return true;
	}
}
ItemHelper.InitializeItem(HolyStoneBullet1);




class HolyStoneBullet2 extends HolyStoneBullet1
{
	constructor()
	{
		super(2);
        this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(HolyStoneBullet2);



class HolyStoneBullet3 extends HolyStoneBullet1
{
	constructor()
	{
		super(50, true);
        this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(HolyStoneBullet3);


class HolyStoneBullet4 extends HolyStoneBullet1
{
	constructor()
	{
		super(100, true);
        this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(HolyStoneBullet4);



class HolyStoneBullet5 extends HolyStoneBullet1
{
	constructor()
	{
		super(5);
        this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(HolyStoneBullet5);
























/*//////////////////////////////////////////       RANGE       //////////////////////////////////////////*/

class HolyStoneRange1 extends EnchantGemAD
{
	constructor(bonus = 100, percent = false)
	{
		super();

		this.Texture = "item.holy_stone.attack_range";
		this.name = "ITEM.HOLY_STONE.RANGE.NAME";

		this.bonus = new ItemBonus(STAT.ATTACK_RANGE, bonus, percent);
	}

	Require(item)
	{
		if(item.slot != SLOT.CANNON) return false;

		return true;
	}
}
ItemHelper.InitializeItem(HolyStoneRange1);






class HolyStoneRange2 extends HolyStoneRange1
{
	constructor()
	{
		super(150);
        this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(HolyStoneRange2);



class HolyStoneRange3 extends HolyStoneRange1
{
	constructor()
	{
		super(250, true);
        this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(HolyStoneRange3);


class HolyStoneRange4 extends HolyStoneRange1
{
	constructor()
	{
		super(300, true);
        this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(HolyStoneRange4);



class HolyStoneRange5 extends HolyStoneRange1
{
	constructor()
	{
		super(400);
        this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(HolyStoneRange5);












/*//////////////////////////////////////////       ATTACK SPEED       //////////////////////////////////////////*/

class HolyStoneAS1 extends EnchantGemAD
{
	constructor(bonus = 20)
	{
		super();

		this.Texture = "item.holy_stone.attack_speed";
		this.name = "ITEM.HOLY_STONE.ATTACK_SPEED.NAME";

		this.bonus = new ItemBonus(STAT.ATTACK_SPEED, bonus, true);
	}

	Require(item)
	{
		if(item.slot != SLOT.CANNON) return false;

		return true;
	}
}
ItemHelper.InitializeItem(HolyStoneAS1);






class HolyStoneAS2 extends HolyStoneAS1
{
	constructor()
	{
		super(40);
        this.Grade = GRADE.COMMON;
	}
}
ItemHelper.InitializeItem(HolyStoneAS2);



class HolyStoneAS3 extends HolyStoneAS1
{
	constructor()
	{
		super(60, true);
        this.Grade = GRADE.RARE;
	}
}
ItemHelper.InitializeItem(HolyStoneAS3);


class HolyStoneAS4 extends HolyStoneAS1
{
	constructor()
	{
		super(80);
        this.Grade = GRADE.MYTHICAL;
	}
}
ItemHelper.InitializeItem(HolyStoneAS4);



class HolyStoneAS5 extends HolyStoneAS1
{
	constructor()
	{
		super(100);
        this.Grade = GRADE.LEGENDARY;
	}
}
ItemHelper.InitializeItem(HolyStoneAS5);