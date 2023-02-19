class Lang
{
    static Initialize(language)
    {
        this.lang = LANGS[language] || LANGS["EN"];
    }

    static Translate(key, split = false)
    {
        if(this.lang[key])
        {
            if(split)
            {
                return this.lang[key].split("\n");
            }
            
            return this.lang[key];
        }

        if(split)
        {
            return ["undefined"];
        }

        return "undefined";
    }

    static GetCurrentLanguage()
    {
        return this.lang;
    }

    static SetGlobalParams(params)
    {
        // params['PLAYER_NAME'] = Champions.List.player.getDisplayName();

        return params;
    }

    static Get(key, params)
    {
        if(!params) params = {};
        params = Lang.SetGlobalParams(params);

        var language = Lang.GetCurrentLanguage();
        if(language[key]) return Helper.ApplyArguments(language[key], params);
        return Helper.ApplyArguments(key, params);
    }
}

var LANGS = {};