class Effect_KnockBack extends Effect
{
	constructor(strength, time, direction)
	{
		super(strength, time * 2, true);

        this.Direction = direction;
        this.keepStrongest = false;
        this.showIcon = false;
	}

	Update(owner, effects)
	{
		super.Update(owner, effects);
        if(!owner.canBeKnockedBack) return;

        if(this.ageInTicks == 1) owner.onKnockBack?.();

        var resistance = owner.knockBackResistance ?? 0;
        var s = Math.sqrt(100 - this.durationPercent) / 10;

        var spd = 300 * this.Strength * s * (1-resistance);

        var move = Motion.Get([owner.x, owner.y], MathHelper.lineToAngle([owner.x, owner.y], spd, this.Direction), spd);

        var x = owner.x + move.x * Main.DELTA;
        var y = owner.y + move.y * Main.DELTA;

        var distance = MathHelper.GetDistance([x, y], [World.CenterPoint.x, World.CenterPoint.y]);
        if(distance > World.Radius - 20) return;

        owner.x = x;
        owner.y = y;
	}
}
Effects.Initialize(Effect_KnockBack);