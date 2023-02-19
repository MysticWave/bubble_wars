class Inventory
{
	constructor(owner)
	{
		this.Owner = owner;
		this.Open = false;
		this.isShopOpen = false;
		this.section = 0;
		this.x = 10;
		this.y = 150;
		this.Width = 206;
		this.Height = 430;
		this.backgroundColor = "rgba(255, 255, 255, 0.1)";
		this.style = Style.GetStyleByName("Default");
		this.hover = false;
		this.margin = 20;
		
		this.Slots = [[]];
		this.shopSlots = [];
		this.EqSlots = [];
		this.shopX = 0;
		this.shopY = 0;

		this.ItemInfoDisplay = new itemInfoDisplay();
		this.HoveredItem = null;
		
		this.EquipedItemInfoDisplay = new itemInfoDisplay();
		this.EquipedItemInfoDisplay.useMousePosition = false;

		this.shopOwner = null;
		
		this.createSlots();
	}

	OpenShop(shopOwner)
	{
		this.shopOwner = shopOwner;
		if(isFunction(shopOwner.onTrade)) shopOwner.onTrade();
		this.isShopOpen = true;
		this.Open = true;
	}
	
	
	Update()
	{
		if(InGame.pause) return;
		// if(InGame.GUI.Dialog.Open) return;

		if((Settings.Controls.StateOpenInventory) && (!this.lockInventory) && !InGame.GUI.Map.Open)
		{
			this.Open = (this.Open) ? false : true;
			this.isShopOpen = false;
			this.lockInventory = true;
		}
		else
		{
			if(!Settings.Controls.StateOpenInventory)
			{
				this.lockInventory = false;
			}

			if(Settings.Controls.StateEscape) 
			{
				if(this.Open)
				{
					InGame.lockEscape = true;
					this.Open = false;
					this.isShopOpen = false;
				}
			}
		}

		InGame.GUI.PlayerStats.Open = this.Open;

		if(!this.Open)
		{
			// if(this.Owner.hand)
			// {
			// 	this.Owner.addItemToInventory(this.Owner.hand);
			// 	this.Owner.hand = null;
			// }
			return;
		}
		// Mouse.cursor = 'default';
		if(this.Owner.hand || this.hover) Mouse.cursor = 'default';
		if(this.hover)
		{
			this.Owner.allowAttack = false;
		}

		if(InGame.GUI.RunInfo.Open) return;
		var i;
		this.hover = false;
		

		this.x = (canvas.width / 2) - (this.Width / 2);
		this.y = (canvas.height / 2) - (this.Height / 2);

		if(this.isShopOpen)
		{
			this.Owner.allowControl = false;
			this.Owner.allowMove = false;
			InGame.GUI.PlayerStats.Open = false;
			var maxSpaceBetweenShops = 100;
			var spaceBetweenShops = canvas.width - 2 * this.Width;
			if(spaceBetweenShops > maxSpaceBetweenShops) spaceBetweenShops = maxSpaceBetweenShops;

			this.x = (canvas.width / 2) - this.Width - spaceBetweenShops / 2;
			this.shopY = this.y;
			this.shopX = this.x + this.Width + spaceBetweenShops;

			for(i = 0; i < this.shopSlots.length; i++)
			{
				this.shopSlots[i].Owner = this.shopOwner;
				this.shopSlots[i].Update();
			}
		}
		else
		{
			for(i = 0; i < this.EqSlots.length; i++)
			{
				this.EqSlots[i].Update();
			}
		}


		this.equipmentSlotsX = canvas.width - (55 + 2 * this.margin);
		this.equipmentSlotsWidth = 60;
		this.radius = this.margin;

		//zapobiega na strzelanie podczas przesuwania przedmiotow
		if(
			Mouse.CheckHoverState(this.x - this.margin, this.y - this.margin, this.Width + 2 * this.margin, this.Height + 2 * this.margin) ||		//inventory
			Mouse.CheckHoverState(this.equipmentSlotsX, this.y - this.margin, this.equipmentSlotsWidth + this.margin, this.Height + 2 * this.margin) ||		//equipements
			(Mouse.CheckHoverState(this.shopX - this.margin, this.shopY - this.margin, this.Width + this.margin, this.Height + 2 * this.margin) && this.isShopOpen)//shop
		)
		{
			this.hover = true;
		}


		for(i = 0; i < this.Slots[this.section].length; i++)
		{
			this.Slots[this.section][i].Update();

			this.Slots[this.section][i].disabled = (i < this.Owner.stats.availableSlots) ? false : true;
		}

		this.ItemInfoDisplay.Update();
		this.EquipedItemInfoDisplay.Update();
	}
	
	Render()
	{
		if(!this.Open || InGame.GUI.Map.Open) return;
		if(InGame.pause) return;
		if(InGame.GUI.RunInfo.Open) return;


		var margin = this.margin;
		var infoColor = "lightblue";
		var infoStroke = "#569af3";

		//inventory slots background
		ctx.save();
		ctx.fillStyle = this.backgroundColor;
		Graphic.roundRect(ctx, this.x - margin, this.y - margin, this.Width + 2 * margin, this.Height + 2 * margin, this.radius, true, false);
		ctx.restore();

		this.style = Style.GetStyleByName("Default");

		var text = Lang.Translate('OXYGEN') + ":  " + ((this.Owner.coins > 0) ? Style.DottedText(this.Owner.coins) : this.Owner.coins);
		Style.FillText(ctx, this, text, false, (this.y + this.Height) - 20, infoColor, infoStroke);


		


		var i;

		if(!this.isShopOpen)
		{
			//equipment slots background
			ctx.save();
			ctx.fillStyle = this.backgroundColor;
			Graphic.roundRect(ctx, this.equipmentSlotsX, this.y - margin, this.equipmentSlotsWidth +  margin, this.Height + 2 * margin, this.radius, true, false);
			ctx.restore();

			for(i = 0; i < this.EqSlots.length; i++)
			{
				this.EqSlots[i].Render();
			}
		}
		else
		{
			ctx.save();
			ctx.fillStyle = this.backgroundColor;
			Graphic.roundRect(ctx, this.shopX - margin, this.shopY - margin, this.Width + 2 * margin, this.Height + 2 * margin, this.radius, true, false);
			ctx.restore();

			for(i = 0; i < this.shopSlots.length; i++)
			{
				this.shopSlots[i].Render();
			}

			text = "Trade with  " + this.shopOwner.name;
			this.style.textAlign = 'center';
			this.style.fontSize = 25;
			Style.FillText(ctx, this, text, canvas.width / 2, this.y - 80, infoColor, infoStroke);
		}
		
						
		
		
		for(i = 0; i < this.Slots[this.section].length; i++)
		{
			this.Slots[this.section][i].Render();
		}

		

		if(this.Owner.hand)
		{
			var item = this.Owner.hand;
			var scale = 1.5;
			var width = this.Slots[0][0].Width * scale;
			var height = this.Slots[0][0].Height * scale;

			ctx.drawImage(TextureManager.Get(item.Texture), Mouse.x - width / 2, Mouse.y - height / 2, width, height);
			item.DrawShine(Mouse.x - width / 2 + (15 * scale), Mouse.y - height / 2 + (15 * scale), scale);

			if(item.count > 1)
			{
				Style.FillText(ctx, this, item.count, Mouse.x + (width / scale) / 4, Mouse.y - 10 + (height / scale) / 4);
			}
			
		}

		this.ItemInfoDisplay.Render();
		this.EquipedItemInfoDisplay.Render();
	}
	
	
	createSlots()
	{
		var cols = 9;
		var rows = 7;
		var odstep = 55;
		var sections = 5;		//liczba sekcji slotow		(dostepne sa 4 dla gracza, + 1 dodatkowa)
		var id = 0;

		var armor_cols = 2;
		var armor_rows = 7;
		var armor_slot = 0;


		this.Width = cols * odstep;
		this.Height = (rows * odstep) + 20;
		
		for( var i = 0; i < sections; i++)
		{
			this.Slots[i] = [];
			for(var j = 0; j < rows; j++)
			{
				for(var k = 0; k < cols; k++)
				{
					var button = new InventorySlot((k * odstep), (j * odstep), false, "slot" + id, this.Owner, function()
					{
						this.x = InGame.GUI.Inventory.x + this.posX;
						this.y = InGame.GUI.Inventory.y + this.posY;
					});
						
					if(id >= this.Owner.stats.availableSlots)
					{
						button.disabled = true;
					}

					button.posX = (k * odstep);
					button.posY = (j * odstep);
					button.opacity = 0.8;

					this.Slots[i].push(button);
					id++;
				}
			}
		}



		var shopId = 0;


		for(var j = 0; j < rows; j++)
		{
			for(var k = 0; k < cols; k++)
			{
				var button = new InventorySlot((k * odstep), (j * odstep), false, "slot" + shopId, null, function()
				{
					this.x = InGame.GUI.Inventory.shopX + this.posX;
					this.y = InGame.GUI.Inventory.shopY + this.posY;

					this.disabled = false;

					if(this.Owner)
					{
						var item = this.GetItem();
						var id = parseInt(this.id.replace('slot', ''));
						if(id >= this.Owner.stats.availableSlots)
						{
							this.disabled = true;
						}

						if(item)
						{
							// item.price = item.buyPrice;
							item.isInShop = true;
						}
					}
				});

				button.RightClick = function()
				{
					var item = this.GetItem();
					if(!this.Owner) return;
					if(!item) return;

					var id = parseInt(this.id.replace('slot', ''));
					
					if(item.stackAble && item.count >= 1) this.Owner.sellCountable(id, InGame.GUI.Inventory.Owner);
					else this.Owner.Sell(id, InGame.GUI.Inventory.Owner);
				};

				button.Click = function(){
					if(!this.Owner) return;

					var id = parseInt(this.id.replace('slot', ''));

					var item = this.GetItem();
					if(!item)
					{
						if(InGame.GUI.Inventory.Owner.hand)
						{
							//sell
							this.Owner.Buy(InGame.GUI.Inventory.Owner.hand, InGame.GUI.Inventory.Owner);
						}
					}
					else
					{
						if(InGame.GUI.Inventory.Owner.hand)
						{
							//sell
							this.Owner.Buy(InGame.GUI.Inventory.Owner.hand, InGame.GUI.Inventory.Owner);
						}
						else
						{
							//buy
							this.Owner.Sell(id, InGame.GUI.Inventory.Owner, true);
						}
					}
				};

				button.posX = (k * odstep);
				button.posY = (j * odstep);
				button.opacity = 0.8;

				this.shopSlots.push(button);
				shopId++;
			}
		}



		
		var method = function()
		{
			this.x = canvas.width - 80;
			this.y = InGame.GUI.Inventory.y + this.posY;
		};
		
		//cannon
		this.EqSlots[0] = new InventorySlot(canvas.width, this.y, false, "slot141", this.Owner, method);
		this.EqSlots[0].posY = 10;
		
		//drive
		this.EqSlots[1] = new InventorySlot(canvas.width, this.y + odstep, false, "slot142", this.Owner, method);
		this.EqSlots[1].posY = 10 + odstep;
		
		//ammo
		this.EqSlots[2] = new InventorySlot(canvas.width, this.y + ( 2* odstep), false, "slot143", this.Owner, method);
		this.EqSlots[2].posY = 10 + 2 * odstep;



		//special1
		this.EqSlots[3] = new InventorySlot(canvas.width, this.y + ( 2* odstep), false, "slot144", this.Owner, method);
		this.EqSlots[3].posY = 10 + 3 * odstep;

		//special2
		this.EqSlots[4] = new InventorySlot(canvas.width, this.y + ( 2* odstep), false, "slot145", this.Owner, method);
		this.EqSlots[4].posY = 10 + 4 * odstep;

		//special3
		this.EqSlots[5] = new InventorySlot(canvas.width, this.y + ( 2* odstep), false, "slot146", this.Owner, method);
		this.EqSlots[5].posY = 10 + 5 * odstep;

		//special4
		this.EqSlots[6] = new InventorySlot(canvas.width, this.y + ( 2* odstep), false, "slot147", this.Owner, method);
		this.EqSlots[6].posY = 10 + 6 * odstep;
		
		
		for(var i = 0; i < this.EqSlots.length; i++)
		{
			this.EqSlots[i].opacity = 0.8;
			this.EqSlots[i].imgEmpty = this.EqSlots[i].getArmorSlot(i + 141).replace("EQUIPMENT_SLOT_", "").replace("0", "").replace("1", "").replace("2", "").replace("3", "").toLowerCase() + "_empty";
		}
		
	}
}