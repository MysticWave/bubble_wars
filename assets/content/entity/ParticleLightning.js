class ParticleLightning extends Particle
{
    constructor(from, to, data = {})
    {
        super();

        this.From = from;
        this.To = to;

        this.segments = 40;
        this.maxVariation = 2;
        this.positions = [];

        this.Transparency = 1;

        this.Color = 'white';
        this.Width = 3;
        this.Blur = 5;
        this.BlurColor = 'white';

        this.GlowColor = '#FBFF57';
        this.GlowWidth = 15;
        this.GlowBlur = 25;

        this.fromTy = 0;
        this.fromTx = 0;

        this.toTy = 0;
        this.toTx = 0;

        for(var i in data)
        {
            this[i] = data[i];
        }
    }


    Render(context)
	{
        if(!this.From || !this.From.isAlive || this.From.killLightning) return this.Kill();
        if(!this.To || !this.To.isAlive || this.To.killLightning) return this.Kill();

		this.ageInTicks++;
		if(isFunction(this.onRender)) this.onRender(this);
		
		var x = this.From.x - Camera.xView + this.fromTx;
		var y = this.From.y - Camera.yView + this.fromTy;

        var x2 = this.To.x - Camera.xView + this.toTx;
		var y2 = this.To.y - Camera.yView + this.toTy;

        var positions = [];
        var totalLength = MathHelper.GetDistance(this.From, this.To);
        var segmentLength = totalLength / this.segments;
        var angle = MathHelper.getAngle2([this.From.x+this.fromTx, this.From.y+this.fromTy], [this.To.x+this.toTx, this.To.y+this.toTy]);
        var maxVariationLength = totalLength * this.maxVariation / 100;

        for(var i = 0; i < this.segments-1; i++)
        {
            var pos = MathHelper.lineToAngle([this.From.x+this.fromTx, this.From.y+this.fromTy], segmentLength * (i+1), angle);
            var _angle = MathHelper.randomInRange(0, 360);
            var r = MathHelper.randomInRange(0, maxVariationLength);

            var end = MathHelper.lineToAngle(pos, r, _angle);

            positions.push([end.x-Camera.xView, end.y-Camera.yView]);
        }

        positions.push([x2, y2]);

		if(this.RENDER_LAYER!=null) 
		{
			ChangeLayer(this.RENDER_LAYER);
			context = ctx;
		}

        var glow = 
        {
            color: this.GlowColor,
            Width: this.GlowWidth,
            blur: this.GlowBlur,
            blurColor: this.GlowColor,
            alpha: this.Transparency * .5
        };

        var base = 
        {
            color: this.Color,
            Width: this.Width,
            blur: this.Blur,
            blurColor: this.BlurColor,
            alpha: this.Transparency
        };

        this.DrawLine(context, x, y, positions, glow);
        this.DrawLine(context, x, y, positions, base);


        var r = this.Width * 2;
        var tX = MathHelper.randomInRange(-r/2, r/2);
        var tY = MathHelper.randomInRange(-r/2, r/2);
        this.DrawCircle(context, x+tX, y+tY, r, base);
        this.DrawCircle(context, x2+tX, y2+tY, r, base);


		if(this.RENDER_LAYER!=null) RestoreLayer();
	}

    DrawCircle(context, x, y, r, colors) 
    {
        context.save();
        context.globalCompositeOperation = 'source-over';
        context.beginPath();
        context.arc(x, y, r, 0, 2 * Math.PI, false);
        context.fillStyle = colors.color;
        context.shadowBlur = colors.blur;
        context.shadowColor = colors.blurColor;
        context.fill();
        context.restore();
    }


    DrawLine(context, x, y, positions, colors)
    {
        context.save();
        context.globalCompositeOperation = 'source-over';
        context.lineJoin = 'round';
        context.beginPath();
        context.strokeStyle = colors.color;
        context.lineWidth = colors.Width;

        context.moveTo(x, y);

        for(var i in positions) 
            context.lineTo(positions[i][0], positions[i][1]);
       
        context.globalAlpha = colors.alpha;
        context.shadowBlur = colors.blur;
        context.shadowColor = colors.blurColor;
        context.stroke();
        context.restore();
    }
}