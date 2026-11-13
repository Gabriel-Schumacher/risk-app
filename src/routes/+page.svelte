<script lang="ts">
	import { onMount } from 'svelte';
	import PointTracker from '#lib/components/PointTracker.svelte';
	import TechCard from '#lib/components/TechCard.svelte';
	import { resourceInfo } from '#lib/data/icon.ts';
	import { playerStorageKey, releasePlayerColor } from '#lib/data/scoreboard.svelte.ts';

	type Resource = 'brick' | 'wood' | 'sheep' | 'wheat' | 'ore';

	type Player = {
		name: string;
		color: string;
		points: number;
		armies: number;
	};

	const technologyTrees = [
		{
			name: 'Economy' as const,
			icon: '◈',
			tone: 'economy',
			layers: [
				{ name: 'Trade', detail: 'Trade 4 of the same resource, for 1 of another', cash: 30, resourceAmount: 1 },
				{ name: 'Infrastructure', detail: 'You may build 2 production buildings per territory', cash: 50, resourceAmount: 2 },
				{ name: 'Guilds', detail: 'Trade 3 of the same resource, for 1 of another or 6 of any resource for 1 of another', cash: 100, resourceAmount: 2 }
			]
		},
		{
			name: 'Religion' as const,
			icon: '✦',
			tone: 'religion',
			layers: [
				{ name: 'Faith', detail: 'Draw 2 religious cards randomly, pick one to keep. Return the other.', cash: 30, resourceAmount: 1 },
				{ name: 'Holy Order', detail: 'May train missionaries', cash: 30, resourceAmount: 2 },
				{ name: 'Sanctuaries', detail: 'Roll 2 dice when attempting to convert a territory', cash: 100, resourceAmount: 3 }
			]
		},
		{
			name: 'Military' as const,
			icon: '⚒',
			tone: 'military',
			layers: [
				{ name: 'Defense', detail: 'May build forts', cash: 30, resourceAmount: 1 },
				{ name: 'Artillery', detail: 'May build artillery', cash: 50, resourceAmount: 2 },
				{ name: 'Cavalry', detail: 'May build cavalry', cash: 80, resourceAmount: 3 }
			]
		}
	];
	type TechnologyBranch = (typeof technologyTrees)[number]['name'];
	const technologyResource: Record<TechnologyBranch, Resource> = {
		Economy: 'brick',
		Religion: 'wheat',
		Military: 'ore'
	};

	let resources = $state<Record<Resource, number>>({
		brick: 0,
		wood: 0,
		sheep: 0,
		wheat: 0,
		ore: 0
	});
	let players = $state<Player[]>([
		{ name: 'You', color: '#b9573f', points: 7, armies: 4 },
		{ name: 'Mara', color: '#d49b37', points: 6, armies: 3 },
		{ name: 'Theo', color: '#5c7f72', points: 4, armies: 2 },
		{ name: 'June', color: '#6b6b8f', points: 3, armies: 2 }
	]);
	let technologyProgress = $state<Record<TechnologyBranch, number>>({
		Economy: 0,
		Religion: 0,
		Military: 0
	});
	let saved = $state(false);
	let resetting = $state(false);
	let resetError = $state('');

	onMount(() => {
		const stored = localStorage.getItem('frontier-catan-game');
		if (stored) {
			try {
				const state = JSON.parse(stored);
				if (state.resources) resources = { ...resources, ...state.resources };
				if (state.players) players = state.players;
				if (state.technologyProgress) {
					technologyProgress = { ...technologyProgress, ...state.technologyProgress };
				}
			} catch {
				localStorage.removeItem('frontier-catan-game');
			}
		}
	});

	function save() {
		localStorage.setItem(
			'frontier-catan-game',
			JSON.stringify({ resources, players, technologyProgress })
		);
		saved = true;
		setTimeout(() => (saved = false), 1600);
	}

	function changeResource(resource: Resource, amount: number) {
		resources = { ...resources, [resource]: Math.max(0, resources[resource] + amount) };
		save();
	}

	function changeTechnology(branch: TechnologyBranch, amount: number) {
		const nextLevel = technologyProgress[branch] + amount;
		if (nextLevel < 0 || nextLevel > 3) return;
		technologyProgress = {
			...technologyProgress,
			[branch]: nextLevel
		};
		save();
	}

	async function resetGame() {
		if (!confirm('Reset this game, including your selected color and points?')) return;

		resetting = true;
		resetError = '';
		const playerId = localStorage.getItem(playerStorageKey);
		try {
			if (playerId) await releasePlayerColor(playerId);
			localStorage.removeItem(playerStorageKey);
			localStorage.removeItem('frontier-catan-game');
			location.reload();
		} catch (error) {
			resetError =
				error instanceof Error ? `Could not reset player color: ${error.message}` : 'Could not reset player color.';
		} finally {
			resetting = false;
		}
	}
