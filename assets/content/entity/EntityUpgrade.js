class EntityUpgrade extends Entity
{
	constructor(x, y, upgrade)
	{
		super();
		this.x = x;
		this.y = y;
		this.isHurtAble = false;
		this.Texture = "golden_bubble";
		
		this.width = 45;
		this.height = 45;
		
		this.upgrade = upgrade;
		this.SPD = 350;
		this.FOLLOW_RANGE = 150;
		
		this.AI.Apply(new AI_Follow(World.Player));
		this.AI.Apply(new AI_Walk());
		
		this.onPlayerCollision = function(player){this.Collect(player)};
	}
	
	Collect(player)
	{
		if(this.upgrade >= 0)
		{
			player.Upgrades[this.upgrade].Active(player);
		}		
		this.Kill();
	}
}
World.RegisterEntity(EntityUpgrade);