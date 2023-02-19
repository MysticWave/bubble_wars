class AI_QuestIndicator
{
	constructor(owner)
	{
		this.name = "QuestIndicator";
        owner.QuestIndicatorTexture = 'effect.quest.indicator';
        owner.showQuestIndicator = false;
        owner.QuestIndicatorOpacityTransition = new Transition(1, 0.8, 1, true, 0.02, 0.02);

        owner.onRenderFunctions.push(function(context, owner)
        {
            if(!owner.showQuestIndicator) return;

            var texture = TextureManager.Get(owner.QuestIndicatorTexture);
            var alpha = owner.QuestIndicatorOpacityTransition.Update();
            var scale = 1.5;
            var tY = 64 * owner.Scale;
            var x =  owner.x - Camera.xView;
            var y = owner.y - Camera.yView;

            Graphic.DrawRotatedAnimatedImage(context, 0, 1, '', 
                texture, x, y - tY, 64, 64, scale, 0, alpha);
        });
	}
	
	Update(owner)
	{	
        owner.showQuestIndicator = false;

		var id = owner.constructor.name.toUpperCase();
        var quests = QuestList.GetAvailableQuests(id).concat(QuestList.GetQuestsToComplete(id));

        if(quests.length > 0) 
        {
            owner.showQuestIndicator = true;

            if(owner.ageInTicks%90 == 0)
            {
                var scale = 15 * owner.Scale;
                var x = owner.x;
                var y = owner.y;
                Particle.Summon('effect.quest.particle', x, y, 0, 0, scale, 0, 1, 20, 
                {
                    liveTime: 60, 
                    owner: owner,
                    baseScale: scale,
                    center: true,
                    globalAlpha: 0.5,
                    RENDER_LAYER: Graphic.Layer.Particle0,
                    onUpdate: function(){this.x = owner.x, this.y = owner.y;this.Scale = this.baseScale - (this.baseScale * (this.ageInTicks / this.liveTime))}
                });
            }
        }
	}
}