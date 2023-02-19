class ItemUpgradeAble extends Item
{
	constructor(enchantAble = true)
	{
		super();

		this.upgradeLevel = 0;
		this.maxLevel = 9;
		this.maxStackSize = 1;
		this.stackAble = false;
		this.requiredLevel = 0;

		this.upgradeAble = true;
		this.equipAble = true;
		this.isPerfect = false;

		this.Element = ELEMENT.PHYSICAL;

		this.Grade = ItemHelper.GetRandomGrade();
		

		if(enchantAble)
		{
			this.enchantAble = true;
			this.enchantSlots = 0;
			this.Enchants = [];
		}
		
		this.upgradeCosts = [];
		this.upgradeChances = [100, 90, 80, 70, 60, 50, 40, 30, 20];
	}

	getEnchantSlots()
	{
		return this.enchantSlots;
	}

	Bless(blessing, simulate = false)
	{
		if(ItemHelper.CanBeBlessed(this, blessing))
		{
			blessing.Bless(this, simulate);
			return true;
		}

		return false;
	}

	Enchant(enchant)
	{
		var index = ItemHelper.CanBeEnchanted(this, enchant);
		if(index === null) return false;

		this.Enchants[index] = enchant;
		return true;
	}

	Upgrade(player, degradeOnFail)
	{
		if(this.CanBeUpgraded(player))
		{
			player.coins -= ItemHelper.GetUpgradeCost(this);
			if(MathHelper.GetChance(ItemHelper.GetUpgradeChance(this, player, player.hand)))
			{
				this.upgradeLevel++;
				return true;
			}
			else
			{
				if(degradeOnFail)
				{
					this.upgradeLevel--;
				}
			}
		}
		
		return false;
	}

	CanBeUpgraded(player)
	{
		if(!this.upgradeAble || this.upgradeLevel >= this.maxLevel) return false;

		if(ItemHelper.GetUpgradeCost(this) <= player.coins) return true;
		
		return false;
	}
}