class Effect_Invincibility extends Effect
{
	constructor(strength, time, hideParticles)
	{
		super(strength, time, hideParticles);

        this.keepStrongest = false;
	}

	Update(owner, effects)
	{
		super.Update(owner, effects);

        owner.isInvincible = true;
        owner.canBeKnockedBack = false;

        var t = (owner == World.Player) ? 3 * Main.FPS : Main.FPS;
        this.shield.isEnding = (this.ageInTicks >= this.Time - t) ? true : false;
	}

    onApply(owner)
    {
        this.shield = new EntityInvincibleShield(owner.x, owner.y, owner);
        if(owner == World.Player) this.shield.isFromPlayer = true;

        this.ownerKnock = owner.canBeKnockedBack;
        World.AddEntity(this.shield);
    }

    onClear()
	{
		if(this.Owner)
        {
            this.Owner.isInvincible = false;
            this.Owner.canBeKnockedBack = this.ownerKnock;
        }

        this.shield.Kill();
	}
}
Effects.Initialize(Effect_Invincibility);