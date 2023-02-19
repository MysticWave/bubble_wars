class BulletFrogTongue extends ProjectileHook
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

        this.Texture = 'projectile.frog.tongue.end';
        this.segmentTexture = 'projectile.frog.tongue';
        this.returnDeepInside = true;
        this.canHookWhileReturning = false;
	}

    onShoot()
    {
        this.source.allowRotationChange = false;
    }
    
    Update()
    {
        if(!this.source.isAlive) this.Kill();
        super.Update();
    }

    Render(context)
    {  
        var texture = TextureManager.Get(this.segmentTexture);

        var x = this.source.x - Camera.xView;
        var y = this.source.y - Camera.yView;
        var scale = this.Scale;

        var width = this.width;
        var height = MathHelper.GetDistance([this.x, this.y], [this.source.x, this.source.y]) - (width * scale * .3);

        var rotation = MathHelper.getAngle2([this.x, this.y], [this.source.x, this.source.y])+90;
        var alpha = this.Transparency;

		var frame = 0;
		var frames = 1;
		var direction = 'Y';


		Graphic.DrawRotatedAnimatedImage(context, frame, frames, direction, 
            texture, x, y, width, height/scale, scale, rotation, alpha, this.Origin.x, -height/scale/2);


        this.Rotation = rotation - 180;

        super.Render(context);
    }

    onKill()
    {
        this.source.allowRotationChange = true;
        super.onKill();
    }
}
Projectile.Types(BulletFrogTongue);