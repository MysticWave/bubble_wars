class InventorySlot extends Button
{
	constructor(posX, posY, disabled, id, owner, onUpdate)
	{
		super();
		
		this.text = "";
		this.Owner = owner;
		this.x = posX;
		this.y = posY;
		this.style = {};
		this.id = id;
		this.className = "inventory_slot";
		this.hover = false;
		this.click = false;
		this.rightClick = false;
		this.disabled = disabled || false;
		this.ageInTicks = 0;
		
		this.style = Style.GetStyleByName(this.className);
		this.Width = this.style.width;
		this.Height = this.style.height;
		this.onUpdate = onUpdate;

		this.lastItem = null;
		this.valueChanged = false;
		this.item = null;

		this.valueChangedAlpha = new Transition(0.6, 1, 0.5, true, 0, 0);
		this.ArmorSlot = null;

		this.highLightFrame = 0;
		this.highLightDelay = 3;
	}

	GetItem()
	{
		if(!this.Owner) return null;
		var id = parseInt(this.id.replace("slot", ""));
		var item = null;

		if(id < 141)
		{
			item = this.Owner.inventory[id];
		}
		else
		{
			this.ArmorSlot = this.getArmorSlot(id);
			item = this.Owner.equips[this.ArmorSlot];
		}

		return item;
	}
	
	Update()
	{
		super.Update();
		if(isFunction(this.onUpdate))
		{
			this.onUpdate();
		}
	}
	
	Render()
	{
		super.Render();
		var item = this.GetItem();
			if(item) item.isEquiped = false;
		var slot = null;
		var showHighlight = false;
		
		var id = parseInt(this.id.replace("slot", ""));
		var handItem = (this.Owner) ? this.Owner.hand : null;
		var displayItem = InGame.GUI.Inventory.HoveredItem;

		if(id >= 141)
		{
			this.ArmorSlot = this.getArmorSlot(id);
			if(!item)
			{
				ctx.drawImage(TextureManager.Get(this.imgEmpty), this.x, this.y, this.Width, this.Height);
			}
			else
			{
				item.isEquiped = true;
			}

			//cannot highlight and show info if equipment slot is hovered
			if(handItem || displayItem)
			{
				if(this.ArmorSlot.includes(SLOT.SPECIAL))
				{
					var number = this.ArmorSlot.replace(SLOT.SPECIAL, '');
					this.ArmorSlot = this.ArmorSlot.replace(number, '');
				}

				if(displayItem !== item && this.ArmorSlot && (handItem?.slot == this.ArmorSlot || displayItem?.slot == this.ArmorSlot))
				{
					showHighlight = true;

					InGame.GUI.Inventory.EquipedItemInfoDisplay.item = item;
					InGame.GUI.Inventory.EquipedItemInfoDisplay.startX = this.x;
					InGame.GUI.Inventory.EquipedItemInfoDisplay.startY = this.y;
				}
			}
		}
		else if(handItem)
		{
			if(handItem.type == TYPE.ENCHANT)
			{
				if(item)
				{
					var index = ItemHelper.CanBeEnchanted(item, handItem);
					if(index != null)
					{
						showHighlight = true;
					}
				}
			}
			else if(handItem.type == TYPE.UPGRADE)
			{
				if(item)
				{
					if(isFunction(item.CanBeUpgraded))
					{
						if(item.CanBeUpgraded(this.Owner))
						{
							showHighlight = true;
						}
					}
				}
			}
		}

		if(item)
		{
			item.onInventoryTick();

			ctx.drawImage(TextureManager.Get(item.Texture), this.x, this.y, this.Width, this.Height);

			if(item.Grade)
			{
				var texture_name = 'item_border_' + item.Grade.replace('GRADE_', '').toLowerCase();
				var border_texture = TextureManager.Get(texture_name);
				if(border_texture.name != 'none')
				{
					ctx.drawImage(border_texture, this.x - 1, this.y - 1, this.Width + 2, this.Height + 2);
				}
			}
			
			if(item.count > 1)
			{
				this.text = item.count;
			}
			else
			{
				this.text = "";
			}
			
			item.DrawShine(this.x + 15, this.y + 15);

			Style.FillText(ctx, this);
			

			if(this.hover)
			{
				InGame.GUI.Inventory.HoveredItem = item;
				InGame.GUI.Inventory.ItemInfoDisplay.item = item;
				item.showNewItemInfo = false;
			}


			if(item.showNewItemInfo && !this.ArmorSlot)
			{
				var alpha = this.valueChangedAlpha.Update();
				Style.FillText(ctx, this, 'New!', this.x + 5, this.y - 30, 'white', 'orange', alpha)
			}

		}
		else
		{
			this.text = "";
		}

		if(showHighlight)
		{
			var texture = TextureManager.Get('inventory_slot_changed');
			var frames = texture.height / texture.width;
			if(this.ageInTicks % this.highLightDelay == 0)
			{
				this.highLightFrame++;
				if(this.highLightFrame >= frames)
				{
					this.highLightFrame = 0;
				}
			}

			var size = 2;
			ctx.drawImage(texture, 0, texture.width * this.highLightFrame, texture.width, texture.width, this.x - size / 2, this.y - size / 2, this.Width + size, this.Height + size);
		}
		
	}

	onMouseOut()
	{
		InGame.GUI.Inventory.HoveredItem = null;
	}
	
	Click()
	{
		super.Click();
		
		this.replaceItem();
	}
	
	RightClick()
	{
		this.style = Style.GetStyleByName(this.className, STATE.RIGHTCLICK);
		
		var id = parseInt(this.id.replace("slot", ""));
		var slot = this.getArmorSlot(id);

		if(InGame.GUI.Inventory.isShopOpen)
		{
			var shop_owner = InGame.GUI.Inventory.shopOwner;
			var item = this.GetItem();
			var id = parseInt(this.id.replace('slot', ''));

			if(!shop_owner) return;
			if(!item) return;
			
			shop_owner.Buy(item, InGame.GUI.Inventory.Owner);
			this.Owner.inventory[id] = null;
			return;	//disable quick equip while trading
		}


		if(this.Owner.inventory[id])
		{
			if(isFunction(this.Owner.inventory[id].onUse))
			{
				this.Owner.inventory[id].onUse(this.Owner);
			}
			else
			{
				if(this.Owner.inventory[id].equipAble)
				{
					this.equip(this.Owner.inventory[id]);
				}
				else if(this.Owner.inventory[id].stackAble)
				{
					if(!this.Owner.hand && this.Owner.inventory[id].count > 1)
					{
						this.Owner.hand = ItemHelper.CopyItem(this.Owner.inventory[id]);
						var count = Math.floor(this.Owner.inventory[id].count / 2);
						this.Owner.hand.count -= count;
						this.Owner.inventory[id].count = count;
					}
					else
					{
						if(this.Owner.hand)
						{
							if(this.Owner.hand.constructor.name === this.Owner.inventory[id].constructor.name)
							{
								if(this.Owner.hand.count > 1)
								{
									this.Owner.hand.count -= 1;
									this.Owner.inventory[id].count += 1;
								}
								else
								{
									this.Owner.hand = null;
									this.Owner.inventory[id].count += 1;
								}
							}
						}
					}
				}

			}
		}
		else if(this.Owner.equips[slot])
		{
			//sciaganie przedmiotu
			var item = this.Owner.equips[slot];
			this.Owner.addItemToInventory(item, item.count);
			this.Owner.equips[slot] = null;
			this.Owner.UpdateStats();
		}
		else if(this.Owner.hand)
		{
			if(this.Owner.hand.stackAble && this.Owner.hand.count > 1)
			{
				this.Owner.inventory[id] = ItemHelper.CopyItem(this.Owner.hand);
				this.Owner.hand.count -= 1;
				this.Owner.inventory[id].count = 1;
			}
			
		}
	}
	
	
	
	
	
	
	replaceItem()
	{
		var slot1 = parseInt(this.id.replace("slot", ""));
		var temp = this.Owner.inventory[slot1];
		
		var item_inv = this.Owner.inventory[slot1];
		var item_hand = this.Owner.hand;
		
		if( slot1 < this.Owner.stats.availableSlots )		//tylko sloty w inventory
		{		
			if( item_hand && this.Owner.inventory[slot1])
			{
				if(item_hand.constructor.name == this.Owner.inventory[slot1].constructor.name)
				{
					//przedmioty sa tego samego typu
					if(item_hand.stackAble)
					{
						//stackowanie przedmiotow
						this.Owner.inventory[slot1].count += item_hand.count;
						if(this.Owner.inventory[slot1].count > this.Owner.inventory[slot1].maxStackSize)
						{
							item_hand.count = this.Owner.inventory[slot1].count - this.Owner.inventory[slot1].maxStackSize;
							this.Owner.inventory[slot1].count = this.Owner.inventory[slot1].maxStackSize;
							return;
						}
						else
						{
							this.Owner.hand = null;
							return;
						}
					}
				}
				else if(item_hand.type == TYPE.UPGRADE && this.Owner.inventory[slot1].upgradeAble && this.Owner.inventory[slot1].upgradeLevel < 9)
				{
					//Ulepszanie przedmiotow

					var text = "Not Enough Oxygen!";
					var type = "UPGRADE_ERROR";

					if(this.Owner.inventory[slot1].CanBeUpgraded(this.Owner))
					{
						var result = this.Owner.inventory[slot1].Upgrade(this.Owner, this.Owner.hand.degradeOnFail);
						
						
						
						if(result)
						{
							text = "Upgrade Successful";
							type = "UPGRADE_SUCCESS";
						}
						else
						{
							text = "Upgrade Failed";
							type = "UPGRADE_FAILED";
						}
						

						this.Owner.hand.count--;
						if(this.Owner.hand.count < 1)
						{
							this.Owner.hand = null;
						}
						else
						{
							this.Owner.addItemToInventory(this.Owner.hand, this.Owner.hand.count);
							this.Owner.hand = null;
						}

						// Main.Confirm("Upgrade item now?", function(){console.log(true)} );
						
					}

					DamageIndicator.AddObject(Mouse.x + Camera.xView, Mouse.y - 25 + Camera.yView, text, type);

					return;
				}
				else if(item_hand.type == TYPE.ENCHANT && this.Owner.inventory[slot1].enchantAble)
				{

					var result = this.Owner.inventory[slot1].Enchant(item_hand);
					if(result)
					{
						this.Owner.hand = null;
						DamageIndicator.AddObject(Mouse.x + Camera.xView, Mouse.y - 25 + Camera.yView, "Enchant Successful!", "UPGRADE_SUCCESS");
						return;
					}
				}
			}



			
			this.Owner.inventory[slot1] = this.Owner.hand;
			this.Owner.hand = temp;

		}
		else
		{
			if(item_hand)		//przedmiot w rece
			{		
				var slot = this.getArmorSlot(slot1);			//numer wybranego slotu
				var slot2 = slot.replace("0", "").replace("1", "").replace("2", "").replace("3", "");
				if(item_hand.slot == slot2)			//przedmiot moze byc zalozony w danym slocie
				{
					this.equip(this.Owner.hand, slot);
				}
			}
			else
			{
				//nacisnieto slot wyposazenia (equips)
				var slot = this.getArmorSlot(slot1);
				temp = this.Owner.equips[slot];

				this.Owner.equips[slot] = this.Owner.hand;
				this.Owner.hand = temp;
				this.Owner.UpdateStats();
			}
		}
	}
	
	
	
	
	equip(item, _slot)
	{				
		var slot = item.slot;
		if(slot == SLOT.SPECIAL)
		{
			if(!this.Owner.equips[slot + "0"])
			{
				slot += "0";
			}
			else if(!this.Owner.equips[slot + "1"])
			{
				slot += "1";
			}
			else if(!this.Owner.equips[slot + "2"])
			{
				slot += "2";
			}
			else if(!this.Owner.equips[slot + "3"])
			{
				slot += "3";
			}
			else
			{
				return;
			}

			if(_slot)
			{
				slot = _slot;
			}
		}
		
		if(this.Owner.hand === item)		//przedmiot jest zakladany z reki
		{		
			if(this.Owner.hand.requiredLevel <= this.Owner.stats.Level)
			{
				var temp = this.Owner.equips[slot];
				this.Owner.equips[slot] = this.Owner.hand;
				this.Owner.hand = temp;
			}
		}
		else
		{
			if(item.requiredLevel <= this.Owner.stats.Level)
			{
				var id = this.Owner.inventory.indexOf(item);

				if(id >= 0)
				{
					var temp = this.Owner.equips[slot];
					this.Owner.equips[slot] = item;
					this.Owner.inventory[id] = temp;
				}
			}
		}
		
		this.Owner.UpdateStats();
	}
	
	getArmorSlot(id)
	{
		var armor_slots = 
		[
			[SLOT.CANNON, 141],			//cannon
			[SLOT.CORE, 142],			//core
			[SLOT.DRIVE, 143],			//drive
			[SLOT.SPECIAL + "0", 144],
			[SLOT.SPECIAL + "1", 145],
			[SLOT.SPECIAL + "2", 146],
			[SLOT.SPECIAL + "3", 147],
		];

		if(id)
		{
			for(var num = 0; num < armor_slots.length; num++)
			{
				if(typeof id === "string")		//podano nazwe slotu
				{	
					if(armor_slots[num][0] == id)
					{
						return armor_slots[num][1];		//zwraca numer slotu
					}
				}
				else
				{					//podano numer slotu
					if(armor_slots[num][1] == id)
					{
						return armor_slots[num][0];		//zwraca nazwe slotu
					}
				}
			}
		}
		else
		{					
			return armor_slots;
		}
	}
	
	
	
}