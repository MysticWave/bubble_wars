<?php

    $Config = array
    (
        "ShowAssemblyVersion" => true,

        "SecurityLevel" => 0,
		//0 - brak ochrony
		//1 - ukrycie przed konsola przegladarki
		//2 - ukrycie + zamiana podanych nazw zmiennych na losowe ciagi znakow
		
        "InitializeMethod" => "Main.Initialize();",
		//Metoda ktora inicjalizuje caly kod (dodawana na koncu, aby uniknac bledow typu undefined)
		
        "Compress" => false,
		//Kompresja, usuwanie tabow oraz znakow nowej lini (\t, \n)
		
		"OutputPath" => "./assets/GAME.js",
		//Plik do ktorego ma zostac wyslany wynik
		
        "Paths" => array
        (
		//sciezki do plikow ktore maja zostac spakowane
            "./assets/main.js",
            "./assets/core/entity/",
			"./assets/core/commands/",
            "./assets/core/entity/AI/",
            "./assets/core/entity/Effects/",
            "./assets/core/helper/",
            "./assets/core/interface/",
            "./assets/core/items/",
            "./assets/core/physics/",
            "./assets/core/player/",
            "./assets/core/settings/",
            "./assets/core/world/",
            "./assets/core/models/",
            "./assets/core/ui/",
            
            "./assets/content/",

            "./assets/content/entity/",
            "./assets/content/entity/bosses/",
            "./assets/content/entity/npc/",
            "./assets/content/entity/projectiles/",
            "./assets/content/entity/pets/",
            "./assets/content/entity/traps/",
            "./assets/content/interface/",
            "./assets/content/interface/GUI/",

            "./assets/content/items/",
            "./assets/content/items/Bags/",

            "./assets/content/styles/",
            "./assets/content/world/",
            "./assets/content/world/locations/",
            "./assets/content/models/",
			"./assets/content/appearance/",
            "./assets/languages/"
        ),
        "Variables" => array
        (
		//nazwy zmiennych ktore maja zostac zaszyfrowane
            "Player",
            "Camera",
            "Item",
            "Inventory",
            "Game",
            "World"
        )
    );

?>