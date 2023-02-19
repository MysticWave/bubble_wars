class BulletVirtuoso extends ProjectileLaserBeam
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

        this.size = 50;

        this.Textures = 
		{
			start: 'projectile.laser.virtuoso.start',
			mid: 'projectile.laser.virtuoso.mid',
			end: 'projectile.laser.virtuoso.end'
		};

        this.visibleSizeTransition = false;

        this.laserAlphaTransition = new Transition(0, 1, 0.05, true, 0, 0);
	}

    Update()
	{
        this.gotMP = false;
		super.Update();
    }

    onEntityCollision(entity)
    {
        super.onEntityCollision(entity);

        if(this.Item && entity.isHurtAble && !this.gotMP) //cannot load stacks if enemy didnt take damage
        {
            this.gotMP = true;
            this.Item.currentMP++;
            if(this.Item.currentMP > this.Item.requiredMP) this.Item.currentMP = 0;
            // this.Item.Owner.specialAttackGauge = this.Item.currentMP / this.Item.requiredMP;
        }

        // if(!entity.isAlive) console.log('dead')
    }
}
Projectile.Types(BulletVirtuoso);