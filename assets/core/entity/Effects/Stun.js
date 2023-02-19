class Effect_Stun extends Effect
{
	constructor(strength, time, hideParticles)
	{
		super(strength, time, hideParticles);

        this.keepStrongest = false;
	}

	Update(owner, effects)
	{
		super.Update(owner, effects);
        if(owner.Immunity.STUN || owner.Immunity.ALL) 
        {
            this.toClear = true;
            return;
        }

        owner.allowMove = false;
        owner.allowControl = false;
        owner.isStunned = true;
	}

    onClear()
	{
		if(this.Owner)
        {
            this.Owner.allowMove = true;
            this.Owner.allowControl = true;
            this.Owner.isStunned = false;
        }
	}

    Render(context, owner)
    {
        if(this.hideParticles) return;

        var texture = TextureManager.Get('effect.stun');
        var alpha = 1;
        var scale = 1 * owner.Scale;
        var tY = 32 * owner.Scale;
        var x =  owner.x - Camera.xView;
        var y = owner.y - Camera.yView;
        var speed = 4;
        var frame = Math.floor((owner.ageInTicks%(15*speed))/speed);

        Graphic.DrawRotatedAnimatedImage(context, frame, [5, 3], 'XY', 
            texture, x, y - tY, 64, 64, scale, 0, alpha);
    }
}
Effects.Initialize(Effect_Stun);