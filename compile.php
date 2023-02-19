<?php
    SESSION_START();
    if(isset($_SESSION["AssemblyVersion"]))
    {
        $_SESSION["AssemblyVersion"] += 1;
    }
    else
    {
        $_SESSION["AssemblyVersion"] = 1;
    }

    include "compile.config.php";
    $VERSION = "pre-Beta 1.0.0";
    $COMMANDS = "true";
    $DEVELOP = "true";


if(!isset($COMPILE_ON_START))
{
    Compile($Config);
}

function Compile($Config)
{
    $variables = array();
    global $VERSION;
    global $COMMANDS;
    global $DEVELOP;

    $SECURITY = 0;

    if($_SERVER['HTTP_HOST'] != "localhost")
    {
        echo "false";
        exit;
    }
    else
    {
        //kompilacja jest mozliwa tylko z localhosta
        $MainFileName = $Config["OutputPath"];

        // $file = file_get_contents($MainFileName, FILE_USE_INCLUDE_PATH);
        file_put_contents($MainFileName, "");       //usuwa zawartosc pliku

        if($Config["ShowAssemblyVersion"])
        {
            file_put_contents($MainFileName, "console.log('AssemblyVersion: ".$_SESSION["AssemblyVersion"]."');", FILE_APPEND);
        }

        if($Config["SecurityLevel"] > 0)
        {
            $Config["Compress"] = 1;
            file_put_contents($MainFileName, "(function(){");
            $SECURITY = 1;
            if($Config["SecurityLevel"] >= 2)
            {
                getRandomVariableNames();
            } 
        }

        file_put_contents($MainFileName, "const USE_SECURITY = ".$SECURITY.";", FILE_APPEND);
        file_put_contents($MainFileName, "const DEVELOPER_MODE = ".$DEVELOP.";", FILE_APPEND);
        file_put_contents($MainFileName, "const ALLOW_COMMANDS = ".$COMMANDS.";", FILE_APPEND);
        file_put_contents($MainFileName, "const VERSION = '".$VERSION."';", FILE_APPEND);

        

        $paths = $Config["Paths"];

        foreach($paths as $path)
        {
            if(!isPathToDir($path))
            {
                if(file_exists($path))
                {
                    $f = file_get_contents($path, FILE_USE_INCLUDE_PATH);
                    if($Config["SecurityLevel"] >= 2) { $f = Encrypte($f);}
                    if($Config["Compress"]){ $f = Compress($f);}
                    file_put_contents($MainFileName, $f, FILE_APPEND);
                }
            }
            else
            {
                $files = scandir($path);
                
                foreach($files as $_file)
                {
                    if(!isPathToDir($path.$_file))
                    {
                        if(file_exists($path.$_file))
                        {
                            $f = file_get_contents($path.$_file, FILE_USE_INCLUDE_PATH);
                            if($Config["SecurityLevel"] >= 2) { $f = Encrypte($f);}
                            if($Config["Compress"]) {$f = Compress($f);}
                            file_put_contents($MainFileName, $f, FILE_APPEND);
                        }
                    }
                }
            }
        }

        
        file_put_contents($MainFileName, $Config["InitializeMethod"], FILE_APPEND);

        if($Config["SecurityLevel"] > 0)
        {
            file_put_contents($MainFileName, "})();", FILE_APPEND); 
        }

         echo "true";
       
    }
}

    function getRandomName($length)
    {
        $template = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $rndstring = "";

        for ($a = 0; $a <= $length; $a++)
        {
            $b = rand(0, strlen($template) - 1);
            $rndstring .= $template[$b];
        }

        return $rndstring; 
    }

    function getRandomVariableNames()
    {
        global $variables;
        $i = 1;
        foreach($Config["Variables"] as $variable)
        {
            $number = $i * 111 - 49;
            $name = getRandomName($i + 3);

            $variables[$variable] = $name.$number;
            $i++;
        }
        
    }

    function Encrypte($text)
    {
        global $variables;
        foreach($Config["Variables"] as $variable)
        {
            $text = str_replace($variable, $variables[$variable], $text );
        }

        return $text;
    }

    function Compress($temp)
    {
        $temp = preg_replace('/(?:(?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:(?<!\:|\\\)\/\/[^"\'].*))/', '', $temp);

        $temp = str_replace("\n", " ", $temp);
        $temp = str_replace("\r\n", "", $temp);
        $temp = str_replace("\t", "", $temp);
        $temp = str_replace("\r", "", $temp);

        return $temp;
    }


    function isPathToDir($path)
    {
        if(getExtension($path) == "js")
        {
            return false;
        }
        else
        {
            return true;
        }
    }


    function getExtension($name)
    {
        $ext = "";

        for($i = strlen($name) - 1; $i > 0; $i--)
        {
            if($name[$i] != ".")
            {
                $ext .= $name[$i];
            }
            else
            {
                break;
            }
        }

        $ext = strrev($ext);

        return $ext;
    }


?>