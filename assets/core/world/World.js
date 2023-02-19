class World
{
	static Initialize()
	{
		Camera.Initialize();
		this.Location;
		this.Players = [new Player()];
		this.Player = this.Players[0];
		this.PlayerEntities = [];
		this.Entities = [];
		this.Projectiles = [];
		this.Particles = [];
		this.MinimalDeep = 0;
		this.deep = 0;
		this.isChangingLocation = false;
		this.timeSinceLocationChange = 0;
		this.ageInTicks = 0;
		this.timeSinceRoomChange = 0;

		this.Border = 4000;
		this.HighestRadius = 2000;

		this.Width = (this.Border + this.HighestRadius) * 2;
		this.Height = (this.Border + this.HighestRadius) * 2;

		this.backgroundTranslateX = 0;
		this.backgroundTranslateY = 0;
		

		this.CenterPoint = {x: this.Width / 2, y: this.Height / 2};	

		this.currentRoom = null;
		this.isPortalOpen = false;
		this.portalGradient = null;

		this.BorderTrigger = new TriggerPoint(0, 0, 0, "BorderTrigger", function(entity)
		{
			if(!entity) return;
			if(!Main.BorderLess)
			{
				var motion = Motion.Get([entity.x, entity.y], [this.x, this.y], 1000);
				entity.ApplyMove(motion);
			}
		}, function()
		{
			if(!this.inRange && !World.isChangingLocation)
			{
				return true;
			}
			return false;
		});



		var method = function()
		{
			World.Location?.onBorderTrigger?.(this);
			if(!World.Location.isCleared) return;
			if(World.isChangingLocation) return;

			var currentRoom = MathHelper.GetRoomByIndex(World.Location.Rooms, World.Location.Room);
			var Sides = Room.GetRoomsOnSides(World.Location.Rooms, currentRoom);

			switch(this.id)
			{
				case "borderTrigger1":
					//right
					if((Sides.right) && World.Player.velocityX > 0)
					{
						var room = Room.GetRoomOnSide(currentRoom, SIDE.RIGHT);
						if(World.Location.Rooms[room.y][room.x])
						{
							World.changeLocation(SIDE.RIGHT);
						}
					}
					
					
					break;

				case "borderTrigger2":
					//down
					if((Sides.bottom) && World.Player.velocityY > 0)
					{
						var room = Room.GetRoomOnSide(currentRoom, SIDE.BOTTOM);
						if(World.Location.Rooms[room.y][room.x])
						{
							World.changeLocation(SIDE.BOTTOM);
						}
					}
					
					break;

				case "borderTrigger3":
					//left
					
					if((Sides.left) && World.Player.velocityX < 0)
					{
						var room = Room.GetRoomOnSide(currentRoom, SIDE.LEFT);
						if(World.Location.Rooms[room.y][room.x])
						{
							World.changeLocation(SIDE.LEFT);
						}
					}
					
					
					break;

				case "borderTrigger4":
					//top
					if((Sides.top) && World.Player.velocityY < 0)
					{
						var room = Room.GetRoomOnSide(currentRoom, SIDE.TOP);						
						if(World.Location.Rooms[room.y][room.x])
						{
							World.changeLocation(SIDE.TOP);
						}
					}

					break;
			}
		};

		var trigger = function(entity)
		{
			if( (entity instanceof Player) && (this.inRange))
			{
				return true;
			}
			return false;
		};

		this.roomChangeTriggerRange = 100;
		var triggersRange = this.roomChangeTriggerRange * 1.1;
		this.roomTrigger1 = new TriggerPoint(0, 0, triggersRange, "borderTrigger1", method, trigger);
		this.roomTrigger2 = new TriggerPoint(0, 0, triggersRange, "borderTrigger2", method, trigger);
		this.roomTrigger3 = new TriggerPoint(0, 0, triggersRange, "borderTrigger3", method, trigger);
		this.roomTrigger4 = new TriggerPoint(0, 0, triggersRange, "borderTrigger4", method, trigger);

		this.changeLocationTrigger = new TriggerPoint(this.CenterPoint.x, this.CenterPoint.y, 180, "test", function(player)
		{
			if(!player.isMoving)
			{
				var motion = Motion.Get([player.x, player.y], [this.x, this.y], 50);
				player.ApplyMove(motion);

				if(!player.isRecalling)
				{
					if(World.currentRoom.isStartChamber && World.Location.prevLocation)
					{
						Commands.GoToLocation(World.Location.prevLocation, 3);
					}
					else if(World.currentRoom.isBossChamber && World.currentRoom.isCleared && World.Location.nextLocation)
					{
						Commands.GoToLocation(World.Location.nextLocation, 3);
					}
				}
			}
		}, trigger);
	}

	static InitializeLocation(location)
	{
		this.LocationList = this.LocationList || {};
		var _class = new location();
		this.LocationList[_class.constructor.name] = _class;

		ItemHelper.InitLocationDrop(_class);
	}

	static InitializeDimension(dimension)
	{
		this.DimensionsList = this.DimensionsList || {};
		var _class = new dimension();
		this.DimensionsList[_class.constructor.name.toUpperCase()] = _class;
	}
	
	static RegisterEntity(entity)
	{
		this.EntityList = this.EntityList || {};
		this.EntityList[entity.name] = entity;
	}

	static changeLocation(Side)
	{
		if(Side)
		{
			this.currentChangeTime = 0;
			this.Side = Side;
			this.isChangingLocation = true;
			return;
		}

		var screenX = canvas.width * .66;		//position on screen
		var screenY = canvas.height * .66;		//position on screen
		// var changeTime = 1.5 * Main.FPS;
		
		this.currentChangeTime++;

		var spd = 1500;
		// var timeToChange = Math.round((spd / dist) * Main.FPS);
		var timeToChange = 45;
		var isChangeTick = (this.currentChangeTime == timeToChange);

		
		this.changeTime = timeToChange * 2;

		var nextPos = [];
		var motion;
		this.Player.allowMove = false;
		this.Player.allowControl = false;
		this.canChangeLocation = false;


		if(isChangeTick)
		{
			//w polowie drogi zmienia pozycje gracza oraz pokoj
			var currentRoomIndex = MathHelper.GetRoomByIndex(this.Location.Rooms, this.Location.Room);
			var nextRoomPos = Room.GetRoomOnSide(currentRoomIndex, this.Side);
			var nextRoom = this.Location.Rooms[nextRoomPos.y][nextRoomPos.x];

			this.currentRoom.Quit();
			nextRoom.Enter();
		}
		
		if(this.Side == SIDE.TOP)
		{
			motion = Motion.Get([this.Player.x, this.Player.y], [this.Player.x, 0], spd);

			if(isChangeTick) nextPos = [this.Player.x, (this.CenterPoint.y + this.Radius) + screenY];
		}
		else if(this.Side == SIDE.BOTTOM)
		{
			motion = Motion.Get([this.Player.x, this.Player.y], [this.Player.x, this.Height], spd);
			
			if(isChangeTick) nextPos = [this.Player.x, (this.CenterPoint.y - this.Radius) - screenY];
		}
		else if(this.Side == SIDE.RIGHT)
		{
			motion = Motion.Get([this.Player.x, this.Player.y], [this.Width, this.Player.y], spd);

			if(isChangeTick) nextPos = [(this.CenterPoint.x - this.Radius) - screenX, this.Player.y];
		}
		else if(this.Side == SIDE.LEFT)
		{
			motion = Motion.Get([this.Player.x, this.Player.y], [0, this.Player.y], spd);

			if(isChangeTick) nextPos = [(this.CenterPoint.x + this.Radius) + screenX, this.Player.y];
		}
		else
		{
			return;
		}

		this.Player.ApplyMove(motion);

		if(isChangeTick)
		{
			//w polowie drogi zmienia pozycje gracza oraz pokoj
			var oldX = this.Player.x;
			var oldY = this.Player.y;

			this.Player.x = nextPos[0];
			this.Player.y = nextPos[1];

			//tp particles
			for(var i = 0; i < this.Particles.length; i++)
			{
				var particle = this.Particles[i];
					particle.x += nextPos[0] - oldX;
					particle.y += nextPos[1] - oldY;
			}

			//reset laser rotation
			this.Player.laserRotation = null;

			return;
		}

		var distance = MathHelper.GetDistance([this.Player.x, this.Player.y], [this.CenterPoint.x, this.CenterPoint.y]);
		if((distance < this.Radius) && (distance < this.Radius - 30) && (this.currentChangeTime > timeToChange))
		{
			//zeby nie mrygal przy przechodzeniu po ukonczonych pokojach
			//aktywuje tarcze przy wejsciu do babla
			this.Player.timeInRoom = (!this.currentRoom.isCleared) ? 0 : this.Player.timeInRoom;
			this.timeSinceRoomChange = 0;
		}

		if((distance < this.Radius - 120) && (this.currentChangeTime > timeToChange))
		{
			this.isChangingLocation = false;
			this.Player.allowMove = true;
			this.Player.allowControl = true;
		}
	}

	static GetBackgroundPosition()
	{
		var x = this.backgroundTranslateX;
		var y = -Camera.yView - (this.deep * this.Height) + this.backgroundTranslateY;

		return {x, y};
	}
	
	static LoadMap(name, init)
	{
		if(init)
		{
			this.LocationList[name] = new this.LocationList[name].constructor();
		}
		this.Location = this.LocationList[name];

		//usuwa wszystkie byty z mapy
		this.Kill(Entity, true);

		if(isFunction(this.Location.onLoad))
		{
			this.Location.onLoad();
		}
		
		this.changeLocationTrigger.x = this.CenterPoint.x;
		this.changeLocationTrigger.y = this.CenterPoint.y;

		this.Player.totalDamageReceived = 0;
		this.Player.RunStats = this.Player.getDefaultRunStats();
		this.Player.Save();

		var tX = this.Location.startX ?? 0;
		var tY = this.Location.startY ?? 0;

		this.Player.timeInLocation = 0;
		this.Player.x = this.CenterPoint.x + tX;
		this.Player.y = this.CenterPoint.y + tY;
	}

	static SetRadius(r)
	{
		if(r > this.HighestRadius) this.Radius = this.HighestRadius;
		else this.Radius = r;
	}
	
	static Update()
	{
		this.ageInTicks++;
		this.timeSinceRoomChange++;

		if(this.Location)
		{
			this.Location.Update();
		}


		this.Player = this.Players[0];
		this.Player.timeInRoom++;
		if(this.Player.movedInRoom)
		{
			this.timeSinceLocationChange++;
		}

		if(this.isChangingLocation)
		{
			this.changeLocation();
		}

		this.triggerPoints = [];
		// var border_diff = 25;
		var border_diff = 0;
		this.BorderTrigger.x = this.CenterPoint.x;
		this.BorderTrigger.y = this.CenterPoint.y;
		this.BorderTrigger.Radius = this.Radius;

		
		var pos1 = MathHelper.lineToAngle([World.CenterPoint.x, World.CenterPoint.y], World.Radius - border_diff, 0);
		var pos2 = MathHelper.lineToAngle([World.CenterPoint.x, World.CenterPoint.y], World.Radius - border_diff, 90);
		var pos3 = MathHelper.lineToAngle([World.CenterPoint.x, World.CenterPoint.y], World.Radius - border_diff, 180);
		var pos4 = MathHelper.lineToAngle([World.CenterPoint.x, World.CenterPoint.y], World.Radius - border_diff, 270);

		this.roomTrigger1.x = pos1.x;
		this.roomTrigger1.y = pos1.y;

		this.roomTrigger2.x = pos2.x;
		this.roomTrigger2.y = pos2.y;

		this.roomTrigger3.x = pos3.x;
		this.roomTrigger3.y = pos3.y;

		this.roomTrigger4.x = pos4.x;
		this.roomTrigger4.y = pos4.y;

		this.triggerPoints[0] = this.BorderTrigger;
		this.triggerPoints[1] = this.roomTrigger1;
		this.triggerPoints[2] = this.roomTrigger2;
		this.triggerPoints[3] = this.roomTrigger3;
		this.triggerPoints[4] = this.roomTrigger4;

		if(this.currentRoom)
		{
			if(
				(this.currentRoom.isStartChamber && this.Location.prevLocation) || 
				(this.currentRoom.isBossChamber && this.currentRoom.isCleared && this.Location.nextLocation))
			{
				this.portalLocationName = (this.currentRoom.isBossChamber) ? this.Location.nextLocation : this.Location.prevLocation;

				//Portal otwiera sie 5 sekundy po wejsciu do lokacji
				if(this.timeSinceLocationChange > Main.FPS * 5 && this.Location.canOpenPortal())
				{
					if(!this.isPortalOpen)
					{
						this.portalTextTransition = new Transition(1, 0, 5);
					}
					this.isPortalOpen = true;
					this.triggerPoints.push(this.changeLocationTrigger);

					this.particleAngle = this.particleAngle || new Transition(0, 360, 2, false, 0, 0, true);
					// var angle = this.particleAngle.Update();
					// var count = 6;
					var angle = MathHelper.randomInRange(0, 360);
					var count = 1;

					if(this.ageInTicks % 2 == 0)
					{
						Particle.SummonCirclePattern(this.Location.TunnelTexture, this.changeLocationTrigger.x, this.changeLocationTrigger.y, 0.4, 100, count, 
							this.changeLocationTrigger.Radius - 30, angle, null, false);
					}
				}
			}
		}
		


		if(this.Location)
		{
			if(this.Location.triggerPoints)
			{
				this.triggerPoints = this.triggerPoints.concat(this.Location.triggerPoints);
			}
		}

		

		
		for(var i = this.Projectiles.length - 1; i >= 0 ; i--)
		{
			this.Projectiles[i].isOnScreen = isOnScreen(this.Projectiles[i]);
			this.Projectiles[i].Update();
		}
		
		for(var i = 0; i < this.Players.length; i++)
		{
			var entity = this.Players[i];
				entity.Update();

			for(var j = 0; j < this.triggerPoints.length; j++)
			{
				this.triggerPoints[j].Update(entity);
			}
		}
		
		Camera.Update(this.Player.x, this.Player.y, this.Player.posX, this.Player.posY);
		
		if(!this.Player.isAlive) return;

		for(var i = this.Entities.length - 1; i >= 0 ; i--)
		{
			var entity = this.Entities[i];
				entity.isOnScreen = isOnScreen(entity);
				entity.Update();
				

			// for(var j = 0; j < this.triggerPoints.length; j++)
			// {
			// 	this.triggerPoints[j].Update(entity);
			// }

			// var _x = entity.x;
			// var _y = entity.y;

			// var posX = _x - Camera.xView;
			// var posY = _y - Camera.yView;

			// if ((posX >= -100) && (posX <= canvas.width + 100) && (posY >= -100) && (posY <= canvas.height + 100))
			// {
				//Players[0].nearestEntities.Add(entity);
			// }
		}
	}

	static GetDifficultyLevel()
	{
		return this.Player.Difficulty;
	}
	
	static Spawn(entity)
	{
		if(entity instanceof Projectile)
		{
			this.AddProjectile(entity);
			return;
		}
		
		if(entity instanceof Particle)
		{
			this.AddParticle(entity);
			return;
		}
		
		if(entity instanceof Entity)
		{
			this.AddEntity(entity);
			return;
		}
	}
	
	static Kill(entity, all = false)
	{
		if(!all)
		{
			if(typeof entity !== "object") return;

			if(entity instanceof Projectile)
			{
				this.RemoveProjectile(entity);
				return;
			}
			
			if(entity instanceof Particle)
			{
				this.RemoveParticle(entity);
				return;
			}
			
			if(entity instanceof Entity)
			{
				this.RemoveEntity(entity);
				return;
			}
		}
		else
		{
			if(entity === Projectile)
			{
				this.Projectiles = [];
				return;
			}

			if(entity === Particle)
			{
				this.Particles = [];
				return;
			}

			if(entity === Entity)
			{
				this.Entities = [...this.PlayerEntities];
				return;
			}
		}
	}
	
	static AddEntity(entity, onTop = true)
	{
		if(onTop) this.Entities.push(entity);
		else this.Entities.unshift(entity);
		
		if(entity.isFromPlayer) this.PlayerEntities.push(entity);
		entity.onSummon();
	}
	
	static RemoveEntity(entity)
	{
		if(entity.isFromPlayer)
		{
			for(var i = 0; i < this.PlayerEntities.length; i++)
			{
				if(this.PlayerEntities[i] === entity)
				{
					this.PlayerEntities.splice(i, 1);
				}
			}
		}

		for(var i = 0; i < this.Entities.length; i++)
		{
			if(this.Entities[i] === entity)
			{
				this.Entities.splice(i, 1);
			}
		}
	}
	
	static AddProjectile(projectile)
	{
		this.Projectiles.push(projectile);
	}
	
	static RemoveProjectile(projetile)
	{
		for(var i = 0; i < this.Projectiles.length; i++)
		{
			if(this.Projectiles[i] === projetile)
			{
				this.Projectiles.splice(i, 1);
			}
		}
	}
	
	static AddParticle(particle)
	{
		this.Particles.push(particle);
	}
	
	static RemoveParticle(particle)
	{
		for(var i = 0; i < this.Particles.length; i++)
		{
			if(this.Particles[i] === particle)
			{
				this.Particles.splice(i, 1);
			}
		}
	}

	
	static Render()
	{
		if(!this.Location) return;

		this.deep = (this.deep < 0) ? 0 : this.deep;
		ChangeLayer(Graphic.Layer.Background);

			this.Location.Render();

			if(this.isPortalOpen)
			{
				var outerRadius = World.changeLocationTrigger.Radius - 60;

				var x = World.CenterPoint.x - Camera.xView;
				var y = World.CenterPoint.y - Camera.yView;
				var innerRadius = 10;

				var portal_gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
					portal_gradient.addColorStop(0, 'black');
					portal_gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

				ctx.save();
				ctx.fillStyle = portal_gradient;
				ctx.fillRect(x - outerRadius, y - outerRadius, outerRadius * 2, outerRadius * 2);
				ctx.restore();
			}
			
			var title = " ";
			var subtitle = " ";

			if(this.Location)
			{
				title = this.Location.Title || " ";
				subtitle = this.Location.Subtitle || " ";
			}
			
			var alpha = 0.7;
			var multiplier = (this.isPortalOpen) ? this.portalTextTransition.Update() : 1;
			this.style = Style.GetStyleByName("stage");
			this.style.fontSize = 100 * multiplier;
			Style.FillText(ctx, this, Lang.Get(title), this.CenterPoint.x - Camera.xView, this.CenterPoint.y - (80 * multiplier)- Camera.yView, null, null, alpha);
		
			this.style.fontSize = 70 * multiplier;
			Style.FillText(ctx, this, Lang.Get(subtitle), this.CenterPoint.x -Camera.xView, this.CenterPoint.y + (40 * multiplier)- Camera.yView, null, null, alpha);
		
		RestoreLayer();
		

		ChangeLayer(Graphic.Layer.Main);

		for(var i = 0; i < this.Projectiles.length; i++)
		{
			if(!this.Projectiles[i].isOnScreen && !this.Projectiles[i].alwaysRender) continue;
			this.Projectiles[i].Render(ctx);
		}

		for(var i = 0; i < this.Players.length; i++)
		{
			this.Players[i].Render(ctx);
		}
		
		for(var i = 0; i < this.Entities.length; i++)
		{
			if(!this.Entities[i].isOnScreen && !this.Entities[i].alwaysRender) continue;
			this.Entities[i].Render(ctx);
		}

		RestoreLayer();




		ChangeLayer(Graphic.Layer.Particle);

			ctx.save();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.globalCompositeOperation = "destination-over";

			for(var i = this.Particles.length - 1; i >= 0 ; i--)
			{
				this.Particles[i].isOnScreen = isOnScreen(this.Particles[i]);
				this.Particles[i].Render(ctx);
			}

			ctx.restore();

		

		if(Main.ShowHitbox)
		{
			for(var i = 0; i < this.triggerPoints.length; i++)
			{
				var x = this.triggerPoints[i].x - Camera.xView;
				var y = this.triggerPoints[i].y - Camera.yView;

				ctx.save();
				ctx.strokeStyle = "red";
				ctx.fillRect(x - 1, y - 1, 2, 2);

				ctx.beginPath();
				ctx.arc(x, y, this.triggerPoints[i].Radius, 0, 2 * Math.PI);
				ctx.stroke();
				ctx.restore();
			}
		}

		RestoreLayer();

		if(this.isPortalOpen)
		{
			var distance = MathHelper.GetDistance([this.CenterPoint.x - Camera.xView, this.CenterPoint.y - Camera.yView], [Mouse.x, Mouse.y]);
			if(distance <= outerRadius / 2)
			{
				this.style = Style.GetStyleByName();
				var name = (this.LocationList[this.portalLocationName]) ? this.LocationList[this.portalLocationName].GetDisplayName() : " ";
				Style.FillText(ctx, this, name, this.CenterPoint.x - 16 - Camera.xView, this.CenterPoint.y - Camera.yView + (outerRadius / 2));
			}
		}


		var LightLevelInfo = this.Location.getLightLevelInfo();
		if(LightLevelInfo) 
		{
			Graphic.addLightSource(Mouse.x, Mouse.y, 100);
			Graphic.RenderLightLevelShader(LightLevelInfo);
		}
	}
}