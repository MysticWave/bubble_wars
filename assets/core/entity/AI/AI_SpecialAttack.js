class AI_SpecialAttack
{
	constructor(owner, data = {})
	{
		this.name = "SpecialAttack";
        this.Owner = owner;
		
        this.CoolTime = data.CoolTime || 8 * Main.FPS;
        this.PreparationTime = data.PreparationTime || 0;
        this.Duration = data.Duration || 5 * Main.FPS;

        this.lastCoolTime = this.CoolTime;

        this.ageInTicks = 0;
        this.startAt = data.Delay || 60;

        this.updateTrigger = data.updateTrigger ?? null;
	}
	
	Update(owner)
	{	
        if(!this.updateTrigger?.(owner)) return;

		this.ageInTicks++;
        owner.isUsingSpecialAttack = false;

        owner.specialAttackCoolTimeTick = this.ageInTicks - (this.startAt-this.lastCoolTime);

        if(this.ageInTicks >= this.startAt)
        {
            owner.isUsingSpecialAttack = true;
            owner.specialAttackCoolTimeTick = 0;
            var tick = this.ageInTicks - this.startAt;

            if(tick == 0) owner.specialAttackStart?.();

            if(tick <= this.PreparationTime)
            {
                owner.specialAttackPreparationProgress = tick / this.PreparationTime;
                owner.specialAttackPreparationTick = tick;
                owner.specialAttackPreparationUpdate?.();
                return;
            }

            tick -= this.PreparationTime;
            if(tick <= this.Duration)
            {
                owner.specialAttackProgress = tick / this.Duration;
                owner.specialAttackTick = tick;
                owner.specialAttackUpdate?.();
                return;
            }

            owner.specialAttackEnd?.();
            this.setCoolTime(this.CoolTime);
        }
	}

    setCoolTime(coolTime = this.CoolTime)
    {
        this.lastCoolTime = coolTime;
        this.startAt = this.ageInTicks + coolTime;
    }
}