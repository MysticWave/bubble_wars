class Player
{
	constructor()
	{
		this.x = -1;
		this.y = -1;
		this.posX = 0;
		this.posY = 0;
		
		this.Width = 64;
		this.Height = 64;
		this.ageInTicks = 0;
		
		this.isWriting = false;
		this.isMoving = false;
		this.isAttacking = false;
		this.movedInRoom = false;

		
		this.canDodge = false;

		this.Difficulty = 0;

		this.Textures =
		{
			["Body"]: new ItemModel("bubble_no_shine"),
			[SLOT.CANNON]: new ItemModel("cannonBase", 34, 34, 2, 0, 55, itemCannonUpdate),
			[SLOT.DRIVE]: new ItemModel("driveBase", 81, 31, 2, 0, -42),
			["Core"]: new ItemModel("bubble", 80, 80, 2)
		};

		this.Colors =
		{
			["Body"]: null,
			[SLOT.CANNON]: null,
			[SLOT.DRIVE]: null,
			["Core"]: null
		};

		this.Cooltimes = {};

		this.specialAttackGauge = 0;

		this.Rotation = 0;
		this.Scale = 1;
		this.attackCharge = 0;
		this.bulletSery = 0;
		
		this.isDashing = false;
		// this.dashDuration = (Main.FPS / 60) * 10;
		// this.dashMultiplier = 5;
		// this.dashCooldown = 2;
		this.dashAngle = 0;
		this.dashStart = -99999;		//allows to dash immediately after starting game
		this.dashShadowsData = [];


		this.totalDamageReceived = 0;

		
		//podstawowe statystyki
		this.baseStats =
		{
			[STAT.ATTACK_SPEED]: 0,
			[STAT.BULLET_SPEED]: 1200,
			[STAT.BULLET_SERIES]: 1,
			[STAT.MOVEMENT_SPEED]: 600,
			[STAT.MAX_HP]: 100,
			[STAT.ATTACK_DAMAGE]: 0,
			[STAT.BULLETS_COUNT]: 1,
			[STAT.ATTACK_RANGE]: 0,
			// [STAT.ACCELERATION]: .25,
			[STAT.ACCELERATION]: 0.15,
			[STAT.BRAKE]: 1,
			[STAT.LIGHT_RANGE]: 200,
			[STAT.PIERCE]: 0,
			[STAT.CHARGE]: 0,
			[STAT.DEFENSE]: 0,

			[STAT.CR]: 0,
			[STAT.CD]: 100,

			[STAT.HARDNESS]: 0,
			[STAT.POWER]: 0,
			[STAT.DEXTERITY]: 0,
			[STAT.AMMO_COST]: 0,

			[STAT.BLOCK_CHANCE]: 0,

			[STAT.DAMAGE_ELECTRO]: 0,
			[STAT.DAMAGE_FIRE]: 0,
			[STAT.DAMAGE_POISON]: 0,
			[STAT.DAMAGE_ICE]: 0,
			[STAT.ELEMENTAL_MASTERY]: 0,

			[STAT.DASH_DURATION]: 0,
			[STAT.DASH_COOLTIME]: 0,
			[STAT.DASH_DISTANCE]: 0
		};



		this.SPstats =
		{
			//nazwa : [uzyte punkty, statystyka, wartosc / 1SP, %]
			[STAT.HARDNESS]: [0, STAT.DEFENSE, 1, false],
			[STAT.POWER]: [0, STAT.ATTACK_DAMAGE, 2, true],
			[STAT.DEXTERITY]: [0, STAT.ATTACK_SPEED, 2, true],

			[STAT.CHARGE]: [0, STAT.CHARGE, 1, false],
			[STAT.AMMO_COST]: [0, STAT.AMMO_COST, 1, false],
		};



		//aktualne statystyki
		this.stats =
		{
			[STAT.ATTACK_SPEED]: 0,
			[STAT.BULLET_SPEED]: 900,
			[STAT.BULLET_SERIES]: 1,
			[STAT.MOVEMENT_SPEED]: 300,
			[STAT.MAX_HP]: 10,
			[STAT.ATTACK_DAMAGE]: 0,
			[STAT.BULLETS_COUNT]: 1,
			[STAT.ACCELERATION]: 0,
			Level: 1,
			HP: 0,
			availableSlots: 63,
			availableSP: 0,
			usedSP: 0,
			[STAT.LIGHT_RANGE]: 0,
			[STAT.LIGHT_STRENGTH]: 0,
			[STAT.PIERCE]: 0,
			[STAT.CHARGE]: 0,
			[STAT.DEFENSE]: 0,

			[STAT.CR]: 0,
			[STAT.CD]: 100
		};
		
		this.additionalStats =
		{
			[STAT.ATTACK_SPEED]: 0,
			[STAT.BULLET_SPEED]: 0,
			[STAT.BULLET_SERIES]: 0,
			[STAT.MOVEMENT_SPEED]: 0,
			[STAT.MAX_HP]: 0,
			[STAT.ATTACK_DAMAGE]: 0,
			[STAT.BULLETS_COUNT]: 0
		};

		this.lockMove = 
		{
			Top: false,
			Down: false,
			Right: false,
			Left: false
		};

		this.lockKey =
		{
			"Bounce" : false
		};
		
		this.velocityX = 0;
		this.velocityY = 0;
		

		this.Bounce = true;
		this.isBouncing = false;
		this.oxygen = 0;
		this.coins = 0;
		
		this.isHurtAble = true;
		this.Slow = 0;
		this.reward = 0;
		this.hurted = false;
		this.shield = 0;
		this.timeSinceHurt = 0;
		this.allowAttack = true;
		this.timeInRoom = 120;
		this.immunityDuration = 1;
		this.immunityDurationMultiplier = 1;
		this.interactionWith = false;
		this.canInteractWith = [];


		this.HitBox = new HitBox();
		
		this.bulletStats = this.GetDefaultBulletStats();
		
		

		InGame.GUI.Inventory = new Inventory(this);
		InGame.GUI.PlayerStats = new PlayerStats(this);

		this.inventory = new Array(140);		//140 slotow inventory + sloty typu bron/zbroja
		this.equips = Player.GetEquipSlots();

		//starting weapon
		var starter = new CannonBase();
			starter.Enchant(new EnchantLock());
			starter.Grade = GRADE.NORMAL;
			starter.enchantAble = false;
		this.equips[SLOT.CANNON] = starter;
		this.equips[SLOT.CORE] = new Core1();
		this.equips[SLOT.CORE].Grade = GRADE.NORMAL;

		this.Effects = new Effects();
		
		this.requiredOxygen = 100;
		this.allowControl = true;
		this.allowMove = true;
		this.moveToPoint = null;
		this.lastPos = {x: 0, y: 0};

		this.recallTicks = 0;
		this.canInterruptRecall = true;
		this.isRecalling = false;
		this.recallTime = 0;
		this.recallRoom = null;
		this.allowSuperFastTravel = false;

		this.oxygenGainedInRoom = 0;

		this.alphaTransition = new Transition(0.2, 1, 0.15, true, 0.02, 0.02);
		this.scaleTransition = new Transition(1, 0.95, 0.25, true, 0.02, 0.02);

		this.locationInfo = Player.getDefaultLocationInfo();


		this.RunStats = this.getDefaultRunStats();

		this.UpdateStats();
		this.laserRotation = null;

		this.startLocation = 'Tutorial';
		this.stats.HP = this.stats.MAXHP;
		this.isAlive = true;

		this.shotPoints = 
		[
			{distance: 20, angle: 0}
		];

		this.Appearance =
		{
			Skin: 'SkinBase',
			Particle: 'bubble',
			Weapon: null,

			Scale: null,
			Rotation: null,
			Transparency: null,

			AvailableSkins: 
			{
				[SKIN.BASE]: true,
				[SKIN.BASEF]: true
			}
		};

		this.Skin;
		this.NPCData = 
		{
			MERCHANT: Player.CreateNPCData({met: true}),
			SENSEI: Player.CreateNPCData({met: true}),
		};

		this.Immunity = [];
		this.Weakness = [];
		this.Resistance = [];
		this.knockBackResistance = 0;
		this.canBeKnockedBack = true;

		for(var name in ELEMENT)
		{
			this.Immunity[name] = false;
			this.Weakness[name] = false;
			this.Resistance[name] = false;
		}


		this.isStunned = false;
		this.QuestData = {};


		this.invincibleScale = 2;
		this.isInvincible = false;

		this.canFastTravel = false;		//allows to TP to every cleared room
	}

	static CreateNPCData(data = {})
	{
		data.met = data.met ?? false;
		data.interactions = data.interactions ?? 0;
		data.displayName = data.displayName || '';

		return data;
	}

	static InitSkin(skin, variantFor = null)
    {
        if(!this.Skins) this.Skins = {};

        this.Skins[skin.name] = skin;

		var skin_id = skin.name.toUpperCase().replace('SKIN', '');
		SKIN[skin_id] = skin.name;

		if(variantFor) variantFor.InitVariant(skin);
    }

	getSpecialSlots()
	{
		return 5;
	}

	static GetEquipSlots(inOrder = false)
	{
		var equips = 
		{
			[SLOT.CANNON] : null,
			[SLOT.CORE] : null,
			[SLOT.COVER]: null,
			// [SLOT.DRIVE] : null,
			[SLOT.SPECIAL + "0"]: null,
			[SLOT.SPECIAL + "1"]: null,
			[SLOT.SPECIAL + "2"]: null,
			[SLOT.SPECIAL + "3"]: null,
			[SLOT.SPECIAL + "4"]: null
		};

		var order = 
		[
			SLOT.CANNON,
			SLOT.CORE,
			SLOT.COVER,
			// SLOT.DRIVE,

			SLOT.SPECIAL+"0",
			SLOT.SPECIAL+"1",
			SLOT.SPECIAL+"2",
			SLOT.SPECIAL+"3",
			SLOT.SPECIAL+"4",
		];

		if(inOrder) return order;
		return equips;
	}

	getSpecialCharge()
	{
		return this.stats[STAT.CHARGE];
	}

	Interact()
	{
		if(!this.canInteractWith.length) return false;
		if(this.interactionWith) return false;

		var close;
		var lowest_distance = 999999;
		for(var i = 0; i < this.canInteractWith.length; i++)
		{
			var entity = this.canInteractWith[i];
			var dist = MathHelper.GetDistance(this, entity);
			if(dist < lowest_distance) 
			{
				lowest_distance = dist;
				close = entity;
			}
		}

		this.interactionWith = close;

		return true;
	}

	Load()
	{
		var save = localStorage.getItem(Main.SaveSlot);
		if(save != 'null' && isJSON(save)) this.LoadData(save);

		World.LoadMap(this.startLocation, true);

		UI_Helper.setDifficultyInfo();
	}

	LoadData(save)
	{
		if(!save) return;
		var obj = JSON.parse(save);

		if(obj.Level) this.stats.Level = obj.Level;
		this.requiredOxygen = Player.GetRequiredOxygen(this.stats.Level);

		if(obj.oxygen) this.oxygen = obj.oxygen;
		if(obj.coins) this.coins = obj.coins;
		if(obj.HP) this.stats.HP = obj.HP;
		if(obj.usedSP) this.stats.usedSP = obj.usedSP;
		if(obj.startLocation) this.startLocation = obj.startLocation;
		if(obj.Difficulty) this.Difficulty = obj.Difficulty;
		if(obj.NPCData) this.NPCData = obj.NPCData;
		if(obj.QuestData) this.QuestData = obj.QuestData

		if(obj.SPstats)
		{
			for(var name in obj.SPstats)
			{
				if(!this.SPstats[name]) continue;
				this.SPstats[name][0] = obj.SPstats[name];
			}
		}

		var newItem = function(itemInfo)
		{
			var item = ItemHelper.getInstanceOfItem(itemInfo.type);

			if(!item) return null;


			if(itemInfo.Grade) item.Grade = itemInfo.Grade;
			if(itemInfo.count) item.count = itemInfo.count;
			if(itemInfo.isPerfect) item.isPerfect = itemInfo.isPerfect;
			if(itemInfo.upgradeLevel) item.upgradeLevel = itemInfo.upgradeLevel;
			if(itemInfo.secondary) item.secondary = itemInfo.secondary;


			if(itemInfo.Enchants)
			{
				for(var i = 0; i < itemInfo.Enchants.length; i++)
				{
					item.Enchants[i] = null;
					var enchant = ItemHelper.getInstanceOfItem(itemInfo.Enchants[i]);
					if(!enchant) continue;

					item.Enchants[i] = enchant;
				}
			}

			return item;
		}

		if(obj.inventory)
		{
			for(var i = 0; i < obj.inventory.length; i++)
			{
				var itemInfo = obj.inventory[i];
				this.inventory[i] = null;

				if(!itemInfo) continue;
				if(!itemInfo.type) continue

				this.inventory[i] = newItem(itemInfo);
			}
		}

		if(obj.equips)
		{
			for(var slot in obj.equips)
			{
				var itemInfo = obj.equips[slot];
				this.equips[slot] = null;

				if(!itemInfo) continue;
				if(!itemInfo.type) continue

				this.equips[slot] = newItem(itemInfo);
			}
		}

		
		if(obj.locationInfo)
		{
			for(var name in obj.locationInfo)
			{
				this.locationInfo[name] = obj.locationInfo[name];
			}
		}


		if(obj.Appearance)
		{
			for(var name in obj.Appearance)
			{
				this.Appearance[name] = obj.Appearance[name];
			}
		}

		

		this.UpdateStats();
	}

	Save()
	{
		if(Main.inTestMode || !this.locationInfo.Tutorial?.isCleared) return;
		
		var save = {};

		save.Level = this.stats.Level;
		save.oxygen = this.oxygen;
		save.coins = this.coins;
		save.HP = this.stats.HP;
		save.SPstats = {};
		save.usedSP = this.stats.usedSP;
		save.startLocation = World.Location.constructor.name;
		save.Difficulty = this.Difficulty;
		save.NPCData = this.NPCData;
		save.QuestData = this.QuestData

		for(var name in this.SPstats)
		{
			save.SPstats[name] = this.SPstats[name][0];
		}

		save.inventory = [];
		save.equips = {};




		var _itemInfo = function(item)
		{
			var itemInfo = {};

				itemInfo.type = item.constructor.name;
				itemInfo.Grade = item.Grade;
				itemInfo.count = item.count;
				itemInfo.isPerfect = item.isPerfect;
				itemInfo.upgradeLevel = item.upgradeLevel;
				itemInfo.Enchants = [];
				
				for(var i = 0; i < item.getEnchantSlots?.(); i++)
				{
					itemInfo.Enchants[i] = null;
					if(!item.Enchants[i]) continue;
					itemInfo.Enchants[i] = item.Enchants[i].constructor.name;
				}

			return itemInfo;
		}


		for(var i = 0; i < this.inventory.length; i++)
		{
			var item = this.inventory[i];
			
			if(!item)
			{
				save.inventory[i] = null;
				continue;
			}

			save.inventory[i] = _itemInfo(item);
		}


		for(var slot in this.equips)
		{
			var item = this.equips[slot];

			if(!item)
			{
				save.equips[slot] = null;
				continue;
			}

			save.equips[slot] = _itemInfo(item);
		}

		save.locationInfo = this.locationInfo;
		save.Appearance = this.Appearance;

		localStorage.setItem(Main.SaveSlot, JSON.stringify(save));
	}

	static getDefaultLocationInfo()
	{
		var locationInfo = {};

		for(var locationName in World.LocationList)
		{
			locationInfo[locationName] = 
			{
				isCleared: false,
				rank: null
			};
		}

		locationInfo.Village.isCleared = true;

		return locationInfo;
	}

	getDefaultRunStats()
	{
		var stats = 
		{
			timeInLocation: 0,
			defeatedBosses: 0,
			defeatedEnemies: 0,
			foundSecretRooms: 0,
			totalExperienceEarned: 0,
			totalGoldEarned: 0,
			totalShots: 0,
			missedShots: 0,

			hpLostInRoom: 0,
			roomsInfo: {},

			setRoomInfo: function()
			{
				var id = World.currentRoom.id;
				var performance = 100 - (this.hpLostInRoom / World.Player.stats.MAXHP * 100);
					performance = (performance > 100) ? 0 : performance;
					performance = (performance < 0) ? 0 : performance;

				this.roomsInfo[id] = performance;
				this.hpLostInRoom = 0;
			},

			getRunInfo: function()
			{

				//nie wyswietli statystyk jesli nie pokonano bossa
				if(this.defeatedBosses == 0) return null;


				var ranks = 
				[
					//[performance (%), rankName]
					[0, 'F'],

					[30, 'D'],
					[40, 'D+'],

					[45, 'C-'],
					[50, 'C'],
					[60, 'C+'],

					[65, 'B-'],
					[70, 'B'],
					[80, 'B+'],

					[85, 'A-'],
					[90, 'A'],
					[93, 'A+']
				];


				var runInfo =
				{
					performance: 0,
					accuracy: 0,
					rank: 'F',
					bossChambers: World.Location.RoomInfo.BossChambers,
					secretChambers: World.Location.RoomInfo.SecretChambers
				};

				var totalRooms = 0;
				for(var i = 0; i < World.Location.Rooms.length; i++)
				{
					if(World.Location.Rooms[i] != null) totalRooms++;
				}

				var roomsEntered = 0;
				var performanceSum = 0;
				for(var id in this.roomsInfo)
				{
					performanceSum += this.roomsInfo[id];
					roomsEntered++;
				}

				var performance = performanceSum / roomsEntered;
				var accuracy = 100 - (this.missedShots / this.totalShots * 100);
				var rank;

				runInfo.performance = performance;
				runInfo.accuracy = accuracy;

				if(performance >= 95)
				{
					//dodatkowe wymagania
					rank = "S-";

					//nie stracil ani jednego punktu zdrowia
					if(performance == 100)
					{
						rank = "S";

						//pokonal wszystkie dostepne bossy
						if(this.defeatedBosses == World.Location.RoomInfo.BossChambers)
						{
							if(accuracy >= 90)
							{
								rank = 'S+';
							}
						}
					}

					runInfo.rank = rank;

					return runInfo;
				}

				for(var i = 0; i < ranks.length; i++)
				{
					if(ranks[i][0] <= performance)
					{
						rank = ranks[i][1];
					}
				}

				runInfo.rank = rank;

				return runInfo;
			}
		};

		return stats;
	}

	static GetHeartValue()
	{
		//how many HP contains half heart
		return 10;
	}

	static GetRequiredOxygen(level)
	{
		var requiredOxygen = 100;

		for(var i = 1; i < level; i++)
		{
			requiredOxygen += Math.round(Math.sqrt(requiredOxygen) * 10);
		}

		return requiredOxygen;
	}
	
	GetDefaultBulletStats()
	{
		var stats = 
		{
			Type: "BulletBubble",
			Scale: 1,
			Pierce: 0,
			Bounce: false,
			bounceTime: 5,
			Color: null,
			DeathSound: "effect.BubblePop"
		};

		return stats;
	}

	UpdateBulletStats()
	{
		this.bulletStats.spd = this.stats.BULLET_SPEED;
		this.bulletStats.damage = this.stats.AD;
		this.bulletStats[STAT.ATTACK_RANGE] = this.stats[STAT.ATTACK_RANGE];
		this.bulletStats.Pierce = this.stats[STAT.PIERCE];
	}

	GetDamageValues(AD = false, element = ELEMENT.PHYSICAL)
	{
		if(isObject(AD))
		{
			if(AD.min != null && AD.max != null) return AD;
		}

		var diff = 20; 	//%
		var damage = this.stats.AD;
		if(AD) damage = AD;
		if(element == ELEMENT.THUNDER) return {min: 1, max: ((damage+this.stats[STAT.DAMAGE_ELECTRO])*(100+this.stats[STAT.ELEMENTAL_MASTERY])/100)};
		if(element == ELEMENT.ICE) damage = ((damage+this.stats[STAT.DAMAGE_ICE])*(100+this.stats[STAT.ELEMENTAL_MASTERY])/100);
		if(element == ELEMENT.FIRE) damage = ((damage+this.stats[STAT.DAMAGE_FIRE])*(100+this.stats[STAT.ELEMENTAL_MASTERY])/100);

		var diffValue = Math.round(damage * diff / 100);

		return {min: (damage - diffValue), max: (damage + diffValue)};
	}

	Recall(time, room, location, canInterruptRecall = true)
	{
		this.isRecalling = true;
		this.recallTime = time * Main.FPS;
		this.recallRoom = room;
		this.canInterruptRecall = canInterruptRecall;
		this.recallTicks = 0;
		if(location)
		{
			if(location instanceof Location)
			{
				location = location.name;
			}
		}
		this.recallLocation = location;
	}
	
	UpdateStats()
	{
		var statsPerLevel = //wartosc zwiekszenia statystyki co 1 lv;
		{			
		};
		
		var percent_bonuses = {};

		
		
		for(var stat_name in this.baseStats)
		{
			var base_stat = this.baseStats[stat_name];
			
			if(statsPerLevel[stat_name]) this.stats[stat_name] = base_stat + ( (this.stats.Level - 1) * statsPerLevel[stat_name] );
			else this.stats[stat_name] = base_stat;
		}

		var SP_STAT, STAT_NAME, value, isPercent, invested;
		this.stats.usedSP = 0;
		var maxSP = (this.stats.Level - 1) * 3;
		for(var property in this.SPstats)
		{
			SP_STAT = this.SPstats[property];
			invested = SP_STAT[0];
			STAT_NAME = SP_STAT[1];
			value = SP_STAT[2];
			isPercent = SP_STAT[3];

			this.stats.usedSP += invested;

			if(isPercent) percent_bonuses[STAT_NAME] = invested * value;
			else this.stats[STAT_NAME] += invested * value;
		}

		this.stats.availableSP = maxSP - this.stats.usedSP;

		//sprawdza czy ilosc uzytych sp jest poprawna
		if(this.stats.usedSP > maxSP) Security.ReportProblem(SECURITY_PROBLEM.SP);

		var enchantBullets = {n: 0, p: 0};
		
		var eq = Player.GetEquipSlots();
		for(var slot_name in eq)
		{
			var item = this.equips[slot_name];
			
			if(item)
			{
				var gradeInfo = ItemHelper.GetGradeInfo(item.Grade);
				var primary = item.GetPrimaryBonuses();
				if(primary)
				{			//przedmiot posiada bonusy glowne
					for(var i = 0; i < primary.length; i++)
					{
						var bonus = primary[i];
						var stat_name = bonus.id;

						var value = bonus.value;
							
						if(bonus.isPercent)
						{	
							//wartosc bonusu jest podana w %
							percent_bonuses[stat_name] = (percent_bonuses[stat_name]) ? percent_bonuses[stat_name] + value : value;
						}
						else
						{
							this.stats[stat_name] += value;
						}
					}
				}

				var ench_slots = item.getEnchantSlots();
				if(ench_slots && item.enchantAble)
				{
					for(var i = 0; i < ench_slots; i++)
					{
						var enchant = item.Enchants[i];
						if(!enchant || enchant instanceof EnchantLock) continue;
						
						var stat_name = enchant.bonus.id;
						var value = enchant.bonus.value;

						if(stat_name == STAT.BULLETS_COUNT)
						{
							if(enchant.bonus.isPercent)
							{
								enchantBullets.p += value;
							}
							else
							{
								enchantBullets.n += value;
							}

							continue;
						}


						if(gradeInfo)
						{
							if(gradeInfo.bonus)
							{
								value = value + Math.ceil((value * gradeInfo.bonus) / 100);
							}
						}


						
						if(enchant.bonus.isPercent)
						{
							percent_bonuses[stat_name] = (percent_bonuses[stat_name]) ? percent_bonuses[stat_name] + value : value;
						}
						else
						{
							this.stats[stat_name] += value;
						}
					}
				}

				if(gradeInfo.specialBonus && item.enchantAble)
				{
					for(var i = 0; i < gradeInfo.specialBonus.length; i++)
					{
						var bonus = gradeInfo.specialBonus[i];
						value = bonus.value;
						stat_name = bonus.id;

						if(bonus.isPercent)
						{
							percent_bonuses[stat_name] = (percent_bonuses[stat_name]) ? percent_bonuses[stat_name] + value : value;
						}
						else
						{
							this.stats[stat_name] += value;
						}
					}
					
				}
			}
		}

		for(var stat_name in this.baseStats)
		{			
			if(stat_name in percent_bonuses)
			{
				if(stat_name == STAT.ATTACK_SPEED)
				{
					//attack speed wymaga wiekszej precyzji
					this.stats[stat_name] = Math.round((this.stats[stat_name] + (this.stats[stat_name] * percent_bonuses[stat_name] / 100)) * 100 ) / 100;
				}
				else
				{
					this.stats[stat_name] += Math.round((this.stats[stat_name] * percent_bonuses[stat_name]) / 100);
				}
			}
		}
		
		// this.stats.HP = this.stats.MAXHP - missingHealt;
		
		var heartValue = Player.GetHeartValue();

		this.stats.MAXHP = Math.floor(this.stats.MAXHP / (2 * heartValue)) * (2 * heartValue);
		// this.stats.HP = Math.floor(this.stats.HP / (2 * heartValue)) * (2 * heartValue);

		if(this.stats.HP > this.stats.MAXHP)
		{		
			//obecne zycie nie moze byc wieksze od maksymalnego
			this.stats.HP = this.stats.MAXHP;
		}


		for(var property in this.stats)
		{
			if(property == "HP") continue;
			if(this.additionalStats[property])
			{
				var value = this.additionalStats[property];

				//te statystyki sa procentowe
				if((property == "MAXHP") || (property == "AD"))
				{
					this.stats[property] += Math.round((value * this.stats[property]) / 100);
				}
				else
				{
					this.stats[property] += value;
				}
			}
		}
		
		if(this.stats.AD <= 0) this.stats.AD = 1;
		if(this.stats.CR < 0) this.stats.CR = 0;
		if(this.stats.CR > 100) this.stats.CR = 100;
		if(this.stats[STAT.BLOCK_CHANCE] > 50) this.stats[STAT.BLOCK_CHANCE] = 50;
		

		this.bulletStats = this.GetDefaultBulletStats();

		if(this.equips[SLOT.CANNON])
		{
			this.stats.BULLETS_COUNT = (this.equips[SLOT.CANNON].BULLETS_COUNT) ? this.equips[SLOT.CANNON].BULLETS_COUNT : 1;
			this.bulletStats.Type = this.equips[SLOT.CANNON].BulletType;

			if(enchantBullets.n)
			{
				this.stats.BULLETS_COUNT += enchantBullets.n;
			}
			else if(enchantBullets.p)
			{
				this.stats.BULLETS_COUNT += Math.round((this.stats.BULLETS_COUNT * enchantBullets.p) / 100);
			}

			var type = new (Projectile.Types()[this.bulletStats.Type])();
		}


		
	}

	LevelUp()
	{
		this.oxygen -= this.requiredOxygen;
		this.stats.Level++;
		this.stats.availableSP += 3;
		// this.baseStats.MAXHP += 1;
		// this.baseStats.AD++;
		// this.baseStats.SPD += 10;
		
		if(this.oxygen < 0)
		{
			this.oxygen = 0;
		}

		this.UpdateStats();

		this.stats.HP = this.stats.MAXHP;

		this.requiredOxygen = Player.GetRequiredOxygen(this.stats.Level);

		var stats = {};
			stats.spd = 900;
			stats.damage = this.stats.AD * 10;
			stats.Type = "HolyBullet";
			stats[STAT.ATTACK_RANGE] = 9999;
			stats.Scale = 4;
		AI_ShotOnCircle.StaticShoot(this, stats, 64);
		Camera.Shake(2, true, 25);
		InGame.showLevelUpMessage(true);
	}

	UseSPpoint(statName)
	{
		if(!this.SPstats[statName]) return;

		//sprawdza czy moze dodac punkty
		if(this.stats.availableSP <= 0) return;
		

		this.SPstats[statName][0]++;
		this.UpdateStats();
	}

	ResetSPpoints()
	{
		for(var property in this.SPstats)
		{
			this.SPstats[property][0] = 0;
		}

		this.UpdateStats();
	}

	UpdateHP()
	{
		if(this.lastHP != this.stats.HP || this.lastMAXHP != this.stats.MAXHP)
		{
			UI_Helper.UpdatePlayerHealthBar(this.stats.HP, this.stats.MAXHP);
		}
		
		this.lastHP = this.stats.HP;
		this.lastMAXHP = this.stats.MAXHP;
	}

	CompleteLocation(id)
	{
		this.locationInfo[id].isCleared = true;
		this.Save();
	}

	ChangeSkin(skin)
	{
		if(!this.Appearance.AvailableSkins[skin] && skin != SKIN.BASE && skin != SKIN.BASEF) return;
		if(!Player.Skins[skin]) skin = SKIN.BASE;
		
		var s = Player.Skins[skin];

		this.Skin = new s(this);
		this.Appearance.Skin = skin;
	}
	
	Update()
	{
		if(!this.isAlive) return;
		this.ageInTicks++;

		this.canDodge = false;
		this.isHurtAble = true;
		this.canInteractWith = [];
		this.isBouncing = false;
		this.isAttacking = false;

		if(!this.Skin || this.Skin.constructor.name != this.Appearance.Skin) this.ChangeSkin(this.Appearance.Skin);
		this.Skin.Update();
		this.GetCurrentWeaponModel()?.Update(this);

		if(this.interactionWith) this.allowMove = false;

		if(!InGame.GUI.RunInfo.Open) this.RunStats.timeInLocation++;
		if(this.hurted) this.timeSinceHurt++;

		if(!this.isStunned) this.Rotation = (MathHelper.getAngle2([Mouse.x, Mouse.y], [this.posX, this.posY]) + 270)%360;
		// if(this.x < 0) this.x = World.CenterPoint.x;
		// if(this.y < 0) this.y = World.CenterPoint.y;

		if(this.stats.HP <= 0) 
		{
			this.Kill();
			this.UpdateHP();
			return;
		}
		if(this.oxygen >= this.requiredOxygen) this.LevelUp();

		this.UpdateHP();

		UI_Helper.setBarProgress('player_attack_charge', (this.attackGauge * 100) + '%');

		if(this.equips[SLOT.CANNON]?.requiredMP)
		{
			set('#player_attack_bars_container', 'dataset.showspecialcharge', 'true', true);
			UI_Helper.setBarProgress('player_special_attack_charge', (this.specialAttackGauge * 100) + '%');
		}
		else
		{
			set('#player_attack_bars_container', 'dataset.showspecialcharge', 'false', true);
		}
		

		var exp_progress = this.oxygen / this.requiredOxygen * 100;
		var dmg = this.GetDamageValues();
		var as = (this.stats.ATTACK_SPEED == parseInt(this.stats.ATTACK_SPEED)) ? this.stats.ATTACK_SPEED + ".0" : this.stats.ATTACK_SPEED;

		UI_Helper.setBarProgress('player_level_bar', exp_progress + '%');
		set('#player_level', 'dataset.level', Lang.Get('STAT.LEVEL') + ': ' + this.stats.Level, true);
		set('#player_stat_exp', 'innerText', this.oxygen +' / '+ this.requiredOxygen, true);

		set('#player_stat_hp', 'innerText', this.stats.HP +' / '+ this.stats.MAXHP, true);
		set('#player_stat_def', 'innerText', this.stats.DEFENSE, true);
		set('#player_stat_ad', 'innerText', dmg.min + " - " + dmg.max, true);
		set('#player_stat_attack_speed', 'innerText', as, true);
		set('#player_stat_attack_range', 'innerText', this.stats.ATTACK_RANGE, true);
		set('#player_stat_spd', 'innerText', this.stats.SPD, true);

		set('#player_health_container', 'dataset.poisoned', this.isPoisoned, true);
		set('#shader_poisoning', 'dataset.open', this.isPoisoned, true);

		for(var name in this.SPstats)
		{
			var value = this.SPstats[name][0];
			set('#player_stat_'+name.toLowerCase(), 'innerText', value, true);
		}


		set('#player_stat_available_sp', 'dataset.sp', this.stats.availableSP, true);
		set('#player_oxygen', 'innerText', Style.DottedText(this.coins), true);

		UI_Helper.updateCooltimeIcons();

		this.Effects.Update(this);
		this.UpdateEquipTicks();
		this.UpdateDash();

		this.lastPos = {x: this.x, y: this.y};
		this.posX = (canvas.width / 2) - this.Width / 2;
		this.posY = (canvas.height / 2) + this.Height / 2;

		this.UpdateRecall();

		if(this.timeInRoom < Main.FPS || (this.timeSinceHurt < this.immunityDuration * this.immunityDurationMultiplier * Main.FPS && this.hurted))
		{
			this.isHurtAble = false;
		}
		

		
		Collision.Check(this);

		
		if(!this.isWriting && !this.isStunned)
		{
			if(this.allowControl && !this.interactionWith)
			{
				if(Mouse.click && Mouse.focus == Graphic.mainCanvas)
				{
					if(this.hand)
					{
						Mouse.click = false;
						var dir = (Mouse.x < this.posX) ? -1 : 1;
						if(this.hand.Drop(this.x, this.y, null, dir)) this.hand = null;
						InventoryGUI.UpdateHand();
					}
					else if(this.allowAttack)
					{
						this.isAttacking = true;
					}
				}
			}



			this.MovementUpdate();
			
			
			if((Settings.Controls.StateBounce) && (!this.lockKey.Bounce))
			{
				this.isBouncing = true;
				this.lockKey.Bounce = true;
			}
			else if(!Settings.Controls.StateBounce)
			{
				this.lockKey.Bounce = false;
			}


			if(this.canInterruptRecall && (this.isMoving || this.isDashing || this.velocityX || this.velocityY))
			{
				this.isRecalling = false;
				this.movedInRoom = true;
			}


			
			var distance = MathHelper.GetDistance([this.x, this.y], [World.CenterPoint.x, World.CenterPoint.y]);
			
			this.allowControl = true;
			
			var isOutOfBubble = (distance > World.Radius) ? true : false;
			if( (distance > World.Radius - 64) && !isOutOfBubble && this.allowControl && !Main.BorderLess && !World.isChangingLocation)
			{
				// this.isBouncing = true;
				var s = (((distance+64)-World.Radius) / 64) * (this.stats.SPD * 1.2);
				var motion = Motion.Get([this.x, this.y], [World.CenterPoint.x, World.CenterPoint.y], s);
				this.ApplyMove(motion);
			}
			
			if(this.isBouncing)
			{
				this.velocityX *= -1;
				this.velocityY *= -1;
			}

			if(Mouse.rightClick) this.Dash();

			this.WeaponUpdate();
		}

		this.allowAttack = true;
		this.allowMove = true;

		this.HitBox.Update(this);
		this.Skin.Update();
	}

	UpdateEquipTicks()
	{
		for(var slot in this.equips)
		{
			var item = this.equips[slot];
			if(item) if(isFunction(item.onEquipTick)) item.onEquipTick(this);
		}
	}

	onLocationExit()
	{
		var runInfo = this.RunStats.getRunInfo();
		if(runInfo)
		{
			var loc_id = World.Location.constructor.name;
			var ranks = ['F', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+', 'S', 'S+', 'SS', 'SSS'];
			var currentRank = get(this, 'locationInfo.'+loc_id+'.rank');
			var rank = runInfo.rank;
			
			if(currentRank)
			{
				var currentIndex = ranks.indexOf(currentRank);
				var newIndex = ranks.indexOf(rank);

				if(newIndex < currentIndex) rank = currentRank;
			}

			InGame.GUI.RunInfo.open(this.RunStats);

			set(this, 'locationInfo.'+loc_id+'.rank', rank);
			this.Save();
		}
	}

	UpdateRecall()
	{
		if(this.isRecalling)
		{
			this.recallTicks++;

			InGame.backgroundTransparency = this.recallTicks / this.recallTime;

			if(this.recallTicks == this.recallTime)
			{
				if(this.recallRoom && !this.recallLocation)
				{
					World.currentRoom.Quit();
					this.recallRoom.Enter();
					this.x = World.CenterPoint.x;
					this.y = World.CenterPoint.y;
				}

				if(this.recallLocation)
				{
					if(this.recallLocation != World.Location.Name)
					{
						this.onLocationExit();
						World.Location.Exit();
						World.LoadMap(this.recallLocation, true);
					}
				}
			}

			/*
			var isRunInfo = this.RunStats.getRunInfo();

			if(this.recallTicks == this.recallTime - 2)
			{
				if(isRunInfo)
				{
					//open stats gui
					InGame.GUI.RunInfo.Open = true;
				}
			}

			if(this.recallTicks == this.recallTime - 1)
			{
				if(isRunInfo && InGame.GUI.RunInfo.Open)
				{
					this.recallTicks =  this.recallTime - 2;
				}
			}

			*/
			

			//animacja pojawiania sie gracza
			if(this.recallTicks > this.recallTime)
			{
				this.allowControl = false;
				var animationTime = (Main.FPS  / 3);
				var toEnd = this.recallTime + animationTime;
				InGame.backgroundTransparency = 1 - ((this.recallTicks - this.recallTime) / animationTime);
				if(this.recallTicks >= toEnd)
				{
					this.isRecalling = false;
					InGame.backgroundTransparency = 0;
					this.timeInRoom = (!World.currentRoom.isCleared) ? 0 : this.timeInRoom;
				}
			}
		}
	}

	UpdateCooltime(id, current, required, icon, isEffect = false)
	{
		var p = Math.round(current / required * 100);
		if(isEffect) p = 100 - p;
		if(p < 0) p = 0;
		if(p > 100) p = 100;

		if(!icon) icon = id;

		this.Cooltimes[id] = 
		{
			current: current,
			required: required,
			progress: p,
			icon: icon,
			isEffect: isEffect
		};
	}

	canDash()
	{
		if(this.isDashing) return false;
		if(!this.allowMove) return false;
		if(!this.allowControl) return false;
		if(this.interactionWith) return false;
		// if(!this.isMoving) return false;
		if(!this.stats[STAT.DASH_DURATION] || !this.stats[STAT.DASH_COOLTIME]) return false;
		if(this.dashStart + this.stats[STAT.DASH_DURATION] + (this.stats[STAT.DASH_COOLTIME] * Main.FPS) >= this.ageInTicks) return false;
		return true;
	}

	GetDashDistance(multiplier = this.stats[STAT.DASH_DISTANCE], duration = this.stats[STAT.DASH_DURATION])
	{
		return Math.ceil(((this.GetSPD() * multiplier) / (Main.FPS / duration)) / 10) * 10;
	}

	UpdateDash()
	{
		var cd = this.stats[STAT.DASH_COOLTIME];
		var duration = this.stats[STAT.DASH_DURATION];
		var multiplier = this.stats[STAT.DASH_DISTANCE];

		var required = (cd * Main.FPS) + duration;
		var current = this.ageInTicks - (this.dashStart);
		
		if(required) this.UpdateCooltime('DASH', current, required);

		if(!this.isDashing) return;

		if(this.dashStart + duration < this.ageInTicks) 
		{
			this.isDashing = false;
			this.dashEnd = this.ageInTicks;
		}

		var spd = this.GetSPD();
		var delta = Main.DELTA;

		spd *= multiplier;

		var to = MathHelper.lineToAngle([this.x, this.y], spd * delta, this.dashAngle);
		if(MathHelper.GetDistance([to.x, to.y], World.CenterPoint) < World.Radius)
		{
			this.x = to.x;
			this.y = to.y;
		}

		this.dashShadowsData.push({x: this.x, y: this.y, Rotation: this.Appearance.Rotation, times: 0});
	}

	Dash()
	{
		if(!this.canDash()) return;

		this.isDashing = true;
		this.dashStart = this.ageInTicks;

		

		if(Settings.Controls.AlwaysDashTowardCursor || 
		(!Settings.Controls.StateMoveLeft && !Settings.Controls.StateMoveRight && !Settings.Controls.StateMoveUp && !Settings.Controls.StateMoveDown))
		{
			this.dashAngle = MathHelper.getAngle2([this.x - Camera.xView, this.y - Camera.yView], [Mouse.x, Mouse.y]);	//dash toward cursor
		}
		else
		{
			this.dashAngle = MathHelper.getAngle2([this.x, this.y], [this.x + this.velocityX, this.y + this.velocityY]);	//dash toward current move direction
		}
		
		this.dashShadowsData = [];
	}

	GetSPD()
	{
		var spd = this.stats.SPD * ((100 - this.Slow) / 100);
		return spd;
	}

	MovementUpdate()
	{
		this.isMoving = false;

		var spd = this.GetSPD();
		var delta = Main.DELTA;
		var acc = this.stats.ACCELERATION;
		var brake  = this.stats.BRAKE;

		var movingLeft, movingRight, movingUp, movingDown;

		if(this.allowControl && !this.interactionWith && !this.isDashing)
		{
			if(Settings.Controls.StateMoveLeft && !this.lockMove.Left) movingLeft = true;
			if(Settings.Controls.StateMoveRight && !this.lockMove.Right) movingRight = true;
			if(Settings.Controls.StateMoveUp && !this.lockMove.Top) movingUp = true;
			if(Settings.Controls.StateMoveDown && !this.lockMove.Down) movingDown = true;
		}

		if(movingLeft || movingRight || movingUp || movingDown) this.isMoving = true;

		var m = 1;

		if(movingLeft)
		{
			m = 1;
			if(this.velocityX > -spd)
			{
				if(this.velocityX > spd / 2) m = .5;		//make it faster if player was moving right and now want to change direction to the left.
				this.velocityX -= spd / (acc * m) * delta;
				if(this.velocityX < -spd) this.velocityX = -spd;
			}
		}


		if(movingRight)
		{
			m = 1;
			if(this.velocityX < spd)
			{
				if(this.velocityX < -spd / 2) m = .5;		//make it faster if player was moving left and now want to change direction to the right.
				this.velocityX += spd / (acc * m) * delta;
				if(this.velocityX > spd) this.velocityX = spd;
			}
		}




		if(movingUp)
		{
			m = 1;
			if(this.velocityY > -spd)
			{
				if(this.velocityY > spd / 2) m = .5;		//make it faster if player was moving down and now want to change direction to the up.
				this.velocityY -= spd / (acc * m) * delta;
				if(this.velocityY < -spd) this.velocityY = -spd;
			}
		}


		if(movingDown)
		{
			m = 1;
			if(this.velocityY < spd)
			{
				if(this.velocityY < -spd / 2) m = .5;		//make it faster if player was moving up and now want to change direction to the bottom.
				this.velocityY += spd / (acc*m) * delta;
				if(this.velocityY > spd) this.velocityY = spd;
			}
		}


		//stop player if both keys are hold or both are not
		if((movingLeft && movingRight) || (!movingLeft && !movingRight)) 
		{      
            if(this.velocityX < 0) 
			{       
                this.velocityX += spd / brake * delta;
                if(this.velocityX > 0) this.velocityX = 0;
            }
            else if(this.velocityX > 0) 
			{
                this.velocityX -= spd / brake * delta;
                if(this.velocityX < 0) this.velocityX = 0;
            }
        }

		// console.log(this.ageInTicks + " / " + this.velocityX);


		if((movingUp && movingDown) || (!movingUp && !movingDown)) 
		{      
            if(this.velocityY < 0) 
			{       
                this.velocityY += spd / brake * delta;
                if(this.velocityY > 0) this.velocityY = 0;
            }
            else if(this.velocityY > 0) 
			{
                this.velocityY -= spd / brake * delta;
                if(this.velocityY < 0) this.velocityY = 0;
            }
        }


		if(!this.allowMove || this.interactionWith)
		{
			this.velocityX = 0;
			this.velocityY = 0;
		}


		var move = {x: this.velocityX, y: this.velocityY};
		var currentSpd = MathHelper.GetMovementSpeed(this.velocityX, this.velocityY);

		if(currentSpd > spd)
		{
			var mltp = spd/currentSpd;

			move.x = this.velocityX * mltp;
			move.y = this.velocityY * mltp;

			// console.log(currentSpd, spd, MathHelper.GetMovementSpeed(x, y));
		}


		// this.ApplyMove({x: this.velocityX, y: this.velocityY});
		this.ApplyMove(move);
	}

	GetWeapon()
	{
		var weapon = this.equips[SLOT.CANNON];
		if(!weapon) return null;
		return weapon;
	}

	WeaponUpdate()
	{
		this.GetWeapon()?.onOwnerUpdate?.(this);
	}

	ApplyMove(motion)
	{
		if(motion)
		{
			this.x += motion.x * Main.DELTA;
			this.y += motion.y * Main.DELTA;
		}
	}

	GetBulletStartPos(posId = 0)
	{
		var distance = this.shotPoints[posId].distance;
		var angle = this.shotPoints[posId].angle;

		return MathHelper.lineToAngle([this.x, this.y], (distance * this.Scale), this.Rotation - 90 - angle);
	}

	canBeHurt()
	{
		if(!this.isHurtAble) return false;
		if(this.isInvincible) return false;
		if(this.isDashing) return false;
		if(this.godMode) return false;
		return true;
	}

	setDifficultyDamageReceived(baseDamage)
	{
		var info = GetDifficultyInfo();
		baseDamage *= info.DamageMultiplier;

		return Math.round(baseDamage);
	}

	getDamageReduction()
	{
		var base_reduction = this.stats[STAT.DAMAGE_REDUCTION] ?? 0;
		var defense = this.stats[STAT.DEFENSE];

		return base_reduction + Math.floor(defense / 10);
	}

	Heal(amount, percent = false, showIndicator = true)
	{
		if(percent) amount = Math.ceil(this.stats.MAXHP * amount / 100);
		var healed = amount;

		if(this.stats.HP >= this.stats.MAXHP) return;

		this.stats.HP += amount;
		if(this.stats.HP > this.stats.MAXHP)
		{
			healed -= (this.stats.MAXHP - this.stats.HP);
			this.stats.HP = this.stats.MAXHP;
		}

		if(showIndicator) DamageIndicator.AddObject(this.x, this.y, healed, "HEAL");
	}
	
	Hurt(damage, source, data = {})
	{
		if(!this.canBeHurt() && !data?.ALWAYS_HURT) return;
		this.immunityDurationMultiplier = 1;

		damage = this.setDifficultyDamageReceived(damage);
		var defense = this.stats[STAT.DEFENSE];
		var reduction = this.getDamageReduction();

		if(data.IGNORE_REDUCTION) reduction = 0;
		if(data.ELEMENT == ELEMENT.THUNDER) damage = MathHelper.randomInRange(1, damage);

		var type = data.ELEMENT;
		if(this.Resistance[type]) damage = Math.floor(damage / 2);
		if(this.Weakness[type]) damage *= 2;
		if(this.Immunity[type]) damage = 1;
		if(this.DefBreak) damage = Math.ceil(damage * (100 + this.DefBreak) / 100);


		if(damage)
		{
			if(type == ELEMENT.PHYSICAL) damage -= defense;
			damage = Math.round(damage * (100 - reduction) / 100);

			if(damage < 1) damage = 1;

			var dodge = false;
			var shake = 2;

			if(type != ELEMENT.POISON && 
				MathHelper.GetChance(this.stats[STAT.BLOCK_CHANCE])
			) 
			{
				damage = 0;
				dodge = true;
			}

			if(this.shield)
			{
				this.shield -= damage;
				if(this.shield <= 0)
				{
					this.stats.HP += this.shield;
					this.shield = 0;
					shake = 3;
				}
			}
			else
			{
				this.stats.HP -= damage;	
			}

			//damage that deals less than 5% of max health causes shorter immunity
			if(damage < this.stats.MAXHP * .05)
			{
				var p = damage / (this.stats.MAXHP * .05);
				this.immunityDurationMultiplier = p;
			}
			if(type == ELEMENT.FIRE)
			{
				this.immunityDurationMultiplier = .1;
			}

			if(dodge)
			{
				if(Settings.General.ShowDamageReceived) DamageIndicator.AddObject(this.x, this.y, Lang.Get('TEXT.BLOCK'), "DEALT");
				return;
			}


			this.hurted = (World.Location.isCleared) ? this.hurted : true;
			if(Settings.General.ShowDamageReceived) DamageIndicator.AddObject(this.x, this.y, damage, "RECEIVED");
			this.totalDamageReceived += damage;
			this.RunStats.hpLostInRoom += damage;

			if(type == ELEMENT.POISON)
			{
				if(this.stats.HP <= 0) this.stats.HP = 1;		//poison cannot kill you
			}
			else
			{
				Camera.Shake(shake, true);
				this.timeSinceHurt = 0;
			}


			
			this.lastHurtBy = source;
			this.isHurtAble = false;		//player cant be hurted with more than one projectile in game tick
		}
	}

	Kill()
	{
		this.stats.HP = this.stats.MAXHP;
		this.ApplyDeathPenalty();
		this.Save();

		this.stats.HP = 0;
		this.isAlive = false;
		World.AddParticle(new Particle("bubble_pop", this.HitBox.x, this.HitBox.y, 120, this.Width, this.Height, this.Scale));
		World.Kill(Projectile, true);
		InGame.failScreenAlpha.ageInTicks = 1;
		Camera.Shake(2, true, 3 * Main.FPS);
		Mouse.click = false;
		InGame.DeathScreenQuote = Helper.GetDeathQuote(this.lastHurtBy);
		World.PlayerEntities = [];

		document.querySelectorAll('#ingame .pop-up').forEach(e => e.dataset.open = 'false');		//hide uis
	}

	ApplyDeathPenalty()
	{
		if(Difficulty(0)) return;
		var info = GetDifficultyInfo();

		this.oxygen -= Math.floor(this.requiredOxygen * info.DeathPenaltyXp / 100);
		if(this.oxygen < 0) this.oxygen = 0;
		this.coins = Math.floor(this.coins * (100 - info.DeathPenaltyOxygen) / 100);
	}


	Respawn()
	{
		var player = new Player();
			
		World.Players[0] = player;
		World.Player = player;
		World.Boss = null;

		player.Load();
	}

	GetCurrentWeaponModel()
	{
		var weaponModel = this.GetWeapon()?.Model;
		if(this.Appearance.Weapon) return this.Appearance.Weapon;
		return weaponModel;
	}

	RenderDashShadows(context)
	{
		if(this.dashShadowsData.length > 0)
		{
			var savedX = this.x;
			var savedY = this.y;
			var savedRot = this.Appearance.Rotation;
			var savedAlpha = this.Appearance.Transparency;
			var shadowsRendered = 0;

			for(var i = 0; i < this.dashShadowsData.length; i++)
			{
				var data = this.dashShadowsData[i];
				if(data.times > 10) continue;
				shadowsRendered++;

				this.x = data.x;
				this.y = data.y;
				this.Appearance.Rotation = data.Rotation;
				this.Appearance.Transparency = .25 - (data.times * .025);

				this.Skin.RenderHands(context);
				this.GetCurrentWeaponModel()?.Render(context, this);
				this.Skin.Render(context);

				this.dashShadowsData[i].times++;
			}

			this.x = savedX;
			this.y = savedY;
			this.Appearance.Rotation = savedRot;
			this.Appearance.Transparency = savedAlpha;

			if(shadowsRendered == 0) this.dashShadowsData = [];
		}
	}
	
	Render(context)
	{
		if(!this.isAlive) return;

		if(!this.isHurtAble)
		{
			this.Transparency = this.alphaTransition.Update();
		}
		else
		{
			this.Transparency = 1;
		}
		if(this.isDashing) this.Transparency = .5;

		var scale = this.Scale * this.scaleTransition.Update();
		this.Appearance.Scale = scale;
		this.Appearance.Rotation = this.laserRotation ?? this.Rotation;
		this.Appearance.Transparency = this.Transparency;
		

		var spd = this.stats.SPD;
		var particle = this.Appearance.Particle;
		if(Math.abs(this.velocityX) > spd * 0.4 || Math.abs(this.velocityY) > spd * 0.4)
		{
			if(this.ageInTicks % 5 == 0)
			{
				var x = this.x + (this.Width / 4 * this.Scale);
				var y = this.y + (this.Height / 4 * this.Scale);

				x = MathHelper.randomInRange(x - (this.Width / 4 * scale), x + (this.Width / 4 * scale));
				y = MathHelper.randomInRange(y - (this.Height /  4 * scale), y + (this.Height /  4 * scale));

				Particle.SummonCirclePattern(particle, x, y, 0.4, 2, 1, 11, null, null, false);
			}
		}

		this.RenderDashShadows(context);

		this.Skin.RenderHands(context);
		this.GetCurrentWeaponModel()?.Render(context, this);
		this.Skin.Render(context);
		this.HitBox.Render();
		this.Effects.Render(context, this);

		Graphic.addLightSource(this.x - Camera.xView, this.y - Camera.yView, this.stats[STAT.LIGHT_RANGE]);
	}

	haveItemInInventory(itemType, count = 1)
	{
		for (var i = 0; i < this.stats.availableSlots; i++)
		{
			var item = this.inventory[i];
			if (!item) continue;

			if (itemType == item.constructor.name)
				if(item.count >= count) return i;
		}

		return -1;
	}

	haveItemInstanceInInventory(itemType, count = 1)
	{
		for (var i = 0; i < this.stats.availableSlots; i++)
		{
			var item = this.inventory[i];
			if (!item) continue;

			if (item instanceof itemType)
				if(item.count >= count) return i;
		}

		return -1;
	}

	addItemToInventory(item, count = 0, showNewItemInfo = false)
	{
		if(typeof item === 'string')
		{
			//podano nazwe przedmiotu, a nie przedmiot
			
			item = Item.Get(item);
		}

		var stacked = false;
		var added = false;

		if (item != null)
		{
			if(count) item.count = count;
			if(showNewItemInfo)
			{
				item.showNewItemInfo = showNewItemInfo;
			}
			
			for (var i = 0; i < this.stats.availableSlots; i++)
			{
				if (this.inventory[i] != null)
				{				//w danym slocie znajduje sie przedmiot
					if (item.constructor.name == this.inventory[i].constructor.name)
					{		//przedmiot ktory jest dodawany jest taki sam jak w slocie
						if (item.stackAble)
						{
							if (this.inventory[i].count < this.inventory[i].maxStackSize)
							{
								if ((this.inventory[i].count + item.count) <= this.inventory[i].maxStackSize)
								{
									this.inventory[i].count += item.count;
									this.inventory[i].showNewItemInfo = true;
									stacked = true;
									InventoryGUI.Update();
									return i;
								}
								else
								{
									this.inventory[i].count += item.count;
									item.count = Math.abs(this.inventory[i].count - this.inventory[i].maxStackSize);
									this.inventory[i].count = this.inventory[i].maxStackSize;
									continue;
								}
							}
						}
					}
				}
			}


			if (!stacked)
			{
				for (var i = 0; i < this.stats.availableSlots; i++)
				{
					if (this.inventory[i] == null)
					{		//wartosc w inventory jest pusta
						this.inventory[i] = item;
						InventoryGUI.Update();
						return i;
					}
				}
			}
	
			//przedmiot nie mogl zostac dodany, wiec zostanie wyrzucony na podloge
			item.Drop(this.x, this.y, this.inventory);
		}

		InventoryGUI.Update();
		return -1;
	}
}


class PlayerDummy
{
	constructor(player)
	{
		this.x = 0;
		this.y = 0;

		this.Width = player.Width;
		this.Height = player.Height;

		this.Appearance = {...player.Appearance};
		this.Appearance.Rotation = 180;
		this.Appearance.Scale = 1;
		this.Appearance.Transparency = 1;

		this.attackGauge = 1;
	}
}

class Upgrade
{
	constructor(name, description, onActive, onDisactive)
	{
		this.name = name;
		this.description = description;
		this.inUse = false;
		this.active = false;
		this.onActive = onActive;
		this.onDisactive = onDisactive;
	}
	
	Active(player)
	{
		if(!this.active)
		{
			if(isFunction(this.onActive))
			{
				this.onActive(player);
			}
			InGame.itemTitle = this.description;
			setTimeout(function(){InGame.itemTitle = "";}, 3000);
			player.UpdateStats();
			this.active = true;
			this.inUse = true;
		}
	}
	
	Disactive(player)
	{
		if(this.active)
		{
			if(isFunction(this.onDisactive))
			{
				this.onDisactive(player);
			}
			this.active = false;
		}
	}
	
	static Spawn(player, x, y)
	{
		var upgradesAvailable = 0;
		for(var i =0; i < player.Upgrades.length; i++)
		{
			if(!player.Upgrades[i].inUse)
			{
				upgradesAvailable++;
			}
		}
		
		if(upgradesAvailable)
		{
			while(true)
			{
				var upgrade = MathHelper.randomInRange(0, player.Upgrades.length - 1);
				if(!player.Upgrades[upgrade].inUse)
				{
					World.AddEntity(new EntityUpgrade(x, y, upgrade));
					break;
				}
			}
		}
	}
}