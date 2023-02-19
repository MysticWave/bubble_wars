class SkinReaper extends SkinBase
{
    static Variants = [];

    constructor(owner)
    {
        super(owner);

        this.Name = 'SKIN.REAPER.NAME';
        this.Textures = 
        {
            Base: 'player.skin.reaper.base',
            BaseRotation: 180,

            Cape: 'player.skin.reaper.cape'
        };

        this.CapeFrames = 12;
        this.CapeAnimation = new Transition(0, this.CapeFrames -1, .75, false, 0, 0, true);

        this.Hands = 
        [
            ['player.skin.reaper.hand.left', 16, 16],
            ['player.skin.reaper.hand.right', 16, 16]
        ];
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

        var textureCape = TextureManager.Get(this.Textures.Cape);
        var frame = this.CapeAnimation.Update();

        Graphic.DrawRotatedAnimatedImage(context, frame, this.CapeFrames, 'Y', 
            textureCape, x, y, width, height, scale, baseRotation, alpha, 0, height * .5);

        Graphic.DrawRotatedImage(context, textureBase, x, y, width, height, scale, baseRotation, alpha);
    }
}
Player.InitSkin(SkinReaper);