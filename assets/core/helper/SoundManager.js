class SoundManager
{
	static Initialize()
	{
		this.MusicVolume = Settings.Sound.Music / 100;
		this.EffectsVolume = Settings.Sound.Effects / 100;
		this.Volume = Settings.Sound.General / 100;
		this.MusicShadeTime = 2;
		this.MusicLoopDelay = 2;
		this.MusicLoopTime = 0;
		this.MusicShade = 0;
		this.SwitchMusicTo = null;

		this.isMusicEnding = false;
		this.isMusicStarting = false;
		this.Ready = false;

		this.Playing =
		{
			Background: null,
			Effects: []
		};
	}

	static Update()
	{
		if(!this.Ready) return;

		this.MusicVolume = Settings.Sound.Music / 100;
		this.EffectsVolume = Settings.Sound.Effects / 100;
		this.Volume = Settings.Sound.General / 100;

		var background = this.Playing.Background;
		if(background)
		{
			var volume = (this.Volume * this.MusicVolume);
			var volumeMultiplier = 1;

			var current = background.currentTime;
			var duration = background.duration;

			
			if(current <= this.MusicShadeTime)
			{
				//rozpoczecie muzyki
				this.isMusicStarting= true;	
			}
			else if(current + this.MusicShadeTime < duration)
			{
				//w trakcie
				if(!this.SwitchMusicTo)
				{
					this.isMusicEnding = false;
					this.isMusicStarting = false;
					this.MusicShade = 0;
					this.MusicLoopTime = 0;
				}
			}
			else if(current <= duration)
			{
				//pod koniec
				this.isMusicEnding = true;
			}

			if(!this.SwitchMusicTo)
			{
				if(current >= duration)
				{
					if(this.MusicLoopTime >= this.MusicLoopDelay * Main.FPS)
					{
						this.Play(background.name, "BACKGROUND");
						this.Playing.Background.currentTime = 0;
						this.MusicShade = 0;
						this.MusicLoopTime = 0;
						this.Playing.Background.volume = 0;
						this.Playing.Background.play();
					}
					this.MusicLoopTime++;
				}

				if(this.isMusicEnding)
				{
					this.MusicShade++;
					volumeMultiplier = 1 - (this.MusicShade / (this.MusicShadeTime * Main.FPS));
				}
				else if(this.isMusicStarting)
				{
					this.MusicShade++;
					volumeMultiplier = this.MusicShade / (this.MusicShadeTime * Main.FPS);
				}
			}

			if(this.SwitchMusicTo)
			{
				this.MusicShade++;
				volumeMultiplier = 1 - (this.MusicShade / (this.MusicShadeTime * Main.FPS));

				if(this.MusicLoopTime >= this.MusicLoopDelay * Main.FPS)
				{
					if(this.SwitchMusicTo == "NULL")
					{
						this.Playing.Background = null;
					}
					else
					{
						this.Playing.Background = this.Sounds[this.SwitchMusicTo];
						this.Play(this.SwitchMusicTo, "BACKGROUND");
						this.Playing.Background.currentTime = 0;
					}
					
					this.MusicShade = 0;
					this.MusicLoopTime = 0;
					this.SwitchMusicTo = null;
				}
				this.MusicLoopTime++;
			}

			volumeMultiplier = (volumeMultiplier > 1) ? 1 : volumeMultiplier;
			volume *= volumeMultiplier;
			volume = (InGame.pause) ? volume / 2 : volume;
			volume = (volume < 0) ? 0 : volume;
			background.volume = volume;
		}

		if(this.Playing.Effects)
		{
			for(var i = 0; i < this.Playing.Effects.length; i++)
			{
				var effect = this.Playing.Effects[i];
				var dist = 1;
				if(effect.distanceSoundMultiplier !== undefined)
				{
					dist = effect.distanceSoundMultiplier;
				}
				effect.volume = (this.Volume * this.EffectsVolume * dist);
			}
		}
	}

	static Load()
	{
		this.Sounds = {};
		
		this.LoadProgress = 0;
		this.Loaded = 0;
		this.readyToPlay = 0;
		this.ToLoad = this.src.length;
		
		for (var num = 0; num < this.ToLoad; num++)
		{
			
			var name = this.src[num][0];
			var path = this.src[num][1];

			var sound = new Audio();
				sound.src = path;
				sound.name = name;
				sound.volume = 0;
				// sound.oncanplay  = function()
				// {
				// 	SoundManager.Loaded++;
				// 	canSoundPlay(this, function(){SoundManager.readyToPlay++;});
				// };
				sound.addEventListener('canplaythrough', function()
				{
					SoundManager.Loaded++;
				}, false);

				sound.onerror = function()
				{
					delete SoundManager.Sounds[this.name];
					SoundManager.Loaded++;
				};
			this.Sounds[name] = sound;
		}
	}

	/**
	 * 
	 * @param {String} name Name of sound.
	 * @param {String} type BACKGROUND || EFFECT
	 * @param {Bool} applyDistance Calc volume based on distance from player
	 * @param {Function} onEnd 
	 */
	static Play(name, type = "BACKGROUND", source, onEnd = null)
	{
		var audio = this.GetAudio(name);

		var onEnded = function()
		{
			var index = SoundManager.Playing.Effects.indexOf(this);
			SoundManager.Playing.Effects = SoundManager.Playing.Effects.slice(index, 1);
			if(isFunction(this.onEnd))
			{
				this.onEnd();
			}
		};

		if(audio)
		{
			if(type == "BACKGROUND")
			{
				this.isMusicEnding = false;
				this.isMusicStarting = false;
				if(this.Playing.Background)
				{
					if(this.Playing.Background.name != name)
					{
						this.SwitchMusicTo = name;
					}
					else
					{
						return;
						// this.Playing.Background.currentTime = 0;
					}
				}
				else
				{
					this.Playing.Background = audio;
					this.Playing.Background.currentTime = 0;
				}
			}
			else if(type == "EFFECT")
			{
				audio = audio.cloneNode();
				if(source)
				{
					if((World.Player) && isFinite(source.x) && isFinite(source.y))
					{
						var multi = 500 / MathHelper.GetDistance([source.x, source.y], [World.Player.x, World.Player.y]);
						multi = (multi > 1) ? 1 : multi;
						multi = (multi < 0) ? 0 : multi;

						audio.distanceSoundMultiplier = multi;
					}
				}
				this.Playing.Effects.push(audio);
			}
			else
			{
				return;
			}

			audio.type = type;
			audio.volume = 0;
			audio.onEnd = onEnd;
			audio.onended = onEnded;
			audio.play();
			
		}
	}

	static GetAudio(name)
	{
		if(this.Sounds[name])
		{
			return this.Sounds[name];
		}
		return null;
	}

	static StopMusic()
	{
		if(this.Playing.Background)
		{
			this.SwitchMusicTo = "NULL";
		}
	}
}