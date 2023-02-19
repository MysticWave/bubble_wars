class BulletBubbleEnemy extends BulletBubble
{
	constructor(x, y, stats)
	{
		super(x, y, stats);

		this.Texture = 'bullet.bubble.enemy';

		this.setStats(stats);
	}
}
Projectile.Types(BulletBubbleEnemy);