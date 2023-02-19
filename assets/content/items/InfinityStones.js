class InfinityStoneOfSpace extends ItemSpecial
{
	constructor()
	{
		super();
		
        this.type = TYPE.F_KEY_MOVEMENT;
        this.restrictTypes = 1;

		this.Texture = "item.infinity_stone.space";
		this.name = "ITEM.INFINITY_STONE.SPACE.NAME";

		this.primary = 
		[
            new ItemBonus(STAT.ATTACK_DAMAGE, 20, true),
            new ItemBonus(STAT.MAX_HP, 20),
			new ItemBonus(STAT.MOVEMENT_SPEED, 20)
		];

        this.enchantAble = false;
        this.Grade = GRADE.ANGELIC;
        this.showGrade = false;

        this.canBeSold = false;
        this.isUnique = true;
		
		this.Range = 400;

		// this.Lore ='Press [F] to teleport toward cursor.';
		this.Description ='ITEM.INFINITY_STONE.SPACE.DESCRIPTION';
		this.Lore ='ITEM.INFINITY_STONE.SPACE.LORE';

		this.quickFlashCooltime = 5 * Main.FPS;
		this.quickFlashTick = 0;

        this.ARGS = {CD: this.quickFlashCooltime/Main.FPS, R: this.Range};
	}

    getDescription()
    {
        var k = Settings.Controls.UseItem;
        this.ARGS.KEY = (k==' ') ? Lang.Get('KEY.SPACE') : k;
        return super.getDescription();
    }

	onTakeOut()
	{
		World.Player.canFastTravel = false;
	}

    canQuickFlash(owner)
    {
        if(this.quickFlashTick + this.quickFlashCooltime > Main.ageInTicks) return false;
        if(!owner.allowControl) return false;
        if(!owner.allowMove) return false;
        if(owner.canInteractWith.length) return false;     //disable flash when player can interact
        if(!Settings.Controls.StateUseItem) return false;

        return true;
    }


    QuickFlash(owner)
	{
        var r = this.Range;

		var dist = MathHelper.GetDistance([owner.x - Camera.xView, owner.y - Camera.yView], [Mouse.x, Mouse.y]);
		if(dist < r) r = dist;
		var angle = MathHelper.getAngle2([owner.x - Camera.xView, owner.y - Camera.yView], [Mouse.x, Mouse.y]);
		var new_pos = MathHelper.lineToAngle([owner.x, owner.y], r, angle);
		
        var dist_from_center = MathHelper.GetDistance(new_pos, World.CenterPoint);
        var R = World.Radius;


        //destination is outside room
        if(dist_from_center > R)
        {            
            new_pos = MathHelper.GetIntersectionWithCircle([owner.x, owner.y], angle, World.CenterPoint, R);
        }

        

        // Graphic.addPostRenderFunction(Graphic.Layer.GUI, 
        //     () =>
        //     {
        //         ChangeLayer(Graphic.Layer.GUI);

        //         ctx.save();
        //         ctx.beginPath();

        //         ctx.moveTo(owner.x - Camera.xView, owner.y - Camera.yView);
        //         ctx.lineTo(new_pos.x - Camera.xView, new_pos.y - Camera.yView);
        //         ctx.lineWidth = 5;
        //         ctx.stroke();

        //         ctx.closePath();
        //         ctx.restore();

        //         ctx.save();
        //         ctx.fillStyle = 'violet';
        //         ctx.fillRect(new_pos.x - 2 - Camera.xView, new_pos.y - 2 - Camera.yView, 4, 4);
        //         ctx.save();

        //         RestoreLayer();
        //     }
        // )
        // return;


        // World.AddParticle(new Particle("vfx.tp", owner.x + (owner.Width / 2),  owner.y + (owner.Height / 2), 12, owner.Width, owner.Height, owner.Scale * 3));
        World.AddParticle(new ParticleFlash(owner.x,  owner.y, {Scale: owner.Scale}));
        World.AddParticle(new ParticleFlash(new_pos.x,  new_pos.y, {Scale: owner.Scale, Type: 1}));


        

        Camera.Smooth(new_pos.x, new_pos.y, .5);
		owner.x = new_pos.x;
		owner.y = new_pos.y;
        if(owner.canInterruptRecall) owner.isRecalling = false;  //allows to interrupt recall

		this.quickFlashTick = Main.ageInTicks;
	}

	onEquipTick(owner)
	{
		if(this.canQuickFlash(owner)) this.QuickFlash(owner);
        this.UpdateCoolTimeIcon(owner);
        owner.canFastTravel = true;
	}

    UpdateCoolTimeIcon(owner)
    {
        var required = this.quickFlashCooltime;
		var current = Main.ageInTicks - this.quickFlashTick;
		
		owner.UpdateCooltime('FLASH', current, required);
    }
}
ItemHelper.InitializeItem(InfinityStoneOfSpace);