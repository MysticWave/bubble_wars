class RunInfo
{
	constructor()
	{
		this.Open = false;

		this.x = 0;
		this.y = 0;
		this.Width = 500;
		this.Height = 300;

		this.backgroundColor = "rgba(255, 255, 255, 0.1)";
		this.style = Style.GetStyleByName("Default");
		this.hover = false;

		this.rankSizeTransition = new Transition(240, 80, 1.3);
		this.alphaTransition = new Transition(0, 1, 1.1);

		this.shineAlphaTransition = new Transition(0, 0.9, 0.9);
		this.shineSizeTransition = new Transition(0, 4000, 0.1);
		this.shineRotateTransition = new Transition(360, 0, 40, false, 0, 0, true);
		this.shineSizeAfter = new Transition(60, 80, 0.5, true, 0, 0);

		this.xButton = new Button(0, 0, 'RunInfoClose', 'x', false, '', null, null, function(){InGame.GUI.RunInfo.Open = false});
	}

	static GetRankColor(rank)
	{
		var color = '#ffe30f';
		var stroke = '#ffc00f';
				
		if(rank.includes('A'))
		{
			color = '#39ef00';
			stroke = '#39c600';
		}

		if(rank.includes('B')) 
		{
			color = '#3eb5ff';
			stroke = '#3e8aff';
		}

		if(rank.includes('C'))
		{
			color = '#e337f8';
			stroke = '#c21dd6';
		}

		if(rank.includes('D'))
		{
			color = '#fe5757';
			stroke = '#d74444';
		}

		if(rank.includes('F'))
		{
			color = '#afafaf';
			stroke = '#8c8c8c';
		}

		return {color: color, stroke: stroke};
	}
	
	
	Update()
	{
		if(InGame.pause) return;
		if(!this.Open) return;

		if(Settings.Controls.StateEscape)
		{
			InGame.lockEscape = true;
			this.Open = false;
		}


		World.Player.allowControl = false;
		this.xButton.Update();
	}
	
	Render()
	{
		if(!this.Open) return;
		this.ageInTicks++;

		this.x = (canvas.width / 2) - (this.Width / 2);
		this.y = (canvas.height / 2) - (this.Height / 2);

		var margin = 20;

		if(Mouse.click)
		{
			//przerwanie animacji napisow
			Mouse.click = false;
			this.ageInTicks = 99999;
		}

		var textLines = [];

		ChangeLayer(Graphic.Layer.GUI);

			ctx.save();
			ctx.fillStyle = 'rgba(0, 0, 0, 0.4';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.restore();

			ctx.save();
			ctx.fillStyle = this.backgroundColor;
			Graphic.roundRect(ctx, this.x, this.y - margin, this.Width + 2 * margin, this.Height + 2 * margin, margin * 2, true, false);
			ctx.restore();


			var runStats = this.runStats;
			var runInfo = this.runInfo;

			this.style = Style.GetStyleByName("MenuInfo");
			this.style.fontSize = 25;
			this.style.textAlign = 'center';
			this.style.color = "lightblue";
			this.style.strokeColor = "#569af3";
			this.style.strokeSize = 3;


			


			var text = "";
			var x = this.x + margin;
			var y = this.y + margin + 30;
			var lineHeight = 20;


			text = "Run Summary:";
			Style.FillText(ctx, this, text, x + (this.Width / 2), y - 50);

			ctx.save();
			ctx.fillStyle = 'lightgray';
			ctx.fillRect(this.x  + margin, this.y + 30, this.Width, 2);
			ctx.restore();


			this.style.fontSize = 18;
			this.style.textAlign = 'left';


			this.xButton.x = x + this.Width - 25;
			this.xButton.y = this.y - 5;
			this.xButton.Render();


			
			
			var time = TicksToTime(runStats.timeInLocation);
			var timeText = "";
			if(time.h) timeText += time.h + ":";
			var s = (time.s < 10) ? "0" + time.s : time.s;
			var m = (time.m < 10) ? "0" + time.m : time.m;
			timeText += m + ":" + s;

			

			
			text = "Time: " + timeText;
			textLines.push({x: x, y: y, text: text});
			// Style.FillText(ctx, this, text, x, y, null, null, alpha);
			y += lineHeight;


	
			text = "Total XP gained: " + runStats.totalExperienceEarned;
			textLines.push({x: x, y: y, text: text});
			y += lineHeight;


			text = "Total Oxygen earned: " + runStats.totalGoldEarned;
			textLines.push({x: x, y: y, text: text});
			y += lineHeight;
			y += lineHeight;


			text = "Defeated Bosses: " + runStats.defeatedBosses + " / " + runInfo.bossChambers;
			textLines.push({x: x, y: y, text: text});
			y += lineHeight;


			text = "Defeated Enemies: " + (runStats.defeatedEnemies + runStats.defeatedBosses);
			textLines.push({x: x, y: y, text: text});
			y += lineHeight;


			text = "Secrets Found: " + runStats.foundSecretRooms + " / " +  runInfo.secretChambers;
			textLines.push({x: x, y: y, text: text});
			y += lineHeight;
			y += lineHeight;



			text = "Performance: " + (Math.round(runInfo.performance * 100) / 100) + "%";
			textLines.push({x: x, y: y, text: text});
			y += lineHeight;




			text = "Shot Accuracy: " + (Math.round(runInfo.accuracy * 100) / 100) + "%";
			textLines.push({x: x, y: y, text: text});
			y += lineHeight;


			var drawRank = true;
			var drawnCharacters = 0;
			var availableCharacters = this.ageInTicks;

			for(var i = 0; i < textLines.length; i++)
			{
				var textToDraw = " ";
				var line = textLines[i];
				if(drawnCharacters + line.text.length < availableCharacters)
				{
					textToDraw = line.text;
					drawnCharacters += line.text.length;

					Style.FillText(ctx, this, textToDraw, line.x, line.y);
				}
				else
				{
					var new_length = availableCharacters - drawnCharacters;
					textToDraw = line.text.slice(0, new_length);

					Style.FillText(ctx, this, textToDraw, line.x, line.y);
					drawRank = false;
					break;
				}
			}



			if(drawRank)
			{
				text = runInfo.rank;
				this.style.fontSize = this.rankSizeTransition.Update();
				this.style.textAlign = 'right';
				this.style.strokeSize = 10;

				var colors = RunInfo.GetRankColor(runInfo.rank);

				Style.FillText(ctx, this, text, x + this.Width, this.y + (this.Height / 2), colors.color, colors.stroke, this.alphaTransition.Update());

				if(this.style.fontSize == this.rankSizeTransition.To && (runInfo.rank.includes('S')))
				{
					//animacja sie zakonczyla
					var size = Style.GetTextSize(text, this.style);
					var width = size.width;
					var height = size.height;

					var shineSize = this.shineSizeTransition.Update();
					var alpha = 0.5;

					if(shineSize == this.shineSizeTransition.To)
					{
						shineSize = this.shineSizeAfter.Update();
						alpha = this.shineAlphaTransition.Update();
					}

					var rotation = this.shineRotateTransition.Update();

					var shineX = x + this.Width - width + 20;
					var shineY = this.y + (this.Height / 2) - (height / 2) + 10;
					
					Graphic.ApplyShineEffect(shineX, shineY, shineSize, alpha, rotation);
				}
			}

		RestoreLayer();
	}

	open(runStats)
	{
		var runInfo = runStats.getRunInfo();
		if(runInfo)
		{
			this.runStats = runStats;
			this.runInfo = runInfo;
			this.Open = true;
			this.ageInTicks = 0;
			this.rankSizeTransition.ageInTicks = 1;
		}
	}
}