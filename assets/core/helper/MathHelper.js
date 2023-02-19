class MathHelper
{
	/**
	 * Return End point of specific angle and length.
	 * @param {Array} pos Start position [x, y].
	 * @param {*} length Distance from start position.
	 * @param {*} angle Angle of rotation.
	 */
    static lineToAngle(pos, length, angle)
    {
		var x1, y1;
		
        angle *= Math.PI / 180;
		
		if(isArray(pos))
		{
			x1 = pos[0];
			y1 = pos[1];
		}
		else
		{
			x1 = pos.x;
			y1 = pos.y;
		}

        var x2 = x1 + length * Math.cos(angle),
            y2 = y1 + length * Math.sin(angle);

        return {x: x2, y: y2};
	}
	
	static ToRadians(angle)
	{
		return angle * Math.PI / 180;
	}

	static ToAngle(radians)
	{
		return radians * 180 / Math.PI;
	}

	static GetDelta(a, b, c)
	{
		var delta = (b**2) - 4 * a * c;

		return delta;
	}

	static GetCirclePoints(x, y, circleCenter, r)
	{
		//(x-a)2 + (y-b)2 = r2

		circleCenter = this.PosToCoords(circleCenter);
		if(y)
		{
			var a = 1;
			var b = -2 * circleCenter.x;
			var c = (circleCenter.x**2) + Math.pow(y - circleCenter.y, 2) - (r**2);

			var delta = this.GetDelta(a, b, c);
			var delta_sqrt = Math.sqrt(delta);

			var x1 = (-b - delta_sqrt) / (2*a);
			var x2 = (-b + delta_sqrt) / (2*a);

			return [{x: x1, y}, {x: x2, y}];
		}
	}

	// static GetIntersectionWithCircle2(circle1Pos, r, circle2Pos, r2)
	// {
	// 	circle1Pos = this.PosToCoords(circle1Pos);
	// 	circle2Pos = this.PosToCoords(circle2Pos);

	// 	var x1 = circle1Pos.x;
	// 	var y1 = circle1Pos.y;

	// 	var x2 = circle2Pos.x;
	// 	var y2 = circle2Pos.y;

	// 	var dl = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	// 	var cosA = (dl * dl + r * r - r2 * r2) / (2 * dl * r);
	// 	var sinA = Math.sqrt(1 - Math.pow(cosA, 2));
	// 	var vpx = (x2 - x1) * r / dl;
	// 	var vpy = (y2 - y1) * r / dl;
	// 	var V1x = vpx * cosA - vpy * sinA + x1;
	// 	var V1y = vpx * sinA + vpy * cosA + y1;

	// 	console.log(V1x, V1y);
	// }

	static GetIntersectionWithCircle(startPoint, angle, circleCenter, r, precision = 100)
	{
		r = Math.round(r * precision) / precision;
		
		startPoint = this.PosToCoords(startPoint);
		circleCenter = this.PosToCoords(circleCenter);

		var current_r = 0;
		var dir = 1;
		var i = 0;
		var lastPose, new_pos, dist_from_center;
		while(true)
		{
			i++;
			lastPose = new_pos;

			current_r += dir * (r / (2**i));
			new_pos = MathHelper.lineToAngle(startPoint, current_r, angle);
			dist_from_center = Math.round(MathHelper.GetDistance(new_pos, circleCenter) * precision) / precision;

			if(dist_from_center > r) dir = -1;
			else dir = 1;

			if(dist_from_center == r) return lastPose;
		}
	}


    static getAngle2(pos1, pos2)
    {
		var pos1 = this.PosToArray(pos1);
		var pos2 = this.PosToArray(pos2);

        var dx = pos2[0] - pos1[0];
        var dy = pos2[1] - pos1[1];
        
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }

	static PosToArray(position)
	{
		if(isArray(position)) return position;
		return [position.x, position.y];
	}

	static PosToCoords(position)
	{
		if(isArray(position)) return {x: position[0], y: position[1]};
		return position;
	}

    static GetDistance(Point1, Point2)
    {
        var result;

		var p1 = this.PosToArray(Point1);
		var p2 = this.PosToArray(Point2);

        var x = p2[0] - p1[0];
        var y = p2[1] - p1[1];

        result = Math.pow( (x*x) + (y*y) , 0.5);

        return result;
    }
	
	static tg(a, b) 
	{
		var kat = a / b;
		
		return kat;
	}
	
	static getRandomPoint()
	{
		var end = {};
		
		end.x = MathHelper.randomInRange(0, World.Width);
		end.y = MathHelper.randomInRange(0, World.Height);
		
		return end;
	}

	static GetRandomSide(Sides)
	{
		var sidesCount = 4;
		var side = null;

		if(!(Sides.top || Sides.bottom || Sides.left || Sides.right))
		{
			return null;
		}

		while(true)
		{
			var side = MathHelper.randomInRange(0, sidesCount - 1);

			switch(side)
			{
				case 0:
					if(Sides.top) return "top";
				
				case 1:
					if(Sides.left) return "left";
				
				case 2:
					if(Sides.bottom) return "bottom";
				
				case 3:
					if(Sides.right) return "right";
			}
		}
	}
	
	static GetRoomByIndex(rooms, index)
	{
		var height = rooms.length;
		var width = rooms[0].length;

		var pos = {x: 0, y: 0};
		pos.x = index % width;
		pos.y = Math.floor(index / height);
		pos.room = rooms[pos.y][pos.x];

		return pos;
	}

	static RotatePoint(originPoint, angle, point)
	{
		originPoint = this.PosToCoords(originPoint);
		point = this.PosToCoords(point);
		angle = angle * Math.PI/180;

	  	var s = Math.sin(angle);
	  	var c = Math.cos(angle);
		
		// translate point back to origin:
		point.x -= originPoint.x;
		point.y -= originPoint.y;
		
		// rotate point
		var newX = point.x * c - point.y * s;
		var newY = point.x * s + point.y * c;
		
		// translate point back:
		point.x = newX + originPoint.x;
		point.y = newY + originPoint.y;
		return point;
	}


	static getRandomPointInRange(pos, range, rangeMin = 0)
	{
		pos = this.PosToCoords(pos);

		var angle = this.randomInRange(0, 360);
		var r = this.randomInRange(rangeMin, range);

		var new_pos = this.lineToAngle(pos, r, angle);
		return new_pos;
	}
	
	static randomInRange(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static GetMovementSpeed(moveX, moveY)
	{
		return Math.sqrt((moveX * moveX) + (moveY * moveY));
	}

	/**
	 * 
	 * @param {Number} chance % chance of random event.
	 */
	static GetChance(chance)
	{
		var precision = 100;
		var rand = this.randomInRange(0, 100 * precision);

		return (chance * precision) > rand;
	}

	static isInRange(_pos1, _pos2, range)
	{
		var pos1 = _pos1;
		var pos2 = _pos2;

		if(_pos1.x && _pos1.y)
		{
			pos1 = [_pos1.x, _pos1.y];
		}

		if(_pos2.x && _pos2.y)
		{
			pos2 = [_pos2.x, _pos2.y];
		}

		var distance = MathHelper.GetDistance(pos1, pos2);

		return (distance <= range);
	}

	static ToAllowedAngle(angle)
	{
		return (360 + angle) % 360;
	}


	static GetPointDistanceFromLine(point, lineStart, lineEnd)
	{
		var a = (lineEnd[1] - lineStart[1]) / (lineEnd[0] - lineStart[0]);
		var b = -(a * lineStart[0]) + lineStart[1];

		var A = a;
		var B = -1;
		var C = b;

		return Math.abs(A * point[0] + B * point[1] + C) / Math.sqrt(A* A + B * B);
	}

	static ticksToSeconds(ticks, precision = 10)
	{
		return Math.round(ticks / Main.FPS * precision) / precision;
	}
}