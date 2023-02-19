class Helper
{
    static getDarkerColor(color, percentage = 20, toString = true)
    {
        if(color[0] == '#') color = Helper.hexToRgb(color);
        else if(color.includes('rgb'))
        {
            color = Helper.getRGBValues(color);
        }

        var darkerR = color.r - (color.r * percentage / 100);
        var darkerG = color.g - (color.g * percentage / 100);
        var darkerB = color.b - (color.b * percentage / 100);

        darkerR = Helper.toAllowedValue(darkerR, 'RGB');
        darkerG = Helper.toAllowedValue(darkerG, 'RGB');
        darkerB = Helper.toAllowedValue(darkerB, 'RGB');


        if(toString)
        {
            return 'rgb(' + darkerR + ', ' + darkerG + ', ' + darkerB + ')';
        }

        return {r: darkerR, g: darkerG, b:darkerB}
    }

    static GetLinesNumber(text)
    {
        var arr = text.split('\n');
        return arr.length;
    }

    static replaceAll(str, find, replace)
    {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    static ApplyArguments(text, args = {})
    {
        var value;
        for(var name in args)
        {
            value = args[name];
            if(isFunction(value)) value = value();
            text = Helper.replaceAll(text, '{' + name + '}', value);
        }

        return text;
    }

    static toAllowedValue(value, type)
    {
        switch(type)
        {
            case 'RGB':
                if(value > 255) return 255;
                if(value < 0) return 0;
        }

        return Math.round(value);
    }

    static hexToRgb(color)
    {
        color = color.replace('#', '');

        var r = parseInt(color[0] + color[1], 16);
        var g = parseInt(color[2] + color[3], 16);
        var b = parseInt(color[4] + color[5], 16);

        return {r: r, g: g, b:b}
    }

    static getRGBValues(color)
    {
        if(!color.includes('rgb')) return {r: 0, g: 0, b: 0}

        color = color.replace('rgb', '');
        color = color.replace('a', '');
        color = color.replace('(', '');
        color = color.replace(')', '');

        var colors = color.split(',');

        return {r: colors[0].trim(), g: colors[1].trim(), b:colors[2].trim()}
    }

    static FuseObjectsValues()
    {
        var keys = [];
        for(var arg in arguments)
            keys = keys.concat(Object.keys(arguments[arg]));

        var obj = {};

        for(var i = 0; i < keys.length; i++)
        {
            var key = keys[i];
            obj[key] = 0;

            for(var arg in arguments)
                if(arguments[arg][key]) obj[key] += arguments[arg][key];
        }

        return obj;
    }

    static getEaster(year) {
        var f = Math.floor,
            // Golden Number - 1
            G = year % 19,
            C = f(year / 100),
            // related to Epact
            H = (C - f(C / 4) - f((8 * C + 13)/25) + 19 * G + 15) % 30,
            // number of days from 21 March to the Paschal full moon
            I = H - f(H/28) * (1 - f(29/(H + 1)) * f((21-G)/11)),
            // weekday for the Paschal full moon
            J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
            // number of days from 21 March to the Sunday on or before the Paschal full moon
            L = I - J,
            month = 3 + f((L + 40)/44),
            day = L + 28 - 31 * f(month / 4);
    
        return {m: month, d: day};
    }

    static GetDeathQuote(killedBy = null)
    {
        var quote = "Omae wa mou shindeiru";
        if(killedBy?.deathQuote) return Lang.Get(killedBy.deathQuote);
        return Lang.Get(quote);
    }

    static isPercentageValue(value)
    {
        if(value[value.length - 1] == '%') return {is: true, value: value.replace('%', '') * 1};
        return {is: false, value: value};
    }
}

/**
 * Check for current difficulty level
 * @param {*} level 
 * @returns 
 * level = 0;   //Easy
 * level = 1;   //Medium
 * level = 2;   //Hard
 */
function Difficulty(level = null)
{
    if(level == null) return World.GetDifficultyLevel();
    return World.GetDifficultyLevel() == level;
}

function GetDifficultyInfo(difficulty = Difficulty())
{
    var info = {};
    
    switch(difficulty)
    {
        case 0:
            info.Name = 'Easy';
            info.DeathPenaltyXp = 0;
            info.DeathPenaltyOxygen = 0;
            info.DamageMultiplier = .5;
            break;

        case 1:
            info.Name = 'Medium';
            info.DeathPenaltyXp = 20;
            info.DeathPenaltyOxygen = 0;
            info.DamageMultiplier = 1;
            break;

        case 2:
            info.Name = 'Hard';
            info.DeathPenaltyXp = 50;
            info.DeathPenaltyOxygen = 20;
            info.DamageMultiplier = 1.5;
            break;
    }

    info.DamageMultiplierP = info.DamageMultiplier * 100;       //percentage


    return info;
}



function Save()
{
    Settings.Save();
    World.Player.Save();
}




function isObject(variable)
{
	if(variable.constructor === Object)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function isString(variable)
{
	if(variable.constructor === String)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function isArray(variable)
{
	if(variable.constructor === Array)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function isImage(variable)
{
	return variable instanceof HTMLImageElement;
}

function isJSON(variable)
{
	try
	{
		JSON.parse(variable);
	}
	catch(ex)
	{
		return false;
	}
	return true;
}

function isFunction(variable)
{
	return typeof variable === "function";
}

function isInt(variable)
{
	return (Math.floor(variable) == variable);
}


PREVENT_STATE = false;
function preventDefault(new_state)
{
	if(new_state != null)
	{
		PREVENT_STATE = new_state;
	}
	
	return PREVENT_STATE;
}

function getAllMethods(object)
{
    return Object.getOwnPropertyNames(object).filter(function(property) {
        return typeof object[property] == 'function';
    });
}

function isOnScreen(entity)
{
	if(!entity) return false;
	var x = entity.x;
	var y = entity.y;
	var width =  entity.width;
	var height = entity.height;
	var scale = entity.Scale;

    if(entity.Model)
    {
        var s = entity.Model.Scale;
        width = entity.Model.Width * s;
        height = entity.Model.Height * s;
    }

	var sizeX = width * scale;
	var sizeY = height * scale;
	var sX = x - sizeX - Camera.xView;
	var sY = y - sizeY - Camera.yView;
	var eX = sX + (2 * sizeX);
	var eY = sY + (2 * sizeY);

	if((eX >= 0 && sX <= canvas.width) && (eY >= 0 && sY <= canvas.height))
	{
		return true;
	}
	return false;
}

function canSoundPlay(sound, onEnd)
{
	sound.volume = 0;
	var promise = sound.play();

	if(promise !== undefined)
	{
		promise.then(
			() =>
			{
				if(isFunction(onEnd))
				{
					onEnd();
				}
			}
		)
		.catch(
			error =>
			{
				// window.dispatchEvent(new KeyboardEvent('keydown', {'key':'e'}));
				setTimeout(canSoundPlay.bind(canSoundPlay, sound, onEnd), 1000);
			}
		)
	}
}

function ChangeLayer(layer)
{
	Graphic.ChangeLayer(layer);
}

function RestoreLayer()
{
	Graphic.RestoreLayer();
}

function Sleep(miliseconds)
{
	var start = performance.now();

	while(true)
	{
		if(Math.round(performance.now() - start) >= miliseconds) break;

	}
}


function TicksToTime(ticks)
{
	var seconds = Math.floor(ticks / Main.FPS);
	var miliseconds = ticks - (seconds * Main.FPS);
	var minutes = Math.floor(seconds / 60);
		seconds -= minutes * 60;
	var hours = 0;

	if(minutes >= 60)
	{
		hours = Math.floor(minutes / 60);
		minutes -= hours * 60;
	}

	return {h: hours, m: minutes, s: seconds, ms: miliseconds};
}


function getLocationsFamilyOrder()
{
    var families = 
    [
        'Village',
        'Tutorial',
        'Lake',
        'River',
        'Swamp',
        'Cove',
        'Cavern'
    ];
    return families;
}

function getLocationOrder(onlyId = false, ignore = {})
{
    var families = getLocationsFamilyOrder();
	var list = World.LocationList;
    var familiesOrder = [];
	var order = [];
    var id;

	for(var name in list)
	{
        id = families.indexOf(list[name].LocationFamily);
        if(id == -1) continue;
        if(ignore.VILLAGE && list[name].isVillage) continue;

        if(!familiesOrder[id]) familiesOrder[id] = [];
        if(!onlyId) familiesOrder[id].push(list[name]);
        else familiesOrder[id].push(name);
	}

    id = 0;

    for(var i = 0; i < familiesOrder.length; i++)
    {
        if(!familiesOrder[i]) continue;
        for(var j = 0; j < familiesOrder[i].length; j++)
        {
            order[id] = familiesOrder[i][j];
            id++;
        }
    }

	return order;
}

function getLocationLevel(location)
{
    var id = location;
    if(!isString(location)) id = location.name ?? location.constructor.name;

    var order = getLocationOrder(true, {VILLAGE: true});
    var level = order.indexOf(id);

    return level + 1;
}


function isNPCMet(id)
{
    id = id.toUpperCase();
    var data = World.Player.NPCData;
    if(!data[id]) return false;
    if(!data[id].met) return false;

    return true;
}


function getObj(obj)
{
    if(isString(obj))
         if(obj[0] == '#') return document.querySelector(obj);
         else return null;
    return obj;
}

function getCssVariable(obj, variable, toInt = false)
{
    obj = getObj(obj);
    if(!obj) return undefined;

    var s_prop = obj.style.getPropertyValue(variable);
    if(s_prop) 
    {
        if(toInt) return parseFloat(s_prop.replace('px', '').replace('%', ''));
        return s_prop; 
    }

    var css_prop = getComputedStyle(obj).getPropertyValue(variable);
    if(toInt) return parseFloat(css_prop.replace('px', '').replace('%', ''));
    return css_prop; 
}

function get(obj, path, separator='.')
{
    obj = getObj(obj);
    if(!obj) return null;

    var properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
}

function set(obj, path, value, onlyIfDifferent = false) 
{
    obj = getObj(obj);
    if(!obj) return false;

    var pList = path.split('.');
    var len = pList.length;
    for(var i = 0; i < len-1; i++) 
    {
        var elem = pList[i];
        if( !obj[elem] ) obj[elem] = {}
        obj = obj[elem];
    }

    if(onlyIfDifferent)
    {
        if(obj[pList[len-1]] != value) 
        {
            obj[pList[len-1]] = value;
            return true;
        }
        return false;
    }

    obj[pList[len-1]] = value;
    return true;
}


function toBool(value)
{
    if(!value) return false;
    if(value?.toLowerCase() == 'true') return true;
    return false;
}

function filter(search, filters, strict = true)
{
    if(!filters && !strict) return true;
    if(!filters) return false;
    if(strict) return filters.includes(search);

    return false;
}