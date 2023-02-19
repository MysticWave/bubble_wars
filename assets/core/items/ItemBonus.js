class ItemBonus
{
	constructor(id, value, isPercent = false)
	{
		this.name = Lang.Get(id);
		this.id = id;
		
		this.isPercent = isPercent;
		this.value = value;		
	}

	static GetBonusValue(stat_name, bonus_list = [])
	{
		for(var i = 0; i < bonus_list.length; i++)
		{
			var bonus = bonus_list[i];
			if(bonus.id == stat_name) return bonus.value;
		}
		return null;
	}
}