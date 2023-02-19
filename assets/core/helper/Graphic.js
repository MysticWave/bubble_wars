class Graphic
{
    static Initialize()
    {
        this.tCanvas = document.createElement("canvas");
        this.tCtx = this.tCanvas.getContext("2d");
        this.canvasList = [];
        this.contextList = [];

        this.postRenderFunctions = [];
        this.lightSources = [];

        this.layersInfo = {};

        this.Layer = 
        {
            BackgroundDecoration: 0,
            Background: 1,
            Particle0: 2,
            Main: 3,
            Particle: 4,
            LightLevel: 5,
            LightLevel2: 6,
            GUI: 7
        };


        this.mainCanvas = document.getElementById('canvas');
        this.mainCanvas.style.setProperty('--index', this.Layer.Main);
        this.mainCtx = this.mainCanvas.getContext('2d');

        this.canvasList[this.Layer.Main] = this.mainCanvas;
        this.contextList[this.Layer.Main] = this.mainCtx;
        this.layersInfo[this.Layer.Main] = 
        {
            visible: true,
            scale: 1,
            opacity: 1,
            name: 'Main'
        };

        this.usedLayers = [];
        this.activeLayer = 0;
        this.lastLayer = this.activeLayer;

        window.canvas = this.mainCanvas;
		window.ctx = this.mainCtx;

        this.ChangeLayer();
    }

    static createEntityPreview(entity)
    {
        var size = 1024;
        if(entity.scale > 5) size = 2048;
        this.setTempCanvas(size, size);

        var _ctx = this.tCtx;

        entity.x = 512 + Camera.xView;
        entity.y = 512 + Camera.yView;
        entity.NoAI = true;
        entity.isBoss = false;
        entity.HP = entity.MAXHP;

        entity.Model?.Update();
        entity.Render(_ctx);

        return this.cropEntityPreview(_ctx, entity);
    }

    static cropEntityPreview(ctx, entity)
    {
        var data = this.cropImageFromCanvas(ctx, true);

        entity.x -= data.cropStart.x;
        entity.y -= data.cropStart.y;
        entity.Transparency = 1;
        entity.cropData = data;
        

        return data.canvas;
    }

    static cropImageFromCanvas(ctx, getData = false) 
    {
        var data = {};
        var canvas = ctx.canvas, 
          w = canvas.width, h = canvas.height,
          pix = {x:[], y:[]},
          imageData = ctx.getImageData(0,0,canvas.width,canvas.height),
          x, y, index;

        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            index = (y * w + x) * 4;
            if (imageData.data[index+3] > 0) {
              pix.x.push(x);
              pix.y.push(y);
            } 
          }
        }
        pix.x.sort(function(a,b){return a-b});
        pix.y.sort(function(a,b){return a-b});
        var n = pix.x.length-1;
        
        w = 1 + pix.x[n] - pix.x[0];
        h = 1 + pix.y[n] - pix.y[0];

        if(isNaN(w) || isNaN(h)) return canvas;

        data.cropStart = {x: pix.x[0], y: pix.y[0]};
        data.newSize = {width: w, height: h};

        var cut = ctx.getImageData(pix.x[0], pix.y[0], w+1, h+1);
      
        canvas.width = w;
        canvas.height = h;
        ctx.putImageData(cut, 0, 0);

        if(!getData) return canvas;
        
        data.canvas = canvas;
        return data;
      }

    static DrawRotatedAnimatedImage(context, frame = 0, frames = 1, axis = 'Y', texture, x, y, width, height, scale = 1, rotation = 0, alpha = 1, tX = 0, tY = 0, ctxFunc = null, data = {})
    {
        axis = axis.toUpperCase();
        if(!isInt(frame)) frame = Math.round(frame);

        var clipWidth = (axis == 'X') ? texture.width / frames : texture.width;
        var clipHeight = (axis == 'Y') ? texture.height / frames : texture.height;

        var startX = (axis == 'X') ? clipWidth * frame : 0;
        var startY = (axis == 'Y') ? clipHeight * frame : 0;


        if(axis == 'XY')
        {
            clipWidth = texture.width / frames[0];
            clipHeight = texture.height / frames[1];

            var fX = frame%frames[0];
            var fY = Math.floor(frame/frames[0]);

            startX = clipWidth * fX;
            startY = clipHeight * fY;
        }

        if(data.clipWidth) clipWidth += data.clipWidth;
        if(data.clipHeight) clipHeight += data.clipHeight;

        if(data.startX) startX += data.startX;
        if(data.startY) startY += data.startY;


        context.save();
        if(isFunction(ctxFunc)) ctxFunc(context);
		context.translate(x, y);
		context.rotate(rotation * Math.PI/180);
		context.globalAlpha = alpha;

        context.drawImage(
            texture, startX, startY, clipWidth, clipHeight,
            -((width / 2) + tX) * scale, -((height / 2)  + tY) * scale,
            (width * scale), (height * scale)
        );

        context.restore();
    }

    static DrawRotatedImage(context, texture, x, y, width, height, scale = 1, rotation = 0, alpha = 1, tX = 0, tY = 0, ctxFunc = null)
    {
        Graphic.DrawRotatedAnimatedImage(context, 0, 1, 'Y', texture, x, y, width, height, scale, rotation, alpha, tX, tY, ctxFunc);
    }

    static ApplyShineEffect(x, y, size = 40, alpha = 1, rotation = 0)
    {
        var texture = TextureManager.Get('particleShine');

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI/180);
        ctx.globalAlpha = alpha;
        ctx.drawImage(texture, 0, 0, texture.width, texture.height, -size / 2, -size / 2, size, size);
        ctx.restore();
    }

    static Clear()
    {
        if(this.usedLayers.length > 0)
        {
            this.usedLayers.sort();

            for(var i = 0; i < this.usedLayers.length; i++)
            {
                var layer = this.usedLayers[i];
                if(this.canvasList[layer].width != this.mainCanvas.width) this.canvasList[layer].width = this.mainCanvas.width;
                if(this.canvasList[layer].height != this.mainCanvas.height) this.canvasList[layer].height = this.mainCanvas.height;
                
                this.contextList[layer].clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
            }
        }

        this.ChangeLayer();
    }

    static Render()
    {
        for(var layer in this.postRenderFunctions)
        {
            for(var i = 0; i < this.postRenderFunctions[layer].length; i++)
            {
                this.postRenderFunctions[layer][i][0](this.postRenderFunctions[layer][i][1]);
            }
        }

        this.postRenderFunctions = [];
    }

    static addPostRenderFunction(layer = this.activeLayer, method, params)
    {
        if(!this.postRenderFunctions[layer]) this.postRenderFunctions[layer] = [];
        this.postRenderFunctions[layer].push([method, params]);
    }

    static CreateLayer(layer)
    {
        this.canvasList[layer] = document.createElement("canvas");
        this.canvasList[layer].style.setProperty('--index', layer);
        this.canvasList[layer].width = this.mainCanvas.width;
        this.canvasList[layer].height = this.mainCanvas.height;
        this.layersInfo[layer] = 
        {
            visible: true,
            scale: 1,
            opacity: 1,
            name: layer
        };
        document.getElementById('render_layers').appendChild(this.canvasList[layer]);

        for(var name in this.Layer)
        {
            if(this.Layer[name] == layer)
            {
                this.layersInfo[layer].name = name;
                this.canvasList[layer].dataset.id = name;
                break;
            }
        }

        if(!this.contextList[layer]) this.contextList[layer] = this.canvasList[layer].getContext("2d");
    }

    static ChangeLayer(layer = this.Layer.Main)
    {
        this.lastLayer = this.activeLayer;
        this.activeLayer = layer;
        
        if(!this.canvasList[layer]) this.CreateLayer(layer);

        canvas = this.canvasList[layer];
        ctx = this.contextList[layer];

        if(!this.usedLayers.includes(layer)) this.usedLayers.push(layer);  
    }

    static RestoreLayer()
    {
        this.ChangeLayer(this.lastLayer);
    }
	
	 /**
	 * Draws a rounded rectangle using the current state of the canvas.
	 * If you omit the last three params, it will draw a rectangle
	 * outline with a 5 pixel border radius
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Number} x The top left x coordinate
	 * @param {Number} y The top left y coordinate
	 * @param {Number} width The width of the rectangle
	 * @param {Number} height The height of the rectangle
	 * @param {Number} [radius = 5] The corner radius; It can also be an object 
	 *                 to specify different radii for corners
	 * @param {Number} [radius.tl = 0] Top left
	 * @param {Number} [radius.tr = 0] Top right
	 * @param {Number} [radius.br = 0] Bottom right
	 * @param {Number} [radius.bl = 0] Bottom left
	 * @param {Boolean} [fill = false] Whether to fill the rectangle.
	 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
	 */
	static roundRect(context, x, y, width, height, radius = 5, fill = false, stroke = true)
	{		
		var size = height;
		if(width < height)
		{
			size = width;
		}
		size += context.lineWidth;

		if(radius > size / 2)
		{
			//zapobiega rysowaniu obramowania wiekszego niz maksymalne
			radius = Math.floor(size / 2);
		}
	
		if (typeof radius === 'number')
		{
			radius = {tl: radius, tr: radius, br: radius, bl: radius};
		}
		else
		{
			var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
			for (var side in defaultRadius)
			{
				radius[side] = radius[side] || defaultRadius[side];
			}
		}
		
		context.beginPath();
		context.moveTo(x + radius.tl, y);
		context.lineTo(x + width - radius.tr, y);
		context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		context.lineTo(x + width, y + height - radius.br);
		context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
		context.lineTo(x + radius.bl, y + height);
		context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		context.lineTo(x, y + radius.tl);
		context.quadraticCurveTo(x, y, x + radius.tl, y);
		context.closePath();
		
		if (fill)
		{
			context.fill();
		}
		
		if (stroke)
		{
			context.stroke();
		}
    }
    
    static ApplyMask(image, color, alpha = 1)
    {
        if(typeof image === "string") 
        {
            image = TextureManager.Get(image);
        }
        this.setTempCanvas(image.width, image.height);

        if(color instanceof Color)
        {
            color = color.toString();
        }

        this.tCtx.save();
        this.tCtx.globalAlpha = alpha;
        this.tCtx.fillStyle = color;
        this.tCtx.fillRect(0, 0, image.width, image.height);
        this.tCtx.globalCompositeOperation = "destination-atop";
        this.tCtx.drawImage(image, 0, 0);
        this.tCtx.restore();

        return this.tCanvas;
    }

    static addLightSource(x, y, r, type = 'CIRCLE', width, endX, endY)
    {
        this.lightSources.push({x, y, r, type, width, endX, endY});
    }

    static RenderLightLevelShader(lightLevelInfo)
	{
        if(!lightLevelInfo) return;

        var x, y, r, width;

        var overallDarkness = lightLevelInfo.overallDarkness;
        var lightSourcesRange = lightLevelInfo.lightSourcesRange;
        var lightSourcesStrength = 1 * lightLevelInfo.lightSourcesStrength;

        overallDarkness -= (1 - lightSourcesStrength) / 5;

        ChangeLayer(this.Layer.LightLevel);

            ctx.save();
            ctx.globalAlpha = overallDarkness;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();


            for(var i = 0; i < this.lightSources.length; i++)
            {
                var source = this.lightSources[i];
                x = source.x;
                y = source.y;
                r = source.r * lightSourcesRange;
                width = source.width * lightSourcesRange;

                if(source.type == 'CIRCLE')
                {
                    ctx.save();
                    ctx.globalCompositeOperation = "destination-out";
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.closePath();
                    ctx.restore();
                }
                else if(source.type == 'LINE')
                {
                    ctx.save();
                    ctx.globalCompositeOperation = "destination-out";
                    ctx.beginPath();

                    ctx.moveTo(x, y);
                    ctx.lineTo(source.endX, source.endY);
                    ctx.lineWidth = width * 2;
                    ctx.stroke();

                    ctx.closePath();
                    ctx.restore();
                }

                
            }


            if(lightSourcesStrength < 1)
            {
                ctx.save();
                ctx.globalAlpha = 1 - lightSourcesStrength;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            }

		RestoreLayer();


        if(lightLevelInfo.overallDarkness < 1)
        {
            //hide enemies
            ChangeLayer(this.Layer.Main);
            
                ctx.save();
                ctx.globalCompositeOperation = "destination-out";
                ctx.drawImage(this.canvasList[this.Layer.LightLevel], 0, 0, canvas.width, canvas.height);
                ctx.restore();

            RestoreLayer();
        }

        this.lightSources = [];
	}

    static hideShaders()
    {
        var shaders = document.querySelectorAll('.shader');
        shaders.forEach(e => e.dataset.open = 'false');
    }

    static showShader(id)
    {
        var shader = document.getElementById('shader_' + id);
        if(shader) shader.dataset.open = true;
    }

    static ApplyFullscreen()
    {
        if(Settings.Video.isFullscreen)
		{
			var element = document.body;

			element.requestFullscreen()
			.then(function() {
				// element has entered fullscreen mode successfully
			})
			.catch(function(error) {
				// element could not enter fullscreen mode
				// error message
				console.log(error.message);
			});
		}
		else
		{
			if(document.fullscreenElement)
			{
				document.exitFullscreen()
				.then(function() {
					// element has exited fullscreen mode
				})
				.catch(function(error) {
					// element could not exit fullscreen mode
					// error message
					console.log(error.message);
				});
			}
		}
    }

    static ModelToImage(model)
    {
        var width = model.Width;
        var height = model.Height;

        this.setTempCanvas(width, height);

        model.Update();
        model.Render(this.tCtx);

        var img = new Image(width, height);
            img.src = this.tCanvas.toDataURL();

        document.body.appendChild(img);

        return img;
    }

    static setTempCanvas(width, height)
    {
        this.tCanvas = document.createElement("canvas");
        this.tCtx = this.tCanvas.getContext("2d");
        this.tCanvas.width = width;
        this.tCanvas.height = height;

        this.tCtx.clearRect(0, 0, width, height);
    }


    static MatchPattern(imageData, pattern, returnAsData = false)
    {
        if(isImage(imageData))
        {
            imageData = this.getImageData(imageData);
        }
        if(isImage(pattern))
        {
            pattern = this.getImageData(pattern);
        }

        var color = new Color(0, 255, 255, 255);

        var borderData = this.GetImageBorder(imageData, color, true);
        var shadowData = this.GetImageShadow(imageData, color, true);

        var patternData = new ImageData
        (
            new Uint8ClampedArray(imageData.width * imageData.height * 4),
            imageData.width,
            imageData.height
        );

        var result = this.CompareImageData(borderData, shadowData);

        for(var i = 0; i < result.length; i++)
        {
            if(!result[i])
            {
                var id = i * 4;

                patternData.data[id] = pattern.data[id];
                patternData.data[id+1] = pattern.data[id+1];
                patternData.data[id+2] = pattern.data[id+2];
                patternData.data[id+3] = pattern.data[id+3];
            }
        }


        imageData = patternData;

        if(returnAsData)
        {
            return imageData;
        }
        return this.ImageDataToImage(imageData);
    }

    static CreatePattern(type, data)
    {
        if(typeof Pattern[type] === "function")
        {
            return Pattern[type](this.tCanvas, data);
        }
    }

    static CompareImageData(imageData1, imageData2)
    {
        var result = [];

        for(var i = 0; i < imageData1.data.length; i+=4)
        {
            var r = imageData1.data[i];
            var g = imageData1.data[i+1];
            var b = imageData1.data[i+2];
            var a = imageData1.data[i+3];

            var r2 = imageData2.data[i];
            var g2 = imageData2.data[i+1];
            var b2 = imageData2.data[i+2];
            var a2 = imageData2.data[i+3];

            if(r == r2 && g == g2 && b == b2 && a == a2)
            {
                result.push(true);
            }
            else
            {
                result.push(false);
            }
        }

        return result;
    }

    static ReplaceImageColors(imageData, colors, colorsToReplace, twoWayReplace = false, returnAsData = false)
    {
        if(isImage(imageData))
        {
            imageData = this.getImageData(imageData);
        }
        imageData = this.CopyImageData(imageData);

        for(var i = 0; i < colors.length; i++)
        {
            var color = colors[i];
            var replaceColor = colorsToReplace[i];

            for(var j = 0; j < imageData.data.length; j+=4)
            {
                var r = imageData.data[j];
                var g = imageData.data[j+1];
                var b = imageData.data[j+2];
                var a = imageData.data[j+3];

                if(r == color.r && g == color.g && b == color.b && a == color.a)
                {
                    imageData.data[j] = replaceColor.r;
                    imageData.data[j+1] = replaceColor.g;
                    imageData.data[j+2] = replaceColor.b;
                    imageData.data[j+3] = replaceColor.a;
                }
                else if(twoWayReplace)
                {
                    if(r == replaceColor.r && g == replaceColor.g && b == replaceColor.b && a == replaceColor.a)
                    {
                        imageData.data[j] = color.r;
                        imageData.data[j+1] = color.g;
                        imageData.data[j+2] = color.b;
                        imageData.data[j+3] = color.a;
                    }
                }
            }
        }

        if(returnAsData)
        {
            return imageData;
        }
        return this.ImageDataToImage(imageData);
    }

    static CopyImageData(imageData)
    {
        var copy = new ImageData
        (
            new Uint8ClampedArray(imageData.data),
            imageData.width,
            imageData.height
        );

        return copy;
    }


    static GetImageBorder(imageData, color = new Color(0, 255, 255, 255), returnAsData = false)
    {
        if(isImage(imageData))
        {
            imageData = this.getImageData(imageData);
        }

        imageData = this.CopyImageData(imageData);


        var width = imageData.width;
        var height = imageData.height;

        var toCut = [];

        for(var i = 0; i < height; i++)
        {
            for(var j = 0; j < width; j++)
            {
                var id = (i * width + j) * 4;

                var r = imageData.data[id];
                var g = imageData.data[id+1];
                var b = imageData.data[id+2];
                var a = imageData.data[id+3];

                var leftR, leftG, leftB, leftA,
                    rightR, rightG, rightB, rightA,
                    upR, upG, upB, upA,
                    downR, downG, downB, downA;

                if(j > 0)
                {
                    var leftId = (i * width + j - 1) * 4;

                    leftR = imageData.data[leftId];
                    leftG = imageData.data[leftId+1];
                    leftB = imageData.data[leftId+2];
                    leftA = imageData.data[leftId+3];
                }

                if(j < width - 1)
                {
                    var rightId = (i * width + j + 1) * 4;

                    rightR = imageData.data[rightId];
                    rightG = imageData.data[rightId+1];
                    rightB = imageData.data[rightId+2];
                    rightA = imageData.data[rightId+3];
                }

                if(i > 0)
                {
                    var upId = ((i - 1) * width + j) * 4;

                    upR = imageData.data[upId];
                    upG = imageData.data[upId+1];
                    upB = imageData.data[upId+2];
                    upA = imageData.data[upId+3];
                }

                if(i < height - 1)
                {
                    var downId = ((i + 1) * width + j) * 4;

                    downR = imageData.data[downId];
                    downG = imageData.data[downId+1];
                    downB = imageData.data[downId+2];
                    downA = imageData.data[downId+3];
                }
  

                if(
                    (r != 0 || g != 0 || b != 0 || a != 0) &&
                    (
                        (
                            (j == 0) ||
                            (i == 0) ||
                            (i == height - 1) ||
                            (j == width - 1)
                        ) ||
                        (
                            (leftR == 0 && leftG == 0 && leftB == 0 && leftA == 0) ||
                            (rightR == 0 && rightG == 0 && rightB == 0 && rightA == 0) ||
                            (upR == 0 && upG == 0 && upB == 0 && upA == 0) ||
                            (downR == 0 && downG == 0 && downB == 0 && downA == 0)
                        )
                    )
                )
                {
                    imageData.data[id] = color.r;
                    imageData.data[id+1] = color.g;
                    imageData.data[id+2] = color.b;
                    imageData.data[id+3] = color.a;
                }
                else
                {
                    toCut.push(id);
                }
            }
        }

        for(var i = 0; i < toCut.length; i++)
        {
            id = toCut[i];

            imageData.data[id] = 0;
            imageData.data[id+1] = 0;
            imageData.data[id+2] = 0;
            imageData.data[id+3] = 0;
        }

        if(returnAsData)
        {
            return imageData;
        }
        return this.ImageDataToImage(imageData);
    }

    static GetImageShadow(imageData, color = new Color(255, 0, 0, 255), returnAsData = false)
    {
        if(isImage(imageData))
        {
            imageData = this.getImageData(imageData);
        }
        imageData = this.CopyImageData(imageData);

        for(var i = 0; i < imageData.data.length; i+=4)
        {
            var r = imageData.data[i];
            var g = imageData.data[i+1];
            var b = imageData.data[i+2];
            var a = imageData.data[i+3];

            if(r != 0 || g != 0 || b != 0 || a !=0)
            {
                imageData.data[i] = color.r;
                imageData.data[i+1] = color.g;
                imageData.data[i+2] = color.b;
                imageData.data[i+3] = color.a;
            }
        }

        if(returnAsData)
        {
            return imageData;
        }
        return this.ImageDataToImage(imageData);
    }

    static getImageData(image)
    {
        var width = image.width;
        var height = image.height;

        this.setTempCanvas(width, height);
        this.tCtx.drawImage(image, 0, 0, width, height);

        return this.tCtx.getImageData(0, 0, width, height);
    }


    static ImageDataToImage(imageData)
    {
        this.setTempCanvas(imageData.width, imageData.height);
        this.tCtx.putImageData(imageData, 0, 0);

        var img = new Image(imageData.width, imageData.height);
            img.src = this.tCanvas.toDataURL();

        return img;
    }

    static drawCircleWithBreaks(ctx, centerX, centerY, radius, breaks, breakSize, stroke, fill, startAngle = 0)
    {
        var angleStep = (360 - (breakSize * breaks) ) / breaks;

        var startAngle = startAngle + breakSize / 2;
        var endAngle = 0;

        
        for(var i = 0; i < breaks; i++)
        {
            endAngle = startAngle + angleStep;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, MathHelper.ToRadians(startAngle), MathHelper.ToRadians(endAngle));
            

            if (fill)
            {
                ctx.fill();
            }
            
            if (stroke)
            {
                ctx.stroke();
            }

            startAngle += angleStep + breakSize;
        }
        ctx.closePath();
    }


    static drawCircleWithBreaksOnSides(ctx, centerX, centerY, radius, Sides, breakSize, stroke, fill)
    {
        this.drawCircleWithBreaks(ctx, centerX, centerY, radius, 4, breakSize, stroke, fill);

        var startAngle = 0;
        var endAngle = 360;
        var angles = [];

        if(!Sides.top)
        {
            angles.push(270 - (breakSize / 2));
        }

        if(!Sides.left)
        {
            angles.push(180 - (breakSize / 2));
        }

        if(!Sides.bottom)
        {
            angles.push(90 - (breakSize / 2));
        }

        if(!Sides.right)
        {
            angles.push(0 - (breakSize / 2));
        }

        for(var i = 0; i < angles.length; i++)
        {
            startAngle = angles[i];
            endAngle = startAngle + breakSize;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, MathHelper.ToRadians(startAngle), MathHelper.ToRadians(endAngle));

            if (fill)
            {
                ctx.fill();
            }
            
            if (stroke)
            {
                ctx.stroke();
            }
        }
        ctx.closePath();
    }

    static WrapText(text, maxWidth, style)
    {
        var words = text.split(' '),
            lines = [],
            line = "";

        if (Style.GetTextSize(text, style).width < maxWidth) 
        {
            return [text];
        }

        while (words.length > 0) 
        {
            var split = false;
            while (Style.GetTextSize(words[0], style).width >= maxWidth) 
            {
                var tmp = words[0];
                words[0] = tmp.slice(0, -1);
                if (!split) 
                {
                    split = true;
                    words.splice(1, 0, tmp.slice(-1));
                } else 
                {
                    words[1] = tmp.slice(-1) + words[1];
                }
            }

            if (Style.GetTextSize(line + words[0], style).width < maxWidth) 
            {
                line += words.shift() + " ";
            } 
            else 
            {
                lines.push(line);
                line = "";
            }

            if (words.length === 0) 
            {
                lines.push(line);
            }
        }

        return lines;
    }

    static Shade(image, x, y, time, onEnd = null)
    {
        var step = 1 / time;

        var img = 
        {
            img: image,
            x: x,
            y: y,
            step: step,
            time: time,
            frame: 0,
            onEnd: onEnd
        };

        this.toShade.push(img);
    }
}

