class InventoryGUI
{
    static Init(container_id = 'inventory', required_slots, type)
    {
        if(!InventoryGUI.Containers) InventoryGUI.Containers = {};

        var container = document.getElementById(container_id);
        var content = container.querySelector('.content');

        var c_style = getComputedStyle(container);


        var slot_size = parseFloat(c_style.getPropertyValue('--slot-size').replace('px', ''));
        var slot_margin = parseFloat(c_style.getPropertyValue('--slot-margin').replace('px', ''));
        var rows = c_style.getPropertyValue('--rows');
        var cols = c_style.getPropertyValue('--cols');

        var width = (slot_size + slot_margin) * cols;
        var height = (slot_size + slot_margin) * rows;

        container.style.setProperty('--window-width', width + 'px');
        container.style.setProperty('--window-height', height + 'px');

        if(required_slots)
        {
            var current_slots = cols * rows;
            var required_rows = Math.ceil(required_slots / cols);

            rows = required_rows;
        }

        if(!type) type = container_id.toUpperCase();

        InventoryGUI.createSlots(container_id, content, rows, cols, type);
    }

    static InitEquips()
    {
        var container_id = 'inventory_equips';
        var container = document.getElementById(container_id);

        var equips_container = document.getElementById('inventory_equips_content');
            equips_container.innerHTML = '';

        var equips_order = Player.GetEquipSlots(true);

        for(var i = 0; i < equips_order.length; i++)
        {
            var slot = InventoryGUI.getEmptyInventorySlot();
                slot.dataset.index = equips_order[i];
                slot.dataset.id = container_id;
                slot.dataset.highlightfilter = ';';
                equips_container.appendChild(slot);

            InventoryGUI.addEvents(slot, 'EQUIPS');
        }

        var slot_margin = getCssVariable(container, '--slot-margin', true);
        var slot_size = getCssVariable(container, '--slot-size', true);

        var height = (slot_size + slot_margin) * i;

        container.style.setProperty('--window-height', height + 'px');
    }

    static createSlots(container_id, slots_container, rows, cols, type = 'INVENTORY')
    {
        slots_container.innerHTML = '';

        for(var i = 0; i < rows * cols; i++)
        {
            var slot = InventoryGUI.getEmptyInventorySlot();
                slot.dataset.index = i;
                slot.dataset.id = container_id;
                slots_container.appendChild(slot);

            InventoryGUI.addEvents(slot, type);
        }
    }

    static getEmptyInventorySlot()
    {
        var slot = document.createElement('div');
            slot.className = 'inventory_slot text-stroke';

        var img_container = document.createElement('div');
            img_container.className = 'image_container';
            slot.appendChild(img_container);

        var img = document.createElement('img');
            img_container.appendChild(img);

        return slot;
    }

    static addEvents(slot, type)
    {
        switch(type)
        {
            case 'INVENTORY':
                slot.addEventListener('click', InventoryGUI.InventoryClick);
                slot.addEventListener('mouseup', InventoryGUI.InventoryRightClick);
                slot.addEventListener('mousemove', InventoryGUI.InventoryHover);
                slot.addEventListener('mouseout', InventoryGUI.InventoryOut);
                break;

            case 'EQUIPS':
                slot.addEventListener('click', InventoryGUI.EquipsClick);
                slot.addEventListener('mouseup', InventoryGUI.EquipsRightClick);
                slot.addEventListener('mousemove', InventoryGUI.InventoryHover);
                slot.addEventListener('mouseout', InventoryGUI.InventoryOut);
                break;

            case 'SHOP':
                slot.addEventListener('click', InventoryGUI.ShopClick);
                slot.addEventListener('mouseup', InventoryGUI.ShopRightClick);
                slot.addEventListener('mousemove', InventoryGUI.InventoryHover);
                slot.addEventListener('mouseout', InventoryGUI.InventoryOut);
                break;
        }
    }

    static getContainerData(element)
    {
        var slot = element.dataset.index;
        var id = element.dataset.id;

        if(!InventoryGUI.Containers[id]) return null;
        var owner = InventoryGUI.Containers[id][0];
        var items_path = InventoryGUI.Containers[id][1];
        var items = get(owner, items_path) ?? [];

        return {slot, id, owner, items_path, items};
    }


