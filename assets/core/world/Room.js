class Room
{
	constructor(id, radius, entities = [], isStart = false, isBoss = false, isSecret = false)
	{
		this.id = id;
		this.Radius = radius;
		this.Entities = entities;
		this.isBossChamber = isBoss;
		this.isStartChamber = isStart;
		this.isSecretChamber = isSecret;
		this.Title = "";
		this.Subtitle = "";
		this.playerWasThere = false;
		this.isCleared = false;
		this.lastCleared = false;
		this.onUpdate = null;
		this.allowExpReward = true;

		this.SecretTheme = 'interface.SecretRoom';

		this.savedEntities = [];

		if(isStart || isSecret)
		{
			//nie wyswietla komunikatu po ukonczeniu poziomu
			this.isCleared = true;
			this.lastCleared = true;
		}

		this.spawnHeartChance = 50;
		this.summonedNPC = {};
	}

	Update()
	{
		if(isFunction(this.onUpdate))
		{
			this.onUpdate();
		}
		this.lastCleared = this.isCleared;
		this.isCleared = true;
		for(var i = 0; i < World.Entities.length; i++)
		{
			if(!World.Entities[i].isFromPlayer && 
				(!(World.Entities[i] instanceof Oxygen)) && 
				(!(World.Entities[i] instanceof EntityUpgrade)) && 
				(!World.Entities[i].isNPC) && 
				(!(World.Entities[i] instanceof EntityItem)) && 
				(World.Entities[i].mustBeKilled)
			)
			{
				this.isCleared = false;
				break;
			}
		}

		if(this.isCleared != this.lastCleared) this.UpdateNPC();

		if(this.isBossChamber && !this.Title)
		{
			if(World.Boss)
			{
				if(World.Boss.Title)
				{
					this.Title = World.Boss.Title;
					World.Location.Title = this.Title;
				}
				if(World.Boss.Subtitle)
				{
					this.Subtitle = World.Boss.Subtitle;
					World.Location.Subtitle = this.Subtitle;
				}
			}
		}

		World.Location.isCleared = this.isCleared;

		if(this.isCleared && !this.lastCleared)
		{
			World.Player.RunStats.setRoomInfo();
			
			var exp = World.Player.oxygenGainedInRoom;
			for(var i = 0; i < World.Entities.length; i++)
			{
				if(World.Entities[i] instanceof Oxygen)
				{
					var o = World.Entities[i];
					exp += Oxygen.GetOxygenValue(o.value, World.Player.stats.Level, o.level, o.isFromBoss);
				}
			}
			World.Location.Perfect = !World.Player.hurted;


			if(World.Location.Perfect && this.allowExpReward)
			{
				World.AddEntity(new Oxygen(World.CenterPoint.x, World.CenterPoint.y, Math.round(exp / 2), World.Player.stats.Level));

				if(MathHelper.GetChance(this.spawnHeartChance))
				{
					var value = MathHelper.randomInRange(1, 2);
					World.AddEntity(new Oxygen(World.CenterPoint.x, World.CenterPoint.y, value, 1, true));
				}
			}


			

			InGame.ShowTitle(true);

			if(this.isMobRush)
			{
				Upgrade.Spawn(World.Player, World.CenterPoint.x, World.CenterPoint.y);
			}

			//zabicie bossa powoduje ukonczenie lokacji
			if(this.isBossChamber)
			{
				World.Player.CompleteLocation(World.Location.constructor.name);
			}
		}
	}

	GetEntityLevels()
	{
		return getLocationLevel(World.Location);
	}

	UpdateNPC()
	{
		for(var i in this.summonedNPC)
		{
			this.summonedNPC[i].NoAI = false;
			console.log(this.summonedNPC[i]);
		}
	}

	GetNPCtoSummon()
	{
		var info = World.Location.RoomInfo.availableNPC;
		if(this.isStartChamber && info.Start) return info.Start;
		if(this.isBossChamber && info.Boss) return info.Boss;
		if(this.isSecretChamber && info.Secret) return info.Secret;
		if(info.Room) return info.Room;

		return null;
	}

	SummonNPC()
	{
		if(!World.Location.RoomInfo.availableNPC) return;

		var data = this.GetNPCtoSummon();
		if(!data) return;

		if(MathHelper.GetChance(data.chance))
		{
			var _constructor = World.EntityList[data.id];
			if(!isNPCMet(data.id) && !this.summonedNPC[data.id] && _constructor)
			{
				var npc = new _constructor(World.CenterPoint.x, World.CenterPoint.y);
				this.summonedNPC[data.id] = npc;
				this.summonedNPC[data.id].NoAI = true;
				World.Spawn(npc);
			}
		}
	}

	Enter()
	{
		if(isFunction(this.onEnter)) this.onEnter();

		if(!this.playerWasThere)
		{
			this.SummonNPC();

			if(this.isSecretChamber)
			{
				World.Player.RunStats.foundSecretRooms++;

				if(SoundManager.Playing.Background)
				{
					if((SoundManager.Playing.Background.name != this.SecretTheme) && !SoundManager.isPlayingBossTheme)
					{
						if(SoundManager.GetAudio(this.SecretTheme))
						{
							SoundManager.Play(this.SecretTheme, "BACKGROUND");
						}
					}
				}

				var chance = MathHelper.randomInRange(0, 100);
				if(chance < 5)
				{
					//boss
				}
				else if(chance < 15)
				{
					this.isCleared = false;
					this.lastCleared = false;
					this.isMobRush = true;

					//Mob Rush
					var RoomInfo = World.Location.RoomInfo;

					if(RoomInfo.EntityTypes)
					{
						if(RoomInfo.EntityTypes.length > 0)
						{
							var types = [];
							for(var k = 0; k < RoomInfo.MaxEntityTypes; k++)
							{
								var entityType = MathHelper.randomInRange(0, RoomInfo.EntityTypes.length - 1);
								types.push(RoomInfo.EntityTypes[entityType]);
							}

							for(var k = 0; k < RoomInfo.MaxEntities * 3; k++)
							{
								var entityType = MathHelper.randomInRange(0, types.length - 1);

								this.Entities.push([types[entityType], false]);
							}
						}
					}


				}
				else if(chance < 95)
				{
					// Upgrade.Spawn(World.Player, World.CenterPoint.x, World.CenterPoint.y);
				}
			}

			if(this.isStartChamber)
			{
				InGame.ShowTitle(true, World.Location.GetDisplayName());
			}
		}

		this.playerWasThere = true;
		World.Location.Room = this.id;
		World.currentRoom = this;
		World.Location.Radius = this.Radius;
		World.Location.Title = this.Title;
		World.Location.Subtitle = this.Subtitle;
		World.timeSinceLocationChange = 0;
		World.isPortalOpen = false;

		World.SetRadius(this.Radius);
		
		var y = MathHelper.GetRoomByIndex(World.Location.Rooms, this.id).y;
		World.deep = (World.MinimalDeep + y);

		if(World.Player)
		{
			World.Player.hurted = false;
			World.Player.oxygenGainedInRoom = 0;
			World.Player.movedInRoom = false;

			var wpn = World.Player.GetWeapon();
			if(wpn) wpn.Throws = 0;
		}

		//usuwa wszystkie pociski i czasteczki
		World.Kill(Projectile, true);
		if(!World.isChangingLocation) World.Kill(Particle, true);		//clear particles if player is not smoothly entering new room

		if(!this.isCleared)
		{
			for(var i = 0; i < this.Entities.length; i++)
			{
				
				var pos = MathHelper.getRandomPointInRange(World.CenterPoint, this.Radius - 150);
				var name = this.Entities[i][0];
				var isBoss = this.Entities[i][1];
				if(isBoss)
				{
					pos.x = World.CenterPoint.x;
					pos.y = World.CenterPoint.y;
				}

				var entity = new World.EntityList[name](pos.x, pos.y);
					entity.setLevel(this.GetEntityLevels());

				World.Spawn(entity);
			}
		}

		if(this.savedEntities.length > 0)
		{
			for(var i = 0; i < this.savedEntities.length; i++)
			{
				World.Entities.push(this.savedEntities[i]);
			}
		}
	}

	Quit()
	{
		this.savedEntities = [];

		for(var i = World.Entities.length - 1; i >= 0; i--)
		{
			if(World.Entities[i].isFromPlayer) continue;

			this.savedEntities.push(World.Entities[i]);
			World.Entities.splice(i, 1);
		}

		if(this.isSecretChamber)
		{
			if(SoundManager.Playing.Background)
			{
				if(SoundManager.Playing.Background.name == this.SecretTheme)
				{
					setTimeout(function(){SoundManager.Play(World.Location.BackgroundTheme, "BACKGROUND"); SoundManager.isPlayingBossTheme = false}, 2000);
				}
			}
		}

		if(World.Location.canSave) World.Player.Save();
	}

	static GetRoomsOnSides(rooms, position)
	{
		if(!isObject(position))
		{
			//podano index
			position = MathHelper.GetRoomByIndex(rooms, position);
		}

		var Sides = {top: false, bottom: false, right: false, left: false};

		if(rooms[position.y - 1])
		{
			if(rooms[position.y - 1][position.x]) Sides.top = true;
		}

		if(rooms[position.y + 1])
		{
			if(rooms[position.y + 1][position.x]) Sides.bottom = true;
		}

		if(rooms[position.y][position.x + 1]) Sides.right = true;
		if(rooms[position.y][position.x - 1]) Sides.left = true;

		return Sides;
	}

	static GetRoomPosition(rooms, room)
	{
		for(var i = 0; i < rooms.length; i++)
		{
			for(var j = 0; j < rooms[i].length; j++)
			{
				var r = rooms[i][j];
				if(r == room)
				{
					return {x: j, y: i};
				}
			}
		}
	}

	GetSides()
	{
		var rooms = World.Location.Rooms;
		var pos = Room.GetRoomPosition(rooms, this);
		return Room.GetRoomsOnSides(rooms, pos);
	}

	static GetRoomOnSide(position, side, rooms)
	{
		if(!isObject(position))
		{
			//podano index
			position = MathHelper.GetRoomByIndex(rooms, position);
		}

		var pos = {x: position.x, y: position.y};

		switch(side)
		{
			case SIDE.TOP:
				pos.y -= 1;
				break;

			case SIDE.RIGHT:
				pos.x += 1;
				break;

			case SIDE.BOTTOM:
				pos.y += 1;
				break;

			case SIDE.LEFT:
				pos.x -= 1;
				break;
		}

		pos.room = null;
		if(rooms)
		{
			if(rooms[pos.y])
			{
				pos.room = rooms[pos.y][pos.x];
			}
		}
		

		return pos;
	}
}