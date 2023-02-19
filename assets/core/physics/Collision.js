class Collision
{
	static Check(entity)
	{
		entity.lockMove.Right = false;
		entity.lockMove.Left = false;
		entity.lockMove.Top = false;
		entity.lockMove.Down = false;

		if(entity.x <= 0)
		{
			entity.x = 0;
			entity.lockMove.Left = true;
			if(entity.Bounce)
			{
				entity.dirX *= -1;
			}
		}
		
		if(entity.y <= 0)
		{
			entity.y = 0;
			entity.lockMove.Top = true;
			if(entity.Bounce)
			{
				entity.dirY *= -1;
			}
		}
		
		if(entity.x + entity.Width >= World.Width)
		{
			entity.x = World.Width - entity.Width;
			entity.lockMove.Right = true;
			if(entity.Bounce)
			{
				entity.dirX *= -1;
			}
		}

		if(entity.y + entity.Height >= World.Height)
		{
			entity.y = World.Height - entity.Height;
			entity.lockMove.Down = true;
			if(entity.Bounce)
			{
				entity.dirY *= -1;
			}
		}
	}

	

	static AreColliding(entity1, entity2)
	{
		if(!entity1 || !entity2) return false;

		var hitBoxes1 = ([entity1.HitBox]).concat(entity1.advancedHitBox ?? []);
		var hitBoxes2 = ([entity2.HitBox]).concat(entity2.advancedHitBox ?? []);

		for(var i in hitBoxes1)
		{
			for(var j in hitBoxes2)
			{
				if(this.CheckHitboxCollisions(hitBoxes1[i], hitBoxes2[j], entity1, entity2)) return true;
			}
		}
		
		return false;
	}

	static CheckHitboxCollisions(hitbox1, hitbox2, entity1, entity2)
	{
		if(hitbox1.Type == HITBOX.RECTANGLE && hitbox2.Type == HITBOX.RECTANGLE)
		{
			var x1 = hitbox1.x;
			var y1 = hitbox1.y;
			var sx1 = hitbox1.endX;
			var sy1 = hitbox1.endY;

			var x2 = hitbox2.x;
			var y2 = hitbox2.y;
			var sx2 = hitbox2.endX;
			var sy2 = hitbox2.endY;
			

			if(
				(
					(x1 >= x2) && (x1 <= sx2) ||
					(x2 >= x1) && (x2 <= sx1)
				) &&
				(
					(y1 >= y2) && (y1 <= sy2) ||
					(y2 >= y1) && (y2 <= sy1)
				)
			)
			{
				return true;
			}
			return false;
		}
		else if(hitbox1.Type == HITBOX.ROUND && hitbox2.Type == HITBOX.ROUND)
		{
			var x1 = hitbox1.x;
			var y1 = hitbox1.y;
			var r1 = hitbox1.Radius;

			var x2 = hitbox2.x;
			var y2 = hitbox2.y;
			var r2 = hitbox2.Radius;

			var distance = MathHelper.GetDistance([x1, y1], [x2, y2]);
			if(distance <= r1 + r2)
			{
				return true;
			}
			return false;
		}
		else if(hitbox1.Type == HITBOX.RECTANGLE && hitbox2.Type == HITBOX.ROUND)
		{
			var width = hitbox1.Width;
			var height = hitbox1.Height;
			var x1 = hitbox1.x + (width / 2);
			var y1 = hitbox1.y + (height / 2);
			

			var x2 = hitbox2.x;
			var y2 = hitbox2.y;
			var r2 = hitbox2.Radius;

			var distX = Math.abs(x2 - x1);
			var distY = Math.abs(y2 - y1);
			if((distX <= r2 + width / 2) && (distY <= r2 + height / 2))
			{
				//distance from corner
				var d = Math.sqrt((width * width) + (height * height));
				var distD = MathHelper.GetDistance([x1, y1], [x2, y2]);
				if(distD <= r2 + (d / 2))
				{
					return true;
				}
			}
			return false;
		}
		else
		{
			return this.AreColliding(entity2, entity1);
		}
	}
}