<script lang="ts">
	type Rule = { title: string; text: string };
	type Topic = { title: string; rules: Rule[] };

	const topics: Topic[] = [
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
					text: 'You may buy troops at the end of your turn, after fortifying. You may buy as many troops as you can afford, and place them on any territory you control.'
				}
			]
		}
	];

	let searchTerm = $state<string>('');
	let filteredTopics = $derived.by(() => {
		const query = searchTerm.trim().toLowerCase();
		return topics
			.map((topic) => ({
				...topic,
				rules: topic.rules.filter((rule) =>
					`${plainText(rule.title)} ${plainText(rule.text)}`.toLowerCase().includes(query)
				)
			}))
			.filter((topic) => topic.rules.length > 0);
	});

	function plainText(text: string) {
		return text.replace(/\\([^\\]+)\\/g, '$1');
	}

	function formatParts(text: string) {
		const formattedParts: { text: string; bold: boolean }[] = [];
		const formattingPattern = /\\([^\\]+)\\/g;
		let lastIndex = 0;

		for (const match of text.matchAll(formattingPattern)) {
			const matchIndex = match.index ?? 0;
			if (matchIndex > lastIndex) {
				formattedParts.push({ text: text.slice(lastIndex, matchIndex), bold: false });
			}
			formattedParts.push({ text: match[1], bold: true });
			lastIndex = matchIndex + match[0].length;
		}
		if (lastIndex < text.length) {
			formattedParts.push({ text: text.slice(lastIndex), bold: false });
		}

		const query = searchTerm.trim();
		if (!query) {
			return formattedParts.map((part) => ({ ...part, highlighted: false }));
		}

		const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const queryPattern = new RegExp(`(${escapedQuery})`, 'gi');
		return formattedParts.flatMap((part) =>
			part.text.split(queryPattern).map((textPart) => ({
				text: textPart,
				bold: part.bold,
				highlighted: textPart.toLowerCase() === query.toLowerCase()
			}))
		);
	}
</script>

<div class="marbleImage flex w-full items-center gap-2 border p-2 text-black">
	<input
		class="w-full p-2 focus:outline-none"
		type="text"
		placeholder="Search rules..."
		bind:value={searchTerm}
	/>
	{#if searchTerm !== ''}
		<button
			class="align-center flex h-8 w-8 justify-center rounded-full border bg-black text-white"
			onclick={() => (searchTerm = '')}>x</button
		>
	{/if}
</div>
<div class="m-2 w-full text-black">
	{#if filteredTopics.length > 0}
		{#each filteredTopics as topic}
			<section class="mb-8">
				<h2 class="mb-4 text-3xl font-bold text-white">
					{#each formatParts(topic.title) as part}
						<span class:font-bold={part.bold}>
							{#if part.highlighted}<mark class="rounded-sm bg-yellow-300 px-0.5">{part.text}</mark
								>{:else}{part.text}{/if}
						</span>
					{/each}
				</h2>
				<ul class="flex list-inside flex-col gap-4">
					{#each topic.rules as rule}
						<li class="marbleImage p-2">
							<h3 class="text-xl font-semibold">
								{#each formatParts(rule.title) as part}
									<span class:font-bold={part.bold}>
										{#if part.highlighted}<mark class="rounded-sm bg-yellow-300 px-0.5"
												>{part.text}</mark
											>{:else}{part.text}{/if}
									</span>
								{/each}
							</h3>
							<p class="pl-2">
								{#each formatParts(rule.text) as part}
									<span class:font-bold={part.bold}>
										{#if part.highlighted}<mark class="rounded-sm bg-yellow-300 px-0.5"
												>{part.text}</mark
											>{:else}{part.text}{/if}
									</span>
								{/each}
							</p>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	{:else}
		<p class="py-4">No rules match “{searchTerm.trim()}”.</p>
	{/if}
</div>

<style lang="scss">
	.marbleImage {
		background-image: url('/src/lib/assets/ymarble.jpg');
	}
</style>
