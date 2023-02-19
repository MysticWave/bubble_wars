class Security
{
	static ReportProblem(problemName)
	{
		var FreezeGame = function()
		{
			if(USE_SECURITY)
			{
				clearInterval(Main.LOOP);

				setTimeout(function()
				{
					ctx.save();
					ctx.fillStyle = 'white';
					ctx.globalAlpha = 0.7;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					ctx.restore();
				}, 100);

			}
		};


		
		switch(problemName)
		{
			case SECURITY_PROBLEM.SP:
				World.Player.ResetSPpoints();
				World.Player.Save();
				FreezeGame();
				Security.LogError('Game crashed.\n' + SECURITY_PROBLEM.SP);
				break;
		}
	}

	static LogError(message)
	{
		console.log("%c" + message, "color: red");
	}
}