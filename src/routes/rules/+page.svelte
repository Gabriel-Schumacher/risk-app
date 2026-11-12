<script lang="ts">
import { topics } from '#lib/data/rules.ts';

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
<div class="w-full">
	<h2 class="text-3xl font-bold text-left">Game Rules</h2>
</div>

<div class="marbleImage flex w-full items-center gap-2 border p-2 text-black">
	<input
		class="w-full p-2 focus:outline-none"
		type="text"
		placeholder="Search rules..."
		bind:value={searchTerm}
	/>
	{#if searchTerm !== ''}
		<button
			class="align-center flex h-8 w-9 justify-center rounded-full border bg-blue-400 text-white"
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
		<p class="py-4 text-white">No rules match “{searchTerm.trim()}”.</p>
	{/if}
</div>

<style lang="scss">
	.marbleImage {
		background-image: url('/src/lib/assets/ymarble.jpg');
	}
</style>
