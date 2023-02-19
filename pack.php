<?php
	// =========== https://github.com/tazotodua/useful-php-scripts ========== 
	//                                 USAGE:
	//     new GoodZipArchive('path/to/input/folder',    'path/to/output_zip_file.zip') ;
	// ======================================================================

	$COMPILE_ON_START = false;

	include "./compile.php";
	include "compile.config.php";




	if(isset($_GET["securityLevel"]))
	{
		$Config["SecurityLevel"] = $_GET["securityLevel"];
	}

	if(isset($_GET["version"]))
	{
		$VERSION = $_GET["version"];
	}

	if(isset($_GET["developer_mode"]))
	{
		$DEVELOP = $_GET["developer_mode"];
	}

	if(isset($_GET["allow_commands"]))
	{
		$COMMANDS = $_GET["allow_commands"];
	}

	$toExclude = array
	(
		//sciezki do plikow ktore nie maja zostac spakowane
		"./assets/sounds/tests",
		"./pack.php",
		"./links.txt",
		"./compile.php",
		"./compile.config.php",
		"./bubble_wars.code-workspace",
		"./scripts",
		"./css",
		"./versions",
		"./assets/main.js",
		"./assets/GAME.js",
		"./assets/core",
		"./assets/content"
	);

	_Pack();





	function _Pack()
	{
		global $Config;
		global $VERSION;
		global $toExclude;
		$temp_path = "./BubbleWars v.".$VERSION;

		$toExclude []= $temp_path;
		$Config["OutputPath"] = $temp_path."/assets/GAME.js";

		copyRequiredFiles($temp_path);
		Compile($Config);


		//zip
		new GoodZipArchive($temp_path,    "./versions/BubbleWars v.".$VERSION.".zip");

		//delete directory
		rrmdir($temp_path);
	}


	





	function copyRequiredFiles($temp_path)
	{
		if (!file_exists($temp_path))
		{
			mkdir($temp_path, 0777, true);
		}

		recurse_copy('.', $temp_path);
	}



	function recurse_copy($src,$dst) { 
		global $toExclude;
		$dir = opendir($src); 
		@mkdir($dst); 
		while(false !== ( $file = readdir($dir)) ) {

			if (in_array($src . '/'.$file, $toExclude)) continue;

			if (( $file != '.' ) && ( $file != '..' )) { 
				if ( is_dir($src . '/' . $file) ) { 
					recurse_copy($src . '/' . $file,$dst . '/' . $file); 
				} 
				else { 
					copy($src . '/' . $file,$dst . '/' . $file); 
				} 
			} 
		} 
		closedir($dir); 
	} 

	function rrmdir($src) {
		$dir = opendir($src);
		while(false !== ( $file = readdir($dir)) ) {
			if (( $file != '.' ) && ( $file != '..' )) {
				$full = $src . '/' . $file;
				if ( is_dir($full) ) {
					rrmdir($full);
				}
				else {
					unlink($full);
				}
			}
		}
		closedir($dir);
		rmdir($src);
	}















	class GoodZipArchive extends ZipArchive 
	{
		//@author Nicolas Heimann
		public function __construct($a=false, $b=false) { $this->create_func($a, $b);  }
		
		public function create_func($input_folder=false, $output_zip_file=false)
		{
			if($input_folder && $output_zip_file)
			{
				$res = $this->open($output_zip_file, ZipArchive::CREATE);
				if($res === TRUE) 	{ $this->addDir($input_folder, basename($input_folder)); $this->close(); }
				else  				{ echo 'Could not create a zip archive. Contact Admin.'; }
			}
		}
		
		// Add a Dir with Files and Subdirs to the archive
		public function addDir($location, $name) {
			$this->addEmptyDir($name);
			$this->addDirDo($location, $name);
		}

		// Add Files & Dirs to archive 
		private function addDirDo($location, $name) {
			$name .= '/';         $location .= '/';
		// Read all Files in Dir
			$dir = opendir ($location);
			while ($file = readdir($dir))    {
				if ($file == '.' || $file == '..') continue;
			// Rekursiv, If dir: GoodZipArchive::addDir(), else ::File();
				$do = (filetype( $location . $file) == 'dir') ? 'addDir' : 'addFile';
				$this->$do($location . $file, $name . $file);
			}
		} 
	}

?>