class Location
{
	constructor()
	{
		this.Radius = 250;
		this.Rooms = 0;
		this.Name = "";
		this.ageInTicks = 0;

		this.Dimension = 'OVERWORLD';
		this.LocationFamily = 'none';	//location family is used to create locations order

		this.lightLevel = 1;
		this.lightSourcesRange = 1;
		this.lightSourcesStrength = 1;

		this.MapPos = {x: -100, y: -100};		//pozycja ikonki na mapie
		this.isVillage = false;					//czy jest wioska
		this.requiredLevel = 0;					//wymagany poziom
		this.reqPrevLocation = null;			//poprzednia lokacja wymagana do wejscia
		this.specialIcon = false;				//czy posiada specjalna ikonke

		this.allowMap = true;					//czy mozna wlaczyc mape lokacji
		this.canSave = true;					//czy automatycznie zapisywac po ukonczeniu pokoju

		this.Texture = 'bubble_large';
		this.TunnelTexture = 'bubble';
		this.TextureScale = 1;
		this.TextureAlpha = 1;

		this.alwaysShowBubbleTunnel = 
		{
			top: false,
			bottom: false,
			left: false,
			right: false
		};
	}

	GetAvailableDrop()
	{
		var drop = [];
		var types = this.RoomInfo.EntityTypes.concat(this.RoomInfo.BossTypes);
		var entity, lootTable, i, j, itemName;
		for(i = 0; i < types.length; i++)
		{
			entity = new World.EntityList[types[i]]();
			lootTable = entity.LootTable;

			for(j = 0; j < lootTable.itemList.length; j++)
			{
				itemName = lootTable.itemList[j].Type;
				drop.push(itemName);
			}
		}

		return drop;
	}

	canOpenPortal(){return true;}

	GetId()
	{
		return this.constructor.name;
	}

	GetDisplayName()
	{
		return Lang.Get(this.Name);
	}
	
	Update()
	{
		this.ageInTicks++;
		if(this.Rooms.length > 0)
		{
			var room = MathHelper.GetRoomByIndex(this.Rooms, this.Room);
			this.Rooms[room.y][room.x].Update();
		}
	}

	DefaultLocationLoad()
	{

		InGame.GUI.Map.WorldMapShowing = "LOCATION";

		if(this.BackgroundTheme)
		{
			SoundManager.Play(this.BackgroundTheme, "BACKGROUND");
		}

		var rooms = this.generateRooms(this.RoomInfo);
		this.Rooms = rooms.rooms;

		MathHelper.GetRoomByIndex(this.Rooms, rooms.startRoom).room.Enter();
		World.deep = World.MinimalDeep + MathHelper.GetRoomByIndex(this.Rooms, this.Room).y;
	}

	RenderGradient()
	{
		var pos = World.GetBackgroundPosition();

		var grd = ctx.createLinearGradient(pos.x, pos.y, 0, World.Height);
			grd.addColorStop(0, "lightblue");
			grd.addColorStop(0.5, "blue");
			grd.addColorStop(1, "black");

		ctx.save();
		ctx.fillStyle = grd;
		ctx.fillRect(-Camera.xView, -Camera.yView, World.Width, World.Height);
		ctx.restore();
	}

	RenderRoom()
	{
		var scale = this.TextureScale;
		var size = World.Radius * 2;
		var texture = TextureManager.Get(this.Texture);

		Graphic.DrawRotatedImage(ctx, texture, World.CenterPoint.x-Camera.xView, World.CenterPoint.y-Camera.yView, size, size, scale, 0, this.TextureAlpha);
	}
	
	Render()
	{
		this.RenderGradient();
		this.RenderRoom();

		if(World.currentRoom.isCleared && World.ageInTicks % 2 == 0)
		{
			var sides = World.currentRoom.GetSides();
			var center = World.CenterPoint;
			var r = World.Radius;
			var R = canvas.width / 2;
			var width = World.roomChangeTriggerRange * 2;
			var base_spd = 300;
			
			var count = 1;
			var margin = width / 2;
			var bubbles = [];
			var x, y;

			if(sides.left || this.alwaysShowBubbleTunnel.left)
			{
				x = margin + center.x - r;
				y = center.y + MathHelper.randomInRange(-width/2, width/2);
				bubbles.push({x, y, destX: x - R, destY: y});
			}


			if(sides.top || this.alwaysShowBubbleTunnel.top)
			{
				x = center.x + MathHelper.randomInRange(-width/2, width/2);
				y = margin + center.y - r;
				bubbles.push({x, y, destX: x, destY: y - R});
			}

			if(sides.right || this.alwaysShowBubbleTunnel.right)
			{
				x = -margin + center.x + r;
				y = center.y + MathHelper.randomInRange(-width/2, width/2);
				bubbles.push({x, y, destX: x + R, destY: y});
			}

			if(sides.bottom || this.alwaysShowBubbleTunnel.bottom)
			{
				x = center.x + MathHelper.randomInRange(-width/2, width/2);
				y = -margin + center.y + r;
				bubbles.push({x, y, destX: x, destY: y + R});
			}


			for(var i = 0; i < bubbles.length; i++)
			{
				var data = bubbles[i];
				var size = MathHelper.randomInRange(20, 50) / 100;
				var spd = base_spd * size * 2;

				Particle.Summon(this.TunnelTexture, data.x, data.y, data.destX, data.destY, size, spd, count, 50);
			}
		}
	}

