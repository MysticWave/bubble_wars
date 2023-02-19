class EntityEgg extends Entity
{
	constructor(x, y, owner, stats = {})
	{
		super(x, y);
        this.layTexture = "entity.spider.egg.lay";
        this.hatchTexture = "entity.spider.egg.lay";

        this.layProgress = 0;
        this.timeToHatch = 30;
        this.isHatching = false;
        this.hatchTime = 0;
        this.hatchProgress = 0;
        this.isHurtAble = false;
        this.knockBackResistance = 1;

        this.TextureData = 
        {
            frame: 0,
            frames: 16
        };

        this.contains = [];

        this.Owner = owner;
        this.lastShakePhase = 0;

        this.dropLoot = false;
		this.dropOxygen = false;

        for(var id in stats)
        {
            this[id] = stats[id];
        }

        this.setScale(this.Scale);
	}
	
	Update()
	{
		super.Update();
		
        this.layProgress = this.Owner.layProgress;
        if(!this.Owner || !this.Owner.isAlive) 
        {
            if(!this.isHatching && !this.isHurtAble) this.HP = this.MAXHP * this.layProgress;
            this.isHurtAble = true;       
        }
        
        if(!this.Owner.isLayingEgg) 
        {
            this.isHatching = true;
            this.isHurtAble = true;
        }
        this.Texture = this.layTexture;

        this.TextureData.frame = Math.floor(this.layProgress * this.TextureData.frames);

        if(this.isHatching)
        {
            this.Texture = this.hatchTexture;
            this.TextureData.frame = this.TextureData.frames-1;
            this.hatchTime++;
            this.hatchProgress = this.hatchTime / (this.timeToHatch * Main.FPS);

            this.UpdateHatch();

            if(this.hatchProgress >= 1)
            {
                this.Hatch()
            }
        }
	}

    UpdateHatch()
    {
        var hatchPhase = 0;
        var rotDir = 1;
        var shakeDur = 16;

        if(this.hatchProgress > .60) hatchPhase++;
        if(this.hatchProgress > .70) hatchPhase++;
        if(this.hatchProgress > .85) hatchPhase++;
        if(this.hatchProgress > .95) hatchPhase++;

        if(this.lastShakePhase != hatchPhase) this.Rotation = 0;

        if(hatchPhase) shakeDur /= hatchPhase;
        if(this.ageInTicks%shakeDur >= shakeDur/2) rotDir *= -1;

        this.Rotation += rotDir * (hatchPhase * 2);
    }

    Hatch()
    {
        var level = getLocationLevel(World.Location);
        
        for(var i = 0; i < this.contains.length; i++)
        {
            var type = World.EntityList[this.contains[i]];
            if(!type) continue;

            var entity = new type();
                entity.x = this.x;
                entity.y = this.y;
                entity.setLevel(level);
            
            World.AddEntity(entity);
        }

		World.Kill(this);
    }
}
World.RegisterEntity(EntityEgg);