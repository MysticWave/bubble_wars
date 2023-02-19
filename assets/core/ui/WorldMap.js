class WorldMap
{
    static Init()
    {
        this.MAP_TILES_X = 40;
        this.MAP_TILES_Y = 20;
        this.HEX_ANGLE = 2 * Math.PI / 6;

        this.DIMENSION = null;
        this.MAP = this.createEmptyMap();
        this.POINTS = [];
        this.LIGHT_MAP = [];
    }

    static getTileSize()
    {
        var map_content= document.getElementById('world_map').querySelector('.content');
        var s = window.getComputedStyle(map_content);
        var height = s.height.replace('px', '');

        return height / this.MAP_TILES_Y;
    }

    static getTileR()
    {
        return Math.ceil(this.getTileSize() / (2 * Math.sin(this.HEX_ANGLE)));
    }

    static createEmptyMap()
    {
        var m = [];
        for(var i = 0; i < this.MAP_TILES_Y; i++)
        {
            m[i] = [];
            for(var j = 0; j < this.MAP_TILES_X; j++)
            {
                m[i][j] = false;
            }
        }

        return m;
    }

    static drawPoint(x, y, data, isActiveMapTile = false)
    {
        var container = document.getElementById('world_map_points');
        var rank = data.rank ?? '';
        var abs_rank = rank.replace('+', '').replace('-', '').toLowerCase();

        var p = document.createElement('div');
            p.className = 'point text-stroke';
            p.style.top = y + 'px';
            p.style.left = x + 'px';
            p.innerText = rank;
            p.dataset.location_id = data.id;
            p.dataset.name = data.name;
            p.dataset.inactivehex = isActiveMapTile;
            if(data.specialIcon)
            {
                p.dataset.icon = data.specialIcon;
                p.className += ' icon';
            }

            p.style.setProperty('color', 'var(--color-rank-' + abs_rank + ')');
            if(data.isCurrent) p.dataset.current = 'true';

            p.dataset.village = data.isVillage;
            p.dataset.cleared = data.isCleared;
            p.dataset.locationfamily = data.id.toLowerCase().replace(/[0-9]/, '').replace(' ', '');
            if(!data.canInteract) p.style.pointerEvents = 'none';
            else
            {
                p.addEventListener('click', function()
                {
                    var result = Commands.GoToLocation(this.dataset.location_id);
                    if(result == true)
                    {
                        UI_Helper.Hide('#world_map');
                    }
                    else
                    {
                        console.error(result);
                    }
                });
            }

        container.appendChild(p);

        this.LOCATION_POINTS_HISTORY[data.id] = {x, y, cleared: data.isCleared};
    }


    static drawHexagon(ctx, x, y, r = this.getTileR(), hexagon_info)
    {
        var a = this.HEX_ANGLE;

        var color = null;
        var stroke = '#00157A';
        var strokeSize = 2;
        var alpha = 1;

        if(hexagon_info)
        {
            if(hexagon_info.isMapTile) 
            {
                color = '#00157A';
                alpha = .95;

                if(hexagon_info.isActiveMapTile)
                {
                    color = '#083BB6';
                    alpha = .95;
                    stroke = '#083BB6';
                    //0055FF - stroke
                }
            }
        }

        // if(drawingActiveHex)
        // {
        //     color = '#f0cb16';
        //     alpha = .5;
        // }

        ctx.save();
        ctx.fillStyle = color;
        ctx.lineWidth = strokeSize;
        ctx.strokeStyle  = stroke;
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        for (var i = 0; i < 6; i++) 
        {
            ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
        }
        ctx.closePath();
        if(color) ctx.fill();
        if(stroke) ctx.stroke();

        ctx.restore();
    }

    static drawHexeGrid(ctx, map, hexR, isBackgroundLayer = false) 
    {
        var tileSize = this.getTileSize();
        var a = this.HEX_ANGLE;
        var startX = -hexR;
        var x;
        var y = -hexR;

        var tmp_canvas = document.createElement('canvas');
            tmp_canvas.width = tileSize * this.MAP_TILES_X * Math.sin(this.HEX_ANGLE);
            tmp_canvas.height = tileSize * this.MAP_TILES_Y;
        var tmp_ctx = tmp_canvas.getContext('2d');

        var width = this.MAP_TILES_X;
        var height = this.MAP_TILES_Y;
        var tilesMargin = 1;

        for(var i = -tilesMargin; i < height + tilesMargin; i++)
        {
            y += hexR * 2 * Math.sin(a);
            x = startX;

            for(var j = -tilesMargin; j < width + tilesMargin; j++)
            {
                x += hexR * (1 + Math.cos(a));
                y += (-1) ** (j) * hexR * Math.sin(a);

                if(isBackgroundLayer)
                {
                    this.drawHexagon(ctx, x, y, hexR, hexagon_info);
                    continue;
                }

                var hexagon_info = null;
                if(map?.[i]?.[j] != null)
                {
                    hexagon_info = Dimension.getHexData(j, i, map, this.POINTS, this.LIGHT_MAP);
                }
                

                if(hexagon_info?.locationPoint) 
                {
                    this.drawPoint(x, y, hexagon_info.locationPoint.locationData, hexagon_info.isActiveMapTile);
                }

                if(!hexagon_info?.isMapTile) continue;

                if(hexagon_info?.isActiveMapTile) this.drawHexagon(tmp_ctx, x, y, hexR, hexagon_info);
                else this.drawHexagon(ctx, x, y, hexR, hexagon_info);
            }
        }

        ctx.save();
        ctx.shadowColor = "#0055FF";
        ctx.shadowBlur = 0;
        for(var x = -2; x <= 2; x++){
            // Y offset loop
            for(var y = -2; y <= 2; y++){
                // Set shadow offset
                ctx.shadowOffsetX = x;
                ctx.shadowOffsetY = y;

                // Draw image with shadow
                ctx.drawImage(tmp_canvas, 0, 0, tmp_canvas.width, tmp_canvas.height);
            }
        }
        ctx.restore();
    }


    static drawPaths(ctx)
    {
        var locations = this.DIMENSION.getLocations();

        for(var locationName in locations)
		{
			var loc = locations[locationName];
            var loc_pos = this.LOCATION_POINTS_HISTORY[locationName];
            if(!loc_pos) continue;

			var x = loc_pos.x;
			var y = loc_pos.y;

            var prev_locs = World.LocationList[loc.id].reqPrevLocation;
			if(prev_locs)
			{
                for(var i = 0; i < prev_locs.length; i++)
                {
                    var prev_id = prev_locs[i];
                    var prev_pos = this.LOCATION_POINTS_HISTORY[prev_id];

                    if(!prev_pos) continue;     //should not ever happen
                    if(!prev_pos.cleared) continue;     //will not draw line if prev location was not cleared

                    var x2 = prev_pos.x;
                    var y2 = prev_pos.y;

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
			}
        }
    }


    static Render()
    {
        this.LOCATION_POINTS_HISTORY = [];
        this.loadDimensionMap();

        var tileSize = this.getTileSize();
        this.LIGHT_MAP = Dimension.getLightMap(this.MAP, this.POINTS);

        var canvas_width = tileSize * this.MAP_TILES_X * Math.sin(this.HEX_ANGLE);
        var canvas_height = tileSize * this.MAP_TILES_Y;

        var bg_canvas = document.getElementById('map_background');
            bg_canvas.width = canvas_width;
            bg_canvas.height = canvas_height;

        var canvas = document.getElementById('map');
            canvas.width = canvas_width;
            canvas.height = canvas_height;

        var paths_canvas = document.getElementById('point_paths');
            paths_canvas.width = canvas_width;
            paths_canvas.height = canvas_height;

        var bg_ctx = bg_canvas.getContext('2d');
        var ctx = canvas.getContext('2d');
        var paths_ctx = paths_canvas.getContext('2d');

        bg_ctx.clearRect(0, 0, bg_canvas.width, bg_canvas.height);
        ctx.clearRect(0, 0, bg_canvas.width, bg_canvas.height);
        paths_ctx.clearRect(0, 0, bg_canvas.width, bg_canvas.height);

        document.getElementById('world_map_points').innerHTML = '';

        this.drawHexeGrid(bg_ctx, this.createEmptyMap(), this.getTileR(), true);
        this.drawHexeGrid(ctx, this.MAP, this.getTileR());
        this.drawPaths(paths_ctx);

        // drawingActiveHex = true;
        // this.drawHexeGrid(ctx, ACTIVE_HEX, getTileR());
        // drawingActiveHex = false;
    }



    static loadDimensionMap(dimName = 'OVERWORLD')
    {
        var dimension = World.DimensionsList[dimName];
        if(!dimension) return;

        this.DIMENSION = dimension;
        this.MAP = JSON.parse(JSON.stringify(dimension.HexMap));
        this.POINTS = dimension.getLocationPoints();
    }
}