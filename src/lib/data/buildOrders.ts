type BuildOrder = {
	title: string;
	details: {
		title: string;
		text: string;
		cost: {
			cash: number;
			resources: Partial<Record<'brick' | 'wood' | 'sheep' | 'wheat' | 'ore', number>>;
		};
	}[];
};

export const buildOrders: BuildOrder[] = [
	{
		title: 'Units',
		details: [
			{
				title: 'Production Building',
				text: 'Adds +1 production to the resource type it is placed on (One per territory until you have unlocked Infrastructure).',
				cost: {
					cash: 40,
					resources: {
						wood: 1,
						brick: 1
					}
				}
			},
			{
				title: 'Settlement',
				text: 'Adds +1 VP and can be be upgraded to a city. Comes with 4 troops in the territory built.',
				cost: {
					cash: 60,
					resources: {
						wood: 1,
						brick: 1,
						wheat: 1,
						sheep: 1
					}
				}
			},
			{
				title: 'City',
				text: "Adds +1 VP and +1 production if you have a production building in the same territory. Comes with 4 troops in the territory built.",
				cost: {
					cash: 80,
					resources: {
						wheat: 2,
						ore: 3
					}
				}
			},
			{
				title: 'Fort',
				text: 'Allows the defender to roll one more die while defending. (When defending against cavalry roll 2 dice, +4 kill)',
				cost: {
					cash: 30,
					resources: {
						wood: 1,
						brick: 2
					}
				}
			},
		]
	}
];
