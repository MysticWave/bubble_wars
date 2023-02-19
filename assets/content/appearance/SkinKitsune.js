class SkinKitsune extends SkinBase
{
    static Variants = [];

    constructor(owner)
    {
        super(owner);

        this.Name = 'SKIN.KITSUNE.NAME';
        this.Textures = 
        {
            Base: 'player.skin.kitsune.base',
            BaseRotation: 180,

            Tail: 'player.skin.kitsune.tail',
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
        var tails = 9;
        var tailsAngleStep = 10;
        var tailAngles = 
        [
            tailRotation - (4 * tailsAngleStep),
            tailRotation + (4 * tailsAngleStep),

            tailRotation - (3 * tailsAngleStep),
            tailRotation + (3 * tailsAngleStep),

            tailRotation - (2 * tailsAngleStep),
            tailRotation + (2 * tailsAngleStep),

            tailRotation - (1 * tailsAngleStep),
            tailRotation + (1 * tailsAngleStep),

            tailRotation
        ];
        var tailPos = MathHelper.lineToAngle([x,y], tailTranslationY, rotation+90);
        var tailFrame = this.TailAnimation.Update();

        for(var i = 0; i < tails; i++)
        {
            var dir = (i%2 == 0) ? 1 : -1;
            var f = (this.TailFrames + tailFrame + (i*dir)) % (this.TailFrames-1);
            // f = tailFrame + dir;
            Graphic.DrawRotatedAnimatedImage(context, f, this.TailFrames, 'Y', 
                textureTail, tailPos.x, tailPos.y, width, height, scale, tailAngles[i], alpha * .75, 0, ((height * .95 * scale) - tailTranslationY)/scale);
        }

        Graphic.DrawRotatedImage(context, textureBase, x, y, width, height, scale, baseRotation, alpha);
    }
}
Player.InitSkin(SkinKitsune);



class SkinKitsuneAngelic extends SkinKitsune
{
    constructor(owner)
    {
        super(owner);

        this.Name = 'SKIN.KITSUNE.ANGELIC.NAME';

        this.Textures.Base = 'player.skin.kitsune.angelic.base';
        this.Textures.Tail = 'player.skin.kitsune.angelic.tail';
    }
}
Player.InitSkin(SkinKitsuneAngelic);




class SkinKitsuneShadowflame extends SkinKitsune
{
    constructor(owner)
    {
        super(owner);

        this.Name = 'SKIN.KITSUNE.SHADOWFLAME.NAME';
        
        this.Textures.Base = 'player.skin.kitsune.shadowflame.base';
        this.Textures.Tail = 'player.skin.kitsune.shadowflame.tail';
    }
}
Player.InitSkin(SkinKitsuneShadowflame);