class Color
{
    constructor(r, g, b, a = 1)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toString()
    {
        var a = this.a;
        if(this.a > 1)
        {
            a = this.a / 255;
        }
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + a + ")";
    }
}

class Transition
{
    constructor(from, to, time, reverse = false, reverseDelay = 0, unreverseDelay, repeat = false)
    {
        this.ageInTicks = 1;
        this.reverseTicks = 0;
        this.dir = 1;
        this.To = to;
        this.From = from;
        this.Time = time * Main.FPS;
        this.step = (to - from) / this.Time;
        this.Reverse = reverse;
        this.Repeat = repeat;
        this.ReverseDelay = reverseDelay * Main.FPS;
        this.unreverseDelay = (unreverseDelay != undefined) ? unreverseDelay * Main.FPS : this.ReverseDelay;
        this.isReverseTick = false;
        this.isUnreverseTick = false;
    }

    RandomizeTicks()
    {
        this.ageInTicks = MathHelper.randomInRange(0, this.Time);
    }

    RandomizeDelay(useUnreverseDelay, percentage)
    {
        this.RandomizeStartUpDelay(useUnreverseDelay);
        this.RandomizeInTickDelay(useUnreverseDelay, percentage);
    }

    RandomizeInTickDelay(useUnreverseDelay = false, percentage = 10)
    {
        if(useUnreverseDelay)
        {
            this.randomUnreverseDelayPercentage = percentage;
        }
        else
        {
            this.randomReverseDelayPercentage = percentage;
        }  
    }