	getLightLevelInfo()
	{
		if(this.lightLevel >= 1) return null;
		return new LightLevel(1 - this.lightLevel, this.lightSourcesRange, this.lightSourcesStrength);
	}

	onExit()
	{

	}


	Exit()
	{
		World.Boss = null;
		this.onExit();
	}


	generateRandomRooms(RoomInfo, roomsNumber, min_empty)
	{
		var rooms = [];
		var size = 1;

		while(true)
		{
			//Generowanie ilosci pokoi

			if(roomsNumber == 1) break;

			if(size * size > roomsNumber + min_empty)
			{
				break;
			}
			size ++;
		}

		for(var i = 0; i < size; i++)
		{
			//wypelnianie pokoi
			rooms[i] = [];
			for(var j = 0; j < size; j++)
			{
				rooms[i][j] = "room";
			}
		}
		

		//poczatkowy pokoj
		while(true)
		{
			var startRoom = MathHelper.randomInRange(0, (size * size) - 1);
			var pos = MathHelper.GetRoomByIndex(rooms, startRoom);
			
			var margin = size / 4;
			if((pos.x > margin && pos.x < size - margin && pos.y > margin && pos.y < size - margin) || (size < 5))
			{
				break;
			}
		}

		var startPos = {x: pos.x, y: pos.y};
		var emptyRooms = (size * size) - roomsNumber;
	
		var safe = 0;

		while(true)
		{
			for(var i = 0; i < size; i++)
			{
				//wypelnianie pokoi
				rooms[i] = [];
				for(var j = 0; j < size; j++)
				{
					rooms[i][j] = "room";
				}
			}
			rooms[startPos.y][startPos.x] = true;

			//dodawanie pustych pokoi
			var currentEmptyRooms = 0;
			while(true)
			{
				if(currentEmptyRooms >= emptyRooms)
				{
					break;
				}
				var room = MathHelper.randomInRange(0, (size * size) - 1);
				var side = MathHelper.GetRandomSide(Room.GetRoomsOnSides(rooms, room));
				pos = Room.GetRoomOnSide(room, side, rooms);

				if(rooms[pos.y][pos.x] == "room")
				{
					rooms[pos.y][pos.x] = "empty";
					currentEmptyRooms++;
				}
			}

		
			// safe++;
			var _copy = [];
			for(var i = 0; i < rooms.length; i++)
			{
				_copy[i] = [];
				for(var j = 0; j < rooms[i].length; j++)
				{
					_copy[i][j] = rooms[i][j];
				}
			}

			var iterations = Location.TestRooms(_copy, startPos) + 1;
			
			if((iterations == roomsNumber) || safe > 1000)
			{
				break;
			}
		}



		//generate boss chambers nad secret rooms

		var emptyChambersList = [];
		var bossChambersList = [];
		var bossChambersList2 = [];

		for(var i = 0; i < rooms.length; i++)
		{
			for(var j = 0; j < rooms[i].length; j++)
			{
				var room = rooms[i][j];
				if(room == "empty")
				{
					emptyChambersList.push([j, i]);
				}
				else if(room == "room")
				{
					var sides = Room.GetRoomsOnSides(rooms, {x: j, y: i});
					var emptyRoomsNear = 0;

					if(sides.top)
					{
						var _pos = Room.GetRoomOnSide({x: j, y: i}, SIDE.TOP, rooms);
						if(rooms[_pos.y][_pos.x] == "empty")
						{
							emptyRoomsNear++;
						}
					}
					else
					{
						emptyRoomsNear++;
					}

					if(sides.left)
					{
						var _pos = Room.GetRoomOnSide({x: j, y: i}, SIDE.LEFT, rooms);
						if(rooms[_pos.y][_pos.x] == "empty")
						{
							emptyRoomsNear++;
						}
					}
					else
					{
						emptyRoomsNear++;
					}

					if(sides.bottom)
					{
						var _pos = Room.GetRoomOnSide({x: j, y: i}, SIDE.BOTTOM, rooms);
						if(rooms[_pos.y][_pos.x] == "empty")
						{
							emptyRoomsNear++;
						}
					}
					else
					{
						emptyRoomsNear++;
					}

					if(sides.right)
					{
						var _pos = Room.GetRoomOnSide({x: j, y: i}, SIDE.RIGHT, rooms);
						if(rooms[_pos.y][_pos.x] == "empty")
						{
							emptyRoomsNear++;
						}
					}
					else
					{
						emptyRoomsNear++;
					}

					if(emptyRoomsNear == 3)
					{
						bossChambersList.push([j, i]);
					}
					else if(emptyRoomsNear == 2)
					{
						bossChambersList2.push([j, i]);
					}
				}
			}
		}

		for(var i = 0; i < RoomInfo.BossChambers; i++)
		{
			if(bossChambersList.length > 0)
			{
				var chamber = MathHelper.randomInRange(0, bossChambersList.length - 1);

				var bossChamber = bossChambersList[chamber];
				rooms[bossChamber[1]][bossChamber[0]] = "boss";
				bossChambersList.splice(chamber, 1);
			}
			else if(bossChambersList2.length > 0)
			{
				var chamber = MathHelper.randomInRange(0, bossChambersList2.length - 1);

				var bossChamber = bossChambersList2[chamber];
				rooms[bossChamber[1]][bossChamber[0]] = "boss";
				bossChambersList2.splice(chamber, 1);
			}
		}

		for(var i = 0; i < RoomInfo.SecretChambers; i++)
		{
			if(emptyChambersList.length > 0)
			{
				var isBossNear = 0;
				var isRoomNear = 0;
				var chamber = MathHelper.randomInRange(0, emptyChambersList.length - 1);
				var secretChamber = emptyChambersList[chamber];
				var currentChamber = {y: secretChamber[1], x: secretChamber[0]};
				var roomNear;


					roomNear = Room.GetRoomOnSide(currentChamber, SIDE.TOP, rooms).room;
					if(roomNear == "boss" || roomNear == "secret")
					{
						isBossNear++;
					}
					if(roomNear == "room" || roomNear == true)
					{
						isRoomNear++;
					}

					roomNear = Room.GetRoomOnSide(currentChamber, SIDE.LEFT, rooms).room;
					if(roomNear == "boss" || roomNear == "secret")
					{
						isBossNear++;
					}
					if(roomNear == "room" || roomNear == true)
					{
						isRoomNear++;
					}

					roomNear = Room.GetRoomOnSide(currentChamber, SIDE.BOTTOM, rooms).room;
					if(roomNear == "boss" || roomNear == "secret")
					{
						isBossNear++;
					}
					if(roomNear == "room" || roomNear == true)
					{
						isRoomNear++;
					}

					roomNear = Room.GetRoomOnSide(currentChamber, SIDE.RIGHT, rooms).room;
					if(roomNear == "boss" || roomNear == "secret")
					{
						isBossNear++;
					}
					if(roomNear == "room" || roomNear == true)
					{
						isRoomNear++;
					}


				if((isBossNear < 1) && (isRoomNear > 0) && (isRoomNear < 4))
				{
					rooms[currentChamber.y][currentChamber.x] = "secret";
				}
				else
				{
					i--;
				}
				emptyChambersList.splice(chamber, 1);
			}
		}

		return {rooms:rooms, startRoom:startRoom};
	}
	

