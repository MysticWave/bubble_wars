class ModelBoomerangBase extends ModelCannonBase
{
    constructor(texture, textureRotation, scale, tX, tY)
    {
        super(texture, textureRotation, scale, tX, tY);
       
        this.HandPose = 
        [
            {
                x: 0,
                y: 0,
                rotation: 230,
                tX: 0,
                tY: 0
            },
            {
                x: -50,
                y: -62,
                rotation: 210,
                tX: 0,
                tY: 0
            }
        ];

        this.showProjectile = true;
    }

    Update(owner)
    {
        var weapon = owner.GetWeapon();
        if(weapon)
        {
            this.showProjectile = weapon.GetAvailableThrows() > 0;
        }

        if(!this.showProjectile)
        {
            this.HandPose[0].x = 20;
            this.HandPose[0].y = -20;
            this.HandPose[0].rotation = 210;
        }
        else
        {
            this.HandPose[0].x = 0;
            this.HandPose[0].y = 0;
            this.HandPose[0].rotation = 230;
        }
    }

    UpdateHandPose(gaugeTranslate)
    {
        return;
        for(var i = 0; i < this.HandPose.length; i++)
        {
            this.HandPose[i].tY = gaugeTranslate;
        }
    }

    Render(context, owner)
    {
        if(!this.showProjectile) return;

        super.Render(context, owner);
    }
}