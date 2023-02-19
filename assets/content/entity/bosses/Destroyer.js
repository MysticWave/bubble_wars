class TheDestroyer extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.DESTROYER.NAME";
        this.BossTheme = "interface.BossFight2";

        this.Textures = 
        {
            back: 'entity.destroyer.back.sprite',
            eyes: 'entity.destroyer.eyes',
            helmet: 'entity.destroyer.helmet'
        };
        this.allowRotationChange = false;

		this.MAXHP = 5000;
		this.HP = this.MAXHP;
		this.AD = 20;
		this.ATTACK_SPEED = .25;
		this.SPD = 700;

		this.ATTACK_RANGE = 1000;
		this.FOLLOW_RANGE = 1000;
		this.BULLET_SPEED = 900;

        this.AI.Apply(new AI_Wander(false, 4, 8, {updateTrigger: function(o){return o.isEnraged}}));
        this.AI.Apply(new AI_AttackMelee(Player, 0, 2));
        this.AI.Apply(new AI_Boss(this));
        this.AI.Apply(new AI_Enrage(this, 50));
        // this.AI.Apply(new AI_HpBracketEvents(this, [new HpBracketEvent(95, ()=>this.OpenShields())]));

        var s = Main.FPS;
        this.AI.Apply(new AI_SpecialAttack(this, {CoolTime: 10*s, PreparationTime: 4*s, Duration: 5*s, Delay: 3*s, updateTrigger: function(o){return o.visible}}));
        this.AI.Apply(new AI_Walk(false));


        this.AI.Apply(new AI_Dash(this, Player, false, 3, 3, {dashMultiplier: 5, dashDuration: 15, updateTrigger: function(o){return !o.isPreparingJump}}));

		this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		}
        this.enragedAnimationDuration = 4 * s;

		this.setScale(3);

        this.Childs = [];
        this.Shields = [];

        this.Positions = [];
        this.eyesAlpha = 1;

        this.knockBackResistance = 1;
        this.Resistance[ELEMENT.PHYSICAL] = true;
        this.Immunity.SLOW = true;
        this.Immunity.STUN = true;

        this.laserIndicatorTime = Main.FPS * .5;
        
        this.specialAttackTimes = 0;
        this.helmetFrames = [5, 3];
        this.helmetFrame = 0;
        this.backFrame = 0;
        this.helmetAnimDuration = (this.helmetFrames[0] * this.helmetFrames[1]) * 4;

        this.LightningData = {RENDER_LAYER: Graphic.Layer.Particle0, GlowColor: '#D80000'};

        this.LootTable = new LootTable([new LootTableItemData('TreasureOrbCelltipede', 100, 1, 1)]);

        this.dashes = 0;
        this.killOnBorderOut = false;

        this.jumpShadowData = 
        {
            baseScale: this.baseScale,
            SPD: this.SPD
        };
	}

    onDashEnd()
    {
        this.dashes++;

        if(this.dashes%4 == 0) 
        {
            this.timeToFall = this.ageInTicks + MathHelper.randomInRange(240, 300);
            this.jumpStart = this.ageInTicks;
            this.isPreparingJump = true;
            this.shadow = new EntityShadow(this.x, this.y, this, this.jumpShadowData);
            this.shadow.AI.Apply(new AI_Follow(World.Player, false));

            World.AddEntity(this.shadow, true);
        }
    }

    onSummon()
    {
        this.CreateParts();
    }

    OpenShields()
    {
        this.NoAI = true;
        this.visible = true;

        for(var i in this.Shields)
        {
            this.Shields[i].Open();

            World.AddParticle(new ParticleLightning(this, this.Shields[i], this.LightningData));
        }

        for(var i in this.Childs)
        {
            this.Childs[i].Open();

            if(i == 0) World.AddParticle(new ParticleLightning(this, this.Childs[i], this.LightningData));
            if(i == 1) World.AddParticle(new ParticleLightning(this.Childs[0], this.Childs[i], this.LightningData));
        }



       this.shootLightningSphere();
    }

    shootLightningSphere()
    {
        var bullets = 40;

        var stats = {};
            stats.spd = 1000;
            stats.damage = this.AD;
            stats.element = ELEMENT.THUNDER;
            stats[STAT.ATTACK_RANGE] = 9999;
            stats.Scale = 1;
            stats.knockBack = 5;
            stats.lightningChain = true;
            stats.isHidden = true;
            stats.Pierce = 999;
            stats.Bounce = 3;
            stats.moveParticle = null;
            stats.noKillParticle = true;

        AI_ShotOnCircle.StaticShoot(this, stats, bullets);

        var projectile_id = 0;
        var data = {...this.LightningData};
            data.segments = 5;
            data.maxVariation = 10;
        for(var i = 0; i < World.Projectiles.length; i++)
        {
            var p = World.Projectiles[i];
            if(p.lightningChain == true)
            {
                if(projectile_id == 0) World.AddParticle(new ParticleLightning(World.Projectiles[i+(bullets-1)], p, data));
                else World.AddParticle(new ParticleLightning(World.Projectiles[i-1], p, data));

                projectile_id++;
            }
        }
    }

    ShieldsReady()
    {
        this.NoAI = false;
    }

    Enrage()
    {
        this.AI.Delete('Dash');
    }

    onEnrageAnimationEnd()
    {
        this.OpenShields();

        this.specialAttackTimes = 0;
        this.AI.SpecialAttack.setCoolTime();

        for(var i in this.Shields)
        {
            this.Shields[i].usingSaws = false;
            this.Shields[i].SawsPreparationProgress = 0;
        }
    }

    CreateParts()
    {
        this.Childs = [];
        this.Shields = [];


        var e, i;
        for(i = 0; i < 2; i++)
        {
            e = new DestroyerShield(this.x, this.y, this);
            e.ID = i;

            this.Shields.push(e);
            World.AddEntity(e);
        }


        for(i = 0; i < 2; i++)
        {
            e = new DestroyerBodyPart(this.x, this.y, this, i);

            this.Childs.push(e);
            World.AddEntity(e, false);
        }
    }

    highJumpUpdate()
    {
        this.isHurtAble = false;
        var fallDuration = 15;

        var destination = World.CenterPoint.y - (World.Radius * 2)
        if(this.y > destination && this.ageInTicks < this.timeToFall)
        {
            this.y -= this.SPD * 4 * Main.DELTA;

            var m = ((this.ageInTicks-this.jumpStart) / 60);
            if(m > 1) m = 1;
            this.shadow.setScale(this.baseScale * (1+m));

            this.shadow.Transparency = .5 - (m * .2);
        }
        
        if(this.ageInTicks == this.timeToFall)
        {
            this.shadow.NoAI = true;
            this.x = this.shadow.x;
            this.fallStep = (this.shadow.y - this.y) / fallDuration;
        }

        if(this.ageInTicks > this.timeToFall)
        {
            this.y += this.fallStep;

            var m = (1-((this.ageInTicks-this.timeToFall) / fallDuration));
            this.shadow.setScale(this.baseScale * (1+m));

            this.shadow.Transparency = .5 - (m * .2);
        }

        if(this.ageInTicks == this.timeToFall+fallDuration)
        {
            this.isPreparingJump = false;
            this.isHurtAble = true;

            this.shadow.Kill();
            this.shadow = null;
            this.onHighJumpEnd();
        }
    }

    onHighJumpEnd()
    {
        // console.log('end');
    }

	Update()
	{
		super.Update();

        if(this.toDashProgress >= 80)
		{
			this.allowMove = false;
			this.isPreparingDash = true;
		}
		else
		{
			this.allowMove = true;
			this.isPreparingDash = false;
		}

        if(this.isPreparingJump) this.highJumpUpdate();

        if(this.lastAttackAnim == 'LASER')
        {
            var frames = this.helmetFrames[0] * this.helmetFrames[1];
            var eyes_alpha_duration = 60;
            var a = this.specialAttackCoolTimeTick / eyes_alpha_duration;
            var p = this.specialAttackCoolTimeTick / this.helmetAnimDuration;
            if(p > 1) 
            {
                p = 1;
                this.lastAttackAnim = null;
            }

            this.eyesAlpha = (a < 1) ? a : 1;
            this.helmetFrame = Math.floor((1-p) * (frames-1));
            this.backFrame = this.helmetFrame;
        }
	}

    specialAttackEnd()
    {
        this.lastAttack = this.getCurrentAttackType();
        this.lastAttackAnim = this.lastAttack

        this.specialAttackTimes++;
        this.allowMove = true;
        this.helmetFrame = 0;
        this.eyesAlpha = 1;
        this.backFrame = 0;
    }

    getCurrentAttackType()
    {
        return 'LASER';
        var time = this.specialAttackTimes;
        var attacks = 2;

        if(this.isEnraged)
        {
            attacks++;

            if(time%attacks == 0) return 'LASER';
            if(time%attacks == 1) return 'SAWS';
            if(time%attacks == 2) return 'OBSTACLES';
        }

        if(time%attacks == 0) return 'SAWS';
        if(time%attacks == 1) return 'SAWS';
    }

    specialAttackPreparationUpdate()
    {
        if(this.getCurrentAttackType() == 'SAWS') 
        {
            this.allowMove = false;
            for(var i in this.Shields)
                this.Shields[i].PrepareSaws(this.specialAttackPreparationProgress);
        }

        if(this.getCurrentAttackType() == 'LASER') 
        {
            var eyes_alpha_duration = 60;
            var a = this.specialAttackPreparationTick / eyes_alpha_duration;
            this.eyesAlpha = (a < 1) ? (1-a) : 0;

            if(a >= 1)
            {
                var frames = this.helmetFrames[0] * this.helmetFrames[1];
                var p = (this.specialAttackPreparationTick-eyes_alpha_duration) / this.helmetAnimDuration;
                if(p > 1) 
                {
                    var f = (this.specialAttackPreparationTick-eyes_alpha_duration-this.helmetAnimDuration) / (this.helmetAnimDuration * 2);
                    if(f > 1) f = 1;
                    this.backFrame = Math.floor(f* (frames-1));
                    p = 1;
                }
                this.helmetFrame = Math.floor(p * (frames-1));
            }


            if(this.specialAttackPreparationTick + this.laserIndicatorTime == this.AI.SpecialAttack.PreparationTime) this.showLaserIndicator();

            var angle = MathHelper.getAngle2(World.Player, this)-90;
            this.Rotation = angle%360;
        }
    }

    specialAttackUpdate()
    {
        this.allowMove = false;
        if(this.getCurrentAttackType() == 'SAWS') 
        {
            for(var i in this.Shields)
                this.Shields[i].UpdateSaws(this.specialAttackProgress);
        }

        if(this.getCurrentAttackType() == 'LASER') this.specialAttackLaser();
    }


    getLaserStats()
    {
        var stats = {};
            stats.damage = this.AD;
            stats.Pierce = 999;
            stats.Type = 'BulletLaserBeam';
            stats.Textures = 
            {
                start: 'projectile.laser.destroyer.start',
                mid: 'projectile.laser.destroyer.mid',
                end: 'projectile.laser.destroyer.end'
            };
            stats.laserDuration = 5 * Main.FPS;
            stats.element = ELEMENT.FIRE;
            stats.size = 100;
            // stats.visibleSizeTransition = false;
            stats.allowSelfRotationChange = false;
            stats.rotationSpeed = 30;
            stats.hurtDelay = 15;
            stats.hurtEntities = true;
            stats.RENDER_LAYER = Graphic.Layer.LightLevel2;

        return stats;
    }

    specialAttackLaser()
    {
        var angle = MathHelper.getAngle2(World.Player, this)-90;
        this.Rotation = angle%360;

        if(this.specialAttackTick == 1)
        {
            var bullets = 1;
            var stats = this.getLaserStats();

            AI_ShotOnCircle.StaticShoot(this, stats, bullets, {angle: angle});
        }
    }

    showLaserIndicator()
    {
        var angle = MathHelper.getAngle2(World.Player, this)-90;
        this.Rotation = angle%360;

        var stats = this.getLaserStats();
            stats.laserDuration = this.laserIndicatorTime * 1.2;
            stats.size = 10;
            stats.damage = 0;
            stats.Transparency = .5;
            stats.rotationSpeed = 180;

        AI_ShotOnCircle.StaticShoot(this, stats, 1, {angle: angle});
    }

    RenderTexture(context)
	{
        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;

        var width = this.width;
        var height = this.height;
        var rotation = 0;

        var alpha = (this.visible) ? this.Transparency : 0;
        

        Graphic.DrawRotatedAnimatedImage(context, this.backFrame, this.helmetFrames, 'XY', 
            TextureManager.Get(this.Textures.back), x, y, width, height, this.Scale, rotation, alpha
        );

        Graphic.DrawRotatedAnimatedImage(context, 0, 1, 'Y', 
            TextureManager.Get(this.Textures.eyes), x, y, width, height, this.Scale, rotation, this.eyesAlpha * alpha
        );

        Graphic.DrawRotatedAnimatedImage(context, this.helmetFrame, this.helmetFrames, 'XY', 
            TextureManager.Get(this.Textures.helmet), x, y, width, height, this.Scale, rotation, alpha
        );
	}
}
World.RegisterEntity(TheDestroyer);







