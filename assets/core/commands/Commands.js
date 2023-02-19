class Commands
{
	static Initialize()
	{
		if(!DEVELOPER_MODE && (!ALLOW_COMMANDS))
		{
			return;
		}

		var methods = getAllMethods(this);
		
		for(var i = 0; i < methods.length; i++)
		{
			var method = methods[i];
			window[method] = this[method];
		}
	}

	
	/**
	 * Give specific item to Player.
	 * @param {Item} item Item to be added.
	 * @param {Number} count Count of items.
	 */
	static Give(item, count = 1, itemInfo = null)
	{
		if(item)
		{
			if(typeof item === "function")
			{
				item = item.name;
			}

			item = ItemHelper.getInstanceOfItem(item);

			if(itemInfo)
			{
				for(var property in itemInfo)
				{
					item[property] = itemInfo[property];
				}
			}

			World.Player.addItemToInventory(item, count, true);
		}
		else
		{
			var result = "Available Items:\n";
			var i = 0;
			for(var itemName in Main.ItemHelper.Items)
			{
				i++;
				result += "\n"+i+". " + itemName;
			}
			return result;
		}
	}

	/**
	 * Kill specific Entity, or all of entities on map.
	 * @param {Entity} entity Entity to be killed.
	 */
	static Kill(entity)
	{
		if(!entity)
		{
			World.Entities = [];
			World.Boss = null;
			document.getElementById('boss_rage_meter')?.remove();
		}
		else
		{
			World.Kill(entity);
		}
	}
	

	/**
	 * Summon specific Entity.
	 * @param {Entity} entity Entity to be summoned.
	 * @param {Number} x x-coordinate.
	 * @param {Number} y y-coordinate.
	 */
	static Summon(entity, x, y, noAI = false)
	{
		if(entity)
		{
			try
			{
				x = x || World.CenterPoint.x;
				y = y || World.CenterPoint.y;
				var e = new entity(x, y);
				if(noAI) e.NoAI = true;
				World.AddEntity(e);
			}
			catch(error)
			{
				console.error("Invalid Entity.\n  Enter Summon() to get more information.");
			}
		}
		else
		{
			var result = "Available Entities:\n";
			var i = 0;
			for(var entityName in World.EntityList)
			{
				i++;
				var isBoss = (World.EntityList[entityName].isBoss) ? " (Boss)" : "";
				result += "\n" + i +". " + entityName + isBoss;
			}
			return result;
		}
	}

	static GoToRoom(y, x, time = 2)
	{
		if((x == undefined) || (y == undefined)) return;
		if(!World) return;
		if(!World.Location) return;
		if(!World.Location.Rooms) return;

		var room = World.Location.Rooms[y][x];
		if(room)
		{
			World.Player.Recall(time, room);
		}
	}

	static GoToLocation(name, time = 2, canInterrupt = true)
	{
		if(name)
		{
			if(typeof name === "function")
			{
				name = name.name;
			}

			if(World.LocationList[name])
			{
				if(World.Location.constructor.name != name)
				{
					World.Player.Recall(time, null, name, canInterrupt);
					return true;
				}
				return "Cannot change location to current.";
			}
			return "Invalid Location Name.";
		}

		var result = "Available Locations:\n";
		var i = 0;
		for(var location in World.LocationList)
		{
			i++;
			result += "\n" + i +". " + location;
		}
		return result;

	}
	

	/**
	 * 
	 * @param {Number} stage Stage to be loaded.
	 */
	static GoToStage(stage)
	{
		if(World.Location.Stage)
		{
			Kill();
			World.Location.StageClear();
			World.Location.Stage = stage - 1;
		}
	}


	static ApplyEffect(entity, effectName, strength, time, hideParticles)
	{
		var effect = Effects.GetEffect(effectName);
		if(effect)
		{
			if(entity.Effects)
			{
				entity.Effects.Apply(new effect(strength, time, hideParticles), entity);
			}
		}
	}




	static GiveAllUpgrades()
	{
		for(var i = 0; i < World.Player.Upgrades.length; i++)
		{
			var up = World.Player.Upgrades[i];
			if(!up.active)
			{
				up.Active(World.Player);
			}
		}
	}
}
Commands.Initialize();