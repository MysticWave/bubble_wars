class CannonBase extends ItemWeapon
{
	constructor()
	{
		super(true);

		this.Grade = GRADE.NORMAL;
		this.type = TYPE.CANNON;
		
		this.Texture = "item.cannonBase";
		this.name = "Base Cannon";
		this.enchantSlots = 1;
		this.price = 50;

		this.BulletType = 'BulletBubble';


		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 10),
			new ItemBonus(STAT.ATTACK_SPEED, 1),
			new ItemBonus(STAT.ATTACK_RANGE, 450),
		];

		this.ammoCost = 0;
	
		this.Model = new ModelCannonBase('model.item.cannonBase');
	}
}
ItemHelper.InitializeItem(CannonBase);





class Cannon1 extends ItemWeapon
{
	constructor()
	{
		super(true);
		
		this.type = TYPE.CANNON;
		
		this.Texture = "item.bubbleCannon1";
		this.name = "ITEM.CANON.BUBBLE.1.NAME";
		this.enchantSlots = 2;

		this.BulletType = 'BulletBubble';

		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 20),
			new ItemBonus(STAT.ATTACK_SPEED, 1.5),
			new ItemBonus(STAT.ATTACK_RANGE, 500)
		];

		this.ammoCost = 5;
	
		this.Model = new ModelCannonBase('model.item.bubbleCannon1');
	}
}
ItemHelper.InitializeItem(Cannon1);





class Cannon2 extends ItemWeapon
{
	constructor()
	{
		super(true);
		
		this.type = TYPE.CANNON;
		
		this.Texture = "item.bubbleCannon1";
		this.name = "ITEM.CANON.BUBBLE.2.NAME";
		this.enchantSlots = 2;

		this.BulletType = 'BulletBubble';

		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 40),
			new ItemBonus(STAT.ATTACK_SPEED, 1.5),
			new ItemBonus(STAT.ATTACK_RANGE, 550)
		];

		this.ammoCost = 15;
	
		this.Model = new ModelCannonBase('model.item.bubbleCannon1');
	}
}
ItemHelper.InitializeItem(Cannon2);