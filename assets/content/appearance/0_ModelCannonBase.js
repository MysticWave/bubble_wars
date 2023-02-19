class ModelCannonBase
{
    constructor(texture, textureRotation , scale, tX, tY)
    {
        this.Texture = texture;
        this.TextureRotation = textureRotation ?? 180;
        this.Rotation = -10;
        this.Scale = scale ?? 1;
        this.translateX = tX ?? .3;
        this.translateY = tY ?? -.45;

        this.HandPose = 
        [
            {
                x: -8,
                y: -44,
                rotation: 210,
                tX: 0,
                tY: 0
            },
            {
                x: -12,
                y: -62,
                rotation: 210,
                tX: 0,
                tY: 0
            }
        ];
    }

    Update(owner)
    {

    }

    UpdateHandPose(gaugeTranslate)
    {
        for(var i = 0; i < this.HandPose.length; i++)
        {
            this.HandPose[i].tY = gaugeTranslate;
        }
    }

    Render(context, owner)
    {
        var x = owner.x - Camera.xView;
        var y = owner.y - Camera.yView;
        var height = owner.Height;
        var width = owner.Width;

        var rotation = owner.Appearance.Rotation;
        var scale = owner.Appearance.Scale * this.Scale;
        var alpha = owner.Appearance.Transparency;

        var texture = TextureManager.Get(this.Texture);
        var baseRotation = rotation + this.TextureRotation + this.Rotation;

        var tX = this.translateX * width / this.Scale;
        var tY = this.translateY * height / this.Scale;

        var gaugeTranslate = (1 - owner.attackGauge) * 8;
        this.UpdateHandPose(gaugeTranslate);

        Graphic.DrawRotatedImage(context, texture, x, y, width, height, scale, baseRotation, alpha, tX, tY + gaugeTranslate);
    }
}