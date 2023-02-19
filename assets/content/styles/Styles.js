class StylesTest
{
	static Get()
	{
		var styles =
		{
			Default:
			{
				fontSize: 18,
				fontSizeType: "px",
				textAlign: "left",
				verticalAlign: 10,
				color: "white",
				textMargin: 5,
				strokeSize: 3,
				strokeColor: "black",
				fontWeight: "italic",
				fontFamily: "Helvetica"
			},
			
			LargeButton:
			{
				color: "white",
				fontSize: 60,
				textAlign: "center",
				backgroundColor: "rgba(0, 0, 0, 0)",
				width: 250,
				height: 70,
				strokeColor: "black",
				strokeSize: 5,
				
				States:
				{
					Hover:
					{
						fontSize: 70
					}
				}
			},

			ingameButton:
			{
				width: 45,
				height: 45,
				borderColor: 'lightgray',
				borderRadius: 10,
				borderSize: 2,

				States:
				{
					Hover:
					{
						borderColor: 'white'
					}
				}
			},

			OptionsButton:
			{
				color: "white",
				fontSize: 25,
				textAlign: "center",
				backgroundColor: "rgba(0, 0, 0, 0)",
				width: 100,
				height: 50,
				strokeColor: "black",
				strokeSize: 2,
				
				States:
				{
					Hover:
					{
						fontSize: 30
					},

					Disabled: 
					{
						color: 'rgba(255, 255, 255, 0.5',
						strokeColor: 'rgba(0, 0, 0, 0.5'
					}
				}
			},

			RunInfoClose:
			{
				color: 'lightblue',
				fontSize: 30,
				strokeSize: 3,
				strokeColor: '#569af3',
				textAlign: 'center',
				width: 30,
				height: 30,
				backgroundColor: 'rgba(0, 0, 0, 0)',

				States:
				{
					Hover:
					{
						fontSize: 40
					}
				}
			},

			OptionsControlsButton:
			{
				color: "lightgray",
				fontSize: 20,
				textAlign: "center",
				backgroundColor: "rgba(255, 255, 255, 0.1)",
				borderRadius: 5,
				width: 100,
				height: 30,
				strokeColor: "black",
				strokeSize: 2,
				
				States:
				{
					Hover:
					{
						color: "white"
					}
				}
			},

			small_button:
			{
				color: "black",
				fontSize: 4,
				fontSizeType: "%",
				fontStyle: "Comic Sans MS",
				backgroundColor: "lightgray",
				borderSize: 2,
				borderColor: "black",
				width: 120,
				height: 30,
				
				States:
				{
					Hover:
					{
						color: "black",
						fontSize: 4,
						fontSizeType: "%",
						fontStyle: "Comic Sans MS",
						backgroundColor: "lightblue",
						borderSize: 2,
						borderColor: "black"
					},
					
					Disabled:
					{
						color: "gray",
						fontSize: 4,
						fontSizeType: "%",
						fontStyle: "Comic Sans MS",
						backgroundColor: "lightgray",
						borderSize: 2,
						borderColor: "gray"
					}
				}
			},
			
			barHP:
			{
				color: "white",
				fontSize: 15,
				fontSizeType: "px",
				width: 200,
				height: 15,
				fontStyle: "Nova Square",
				backgroundColor: "rgba(0, 0, 0, 0)",
				borderRadius: 20,

				borderSize: 3,
				progressDisplay: "n",
				strokeSize: 2,
				strokeColor: "black",
				fontWeight: "italic",
				verticalAlign: 0,
				progressImage: "bar_hp",
				borderColor: "white",
				Animation: new AnimationInfo( 
					{
						Frames: 6,
						LoopMode: LOOP.CONTINUE,
						FrameDelay: 5
					}
				)
			},
			
			barShield:
			{
				color: "white",
				fontSize: 15,
				fontSizeType: "px",
				width: 200,
				height: 15,
				fontStyle: "Nova Square",
				backgroundColor: "rgba(0, 0, 0, 0)",
				borderRadius: 20,

				borderSize: 3,
				progressDisplay: "none",
				strokeSize: 2,
				strokeColor: "black",
				fontWeight: "italic",
				verticalAlign: 0,
				progressBar: "rgba(200, 200, 200, 1)",
				borderColor: "white"
			},
			
			barMP:
			{
				color: "white",
				fontSize: 15,
				fontSizeType: "px",
				width: 180,
				height: 10,
				fontStyle: "Nova Square",
				backgroundColor: "rgba(0, 0, 0, 0)",
				borderRadius: 20,

				borderSize: 2,
				progressDisplay: "none",
				strokeSize: 2,
				strokeColor: "black",
				fontWeight: "italic",
				verticalAlign: 0,
				progressImage: "bar_exp",
				borderColor: "white",
				Animation: new AnimationInfo( 
					{
						Frames: 6,
						LoopMode: LOOP.CONTINUE,
						FrameDelay: 5
					}
				)
			},
			
			stage:
			{
				color: "white",
				fontSize: 120,
				verticalAlign: "center",
				fontSizeType: "px",
				strokeSize: 2,
				strokeColor: "black",
				fontWeight: "italic"
			},

			WorldMapSwitch:
			{
				color: "#374850",
				fontSize: 30,
				verticalAlign: "center",
				fontSizeType: "px",
				fontStyle: "Comic Sans MS",
				strokeSize: 15,
				strokeColor: "#183355",
				fontWeight: "italic",
				width: 30,
				height: 50,
				backgroundColor: "rgba(0, 0, 0, 0)",

				States:
				{
					Hover:
					{
						fontSize: 35,
						strokeSize: 15,
						strokeColor: "#3b6cad",
						color: "#7998a3"
					},
					Disabled: 
					{
						strokeColor: "#569af3",
						color: "#abd6e6"
					}
				}
			},
			
			menu:
			{
				color: "lightblue",
				fontSize: 120,
				verticalAlign: "center",
				fontSizeType: "px",
				fontStyle: "Comic Sans MS",
				strokeSize: 15,
				strokeColor: "#569af3",
				fontWeight: "italic"
			},

			menu_subtitle:
			{
				color: "lightblue",
				fontSize: 30,
				verticalAlign: "center",
				fontSizeType: "px",
				fontStyle: "Comic Sans MS",
				strokeSize: 15,
				strokeColor: "#569af3",
				fontWeight: "italic"
			},


			SettingsSlider:
			{
				width: 200,
				height: 20,
				backgroundColor: "rgba(0, 0, 0, 0)",
				borderColor: "rgba(255, 255, 255, 0.7)",
				borderRadius: 5,

				sliderPointer:
				{
					width: 5,
					height: 20,
					backgroundColor: "rgba(255, 255, 255, 0.7)",
					borderColor: "rgba(255, 255, 255, 0.7)",
					borderRadius: 5
				}
			},

			OptionsCheckbox:
			{
				width: 20,
				height: 20,
				borderSize: 3,
				borderRadius: 10,
				borderColor: 'white'
			},

			MenuInfo:
			{
				color: "white",
				fontSize: 15,
				textAlign: "left",
				backgroundColor: "rgba(0, 0, 0, 0)",
				width: 0,
				height: 20,
				strokeColor: "black",
				strokeSize: 2
			},
			
			bossHP:
			{
				color: "lightblue",
				fontSize: 15,
				fontSizeType: "px",
				width: 0,
				height: 15,
				fontStyle: "Comic Sans MS",
				backgroundColor: "rgba(0, 0, 0, 0)",
				borderRadius: 20,
				textAlign: "left",

				borderSize: 5,
				progressDisplay: "none",
				strokeSize: 15,
				strokeColor: "#bc5fff",
				fontWeight: "italic",
				verticalAlign: -15,
				progressImage: "bar_boss_hp",
				borderColor: "lightblue",
				Animation: new AnimationInfo( 
					{
						Frames: 6,
						LoopMode: LOOP.CONTINUE,
						FrameDelay: 5
					}
				)
			},
			
			barEXP:
			{
				color: "white",
				fontSize: 15,
				fontSizeType: "px",
				width: 0,
				height: 10,
				fontStyle: "Nova Square",
				backgroundColor: "rgba(0, 0, 0, 0)",
				borderRadius: 20,

				borderSize: 5,
				progressDisplay: "none",
				strokeSize: 2,
				strokeColor: "black",
				fontWeight: "italic",
				verticalAlign: 0,
				progressImage: "bar_mp",
				borderColor: "white",
				Animation: new AnimationInfo( 
					{
						Frames: 6,
						LoopMode: LOOP.CONTINUE,
						FrameDelay: 5
					}
				)
			},

			barLoading:
			{
				color: "white",
				fontSize: 20,
				fontSizeType: "px",
				width: 0,
				height: 30,
				fontStyle: "Nova Square",
				backgroundColor: "rgba(0, 0, 0, 0)",
				borderRadius: 30,

				borderSize: 5,
				progressDisplay: "%",
				strokeSize: 2,
				strokeColor: "black",
				fontWeight: "bold",
				verticalAlign: 0,
				progressBar: "lightblue",
				borderColor: "white"
			},
			
			inventory_slot_switch_button:
			{
				width: 49,
				height: 20,
				fontSizeType: "px",
				textAlign: "center",
				color: "lightgray",
				backgroundColor: "#909090",
				fontWeight: "bold",
				
				States:
				{
					Hover:
					{
						backgroundColor: "#b3b3b3"
					},
					
					Disabled:
					{
						backgroundColor: "#696969"
					}
				}
			},
			
			inventory_slot:
			{
				width: 50,
				height: 50,
				fontSize: 15,
				fontSizeType: "px",
				textAlign: "right",
				color: "white",
				backgroundImage: "inventory_slot",
				verticalAlign: 30,
				textMargin: 5,
				strokeSize: 3,
				strokeColor: "black",
				fontWeight: "italic",
				
				States:
				{
					Hover:
					{
						backgroundImage: "inventory_slot_hover"
					},
					Disabled:
					{
						backgroundImage: "inventory_slot_locked"
					}
				}
			},

			SPbutton:
			{
				width: 20,
				height: 20,
				textAlign: "center",
				color: "white",
				backgroundColor: "rgba(0, 0, 0, 0)"
			},

			ItemInfoDisplay:
			{
				width: 45,
				height: 45,
				fontSize: 18,
				fontSizeType: "px",
				textAlign: "left",
				color: "white",
				verticalAlign: 10,
				textMargin: 5,
				strokeSize: 3,
				strokeColor: "black",
				fontWeight: "italic bold"
			}
		};
		
		return styles;
	}
}