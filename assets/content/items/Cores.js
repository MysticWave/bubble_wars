class Core1 extends ItemUpgradeAble
{
	constructor()
	{
		super(true);
		
		this.type = TYPE.CORE;
		this.slot = SLOT.CORE;
		
		this.Texture = "item.core.base";
        this.TextureAnimation = 
        {
            framesX: 5,
            framesY: 6,
            speed: 0.25,
            scale: 1.5
        };

		this.name = "ITEM.CORE.BASE.NAME";
        this.Description = 'ITEM.CORE.BASE.DESCRIPTION';
        this.Lore = 'ITEM.CORE.BASE.LORE';
		this.enchantSlots = 0;

		this.primary = [];

        this.Grade = GRADE.NORMAL;

        this.canBeSold = false;
        this.isUnique = true;

        this.Tries = 0;
	}

    getEnchantSlots()
    {
        if(this.Grade == GRADE.COMMON) return 1;
        if(this.Grade == GRADE.RARE) return 1;
        if(this.Grade == GRADE.MYTHICAL) return 2;
        if(this.Grade == GRADE.LEGENDARY) return 3;

        if(this.Grade == GRADE.ANGELIC) return 3;
        if(this.Grade == GRADE.DEMONIC) return 3;
        if(this.Grade == GRADE.DIVINE) return 3;

		return this.enchantSlots;
    }

    GetPrimaryBonuses()
	{
        if(this.Grade == GRADE.COMMON) return [new ItemBonus(STAT.MAX_HP, 20)];
        if(this.Grade == GRADE.RARE) return [new ItemBonus(STAT.MAX_HP, 40)];
        if(this.Grade == GRADE.MYTHICAL) return [new ItemBonus(STAT.MAX_HP, 60)];
        if(this.Grade == GRADE.LEGENDARY) return [new ItemBonus(STAT.MAX_HP, 80)];

        if(this.Grade == GRADE.ANGELIC) return [new ItemBonus(STAT.MAX_HP, 100)];
        if(this.Grade == GRADE.DEMONIC) return [new ItemBonus(STAT.MAX_HP, 100)];
        if(this.Grade == GRADE.DIVINE) return [new ItemBonus(STAT.MAX_HP, 100)];

		return this.primary;
	}

    onDropOut()
    {
        World.Player.addItemToInventory(this);
        this.Tries++;
        if(World.Player.hand === this) World.Player.hand = null;

        if(this.Tries >= 3)  World.Player.Hurt(999999, {deathQuote: 'DEATH_QUOTE.CORE_DROP'});
    }


    // Drop(x, y, ownerInventory, dirX)
	// {
	// 	console.log('nope');
	// }
}
ItemHelper.InitializeItem(Core1);