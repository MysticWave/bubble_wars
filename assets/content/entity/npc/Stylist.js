class Stylist extends EntityVillageNPC
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = Lang.Translate('NPC.STYLIST.NAME');
		this.displayName = 'NPC.STYLIST.NAME';
        this.TextureRotation = 180;

		this.SPD = 100;

		this.startDialog = 'StylistDialog';
        this.firstMetDialog = 'StylistMetDialog';

        this.Textures = 
        {
            Base: 'entity.npc.stylist.base',
            Hair: 'entity.npc.stylist.hair'
        };

        this.HairFrames = 12;
        this.HairAnimation = new Transition(0, this.HairFrames -1, 1, false, 0, 0, true);

        this.setScale(1.5);
	}

    RenderTexture(context)
    {
        var x = this.x - Camera.xView;
        var y = this.y - Camera.yView;
        var height = this.height;
        var width = this.width;

        var rotation = this.Rotation;
        var scale = this.Scale;
        var alpha = this.Transparency;

        var textureBase = TextureManager.Get(this.Textures.Base);
        var baseRotation = rotation + this.TextureRotation;

        var textureHair = TextureManager.Get(this.Textures.Hair);
        var frame = this.HairAnimation.Update();

        Graphic.DrawRotatedAnimatedImage(context, frame, this.HairFrames, 'Y', 
        textureHair, x, y, width, height, scale * 1.5, baseRotation, alpha, 0, height * .5);

        Graphic.DrawRotatedImage(context, textureBase, x, y, width, height, scale, baseRotation, alpha);
    }
}
World.RegisterEntity(Stylist);



