class Celltipede extends Entity
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = "ENTITY.CELLTIPEDE.NAME";
        this.BossTheme = "interface.BossFight2";

        this.Textures = 
        {
            base: 'entity.celltipede.head',
            fang_left: 'entity.celltipede.fang.left',
            fang_right: 'entity.celltipede.fang.right',

            head_add_left: 'entity.celltipede.head.left',
            head_add_right: 'entity.celltipede.head.right',
        };
        this.Rotation = 180;

		this.MAXHP = 3000;
		this.HP = this.MAXHP;
		this.AD = 20;
		this.ATTACK_SPEED = .25;
		this.SPD = 1500;

		this.ATTACK_RANGE = 1000;
		this.FOLLOW_RANGE = 1000;
		this.BULLET_SPEED = 900;

		this.AI.Apply(new AI_Walk(false));
        this.AI.Apply(new AI_AttackMelee(Player, 0, 3));
        this.AI.Apply(new AI_Boss(this));
        this.AI.Apply(new AI_Enrage(this, 50, {showAnimation: false, invincibleOnRage: false}));
        this.AI.Apply(new AI_Bounce(this, 0, function(owner){return MathHelper.getAngle2(owner, World.Player)}, World.Player));

		this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		}
        this.enragedAnimationDuration = 0;

		this.LootTable = new LootTable([]);

		this.setScale(2.5);
        this.headScale = 1.2;
        this.headAddsScale = this.headScale * 1.1;

        this.Childs = [];

        this.segments = 40;
        this.segmentsDistance = this.width * .75;
        this.partBody = EntityCelltipedePart;
        this.partTail = EntityCelltipedeTail;

        this.movementChange = 0;
        this.Positions = [];
        this.Destination = {};

        this.Resistance[ELEMENT.PHYSICAL] = true;
        this.Immunity.SLOW = true;
        this.Immunity.STUN = true;
        
        this.LootTable = new LootTable([new LootTableItemData('TreasureOrbCelltipede', 100, 1, 1)]);
        
        this.setLegsAnimation();
	}

    onSummon()
    {
        this.CreateParts();
        this.setLegsAnimation();
    }

    setLegsAnimation()
    {
        this.legsAnimDuration = (150 / this.SPD) * .5;
        this.legsAnimation = new Transition(-10, 10, this.legsAnimDuration, true, 0, 0, false);

        for(var i in this.Childs)
        {
            var c = this.Childs[i];
            c.legsAnimation = new Transition(-30, 30, this.legsAnimDuration, true, 0, 0, false);
        }
    }

    Enrage()
    {
        this.SPD *= 1.5;

        ApplyEffect(this, 'Invincibility', 1, 4);
        for(var i in this.Childs)
        {
            var c = this.Childs[i];
            ApplyEffect(c, 'Invincibility', 1, 4);
        }

        //podczas animacji stopniowo zwiekszac spd, poprzez obliczanie nowego moveX/y za pomoca this.Destination
    }

    GetDelay()
    {
        var size = this.segmentsDistance * this.baseScale;
        var delay = Math.floor(size / (this.SPD*Main.DELTA));

        return delay;
    }

    CreateParts()
    {
        this.Childs = [];

        var delay = this.GetDelay();
        var lastPart = this;
        var e;
        for(var i = 0; i < this.segments; i++)
        {
            e = new this.partBody(this.x, this.y, lastPart, this);
            if(i==this.segments-1)e = new this.partTail(this.x, this.y, lastPart, this);

            e.MAXHP = this.MAXHP / this.segments;
            e.HP = e.MAXHP;
            e.AD = this.AD;
            e.isHurtAble = false;
            e.movementDelay = (i+1) * delay;
            e.NoAI = true;
            e.num = i;
            e.Immunity = this.Immunity;

            this.Childs.push(e);
            lastPart = e;
            World.AddEntity(e);
        }
    }

    onBounce()
    {
        if(this.isEnraged)
        {
            var stats = {};
                stats.spd = 1500;
                stats.damage = 0;
                stats[STAT.ATTACK_RANGE] = 9999;
                stats.Scale = 2;
                stats.knockBack = 10;
                stats.noKillParticle = true;
                stats.moveParticle = null;

            AI_ShotOnCircle.StaticShoot(this, stats, 32);
        }
    }

    onBossAnimationEnd()
    {
        var delay = this.GetDelay();
        for(var i = 0; i < this.Childs.length; i++)
        {
            var c = this.Childs[i];
            c.isHurtAble = true;
            c.NoAI = false;
            c.showTick = this.ageInTicks + c.movementDelay - delay;

            this.highestDelay = c.movementDelay;
        }
    }

    UpdateHP()
    {
        if(!this.isHurtAble || this.Childs.length == 0) return;
        this.HP = 0;
        for(var i in this.Childs)
        {
            var c = this.Childs[i];
            if(!c.isAlive) continue;
            this.HP += c.HP;
        }
    }

    UpdatePositionsArray()
    {
        this.Positions.unshift([this.x, this.y]);

        //slice array when its too big
        if(this.Positions.length / this.highestDelay >= 2)
        {
            this.Positions = this.Positions.slice(0, this.highestDelay);
        }
    }

	Update()
	{
        this.UpdateHP();

        this.UpdatePositionsArray();
		super.Update();
	}


    RenderTexture(context)
	{
        var base = TextureManager.Get(this.Textures.base);
        var fang_left = TextureManager.Get(this.Textures.fang_left);
        var fang_right = TextureManager.Get(this.Textures.fang_right);
        var head_add_left = TextureManager.Get(this.Textures.head_add_left);
        var head_add_right = TextureManager.Get(this.Textures.head_add_right);


        var ratio = this.width / 512;
        var fang_length = 210 * ratio;
        var fangs = {width: 80, height: 160, angles: [-143, -217], tY: 10 * ratio, textureSpaceY: 3 * ratio};
        var head = {width: 250, height: 512, angles: [-173, -187], tY: 10 * ratio, textureSpaceY: 3 * ratio, tX: 90 * ratio};


        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;
        var width = this.width;
        var height = this.height;
        var rotation = this.Rotation - 180;
        var alpha = this.Transparency;
        var scale = this.Scale * this.headScale;

        var legAnim = this.legsAnimation.Update();

        //render base
        Graphic.DrawRotatedImage(context, base, x, y, width, height, scale, rotation, alpha);


        //render fangs
        for(var i = 0; i < 2; i++)
		{
            var texture = fang_left;
            var rotAnimDir = -1;
            if(i == 1) 
            {
                texture = fang_right;
                rotAnimDir = 1;
            }

            var angle = 180 + fangs.angles[i];

            var endPoints = [
                x,
                y + fang_length * scale * .95
            ];
            var pos = MathHelper.RotatePoint([x, y], rotation + angle, endPoints);

            var f_width = fangs.width * ratio;
            var f_height = fangs.height * ratio;

			context.save();
			context.translate(pos.x, pos.y);
			context.rotate((rotation + legAnim * rotAnimDir) * Math.PI/180);
			context.globalAlpha = alpha;
			context.drawImage(
				texture, 0, 0, texture.width, texture.height,
				-((f_width / 2)) * scale, -(fangs.tY + fangs.textureSpaceY) * scale,
				(f_width * scale), (f_height * scale)
			);
			context.restore();
		}



        //render head adds
        for(var i = 0; i < 2; i++)
		{
            var texture = head_add_left;
            var rotAnimDir = -1;
            if(i == 1) 
            {
                texture = head_add_right;
                rotAnimDir = 1;
            }

            var angle = 180 + head.angles[i];
            var s = scale * this.headAddsScale;

            var endPoints = [
                x,
                y + fang_length * scale * .95
            ];
            var pos = MathHelper.RotatePoint([x, y], rotation + angle, endPoints);

            var f_width = head.width * ratio;
            var f_height = head.height * ratio;

			context.save();
			context.translate(pos.x, pos.y);
			context.rotate(rotation * Math.PI/180);
			context.globalAlpha = alpha;
			context.drawImage(
				texture, 0, 0, texture.width, texture.height,
				-((f_width / 2)-rotAnimDir * head.tX) * s, -(head.tY + head.textureSpaceY) * s,
				(f_width * s), (f_height * s)
			);
			context.restore();
		}
	}
}
World.RegisterEntity(Celltipede);





