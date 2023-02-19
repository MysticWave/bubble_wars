
class Item
{
	constructor()
	{
		this.maxStackSize = 999;
		
		this.count = 1;
		this.type = TYPE.ITEM;

		this.slot = "";
		this.name = "";

		this.stackAble = true;		//przedmiot mozna stackowac
		this.pickAble = true;		//przedmiot moze zostac podniesiony (z ziemi)
		this.equipAble = false;		//przedmiot mozna zalozyc
		this.shineStrength = 0;				//sila polysku
		this.showNewItemInfo = false; 		//czy ma pokazywac 'New!'
		this.price = 0;

		this.inShopPrice = 0;		//cena w sklepie
		this.isInShop = false;		//przedmiot znajduje sie w ekwipunku handlarza
		this.isFromMerchant = false;

		this.Recipe = null;
		this.showInBubble = true;		//render bubble when item is on floor
		this.onFloorScale = 1;
		this.canBeDroppedOut = true;	//can you throw this item away ?
		this.isUnique = false;			//unique items cannot be thrown away
		this.showGrade = true;
		this.canBeSold = true;
		this.showPriceInfo = true;

		this.restrictTypes = 0;	//only certain number of items with this type can be equipped
		this.Lore = null;
		this.Description = null;
		this.ARGS = {};
		this.FILTER = '';
	}

	GetPrimaryBonuses()
	{
		return this.primary ?? [];
	}

	GetId()
	{
		return this.constructor.name;
	}

	GetFilter(onlySelf = false)
	{
		if(onlySelf) return this.FILTER;

		var f = this.FILTER +';'+this.type+';'+this.slot;
		if(this.Recipe) f+=';'+'GOT_RECIPE';
		return f;
	}

	isMaterial()
	{
		return ItemHelper.isMaterial(this);
	}

	getShineStrength()
	{
		if(this.shineStrength) return this.shineStrength;
		if(!this.Grade) return 0;

		if(this.Grade == GRADE.NORMAL) return 0;
		if(this.Grade == GRADE.COMMON) return .25;
		if(this.Grade == GRADE.RARE) return .5;
		if(this.Grade == GRADE.MYTHICAL) return .75;
		return 1;
	}

	getLore()
	{
		if(!this.Lore) return null;
		return Lang.Get(this.Lore, this.ARGS).split('\n');
	}

	getChargeDescription()
	{
		if(!this.ChargeDescription) return null;
		return Lang.Get(this.ChargeDescription, this.ARGS).split('\n');
	}

	getDescription()
	{
		if(!this.Description) return null;
		return Lang.Get(this.Description, this.ARGS).split('\n');
	}

	getDisplayName()
	{
		if(!this.name) return '';
		return Lang.Get(this.name, this.ARGS);
	}

	canBeEquipped(owner, equips_path = 'equips', certainSlot = null)
	{
		if(!this.equipAble) return false;

		if(this.restrictTypes)
		{
			var equipped_types = {};
			for(var slot in owner[equips_path])
			{
				var item = owner[equips_path][slot];
				if(!item) continue;

				if(!equipped_types[item.type]) equipped_types[item.type] = 0;
				equipped_types[item.type]++;
			}

			if(certainSlot)
			{
				//you can replace item with same type
				if(owner[equips_path][certainSlot]?.type == this.type) return true;
			}

			if(equipped_types[this.type] >= this.restrictTypes) return false;
		}

		if(certainSlot && this.slot != certainSlot.replace(/[0-9]/, '')) return false;

		return true;
	}
	
	static Get(name)
	{
		return ItemHelper.getInstanceOfItem(name);
	}

	onInventoryTick()
	{

	}

	onEquip()
	{

	}

	onEquipTick()
	{
		
	}

	Drop(x, y, ownerInventory, dirX)
	{
		this.onDropOut?.();
		if(!this.canBeDroppedOut || this.isUnique) return false;

		var entity = new EntityItem(this, x, y, dirX);
		if(ownerInventory)
		{
			for(var i = 0; i < ownerInventory.length; i++)
			{
				if(ownerInventory[i] == this)
				{
					ownerInventory[i] = null;
				}
			}
		}

		World.AddEntity(entity);
		return true;
	}

	DrawShine(x, y, scale = 1, preventUpdate = false)
	{
		if(this.upgradeAble)
		{
			if(this.upgradeLevel > 4)
			{
				this.shineStrength = (this.upgradeLevel - 4) * 0.2;
			}
		}

		if(!this.shineStrength) return;

		if(!(this.shineRotation instanceof Transition) || !this.shineRotation) 
		{
			this.shineRotation = new Transition(0, 360, 20, false, 0, 0, true);
			this.shineRotation.RandomizeTicks();
		}

		if(!(this.shineSize instanceof Transition) || !this.shineSize)
		{
			this.shineSize = new Transition(25, 35, 0.5, true, 0, 0);
			this.shineSize.RandomizeTicks();
		}

		var rotation = (preventUpdate) ? this.shineRotation.Get() : this.shineRotation.Update();
		var size = (preventUpdate) ? this.shineSize.Get() : this.shineSize.Update();

		Graphic.ApplyShineEffect(x, y, size * scale * this.shineStrength, 1, rotation);
	}

	Pick(owner, entityItem)
	{
		owner.addItemToInventory(this);
		World.RemoveEntity(entityItem);
	}
}