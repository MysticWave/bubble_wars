class SkinBase
{
    static Variants = [];

    constructor(owner)
    {
        this.Name = 'SKIN.BASE.NAME';
        this.Owner = owner;
        this.Textures = 
        {
            Base: 'player.skin.base',
            BaseRotation: 180
        };

        this.Hands = 
        [
            ['entity.npc.hand.left', 16, 16],
            ['entity.npc.hand.right', 16, 16]
        ];

    }

    static InitVariant(skin)
    {
        this.Variants.push(skin);
        skin.isVariant = true;
    }

    Update()
    {

    }

    RenderHands(context)
    {
        var owner = this.Owner;
        if(!owner.GetWeapon()) return;

        var ownerX = owner.x - Camera.xView;
        var ownerY = owner.y - Camera.yView;
        
        var owner_rotation = owner.Appearance.Rotation;
        var scale = owner.Appearance.Scale;
        var alpha = owner.Appearance.Transparency;
        var weaponModel = owner.GetCurrentWeaponModel();

        var hands = this.Hands;

		for(var i = 0; i < hands.length; i++)
		{
			var hand = hands[i];
            var weaponHandPose = weaponModel.HandPose[i];

			var texture = TextureManager.Get(hand[0]);
			var tX = weaponHandPose.tX ?? 0;
			var tY = weaponHandPose.tY ?? 0;
            var handX = weaponHandPose.x ?? 0;
            var handY = weaponHandPose.y ?? 0;

            var width = hand[1] ?? 16;
			var height = hand[2] ?? 16;

            var endPoints = [
                (ownerX + (owner.Width * scale * .5) + (tX + handX - (width/2)) * scale),
                (ownerY + (owner.Height * scale * .5) + (tY + handY - (height/2)) * scale)
            ];
            var pos = MathHelper.RotatePoint([ownerX, ownerY], owner_rotation + weaponModel.Rotation, endPoints);

			var rotation = weaponHandPose.rotation ?? hand[5] ?? 0;

			context.save();
			context.translate(pos.x, pos.y);
			context.rotate((owner_rotation + rotation) * Math.PI/180);
			context.globalAlpha = alpha;
			context.drawImage(
				texture, 0, 0, texture.width, texture.height,
				-((width / 2)) * scale, -((height / 2)) * scale,
				(width * scale), (height * scale)
			);
			context.restore();
		}
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

        Graphic.DrawRotatedImage(context, textureBase, x, y, width, height, scale, baseRotation, alpha);
    }
}
Player.InitSkin(SkinBase);

class SkinBaseF extends SkinBase
{
    constructor(owner)
    {
        super(owner);
        this.Name = 'SKIN.BASE.F.NAME';
        this.Textures = 
        {
            Base: 'player.skin.base.f',
            BaseRotation: 180
        };
    }
}
Player.InitSkin(SkinBaseF);