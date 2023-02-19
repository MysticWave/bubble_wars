class PowerUpStone2 extends Item
{
	constructor()
	{
		super();

		this.type = TYPE.UPGRADE;

		this.upgradeChance = 30;			//dodatkowa szansa na ulepszenie
		this.degradeOnFail = true;			//cofa poziom przedmiotu przy niepowodzeniu
		this.Grade = GRADE.MYSTICAL;
		this.shineStrength = 0.7;
		
		this.Texture = "powerUpStone2";
		this.name = "Power-Up Stone";
	}
}
ItemHelper.InitializeItem(PowerUpStone2);