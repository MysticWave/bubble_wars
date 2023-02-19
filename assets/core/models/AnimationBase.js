class AnimationBase
{
    constructor(model, data = [], duration = 1, triggerFunction = function(){return true}, keepLastValues = true)
    {
        this.Model = model;
        this.Owner = model.Owner;
        this.Duration = duration * Main.FPS;
        this.ageInTicks = 0;
        this.Data = data;
        this.triggerFunction = triggerFunction;
        this.Progress = 0;
        this.keepLastValues = keepLastValues;

        this.completeAt = 1;
        this.revertAt = null;
        this.FreezeAnimation = false;
        this.resetParts = true;
        this.iteration = 0;
        this.iterations = 1;
        this.lastDuration = this.Duration;

        this.setAnimationSpacing(this.completeAt, this.revertAt);
    }

    setAnimationSpacing(completeAt = 1, revertAt = null)
    {
        if(revertAt == null) revertAt = 1 - completeAt;
        this.completeAt = completeAt;
        this.revertAt = revertAt;

        var d = this.getAnimationDuration();

        this.ticksToComplete = d * this.completeAt;
        this.ticksToRevert = d * this.revertAt;
    }

    getAnimationDuration()
    {
        return this.Duration;
    }

    setAnimationDuration(duration)
    {
        this.Duration = Math.ceil(duration);
        this.lastDuration = this.Duration;
    }

    Update()
    {
        if(!this.triggerFunction?.(this)) 
        {
            if(this.ageInTicks == 0) return;

            //if animation cannot be played reset it
            if(!this.FreezeAnimation) 
            {
                this.ageInTicks = 0;
                if(this.resetParts) this.ResetParts();
            }
            return;
        }
        var reverting = false;
        var duration = this.getAnimationDuration();
        this.ageInTicks++;
        this.Progress = this.ageInTicks / duration;

        if(this.lastDuration != duration)
        {
            this.setAnimationSpacing(this.completeAt, this.revertAt);
            this.Progress = this.ageInTicks / this.lastDuration;
            this.ageInTicks = Math.floor(duration * this.Progress);       //set ticks to match new duration
        }

        if(this.ageInTicks == duration)
        {
            this.iteration++;
            this.ageInTicks = -1;
            return;
        }
        if(this.ageInTicks > duration && (this.iterations != 'INFINITE' && this.iteration >= this.iterations)) return;
  

        var animation_progress = this.Progress;
        if(this.ageInTicks <= this.ticksToComplete)
        {
            animation_progress = this.ageInTicks / this.ticksToComplete;
        }
        if(this.ageInTicks >= this.ticksToRevert && this.revertAt)
        {
            var step = duration - this.ticksToRevert;
            var p = (this.ageInTicks - this.ticksToRevert) / step;
            animation_progress = 1 - p;
            reverting = true;
        }

        //freeze animation beetwen complete and revert
        if(this.ageInTicks > this.ticksToComplete && this.revertAt && this.ageInTicks < this.ticksToRevert) return;

        for(var i in this.Data)
        {
            var data = this.Data[i];
            var part = data.partName;
            var property = data.propertyName;
            var to_move = data.To - data.From;
            var p = animation_progress;

            if(data.Direction == -1) p = 1 - animation_progress;
            var step = to_move * p;

            if(property == 'Rotation') property = 'selfRotation';
            set(this.Model.Parts[part], property, data.From+step, true);
        }

        this.lastDuration = duration;
    }

    ResetParts()
    {
        for(var i in this.Data)
        {
            var data = this.Data[i];
            var part = this.Model.Parts[data.partName];

            part.ResetProperties();
        }
    }


    ApplyRotation(partName, rotation)
    {
        this.Model.Parts[partName].selfRotation = rotation;
    }

    ApplyTransform(partName, x, y)
    {
        this.Model.Parts[partName].Transform.x = x;
        this.Model.Parts[partName].Transform.y = y;
    }

    ResetElementProperties(partName)
    {
        this.Model.Parts[partName].ResetProperties();
    }

    ApplyTransform(partName, transformX, transformY)
    {
        this.Model.Parts[partName].Transform = {x: transformX, y: transformY};
    }

}

class AnimationData
{
    constructor(partName, propertyName, from, to, direction = 1)
    {
        this.partName = partName;
        this.propertyName = propertyName;
        this.From = from;
        this.To = to;
        this.Direction = direction;
    }
}

class AnimationInfo
{
    constructor(data, owner, id)
    {
        this.owner = owner;
        this.id = id;
        this.cancelAble = true;
        this.Frames = 0;
        this.FrameDelay = 1;
        this.Frame = 0;
        this.FrameDirection = 1;
        this.TimeInTicks = 0;
        this.LoopMode = LOOP.BREAK;

        this.onAnimationEnd = null;
        this.onBreak = null;

        if(data)
        {
            if(isObject(data))
            {
                for(var property in data)
                {
                    this[property] = data[property];
                }
            }
        }
    }

    Update()
    {
        this.TimeInTicks++;

        //co ile klatek animacja ma byc aktualizowana
        if(this.TimeInTicks % this.FrameDelay == 0)
        {
            if(this.owner && this.id)
            {
                if(typeof this.owner[this.id] === "function")
                {
                    this.owner[this.id]();
                }
            }

            this.Frame += 1 * this.FrameDirection;
            if( (this.Frame > this.Frames - 1) || (this.Frame == -1))
            {
                switch(this.LoopMode)
                {
                    case LOOP.BREAK:
                        if(this.onAnimationEnd)
                        {
                            this.onAnimationEnd();
                        }
                        this.Break();
                        break;

                    case LOOP.RETURN:
                        this.FrameDirection *= -1;
                        this.Frame = (this.Frame == -1) ? 1 : this.Frame - 2;
                        break;

                    case LOOP.CONTINUE:
                        this.Frame = 0;
                        break;
                }
            }
        }
    }
}