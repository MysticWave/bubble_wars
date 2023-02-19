class ModelMagicSphere extends ModelCannonBase
{
    constructor(texture, textureRotation , scale = 2, tX, tY)
    {
        super(texture, textureRotation, scale, tX, tY);

        this.HandPose[0].y = -45;
        this.HandPose[0].x = 5;
        this.HandPose[0].rotation = 230;

        this.HandPose[1].y = -55;
        this.HandPose[1].x = -40;
        this.HandPose[1].rotation = 140;
    }

    UpdateHandPose(gaugeTranslate)
    {
        return;
    }
}