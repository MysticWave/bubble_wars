class DialogGUI
{
	static Initialize()
	{
        DialogGUI.showQuests = true;

        document.querySelector('#dialog_content').addEventListener('click', function(){DialogGUI.SkipTextAnimation()});
	}

	static AddDialogLine(dialogLine)
	{
		if(!Dialog.DialogLines) Dialog.DialogLines = {};

		Dialog.DialogLines[dialogLine.id] = dialogLine;
	}

	static canBeOpened()
	{
		if(DialogGUI.isOpen) return false;
		if(!World.Player.interactionWith) return false;
		if(World.Player.interactionWith.isTrading) return false;
		return true;
	}

    static Open()
    {
        if(!this.canBeOpened()) return;

        this.currentDialog = World.Player.interactionWith.GetDialogLine();
		this.currentDialog.Reset();
		
        this.charNum = 0;
		DialogGUI.isOpen = true;

        UI_Helper.Open('talk_with', false, null, DialogGUI.Close);

        this.setOptions();
        this.setContent();

        var name = World.Player.interactionWith.getDisplayName();
        set('#dialog_window', 'dataset.name', name);

		if(isFunction(World.Player.interactionWith.onDialogStart)) World.Player.interactionWith.onDialogStart();

        this.showQuests = false;
    }

	static ChangeLine(new_line)
	{
		this.currentDialog = new_line;
        this.charNum = 0;

        this.setOptions();
        this.setContent();

        var name = World.Player.interactionWith.getDisplayName();
        set('#dialog_window', 'dataset.name', name);
	}

    static Close()
    {
        // World.Player.isTalking = false;
		DialogGUI.isOpen = false;
		World.Player.interactionWith = null;

        var el = document.getElementById('talk_with');
        el.style.setProperty("display", "block", "important");
        setTimeout(()=>{el.style.display = ''}, 550);

        DialogGUI.showQuests = true;
    }

	static Update()
	{
		if(!DialogGUI.isOpen) return;
        this.charNum++;
        this.setContent();
	}

    static SkipTextAnimation()
    {
        this.charNum = this.currentDialog.GetText().length-1;
    }

    static setContent()
    {
        var content = '#dialog_content';
        var text = this.currentDialog.GetText();

        var textToShow = '';
        if(text.length < this.charNum) textToShow = text;
        else textToShow = text.slice(0, this.charNum);

        if(this.charNum > text.length) return;  //no need to update content anymore
        set(content, 'innerText', textToShow, true);
    }

    static getQuestOptions()
    {
        var opt = [];
        if(!this.showQuests) return opt;
        var npc = World.Player.interactionWith.constructor.name;

        var completedQuest = QuestList.GetQuestsToComplete(npc);
        for(var i in completedQuest)
        {
            var q = completedQuest[i];
            var option = new DialogOption(q.getDisplayName(true), () => DialogLine.ChangeDialogLine(q.dialogLineComplete), 'quest');
                option.isQuest = true;

            opt.push(option);
        }

        var availableQuests = QuestList.GetAvailableQuests(npc);
        for(i in availableQuests)
        {
            var q = availableQuests[i];
            var option = new DialogOption(q.getDisplayName(), () => DialogLine.ChangeDialogLine(q.dialogLine), 'quest');
                option.isQuest = true;

            opt.push(option);
        }


       

        return opt;
    }

    static setOptions()
    {
        var container = document.getElementById('dialog_options');
            container.innerHTML = '';
        var options = this.getQuestOptions().concat(this.currentDialog.GetOptions());

        for(var i = 0; i < options.length; i++)
        {
            var opt = this.getOption(options[i]);
            if(i == options.length-1) opt.className += ' last';
            container.appendChild(opt);
        }

        container.style.setProperty('--options', options.length);
    }

    static getOption(option)
    {
        var opt = document.createElement('div');
            opt.className = 'option';
            if(option.isQuest) opt.className += ' quest';

        if(option)
        {
            if(option.icon)
            {
                var icon = document.createElement('div');
                    icon.className = 'icon';
                    icon.dataset.icon = option.icon;
                    opt.appendChild(icon);
            }

            var text = document.createElement('div');
                text.className = 'text';
                text.innerText = option.GetText();
                opt.appendChild(text);
            
            if(isFunction(option.onClick)) opt.addEventListener('click', option.onClick);
        }

        return opt;
    }
}