class DestroyerShield extends Entity
{
	constructor(x, y, owner)
	{
		super(x, y);
		this.Owner = owner;
        this.ID = 0;
		
		this.name = "ENTITY.DESTROYER.SHIELD";
		this.Texture = 'entity.destroyer.shield';

		this.MAXHP = 1;
		this.HP = this.MAXHP;
		
		this.HitBox.Scale = .8;

		this.knockBackResistance = 1;

		this.Immunity.ALL = true;
		this.hideOnRadar = true;
        this.blockPierce = true;

        this.Frames = [1, 1];

        this.translate = {x: 0, y: 0};

        this.OpeningDuration = 5 * Main.FPS;
        this.isOpening = false;
        this.openAnimationStart = 0;
        this.isOpen = false;
        this.OpenTranslate = {x: -45, y: 15};
        this.OpenTranslate1 = {x: 45, y: 15};

        this.SawScale = 1.5;
        this.killOnBorderOut = false;
	}

    PrepareSaws(p)
    {
        this.SawsPreparationProgress = p;
    }

    UpdateSaws(p)
    {
        this.SawsAttackProgress = p;
        this.usingSaws = true;

        var delay = 3;
        if(this.ageInTicks%delay == 0)
        {
            var bullets = 1;
            var angle = this.Rotation;
            if(this.ID == 0) angle += 180;

            var stats = {};
                stats.spd = 1000;
                stats.Scale = this.SawScale;
                stats.damage = 10;
                stats.knockBack = 0;
                stats.Type = 'BulletSaw';

            AI_ShotOnCircle.StaticShoot(this, stats, bullets, {angle: angle});
        }

        if(p >= 1)
        {
            this.SawsPreparationProgress = 0;
            this.usingSaws = false;
            this.Rotation = 0;
        }
    }

