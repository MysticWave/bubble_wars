class Video
{
	constructor()
	{
		this.Resolution = [1920, 1080];
		this.isFullscreen = false;
		this.UI_Scale = 100;
	}

	getResolutions()
	{
		var res = 
		[
			[800, 600],
			[1024, 720],
			[1920, 1080]
		];

		return res;
	}
}