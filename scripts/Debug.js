window.addEventListener("keydown", function (e)
{
    if (e.ctrlKey)
    {
        switch (e.key) 
        {
            case 'F5':
            {
                e.preventDefault();
                Compile();
            }
        }
    }
});

window.Compile = function()
{
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            if(this.responseText == "true")
            {
               location.reload(true);
            }
            else
            {
                console.error(this.responseText);
            }
        }
    };
    ajax.open("GET", "./compile.php", true);
    ajax.send();
}

window.Pack = function()
{
    var version = prompt("Version: ", VERSION);
    var commands = prompt("Allow Commands", ALLOW_COMMANDS);
    var security = prompt("Security Level: ", 1);
    var developerMode = prompt("Developer Mode: ", false);

    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            if(this.responseText == "true")
            {
                console.log("ready");
            }
            else
            {
                console.error(this.responseText);
            }
        }
    };
    ajax.open("GET", "./pack.php?securityLevel="+security+"&version="+version+"&developer_mode="+developerMode+"&allow_commands="+commands, true);
    ajax.send();
}