	generateRooms(RoomInfo)
	{
		var roomsNumber = MathHelper.randomInRange(RoomInfo.MinRooms, RoomInfo.MaxRooms);
		var min_empty = roomsNumber / 2;

		//maksymalnie 100 pokojowe lokacje mozna wygenerowac
		if(roomsNumber > 100) roomsNumber = 100;
		
		var generatedRoomsData = this.generateRandomRooms(RoomInfo, roomsNumber, min_empty);
		var rooms = generatedRoomsData.rooms;
		var startRoom = generatedRoomsData.startRoom;


		//Konczenie
		var id = 0;
		for(var i = 0; i < rooms.length; i++)
		{
			for(var j = 0; j < rooms[i].length; j++)
			{
				var room = rooms[i][j];
				var entities = 0;

				if(RoomInfo.EntityTypes)
				{
					entities = MathHelper.randomInRange(RoomInfo.MinEntities, RoomInfo.MaxEntities);
				}

				if(room == "room")
				{
					//zwykly pokoj
					var radius = MathHelper.randomInRange(RoomInfo.MinRadius, RoomInfo.MaxRadius);
					var entitiesNumber = MathHelper.randomInRange(RoomInfo.MinEntities, RoomInfo.MaxEntities);
					var entities = [];

					if(RoomInfo.EntityTypes)
					{
						if(RoomInfo.EntityTypes.length > 0)
						{
							var types = [];
							var max  = RoomInfo.MaxEntityTypes < RoomInfo.EntityTypes.length ? RoomInfo.MaxEntityTypes : RoomInfo.EntityTypes.length;
							var typesNumber = MathHelper.randomInRange(RoomInfo.MinEntityTypes ?? 1, max ?? RoomInfo.EntityTypes.length);
							var k = 0;

							while(true)
							{
								var entityType = MathHelper.randomInRange(0, RoomInfo.EntityTypes.length - 1);
								var type = RoomInfo.EntityTypes[entityType];
								if(types.indexOf(type) == -1) types.push(type);
								if(types.length == typesNumber) break;
								k++;
							}

							for(k = 0; k < entitiesNumber; k++)
							{
								var entityType = k%(types.length);
								entities.push([types[entityType], false]);
							}
						}
					}

					var _room = new Room(id, radius, entities);
						if(RoomInfo.Titles)
						{
							_room.Title = RoomInfo.Titles.Room;
						}
						if(RoomInfo.Subtitles)
						{
							_room.Subtitle = RoomInfo.Subtitles.Room;
						}
						if(RoomInfo.onUpdates)
						{
							_room.onUpdate = RoomInfo.onUpdates.Room;
						}

					rooms[i][j] = _room;
				}
				else if(room == "boss")
				{
					//boss
					var radius = MathHelper.randomInRange(RoomInfo.MinRadius, RoomInfo.MaxRadius);
					var entities = [];

					if(RoomInfo.BossTypes)
					{
						if(RoomInfo.BossTypes.length > 0)
						{
							var bossType = MathHelper.randomInRange(0, RoomInfo.BossTypes.length - 1);

							var entityName = RoomInfo.BossTypes[bossType];
							entities.push([entityName, true]);
						}
					}

					var _room = new Room(id, radius, entities, false, true);
						if(RoomInfo.Titles)
						{
							_room.Title = RoomInfo.Titles.Boss;
						}
						if(RoomInfo.Subtitles)
						{
							_room.Subtitle = RoomInfo.Subtitles.Boss;
						}
						if(RoomInfo.onUpdates)
						{
							_room.onUpdate = RoomInfo.onUpdates.Boss;
						}

					rooms[i][j] = _room;
				}
				else if(room == "secret")
				{
					//secret room
					var radius = MathHelper.randomInRange(RoomInfo.MinRadius, RoomInfo.MaxRadius);

					var _room = new Room(id, radius, [], false, false, true);
						if(RoomInfo.Titles)
						{
							_room.Title = RoomInfo.Titles.Secret;
						}
						if(RoomInfo.Subtitles)
						{
							_room.Subtitle = RoomInfo.Subtitles.Secret;
						}
						if(RoomInfo.onUpdates)
						{
							_room.onUpdate = RoomInfo.onUpdates.Secret;
						}

					rooms[i][j] = _room;
				}
				else if(room == true)
				{
					//start

					var radius = MathHelper.randomInRange(RoomInfo.MinRadius, RoomInfo.MaxRadius);

					var _room = new Room(id, radius, [], true);
						if(RoomInfo.Titles)
						{
							_room.Title = RoomInfo.Titles.Start;
						}
						if(RoomInfo.Subtitles)
						{
							_room.Subtitle = RoomInfo.Subtitles.Start;
						}
						if(RoomInfo.onUpdates)
						{
							_room.onUpdate = RoomInfo.onUpdates.Start;
						}

					rooms[i][j] = _room;
				}
				else
				{
					rooms[i][j] = null;
				}

				id++;
			}
		}


		return {rooms: rooms, startRoom: startRoom};
	}

