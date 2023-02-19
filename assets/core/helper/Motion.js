class Motion
{
	static Get(pos1, pos2, spd)
	{
		var x, y, endX, endY;

		if(pos1.x && pos1.y)
		{
			x = pos1.x;
			y = pos1.y;
		}
		else
		{
			x = pos1[0];
			y = pos1[1];
		}

		if(pos2.x && pos2.y)
		{
			endX = pos2.x;
			endY = pos2.y;
		}
		else
		{
			endX = pos2[0];
			endY = pos2[1];
		}


		var angle = MathHelper.getAngle2([x, y], [endX, endY]);
		var end = MathHelper.lineToAngle([x, y], spd, angle);
		
		var moveX = end.x - x;
		var moveY = end.y - y;

		if(x == endX) moveX = 0;
		if(y == endY) moveY = 0;

		return {x: moveX, y: moveY, angle: angle};
	}
}