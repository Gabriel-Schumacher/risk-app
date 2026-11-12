<script lang="ts">
	import { onMount } from 'svelte';
	import TechCard from '#lib/components/TechCard.svelte'

	type Resource = 'brick' | 'wood' | 'sheep' | 'wheat' | 'ore';

	type Player = {
		name: string;
		color: string;
		points: number;
		armies: number;
	};

	const resourceInfo: Record<Resource, { label: string; icon: string; tone: string; color: string }> = {
		brick: { label: 'Brick', icon: '◆', tone: 'brick', color: 'red' },
		wood: { label: 'Lumber', icon: '✦', tone: 'wood', color: 'brown' },
		sheep: { label: 'Wool', icon: '✤', tone: 'sheep', color: 'green' },
		wheat: { label: 'Grain', icon: '✺', tone: 'wheat', color: 'yellow' },
		ore: { label: 'Ore', icon: '⬡', tone: 'ore', color: 'gray' }
	};
	const technologyTrees = [
		{
			name: 'Economy' as const,
			icon: '◈',
			tone: 'economy',
			layers: [
				{ name: 'Trade Routes', detail: 'Improve resource exchanges', cash: 30, resourceAmount: 1 },
				{ name: 'Guilds', detail: 'Build more efficiently', cash: 50, resourceAmount: 2 },
				{ name: 'Mastery', detail: 'Lead the richest nation', cash: 70, resourceAmount: 3 }
			]
		},
		{
			name: 'Religion' as const,
			icon: '✦',
			tone: 'religion',
			layers: [
				{ name: 'Traditions', detail: 'Unite your settlements', cash: 30, resourceAmount: 1 },
				{ name: 'Shrines', detail: 'Strengthen your influence', cash: 50, resourceAmount: 2 },
				{ name: 'Divinity', detail: 'Inspire a golden age', cash: 70, resourceAmount: 3 }
			]
		},
		{
			name: 'Military' as const,
			icon: '⚒',
			tone: 'military',
			layers: [
				{ name: 'Militia', detail: 'Raise a defensive force', cash: 30, resourceAmount: 1 },
				{ name: 'Ironworking', detail: 'Unlock stronger armies', cash: 50, resourceAmount: 2 },
				{ name: 'Strategy', detail: 'Command the battlefield', cash: 70, resourceAmount: 3 }
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

	function resetGame() {
		if (confirm('Reset this game and clear all saved progress?')) {
			localStorage.removeItem('frontier-catan-game');
			location.reload();
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

<main class="app-shell mx-auto max-w-7xl px-4 py-6 sm:px-8 lg:px-11">
	<header class="topbar flex items-center justify-between border-b border-[#d5d0c5] pb-7">
		<div class="brand flex items-center gap-3">
			<div>
				<p class="eyebrow eyebrow accent">Nation tracker</p>
			</div>
		</div>
		<div class="game-meta flex items-center gap-5 sm:gap-8">
        <div></div>
			<div class="save-state">{saved ? '✓ Saved locally' : '● Autosave on'}</div>
			<button class="icon-button" aria-label="Reset game" onclick={resetGame}>↻</button>
		</div>
	</header>

	<div class="layout grid gap-10 lg:grid-cols-[minmax(0,1fr)_315px]">
		<section class="main-column">
			<div class="p-2 section-heading flex items-center justify-between">
				<div><p class="eyebrow">Your ledger</p><h3>Resources</h3></div>
				<span class="hint">Income per production building</span>
			</div>
			<div class="flex flex-col gap-4">
				{#each Object.entries(resourceInfo) as [key, info]}
					{@const resource = key as Resource}
					<article class={`flex justify-between gap-4 ${info.tone} rounded-sm border border-[#d8d1c3] bg-[#fbf8f2] p-4`}>
						<div class="flex items-center gap-2">
							<span class="resource-icon">{info.icon}</span>
							<span class="resource-label">{info.label}</span>
						</div>
						<div class="flex items-center gap-4">
							<strong>{resources[resource]}</strong>
							<div class="flex items-center gap-2">
								<button class="w-8 h-8 p-2 flex items-center justify-center border" aria-label={`Remove one ${info.label}`} onclick={() => changeResource(resource, -1)}>−</button>
								<button class="w-8 h-8 p-2 flex items-center justify-center border" aria-label={`Add one ${info.label}`} onclick={() => changeResource(resource, 1)}>+</button>
							</div>
						</div>
					</article>
				{/each}
                <div class="do not remove"></div>
			</div>

			<section class="research-section">
				<div class="section-heading flex items-center">
					<div><h3>Research &amp; technology</h3></div></div>
				<div class="tech-preview grid gap-4 sm:grid-cols-3">
					{#each technologyTrees as tree}
						<div class='marbleImage p-5 pb-2 {`border border-[#2b281f] p-2 ${tree.tone}`}'>
							<div class="mb-3 flex items-center gap-2 border-b border-[#d1ccbf] pb-3">
								<span class="tech-branch-icon">{tree.icon}</span>
								<strong class="flex-1">{tree.name}</strong>
								<div class="flex items-center gap-2">
									<button
										class="w-8 h-8 p-2 flex items-center justify-center border"
										aria-label={`Remove one ${tree.name} technology level`}
										disabled={technologyProgress[tree.name] === 0}
										onclick={() => changeTechnology(tree.name, -1)}>−</button>
									<strong class="tech-level">{technologyProgress[tree.name]} / 3</strong>
									<button
									class="w-8 h-8 p-2 flex items-center justify-center border"
										aria-label={`Add one ${tree.name} technology level`}
										disabled={technologyProgress[tree.name] === 3}
										onclick={() => changeTechnology(tree.name, 1)}>+</button>
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
	<footer><span>Game state is saved in this browser</span></footer>
</main>

<style>
    .marbleImage {
		background-image: url('/src/lib/assets/ymarble.jpg');
    }
</style>