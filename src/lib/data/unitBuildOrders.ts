import type { TechnologyRequirement } from './technology.svelte.ts';

type BuildOrder = {
	title: string;
	details: {
		title: string;
		text: string;
		requirement?: TechnologyRequirement;
		cost: {
			cash: number;
			resources: Partial<Record<'brick' | 'wood' | 'sheep' | 'wheat' | 'ore', number>>;
		};
	}[];
};

export const unitBuildOrders: BuildOrder[] = [
	{
		title: 'Units',
		details: [
			{
				title: '5 Troops',
				text: 'Attack and defend territories. Place them on any territory you control.',
				cost: {
					cash: 40,
					resources: {
						sheep: 1
					}
				}
			},
			{
				title: 'Caravan',
				text: 'Place them on any territory controled by another player with a production building. You may pay $20 to that player to gain 1 resource produced by that territory instead of your normal resource collection.',
				cost: {
					cash: 40,
					resources: {
						wood: 3
					}
				}
			},
			{
				title: 'Missionary',
				text: "Must have Religion Level 2 unlocked. Allows you to convert other players' territories to your religion. Place them on any territory you control.",
				requirement: { branch: 'Religion', level: 2, name: 'Holy Order' },
				cost: {
					cash: 30,
					resources: {
						wheat: 1
					}
				}
			},
			{
				title: 'Artillery',
				text: 'Can attack an adjacent territory once a turn. Roll 3 dice, 4+ kill 1 troop each. Artillery do not count as a troop for other battle purposes.',
				requirement: { branch: 'Military', level: 2, name: 'Artillery' },
				cost: {
					cash: 40,
					resources: {
						ore: 1
					}
				}
			},
			{
				title: 'Cavalry',
				text: 'Can attack up to 3 territories away. Roll 3 dice, 4+ kill 1 troop each, 1 kills the cavalry. Cavalry do not count as troops for other battle purposes.',
				requirement: { branch: 'Military', level: 3, name: 'Cavalry' },
				cost: {
					cash: 40,
					resources: {
						ore: 2
					}
				}
			}
		]
	}
];