class EntityCelltipedePart extends Entity
{
	constructor(x, y, parent, owner)
	{
		super(x, y);
        this.Textures = 
        {
            base: 'bullet.bubble.base',
            leg_left: 'entity.celltipede.leg.left',
            leg_right: 'entity.celltipede.leg.right'
        };

		this.AI.Apply(new AI_Walk());
        this.AI.Apply(new AI_AttackMelee(Player, 0, 1));

		this.RenderTransitions =
		{
			Scale: new Transition(1, 0.95, 0.25, true, 0.02, 0.02)
		};

		this.LootTable = new LootTable([]);

		this.setScale(1);

        this.parent = parent;
        this.shareHP = true;
        // this.showHpBar = false;
        this.Owner = owner;

        this.SPD = this.Owner.SPD;
        this.isMainPart = false;

        this.movementChange = 0;
        this.movementDelay = 0;
        this.hideOnRadar = true;

        this.showDuration = .5;
        this.showTick = 999999;
	}

    onParentDeath()
    {
        this.isMainPart = true;
        this.moveX = 0;
        this.moveY = 0;

        this.getMovement = this.Owner.getMovement;
    }

    onCollision()
    {
        var time = this.ageInTicks-this.movementChange;
        if(time < 5) return;
        this.moveX = 0;
        this.moveY = 0;
    }

    getMovement()
    {
        var target = this.parent;

        var motion = Motion.Get([this.x, this.y], [target.x, target.y], this.SPD);
		this.Rotation = motion.angle + 90 + this.defaultRotation;

        this.moveX = motion.x;
        this.moveY = motion.y;

        this.movementChange = this.ageInTicks;
    }

