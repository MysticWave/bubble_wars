class BulletFrostBall extends Projectile
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.width = 20;
		this.height = 20;

		this.Texture = "projectile.frost_ball";
		this.moveParticle = null;
        this.element = ELEMENT.ICE;
        this.Pierce = 999;
	}
    
    Update()
    {
        super.Update();

        if(this.ageInTicks%10 == 0)
        {
            var bullets = this.bullets ?? 3;
            var startAngle = MathHelper.randomInRange(0, 360);
            for(var i = 0; i < bullets; i++)
            {
                var angle = startAngle + ((360/bullets) * i);
                var dest = MathHelper.lineToAngle(this, 9999, angle);
                var motion = Motion.Get(this, dest, 60);

                var data = {};
                    data.moveX = motion.x;
                    data.moveY = motion.y;
                    data.Rotation = angle+90;
                    data.Scale = this.Scale * .75;
                    data.element = this.element;
                    data.SlowStrength = this.SlowStrength ?? 25;
                    data.SlowDuration = this.SlowDuration ?? 10;

                World.AddProjectile(new ExplosionIcicle(this.x, this.y, this.source, this.damage, 20, 2, data));
            }
        }
    }
}
Projectile.Types(BulletFrostBall);