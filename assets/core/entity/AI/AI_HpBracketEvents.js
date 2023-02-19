class AI_HpBracketEvents
{
	constructor(owner, brackets = [])
	{
		this.name = "HpBracketEvents";
		this.Owner = owner;
        this.Brackets = brackets;
	}
	
	Update(owner)
	{
		for(var name in this.Brackets)
        {
            this.Brackets[name].Update(owner);
        }
	}
}

class HpBracketEvent
{
    constructor(value, event, onlyOnce = true)
    {
        this.Value = value;
        this.event = event;
        this.onlyOnce = onlyOnce;
        this.used = false;
    }

    Update(owner)
    {
        if(this.used) return;

        var hp_percentage = owner.HP / owner.MAXHP * 100;
        if(hp_percentage <= this.Value) this.Trigger(owner);
    }

    Trigger(owner)
    {
        this.event(owner);
        if(this.onlyOnce) this.used = true;
    }
}