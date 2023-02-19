class PowerUpStone0 extends Item
{
	constructor()
	{
		super();

		this.type = TYPE.UPGRADE;

		this.upgradeChance = 0;			//dodatkowa szansa na ulepszenie
		this.degradeOnFail = true;			//cofa poziom przedmiotu przy niepowodzeniu
		
		this.Texture = "powerUpStone0";
		this.name = "Power-Up Stone";

	}
}
ItemHelper.InitializeItem(PowerUpStone0);