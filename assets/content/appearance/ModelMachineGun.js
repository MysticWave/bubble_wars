class ModelMachineGun extends ModelCannonBase
{
    constructor(texture, textureRotation , scale = 2, tX, tY)
    {
        super(texture, textureRotation, scale, tX, tY)
       
        this.Texture0 = 'model.item.machine.gun.0';
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

        var s0 = width/128;
        var width0 = 32 * s0;
        var height0 = 40 * s0;
        var tY0 = -44 * s0;

        var rotation = owner.Appearance.Rotation;
        var scale = owner.Appearance.Scale * this.Scale;
        var alpha = owner.Appearance.Transparency;

        var texture = TextureManager.Get(this.Texture);
        var texture0 = TextureManager.Get(this.Texture0);
        var baseRotation = rotation + this.TextureRotation + this.Rotation;

        var tX = this.translateX * width / this.Scale;
        var tY = this.translateY * height / this.Scale;

        var gaugeTranslate = (1 - owner.attackGauge) * 8 / 4;
        this.UpdateHandPose(gaugeTranslate);

        var frames = 4;
        var frame = owner.ageInTicks%frames;
        if(!owner.isAttacking) frame = 0;

        Graphic.DrawRotatedImage(context, texture, x, y, width, height, scale, baseRotation, alpha, tX, tY + gaugeTranslate);
        Graphic.DrawRotatedAnimatedImage(context, frame, frames, 'X', texture0, x, y, width0, height0, scale, baseRotation, alpha, tX, tY0 + tY + gaugeTranslate);
    }
}