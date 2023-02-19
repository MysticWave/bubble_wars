class Settings
{
	static Init()
	{
		Settings.List = {};

		Settings.InitSetting(Controls);
		Settings.InitSetting(Video);
		Settings.InitSetting(Sound);
		Settings.InitSetting(General);

		Settings.Load();
	}


	static Apply()
	{
		document.body.style.setProperty('--ui-scale', Settings.Video.UI_Scale / 100);

		Graphic.mainCanvas.width = Settings.Video.Resolution[0];
		Graphic.mainCanvas.height = Settings.Video.Resolution[1];
		
		// Lang.Initialize("EN");
		// UI_Helper.Init();

		Graphic.ApplyFullscreen();
		Main.Resize();
	}

	static InitSetting(constr)
	{
		var name = constr.name;
		Settings[name] = new constr();
		Settings.List[name] = constr;
	}
	
	static Load()
	{
		var save = localStorage.getItem("SETTINGS");
		if(isJSON(save))
		{
			save = JSON.parse(save);
			
			for(var objName in save)
			{
				for(var property in save[objName])
				{
					if(objName == "Controls" && property.includes("State")) continue;
					Settings[objName][property] = save[objName][property];
				}
			}
		}

		Settings.Video.isFullscreen = false;
	}

	static Save()
	{
		var obj = {};
		for(var prop in Settings.List)
		{
			obj[prop] = Settings[prop];
		}

		var save = JSON.stringify(obj);
		localStorage.setItem("SETTINGS", save);

		Settings.Apply();
	}

	static RestoreDefault(type)
	{
		var constr = Settings.List[type];
		if(!constr) return;

		Settings[type] = new constr();
	}
}