    static InventoryHover()
    {
        var data = InventoryGUI.getContainerData(this);
        var item = data.items[data.slot];
        var in_hand = World.Player.hand;

        var highlight_enchant = 'ENCHANT';
        var highlight_bless = 'BLESS';
        var filters = this.dataset.highlightfilter ?? null;
        var showEnchant = false;
        var showBlessing = false;


        if(item) item.showNewItemInfo = false;
        delete this.dataset.isnew;

        if(item && in_hand?.type == TYPE.ENCHANT && ItemHelper.CanBeEnchanted(item, in_hand) !== null) 
            // if(filter(highlight_enchant, filters) && ItemHelper.CanBeEnchanted(item, in_hand) !== false) 
            {
                // this.dataset.highlight = highlight_enchant;
                showEnchant = true;
            }

        if(in_hand?.type == TYPE.BLESSING && ItemHelper.CanBeBlessed(item, in_hand))
        {
            // if(filter(highlight_bless, filters)) this.dataset.highlight = highlight_bless;
            showEnchant = false;
            showBlessing = true;
        } 


        if(InventoryGUI.isShopOpen || InventoryGUI.isCraftingOpen) 
        {
            ItemInfo.Show(item); 
            return;
        }

        ItemInfo.Show(item, showEnchant);

        if(this.dataset.id == 'inventory' && item?.equipAble && !showEnchant && !showBlessing)
        {
            var equipped = World.Player.equips[item.slot];
            var equip_slot = document.querySelector('#inventory_equips_content [data-index="'+item.slot+'"]');
            if(!equipped || !equip_slot) return;

            var rect = equip_slot.getBoundingClientRect();
            ItemInfo.ShowCompared(equipped, rect.x, rect.y);
        }

        if(showBlessing)
        {
            var infos = document.querySelectorAll('.item_info_container');
            if(infos.length == 1)
            {
                var next_tier_item = ItemHelper.CopyItem(item);
                    next_tier_item.Bless(in_hand, true);
                
                ItemInfo.ShowCompared(next_tier_item);

                infos = document.querySelectorAll('.item_info_container');
            }

            var main = infos[0];
            var compared = infos[1];
            ItemInfo.ReposeIfNeeded(main, compared);

            set(main, 'dataset.iscomparing', 'true', true);
        }
    }

    static InventoryOut()
    {
        InventoryGUI.clearHighlights(this);
    }

    static clearHighlights(slot)
    {
        delete slot.dataset.highlight;

        ItemInfo.Hide();
    }

    static InventoryClick(e)
    {
        if(e.button != 0) return;
        
        var data = InventoryGUI.getContainerData(this);
        var item_path = data.items_path + '.' + data.slot;
        var item = data.items[data.slot];
        var temp = data.items[data.slot];
        var in_hand = World.Player.hand;

        if(!in_hand && !item) return;   //do nothing if clicked slot and hand are empty 

        if(in_hand && item)
        {
            if(in_hand.constructor.name == item.constructor.name)
            {
                //przedmioty sa tego samego typu
                if(in_hand.stackAble)
                {
                    //stackowanie przedmiotow
                    var new_count = in_hand.count + item.count;
                    if(new_count <= item.maxStackSize)
                    {
                        item.count = new_count;
                        World.Player.hand = null;
                    }
                    else
                    {
                        //przekroczono max stack
                        item.count = item.maxStackSize;
                        World.Player.hand.count = new_count - item.maxStackSize;
                    }

                    InventoryGUI.UpdateData(data);
                    return;
                }
            }
            else if(in_hand.type == TYPE.ENCHANT && item.enchantAble && !InventoryGUI.isShopOpen && !InventoryGUI.isCraftingOpen)
            {
                var result = item.Enchant(in_hand);
                if(result)
                {
                    World.Player.hand = null;
                    //playsound
                    // DamageIndicator.AddObject(Mouse.x + Camera.xView, Mouse.y - 25 + Camera.yView, "Enchant Successful!", "UPGRADE_SUCCESS");
                    InventoryGUI.UpdateData(data);
                    InventoryGUI.clearHighlights(this);
                    ItemInfo.Show(item);
                    return;
                }
            }
            else if(in_hand.type == TYPE.BLESSING && ItemHelper.CanBeBlessed(item, in_hand) && !InventoryGUI.isShopOpen && !InventoryGUI.isCraftingOpen)
            {
                var result = item.Bless(in_hand);
                if(result)
                {
                    if(in_hand.count == 1) World.Player.hand = null;
                    else 
                    {
                        World.Player.hand.count--;
                        World.Player.addItemToInventory(World.Player.hand);
                        World.Player.hand = null;
                    }


                    //playsound
                    // DamageIndicator.AddObject(Mouse.x + Camera.xView, Mouse.y - 25 + Camera.yView, "Enchant Successful!", "UPGRADE_SUCCESS");
                    InventoryGUI.UpdateData(data);
                    InventoryGUI.clearHighlights(this);
                    ItemInfo.Show(item);
                    return;
                }
            }
        }

        set(data.owner, item_path, in_hand);
        World.Player.hand = temp;

        InventoryGUI.UpdateData(data);
        InventoryGUI.clearHighlights(this);
        ItemInfo.Show(in_hand);
    }