	Update()
	{
        var s = this.Owner.baseScale;
        var tX = (this.width/8.1) * this.Scale * ((this.ID == 0) ? -1 : 1);

        if(!this.usingSaws)
        {
            this.x = this.Owner.x + (this.translate.x * s);
            this.y = this.Owner.y + (this.translate.y * s);
            this.Scale = this.Owner.Scale * 1.2;

            this.x += tX
        }
        else
        {
            var r = tX + this.translate.x * s;
            var rotation = (this.SawsAttackProgress * 360 * 3);
            this.Rotation = rotation;

            var end = MathHelper.lineToAngle([this.Owner.x, this.Owner.y], r, rotation);
            this.x = end.x;
            this.y = end.y;
        }

		super.Update();
        if(this.isOpening) this.OpenAnimationUpdate();
        this.isHurtAble = this.isOpen;

		if(!this.Owner.isAlive) this.Kill();
	}


	Hurt(damage, source)
	{
        if(source == this.Owner) return;

		if(Settings.General.ShowDamageDealt)
		{
			DamageIndicator.AddObject(this.x, this.y, Lang.Get('TEXT.BLOCK'), "DEALT", null);
		}
	}

    Open()
    {
        if(this.isOpen) return;
        this.isOpening = true;
        this.openAnimationStart = this.ageInTicks;
    }

