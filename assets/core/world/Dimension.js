class Dimension
{
    constructor()
    {
        this.HexMap = [[]];
        this.Points = [];

        this.lightMap = [];
    }

    getLocations(dimension = 'OVERWORLD', showAll = Main.renderFullMap)
    {
        var locations = [];

        for(var locationName in World.LocationList)
		{
			var location = World.LocationList[locationName];
            if(location.Dimension != dimension) continue;

			if(World?.Player?.locationInfo[locationName] || showAll)
			{
				var prevLocationCleared = showAll;
                var alwaysVisible = (location.specialIcon) ? true : false;
                var isCleared = World?.Player?.locationInfo[locationName]?.isCleared;

				if(location.reqPrevLocation && !showAll)
				{
                    for(var i = 0; i < location.reqPrevLocation.length; i++)
                    {
                        var prev_id = location.reqPrevLocation[i];

                        if(World.Player.locationInfo[prev_id]?.isCleared)
                        {
                            prevLocationCleared = true;
                            break;
                        }
                    }
				}

                var canInteract = (isCleared || prevLocationCleared);

				if(isCleared || prevLocationCleared || alwaysVisible)
				{
					locations[locationName] = 
					{
						x: location.MapPos.x,
						y: location.MapPos.y,

						isVillage: location.isVillage,
						specialIcon: location.specialIcon,
                        canInteract: canInteract,
						name: location.GetDisplayName(),
						id: locationName,
						requiredLevel: location.requiredLevel,
						canPlayerEnter: (location.requiredLevel > World.Player.stats.Level) ? false : true,
						isCurrent: (locationName == World?.Location?.constructor?.name) ? true : false,
						isCleared: isCleared,
						rank: World?.Player?.locationInfo[locationName]?.rank
					};
				}
			}
		}

        return locations;
    }

    getLocationPoints()
    {
        var locations = this.getLocations();
        var points = [];

        for(var locationName in locations)
		{
			var location = locations[locationName];
            var p = new HexMapPoint(location.x, location.y, location);
            points.push(p);
        }

        return points;
    }

    static getLightMap(map, points)
    {
        var s = Dimension.getHexMapSize(map);
        var lightMap = [];

        for(var i = 0; i < s.height; i++)
        {
            lightMap[i] = [];
            for(var j = 0; j < s.width; j++)
            {
                lightMap[i][j] = false;
            }
        }

        for(var i = 0; i < points.length; i++)
        {
            var p = points[i];
            
            if(!p.locationData.isCleared) continue;
            if(!map[p.y]?.[p.x]) continue;        //points outside map cannot set vision

            var coords = Dimension.getPointVision(p.x, p.y, s.width, s.height);

            for(var j = 0; j < coords.length; j++)
            {
                lightMap[coords[j][1]][coords[j][0]] = true;
            }
        }

        return lightMap;
    }

    createLightMap()
    {
        this.lightMap = Dimension.createLightMap(this.HexMap, this.Points);
    }

    static getPointVision(x, y, width, height)
    {
        var coords = [];

        coords.push([x, y]);
        coords.push([x-1, y]);
        coords.push([x+1, y]);

        coords.push([x, y-1]);

        coords.push([x, y+1]);
        coords.push([x-1, y+1]);
        coords.push([x+1, y+1]);



        coords.push([x, y+2]);

        if(x%2 == 0)
        {
            coords.push([x+1, y+2]);
            coords.push([x-1, y+2]);
        }
        else
        {
            coords.push([x+1, y-2]);
            coords.push([x-1, y-2]);  
        }

        coords.push([x, y-2]);

        
        coords.push([x+1, y-1]);
        coords.push([x-1, y-1]);

        coords.push([x-2, y]);
        coords.push([x+2, y]);

        coords.push([x-2, y+1]);
        coords.push([x+2, y-1]);

        coords.push([x-2, y-1]);
        coords.push([x+2, y+1]);

        var valid_coords = [];

        for(var i = 0; i < coords.length; i++)
        {
            var c = coords[i];

            if(c[0] < 0 || c[0] > width || c[1] < 0 || c[1] > height) continue;

            valid_coords.push(c);
        }

        return valid_coords;
    }

    static getHexMapSize(map)
    {
        var width = map[0].length;
        var height = map.length;

        return {width: width, height: height};
    }

    static getMapPointAtHex(x, y, points)
    {
        for(var i = 0; i < points.length; i++)
        {
            if(points[i].x == x && points[i].y == y) return points[i];
        }
    }

    getHexData(x, y)
    {
        return Dimension.getHexData(x, y, this.HexMap, this.Points, this.lightMap);
    }

    static getHexData(x, y, map, points, lightmap)
    {
        var hex = map[y][x];

        var isMapTile = hex;
        var isActiveMapTile = lightmap[y][x];
        var locationPoint = Dimension.getMapPointAtHex(x, y, points);

        return {isMapTile: isMapTile, isActiveMapTile: isActiveMapTile, locationPoint: locationPoint};
    }
}

class HexMapPoint
{
    constructor(x, y, locationData)
    {
        this.x = x;
        this.y = y;
        this.locationData = locationData;
    }
}