    static ShopClick(e)
    {
        if(e.button != 0) return;
        
        var data = InventoryGUI.getContainerData(this);
        var item_path = data.items_path + '.' + data.slot;
        var item = data.items[data.slot];
        var temp = data.items[data.slot];
        var in_hand = World.Player.hand;

        if(!in_hand && !item) return;   //do nothing if clicked slot and hand are empty 

        
        if(in_hand)
        {
           //player is gonna sell item in hand
           data.owner.Buy(in_hand, World.Player);
        }
        else if(item)
        {
            //player got empty hand so its gonna to buy item in slot
            data.owner.Sell(data.slot, World.Player, true);
        }

        InventoryGUI.UpdateData(data);
    }

    static ShopRightClick(e)
    {
        if(e.button != 2) return;

		var data = InventoryGUI.getContainerData(this);
        var item_path = data.items_path + '.' + data.slot;
        var item = data.items[data.slot];
        var in_hand = World.Player.hand;

        if(!in_hand && !item) return;   //do nothing if clicked slot and hand are empty 

        if(!in_hand) data.owner.Sell(data.slot, World.Player, false, 1); //buy item from slot
        else data.owner.Buy(in_hand, World.Player, true, 1); //player is gonna sell 1 item from hand

        InventoryGUI.UpdateData(data);
    }

    static EquipsClick(e)
    {
        if(e.button != 0) return;
        var equipped = false;
        
        var data = InventoryGUI.getContainerData(this);
        var item_path = data.items_path + '.' + data.slot;
        var item = data.items[data.slot];
        var temp = data.items[data.slot];
        var in_hand = World.Player.hand;

        if(!in_hand && !item) return;   //do nothing if clicked slot and hand are empty 

        if(isFunction(item?.onTakeOut)) item.onTakeOut();
        
        if(in_hand)
        {
            if(in_hand.equipAble) equipped = InventoryGUI.Equip(in_hand, data.slot);
            InventoryGUI.UpdateData(data);

            if(equipped)
            {
                InventoryGUI.clearHighlights(this);
                ItemInfo.Show(in_hand);
            }
            return;
        }
        

      

        set(data.owner, item_path, in_hand);
        World.Player.hand = temp;
        World.Player.UpdateStats();

        InventoryGUI.UpdateData(data);
    }

    static EquipsRightClick(e)
    {
        if(e.button != 2) return;
        
        var data = InventoryGUI.getContainerData(this);
        var item_path = data.items_path + '.' + data.slot;
        var item = data.items[data.slot];
        var in_hand = World.Player.hand;

        if(!item) return;   //do nothing if clicked slot and is empty 
        if(in_hand) return;
        
        World.Player.addItemToInventory(item);
        set(data.owner, item_path, null);

        if(isFunction(item.onTakeOut)) item.onTakeOut();

        World.Player.UpdateStats();
        InventoryGUI.UpdateData(data);
        InventoryGUI.Update('inventory', World.Player, 'inventory');
    }

    static UpdateData(data)
    {
        InventoryGUI.UpdateHand();
        InventoryGUI.Update(data.id, data.owner, data.items_path);
    }

