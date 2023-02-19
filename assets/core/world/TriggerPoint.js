class TriggerPoint
{
	constructor(x, y, radius, id, onActive, customTrigger)
	{
		this.x = x;
		this.y = y;
		this.id = id;

		this.Radius = radius;
		this.onActive = onActive;
		this.customTrigger = customTrigger;
		this.inRange = false;
	}

	Update(entity)
	{
		if(!entity) return;
		var call = false;
		var distance = MathHelper.GetDistance([this.x, this.y], [entity.x, entity.y]);
		this.inRange = false;
		if(distance <= this.Radius)
		{
			this.inRange = true;
		}

		if(isFunction(this.customTrigger))
		{
			call = this.customTrigger(entity);
		}
		else
		{
			call = this.inRange;
		}

		if(call && isFunction(this.onActive))
		{
			this.onActive(entity);
		}

	}

}