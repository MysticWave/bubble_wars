class SummonScroll extends Item
{
	constructor(bossName)
	{
		super();

		this.stackAble = true;
		this.maxStackSize = 999;
		this.upgradeAble = false;
		this.enchantAble = false;

		this.Texture = 'item.summon_scroll';
        this.name = "ITEM.SUMMON_SCROLL.NAME";

        this.canBeSold = false;
        this.Grade = GRADE.MYTHICAL;
        this.showGrade = false;

		
        this.Description = 'ITEM.SUMMON_SCROLL.DESCRIPTION';
		this.BossName = bossName;
		this.ARGS = {};
	}

    getDisplayName()
    {
        this.ARGS.BOSS_NAME = Lang.Get(this.BossName);

        return super.getDisplayName();
    }

	onUse(player)
	{
        if(World.Location.constructor.name != 'BossArena') return;

		this.count--;

		if(this.count <= 0)
		{
			var index = player.inventory.indexOf(this);
			if(index > -1)
			{
				player.inventory[index] = null;
			}
		}

        Summon(this.GetBoss());
        Save();
	}
}




class SummonScrollOxyCell extends SummonScroll
{
	constructor()
	{
		super('ENTITY.OXY_CELL.NAME');
	}

    GetBoss()
    {
        return OxyCell;
    }
}
ItemHelper.InitializeItem(SummonScrollOxyCell);


class SummonScrollTrimago extends SummonScroll
{
	constructor()
	{
		super('ENTITY.TRIMAGO.NAME');
	}

    GetBoss()
    {
        return Trimago;
    }
}
ItemHelper.InitializeItem(SummonScrollTrimago);


class SummonScrollTheFatOne extends SummonScroll
{
	constructor()
	{
		super('ENTITY.THE_FAT_ONE.NAME');
	}

    GetBoss()
    {
        return TheFatOne;
    }
}
ItemHelper.InitializeItem(SummonScrollTheFatOne);


class SummonScrollWaterfly extends SummonScroll
{
	constructor()
	{
		super('ENTITY.WATERFLY.NAME');
	}

    GetBoss()
    {
        return Waterfly;
    }
}
ItemHelper.InitializeItem(SummonScrollWaterfly);


class SummonScrollBubblebee extends SummonScroll
{
	constructor()
	{
		super('ENTITY.BUBBLEBEE.NAME');
	}

    GetBoss()
    {
        return Bubblebee;
    }
}
ItemHelper.InitializeItem(SummonScrollBubblebee);


class SummonScrollFrogo extends SummonScroll
{
	constructor()
	{
		super('ENTITY.FROGO.NAME');
	}

    GetBoss()
    {
        return Frogo;
    }
}
ItemHelper.InitializeItem(SummonScrollFrogo);

class SummonScrollLakeSpiderQueen extends SummonScroll
{
	constructor()
	{
		super('ENTITY.SPIDER.LAKE.QUEEN.NAME');
	}

    GetBoss()
    {
        return LakeSpiderQueen;
    }
}
ItemHelper.InitializeItem(SummonScrollLakeSpiderQueen);




class SummonScrollCelltipede extends SummonScroll
{
	constructor()
	{
		super('ENTITY.CELLTIPEDE.NAME');
	}

    GetBoss()
    {
        return Celltipede;
    }
}
ItemHelper.InitializeItem(SummonScrollCelltipede);



class SummonScrollTheCoveGuardian extends SummonScroll
{
	constructor()
	{
		super('ENTITY.THE_COVE_GUARDIAN.NAME');
	}

    GetBoss()
    {
        return TheCoveGuardian;
    }
}
ItemHelper.InitializeItem(SummonScrollTheCoveGuardian);





