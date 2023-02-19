class BulletBambooStick extends BulletBoomerang
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.rotationSpeed = -360 * 3;

        this.Texture = 'projectile.bamboo_stick';
        // this.Texture = 'item.bamboo_stick';

        this.Hits = 10;
        this.knockBack = .5;
        this.knockOnPierce = true;
	}


    onEntityCollision(entity)
    {
        super.onEntityCollision(entity);

        if(!this.isCharged) return;

        var owner = World.Player;
        if(owner.stats.HP < owner.stats.MAXHP)
        {
            owner.stats.HP++;
            DamageIndicator.AddObject(owner.x, owner.y, 1, "HEAL");
        }
    }
}
Projectile.Types(BulletBambooStick);