	static TestRooms(rooms, pos, iterations = 0)
	{
		var sides = Room.GetRoomsOnSides(rooms, pos);
		rooms[pos.y][pos.x] = null;

		//sprawdza czy pokoj sasiaduje z jakimkolwiek innym pokojem
		if(sides.top)
		{
			var room = Room.GetRoomOnSide(pos, SIDE.TOP);
			if(rooms[room.y][room.x] == "room")
			{
				iterations++;
				iterations = Location.TestRooms(rooms, room, iterations);
			}
		}

		if(sides.right)
		{
			var room = Room.GetRoomOnSide(pos, SIDE.RIGHT);
			if(rooms[room.y][room.x] == "room")
			{
				iterations++;
				iterations = Location.TestRooms(rooms, room, iterations);
			}
		}

		if(sides.bottom)
		{
			var room = Room.GetRoomOnSide(pos, SIDE.BOTTOM);
			if(rooms[room.y][room.x] == "room")
			{
				iterations++;
				iterations = Location.TestRooms(rooms, room, iterations);
			}
		}

		if(sides.left)
		{
			var room = Room.GetRoomOnSide(pos, SIDE.LEFT);
			if(rooms[room.y][room.x] == "room")
			{
				iterations++;
				iterations = Location.TestRooms(rooms, room, iterations);
			}
		}

		return iterations;
	}
	
	onLoad()
	{
		
	}
}