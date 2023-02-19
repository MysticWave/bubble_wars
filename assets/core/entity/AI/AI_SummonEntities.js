class AI_SummonEntities
{
	constructor(summonTypes, summonInfo, onlyOnaggressive)
	{
		this.name = "SummonEntities";
		this.onlyOnaggressive = onlyOnaggressive;
		this.summonTypes = summonTypes || null;
		
		var def_summonInfo = 
			{
				summonDelayMin: 5,
				summonDelayMax: 10,
				summonCountMin: 1,
				summonCountMax: 1,
				summonRange: 200,
				summonNumbers: 20,
				entityStats: null
			};
			
		this.summonCharge = 0;
		this.summonNumber = 0;
		
		for(var property in def_summonInfo)
		{
			this[property] = def_summonInfo[property];
		}
		
		if(summonInfo)
		{
			for(var property in summonInfo)
			{
				this[property] = summonInfo[property];
			}
		}
		this.summonDelay = MathHelper.randomInRange(this.summonDelayMin * Main.FPS, this.summonDelayMax * Main.FPS);
	}
	
	Update(owner)
	{
		if( (this.onlyOnaggressive && !owner.aggressive) || (this.summonNumber >= this.summonNumbers))
		{
			return;
		}
		var f = Main.FPS;
		
		if (this.summonCharge >= this.summonDelay)
		{
			if(this.summonTypes)
			{
				this.Summon(owner);
				this.summonCharge = 0;
				this.summonDelay = MathHelper.randomInRange(this.summonDelayMin * f, this.summonDelayMax * f);
			}
		}
		else
		{
			this.summonCharge++;
		}
	}
	
	Summon(owner)
	{
		var enemies = MathHelper.randomInRange(this.summonCountMin, this.summonCountMax);
		
		for(var i = 0; i < enemies; i++)
		{
			var entityType = MathHelper.randomInRange(0, this.summonTypes.length - 1);
			
			this.summonNumber++;
			while(true)
			{
				var pos = MathHelper.getRandomPointInRange([owner.x, owner.y], this.summonRange);
				var distance = MathHelper.GetDistance([pos.x, pos.y], [World.CenterPoint.x, World.CenterPoint.y]);

				if(distance < World.Radius - 30)
				{
					break;
				}
			}
			
			var entity = new this.summonTypes[entityType](pos.x, pos.y);
			if(this.entityStats)
			{
				for(var property in this.entityStats)
				{
					entity[property] = this.entityStats[property];
				}
			}
			World.AddEntity(entity);
		}
	}
}