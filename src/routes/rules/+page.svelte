<script lang="ts">
	type Rule = { title: string; text: string };
	type Topic = { title: string; rules: Rule[] };

	const topics: Topic[] = [
		{
			title: 'Economy',
			rules: [
				{
					title: 'Resource Collection',
					text: 'Production Buildings are used to collect resources from certain marked territories on the board. On your turn you can collect one type of resource. You can collect as many resources as you have production buildings of that type. For example, if you have 2 Wheat or 1 Brick production buildings, you can either collect 2 Wheat resources, or 1 Brick resource.'
				},
				{
					title: 'Cash Collection',
					text: 'Production Buildings are used to collect resources from certain marked territories on the board. On your turn you can collect one type of resource. You can collect as many resources as you have production buildings of that type. For example, if you have 2 Wheat or 1 Brick production buildings, you can either collect 2 Wheat resources, or 1 Brick resource.'
				}
			]
		},
        		{
			title: 'Religions',
			rules: [
				{
					title: 'Selecting a Religion',
					text: 'Once you unlock Faith in the tech tree, you may select a religion by drawing 2 religion cards out of the stack at random. Then pick your preferred religion, and return the remaining card to the stack. Each religion has unique perks or abilities that can be used to your advantage. Choose wisely, as your choice will impact your strategy and interactions with other players.'
				},
				{
					title: 'Missionaries',
					text: 'Once you have unlocked, you can place missionaries on the board to convert other players\' territories.'
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
					`${rule.title} ${rule.text}`.toLowerCase().includes(query)
				)
			}))
			.filter((topic) => topic.rules.length > 0);
	});

	function highlightParts(text: string) {
		const query = searchTerm.trim();
		if (!query) return [{ text, highlighted: false }];

		const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		return text.split(new RegExp(`(${escapedQuery})`, 'gi')).map((part) => ({
			text: part,
			highlighted: part.toLowerCase() === query.toLowerCase()
		}));
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
					{#each highlightParts(topic.title) as part}
						{#if part.highlighted}<mark class="rounded-sm bg-yellow-300 px-0.5">{part.text}</mark
							>{:else}{part.text}{/if}
					{/each}
				</h2>
				<ul class="flex list-inside flex-col gap-4">
					{#each topic.rules as rule}
						<li class="marbleImage p-2">
							<h3 class="text-xl font-semibold">
								{#each highlightParts(rule.title) as part}
									{#if part.highlighted}<mark class="rounded-sm bg-yellow-300 px-0.5">{part.text}</mark
										>{:else}{part.text}{/if}
								{/each}
							</h3>
							<p class="pl-2">
								{#each highlightParts(rule.text) as part}
									{#if part.highlighted}<mark class="rounded-sm bg-yellow-300 px-0.5">{part.text}</mark
										>{:else}{part.text}{/if}
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
