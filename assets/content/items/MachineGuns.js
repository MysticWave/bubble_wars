class MachineGunBase extends ItemWeapon
{
	constructor()
	{
		super(true);

		this.Grade = GRADE.NORMAL;
		this.type = TYPE.CANNON;
		
		this.Texture = "item.machine_gun.1";
		this.name = "ITEM.MACHINE_GUN.BASE.NAME";
		this.enchantSlots = 2;
        this.knockBack = .1;
		this.BulletType = 'BulletBubble';


		this.primary = 
		[
			new ItemBonus(STAT.ATTACK_DAMAGE, 5),
			new ItemBonus(STAT.ATTACK_SPEED, 6),
			new ItemBonus(STAT.ATTACK_RANGE, 450)
		];

		this.ammoCost = 5;
	
		this.Model = new ModelMachineGun('model.item.machine.gun');
	}
}
ItemHelper.InitializeItem(MachineGunBase);