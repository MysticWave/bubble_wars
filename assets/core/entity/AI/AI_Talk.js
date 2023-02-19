class AI_Talk
{
	constructor(owner)
	{
		this.name = "Talk";
		this.detectRadius = (owner.width * owner.Scale) + 100;

		owner.GetDialogLine = function(){return Dialog.DialogLines[this.dialogLine]};
		owner.onDialogStart = function()
		{
			var id = this.getId();
			var data = World.Player.NPCData[id];
			if(!data) data = Player.CreateNPCData();

			data.met = true;
			data.interactions++;

			World.Player.NPCData[id] = data;
			Save();
		}
	}
	
	Update(owner)
	{	
		if(owner.isTrading) return;

		var distance = MathHelper.GetDistance([owner.x, owner.y], [World.Player.x, World.Player.y]);
		owner.quote = null;

		if(distance <= this.detectRadius)
		{
			if(!World.Player.interactionWith)
			{
				owner.quote = ['Press [' + Settings.Controls.Interact + '] to talk.'];
			}
			World.Player.canInteractWith.push(owner);
		}
		else if(World.Player.interactionWith != owner)
		{
			var name = owner.getDisplayName();
			owner.quote = name;
		}
		
		if(World.Player.interactionWith == owner)
		{
			owner.allowMove = false;
			owner.moveX = 0;
			owner.moveY = 0;
			if(owner.allowRotationChange) owner.Rotation = MathHelper.getAngle2(owner, World.Player)+90;
		}
	}
}