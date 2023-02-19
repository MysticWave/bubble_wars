class ParticleFlash extends Particle
{
    constructor(x, y, data = {})
    {
        super();

        this.x = x;
        this.y = y;

        this.Transparency = 1;
        this.Duration = 30;
        this.Size = 64;

        this.Stars = 10;
        this.currentStars = 0;
        this.StarsSpeed = 50;

        this.DustSpeed = 15;

        this.Type = 0;
        this.Scale = 1;
        this.timeToShow = 0;

        this.Textures = 
        {
            1: 'effect.flash.1',
            2: 'effect.flash.2'
        };


        for(var i in data)
        {
            this[i] = data[i];
        }
    }


    Render(context)
	{
		if(isFunction(this.onRender)) this.onRender(this);

        if(this.Type == 1 && this.ageInTicks == 0)
        {
            var s = new ParticleFlashCircle(this.x, this.y);
                s.Scale = this.Scale;
                s.Transparency = this.Transparency;
                s.RENDER_LAYER = Graphic.Layer.Particle0;

            World.AddParticle(s);

            s = new ParticleFlashCircle(this.x, this.y);
                s.Scale = this.Scale * 2;
                s.Transparency = this.Transparency;
                s.RENDER_LAYER = Graphic.Layer.Particle0;
                s.Texture = 'effect.flash.5';

            World.AddParticle(s);

            this.timeToShow = s.Duration / 2;
        }

        this.ageInTicks++;
        if(this.ageInTicks <= this.timeToShow) return;

		
        if(this.currentStars < this.Stars)
        {
            var size = this.Size * 2 * this.Scale;
            var sX = this.x + (MathHelper.randomInRange(-50, 50) * size / 100);
            var sY = this.y + (MathHelper.randomInRange(-50, 50) * size / 100);
            var s = new ParticleFlashStar(sX, sY);
                s.Scale = this.Scale;
                s.Transparency = this.Transparency;
                s.speed = this.StarsSpeed * MathHelper.randomInRange(70, 100) / 100;
                s.Duration = this.Duration * 1.5;
                s.RENDER_LAYER = this.RENDER_LAYER;

            World.AddParticle(s);
            this.currentStars++;
        }

        if(this.ageInTicks%5 == 0)
        {
            var sX = this.x;
            var sY = this.y;
            var s = new ParticleFlashDust(sX, sY);
                s.Scale = this.Scale * 2;
                s.speed = this.DustSpeed;
                s.Duration = this.Duration;
                s.RENDER_LAYER = this.RENDER_LAYER;

            World.AddParticle(s);
        }

        if(this.ageInTicks > this.Duration+this.timeToShow) this.Kill();
	}
}

class ParticleFlashCircle extends Particle
{
    constructor(x, y, data = {})
    {
        super();

        this.x = x;
        this.y = y;

        this.Transparency = 1;
        this.Duration = 10;

        this.Scale = 1;

        this.Texture = 'effect.flash.1';

        for(var i in data)
        {
            this[i] = data[i];
        }
    }

    Render(context)
	{
		this.ageInTicks++;
		
		var x = this.x - Camera.xView;
		var y = this.y - Camera.yView;
        var size = 64;
        var scale = this.Scale * 5;
        var s = 1 - (this.ageInTicks / this.Duration);

		if(this.RENDER_LAYER!=null) 
		{
			ChangeLayer(this.RENDER_LAYER);
			context = ctx;
		}

        Graphic.DrawRotatedImage(context, TextureManager.Get(this.Texture), x, y, size, size, scale * s, 0, this.Transparency);

		if(this.RENDER_LAYER!=null) RestoreLayer();

        if(this.ageInTicks >= this.Duration) this.Kill();
	}
}



class ParticleFlashStar extends Particle
{
    constructor(x, y, data = {})
    {
        super();

        this.x = x;
        this.y = y;

        this.Transparency = 1;
        this.Duration = 15;

        this.speed = 10;
        this.Scale = 1;
        this.silkTime = 5;
        this.moveTick = MathHelper.randomInRange(0, 100);

        this.Texture = 'effect.flash.4';

        for(var i in data)
        {
            this[i] = data[i];
        }
    }

    Move()
    {
        var d = Main.DELTA;
        this.y -= this.speed * d;
        this.x += (Math.cos((this.moveTick+this.ageInTicks)/5) * this.speed * 3) * d;
    }


    Render(context)
	{
		this.ageInTicks++;
        this.Move();
		
		var x = this.x - Camera.xView;
		var y = this.y - Camera.yView;
        var size = 64;
        var s = 1;
        var scale = this.Scale * .3;
        var alpha = 1;
        if(this.ageInTicks < this.silkTime) s = this.ageInTicks / this.silkTime;
        if(this.ageInTicks > this.Duration-this.silkTime) s = (this.Duration-this.ageInTicks) / this.silkTime;

		if(this.RENDER_LAYER!=null) 
		{
			ChangeLayer(this.RENDER_LAYER);
			context = ctx;
		}

        Graphic.DrawRotatedImage(context, TextureManager.Get(this.Texture), x, y, size, size, scale * s, 0, alpha * this.Transparency);

		if(this.RENDER_LAYER!=null) RestoreLayer();

        if(this.ageInTicks > this.Duration) this.Kill();
	}
}


class ParticleFlashDust extends ParticleFlashStar
{
    constructor(x, y, data = {})
    {
        super(x, y);

        this.Texture = 'effect.flash.3';

        for(var i in data)
        {
            this[i] = data[i];
        }
    }

    Move()
    {
        var d = Main.DELTA;
        this.y -= this.speed * d;
        // this.x += (Math.sin(this.y) * this.speed) * d;
    }

    Render(context)
	{
		this.ageInTicks++;
        this.Move();
		
		var x = this.x - Camera.xView;
		var y = this.y - Camera.yView;
        var size = 64;
        var scale = this.Scale;
        var alpha = 1 - (this.ageInTicks / this.Duration);

		if(this.RENDER_LAYER!=null) 
		{
			ChangeLayer(this.RENDER_LAYER);
			context = ctx;
		}

        Graphic.DrawRotatedImage(context, TextureManager.Get(this.Texture), x, y, size, size, scale, 0, alpha * this.Transparency);

		if(this.RENDER_LAYER!=null) RestoreLayer();

        if(this.ageInTicks >= this.Duration) this.Kill();
	}
}