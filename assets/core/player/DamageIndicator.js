class DamageIndicator
{
	static Initialize()
	{
		this.ToRender = [];
		this.liveTime = Main.FPS * 0.5;
		this.style = Style.GetStyleByName("ItemInfoDisplay");

		this.fontSize = 20;
		this.fontSizeCrit = 60;

		this.style.fontSize = this.fontSize;

		this.fX = function(x, p, q, s = 1)
		{
			return 0.25 * s * ((x - p) * (x - p)) + q;
		};

		this.Colors = 
		{
			"DEALT": "white",
			"RECEIVED": "red",
			"HEAL": "lightgreen",
			"AMMO": 'yellow',

			"UPGRADE_SUCCESS": "#00ff00",
			"UPGRADE_FAILED": "orange",
			"UPGRADE_ERROR": "#ff0000"
		};

		this.Strokes = 
		{
			"DEALT": "lightgray",
			"RECEIVED": "red",
			"HEAL": "lightgreen",
			"AMMO": 'yellow',

			"UPGRADE_SUCCESS": "black",
			"UPGRADE_FAILED": "black",
			"UPGRADE_ERROR": "black"
		};
	}

	static AddObject(x, y, value, type, direction = 1, isCritical = false)
	{
		this.ToRender.push(
			{
				x: x,
				y: y,
				p: x + (direction * 10),
				q: y - 10,
				direction: direction ?? 1,
				value: value,
				type: type,
				isCritical: isCritical,
				ageInTicks: 0
			}
		);
	}

	static Update()
	{
		for(var i = 0; i < this.ToRender.length; i++)
		{
			var obj = this.ToRender[i];
			var strength = 1;
			var time = this.liveTime;
			if(obj.isCritical)
			{
				// time /= 2;
				strength = 5;
			}
			obj.x += obj.direction * strength;
			obj.y = this.fX(obj.x, obj.p, obj.q, 1 / strength / 2);


			obj.ageInTicks++;
			obj.alpha = 1 - (obj.ageInTicks / time);

			if(obj.ageInTicks > time)
			{
				this.ToRender.splice(i, 1);
			}
		}
	}

	static Render()
	{
		for(var i = 0; i < this.ToRender.length; i++)
		{
			var obj = this.ToRender[i];
			var color = this.Colors[obj.type];
			var stroke = this.Strokes[obj.type];
			var value = obj.value;

			if(obj.isCritical) 
			{
				this.style.fontSize = this.fontSizeCrit;
				value += ' Crit!';
			}
			else this.style.fontSize = this.fontSize;

			Style.FillText(ctx, this, value+'', obj.x - Camera.xView, obj.y - Camera.yView, color, stroke, obj.alpha);
		}
	}
}