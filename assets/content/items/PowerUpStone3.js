class PowerUpStone3 extends Item
{
	constructor()
	{
		super();

		this.type = TYPE.UPGRADE;

		this.upgradeChance = 50;			//dodatkowa szansa na ulepszenie
		this.degradeOnFail = true;			//cofa poziom przedmiotu przy niepowodzeniu
		this.Grade = GRADE.LEGENDARY;
		this.shineStrength = 1;
		
		this.Texture = "powerUpStone3";
		this.name = "Power-Up Stone";
	}
}
ItemHelper.InitializeItem(PowerUpStone3);