    OpenAnimationUpdate()
    {
        var p = (this.ageInTicks - this.openAnimationStart) / this.OpeningDuration;
        if(p >= 1)
        {
            this.translate = (this.ID == 0) ? this.OpenTranslate : this.OpenTranslate1;
            this.isOpening = false;
            this.isOpen = true;
            this.Owner.ShieldsReady();
            return;
        }

        var t = (this.ID == 0) ? this.OpenTranslate : this.OpenTranslate1;

        var startAnimY = .75;
        var animYp = (p - startAnimY) * 4;
        if(animYp < 0) animYp = 0;

        this.translate.x = t.x * p;
        this.translate.y = t.y * animYp;
    }

    RenderTexture(context)
	{
        this.Scale = this.Owner.Scale * 1.2;

        var texture = TextureManager.Get(this.Texture);
        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;

        var width = this.width/2;
        var height = this.height;
        var rotation = this.Rotation;
        var tX = width/4;

        var alpha = this.Owner.Transparency;
       
        var frame = 0;

        var data = {clipWidth: -texture.width/2};
        if(this.ID == 1) 
        {
            data.startX = data.clipWidth * -1;
            tX *= -1;
        }



        if(this.SawsPreparationProgress && !this.usingSaws) 
        {
            var p = this.SawsPreparationProgress + .25;
            if(p > 1) p = 1;
            var sawTx = width * 1.5 * p;
            if(this.ID == 1) sawTx *= -1;
            Graphic.DrawRotatedImage(context, TextureManager.Get('projectile.saw'), x, y, 64, 64, this.SawScale, 0, 1, sawTx);
        }
        

		Graphic.DrawRotatedAnimatedImage(context, frame, this.Frames, 'XY', 
            texture, x, y, width, height, this.Scale, rotation, alpha, tX, 0, null, data
        );  
	}
}
World.RegisterEntity(DestroyerShield);







