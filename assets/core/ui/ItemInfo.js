class ItemInfo
{
    static ReposeIfNeeded(first, second)
    {
        var first_rect = first.getBoundingClientRect();
        var second_rect = second.getBoundingClientRect();

        var width = first_rect.width + second_rect.width;
        var height = first_rect.height > second_rect.height ? first_rect.height : second_rect.height;

        var new_pose = this.setPosition(first_rect.x, first_rect.y, first, width, height);

        set(second, 'style.top', new_pose.y + 'px', true);
        set(second, 'style.left', (new_pose.x + first_rect.width) + 'px', true);
    }

    static setPosition(x, y, container = this.container, container_width, container_height)
    {
        var margin = 40;
        var game_container_rect = document.getElementById('game_container').getBoundingClientRect();
        var rect = container.getBoundingClientRect();
        var endX = game_container_rect.x + game_container_rect.width;
        var endY = game_container_rect.y + game_container_rect.height;


        container_width = container_width ?? rect.width;
        container_height = container_height ?? rect.height;

        x = x ?? Mouse.absX;
        y = y ?? Mouse.absY;

        if(x + container_width + margin >= endX) x = endX - container_width - margin;  
        if(y + container_height + margin >= endY) y = endY - container_height - margin;
        

        set(container, 'style.top', y + 'px', true);
        set(container, 'style.left', x + 'px', true);

        return {x,y};
    }

    static GetPrimaryBonusesDisplayValues(bonus, value, item = this.item)
    {
        var text = bonus.name + ": +" + value;

        switch(bonus.id)
        {
            case STAT.ATTACK_DAMAGE:
                if(item.slot == SLOT.CANNON)
                {
                    var dmg = World.Player.GetDamageValues(value);
                    return bonus.name + ": " + dmg.min + " - " + dmg.max;
                }
                return bonus.name + ': +' + bonus.value + ((bonus.isPercent) ? '%' : '');

            case STAT.ATTACK_SPEED:
                value = (value == parseInt(value)) ? value + ".0" : value;
                return bonus.name + ": " + value;

            case STAT.COOLTIME:
                return bonus.name + ': ' + MathHelper.ticksToSeconds(value) + 's';

            case STAT.DURATION:
                return bonus.name + ': ' + MathHelper.ticksToSeconds(value) + 's';

            case STAT.DASH_DISTANCE:
                var duration = 0;
                for(var i in item.primary)
                {
                    if(item.primary[i].id == STAT.DASH_DURATION) duration = item.primary[i].value;
                }
                return bonus.name + ': ' + World.Player.GetDashDistance(value, duration);

            case STAT.DASH_DURATION:
                return bonus.name + ': ' + MathHelper.ticksToSeconds(value) + 's';

            case STAT.DASH_COOLTIME:
                return bonus.name + ': ' + value + 's';

            case STAT.ATTACK_RANGE:
                return bonus.name + ": " + value;
            
            case STAT.SUMMON_DAMAGE:
                return bonus.name + ": " + value;
        }

        return text;
    }

    static setInterline()
    {
        this.container.appendChild(this.GetLine());
    }

    static GetEnchantBonusLine(bonus, bonusValue = 0, itemGrade)
    {
        var line = this.GetLine();
            
        if(!bonus)
        {
            line.innerText = 'No effect';
            line.className += ' no-effect';
        }
        else
        {
            var name = bonus.name;
            var value = bonus.value;
            var isPercent = (bonus.isPercent) ? "%" : "";
            if(bonus.id == STAT.BLOCK_CHANCE || bonus.id == STAT.CR || bonus.id == STAT.CD) isPercent = '%';
    
            line.innerText = name + " +" + value + isPercent;
        }

        if(bonusValue) 
        {
            var new_value = Math.ceil(value * bonusValue / 100);
            if(bonus.id == STAT.BULLETS_COUNT) new_value = Math.round(value * bonusValue / 100);

            if(new_value)
            {
                var add_line = this.GetLine(" (+" + new_value + ')', 'span');
                add_line.dataset.grade = itemGrade;
                line.appendChild(add_line);
            }
        }

        return line;
    }

    static GetBonusLine(item, bonus)
    {
        var id = bonus.id;
        var bonus_name = bonus.name;
        var value = bonus.value;
        var line = this.GetLine();

        if (value != 0)
        {
            if (value < 0)
            {
                line.className += ' negative';
                line.innerText = bonus_name + ": " + value;
            }
            else
            {
                line.innerText = this.GetPrimaryBonusesDisplayValues(bonus, value);
            }

            //Critical stats are ment to be %, but calculate as non %
            if(id == STAT.CR || id == STAT.CD || id == STAT.BLOCK_CHANCE) line.innerText += "%";
        }

        return line;
    }

    static GetItemNameLine(item, isOnGround)
    {
        var grade = item?.Grade;
        var item_name_info = this.GetItemName(item);
        var display_grade = (grade && grade != GRADE.NORMAL && item.showGrade) ? Lang.Get(grade) : '';

        var name = document.createElement('div');
            name.className = 'line';
            name.dataset.grade = grade;
            if(item_name_info.color) name.style.color = item_name_info.color;       //custom colors
            name.innerText = display_grade + ' ' + item_name_info.name;

            if(isOnGround) name.innerText = '[' + display_grade + ' ' + item_name_info.name + ']';

        return name;
    }

    static GetLine(text, type = 'div', classNames = '')
    {
        var line = document.createElement(type);
            line.className = 'line ' + classNames;
            if(text) line.innerText = text;
        return line;
    }

    static Hide()
    {
        document.querySelectorAll('.item_info_container').forEach(e => e.remove());
        this.item = null;
        this.comparedItem = null;
    }

    static ShowCompared(item, x, y)
    {
        if(!item) return;
        if(this.comparedItem == item) return;

        var tmp = this.container;

        this.comparedItem = item;
        this.Render(item, false, x, y);

        if(tmp) this.container = tmp;
    }
    
    static Show(item, showHandEnchant = true, x, y, isOnGround = false)
    {
        if(!item) return;
        if(this.item == item) 
        {
            this.setPosition(x, y);
            return;
        }

        this.item = item;

        this.Render(item, showHandEnchant, x, y, isOnGround);
    }

    static Render(item, showHandEnchant = true, x, y, isOnGround = false)
    {
        var line, text;

        var bonusValue = 0;
        var HandEnchant = null;
        var HandBlessing = null;
        var HandEnchantIndex = null;
        var gradeInfo = null;

        if(World.Player.hand)
        {
            if(World.Player.hand.type == TYPE.ENCHANT)
            {
                HandEnchantIndex = ItemHelper.CanBeEnchanted(item, World.Player.hand);
                if(HandEnchantIndex != null) HandEnchant = World.Player.hand;
            }

            if(World.Player.hand.type == TYPE.BLESSING)
            {
                if(ItemHelper.CanBeBlessed(item, World.Player.hand)) HandBlessing = World.Player.hand;
            }
        }


        var container = document.createElement('div');
            container.className = 'item_info_container text-stroke';
            document.getElementById('item_infos').appendChild(container);

        this.container = container;
       
        // this.setInterline();
        var name_line = this.GetItemNameLine(item, isOnGround);
            container.appendChild(name_line);

        if(isOnGround)
        {
            this.setPosition(x, y);
            UI_Helper.setTranscendentalText();
            return;
        }


        var primary = item.GetPrimaryBonuses();

        if(primary != null)
        {
            for (var i = 0; i < primary.length; i++)
            {
                var item_bonus = primary[i];
                if(item_bonus)
                {
                    line = this.GetBonusLine(item, item_bonus);
                        container.appendChild(line);
                }
                else break;
            }
        }

        var showEmptySlots = false;

        if(item.enchantAble)
        {
            if(item.Grade != GRADE.NORMAL)
            {
                gradeInfo = ItemHelper.GetGradeInfo(item.Grade);
                if(gradeInfo != null) bonusValue = gradeInfo.bonus;
            }

            var slots = item.getEnchantSlots();
            if(slots > 0)
            {
                for(var i = 0; i < slots; i++)
                {
                    var enchant = item.Enchants[i];
                    var isHandEnchant = false;

                    if(HandEnchant && HandEnchantIndex == i && showHandEnchant)
                    {
                        enchant = HandEnchant;
                        isHandEnchant = true;
                    }

                    if(!enchant && !showEmptySlots) continue;


                    var enchant_line = document.createElement('div');
                        enchant_line.className = 'line enchant';

                    var slot = InventoryGUI.getEmptyInventorySlot();
                        slot.dataset.index = i;
                        enchant_line.appendChild(slot);

                    

                    var enchant_name = this.GetItemNameLine(enchant);
                        enchant_line.appendChild(enchant_name);

                    if(enchant) 
                    {
                        showEmptySlots = true;
                        enchant_name.innerText = '[' + enchant_name.innerText.trim() + ']';
                        slot.querySelector('.image_container img').src = TextureManager.Get(enchant.Texture).src;
                    }
                    else
                    {
                        enchant_name.innerText = "[Empty]";
                        enchant_name.className += ' empty';
                        container.appendChild(enchant_line);
                        continue;
                    }

                    if(item.isEquiped && isHandEnchant) continue;


                    if(enchant instanceof EnchantLock)
                    {
                        enchant_name.innerText = "[Broken slot]";
                        enchant_name.className += ' locked';
                    }
                    else
                    {
                        var enchant_bonus = this.GetEnchantBonusLine(enchant.bonus, bonusValue, item.Grade);
                            enchant_line.appendChild(enchant_bonus);

                        if(isHandEnchant) enchant_line.className += ' hand';
                    }

                    container.appendChild(enchant_line);
                }
            }
        }


        if(item.type == TYPE.ENCHANT)
        {
            if(item.bonus)
            {
                var isPercent = (item.bonus.isPercent) ? "%" : "";
                if(item.bonus.id == STAT.CR || item.bonus.id == STAT.CD || item.bonus.id == STAT.BLOCK_CHANCE) isPercent = "%";

                text = item.bonus.name + " +" + item.bonus.value + isPercent;

                line = this.GetLine(text);
                    container.appendChild(line);
            }
        }


        if(bonusValue && gradeInfo)
        {
            text =  "Enchants` power +" + bonusValue + "%";
            line = this.GetLine(text);
            line.dataset.grade = item.Grade;
                container.appendChild(line);

            if(gradeInfo.specialBonus)
            {
                for(var i = 0; i < gradeInfo.specialBonus.length; i++)
                {
                    var line = this.GetEnchantBonusLine(gradeInfo.specialBonus[i]);
                        line.dataset.grade = item.Grade;
                        container.appendChild(line);
                }
            }
        }

        if(item.ammoCost)
        {
            this.setInterline();
            text =  "Consumes " + item.ammoCost + " oxygen";
            line = this.GetLine(text);
            line.className += ' negative';
                container.appendChild(line);
        }


        if(item.requiredMP && item.showRequiredMP)
        {
            this.setInterline();
            text =  "Required Charge: " + item.requiredMP;
            line = this.GetLine(text);
                container.appendChild(line);
        }

        if(item.Charged)
        {
            var damage = item.Charged.damage ?? World.Player.GetDamageValues(item.Charged.AD, item.Charged.element);
            text =  "Damage: " + damage.min + " - " + damage.max;
            line = this.GetLine(text, 'div', item.Charged.element);
                container.appendChild(line);
        }

        var desc = item.getChargeDescription();
        if(desc)
        {
            for(var i = 0; i < desc.length; i++)
            {
                if(desc[i] != null)
                {
                    text = desc[i];
                    line = this.GetLine(text);
                    // line.className += ' lore';
                        container.appendChild(line);

                    var color_data = Style.GetCustomTextColor(desc[i]);
                    if(color_data.color) line.style.color = color_data.color;
                    line.innerHTML = Style.ColorizeTextParts(color_data.text);
                }
            }
        }



        desc = item.getDescription();
        if(desc)
        {
            this.setInterline();
            for(var i = 0; i < desc.length; i++)
            {
                if(desc[i] != null)
                {
                    text = desc[i];
                    line = this.GetLine(text);
                    // line.className += ' lore';
                        container.appendChild(line);

                    var color_data = Style.GetCustomTextColor(desc[i]);
                    if(color_data.color) line.style.color = color_data.color;
                    line.innerHTML = Style.ColorizeTextParts(color_data.text);
                }
            }
        }


        if(item.Lore)
        {
            this.setInterline();
            var lore = item.getLore();

            for(var i = 0; i < lore.length; i++)
            {
                if(lore[i] != null)
                {
                    text = lore[i];
                    line = this.GetLine(text);
                    line.className += ' lore';
                        container.appendChild(line);

                    var color_data = Style.GetCustomTextColor(lore[i]);
                    if(color_data.color)
                    {
                        line.style.color = color_data.color;
                        line.innerText = color_data.text;
                    }
                }
            }
        }


        if(item.isMaterial())
        {
            this.setInterline();
            text = "Material";
            line = this.GetLine(text);
                container.appendChild(line);
        }


        if(HandEnchantIndex != null && !item.isEquiped && item.enchantAble && showHandEnchant)
        {
            this.setInterline();
            text = "Drop to enchant";
            line = this.GetLine(text);
            line.className += ' start_ench';
                container.appendChild(line);
        }


        // if(HandBlessing && !item.isEquiped)
        // {
        //     this.setInterline();
        //     text = "Drop to bless";
        //     line = this.GetLine(text);
        //     line.className += ' start_bless';
        //         container.appendChild(line);
        // }


        // if (item.equipAble)
        // {
        //     interLine += interLineStep;
        //     this.style.color = "lightgray";
        //     text = "[Slot: " + Lang.Translate(item.slot) + "]";

        //     width = Style.GetTextSize(text, this.style).width;

        //     if (width > heighestWidth)
        //     {
        //         heighestWidth = width;
        //     }

        //     DisplayLines.push(new ItemInfoDisplayLine(width, this.height, interLine, text, this.style.color));

        //     interLine += interLineStep;
        // }


        if(item.type == TYPE.QUEST_ITEM)
        {
            this.setInterline();
            text = Lang.Get('ITEM.QUEST.DESCRIPTION');
            line = this.GetLine(text);
            line.dataset.grade = item.Grade;
                container.appendChild(line);
        }

        if(item.isUnique)
        {
            this.setInterline();
            text = '~'+Lang.Get('ITEM.UNIQUE')+'~';
            line = this.GetLine(text);
            line.dataset.grade = item.Grade;
                container.appendChild(line);
        }


        if((InventoryGUI.isShopOpen || Settings.General.AlwaysShowItemPrice) && item.showPriceInfo && item.type != TYPE.QUEST_ITEM && !item.isUnique)
        {
            var priceInfo = ItemHelper.GetItemPrice(item);
            var price = priceInfo.sell;

            if(item.isInShop || item.isFromMerchant) price = priceInfo.buy;

            if(price)
            {
                if(item.canBeSold)
                {
                    text = "Price: " + Style.DottedText(price);
                    if(item.count >= 10) text += ' (' + Style.DottedText(price / item.count) + ' / x1)';
                }

                this.setInterline();

                line = this.GetLine(text);
                if(price > 100000) line.className += ' price';

                if(!item.canBeSold) 
                {
                    line.className += ' negative';
                    line.innerText = 'Cannot be sold.';
                }
                
                container.appendChild(line);
            }
        }

        this.setPosition(x, y);
        UI_Helper.setTranscendentalText();
    }

    static GetItemName(item)
    {
        if(!item) return {name: '', color: null}

        var color_data = Style.GetCustomTextColor(item.getDisplayName());

        var name = color_data.text;
        var color = color_data.color;

        return {name, color};
    }
}

