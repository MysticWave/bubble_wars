class ModelPlayerAnimation extends AnimationBase
{
    constructor(model)
    {
        super(model);
    }

    Update()
    {
        super.Update();

        if(this.Model.Owner.isMoving)
        {
            if(this.AnimationInfo == null)
            {
                this.Run("Walk");
            }
        }
        else
        {
            if(this.AnimationInfo != null)
            {
                if(this.AnimationInfo.id == "Walk")
                {
                    this.Break();
                }
            }
        }
    }

    Walk(Initialize)
    {
        if(Initialize)
        {
            this.AnimationInfo.Frames = 15;
            this.AnimationInfo.FrameDelay = 2;
            this.AnimationInfo.LoopMode = LOOP.RETURN;
            this.AnimationInfo.onAnimationEnd = function(){console.log("END")};

            this.AnimationInfo.onBreak = function(animation)
            {
                animation.ResetElementProperties("right_hand");
                animation.ResetElementProperties("left_hand");

                animation.ResetElementProperties("right_leg");
                animation.ResetElementProperties("left_leg");
            }
        }
        var frame = this.AnimationInfo.Frame;

        this.ApplyRotation("right_hand", 270 + frame * 2);
        this.ApplyRotation("left_hand", 310 - frame * 2);

        this.ApplyRotation("breast", 15 + frame / 2);

        this.ApplyRotation("right_leg", 20 - frame * 2.5);
        this.ApplyRotation("left_leg", 340 + frame * 2.5);
    }
}