class ModelRifle extends ModelCannonBase
{
    constructor(texture, textureRotation , scale = 1.5, tX = 0.28, tY = -.25)
    {
        super(texture, textureRotation, scale, tX, tY)
       
        this.Texture0 = 'model.item.rifle.0';
    }

    Render(context, owner)
    {
        var x = owner.x - Camera.xView;
        var y = owner.y - Camera.yView;
        var height = owner.Height;
        var width = owner.Width;

        var s0 = width/128;
        var tY0 = (-width-44) * s0;

        var rotation = owner.Appearance.Rotation;
        var scale = owner.Appearance.Scale * this.Scale;
        var alpha = owner.Appearance.Transparency;

        var texture = TextureManager.Get(this.Texture);
        var texture0 = TextureManager.Get(this.Texture0);
        var baseRotation = rotation + this.TextureRotation + this.Rotation;

        var tX = this.translateX * width / this.Scale;
        var tY = this.translateY * height / this.Scale;

        var gaugeTranslate = (1 - owner.attackGauge) * 8;
        this.UpdateHandPose(gaugeTranslate);

        Graphic.DrawRotatedImage(context, texture, x, y, width, height, scale, baseRotation, alpha, tX, tY + gaugeTranslate);
        Graphic.DrawRotatedImage(context, texture0, x, y, width, height, scale, baseRotation, alpha, tX, tY0 + tY + gaugeTranslate);
    }
}