class DialogLine
{
	constructor(id, text, options = [], exitTexts = ['DIALOG.EXIT'])
	{
		this.id = id;
		this.Text = text;
		this.Options = options;
		this.isQuest = false;

		if(exitTexts)
		{
			var exit_txt = exitTexts[MathHelper.randomInRange(0, exitTexts.length-1)];
			this.Options.push(new DialogOption(exit_txt));
		}

		Dialog.AddDialogLine(this);

		this.currentText = null;
	}

	Reset()
	{
		this.currentText = null;
	}

	GetText()
	{
		var name = World.Player.interactionWith.getDisplayName();

		if(!isArray(this.Text)) return Lang.Get(this.Text, {NAME: name});
		if(this.currentText == null) this.currentText = MathHelper.randomInRange(0, this.Text.length-1);
		
		return Lang.Get(this.Text[this.currentText], {NAME: name});
	}

	static Exit()
	{
		UI_Helper.removeHistoryElement('talk_with');
	}

	static OpenShop()
	{
		World.Player.interactionWith.Trade();
		var t = World.Player.interactionWith;
		UI_Helper.OpenShop(World.Player.interactionWith);
		DialogLine.Exit();
		World.Player.interactionWith = t;
	}

	static OpenLargeShop()
	{
		World.Player.interactionWith.Trade();
		var t = World.Player.interactionWith;
		UI_Helper.OpenLargeShop(World.Player.interactionWith);
		DialogLine.Exit();
		World.Player.interactionWith = t;
	}
	

	static OpenCrafting()
	{
		var t = World.Player.interactionWith;
		UI_Helper.OpenCrafting();
		DialogLine.Exit();
		World.Player.interactionWith = t;
	}

	static OpenAppearance()
	{
		var t = World.Player.interactionWith;
		UI_Helper.OpenAppearanceGUI();
		DialogLine.Exit();
		World.Player.interactionWith = t;
	}

	static OpenKnowledge()
	{
		var t = World.Player.interactionWith;
		UI_Helper.OpenKnowledgeGUI();
		DialogLine.Exit();
		World.Player.interactionWith = t;
	}

	static ChangeDialogLine(id)
	{
		if(Dialog.DialogLines[id]) DialogGUI.ChangeLine(Dialog.DialogLines[id]);
	}

	GetOptions()
	{
		var options = [];
		for(var i = 0; i < this.Options.length; i++)
		{
			if(this.Options[i].showTrigger)
			{
				if(!this.Options[i].showTrigger()) continue;
			}

			options.push(this.Options[i]);
		}
		return options;
	}
}

class DialogOption
{
	constructor(text, onClick = DialogLine.Exit, icon = null, showTrigger = null)
	{
		this.Text = text;
		this.onClick = onClick;
		this.icon = icon;
		this.showTrigger = showTrigger;

		this.currentText = null;
	}

	GetText()
	{
		if(!isArray(this.Text)) return Lang.Get(this.Text);
		if(!this.currentText) this.currentText = MathHelper.randomInRange(0, this.Text.length-1);
		
		return Lang.Get(this.Text[this.currentText]);
	}
}