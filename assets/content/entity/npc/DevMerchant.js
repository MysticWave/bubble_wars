class DevMerchant extends EntityVillageNPC
{
	constructor(x, y)
	{
		super(x, y);
		
		this.name = 'Giovanni Lasagna';

		this.TextureRotation = 180;

		this.Textures = 
        {
            Base: 'entity.npc.chief.base',
            Hat: 'entity.npc.chief.hat'
        };

		this.SPD = 100;
		
		this.AI.Apply(new AI_TradeAble(this, Math.ceil(ItemHelper.totalItems/9) * 9));

		this.startDialog = 'DevMerchantStart';
        this.firstMetDialog = 'DevMerchantStart';
		this.setScale(2);
	}

	onTrade()
	{
		this.inventory = [];

		var itemList = ItemHelper.Items;

		for(var i in itemList)
		{
			var item = Item.Get(i);
                item.inShopPrice = 1;

            var c = (item.stackAble) ? item.maxStackSize : 1;

			this.addItemToInventory(item, c, true);
		}
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
        var textureHat = TextureManager.Get(this.Textures.Hat);
        var baseRotation = rotation + this.TextureRotation;

        var hatOffset = 25 * (height/textureHat.height);

        Graphic.DrawRotatedImage(context, textureBase, x, y, width, height, scale, baseRotation, alpha);
        Graphic.DrawRotatedImage(context, textureHat, x, y, width, height, scale * 1.6, baseRotation, alpha, 0, hatOffset);
    }
}
World.RegisterEntity(DevMerchant);



