class Map
{
	constructor()
	{
		this.MapScale = 1.3;
		this.Open = false;
		this.hover = false;

		this.MapControls =
		[
			new Button(-200, 10, "WorldMapSwitch", " ", false, "WorldMapLocation", function()
			{
				this.text = World.Location.Name;
				var style = Style.GetStyleByName(this.className);
				this.style.width = Style.GetTextSize(this.text, style).width + 20;
				this.disabled = (InGame.GUI.Map.WorldMapShowing == "LOCATION") ? true : false;

				if(this.hover)  World.Player.allowAttack = false;

			}, false, function(){InGame.GUI.Map.WorldMapShowing = "LOCATION";}, false, false),
			
			new Button(-200, 10, "WorldMapSwitch", " ", false, "WorldMapWorld", function()
			{
				this.text = Lang.Translate('WORLD_MAP');
				var style = Style.GetStyleByName(this.className);
				this.style.width = Style.GetTextSize(this.text, style).width + 20;
				this.disabled = (InGame.GUI.Map.WorldMapShowing == "WORLD") ? true : false;

				if(this.hover)  World.Player.allowAttack = false;

			}, false, function(){InGame.GUI.Map.WorldMapShowing = "WORLD";}, false, false),
		];

		this.CurrentRoomTransition = new Transition(0, 360, 2, false, 0, 0, true);
	}

	Update()
	{	
		if(InGame.pause) return;
		// if(InGame.GUI.Dialog.Open) return;
		// if(InGame.GUI.Inventory.isShopOpen) return;

		if((Settings.Controls.StateMap) && (!this.lockMap))
		{
			this.Open = (this.Open) ? false : true;
			this.lockMap = true;
			// InGame.GUI.Inventory.Open = false;
		}
		else if((!Settings.Controls.StateMap) || Settings.Controls.StateEscape)
		{
			this.lockMap = false;
			if(Settings.Controls.StateEscape) 
			{
				if(this.Open)
				{
					InGame.lockEscape = true;
					this.Open = false;
				}
			}
		}

		this.allowMap = true;
		if(World.Location)
		{
			if(!World.Location.allowMap)
			{
				this.WorldMapShowing = "WORLD";
				this.allowMap = false;
				return;
			}
		}


		if(this.Open)
		{
			for(var i = 0; i < this.MapControls.length; i++)
			{
				this.MapControls[i].Update();
			}

			Mouse.cursor = 'default';
			if(this.hover) {World.Player.allowAttack = false;}
		}
		
	}

	Render()
	{
		if(InGame.pause && this.Open) return;

		this.style = Style.GetStyleByName("menu");
		this.style.fontSize = 20;
		this.style.textAlign = "left";

		if(!this.Open && !InGame.GUI.Inventory.Open && this.allowMap && Settings.General.showMinimap)
		{
			this.DrawSmallMap();
		}
		else if(this.Open)
		{
			this.DrawMap();
		}
	}


	DrawSmallMap()
	{
		this.DrawMap(true);
	}