class DestroyerBodyPart extends Entity
{
	constructor(x, y, owner, id = 0)
	{
		super(x, y);
		this.Owner = owner;
        this.ID = id;
		
		this.name = "ENTITY.DESTROYER.PART";
		this.Texture = 'entity.destroyer.shield';

		this.MAXHP = 1;
		this.HP = this.MAXHP;
		
		this.HitBox.Scale = .8;

		this.knockBackResistance = 1;

		this.Immunity.ALL = true;
		this.hideOnRadar = true;

        this.Frames = [1, 1];
        this.isHurtAble = false;

        this.translate = {x: 0, y: 0};

        this.OpeningDuration = 5 * Main.FPS;
        this.isOpening = false;
        this.openAnimationStart = 0;
        this.isOpen = false;
        this.OpenTranslate = {x: 0, y: 45};
        this.OpenTranslate1 = {x: 0, y: 70};

        this.killOnBorderOut = false;

        this.transitionX =  new Transition(-2, 2, .5, true, 0.02, 0.02);
        if(id == 1) this.transitionX =  new Transition(5, -5, .5, true, 0.02, 0.02);
	}


	Update()
	{
        var s = this.Owner.baseScale;

		this.x = this.Owner.x + (this.transitionX.Update() * s);
		this.y = this.Owner.y + (this.translate.y * s);

		super.Update();
        if(this.isOpening) this.OpenAnimationUpdate();
        

		if(!this.Owner.isAlive) this.Kill();
	}

    Open()
    {
        if(this.isOpen) return;
        this.isOpening = true;
        this.openAnimationStart = this.ageInTicks;
    }

    OpenAnimationUpdate()
    {
        var p = (this.ageInTicks - this.openAnimationStart) / this.OpeningDuration;
        if(p >= 1)
        {
            this.translate = (this.ID == 0) ? this.OpenTranslate : this.OpenTranslate1;
            this.isOpening = false;
            this.isOpen = true;
            return;
        }

        var t = (this.ID == 0) ? this.OpenTranslate : this.OpenTranslate1;

        this.translate.y = t.y * p;
    }

    RenderTexture(context)
	{
        this.Scale = this.Owner.Scale * ((this.ID == 0) ? .6 : .3);

        var texture = TextureManager.Get(this.Texture);
        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;

        var width = this.width;
        var height = this.height;
        var rotation = 0;

        var alpha = (this.Owner.visible) ? this.Owner.Transparency : 0;
       
        var frame = 0;

		Graphic.DrawRotatedAnimatedImage(context, frame, this.Frames, 'XY', 
            texture, x, y, width, height, this.Scale, rotation, alpha
        );
	}
}
World.RegisterEntity(DestroyerBodyPart);