    RandomizeStartUpDelay(useUnreverseDelay = false)
    {
        if(useUnreverseDelay)
        {
            this.reverseTicks = MathHelper.randomInRange(0, this.unreverseDelay);
            this.dir = -1;
        }
        else
        {
            this.reverseTicks = MathHelper.randomInRange(0, this.ReverseDelay);
            this.dir = 1;
        }
    }

    Update()
    {
        this.isReverseTick = false;
        this.isUnreverseTick = false;

        if( (this.ageInTicks < this.Time) && (this.ageInTicks > 0))
        {
            this.ageInTicks += this.dir;
        }
        else
        {
            if(this.Repeat)
            {
                this.ageInTicks = 1;
                this.isReverseTick = true;
            }
            else if(this.Reverse)
            {
                if(this.dir == 1)
                {
                    if(this.reverseTicks > this.ReverseDelay)
                    {
                        this.ageInTicks = this.Time - 1;
                        this.reverseTicks = 0;
                        this.dir = -1;
                        this.isUnreverseTick = true;

                        if(this.randomUnreverseDelayPercentage)
                        {
                            var value = Math.round(this.unreverseDelay * this.randomUnreverseDelayPercentage / 100);
                            this.reverseTicks = MathHelper.randomInRange(0, value);
                        }
                    }
                    else
                    {
                        this.reverseTicks++;
                    }
                }
                else
                {
                    if(this.reverseTicks > this.unreverseDelay)
                    {
                        this.ageInTicks = 1;
                        this.reverseTicks = 0;
                        this.dir = 1;
                        this.isReverseTick = true;


                        if(this.randomReverseDelayPercentage)
                        {
                            var value = Math.round(this.ReverseDelay * this.randomReverseDelayPercentage / 100);
                            this.reverseTicks = MathHelper.randomInRange(0, value);
                        }
                    }
                    else
                    {
                        this.reverseTicks++;
                    }
                }
            }
        }
        
        return this.Get();
    }