	DrawMap(isSmallVersion)
	{
		if(!World.Location) return;
		if(!World.Location.Rooms) return;

		var Rooms = World.Location.Rooms;

		var RoomsInRow = Rooms[0].length;
		var RoomsInColl = Rooms.length;

		var startRoomY = 0;
		var startRoomX = 0;

		var scale = this.MapScale;

		if(isSmallVersion)
		{
			var currentRoom = MathHelper.GetRoomByIndex(Rooms, World.Location.Room);

			scale = 0.4;
			if(RoomsInRow > 5)
			{
				var maxRow = RoomsInRow;
				startRoomX = currentRoom.x - 2;
				startRoomX = (startRoomX < 0) ? 0 : (startRoomX > maxRow - 5) ? maxRow - 5 : startRoomX;
				RoomsInRow = 5 + startRoomX;
				RoomsInRow = (RoomsInRow > maxRow) ? maxRow : RoomsInRow;
			}

			if(RoomsInColl > 5)
			{
				var maxColl = RoomsInColl;
				startRoomY = currentRoom.y - 2;
				startRoomY = (startRoomY < 0) ? 0 : (startRoomY > maxColl - 5) ? maxColl - 5 : startRoomY;
				RoomsInColl = 5 + startRoomY;
				RoomsInColl = (RoomsInColl > maxColl) ? maxColl : RoomsInColl;
			}
		}
		
		var roomRadius = 25 * scale;
		var roomLine = 7.5 * scale;
		var space = 25 * scale;

		var mapWidth = (Rooms[0].length * roomRadius * 2) + ((Rooms[0].length - 1) * space);
		var mapHeight = (Rooms.length * roomRadius * 2) + ((Rooms.length - 1) * space);

		var minMargin = 100;

		if(mapHeight + minMargin > canvas.height)
		{
			this.MapScale = Math.round((canvas.height / mapHeight) * 10) / 10;
			//zapobiega "mignieciu" mapy podczas przeskalowania
			return;
		}



		var startX = (canvas.width - mapWidth) / 2;
		var startY = (canvas.height - mapHeight) / 2;

		if(isSmallVersion)
		{
			var width = ((RoomsInRow - startRoomX) * roomRadius * 2) + ((RoomsInRow - startRoomX) * space);
			startX = canvas.width - (width + 20);
			startY = (Settings.General.showRadar) ? 150 + 40 : 30;

			ctx.save();
			ctx.globalAlpha = 0.1;
			ctx.fillStyle = "white";
			Graphic.roundRect(ctx, startX - 10, startY - 10, width + 10, width + 10, 20, true);
			ctx.restore();
		}
		else
		{
			ctx.save();
			ctx.globalAlpha = 0.1;
			ctx.fillStyle = "white";
			Graphic.roundRect(ctx, startX - 10, startY - 10, mapWidth + 20, mapHeight + 20, 20, true);
			ctx.restore();

			// var y = 30;
			// var text =  World.Location.Name;

			// this.style.fontSize = 30;
			// this.style.width = 1;
			// this.style.textAlign = "center";
			// Style.FillText(ctx, this, text, canvas.width / 2, y);

			this.hover = false;
			if(Mouse.x >= startX && Mouse.x <= (startX + mapWidth) && Mouse.y >= startY && Mouse.y <= (startY + mapHeight))
			{
				this.hover = true;
			}
		}


		var angle = this.CurrentRoomTransition.Update();

		var roomsToDraw = [];

		for(var i = startRoomY; i < RoomsInColl; i++)
		{
			for(var j = startRoomX; j < RoomsInRow; j++)
			{
				var room = Rooms[i][j];
				
				if(!room) continue;
				if((!room.playerWasThere) && (!Main.UnlockMiniMap)) continue;

				var sides = Room.GetRoomsOnSides(Rooms, {x: j, y: i});
				if(sides.top)
				{
					var nextRoomPos = Room.GetRoomOnSide({x: j, y: i}, SIDE.TOP, Rooms);
					var nextRoom = Rooms[nextRoomPos.y][nextRoomPos.x];
					if(nextRoom != null && !nextRoom.playerWasThere && room.isCleared)
					{
						var isSecret = (nextRoom.isSecretChamber) ? true : false;
						var info = {i: nextRoomPos.y, j: nextRoomPos.x, isCleared: nextRoomPos.isCleared, playerWasThere: false, isSecret: isSecret, isCurrent: false, isBoss: nextRoom.isBossChamber};
						roomsToDraw.push(info);
					}
				}

				if(sides.left)
				{
					var nextRoomPos = Room.GetRoomOnSide({x: j, y: i}, SIDE.LEFT, Rooms);
					var nextRoom = Rooms[nextRoomPos.y][nextRoomPos.x];
					if(nextRoom != null && !nextRoom.playerWasThere && room.isCleared)
					{
						var isSecret = (nextRoom.isSecretChamber) ? true : false;
						var info = {i: nextRoomPos.y, j: nextRoomPos.x, isCleared: nextRoomPos.isCleared, playerWasThere: false, isSecret: isSecret, isCurrent: false, isBoss: nextRoom.isBossChamber};
						roomsToDraw.push(info);
					}
				}

				if(sides.right)
				{
					var nextRoomPos = Room.GetRoomOnSide({x: j, y: i}, SIDE.RIGHT, Rooms);
					var nextRoom = Rooms[nextRoomPos.y][nextRoomPos.x];
					if(nextRoom != null && !nextRoom.playerWasThere && room.isCleared)
					{
						var isSecret = (nextRoom.isSecretChamber) ? true : false;
						var info = {i: nextRoomPos.y, j: nextRoomPos.x, isCleared: nextRoomPos.isCleared, playerWasThere: false,isSecret: isSecret, isCurrent: false, isBoss: nextRoom.isBossChamber};
						roomsToDraw.push(info);
					}
				}

				if(sides.bottom)
				{
					var nextRoomPos = Room.GetRoomOnSide({x: j, y: i}, SIDE.BOTTOM, Rooms);
					var nextRoom = Rooms[nextRoomPos.y][nextRoomPos.x];
					if(nextRoom != null && !nextRoom.playerWasThere && room.isCleared)
					{
						var isSecret = (nextRoom.isSecretChamber) ? true : false;
						var info = {i: nextRoomPos.y, j: nextRoomPos.x, isCleared: nextRoomPos.isCleared, playerWasThere: false,isSecret: isSecret, isCurrent: false, isBoss: nextRoom.isBossChamber};
						roomsToDraw.push(info);
					}
				}

				var current = false;
				if(room.id == World.Location.Room)
				{
					current = true;
				}

				var isSecret = (room.isSecretChamber) ? true : false;

				var info = {i: i, j: j, isCleared: room.isCleared, playerWasThere: room.playerWasThere, isSecret: isSecret, isCurrent: current, isBoss: room.isBossChamber, isStart: room.isStartChamber};
				roomsToDraw.push(info);
			}
		}

		//zapobiega nawarstwianiu sie pokoi
		var alreadyDrawn = [[]];

		for(var i = 0; i < roomsToDraw.length; i++)
		{
			var info = roomsToDraw[i];
			var text = null;
			var textColor = "white";

			if(info.j- startRoomX >= (RoomsInRow - startRoomX)) continue;
			if(info.i- startRoomY >= (RoomsInColl- startRoomY)) continue;
			if(info.i < startRoomY) continue;
			if(info.j < startRoomX) continue;

			var sides = Room.GetRoomsOnSides(Rooms, {x: info.j, y: info.i});
			var x = startX + ((info.j - startRoomX) * roomRadius * 2) + ((info.j - startRoomX) * space) + roomRadius;
			var y = startY + ((info.i - startRoomY) * roomRadius * 2) + ((info.i - startRoomY) * space) + roomRadius;
			// var x2 = startX + (info.j * roomRadius * 2) + (info.j * space);
			// var y2 = startY + (info.i * roomRadius * 2) + (info.i * space);

			if(alreadyDrawn[info.i])
			{
				if(alreadyDrawn[info.i][info.j])
				{
					continue;
				}
			}
			else
			{
				alreadyDrawn[info.i] = [];
			}
			alreadyDrawn[info.i][info.j] = true;

			var roomBackground = "blue";
			var roomStroke = "blue";

			if(info.isBoss)
			{
				if(info.isCleared)
				{
					roomBackground = "#b40000";
					roomStroke = "#b40000";
					text = "\u2714";
					textColor = roomStroke;
				}
				else
				{
					roomBackground = "red";
					roomStroke = "red";
				}
			}
			else if(info.isSecret)
			{
				if(info.playerWasThere)
				{
					textColor = "black";
				}
				roomBackground = "#222222";
				roomStroke = "#232323";
				text = "?";
			}
			else if(!info.isCleared)
			{
				roomBackground = "gray";
				roomStroke = "lightgray";
			}

			var isSelected = false;
			if(info.isStart)
			{
				roomBackground = "yellow";
				roomStroke = "yellow";
			}

			if(!isSmallVersion && (
				Main.UnlockMiniMap || (World.Player.canFastTravel && info.isCleared) || info.isStart
			))
			{
				var dist = MathHelper.GetDistance([x, y], [Mouse.x, Mouse.y]);
				if((dist < roomRadius) && (World.Location.isCleared) && !World.isChangingLocation)
				{
					if(!info.isCurrent)
					{
						isSelected = true;
						if(Mouse.click)
						{
							Mouse.lockClick = true;
							Mouse.click = false;
							this.Open = false;
							Commands.GoToRoom(info.i, info.j, 2);
						}
					}
				}
			}

			ctx.save();
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = roomBackground;
			ctx.beginPath();
			ctx.arc(x, y, roomRadius, 0, Math.PI * 2);
			ctx.fill();
			ctx.closePath();
			ctx.restore();

			if(info.isCurrent || isSelected)
			{
				ctx.save();
				ctx.globalAlpha = (isSelected) ? 0.5 : 1;
				ctx.lineWidth = roomLine;
				ctx.strokeStyle = "white";
				Graphic.drawCircleWithBreaks(ctx, x, y, roomRadius + (space / 2), 4, 30, true, false, angle);
				ctx.restore();
			}

			ctx.save();
			ctx.lineWidth = roomLine;
			ctx.strokeStyle = roomStroke;
			Graphic.drawCircleWithBreaksOnSides(ctx, x, y, roomRadius, sides, 30, true);
			ctx.restore();

			if(text)
			{
				this.style.fontSize = roomRadius * 1.6;
				this.style.width = roomRadius * 2;
				this.style.height = roomRadius * 2.4;
				this.style.textAlign = "center";
				this.style.strokeSize = 0;
				this.style.fontWeight = "";
				Style.FillText(ctx, this, text, x - roomRadius, y - roomRadius, textColor);
			}
		}
	}

