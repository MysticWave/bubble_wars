class AI_Enrage
{
	constructor(owner, hp_lost = 50, data = {})
	{
		this.name = "Enrage";
		this.Owner = owner;
            owner.isEnraged = false;
        this.Brackets = [new HpBracketEvent(hp_lost, this.Enrage)];

        this.HP_lost = hp_lost;
        this.enragedAnimation = 0;
        this.summonParticles = true;

        this.showAnimation = true;
        this.invincibleOnRage = true;

        for(var i in data)
        {
            this[i] = data[i];
        }
	}

    CreateEnrageIcon()
    {
        var current = document.getElementById('boss_rage_meter');
        if(current)
        {
            current.style.left = this.HP_lost+'%';
            return;
        }

        var icon = document.createElement('div');
            icon.id = 'boss_rage_meter';
            icon.className = 'icon';
            icon.dataset.icon = 'icon_boss_rage_meter';
            icon.style.left = this.HP_lost+'%';
            icon.onanimationend = function(){if(this.dataset.hide == 'true') this.remove();}
        document.getElementById('boss_hp_bar_container').appendChild(icon);
    }
	
	Update(owner)
	{
		for(var name in this.Brackets)
        {
            this.Brackets[name].Update(owner);
        }

        if(owner.isEnraged) this.EnrageUpdate(owner);
	}

    EnrageUpdate(owner)
    {
        if(this.enragedAnimation < owner.enragedAnimationDuration)
        {
            owner.enrageAnimationProgress = this.enragedAnimation / owner.enragedAnimationDuration;
            owner.onEnrageAnimationProgress?.();
            
            if(this.showAnimation && this.summonParticles && this.enragedAnimation % 2 == 0 && this.enragedAnimation < owner.enragedAnimationDuration - 1 * Main.FPS)
            {
                var angle = MathHelper.randomInRange(0, 360);

                Particle.SummonCirclePattern("bubble", owner.x, owner.y, 0.4, 500, 1, 
                    World.Radius, angle, null, false);
            }

            this.enragedAnimation++;
            return;
        }

        if(this.enragedAnimation == owner.enragedAnimationDuration)
        {
            owner.lockAI = false;
            owner.unlockAI.replace(this.name, '');
            this.enragedAnimation++
            
            owner.onEnrageAnimationEnd?.();
        }

        owner.onEnrageUpdate?.();
    }

    Enrage(owner)
    {
        if(owner.isEnraged) return;

        owner.isEnraged = true;
        owner.lockAI = true;
        owner.unlockAI += 'Enrage/';

		if(owner.AI.Enrage?.invincibleOnRage) ApplyEffect(owner, 'Invincibility', 1, owner.enragedAnimationDuration/Main.FPS);

        owner.Enrage?.();

        document.getElementById('boss_rage_meter').dataset.hide = 'true';
        document.getElementById('boss_rage_meter').dataset.icon = 'icon_boss_rage_meter_2';
    }
}
