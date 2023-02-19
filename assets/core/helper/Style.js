class Style
{
	static Load()
	{
		this.styles = StylesTest.Get();
	}
	
	static GetProperties()
	{
		return Object.keys(Style.GetDefault());
	}
	
	static GetDefault()
	{
		var Default = {							//Zbior wszystkich dostepnych atrybutow oraz ich wartosci domyslnej
			color: "white",						//kolor czcionki
			placeHolder: "gray",				//kolor placeholder w input type text
			fontSize: 18,						//wielkosc czcionki
			fontSizeType: "px",					//rodzaj czcionki (px / %)
			textAlign: "center",				//kierunek tekstu (left / center / right)
			textMargin: 0,						//margines tekstu od krawedzi po bokach
			verticalAlign: "center",			//margines tekstu od gory (lub center)
			strokeColor: "black",				//kolor obramowania tekstu
			strokeSize: 2,						//wielkosc obramowania
			fontStyle: "Helvetica",			//rodzaj czcionki
			fontWeight: "bold",					// ozdoba tekstu (bold / italic)
			width: 10,							//szerokosc
			height: 10,							//wysokosc
			backgroundColor: "lightgray",		//kolor tla
			borderSize: 0,						//wielksoc obramowania
			borderColor: "rgba(0, 0, 0, 0)",	//kolor obramowania
			cursor: "default",							//kursor
			progressBar: "black",				//kolor wypelnienia progressbar
			progressDisplay: "%",				//sposob wyswietlenia postepu (n / n lub n%)
			backgroundImage: false,				//obrazek tla
			borderImage: false,					//obrazek obramowania
			progressImage: false,				//obrazek paska postepu
			Animation: null,
			borderRadius: 0,					//promien obramowania
			sliderPointer: null					//wskaznik na sliderze
		};
		
		return Default;
	}
	
	static GetStyleByName(name, state = false)
	{
		var Style = this.GetDefault();
		var styleSheet = this.styles[name] || false;
		
		if(styleSheet)
		{	
			Style = this.compareStyles(Style, styleSheet);
			
			if(styleSheet.States)
			{
				switch(state)
				{
					case STATE.HOVER:
						if(styleSheet.States.Hover)
						{
							Style = this.compareStyles(Style, styleSheet.States.Hover);
						}
						break;
					case STATE.DISABLED:
						if(styleSheet.States.Disabled)
						{
							Style = this.compareStyles(Style, styleSheet.States.Disabled);
						}
						break;
				}
				
			}
		}
		
		return Style;
	}
	
	static compareStyles(base, toCompare)
	{
		var Properties = this.GetProperties();
		
		for(var i = 0; i < Properties.length; i++)
		{
			var property = Properties[i];
			
			if(toCompare[property])
			{
				base[property] = toCompare[property];
			}
		}
		
		return base;
	}
	
	/**
	 * Draw specific text.
	 * @param {CanvasRenderingContext2D} ctx 
	 * @param {*} obj 
	 * @param {String} inner Text to be drawn.
	 * @param {Number} x1 x-coordinate.
	 * @param {Number} y1 y-coordinate.
	 * @param {Color} color1 Color of text.
	 * @param {Color} strokeColor1 Color of stroke.
	 * @param {Number} alpha Alpha channel.
	 */
	static FillText(ctx, obj, text, x1, y1, color1, strokeColor1, alpha = 1)
	{

		var style = obj.style;

		if(style)
		{
			var height = style.height || obj.height;
			var width = style.width || obj.width;
		}
		else
		{
			style = this.GetDefault();
			var height = obj.height;
			var width = obj.width;
		}
		
		var posX = x1 || obj.x;
		var posY = y1 || obj.y;
		
		var color = color1 || style.color;
		var strokeColor = strokeColor1 || style.strokeColor;
		
		if(style.fontSizeType == "%")
		{
			style.font = (canvas.height * style.fontSize) / 100;
		}
		else
		{
			style.font = style.fontSize;
		}
		
		
		
		
		if(!text) text = obj.text;

			
		if(style.verticalAlign == "center")
		{
			var y = posY + (height / 2) + (style.font / 4);
		}
		else
		{
			var y = posY + style.verticalAlign + style.font;
		}
			
			
		if(style.textAlign == "center")
		{
			var x = posX + (width / 2);
		}
			
		if(style.textAlign == "left")
		{
			var x = posX + style.textMargin;
		}
			
		if(style.textAlign == "right")
		{
			var x = posX + width - style.textMargin;
		}
		
		ctx.save();
		ctx.globalAlpha = alpha;
		ctx.font = style.fontWeight + " " + style.font + "px " + style.fontStyle;
		ctx.fillStyle = color;
		ctx.textAlign = style.textAlign;
		
		if(style.strokeSize)
		{
			ctx.strokeStyle = strokeColor;
			ctx.lineWidth = style.strokeSize;
			ctx.strokeText(text, x, y);
		}
		
		ctx.fillText(text, x, y);
		ctx.restore();
		
		
	}

	static GetTextSize(text, style)
	{
		if(style.fontSizeType == "%")
		{
			var font = (canvas.height * style.fontSize) / 100;
		}
		else
		{
			var font = style.fontSize;
		}

		
        ctx.save();
        ctx.font = style.fontWeight + " " + font + "px " + style.fontStyle;
		var width = ctx.measureText(text).width;
		var height = ctx.measureText("M").width;
		ctx.restore();

        return {width: width, height: height};
	}

	static GetCustomTextColor(text)
	{
		var color = null;
		if(text[0] == "<")    //specjalny kolor musi sie zaczynac od <
		{
			var end = text.indexOf(">");
			color = text.slice(1, end);
		}

		if(color)
		{
			text = text.replace('<'+color+'>', '');
			//used CSS variable
			if(color.startsWith('--'))
			{
				color = getCssVariable(document.body, color).trim();
			}
		}

		return {color, text};
	}

	static ColorizeTextParts(text)
	{
		var color = null;
		var lastIndex = -1;
		var s = '<';
		var e = '>';
		var start,end, textEnd, span, textPart, CSSColor, replacePart;
		var newText = '';

		while(true)
		{
			replacePart = null;
			start = text.indexOf(s);
			if(start == -1 && lastIndex == -1) return text;	//there is no part to colorize
			if(start == -1) break;
			if(lastIndex == start) break;	//there is no color left

			end = text.indexOf(';');
			textEnd = text.indexOf(e);

			if(start != 0) 
			{
				replacePart = text.slice(0, start);
				newText += replacePart;
			}

			color = text.slice(start+1, end);
			CSSColor = color;
			if(color.startsWith('--')) CSSColor = getCssVariable(document.body, color).trim();

			textPart = text.slice(end+1, textEnd);
			span = '<span style="color: '+CSSColor+';">'+textPart+'</span>';

			if(color.startsWith('data-')) span = '<span class="line" '+color+'>'+textPart+'</span>';


			if(replacePart) text = text.replace(replacePart, '');
			text = text.replace(s+color+';'+textPart+e, '');
			newText += span;

			lastIndex = start;
		}

		if(text != '') newText += text;
		
		return newText;
	}

	static InjectColor(text, color = null, autoTranslate = true)
	{
		var type = color;
		if(type == 'DATA') color = null;

		if(!color)
		{
			//auto use grade colors
			if(Object.values(GRADE).indexOf(text) != -1) 
			{
				if(type == 'DATA') color = 'data-grade="'+text+'"';
				else color = '--color-grade-'+text.replace('GRADE_', '').toLowerCase();
				if(autoTranslate) text = Lang.Get(text);
			}
		}

		if(!color) return text;

		return '<'+color+';'+text+'>';
	}

	static DottedText(text)
	{	
		if(text == null) return;
		text = text.toString();
		
		var length = text.length;
		var textParts = [];
		var number = 0;
		var tempText = "";
		var newText = "";
		
		for(var num = length - 1; num >= 0; num--)
		{
			if(number == 3)
			{
				textParts.push(tempText);
				tempText = "";
				number = 1;
			}
			else
			 {
				number++;
			}
			
			tempText += text[num];
		}
		
		if(tempText != "") 
		{
			textParts.push(tempText);
			tempText = "";
		}
		
		
		for(var num = textParts.length - 1; num >= 0; num--) 
		{
			for(var num2 = textParts[num].length - 1; num2 >= 0; num2--)
			{
				newText += textParts[num][num2];
			}
			if(num != 0)		//nie dodaje kropki po ostatniej cyfrze
			{		
				newText += ".";
			}
			
			
		}
		
		return newText;
	}
	
	static getCenterPosition(className)
	{
		var style = Style.GetStyleByName(className);
		var x = canvas.width / 2 - style.width / 2;
		var y = canvas.height / 2 - style.height / 2;
		
		return {x: x, y: y};
	}
}