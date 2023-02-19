class SkinCatgirl extends SkinBase
{
    static Variants = [];
    
    constructor(owner)
    {
        super(owner);

        this.Name = 'SKIN.CATGIRL.NAME';
        this.Textures = 
        {
            Base: 'player.skin.catgirl.base',
            BaseRotation: 180,

            Tail: 'player.skin.catgirl.tail',
            TailRotation: 180
        };

        this.TailFrames = 12;
        this.TailAnimation = new Transition(0, this.TailFrames -1, .75, false, 0, 0, true);
    }

    Update()
    {

    }

    Render(context)
    {
        var owner = this.Owner;
        var x = owner.x - Camera.xView;
        var y = owner.y - Camera.yView;
        var height = owner.Height;
        var width = owner.Width;

        var rotation = owner.Appearance.Rotation;
        var scale = owner.Appearance.Scale;
        var alpha = owner.Appearance.Transparency;

        var textureBase = TextureManager.Get(this.Textures.Base);
        var baseRotation = rotation + this.Textures.BaseRotation;

        var textureTail = TextureManager.Get(this.Textures.Tail);
        var tailRotation = rotation + this.Textures.TailRotation;
        var tailTranslationY = height * .45 * scale;

        var tailPos = MathHelper.lineToAngle([x,y], tailTranslationY, rotation+90);
        var tailFrame = this.TailAnimation.Update();

            Graphic.DrawRotatedAnimatedImage(context, tailFrame, this.TailFrames, 'Y', 
                textureTail, tailPos.x, tailPos.y, width, height, scale, tailRotation, alpha * .75, 0, ((height * .95 * scale) - tailTranslationY)/scale);

        Graphic.DrawRotatedImage(context, textureBase, x, y, width, height, scale, baseRotation, alpha);
    }
}
// Player.InitSkin(SkinCatgirl);
