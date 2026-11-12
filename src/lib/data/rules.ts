	type Rule = { title: string; text: string };
	type Topic = { title: string; rules: Rule[] };
    
    export const topics: Topic[] = [
		{
			title: 'Economy',
			rules: [
				{
					title: 'Resource Collection',
					text: '\\Production Buildings\\ are used to collect resources from certain marked territories on the board. On your turn you can collect \\one type\\ of resource. You can collect as many resources as you have production buildings of that type. For example, if you have 2 Wheat or 1 Brick production buildings, you can \\either\\ collect 2 Wheat resources, or 1 Brick resource.'
				},
				{
					title: 'Cash Collection',
					text: 'At the beginning of the game each player starts with $100. You collect additional cash at the \\end\\ of your turn by taking a 50% increase. For example, if you have $100 at the end of your turn, you will collect an additional $50, totalling $150. If you have $150 at the end of your turn, you will collect an additional $75, totalling $225. \\Unless you have $0\\, always \\round down\\ to the nearest tenth. For example if you have $70 at the end of your turn, you will collect $30.'
				}
			]
		},
		{
			title: 'Religions',
			rules: [
				{
					title: 'Selecting a Religion',
					text: 'Once you unlock \\Faith\\ in the tech tree, you may select a religion by drawing 2 religion cards out of the stack at random. Then pick your preferred religion, and return the remaining card to the stack. Each religion has unique perks or abilities that can be used to your advantage. Choose wisely, as your choice will impact your strategy and interactions with other players.'
				},
				{
					title: 'Missionaries',
					text: "Once you have unlocked \\Holy Order\\, you can place missionaries on the board to convert other players' territories. The missionary (The meeple piece) is placed on the territory you wish to convert, then a single die is rolled by the player sending missionaries (unless you have unlocked \\Sanctuaries\\ or have a modifier from a religion card), and the player who owns the territory. If the roll is greater than (tie goes to the defender) the roll of the player who owns the territory, the territory is converted. Missionaries are \\removed\\ from the board after a successful conversion, or if the roll is a 1 or 2"
				},
                {
					title: 'Conversion & Religion Points',
					text: "Upon a successful conversion, place one of your religion markers on the territory. You \\do not\\ need to roll to convert your own territory. \\+1 VP\\ for each of your own cities you convert. \\+1 VP\\ for converting a settlement of another player, and \\+2 VP\\ for converting a city of another player. If you convert another player\'s settlement, and they upgrade it to a city you gain \\+1 VP\\. So the \\+2 VP\\ is only for converting a city, not for upgrading a settlement to a city. If you convert another player\'s city, and they downgrade it to a settlement you gain \\+1 VP\\, totalling \\+2 VP\\ for that space."
				},
                {
					title: 'Converting already converted territories',
					text: "If you attempt to convert a territory that is already converted by another player, you roll like you would for a normal conversion. If the missionaries succeed then the religion is removed, and then they must roll again to convert the territory. (If the defending relition rolls a 1, then the territory is automatically converted when the religion is removed.)"
				},
                {
					title: 'Reformation',
					text: "The religions you draw may be a religion on the opposite side of an existing religions board tokens (e.g., Catholicism and Protestantism) Opposing religions must share tokens."
				}
			]
		},
		{
			title: 'Military',
			rules: [
				{
					title: 'Battle',
					text: 'On your turn, you may attack an enemy territory next to one of yours. The attacking territory must have at least 1 troop, and you must leave at least 1 behind. The attacker rolls up to 3 dice, one for each troop \\allowed to leave after the battle\\ so you may not count the troop left behind. The defender rolls up to 2 dice, limited by the troops defending, if only one troop remains, only roll one die. Compare the highest dice from each side; if both sides rolled at least 2 dice, compare their second-highest dice as well. Each comparison removes 1 troop from the side with the lower die. Ties go to the defender. You may continue attacking while you have enough troops. When you capture a territory, move troops into it from the attacking territory; move at least as many troops as dice you rolled in the final attack, and leave at least 1 troop behind. At the \\end\\ of your turn, you may \\fortify once\\ by moving troops from one territory you control to another connected by territories you control, leaving at least 1 army in the starting territory. \\Fortifying ends your turn\\, so you cannot attack afterward.'
				},
				{
					title: 'Buying Troops',
					text: 'You may buy troops at the \\end\\ of your turn, after fortifying. You may buy as many troops as you can afford, and place them on any territory you control.'
				}
			]
		}
	];