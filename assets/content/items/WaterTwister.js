class WaterTwister extends ItemSpecial
{
	constructor()
	{
		super();
		
        this.type = TYPE.SPACE_KEY;
        this.restrictTypes = 1;

		this.Texture = "item.water_twister";
		this.name = "ITEM.WATER_TWISTER.NAME";

        this.DMG = 10;
        this.Duration = 10 * Main.FPS;
        this.Cooltime = 15 * Main.FPS;

		this.primary = 
		[
            new ItemBonus(STAT.SUMMON_DAMAGE, this.DMG),
			new ItemBonus(STAT.DURATION, this.Duration),
			new ItemBonus(STAT.COOLTIME, this.Cooltime)
		];

		this.Description ='ITEM.WATER_TWISTER.DESCRIPTION';

        this.lastSummon = -this.Cooltime;


        this.SlowStrength = 30;
        this.SlowDuration = 10;

        this.ARGS = {SLOW_S: this.SlowStrength, SLOW_D: this.SlowDuration};
	}

    canSummon(owner)
    {
        if(this.lastSummon + this.Cooltime > Main.ageInTicks) return false;
        if(!owner.allowControl) return false;
        if(!owner.allowMove) return false;
        if(owner.canInteractWith.length) return false;     //disable flash when player can interact
        if(!Settings.Controls.StateUseItemSkill) return false;

        return true;
    }

    Summon(owner)
    {
        this.lastSummon = Main.ageInTicks;

		var angle = MathHelper.getAngle2([owner.x, owner.y], [Mouse.x + Camera.xView, Mouse.y + Camera.yView]);
		var distance = MathHelper.GetDistance([owner.x - Camera.xView, owner.y- Camera.yView], [Mouse.x, Mouse.y]);
        var target = MathHelper.lineToAngle([owner.x, owner.y], distance, angle);

        var stats = {};
            stats.damage = this.DMG;
            stats.Texture = 'projectile.water_twister.2';
            stats.timeToDespawn = this.Duration;
            stats.SlowDuration = this.SlowDuration;
            stats.SlowStrength = this.SlowStrength;
        
        var bullet = new BulletWaterTwister(owner.x, owner.y, stats);
            bullet.Shoot(owner, target);
            
        World.AddProjectile(bullet);
    }

    getDescription()
    {
        var k = Settings.Controls.UseItemSkill;
        this.ARGS.KEY = (k==' ') ? Lang.Get('KEY.SPACE') : k;
        return super.getDescription();
    }

	onEquipTick(owner)
	{
		if(this.canSummon(owner)) this.Summon(owner);
        if(owner == World.Player) this.UpdateCoolTime(owner);
	}

    UpdateCoolTime(owner)
    {
        var required = this.Cooltime;
		var current = Main.ageInTicks - (this.lastSummon);
		
		owner.UpdateCooltime('ITEM_WATER_TWISTER', current, required);
    }
}
ItemHelper.InitializeItem(WaterTwister);