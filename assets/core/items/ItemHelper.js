class ItemHelper
{
	static Initialize()
	{
		this.totalItems = 0;
		this.Items = {};
		this.Recipes = {};
		this.ItemPrices = {};

		for(var i = 0; i < this.ItemsConstructors.length; i++)
		{
			var _item = this.ItemsConstructors[i];
			var temp = new _item();
			var name = temp.constructor.name;
			this.Items[name] = _item;

			this.totalItems++;
		}
	}

	static InitLocationDrop(location)
	{
		this.ItemsInLocation = this.ItemsInLocation ?? {};

		var entities = location.RoomInfo?.EntityTypes;
		for(var i in entities)
		{
			var entity = new World.EntityList[entities[i]]();
			var loot = entity.LootTable;
			if(!loot) continue;

			for(var j in loot.itemList)
			{
				this.ItemsInLocation[loot.itemList[j].Type] = location.GetId();
			}
		}
	}

	static CanBeBlessed(item, blessing)
	{
		if(isFunction(blessing.Require))
		{
			return blessing.Require(item);
		}
		return false;
	}

	static CanBeEnchanted(item, enchant)
	{
		if(!item.enchantAble) return null;
		var alreadyBonuses = [];
		var emptyIndex = null;


		if(isFunction(enchant.Require))
		{
			if(!enchant.Require(item)) return null;
		}

		var slots = item.getEnchantSlots?.() ?? 0;
		if(!slots) return null;

		for(var i = 0; i < slots; i++)
		{
			if(!item.Enchants[i])
			{
				if(emptyIndex == null) emptyIndex = i;
				continue;
			}

			if(item.Enchants[i].bonus)
			{
				if(enchant.bonus)
				{
					if(item.Enchants[i].bonus.name == enchant.bonus.name)
					{
						//uzyto enchantu z takim samym bonusem
						if(item.Enchants[i].bonus.name == enchant.bonus.name)
						{
							if(item.Enchants[i].bonus.isPercent == enchant.bonus.isPercent && 
								item.Enchants[i].bonus.value < enchant.bonus.value)
								{
									//tylko jesli zakladany enchant ma wieksza wartosc niz aktualny
									return i;
								}
						}
					}
				}
				
				alreadyBonuses.push(item.Enchants[i].bonus.name);
			}
		}

		if(emptyIndex != null)
		{
			if(enchant.bonus)
			{
				if(!alreadyBonuses.includes(enchant.bonus.name))
				{
					//przedmiot moze byc enchantowany
					return emptyIndex;
				}
			}
			else
			{
				return emptyIndex;
			}
		}

		return null;
	}

	static GetUpgradeChance(item, player, upgradeItem)
	{
		if(item.upgradeAble && item.upgradeLevel < 9)
		{
			var chance = item.upgradeChances[item.upgradeLevel];

			if(player)
			{
				if(player.stats)
				{
					chance += Math.floor(player.stats.LUCK / 10);
				}
			}

			if(upgradeItem)
			{
				if(upgradeItem.upgradeChance) chance += upgradeItem.upgradeChance;
			}

			chance = (chance > 100) ? 100 : chance;
			chance = (chance < 0) ? 0 : chance;

			return chance;
		}
		return 0;
	}

	static GetUpgradeCost(item, level = item.upgradeLevel)
	{
		var cost = 50;		//default upgrade cost is equal to 50% of current item value

		if(item.upgradeAble && level < 9)
		{
			if(item.upgradeCosts[level]) return item.upgradeCosts[level];
			var base_price = ItemHelper.GetBaseItemPrice(item);
			var current_value = (base_price * Math.pow((100 + cost) / 100, level));
			
			return Math.round(current_value * 50 / 100);		
		}
		return 0;
	}

	static getItemDropLocations(item)
	{
		var dropLocations = [];
		var locations = getLocationOrder();
		// var droppableItems = ItemHelper.GetItemsInLocationOrder();
		// if(droppableItems.indexOf(item) == -1) return [];
	
		for(var i = 0; i < locations.length; i++)
		{
			var availableDrop = locations[i].GetAvailableDrop();
			for(var j = 0; j < availableDrop.length; j++)
			{
				if(availableDrop[j] == item.GetId()) dropLocations.push(locations[i].GetId());
			}
		}

		return dropLocations;
	}

	static GetFilteredItems(_filter = null, toObject = false)
	{
		var items = [];
		var items_obj = {};
		for(var name in this.Items)
		{
			var item = Item.Get(name);
			if(!item) continue;
			if(_filter && !filter(_filter, item.GetFilter(), true)) continue;

			items.push(name);
			items_obj[name] = item;
		}

		if(toObject) return items_obj;
		return items;
	}

	static GetItemsInLocationOrder(_filter = null, getAll = false)
	{
		var items = [];
		var list = getLocationOrder();
		var name, i, j, itemName, item, drops;

		for(i = 0; i < list.length; i++)
		{
			name = list[i].constructor.name;
			if(World.Player.locationInfo[name]?.isCleared || getAll)
			{
				drops = list[i].GetAvailableDrop();
				// types = list[i].RoomInfo.EntityTypes;
				for(j = 0; j < drops.length; j++)
				{
					itemName = drops[j];
					item = Item.Get(itemName);
					if(!item) continue;
					if(_filter && !filter(_filter, item.GetFilter(), true)) continue;

					if(items.indexOf(itemName) == -1) items.push(itemName);
					
					// itemList[lootTable.itemList[k].Type] = true;
				}
			}
		}

		return items;
	}

	static GetBaseItemPrice(item)
	{
		var price = item.price;
		var base_price = 100;

		if(item.type == TYPE.ITEM) base_price = 10;		//materials are less valuable

		if(price == null) return 0;

		if(price == 0)
		{
			if(this.ItemPrices[item.GetId()]) return this.ItemPrices[item.GetId()];
			
			var locations = getLocationOrder(true);
			var locationDrop = this.ItemsInLocation[item.GetId()];

			var index = locations.indexOf(locationDrop);
			price = base_price * (index-1);
			if(index == -1) price = 1;	//this item cannot drop


			// var drops_in = ItemHelper.getItemDropLocations(item);
			// var locations = getLocationOrder(true);
			// var lowest_id = 9999;

			// for(var i = 0; i < drops_in.length; i++)
			// {
			// 	var id = locations.indexOf(drops_in[i]);
			// 	if(id < lowest_id) lowest_id = id;
			// }

			// price = base_price * lowest_id;
			// if(lowest_id == 9999) price = 1;	//this item cannot drop
		}

		if(price == 0) price = 1;
		item.price = price;
		this.ItemPrices[item.GetId()] = price;

		if(item.Grade)
		{
			var info = ItemHelper.GetGradeInfo(item.Grade);
			price *= info.price;
		}

		return price;
	}

	static GetUpgradesValue(item)
	{
		var upgradeCostRefund = 1;
		var price = 0;
		if(item.upgradeAble)
		{
			for(var i = 0; i < item.upgradeLevel; i++)
			{
				price += Math.round(ItemHelper.GetUpgradeCost(item, i) * upgradeCostRefund);
			}
		}

		return price;
	}

	static GetItemPrice(item, count = null)
	{
		var price = {buy: 0, sell: 0};

		if(!item.canBeSold) return {buy: 'none', sell: 'none'}

		var base_price = ItemHelper.GetBaseItemPrice(item);
		var re_buy_tax = 1;	//1.3
		
		count = count ?? item.count;

		// price.sell += ItemHelper.GetUpgradesValue(item);
		price.sell += base_price;
		price.sell *= count;

		if(item.isFromMerchant)
		{
			//items from merchant costs 10 times more
			price.buy = price.sell * 10;
			if(item.inShopPrice) price.buy = item.inShopPrice * count;
		}
		else
		{
			//% tax on re-buying items
			price.buy = price.sell * re_buy_tax;
		}

		return price;
	}

	static GetGradeInfo(grade)
	{
		var heart = Player.GetHeartValue() * 2;
		var info =
		{
			[GRADE.NORMAL]: {chance: 100, bonus: 0, price: 1},
			[GRADE.COMMON]: {chance: 50, bonus: 10, price: 2},
			[GRADE.RARE]: {chance: 30, bonus: 20, price: 5},
			[GRADE.MYTHICAL]: {chance: 10, bonus: 30, price: 10},
			[GRADE.LEGENDARY]: {chance: 5, bonus: 50, price: 20},

			[GRADE.ANGELIC]: {chance: 0, bonus: 75, price: 50, specialBonus: [new ItemBonus(STAT.MAX_HP, heart)]},
			[GRADE.DEMONIC]: {chance: 0, bonus: 75, price: 50, specialBonus: [new ItemBonus(STAT.ATTACK_DAMAGE, 20, true)]},
			[GRADE.DIVINE]: {chance: 0, bonus: 100, price: 100, specialBonus: 
				[
					new ItemBonus(STAT.MAX_HP, heart),
					new ItemBonus(STAT.ATTACK_DAMAGE, 20, true)
				]},
			[GRADE.TRANSCENDENTAL]: {chance: 0, bonus: 200, price: 1000}
		};

		return (info[grade]) ? info[grade] : info;
	}

	static GetGradesOrder(grade)
	{
		var order = 
		[
			GRADE.NORMAL,
			GRADE.COMMON,
			GRADE.RARE,
			GRADE.MYTHICAL,
			GRADE.LEGENDARY,
			GRADE.ANGELIC,
			GRADE.DEMONIC,
			GRADE.DIVINE,
			GRADE.TRANSCENDENTAL
		];

		if(!grade) return order;
		return order.indexOf(grade);
	}

	static CopyItem(item)
	{
		var type = item.constructor.name;
		var newItem = ItemHelper.getInstanceOfItem(type);
		if(newItem)
		{
			return  Object.assign(newItem, item);
		}
		return null;
	}

	static InitializeItem(_item)
	{
		this.ItemsConstructors = this.ItemsConstructors || [];
		this.ItemsConstructors.push(_item);
	}

	static InitializeRecipes()
	{
		for(var i = 0; i < this.ItemsConstructors.length; i++)
		{
			var item = new this.ItemsConstructors[i]();
			if(item.Recipe) this.Recipes[this.ItemsConstructors[i].name] = item.Recipe;
		}
	}
	
	static getInstanceOfItem(name, data = {})
	{
		if(this.Items[name])
		{
			var item = new this.Items[name]();
			for(var i in data)
			{
				item[i] = data[i];
			}
			return item;
		}
		
		return null;
	}
	
	
	static RandomItemBonus(item, onlyPerfect = false)
	{
		while(true)
		{
			var bonuses = getItemBonuses(item.type);
			var alreadyBonuses = new Array(Item.Bonuses.Length);
			var bonusId;
			var bonusName;
			var bonusLevel;
			var max_bonus_count = 0;

			var bonusesNumber = getItemGrade(item);
			var bonus_number = bonusesNumber[0];

			item.secondary = [[]];		//kasuje wszystkei aktualne bonusy

			var min_bonus_level = bonusesNumber[2];
			var max_bonus_level = bonusesNumber[3];

			for (var num = 0; num < alreadyBonuses.length; num++)
			{
				alreadyBonuses[num] = -1;
			}


			for (var num = 0; num < item.primary.length; num++)
			{
				if (item.primary[num] != null)
				{
					alreadyBonuses[num] = item.primary[num].id;
					//dodaje do tablicy obecnych bonusow, bonusy stale
				}
			}

			for (var num = 0; num < bonus_number; num++)
			{
				bonusId = Math.random() * Item.Bonuses.length;

				while ((!bonuses.Contains(bonusId)) || (alreadyBonuses.Contains(bonusId)))
				{
					//wylosowane id nei znajduje sie w tablicy dostepnych bonusow
					//lub
					//wylosowane id zostalo juz wczesniej wylosowane

					bonusId = Math.random() * Item.Bonuses.length;
				}

			//	bonusName = Item.Bonuses[bonusId].name;
				bonusLevel = random.Next(min_bonus_level, max_bonus_level + 1);

				if (bonusLevel > max_bonus_level)
				{
					bonusLevel = max_bonus_level;
				}


				if (bonusLevel == max_bonus_level)
				{
					max_bonus_count++;
				}


				if (max_bonus_count == bonus_number)
				{
					item.isPerfect = true;
				}
				else
				{
					item.isPerfect = false;
				}


				for (var num2 = 0; num2 < alreadyBonuses.length; num2++)
				{
					if (alreadyBonuses[num2] == -1)
					{
						alreadyBonuses[num2] = bonusId;
						break;
					}
				}

				item.secondary[num] = [ bonusId, bonusLevel ];

			}


			if ((!onlyPerfect) || (item.isPerfect))
			{
				break;
			}
		}

	}

	static isMaterial(item)
	{
		for(var name in this.Recipes)
		{
			if(this.isMaterialFor(item, name)) return true;
		}
		return false;
	}

	static isMaterialFor(item, recipe_id)
	{
		var id = item.GetId();
		var recipe = this.Recipes[recipe_id];
		if(!recipe) return false;

		for(var i = 0; i < recipe.Ingredients.length; i++)
		{
			var ingr = recipe.Ingredients[i];
			if(ingr[0] == id) return true;
		}
		return false;
	}

	static getAllRecipesFrom(item, toObj = false)
	{
		var recipes = [];
		var obj_recipes = {};
		if(item)
		{
			for(var name in this.Recipes)
			{
				if(this.isMaterialFor(item, name)) 
				{
					recipes.push(name);
					obj_recipes[name] = true;
				}
			}
		}

		if(toObj) return obj_recipes;
		return recipes;
	}

	static getRecipeFrom(items, getAll = false)
	{
		var all_recipes = {};
		var recipe = {};
		var itemsToUse = 0;
		var possible = [];

		for(var i in items)
		{
			var item = items[i];
			if(!item) continue;
			itemsToUse++;
			recipe = this.getAllRecipesFrom(item, true);
			all_recipes = {...all_recipes, ...recipe};
		}

		for(var name in all_recipes)
		{
			var rec = this.Recipes[name];
			var itemsUsed = 0;

			for(var i = 0; i < rec.Ingredients.length; i++)
			{
				var ing = rec.Ingredients[i];
				var gotThis = false;
				for(var j in items)
				{
					if(!items[j]) continue;

					if(items[j].GetId() == ing[0])
					{
						if(items[j].count >= ing[1] || getAll)
						{
							gotThis = true;
							itemsUsed++;
							break;
						}
					}
				}
				if(!gotThis && !getAll)
				{
					break;
				}
			}

			//return this recipe only if its using all of the items
			if(itemsToUse == itemsUsed && itemsUsed == rec.Ingredients.length && !getAll) return rec;
			if(itemsToUse == itemsUsed) possible.push(rec);
		}
		
		if(getAll) return possible;

		return null;
	}
	
	
	static getItemBonuses(type = TYPE.ITEM)
	{
		var bonuses = 
		{
			"Gun": [0, 1, 2, 3, 4, 5, 6, 7, 8]

		};
		
		bonuses[TYPE.SWORD] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

		if (bonuses[type])
		{
			return bonuses[type];
		}
		else
		{
			return [];
		}
	}
	
	static GetRandomGrade()
	{
		var grades = ItemHelper.GetGradeInfo();
		var highest_grade = 0;
		var order = ItemHelper.GetGradesOrder();

		for(var i = 0; i < order.length; i++)
		{
			var name = order[i];
			if(name == GRADE.NORMAL) continue;
			if(name == GRADE.ANGELIC) continue;	//demonic and angelic are same tier

			if(MathHelper.GetChance(grades[name].chance)) highest_grade = i;
		}

		var resultGrade = order[highest_grade];
		if(resultGrade == GRADE.DEMONIC) if(MathHelper.GetChance(50)) resultGrade = GRADE.ANGELIC;

		return resultGrade;
	}
}



class ItemRecipe
{
	constructor(item, ingredients = [])
	{
		this.Result = item;
		this.Ingredients = ingredients;
	}
}



// function testGrades(iterations)
// {
// 	var grades = {};
// 	for(var i = 0; i < iterations; i++)
// 	{
// 		var g = ItemHelper.GetRandomGrade();
// 		if(!grades[g]) grades[g] = 0;
// 		grades[g]++;
// 	}

// 	return grades;
// }