    Get()
    {
        if(this.dir == 1)
        {
            return this.From + (this.step * this.ageInTicks);
        }
        return this.To - (this.step * (this.Time - this.ageInTicks));
    }
}

class Pattern
{
    static Grid(tCanvas, data, returnAsData)
    {
        var width = data.width || 0;
        var height = data.height || 0;
        var size = data.size || 0;
        var color = data.color || new Color(0, 0, 0, 0);
        var backgroundColor = data.backgroundColor || false;

        Graphic.setTempCanvas(width, height);
        var tCtx = tCanvas.getContext("2d");

        if(backgroundColor)
        {
            tCtx.save();
            tCtx.fillStyle = backgroundColor.toString();
            tCtx.fillRect(0, 0, width, height);
            tCtx.restore();
        }

        for(var i = 0; i < height; i+= size)
        {
            tCtx.save();
            tCtx.fillStyle = color.toString();
            tCtx.fillRect(0, i, width, 1);
            tCtx.restore();
        }

        for(var j = 0; j < width; j+= size)
        {
            tCtx.save();
            tCtx.fillStyle = color.toString();
            tCtx.fillRect(j, 0, 1, height);
            tCtx.restore();
        }

        var img = new Image(width, height);
            img.src = tCanvas.toDataURL();

        if(returnAsData)
        {
            return Graphic.getImageData(img);
        }
        return img;
    }
}




class LightLevel
{
    constructor(overallDarkness = .9, lightSourcesRange = 1, lightSourcesStrength = 1)
    {
        this.overallDarkness = overallDarkness;
        this.lightSourcesRange = lightSourcesRange;
        this.lightSourcesStrength = lightSourcesStrength;
    }
}