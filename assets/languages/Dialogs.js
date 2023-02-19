

//Merchant

	new DialogLine('MerchantTest', 'Merchant do was przemowil lol xD', [new DialogOption('Pokaz mi swoje towary.', DialogLine.OpenShop, 'store')]);
	new DialogLine('DevMerchantStart', 'Mam tu dla was wszystkie itemaski z caluśkiej gry towarzysze! Ale ani slowa adminowi!', [new DialogOption('Pokaz mi swoje towary.', DialogLine.OpenLargeShop, 'store')]);


	

//Sensei
	new DialogLine('SenseiDialog', 'NPC.SENSEI.DIALOG.1', [
		new DialogOption('Pokaz mi co masz.', DialogLine.OpenKnowledge, 'knowledge')
	]);




//Mage

new DialogLine('MageMetDialog', 'NPC.MAGE.DIALOG.0', [
	new DialogOption('NPC.MAGE.DIALOG.0.OPTION.1', () => DialogLine.ChangeDialogLine('MageDialog'))
]);

	new DialogLine('MageDialog', ['NPC.MAGE.DIALOG.1', 'NPC.MAGE.DIALOG.2', 'NPC.MAGE.DIALOG.3'], [
		new DialogOption('Chce cos stworzyc.', DialogLine.OpenCrafting, 'crafting')
	]);



//Miner
new DialogLine('MinerMetDialog', 'NPC.MINER.DIALOG.0', [
	new DialogOption('NPC.STYLIST.MINER.0.OPTION.1', () => DialogLine.ChangeDialogLine('MinerDialog'))
]);
	new DialogLine('MinerDialog', 'NPC.MINER.DIALOG.1', [
		new DialogOption('NPC.MINER.DIALOG.1.OPTION.1', DialogLine.OpenShop, 'store')
	]);



//Stylist
new DialogLine('StylistMetDialog', 'NPC.STYLIST.DIALOG.0', [
	new DialogOption('NPC.STYLIST.DIALOG.0.OPTION.1', () => DialogLine.ChangeDialogLine('StylistDialog'))
]);

	new DialogLine('StylistDialog', ['NPC.STYLIST.DIALOG.1', 'NPC.STYLIST.DIALOG.2'], [
		new DialogOption('Chce sie zmienic.', DialogLine.OpenAppearance, 'customize')
	]);





//Statue
new DialogLine('StatueMetDialog', 'NPC.STATUE.DIALOG.0', [
	new DialogOption('NPC.STATUE.DIALOG.0.OPTION.1', () => DialogLine.ChangeDialogLine('StatueDialog'))
]);

	new DialogLine('StatueDialog', 'NPC.STATUE.DIALOG.1', [
		new DialogOption('NPC.STATUE.DIALOG.1.OPTION.1', () => {Commands.GoToLocation('BossArena'); DialogLine.Exit()},  'boss_arena', () => {return World.Player.haveItemInstanceInInventory(SummonScroll) != -1}),
		new DialogOption('NPC.STATUE.DIALOG.1.OPTION.2', () => DialogLine.ChangeDialogLine('StatueDialogSacrifice'))
	]);

		new DialogLine('StatueDialogSacrifice', 'NPC.STATUE.DIALOG.SACRIFICE', [
			new DialogOption('NPC.STATUE.DIALOG.SACRIFICE.OPTION.1', () => {World.Player.interactionWith?.Sacrifice(); DialogLine.Exit()})
			// new DialogOption('NPC.STATUE.DIALOG.SACRIFICE.OPTION.2', () => DialogLine.ChangeDialogLine('StatueDialogSacrifice'))
		], ['NPC.STATUE.DIALOG.SACRIFICE.EXIT']);






//Bubblebee
new DialogLine('BubblebeeDialog', 'BOSS.BUBBLEBEE.DIALOG.1', [
	new DialogOption('BOSS.BUBBLEBEE.DIALOG.1.OPTION.1', () => {World.Player.interactionWith.TakeHoney(); DialogLine.Exit()},  'honeycomb', () => {return World.Player.haveItemInInventory('Honeycomb') != -1})
], ['BOSS.BUBBLEBEE.DIALOG.EXIT']);






/////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////  Q  U  E  S  T  S  ///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


new DialogLine('QuestLineLevelUp1', 'QUEST.LEVELUP.1', 
	[new DialogOption('QUEST.ACCEPT', () => {QuestList.Accept('QuestLineLevelUp1'); DialogLine.Exit();})],
	['QUEST.DECLINE']
);
new DialogLine('QuestLineLevelUp1Complete', 'QUEST.LEVELUP.1.COMPLETE', 
	[new DialogOption('QUEST.COMPLETE', () => {QuestList.Complete('QuestLineLevelUp1'); DialogLine.Exit();})],
	['QUEST.DECLINE']
);



new DialogLine('QuestLineLevelUp2', 'QUEST.LEVELUP.2', 
	[new DialogOption('QUEST.ACCEPT', () => {QuestList.Accept('QuestLineLevelUp2'); DialogLine.Exit();})],
	['QUEST.DECLINE']
);
new DialogLine('QuestLineLevelUp2Complete', 'QUEST.LEVELUP.2.COMPLETE', 
	[new DialogOption('QUEST.COMPLETE', () => {QuestList.Complete('QuestLineLevelUp2'); DialogLine.Exit();})],
	['QUEST.DECLINE']
);



new DialogLine('QuestLineLevelUp3', 'QUEST.LEVELUP.3', 
	[new DialogOption('QUEST.ACCEPT', () => {QuestList.Accept('QuestLineLevelUp3'); DialogLine.Exit();})],
	['QUEST.DECLINE']
);
new DialogLine('QuestLineLevelUp3Complete', 'QUEST.LEVELUP.3.COMPLETE', 
	[new DialogOption('QUEST.COMPLETE', () => {QuestList.Complete('QuestLineLevelUp3'); DialogLine.Exit();})],
	['QUEST.DECLINE']
);










new DialogLine('QuestLineViViScissors', 'QUEST.VIVISCISSORS', 
	[new DialogOption('QUEST.ACCEPT', () => {QuestList.Accept('QuestLineViViScissors'); DialogLine.Exit();})],
	['QUEST.DECLINE']
);
new DialogLine('QuestLineViViScissorsComplete', 'QUEST.VIVISCISSORS.COMPLETE', 
	[new DialogOption('QUEST.COMPLETE', () => {QuestList.Complete('QuestLineViViScissors'); DialogLine.Exit();})],
	['QUEST.DECLINE']
);






