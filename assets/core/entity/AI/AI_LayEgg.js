class AI_LayEgg
{
	constructor(layTimeMin, layTimeMax, layDuration, eggType, eggStats, stats = {})
	{
		this.name = "LayEgg";
        this.layTimeMin = layTimeMin;
        this.layTimeMax = layTimeMax;
        this.layDuration = layDuration * Main.FPS;
        this.eggType = eggType;
        this.eggStats = eggStats;

        this.time = 0;
        this.Egg = null;
        this.eggTranslateY = 0;
        
        for(var i in stats)
        {
            this[i] = stats[i];
        }
        this.SetLayTime();
	}

    SetLayTime()
    {
        this.timeToLayEgg = MathHelper.randomInRange(this.layTimeMin, this.layTimeMax) * Main.FPS;
    }
	
	Update(owner)
	{
		this.time++;
        owner.isLayingEgg = false;
        owner.canBeKnockedBack = true;

        if(this.time > this.timeToLayEgg)
        {
            var layProgress = ((this.time - this.timeToLayEgg) / this.layDuration);

            owner.isLayingEgg = true;
            owner.layProgress = layProgress;
            owner.canBeKnockedBack = false;

            if(!this.Egg) this.SpawnEgg(owner);

            if(layProgress >= 1)
            {
                owner.isLayingEgg = false;
                this.time = 0;
                this.SetLayTime();
                this.Egg = null;
            }
        }
	}

    SpawnEgg(owner)
    {
        var type = World.EntityList[this.eggType];
        if(!type) return;

        this.Egg = new type(owner.x, owner.y, owner, this.eggStats);
        this.Egg.y = owner.y + this.eggTranslateY + (this.Egg.height * this.Egg.Scale * .85);        //spawn egg under spider, not on it
        World.AddEntity(this.Egg, false);
    }
}