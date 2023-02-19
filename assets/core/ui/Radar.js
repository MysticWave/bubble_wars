class LocationRadar
{
    static getColors()
    {
        var c =
        {
            player: '#0088FF',
            entity: 'red',
            npc: 'white'

        };
        return c;
    }

    static Render()
    {
        var canvas = document.getElementById('location_radar_canvas');
        var ctx = canvas.getContext('2d');

        var size = getCssVariable('#location_radar', '--size', true);
		var point_size = 7;
		var entity_point = point_size - 2;
		
		var scale = (World.Radius * 2) / size;

        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, size, size);


        //dont render entities while moving to new room
        if(World.isChangingLocation) return;

        var color, s, entity, x, y;
        var colors = this.getColors();
		
		// ctx.save();
		// // ctx.fillStyle = "black";
		// // ctx.globalAlpha = 0.2;
		// ctx.fillStyle = "white";
		// ctx.globalAlpha = 0.1;
		// ctx.beginPath();
		// ctx.arc(x + width / 2, y + height / 2, width / 2 + 5, 0, 2 * Math.PI);
		// ctx.fill();
		// ctx.restore();
		
		// ctx.save();
		// ctx.lineWidth = 5;
		// ctx.strokeStyle  = "lightgray";
		// ctx.beginPath();
		// ctx.arc(x + width / 2, y + height / 2, (width / 2) + 5, 0, 2 * Math.PI);
		// ctx.stroke();
		// ctx.restore();

		for(var i = 0; i < World.Entities.length; i++)
		{
			s = 0;
			color = "red";
			entity = World.Entities[i];

			if(entity.isHidden) continue;
			if(entity.isFromPlayer) continue;		//do not show player dummies
			if(entity.hideOnRadar) continue;

			if((entity instanceof Oxygen) || (entity instanceof EntityItem))
			{
				s = 3;
				color = colors.npc;

                //do not show 'empty' oxygens
				if(!entity.value) continue;
			}
            if(entity instanceof EntityItem)
            {
                if(entity?.item?.Grade)
                {
                    var g_name = entity.item.Grade.replace('GRADE_', '').toLowerCase();
                    if(g_name != 'normal' && g_name != 'transcendental')
                        color = getCssVariable(document.body, '--color-grade-'+g_name);
                }
            }

			if(entity.isNPC) color = colors.npc;
			
			x = (entity.x / scale) - ((World.Width / 2 - World.Radius) / scale);
			y = (entity.y / scale) - ((World.Width / 2 - World.Radius) / scale);
			
			ctx.save();
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(x, y, entity_point - s, 0, 2 * Math.PI);
			ctx.fill();
			ctx.restore();
		}

        x = (World.Player.x / scale) - ((World.Width / 2 - World.Radius) / scale);
        y = (World.Player.y / scale) - ((World.Width / 2 - World.Radius) / scale);

		ctx.save();
		ctx.fillStyle = colors.player;
		ctx.beginPath();
		ctx.arc(x, y, point_size, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
    }
}