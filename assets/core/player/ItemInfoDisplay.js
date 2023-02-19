class itemInfoDisplay
{
    constructor()
    {
        this.x = 0;
        this.y = 0;

        this.startX = null;
        this.startY = null;

        this.width = 0;
        this.height = 0;
        this.className = "ItemInfoDisplay";
        this.style = null;
        this.item = null;
        this.useMousePosition = true;
        
        this.interLineStep = 25;
        this.interLine = this.interLineStep;

        this.heighestWidth = 0;
        this.heighestHeight = 0;

        this.DisplayLines = [];
        this.DisplayImages = [];
    }
   
    
    Update()
    {
        if(this.useMousePosition)
        {
            this.startX = Mouse.x;
            this.startY = Mouse.y;
        }

        this.x = this.startX;
        this.y = this.startY;
        
        this.style = Style.GetStyleByName(this.className);
    }

    static getGradeInfo(item)
    {
        var info = {name: '', color: null};
        info.color = ItemHelper.GetGradeInfo(item.Grade).color ?? '';

        if (item.Grade == GRADE.LEGENDARY) info.name = 'Legendary ';
        if (item.Grade == GRADE.MYSTICAL) info.name = 'Mystical ';
        if (item.Grade == GRADE.RARE) info.name = 'Rare ';

        if(item.Grade == GRADE.TRANSCENDENCE)
        {
            var speed = 4;
            var mod = 360 / speed;

            var start = (Main.ageInTicks%mod) * speed;
            var end = ((Main.ageInTicks+60)%mod) * speed;

            var grd = new DisplayLineGradient(null, 0, null, 0);
                grd.addColorStop(0, 'hsl(' + start + ', 100%, 75%)');
                grd.addColorStop(1, 'hsl(' + end + ', 100%, 75%)');

            info.color = grd;
            info.name = 'Transcendence ';
        }

        return info;
    }

    setInterline(times = 1)
    {
        this.interLine += times * this.interLineStep;
    }

    setMaxWidth(text, adjust = 0)
    {
        var width = Style.GetTextSize(text, this.style).width + adjust;

        if (width > this.heighestWidth) this.heighestWidth = width;
        return width;
    }

    setNewLine(text, textColor)
    {
        var width = this.setMaxWidth(text);
        
        this.DisplayLines.push(new ItemInfoDisplayLine(width, this.height, this.interLine, text, textColor));
        this.setInterline();
    }

    setPosition()
    {
        this.heighestWidth += 50;     //right side margin

        if (this.startX + this.heighestWidth > canvas.width)
        {
            this.x += canvas.width - (this.startX + this.heighestWidth);
        }

        if (this.startY + this.interLine + 10 > canvas.height)
        {
            this.y += canvas.height - (this.startY + this.interLine) - 10;
        }
    }

    GetPrimaryBonusesDisplayValues(bonus, value)
    {
        var text = bonus.name + ": +" + value;

        switch(bonus.id)
        {
            case STAT.ATTACK_DAMAGE:
                var dmg = World.Player.GetDamageValues(value);
                return bonus.name + ": " + dmg.min + " - " + dmg.max;

            case STAT.ATTACK_SPEED:
                value = (value == parseInt(value)) ? value + ".0" : value;
                return bonus.name + ": " + value;

            case STAT.COOLTIME:
                return bonus.name + ': ' + MathHelper.ticksToSeconds(value) + 's';

            case STAT.DURATION:
                return bonus.name + ': ' + MathHelper.ticksToSeconds(value) + 's';

            case STAT.ATTACK_RANGE:
                return bonus.name + ": " + value;
        }

        return text;
    }

    
    
    Render()
    { 
        var item = this.item;
        if(!item) return;

        this.heighestWidth = 0;

        this.interLine = this.interLineStep;

        var grade = item.Grade;
        var text;
        var width;

        this.DisplayLines = [];
        this.DisplayImages = [];

        var showNextLevelInfo = false;
        var arrow = "  ->  ";
        var colorGreen = "#00ff00";
        var colorRed = '#FF5F5F';
        var bonusValue = 0;


        var HandEnchant = null;
        var HandEnchantIndex = null;

        if(World.Player.hand)
        {
            if(World.Player.hand.type == TYPE.UPGRADE)
            {
                showNextLevelInfo = true;
            }
            else if(World.Player.hand.type == TYPE.ENCHANT)
            {
                HandEnchantIndex = ItemHelper.CanBeEnchanted(item, World.Player.hand);
                if(HandEnchantIndex != null)
                {
                    HandEnchant = World.Player.hand;
                }
            }
        }




        if(item.upgradeAble)
        {
            var gradeInfo = itemInfoDisplay.getGradeInfo(item);

            grade = gradeInfo.name;

            var nextLevel = null;
            if(item.upgradeLevel < 9 && showNextLevelInfo) nextLevel =  "+" + (item.upgradeLevel + 1);

            text = grade + itemInfoDisplay.GetItemName(item);

            
            var color = Style.GetCustomTextColor(item.name);
            if(color) this.style.color = color;
            if(gradeInfo.color) this.style.color = gradeInfo.color;

            if(nextLevel)
            {
                this.setNewLine([text, arrow, nextLevel], [this.style.color, "white", colorGreen]);
            }
            else
            {
                this.setNewLine(text, this.style.color);
            }
        }
        else
        {
            var gradeInfo = itemInfoDisplay.getGradeInfo(item);

            grade = gradeInfo.name;
            text = grade + itemInfoDisplay.GetItemName(item);

            var color = Style.GetCustomTextColor(item.name);
            if(color) this.style.color = color;
            if(gradeInfo.color) this.style.color = gradeInfo.color;

            this.setNewLine(text, this.style.color);
        }

        if(item.primary != null)
        {
            for (var i = 0; i < item.primary.length; i++)
            {
                if (item.primary[i] != null)
                {
                    var id = item.primary[i].id;
                    var name = item.primary[i].name;
                    var level = item.upgradeLevel;
                    var value = ItemBonus.GetPrimaryBonusValue(id, item);

                    var nextLevelValue = (showNextLevelInfo) ? ItemBonus.GetPrimaryBonusValue(id, item, level + 1) : 0;

                    if (value != 0)
                    {
                        if (value < 0)
                        {
                            this.style.color = colorRed;
                            
                            text = name + ": " + value;
                        }
                        else
                        {
                            if(!item.primary[i].isPercent) text = this.GetPrimaryBonusesDisplayValues(item.primary[i], value);
                            this.style.color = "white"; 
                        }

                        if(item.primary[i].isPercent) text += "%";


                        if(nextLevelValue)
                        {
                            var nextLevelColor = colorGreen;
                            if(nextLevelValue != value)
                            {
                                if (nextLevelValue < 0)
                                {
                                    nextLevelColor = bonusNegative;
                                }
                                else
                                {
                                    if (nextLevelValue < value)
                                    {
                                        nextLevelColor = bonusNegative;
                                    }
                                    
                                    if(item.primary[i].id == STAT.ATTACK_DAMAGE && !item.primary[i].isPercent)
                                    {
                                        var dmg = World.Player.GetDamageValues(nextLevelValue);
                                        nextLevelValue = dmg.min + " - " + dmg.max;
                                    }
                                    else
                                    {
                                        nextLevelValue =  "+" + nextLevelValue;
                                    }   
                                }

                                if (item.primary[i].isPercent) nextLevelValue += "%";

                                this.setNewLine([text, arrow, nextLevelValue], [this.style.color, "white", nextLevelColor]);
                            }
                            else
                            {
                                this.setNewLine(text, this.style.color);
                            }
                        }
                        else
                        {
                            this.setNewLine(text, this.style.color);
                        }
                    }

                }
                else break;
            }
        }

        if(item.enchantAble)
        {
            if(item.Grade != GRADE.NORMAL)
            {
                var info = ItemHelper.GetGradeInfo(item.Grade);
                if(info != null) bonusValue = info.bonus;
            }

            if(item.enchantSlots > 0)
            {
                var isSomething = function(element)
                {
                    return(element == null);
                }


                if(!item.Enchants.every(isSomething) || HandEnchant)
                {
                    for(var i = 0; i < item.enchantSlots; i++)
                    {
                        var enchant = item.Enchants[i];
                        var size = (2 * this.interLineStep) - 4;
                        var isHandEnchant = false;

                        if(HandEnchant && HandEnchantIndex == i)
                        {
                            enchant = HandEnchant;
                            isHandEnchant = true;
                        }

                        if(item.isEquiped && isHandEnchant) continue;

                        if(enchant && !(enchant instanceof EnchantLock))
                        {
                            var gradeInfo = itemInfoDisplay.getGradeInfo(enchant);

                            grade = gradeInfo.name;


                            text = "[" + grade + itemInfoDisplay.GetItemName(enchant) + "]";
                            var bonus = "No effect";

                            var color = Style.GetCustomTextColor(enchant.name);
                            if(gradeInfo.color) color = gradeInfo.color;

                            var bonusColor = "lightgray";
                            var additionalValue = " ";

                            if(enchant.bonus)
                            {
                                var name = enchant.bonus.name;
                                var value = enchant.bonus.value;
                                var isPercent = (enchant.bonus.isPercent) ? "%" : "";
                                if(bonusValue)
                                {
                                    additionalValue = "  (+" + Math.ceil(value * bonusValue / 100) + ")";
                                } 

                                bonus = name + " +" + value + isPercent;
                                bonusColor = "white";
                            }


                            this.setMaxWidth(text, size + 5);
                            this.setMaxWidth(bonus, size + 5);
            
                            if(isHandEnchant)
                            {
                                bonusColor = colorGreen;
                                color = colorGreen;
                            }

                            this.DisplayLines.push(new ItemInfoDisplayLine(width, this.height, this.interLine, text, color, size + 5));
                            this.DisplayLines.push(new ItemInfoDisplayLine(width, this.height, this.interLine, [bonus, additionalValue], [bonusColor, itemInfoDisplay.getGradeInfo(item).color], size + 5, this.interLineStep));
                            this.DisplayImages.push(new ItemInfoDisplayImage("inventory_slot", 5, this.interLine + 3 + (size / 4), size, size, 0.8));

                            var imageLine = new ItemInfoDisplayImage(enchant, 5, this.interLine + 3 + (size / 4), size, size, 0.8);
                                imageLine.isFromHand = isHandEnchant;
                            this.DisplayImages.push(imageLine);
                        }
                        else
                        {
                            text = "[empty]";
                            var imageLine = null;

                            this.setMaxWidth(text, size + 5);

                            if(enchant)
                            {
                                text = "[Broken slot]";
                                imageLine = new ItemInfoDisplayImage(enchant, 5, this.interLine + 3 + (size / 4), size, size, 0.8);
                            }

                            this.DisplayLines.push(new ItemInfoDisplayLine(width, this.height, this.interLine, text, "lightgray", size + 5, this.interLineStep / 2));
                            this.DisplayImages.push(new ItemInfoDisplayImage("inventory_slot", 5, this.interLine + 3 + (size / 4), size, size, 0.8));
                            if(imageLine) this.DisplayImages.push(imageLine);
                        }

                        this.setInterline(2);
                    }
                }
            }

        }


        if(item.type == TYPE.ENCHANT)
        {
            if(item.bonus)
            {
                var name = item.bonus.name;
                var value = item.bonus.value;
                var isPercent = (item.bonus.isPercent) ? "%" : "";

                text = name + " +" + value + isPercent;

                this.setNewLine(text, 'white');
            }
        }


        if(bonusValue)
        {
            text =  "Enchants` power +" + bonusValue + "%";

            this.setNewLine(text, itemInfoDisplay.getGradeInfo(item).color);
        }

        if(item.ammoCost)
        {
            text =  "Consumes " + item.ammoCost + " oxygen";

            this.setInterline();
            this.setNewLine(text, colorRed);
        }


        if (item.Lore != null)
        {
            this.setInterline();

            for (var i = 0; i < item.Lore.length; i++)
            {
                if (item.Lore[i] != null)
                {
                    this.style.color = "violet";
                    text = item.Lore[i];

                    var color = Style.GetCustomTextColor(text);
                    if(color)
                    {
                        this.style.color = color;
                        text = text.replace("<"+color+">", "");
                    }

                    this.setNewLine(text, this.style.color);
                }
            }
        }

        if(HandEnchantIndex != null && !item.isEquiped)
        {
            text = "Click to enchant";

            this.setInterline();
            this.setNewLine(text, colorGreen);
        }

        if(showNextLevelInfo && item.upgradeAble && item.upgradeLevel < 9)
        {
            this.setInterline();

            var color = "yellow";
            var text2 = "Not enough oxygen";
            var color2 = "#ff0000";

            if(item.CanBeUpgraded(World.Player))
            {
                text2 = "Click to upgrade";
                color2 = colorGreen;
            }

            text = "Upgrade Cost: " + ItemHelper.GetUpgradeCost(item);
            this.setNewLine(text, color);

            text = "Upgrade Chance: " + ItemHelper.GetUpgradeChance(item, World.Player, World.Player.hand) + "%";
            this.setNewLine(text, 'white');
            this.setNewLine(text2, color2);
        }

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


        if(InGame.GUI.Inventory.isShopOpen || Settings.General.AlwaysShowItemPrice)
        {
            var priceInfo = ItemHelper.GetItemPrice(item);
            var price = priceInfo.sell;

            if(item.isInShop) price = (item.inShopPrice) ? item.inShopPrice : priceInfo.buy;
        
            this.style.color = (price > 1000000) ? "yellow" : 'white';

            text = "Price: " + Style.DottedText(price);
            this.setInterline();
            this.setNewLine(text, this.style.color);
        }

        this.setPosition();



        for(var i = 0; i < this.DisplayImages.length; i++)
        {
            this.DisplayImages[i].Render(this.x, this.y);
        }

        for (var i = 0; i < this.DisplayLines.length; i++)
        {
            this.DisplayLines[i].Render(this.x, this.y, this.style);
        }

        this.item = null;
    }

    static GetItemName(item, showNextLevelInfo)
    {
        var name;

        if (item.upgradeAble == true)
        {
            var level = item.upgradeLevel;

            name = item.name + " +" + level;
            var color = Style.GetCustomTextColor(item.name);
            if(color)
            {
                name = name.replace("<"+color+">", "");
            }
        }
        else
        {
            name = item.name;
            var color = Style.GetCustomTextColor(item.name);
            if(color)
            {
                name = name.replace("<"+color+">", "");
            }
        }

        return name;
    }
}