    Update()
    {
        if(!this.Owner.isAlive) 
        {
            this.Kill();
            return;
        }

        if(!this.parent || !this.parent.isAlive)
        {
            this.onParentDeath();
        }

        // if(!this.moveX && !this.moveY && !this.NoAI && (this.ageInTicks >= this.movementDelay)) this.getMovement();
        var pos = this.Owner.Positions;
        if(pos.length > this.movementDelay)
        {
            var new_x = pos[this.movementDelay][0];
            var new_y = pos[this.movementDelay][1];

            this.Rotation = MathHelper.getAngle2(this, [new_x, new_y])-90;
            this.x = new_x;
            this.y = new_y;
        }


        if(this.ageInTicks >= this.showTick)
        {
            var p = (this.ageInTicks-this.showTick) / (this.showDuration*Main.FPS);
            if(p<=1)
            {
                this.setScale(this.Owner.baseScale * p);
                this.Transparency = p;
            }
        }
        else
        {
            this.setScale(0);
            this.Transparency = 0;
        }

        super.Update();
    }

    onKill()
    {
        this.Transparency = .25;
        this.AI.Delete('AttackMelee');
        this.isAlive = this.Owner.isAlive;
        this.showHpBar = false;
    }




    RenderTexture(context)
	{
        var base = TextureManager.Get(this.Textures.base);
        var leg_left = TextureManager.Get(this.Textures.leg_left);
        var leg_right = TextureManager.Get(this.Textures.leg_right);

        var self_dir = (this.num%2==0) ? 1 : -1;

        var ratio = this.width / 512;
        
        var legs = {width: 340, height: 145, angles: [-90, 90], tY: 80 * ratio, tX: 30 * ratio};

        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;
        var width = this.width;
        var height = this.height;
        var rotation = this.Rotation - 180;
        var alpha = this.Transparency;
        var scale = this.Scale;

        var legs_length = width/2;

        var legAnim = this.legsAnimation.Update();

        //render base
        Graphic.DrawRotatedImage(context, base, x, y, width, height, scale, 0, alpha);


        //render legs
        for(var i = 0; i < 2; i++)
		{
            var texture = leg_left;
            var rotAnimDir = -1;
            if(i == 1) 
            {
                texture = leg_right;
                rotAnimDir = 1;
            }

            var angle = 180 + legs.angles[i];

            var endPoints = [
                x,
                y + legs_length * scale * .95
            ];
            var pos = MathHelper.RotatePoint([x, y], rotation + angle, endPoints);

            var f_width = legs.width * ratio;
            var f_height = legs.height * ratio;
            var tX = -legs.tX * rotAnimDir * scale;
            if(i==0) tX = (f_width -legs.tX) * rotAnimDir * scale;


			context.save();
			context.translate(pos.x, pos.y);
			context.rotate((rotation + legAnim * self_dir) * Math.PI/180);
			context.globalAlpha = alpha;
			context.drawImage(
				texture, 0, 0, texture.width, texture.height,
				tX, -(f_height/2)-legs.tY * scale,
				(f_width * scale), (f_height * scale)
			);
			context.restore();
		}
	}
}












class EntityCelltipedeTail extends EntityCelltipedePart
{
	constructor(x, y, parent, owner)
	{
		super(x, y, parent, owner);
        this.Textures = 
        {
            base: 'bullet.bubble.base',
            tail_left: 'entity.celltipede.tail.left',
            tail_right: 'entity.celltipede.tail.right'
        };

        this.tailScale = 1.5;
        this.Weakness[ELEMENT.PHYSICAL] = true;
	}

    RenderTexture(context)
	{
        var base = TextureManager.Get(this.Textures.base);
        var tail_left = TextureManager.Get(this.Textures.tail_left);
        var tail_right = TextureManager.Get(this.Textures.tail_right);

        var ratio = this.width / 512;
        var tail = {width: 190, height: 512, angles: [-160, -200], tY: 10 * ratio, textureSpaceY: 3 * ratio, tX: 60 * ratio};

        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;
        var width = this.width;
        var height = this.height;
        var rotation = this.Rotation - 180;
        var alpha = this.Transparency;
        var scale = this.Scale;

        var tail_length = width/2;

        //render base
        Graphic.DrawRotatedImage(context, base, x, y, width, height, scale, 0, alpha);

        //render tail
        for(var i = 0; i < 2; i++)
		{
            var texture = tail_left;
            var rotAnimDir = -1;
            if(i == 1) 
            {
                texture = tail_right;
                rotAnimDir = 1;
            }

            var angle = 180 + tail.angles[i];
            var s = scale * this.tailScale;

            var endPoints = [
                x,
                y + tail_length * scale * .95
            ];
            var pos = MathHelper.RotatePoint([x, y], rotation + angle, endPoints);

            var f_width = tail.width * ratio;
            var f_height = tail.height * ratio;

			context.save();
			context.translate(pos.x, pos.y);
			context.rotate(rotation * Math.PI/180);
			context.globalAlpha = alpha;
			context.drawImage(
				texture, 0, 0, texture.width, texture.height,
				-((f_width / 2)-rotAnimDir * tail.tX) * s, -(tail.tY + tail.textureSpaceY) * s,
				(f_width * s), (f_height * s)
			);
			context.restore();
		}
	}
}