    static InventoryRightClick(e)
    {
        if(e.button != 2) return;

		var data = InventoryGUI.getContainerData(this);
        var item_path = data.items_path + '.' + data.slot;
        
        var item = data.items[data.slot];
        var in_hand = World.Player.hand;

		// if(InGame.GUI.Inventory.isShopOpen)
		// {
		// 	var shop_owner = InGame.GUI.Inventory.shopOwner;
		// 	var item = this.GetItem();
		// 	var id = parseInt(this.id.replace('slot', ''));

		// 	if(!shop_owner) return;
		// 	if(!item) return;
			
		// 	shop_owner.Buy(item, InGame.GUI.Inventory.Owner);
		// 	this.Owner.inventory[id] = null;
		// 	return;	//disable quick equip while trading
		// }

        if(InventoryGUI.isShopOpen)
        {
            //sell
            if(!item) return;
            if(!item.canBeSold) return;

            World.Player.interactionWith.Buy(item, World.Player, false, 1); //player is gonna sell 1 item from slot
            item.count -= 1;
            if(item.count == 0) set(data.owner, item_path, null);

            InventoryGUI.Update('shop', World.Player.interactionWith, 'inventory');
            InventoryGUI.UpdateData(data);
            ItemInfo.Hide();
            if(item.count) ItemInfo.Show(item);
            return;
        }

        if(InventoryGUI.isCraftingOpen) 
        {
            if(item)
            {
                if(!item.isMaterial()) return;
                for(var i in Crafting.Items)
                {
                    if(Crafting.Items[i] == null) 
                    {
                        Crafting.Items[i] = item;
                        set(data.owner, item_path, null);
                        Crafting.UpdateCrafting();
                        InventoryGUI.UpdateData(data);
                        return;
                    }
                }
            }

            return;
        }



		if(item)
		{
			if(isFunction(item.onUse) && !in_hand) item.onUse(data.owner);      //you can use item only with empty hand
			else
			{
				if(item.equipAble) InventoryGUI.Equip(item);
				else if(item.stackAble)
				{
                    //take half of stack
					if(!in_hand && item.count > 1)
					{
						World.Player.hand = ItemHelper.CopyItem(item);
						var count = Math.floor(item.count / 2);

						World.Player.hand.count -= count;
						item.count = count;
					}
					else
					{
						if(in_hand)
						{
							if(in_hand.constructor.name === item.constructor.name)
							{
								if(in_hand.count > 1) in_hand.count -= 1;
								else World.Player.hand = null;

                                item.count += 1;
							}
						}
					}
				}
			}
		}
		else if(in_hand)
		{
			if(in_hand.stackAble && in_hand.count > 1)
			{
				item = ItemHelper.CopyItem(in_hand);
                item.count = 1;
                
				in_hand.count -= 1;
                set(data.owner, item_path, item);
			}
			
		}

        InventoryGUI.UpdateData(data);
    }

    static Equip(item, dedicated_slot)
    {
        var slot = item.slot;
        var owner = World.Player;

        if(!item.canBeEquipped(owner, 'equips', dedicated_slot)) return false;

		if(slot == SLOT.SPECIAL)
		{
            var special_slots = World.Player.getSpecialSlots();
            for(var i = 0; i < special_slots; i++)
            {
                if(!owner.equips[slot + i])
                {
                    slot += i;
                    break;
                }
            }
			
            //there is no empty slot
            if(slot == SLOT.SPECIAL) return false;

			if(dedicated_slot) slot = dedicated_slot;
		}

        if(dedicated_slot && slot != dedicated_slot) return false;
		
		if(owner.hand === item)		//przedmiot jest zakladany z reki
		{		
			if(owner.hand.requiredLevel <= owner.stats.Level)
			{
				var temp = owner.equips[slot];
				owner.equips[slot] = owner.hand;
				owner.hand = temp;
			}
		}
		else
		{
			if(item.requiredLevel <= owner.stats.Level)
			{
				var id = owner.inventory.indexOf(item);

				if(id >= 0)
				{
					var temp = owner.equips[slot];
					owner.equips[slot] = item;
					owner.inventory[id] = temp;
				}
			}
		}

        if(isFunction(item.onEquip)) item.onEquip();
		
        ItemInfo.Hide();
		owner.UpdateStats();
        InventoryGUI.Update('inventory_equips', World.Player, 'equips');

        return true;
    }

    static UpdateHand(onlyPos = false)
    {
        var item_in_hand = document.getElementById('item_in_hand');

        if(World.Player.hand)
        {
            set(item_in_hand, 'style.display', '', true);
            set(item_in_hand, 'style.top', Mouse.absY + 'px', true);
            set(item_in_hand, 'style.left', Mouse.absX + 'px', true);

            if(!onlyPos) 
            {
                InventoryGUI.UpdateSlot(item_in_hand, World.Player.hand);
                if(InventoryGUI.isShopOpen) return;
                if(InventoryGUI.isCraftingOpen) return;

                if(World.Player.hand.type == TYPE.BLESSING) InventoryGUI.setGlobalHighlight(TYPE.BLESSING);
                if(World.Player.hand.type == TYPE.ENCHANT) InventoryGUI.setGlobalHighlight(TYPE.ENCHANT);
            }
            return;
        }
        else
        {
            InventoryGUI.clearGlobalHighlight();
            if(InventoryGUI.isCraftingOpen) InventoryGUI.setGlobalHighlight('IS_MATERIAL');
        }

        set(item_in_hand, 'style.display', 'none', true);
    }

