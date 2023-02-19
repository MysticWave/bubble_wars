class Crafting
{
    static Init()
    {
        this.Items = {
            0: null, 
            1: null,
            2: null,

            3: null,
            4: null,
            5: null,

            6: null,
            7: null
        };

        // var container = document.getElementById('crafting');
        // var height = getCssVariable(document.getElementById('inventory'), '--window-height');

        // container.style.setProperty('--window-height', height);
        // container.style.setProperty('--window-width', height);

        // var els = section.querySelectorAll('.section');
        // els.forEach(e=>
        //     {
        //         e.style.height = height;
        //     });
        this.CreateCraftingSlots();
    }

    static DeleteTemporaryItems()
    {
        for(var name in this.Items)
        {
            var item = this.Items[name];

            if(item?.isTemporary)this.Items[name] = null;
        }
    }

    static TakeOutAutoAdded()
    {
        for(var name in this.Items)
        {
            var item = this.Items[name];

            if(item?.isAutoAdded)
            {
                this.clearUpCraftingItemData(item);
                World.Player.addItemToInventory(item);
                this.Items[name] = null;
            }
        }
    }

    static GetPossibleResults()
    {
        var items = {...this.Items};
        items['crafting_result'] = null;

        for(var name in items)
        {
            if(items[name]?.isAutoAdded) items[name] = null;
        }

        return ItemHelper.getRecipeFrom(items, true);
    }

    static Open()
    {
        // this.UpdateCrafting();
        InventoryGUI.isCraftingOpen = true;
        InventoryGUI.setGlobalHighlight('IS_MATERIAL');
    }

    static Close()
    {
        InventoryGUI.isCraftingOpen = false;
        InventoryGUI.clearGlobalHighlight();

        for(var name in this.Items)
        {
            if(name == 'crafting_result') continue;

            var item = this.Items[name];
            if(item && !item.isTemporary)
            {
                this.clearUpCraftingItemData(item);
                World.Player.addItemToInventory(item);
            }
            this.Items[name] = null;
        }

        this.UpdateCrafting();
    }

    static CreateCraftingSlots()
    {
        var content = document.getElementById('section_crafting_slots');
        content.innerHTML = '';

        var slot_size = getCssVariable(document.body, '--slot-size', true) * Settings.Video.UI_Scale/100;
        var r = 2 * slot_size;
        var content_size = (2*r) + slot_size;
        var slots = 8;
        var angle_step = 360 / slots;
        var angle = -90;
        var pos, slot;
        var center = {x: content_size/2, y: content_size/2};

        // content.style.setProperty('--width', content_size +slot_size +'px');
        // content.style.setProperty('--height', content_size +slot_size +'px');

        for(var i = 0; i < slots; i++)
        {
            pos = MathHelper.lineToAngle(center, r, angle);
            slot = InventoryGUI.getEmptyInventorySlot();
                slot.dataset.slot = i;
                slot.dataset.type='crafting';
                slot.style.left = pos.x+'px';
                slot.style.top = pos.y+'px';
                slot.addEventListener('click', this.craftingSlotClick);
                slot.addEventListener('mouseup', this.craftingSlotRightClick);
                slot.addEventListener('mousemove', this.craftingSlotHover);
                slot.addEventListener('mouseout', InventoryGUI.InventoryOut);
            content.appendChild(slot);

            angle += angle_step;
        }

        slot = InventoryGUI.getEmptyInventorySlot();
            slot.dataset.slot = 'crafting_result';
            slot.dataset.type='crafting';
            slot.style.left = center.x+'px';
            slot.style.top = center.y+'px';
            slot.style.pointerEvents = 'none';
            slot.addEventListener('click', this.craftingResultClick);
            slot.addEventListener('mousemove', this.craftingSlotHover);
            slot.addEventListener('mouseout', InventoryGUI.InventoryOut);
        content.appendChild(slot);
    }

    static UpdateCrafting()
    {
        var slot;
        for(slot in this.Items)
        {
            var el = document.querySelector('.inventory_slot[data-type="crafting"][data-slot="'+slot+'"]');
            if(!el) continue;

            var item = this.Items[slot];
            InventoryGUI.UpdateSlot(el, item);
        }

        var result_slot = 'crafting_result';
        var result_slot_el = document.querySelector('.inventory_slot[data-type="crafting"][data-slot="'+result_slot+'"]');
        this.Items[result_slot] = null;
        result_slot_el.style.pointerEvents = 'none';

        var availableResult = ItemHelper.getRecipeFrom(this.Items);
        if(availableResult)
        {
            this.Items[result_slot] = availableResult.Result;
            result_slot_el.style.pointerEvents = 'all';
            set('#section_crafting_slots', 'dataset.animation', 'true', true);
        }
        else
        {
            set('#section_crafting_slots', 'dataset.animation', 'false', true);
        }

        this.DeleteTemporaryItems();

        var possible_results = this.GetPossibleResults();
        var results_container = document.getElementById('possible_crafting_results');
            results_container.innerHTML = '';

        for(var i = 0; i < possible_results.length; i++)
        {
            var item = possible_results[i].Result;
            slot = InventoryGUI.getEmptyInventorySlot();
                slot.dataset.slot = i;
                slot.dataset.type = 'crafting';
                slot.dataset.item = item.GetId();
                slot.style.setProperty('--order', i);
                slot.addEventListener('click', this.possibleResultsClick);
                slot.addEventListener('mousemove', this.possibleResultsHover);
                slot.addEventListener('mouseout', InventoryGUI.InventoryOut);
            results_container.appendChild(slot);

            
            slot.querySelector('img').src = TextureManager.Get(item.Texture).src;
        }


        InventoryGUI.UpdateSlot(result_slot_el, this.Items[result_slot]);
    }

    static possibleResultsClick()
    {
        if(this.dataset.disabled == 'true') return;
        Crafting.TakeOutAutoAdded();

        var possible_results = Crafting.GetPossibleResults();
        var slot = this.dataset.slot;
        var item = possible_results[slot]?.Result;
        var recipe = item.Recipe;
        var currentItems = Crafting.Items;
        var empty_slot = null;

        for(var i = 0; i < recipe.Ingredients.length; i++)
        {
            var ing_id = recipe.Ingredients[i][0];
            var ing_count = recipe.Ingredients[i][1];
            var gotIt = false;

            for(var id in currentItems)
            {
                var _item = currentItems[id];
                if(!_item) 
                {
                    if(empty_slot == null) empty_slot = id;
                    continue;
                }

                if(_item.GetId() == ing_id)
                {
                    gotIt = true;
                    //one of required ingredients is currently in slot
                    // if(_item.count >= ing_count) continue;
                    
                    _item.requiredCount = ing_count;
                }
            }

            if(!gotIt)
            {
                for(var j = 0; j < World.Player.inventory.length; j++)
                {
                    var _item = World.Player.inventory[j];
                    if(!_item) continue;

                    if(_item.GetId() == ing_id)
                    {
                        if(!Crafting.Items[empty_slot]) 
                        {
                            _item.isAutoAdded = true;
                            _item.requiredCount = ing_count;
                            Crafting.Items[empty_slot] = _item;
                            World.Player.inventory[j] = null;
                        }
                        else 
                        {
                            Crafting.Items[empty_slot].count += _item.count;
                            if(Crafting.Items[empty_slot].count > _item.maxStackSize)
                            {
                                World.Player.inventory[j].count = Crafting.Items[empty_slot].count - _item.maxStackSize;
                                Crafting.Items[empty_slot].count = _item.maxStackSize;
                            }
                            else
                            {
                                World.Player.inventory[j] = null;
                            }
                        }
                    }
                }

                if(!Crafting.Items[empty_slot]) //player dont have this item in inventory
                {
                    var _item = Item.Get(ing_id);
                        _item.count = 0;
                        _item.requiredCount = ing_count;
                        _item.isTemporary = true;

                    Crafting.Items[empty_slot] = _item;
                }
            }


            empty_slot = null;
        }

        Crafting.UpdateCrafting();
        InventoryGUI.Update();

        ItemInfo.Hide();

        var slot = document.querySelectorAll('#possible_crafting_results .inventory_slot')[this.dataset.slot];
            slot.style.opacity = .5;
            slot.dataset.disabled = 'true';
    }

    static craftingSlotHover()
    {
        var slot = this.dataset.slot;
        var item = Crafting.Items[slot];
        ItemInfo.Show(item);
    }

    static possibleResultsHover()
    {
        var possible_results = Crafting.GetPossibleResults();
        var slot = this.dataset.slot;
        var item = possible_results[slot]?.Result;
        if(!item) return;
        ItemInfo.Show(item);
    }

    static craftingSlotClick()
    {
        var slot = this.dataset.slot;
        var item = Crafting.Items[slot];
        var temp = item;
        var in_hand = World.Player.hand;

        if(!item && !in_hand) return;
        if(item?.isTemporary) return;
        if(in_hand && !in_hand.isMaterial()) return;

        Crafting.Items[slot] = in_hand;
        World.Player.hand = temp;

        Crafting.clearUpCraftingItemData(World.Player.hand);

        InventoryGUI.Update();
        InventoryGUI.UpdateHand();
        Crafting.UpdateCrafting();
    }

    static craftingSlotRightClick(e)
    {
        if(e.button != 2) return;

        var slot = this.dataset.slot;
        var item = Crafting.Items[slot];

        if(!item) return;
        if(item.isTemporary) return;

        World.Player.addItemToInventory(item);
        Crafting.Items[slot] = null;

        Crafting.clearUpCraftingItemData(item);

        InventoryGUI.Update();
        Crafting.UpdateCrafting();
    }

    static clearUpCraftingItemData(item)
    {
        if(!item) return;

        delete item.isTemporary;
        delete item.requiredCount;
        delete item.isAutoAdded;
    }

    static craftingResultClick()
    {
        var slot = this.dataset.slot;
        var item = Crafting.Items[slot];
        var in_hand = World.Player.hand;

        if(in_hand)
        {
            if(in_hand.GetId() == item.GetId() && item.stackAble)
            {
                if(World.Player.hand.count >= item.maxStackSize) return;
                World.Player.hand.count++;
            }
            else return;
        }
        else
        {
            World.Player.hand = ItemHelper.CopyItem(item);
        }
        

        var recipe = item.Recipe;
        for(var i = 0; i < recipe.Ingredients.length; i++)
        {
            var ing = recipe.Ingredients[i];
            for(var name in Crafting.Items)
            {
                var _item = Crafting.Items[name];
                if(!_item) continue;

                if(_item.GetId() == ing[0])
                {
                    _item.count -= ing[1];
                    if(_item.count == 0) 
                    {
                        Crafting.Items[name] = null;
                    }
                }
            }
        }

        InventoryGUI.Update();
        InventoryGUI.UpdateHand();
        Crafting.UpdateCrafting();
    }
}