class ModelPlayer extends ModelBase
{
	constructor(owner)
	{
		super(owner);

		this.Width = 64;
		this.Height = 256;

		this.Offset.x = -26;
		this.Offset.y = -150;

		var body1 = new Part(40, 66, 34);
		body1.SetTexture("player_base2", 40, 66);
		body1.SetTextureRender(13, 13, 0, 34, 0, 152, -1, -1);
		body1.SetRotation(180, 18, 16);

		var body_pivot1 = new Part(0, 30, 10);
		body_pivot1.SetTexture("hand", 0, 30);
		body_pivot1.SetTextureRender(-2, -2);
		body_pivot1.SetRotation(60, 10, 10);

		var body2 = new Part(37, 63, 41);
		body2.SetTexture("player_base2", 37, 63);
		body2.SetTextureRender(12, 12, 0, 41, 4, 74, -1, -1);
		body2.SetRotation(-60, 23, 11);

		var breast_pivot = new Part(0, 32, 12);
		breast_pivot.SetTexture("hand", 0, 32);
		breast_pivot.SetTextureRender(-2, -2);
		breast_pivot.SetRotation(166, 10, 10);

		var breast = new Part(26, 30, 16);
		breast.SetTexture("player_base2", 26, 30);
		breast.SetTextureRender(14, 14, 0, 0, 102, 156);
		breast.SetRotation(15, 4, 7);

		var hands_pivot = new Part(0, 34, 14);
		hands_pivot.SetTexture("hand", 0, 34);
		hands_pivot.SetTextureRender(-2, -2);
		hands_pivot.SetRotation(254, 10, 10);

		var right_hand = new Part(14, 50, 36);
		right_hand.SetTexture("player_base2", 14, 50);
		right_hand.SetTextureRender(19, 3, 0, 0, 113, 1);
		right_hand.SetRotation(-427, 7, 7);

		var left_hand = new Part(14, 50, 36);
		left_hand.SetTexture("player_base2", 14, 50);
		left_hand.SetTextureRender(3, 19, 0, 0, 113, 1);
		left_hand.SetRotation(-432, 7, 7);

		var right_hand2 = new Part(14, 50, 46);
		right_hand2.SetTexture("player_base2", 14, 50);
		right_hand2.SetTextureRender(18, 2, 0, 0, 97, 1);
		right_hand2.SetRotation(-8, 7, 6);

		var left_hand2 = new Part(14, 50, 46);
		left_hand2.SetTexture("player_base2", 14, 50);
		left_hand2.SetTextureRender(2, 18, 0, 0, 97, 1);
		left_hand2.SetRotation(-17, 7, 6);

		var head_pivot = new Part(0, 31, 11);
		head_pivot.SetTexture("hand", 0, 31);
		head_pivot.SetTextureRender(-2, -2);
		head_pivot.SetRotation(-51, 10, 10);

		var head = new Part(55, 70, 54);
		head.SetTexture("player_base2", 55, 70);
		head.SetTextureRender(10, 10, 0, 54, 0, 0, -1, -1);
		head.SetRotation(50, 22, 8);

		var right_leg = new Part(31, 63, 49);
		right_leg.SetTexture("player_base2", 31, 63);
		right_leg.SetTextureRender(8, 5, 0, 0, 95, 64);
		right_leg.SetRotation(0, 16, 7);

		var right_leg2 = new Part(20, 57, 43);
		right_leg2.SetTexture("player_base2", 20, 57);
		right_leg2.SetTextureRender(7, 4, 0, 0, 73, 69);
		right_leg2.SetRotation(0, 12, 7);

		var right_leg_pivot = new Part(0, 25, 5);
		right_leg_pivot.SetTexture("hand", 0, 25);
		right_leg_pivot.SetTextureRender(-2, -2);
		right_leg_pivot.SetRotation(-310, 10, 10);

		var right_leg3 = new Part(34, 15, 16);
		right_leg3.SetTexture("player_base2", 34, 15);
		right_leg3.SetTextureRender(9, 6, 0, 0, 94, 129);
		right_leg3.SetRotation(310, 9, 4);
		right_leg3.Axis = "x";

		var left_leg = new Part(31, 63, 49);
		left_leg.SetTexture("player_base2", 31, 63);
		left_leg.SetTextureRender(5, 8, 0, 0, 95, 64);
		left_leg.SetRotation(-8, 16, 7);

		var left_leg2 = new Part(20, 57, 43);
		left_leg2.SetTexture("player_base2", 20, 57);
		left_leg2.SetTextureRender(4, 7, 0, 0, 73, 69);
		left_leg2.SetRotation(2, 12, 7);

		var left_leg_pivot = new Part(0, 25, 5);
		left_leg_pivot.SetTexture("hand", 0, 25);
		left_leg_pivot.SetTextureRender(-2, -2);
		left_leg_pivot.SetRotation(-310, 10, 10);

		var left_leg3 = new Part(34, 15, 16);
		left_leg3.SetTexture("player_base2", 34, 15);
		left_leg3.SetTextureRender(6, 9, 0, 0, 94, 129);
		left_leg3.SetRotation(318, 9, 4);
		left_leg3.Axis = "x";

		var hair_layer_0 = new Part(55, 80, 30);
		hair_layer_0.SetTexture("hair2", 55, 80);
		hair_layer_0.SetTextureRender(15, 15);
		hair_layer_0.SetRotation(180, 22, 8);

		var right_handheld = new Part(128, 128, 100);
		right_handheld.SetTexture("shadow_scythe", 128, 128);
		right_handheld.SetTextureRender(16, 0, 0, 0, 0, 0, -1, -1);
		right_handheld.SetRotation(-197, 48, 80);
		right_handheld.Axis = "x";
		right_handheld.BindItemSlot(SLOT.HAND+"0", this);

		var left_handheld = new Part(128, 128, 100);
		left_handheld.SetTexture("shadow_scythe", 128, 128);
		left_handheld.SetTextureRender(0, 16, 0, 0, 0, 0, -1, -1);
		left_handheld.SetRotation(175, 48, 80);
		left_handheld.Axis = "x";
		left_handheld.BindItemSlot(SLOT.HAND+"1", this);

		var eyes = new Part(17, 13, 100);
		eyes.SetTexture("eyes", 34, 26);
		eyes.SetTextureRender(11, 11);
		eyes.SetRotation(180, -9, -24);

		var right_hand_pivot = new Part(0, 18, 100);
		right_hand_pivot.SetTexture("hand", 20, 100);
		right_hand_pivot.SetTextureRender(-2, -2);
		right_hand_pivot.SetRotation(-171, 10, 10);

		var right_hand3 = new Part(16, 24, 100);
		right_hand3.SetTexture("hand", 32, 48);
		right_hand3.SetTextureRender(17, 1);
		right_hand3.SetRotation(166, 6, 4);

		var left_hand_pivot = new Part(0, 18, 100);
		left_hand_pivot.SetTexture("hand", 20, 100);
		left_hand_pivot.SetTextureRender(-2, -2);
		left_hand_pivot.SetRotation(-171, 10, 10);

		var left_hand3 = new Part(16, 24, 100);
		left_hand3.SetTexture("hand", 32, 48);
		left_hand3.SetTextureRender(1, 17);
		left_hand3.SetRotation(170, 6, 4);

		body1.AddChild(body_pivot1);
		body_pivot1.AddChild(body2);
		body2.AddChild(breast_pivot);
		breast_pivot.AddChild(breast);
		body2.AddChild(hands_pivot);
		hands_pivot.AddChild(right_hand);
		hands_pivot.AddChild(left_hand);
		right_hand.AddChild(right_hand2);
		left_hand.AddChild(left_hand2);
		body2.AddChild(head_pivot);
		head_pivot.AddChild(head);
		right_leg.AddChild(right_leg2);
		right_leg2.AddChild(right_leg_pivot);
		right_leg_pivot.AddChild(right_leg3);
		left_leg.AddChild(left_leg2);
		left_leg2.AddChild(left_leg_pivot);
		left_leg_pivot.AddChild(left_leg3);
		head.AddChild(hair_layer_0);
		right_hand2.AddChild(right_handheld);
		left_hand2.AddChild(left_handheld);
		head.AddChild(eyes);
		right_hand2.AddChild(right_hand_pivot);
		right_hand_pivot.AddChild(right_hand3);
		left_hand2.AddChild(left_hand_pivot);
		left_hand_pivot.AddChild(left_hand3);

		body1.AddChild(body_pivot1);
		body_pivot1.AddChild(body2);
		body2.AddChild(breast_pivot);
		breast_pivot.AddChild(breast);
		body2.AddChild(hands_pivot);
		hands_pivot.AddChild(right_hand);
		hands_pivot.AddChild(left_hand);
		right_hand.AddChild(right_hand2);
		left_hand.AddChild(left_hand2);
		body2.AddChild(head_pivot);
		head_pivot.AddChild(head);
		right_leg.AddChild(right_leg2);
		right_leg2.AddChild(right_leg_pivot);
		right_leg_pivot.AddChild(right_leg3);
		left_leg.AddChild(left_leg2);
		left_leg2.AddChild(left_leg_pivot);
		left_leg_pivot.AddChild(left_leg3);
		head.AddChild(hair_layer_0);
		right_hand3.AddChild(right_handheld);
		left_hand3.AddChild(left_handheld);
		head.AddChild(eyes);
		right_hand2.AddChild(right_hand_pivot);
		right_hand_pivot.AddChild(right_hand3);
		left_hand2.AddChild(left_hand_pivot);
		left_hand_pivot.AddChild(left_hand3);

		this.Parts.body1 = body1;
		this.Parts.body_pivot1 = body_pivot1;
		this.Parts.body2 = body2;
		this.Parts.breast_pivot = breast_pivot;
		this.Parts.breast = breast;
		this.Parts.hands_pivot = hands_pivot;
		this.Parts.right_hand = right_hand;
		this.Parts.left_hand = left_hand;
		this.Parts.right_hand2 = right_hand2;
		this.Parts.left_hand2 = left_hand2;
		this.Parts.head_pivot = head_pivot;
		this.Parts.head = head;
		this.Parts.right_leg = right_leg;
		this.Parts.right_leg2 = right_leg2;
		this.Parts.right_leg_pivot = right_leg_pivot;
		this.Parts.right_leg3 = right_leg3;
		this.Parts.left_leg = left_leg;
		this.Parts.left_leg2 = left_leg2;
		this.Parts.left_leg_pivot = left_leg_pivot;
		this.Parts.left_leg3 = left_leg3;
		this.Parts.hair_layer_0 = hair_layer_0;
		this.Parts.right_handheld = right_handheld;
		this.Parts.left_handheld = left_handheld;
		this.Parts.eyes = eyes;
		this.Parts.right_hand_pivot = right_hand_pivot;
		this.Parts.right_hand3 = right_hand3;
		this.Parts.left_hand_pivot = left_hand_pivot;
		this.Parts.left_hand3 = left_hand3;

		this.ApplyArmorModel(ArmorModel);
		this.ApplyModelAnimation(ModelPlayerAnimation);
	}

	Update()
	{
		super.Update();
	}

	Render(context)
	{
		super.Render(context);
	}
}