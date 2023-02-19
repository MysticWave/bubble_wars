class PowerUpStone1 extends Item
{
	constructor()
	{
		super();

		this.type = TYPE.UPGRADE;

		this.upgradeChance = 10;			//dodatkowa szansa na ulepszenie
		this.degradeOnFail = true;			//cofa poziom przedmiotu przy niepowodzeniu
		this.Grade = GRADE.RARE;
		this.shineStrength = 0.5;
		
		this.Texture = "powerUpStone1";
		this.name = "Power-Up Stone";

	}
}
ItemHelper.InitializeItem(PowerUpStone1);