class AI_Dash
{
	constructor(owner, target, onlyOnAggressive = true, coolTimeMin = 10, coolTimeMax, additionalData = {})
	{
		this.name = "Dash";
        this.ageInTicks = 0;
		this.target = target;
		this.targetRange = null;
        this.onlyOnAggressive = onlyOnAggressive;
        this.coolTimeMin = coolTimeMin;
        this.coolTimeMax = coolTimeMax ?? coolTimeMin;

        this.dashStart = 0;
        this.dashDuration = (Main.FPS / 60) * 10;
		this.dashMultiplier = 5;
        this.dashesInRow = 1;
        this.dashedInRow = 0;
        this.dashesInRowDelay = 10;
		this.stopDashOnCollision = true;

        this.dashCoolTime = MathHelper.randomInRange(0, this.coolTimeMin * Main.FPS);
        this.timeToDash = this.dashCoolTime;

        for(var i in additionalData)
		{
			this[i] = additionalData[i];
		}

        owner.onRenderFunctions.push(function(context, owner)
        {
            if(!owner.isDashing) return;
            owner.AI?.Dash?.RenderDashShadows(context, owner);            
        });
	}

    GetTarget(owner)
	{
		if(this.target == World.Player || this.target == Player) return World.Player;
		if(World.Entities.indexOf(this.target) != -1) return this.target;

		return Entity.GetAvailableTargets(owner);
	}

    canDash(owner)
	{
		if(owner.isDashing) return false;
		if(this.ageInTicks < this.timeToDash) return false;
		return true;
	}

	Update(owner)
	{
		if(this.onlyOnAggressive && !owner.aggressive) return;
		if(this.updateTrigger && !this.updateTrigger(owner)) return;

        this.ageInTicks++;
		if(this.canDash(owner)) this.Dash(owner);
        if(owner.isDashing) this.UpdateDash(owner);

        var p = 100-((this.timeToDash - this.ageInTicks) / this.dashCoolTime * 100);
        if(p < 0) p = 0;
        if(p > 100) p = 100;
        owner.toDashProgress = p;
	}

    Dash(owner)
    {
        var target = this.GetTarget(owner);
        if(!target) return;

		if(this.targetRange)
		{
			if(MathHelper.GetDistance(owner, target) >= this.targetRange) return;
		}

        owner.isDashing = true;
        this.dashStart = this.ageInTicks;
        this.dashAngle = MathHelper.getAngle2([owner.x, owner.y], [target.x, target.y]);

		this.dashShadowsData = [];

		owner.onDashStart?.();
    }
    

    setCoolTime(fixedCoolTime = null, additionalCoolTime = 0)
    {
        this.dashCoolTime = MathHelper.randomInRange(this.coolTimeMin * Main.FPS, this.coolTimeMax * Main.FPS);
        if(fixedCoolTime) this.dashCoolTime = fixedCoolTime;
        if(additionalCoolTime) this.dashCoolTime += additionalCoolTime;
        this.dashedInRow = 0;
        this.timeToDash = this.ageInTicks + this.dashCoolTime;
    }

	UpdateDash(owner)
	{
		if(!owner.isDashing) return;

		if(this.dashStart + this.dashDuration < this.ageInTicks) 
		{
			owner.isDashing = false;
            this.dashedInRow++;

            if(this.dashedInRow < this.dashesInRow)
            {
                this.dashCoolTime = this.dashesInRowDelay;
                this.timeToDash = this.ageInTicks + this.dashCoolTime;
				owner.onDashEnd?.();
            }
            else
            {
                this.setCoolTime();
				owner.onDashEnd?.();
            } 
		}

		var spd = owner.getSPD();;
		var delta = Main.DELTA;

		spd *= this.dashMultiplier;

		var to = MathHelper.lineToAngle([owner.x, owner.y], spd * delta, this.dashAngle);
		if(MathHelper.GetDistance([to.x, to.y], World.CenterPoint) < World.Radius)
		{
			owner.x = to.x;
			owner.y = to.y;
		}
        else
        {
			if(this.stopDashOnCollision)
			{
				owner.isDashing = false;
				this.setCoolTime();
			}

			owner.onDashCollision?.();
        }

		this.dashShadowsData.push({x: owner.x, y: owner.y, Rotation: owner.Rotation, times: 0});
	}


    RenderDashShadows(context, owner)
	{
		if(this.dashShadowsData.length > 0)
		{
			var savedX = owner.x;
			var savedY = owner.y;
			var savedRot = owner.Rotation;
			var savedAlpha = owner.Transparency;
			var shadowsRendered = 0;

			for(var i = 0; i < this.dashShadowsData.length; i++)
			{
				var data = this.dashShadowsData[i];
				if(data.times > 10) continue;
				shadowsRendered++;

				owner.x = data.x;
				owner.y = data.y;
				owner.Rotation = data.Rotation;
				owner.Transparency = .25 - (data.times * .025);

                if(owner.Model) 
                {
                    owner.Model.Update(true);
                    owner.Model.Render(context);
                }
                else owner.RenderTexture(context);

				this.dashShadowsData[i].times++;
			}

			owner.x = savedX;
			owner.y = savedY;
			owner.Rotation = savedRot;
			owner.Transparency = savedAlpha;

            owner.Model?.Update(true);
			if(shadowsRendered == 0) this.dashShadowsData = [];
		}
	}
}