class ItemInfoDisplayImage
{
    constructor(src, tX = 0, tY = 0, width = 0, height = 0, alpha = 1)
    {
        this.src = src;
        this.tX = tX;
        this.tY = tY;

        this.width = width;
        this.height = height;
        this.alpha = alpha;
    }

    Render(x, y)
    {
        if(this.src instanceof Item)
        {
            var item = this.src;
            var texture = TextureManager.Get(item.Texture);

            var width = this.width || texture.width;
            var height = this.height || texture.height;

            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.drawImage(texture, x + this.tX, y + this.tY, width, height);
            ctx.restore();

            item.DrawShine(x + this.tX + 12, y + this.tY + 12, width / 45, this.isFromHand);
        }
        else
        {
            var texture = TextureManager.Get(this.src);

            var width = this.width || texture.width;
            var height = this.height || texture.height;

            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.drawImage(texture, x + this.tX, y + this.tY, width, height);
            ctx.restore();
        }
        
    }
}

class ItemInfoDisplayLine
{
    constructor(width, height, interline, text, color, tX = 0, tY = 0)
    {
        this.Width = width;
        this.Height = height;
        this.Interline = interline;

        this.Text = text;
        this.Color = color;

        this.tX = tX;
        this.tY = tY;
    }

    Render(x, y, style)
    {
        if(isArray(this.Text))
        {
            for(var i = 0; i < this.Text.length; i++)
            {
                var temp = {};
                temp.style = style;

                if(isArray(this.Color))
                {
                    if(this.Color[i])
                    {
                        temp.style.color = this.Color[i];
                    }
                    else
                    {
                        temp.style.color = this.Color[this.Color.length - 1];
                    }
                }
                else
                {
                    temp.style.color = this.Color;
                }
                
                temp.text = this.Text[i];
                temp.x = x + this.tX;
                temp.y = y + this.tY + this.Interline;

                Style.FillText(ctx, temp);

                x += Style.GetTextSize(this.Text[i], style).width;
            }
        }
        else
        {
            var temp = {};
            temp.style = style;
            temp.style.color = this.Color;
            temp.text = this.Text;
            temp.x = x + this.tX;
            temp.y = y + this.tY + this.Interline;

            var size = Style.GetTextSize(this.Text, style);

            if(temp.style.color instanceof DisplayLineGradient)
            {
                temp.style.color = temp.style.color.getContextGradient(ctx, temp.x, temp.y, temp.x + size.width, temp.y + size.height);
            }

            Style.FillText(ctx, temp);
        }
    }
}


class DisplayLineGradient
{
    constructor(x, y, endX, endY)
    {
        this.x = x;
        this.y = y;
        this.endX = endX;
        this.endY = endY;

        this.colorStops = {};
    }

    addColorStop(id, color)
    {
        this.colorStops[id] = color;
    }

    getContextGradient(ctx, x, y, endX, endY)
    {
        x = (this.x != null) ? this.x : x;
        y = (this.y != null) ? this.y : y;
        endX = (this.endX != null) ? this.endX : endX;
        endY = (this.endY != null) ? this.endY : endY;

        var grd = ctx.createLinearGradient(x, y, endX, endY);
            
            for(var id in this.colorStops)
            {
                grd.addColorStop(id, this.colorStops[id]);
            }

        return grd;
    }
}