class ArmorModel extends ModelBase
{
	constructor(model)
	{
		super(model);


		var breast_armor = new Part(26, 30, 16);
		breast_armor.SetTexture("armor_base2", 26, 30);
		breast_armor.SetTextureRender(0, 0, 0, 16, 102, 156, -1, -1);
		breast_armor.SetRotation(180, 4, 7);

		var body_armor1 = new Part(40, 66, 34);
		body_armor1.SetTexture("armor_base2", 40, 66);
		body_armor1.SetTextureRender(1, 1, 0, 0, 0, 152);
		body_armor1.SetRotation(180, 18, 16);

		var body_armor2 = new Part(37, 63, 41);
		body_armor2.SetTexture("armor_base2", 37, 63);
		body_armor2.SetTextureRender(2, 2, 0, 0, 4, 74);
		body_armor2.SetRotation(180, 23, 11);

		var right_leg_armor = new Part(31, 63, 49);
		right_leg_armor.SetTexture("armor_base2", 31, 63);
		right_leg_armor.SetTextureRender(3, 3, 0, 49, 95, 64, -1, -1);
		right_leg_armor.SetRotation(180, 16, 7);

		var right_leg_armor2 = new Part(20, 57, 43);
		right_leg_armor2.SetTexture("armor_base2", 20, 57);
		right_leg_armor2.SetTextureRender(4, 4, 0, 43, 73, 69, -1, -1);
		right_leg_armor2.SetRotation(180, 12, 7);

		var left_leg_armor = new Part(31, 63, 49);
		left_leg_armor.SetTexture("armor_base2", 31, 63);
		left_leg_armor.SetTextureRender(5, 5, 0, 49, 95, 64, -1, -1);
		left_leg_armor.SetRotation(180, 16, 7);

		var left_leg_armor2 = new Part(20, 57, 43);
		left_leg_armor2.SetTexture("armor_base2", 20, 57);
		left_leg_armor2.SetTextureRender(6, 6, 0, 43, 73, 69, -1, -1);
		left_leg_armor2.SetRotation(180, 12, 7);

		var right_leg_armor3 = new Part(34, 15, 12);
		right_leg_armor3.SetTexture("armor_base2", 34, 15);
		right_leg_armor3.SetTextureRender(7, 7, 14, -6, 94, 129, -1, -1);
		right_leg_armor3.SetRotation(180, 11, 10);
		right_leg_armor3.Axis = "x";

		var left_leg_armor3 = new Part(34, 15, 12);
		left_leg_armor3.SetTexture("armor_base2", 34, 15);
		left_leg_armor3.SetTextureRender(8, 8, 14, -6, 94, 129, -1, -1);
		left_leg_armor3.SetRotation(180, 11, 10);
		left_leg_armor3.Axis = "x";

		var left_hand_armor2 = new Part(14, 50, 46);
		left_hand_armor2.SetTexture("armor_base2", 14, 50);
		left_hand_armor2.SetTextureRender(9, 9, 0, 38, 97, 1, -1, -1);
		left_hand_armor2.SetRotation(180, 7, 6);

		var right_hand_armor2 = new Part(14, 50, 46);
		right_hand_armor2.SetTexture("armor_base2", 14, 50);
		right_hand_armor2.SetTextureRender(10, 10, 0, 38, 97, 1, -1, -1);
		right_hand_armor2.SetRotation(180, 7, 6);

		var left_hand_armor = new Part(14, 50, 36);
		left_hand_armor.SetTexture("armor_base2", 14, 50);
		left_hand_armor.SetTextureRender(11, 11, 0, 0, 113, 1);
		left_hand_armor.SetRotation(180, 7, 7);

		var right_hand_armor = new Part(14, 50, 36);
		right_hand_armor.SetTexture("armor_base2", 14, 50);
		right_hand_armor.SetTextureRender(12, 12, 0, 0, 113, 1);
		right_hand_armor.SetRotation(180, 7, 7);

		var head_armor = new Part(65, 70, 12);
		head_armor.SetTexture("armor_base2", 65, 70);
		head_armor.SetTextureRender(13, 13, 0, 74, 0, 1, -1, -1);
		head_armor.SetRotation(180, 32, -2);

		model.Parts.breast.AddChild(breast_armor, true);
		model.Parts.body1.AddChild(body_armor1, true);
		model.Parts.body2.AddChild(body_armor2, true);
		model.Parts.right_leg.AddChild(right_leg_armor, true);
		model.Parts.right_leg2.AddChild(right_leg_armor2, true);
		model.Parts.left_leg.AddChild(left_leg_armor, true);
		model.Parts.left_leg2.AddChild(left_leg_armor2, true);
		model.Parts.right_leg3.AddChild(right_leg_armor3, true);
		model.Parts.left_leg3.AddChild(left_leg_armor3, true);
		model.Parts.left_hand2.AddChild(left_hand_armor2, true);
		model.Parts.right_hand2.AddChild(right_hand_armor2, true);
		model.Parts.left_hand.AddChild(left_hand_armor, true);
		model.Parts.right_hand.AddChild(right_hand_armor, true);
		model.Parts.hair_layer_0.AddChild(head_armor, true);

		this.Parts.breast_armor = breast_armor;
		this.Parts.body_armor1 = body_armor1;
		this.Parts.body_armor2 = body_armor2;
		this.Parts.right_leg_armor = right_leg_armor;
		this.Parts.right_leg_armor2 = right_leg_armor2;
		this.Parts.left_leg_armor = left_leg_armor;
		this.Parts.left_leg_armor2 = left_leg_armor2;
		this.Parts.right_leg_armor3 = right_leg_armor3;
		this.Parts.left_leg_armor3 = left_leg_armor3;
		this.Parts.left_hand_armor2 = left_hand_armor2;
		this.Parts.right_hand_armor2 = right_hand_armor2;
		this.Parts.left_hand_armor = left_hand_armor;
		this.Parts.right_hand_armor = right_hand_armor;
		this.Parts.head_armor = head_armor;
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