</script>

<svelte:head>
	<title>Nation tracker</title>
	<meta
		name="description"
		content="A persistent Catan and Risk campaign tracker for resources, players, and research."
	/>
</svelte:head>

<div class="mx-auto max-w-7xl px-2 py-6 text-black sm:px-8 lg:px-11">
	<header class="topbar flex items-center justify-between border-b border-[#d5d0c5] pb-7">
		<div class="brand flex items-center gap-3">
			<div>
				<p class="text-xl font-bold text-white">Nation tracker</p>
			</div>
		</div>
		<div class="game-meta flex items-center gap-5 sm:gap-8">
			<div></div>
			<div class="save-state text-white">{saved ? '✓ Saved locally' : '● Autosave on'}</div>
			<button class="text-white" aria-label="Reset game and player color" disabled={resetting} onclick={resetGame}>
				↻
			</button>
		</div>
	</header>
	{#if resetError}
		<p class="mt-2 text-sm text-red-200" role="alert">{resetError}</p>
	{/if}

	<div class="layout grid gap-10 lg:grid-cols-[minmax(0,1fr)_315px]">
		<section>
			<PointTracker />
			<h3 class="py-2 text-xl font-bold text-white">Resources</h3>
			<div class="parchmentImage flex flex-col gap-2">
				{#each Object.entries(resourceInfo) as [key, info]}
					{@const resource = key as Resource}
					<article class={`flex justify-between gap-4 ${info.tone} p-3 px-4`}>
						<div class="flex items-center gap-2">
							<span
								class="resource-icon flex h-5 w-5 items-center justify-center rounded-full border-2"
								style={`border-color: ${info.color}; background-color: ${info.color}`}
								>{info.icon}</span
							>
							<span class="resource-label">{info.label}</span>
						</div>
						<div class="flex items-center gap-4">
							<strong>{resources[resource]}</strong>
							<div class="flex items-center gap-2">
								<button
									class="flex h-8 w-8 items-center justify-center border p-2"
									aria-label={`Remove one ${info.label}`}
									onclick={() => changeResource(resource, -1)}>−</button
								>
								<button
									class="flex h-8 w-8 items-center justify-center border p-2"
									aria-label={`Add one ${info.label}`}
									onclick={() => changeResource(resource, 1)}>+</button
								>
							</div>
						</div>
					</article>
				{/each}
				<div class="do not remove"></div>
			</div>

			<section>
				<h3 class="py-2 text-xl font-bold text-white">Tech Tree</h3>
				<div class="tech-preview grid gap-4 sm:grid-cols-3">
					{#each technologyTrees as tree}
						<div
							class="marbleImage p-5 pb-2 shadow-xl {`border border-[#2b281f] p-2 ${tree.tone}`}"
						>
							<div class="mb-3 flex items-center gap-2 border-b border-[#d1ccbf] pb-3">
								<span class="tech-branch-icon">{tree.icon}</span>
								<strong class="flex-1">{tree.name}</strong>
								<div class="flex items-center gap-2">
									<button
										class="flex h-8 w-8 items-center justify-center border p-2"
										aria-label={`Remove one ${tree.name} technology level`}
										disabled={technologyProgress[tree.name] === 0}
										onclick={() => changeTechnology(tree.name, -1)}>−</button
									>
									<strong class="tech-level">{technologyProgress[tree.name]} / 3</strong>
									<button
										class="flex h-8 w-8 items-center justify-center border p-2"
										aria-label={`Add one ${tree.name} technology level`}
										disabled={technologyProgress[tree.name] === 3}
										onclick={() => changeTechnology(tree.name, 1)}>+</button
									>
								</div>
							</div>
							<div class="flex flex-col gap-4 pb-4">
								{#each tree.layers as layer, index}
									<TechCard
										{index}
										{tree}
										{layer}
										{technologyProgress}
										{resourceInfo}
										{technologyResource}
									/>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</section>
		</section>
	</div>
</div>

<style>
	/* main {
		background-image: url('/src/lib/assets/map.jpg');
	} */
	.marbleImage {
		background-image: url('/src/lib/assets/ymarble.jpg');
	}
	.parchmentImage {
		background-image: url('/src/lib/assets/parchment.jpg');
	}
</style>