    static setGlobalHighlight(type, args)
    {
        var inv_slots = document.querySelectorAll('.inventory_slot[data-id="inventory"]');
        if(type == TYPE.BLESSING)
        {
            inv_slots.forEach(e => 
                {
                    var data = InventoryGUI.getContainerData(e);
                    var item = data.items[data.slot];
                    if(item) e.dataset.locked = !ItemHelper.CanBeBlessed(item, World.Player.hand);
                });
        }

        if(type == TYPE.ENCHANT)
        {
            inv_slots.forEach(e => 
                {
                    var data = InventoryGUI.getContainerData(e);
                    var item = data.items[data.slot];
                    if(item) e.dataset.locked = !(ItemHelper.CanBeEnchanted(item, World.Player.hand) !== null);
                });
        }

        if(type == 'IS_MATERIAL')
        {
            inv_slots.forEach(e => 
                {
                    var data = InventoryGUI.getContainerData(e);
                    var item = data.items[data.slot];
                    if(item) 
                    {
                        e.dataset.locked = !(item.isMaterial());
                    }
                });
        }
    }

    static clearGlobalHighlight()
    {
        var inv_slots = document.querySelectorAll('.inventory_slot[data-id="inventory"]');
        inv_slots.forEach(e => 
            {
                delete e.dataset.locked;
            });
    }


    static Update(id = 'inventory', owner = World.Player, items_path = 'inventory')
    {
        if(!owner) return;

        InventoryGUI.Containers[id] = [owner, items_path];

        var items = get(owner, items_path);
        var container = document.getElementById(id);
        var content = container.querySelector('.content');
        var slots = content.querySelectorAll('.inventory_slot');

        slots.forEach(slot => 
        {
            InventoryGUI.UpdateSlot(slot, items[slot.dataset.index]);
        });

    }

    static UpdateSlot(slot, item)
    {
        var img = slot.querySelector('.image_container img');
        var texture = null;

        delete slot.dataset.grade;
        delete slot.dataset.count;
        delete slot.dataset.item;
        delete slot.dataset.shine;
        delete slot.dataset.temporary;
        delete slot.dataset.enough;
        delete slot.dataset.isnew;
        delete slot.dataset.animated;

        if(item)
        {
            texture = TextureManager.Get(item.Texture).src;
            var shine = item.getShineStrength();

            if(item.Grade) slot.dataset.grade = item.Grade;
            if(item.count) slot.dataset.count = item.count;
            if(shine) slot.dataset.shine = shine;

            if(item.isTemporary) slot.dataset.temporary = true;
            if(item.requiredCount) 
            {
                slot.dataset.count = item.count +'/' + item.requiredCount;
                if(item.count < item.requiredCount) slot.dataset.enough = 'false';
            }

            if(item.TextureAnimation)
            {
                var img_container = slot.querySelector('.image_container');
                slot.dataset.animated = 'true';

                img_container.style.setProperty('--frames-x', item.TextureAnimation.framesX);
                img_container.style.setProperty('--frames-y', item.TextureAnimation.framesY);
                img_container.style.setProperty('--speed', item.TextureAnimation.speed+'s');
                if(item.TextureAnimation.scale) img_container.style.setProperty('--item-scale', item.TextureAnimation.scale);
                img_container.style.setProperty('background-image', 'url("'+texture+'")');
                texture = null;
            }

            if(item.showNewItemInfo) slot.dataset.isnew = 'true';

            set(slot, 'dataset.item', item.constructor.name, true);
        }
        
        set(img, 'style.display', (texture) ? '' : 'none', true);
        if(texture) set(img, 'src', texture, true);
    }

    static updateItemsShine()
    {
        if(document.getElementById('inventory').dataset.open != 'true') return;
        //only visible slots
        var slots = document.querySelectorAll('.inventory_slot[data-shine]');
        slots.forEach(e => 
            {
                if(e.id=='item_in_hand' && e.style.display=='none') return;

                var strength  = parseFloat(e.dataset.shine);
                if(MathHelper.GetChance(.25 * (strength**2))) InventoryGUI.drawShine(e);
            });
    }

    static drawShine(slot)
    {
        var img_container = slot.querySelector('.image_container');
        if(!img_container) return;

        var strength  = parseFloat(slot.dataset.shine);
        var size = getCssVariable(document.body, '--slot-size', true);
        var m = 5;
        var x = MathHelper.randomInRange(m, size/2) - 15;
        var y = MathHelper.randomInRange(m, size/2) - 15;

        var shine = document.createElement('div');
            shine.className = 'shine';
            shine.style.setProperty('--x', x+'px');
            shine.style.setProperty('--y', y+'px');
            shine.style.setProperty('--strength', strength);
            shine.onanimationend = function(){this.remove()}

        img_container.appendChild(shine);
    }
}