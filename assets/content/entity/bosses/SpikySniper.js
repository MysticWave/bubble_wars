class SpikySniper extends EntityTurret
{
	constructor(x, y)
	{
		super(x, y);
		
		this.level = 10;
		this.name = "Spiky Sniper";
		this.Scale = 10;
		this.MAXHP = 2000;
		this.HP = 2000;
		this.oxygen = 300;
		this.AD = 20;
		this.ATTACK_RANGE = 2000;
		this.BULLET_SPEED = 400;
		this.BULLETS_COUNT = 3;
		this.BULLET_SERIES = 1;
		this.rangeFromCenter = 0;
		
		this.bulletStats.Scale = 3.5;
		
		this.AI.Apply(new AI_ShotOnCircle
		(
			{
				shotCount: 16,
				shotDelayMin: 1,
				shotDelayMax: 3
			}, 
			{	
				Type: "BulletSpike",
				damage: 30, 
				Scale: 2,
				spd: 600
			}
		));
		this.AI.Apply(new AI_Boss(this));

		this.BossTheme = "interface.BossFight1";
	}

	Update()
	{
		super.Update();

		if(this.HP < this.MAXHP / 2)
		{
			this.AI.ShotOnCircle.shotDelayMax = 1;
			this.AI.ShotOnCircle.shotDelayMin = 0.5;
			this.BULLET_SPEED = 600;
			this.ATTACK_SPEED = 6;
		}
	}
}
World.RegisterEntity(SpikySniper);