	DrawWorldMap()
	{
		return;
		ctx.save();
		ctx.globalAlpha = 0.4;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.restore();

		var toRender = [];
		var size = 10;
		var color = "white";
		var angle = this.CurrentRoomTransition.Update();

		var minMargin = 150;
		var height = canvas.height - minMargin;
		var width = height * 1.5;

		var startX = (canvas.width - width) / 2;
		var startY = (canvas.height - height) / 2;

		ctx.save();
		ctx.globalAlpha = 0.1;
		ctx.fillStyle = "white";
		Graphic.roundRect(ctx, startX - 10, startY - 10, width + 20, height + 20, 20, true);
		ctx.restore();

		if(Mouse.x >= startX && Mouse.x <= (startX + width) && Mouse.y >= startY && Mouse.y <= (startY + height))
		{
			World.Player.allowAttack = false;
		}

		// console.log(width + " / " + height);


		// var y = 30;
		// var text =  "World Map";

		// this.style.fontSize = 30;
		// this.style.width = 1;
		// this.style.textAlign = "center";
		// Style.FillText(ctx, this, text, canvas.width / 2, y);

		if(this.allowMap)
		{
			var sX = (canvas.width / 2) - (this.MapControls[0].style.width + this.MapControls[1].style.width) / 2;
			var _space = 20;

			this.MapControls[0].x = sX - _space;
			this.MapControls[0].Render();

			
			this.MapControls[1].x = sX + this.MapControls[0].style.width + _space;
			this.MapControls[1].Render();
		}
		else
		{
			var sX = (canvas.width / 2) - this.MapControls[1].style.width / 2;

			this.MapControls[1].x = sX;
			this.MapControls[1].Render();
		}


		this.style = Style.GetStyleByName("MenuInfo");
		this.style.textAlign = "center";

		

		for(var locationName in World.LocationList)
		{
			var location = World.LocationList[locationName];

			if(World.Player.locationInfo[locationName])
			{
				var prevLocationCleared = false;
				if(location.reqPrevLocation)
				{
					if(World.Player.locationInfo[location.reqPrevLocation])
					{
						if(World.Player.locationInfo[location.reqPrevLocation].isCleared)
						{
							prevLocationCleared = true;
						}
					}
				}
				

				if( (World.Player.locationInfo[locationName].isCleared) || (prevLocationCleared) )
				{
					toRender[locationName] = 
					{
						pos: location.MapPos,
						isVillage: location.isVillage,
						specialIcon: location.specialIcon,
						name: location.Name,
						id: locationName,
						requiredLevel: location.requiredLevel,
						canPlayerEnter: (location.requiredLevel > World.Player.stats.Level) ? false : true,
						isCurrent: (locationName == World.Location.constructor.name) ? true : false,
						isCleared: World.Player.locationInfo[locationName].isCleared,
						rank: World.Player.locationInfo[locationName].rank
					};
				}
			}
		}

		var tCanvas = document.createElement("canvas");
			tCanvas.width = canvas.width;
			tCanvas.height = canvas.height;
		var tCtx = tCanvas.getContext("2d");


		for(var locationName in toRender)
		{
			var loc = toRender[locationName];
			var x = startX + loc.pos.x;
			var y = startY + loc.pos.y;
			var isSelected = false;
			//sprawdzanie czy ma zostac wyswietlony


			var dist = MathHelper.GetDistance([x,  y], [Mouse.x, Mouse.y]);
			if((dist < size) && (World.Location.isCleared) && !World.isChangingLocation)
			{
				isSelected = true;
				if(!loc.isCurrent && loc.canPlayerEnter)
				{
					if(Mouse.click)
					{
						Mouse.lockClick = true;
						Mouse.click = false;
						this.Open = false;
						Commands.GoToLocation(loc.id);
					}
				}
			}


			if(loc.isVillage)
			{
				color = "white";
			}
			else if(loc.isCleared)
			{
				color = "yellow";
			}
			else
			{
				color = "red";
			}

			//sciezki
			if(World.LocationList[loc.id].reqPrevLocation)
			{
				var x2 = startX + toRender[World.LocationList[loc.id].reqPrevLocation].pos.x;
				var y2 = startY + toRender[World.LocationList[loc.id].reqPrevLocation].pos.y;

				ctx.save();
				ctx.strokeStyle = "white";
				ctx.lineWidth = 5;
				ctx.beginPath();
				ctx.setLineDash([5, 10]);
				ctx.moveTo(x, y);
				ctx.lineTo(x2, y2);
				ctx.stroke();
				ctx.closePath();
				ctx.restore();
			}


			tCtx.save();
			tCtx.fillStyle = color;
			tCtx.beginPath();
			tCtx.arc(x, y, size, 0, Math.PI * 2);
			tCtx.fill();
			tCtx.closePath();
			tCtx.restore();
			
			//gdzies tutaj jest problem

			if(isSelected || loc.isCurrent)
			{
				tCtx.save();
				tCtx.globalAlpha = (isSelected) ? 0.5 : 1;
				tCtx.lineWidth = 2;
				tCtx.strokeStyle = "white";
				Graphic.drawCircleWithBreaks(tCtx, x, y, size + 5, 4, 30, true, false, angle);
				tCtx.restore();

				if(isSelected)
				{
					var text = loc.name;
					
					if(!loc.canPlayerEnter)
					{
						text += " (lv." + loc.requiredLevel + "+)";
					}
					Style.FillText(tCtx, this, text, Mouse.x, Mouse.y - 30);
				}
			}

			ctx.drawImage(tCanvas, 0, 0);


			if(loc.rank)
			{
				var colors = RunInfo.GetRankColor(loc.rank);

				Style.FillText(ctx, this, loc.rank, x - 5, y + 10, colors.color);
			}
		}
	}
}