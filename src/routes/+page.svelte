<script lang="ts">
	import { onMount } from 'svelte';

	type Resource = 'brick' | 'wood' | 'sheep' | 'wheat' | 'ore';

	type Player = {
		name: string;
		color: string;
		points: number;
		armies: number;
	};

	const resourceInfo: Record<Resource, { label: string; icon: string; tone: string }> = {
		brick: { label: 'Brick', icon: '◆', tone: 'brick' },
		wood: { label: 'Lumber', icon: '✦', tone: 'wood' },
		sheep: { label: 'Wool', icon: '✤', tone: 'sheep' },
		wheat: { label: 'Grain', icon: '✺', tone: 'wheat' },
		ore: { label: 'Ore', icon: '⬡', tone: 'ore' }
	};
	const technologyTrees = [
		{
			name: 'Economy',
			icon: '◈',
			tone: 'economy',
			layers: [
				{ name: 'Trade Routes', detail: 'Improve resource exchanges', cash: 30, resourceAmount: 1 },
				{ name: 'Guilds', detail: 'Build more efficiently', cash: 50, resourceAmount: 2 },
				{ name: 'Mastery', detail: 'Lead the richest nation', cash: 70, resourceAmount: 3 }
			]
		},
		{
			name: 'Religion',
			icon: '✦',
			tone: 'religion',
			layers: [
				{ name: 'Traditions', detail: 'Unite your settlements', cash: 30, resourceAmount: 1 },
				{ name: 'Shrines', detail: 'Strengthen your influence', cash: 50, resourceAmount: 2 },
				{ name: 'Divinity', detail: 'Inspire a golden age', cash: 70, resourceAmount: 3 }
			]
		},
		{
			name: 'Military',
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

<main class="app-shell mx-auto max-w-[1280px] px-4 py-6 sm:px-8 lg:px-11">
	<header class="topbar flex items-center justify-between border-b border-[#d5d0c5] pb-7">
		<div class="brand flex items-center gap-3">
			<div class="brand-mark grid h-9 w-9 place-items-center rounded-full bg-[#263c32] text-[22px] italic text-[#f5eede]">RC</div>
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
			<div class="resource-grid grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
				{#each Object.entries(resourceInfo) as [key, info]}
					{@const resource = key as Resource}
					<article class={`resource-card ${info.tone} rounded-sm border border-[#d8d1c3] bg-[#fbf8f2] p-4`}>
						<div class="resource-top"><span class="resource-icon">{info.icon}</span><span class="resource-label">{info.label}</span></div>
						<div class="resource-bottom">
							<strong>{resources[resource]}</strong>
							<div class="stepper">
								<button aria-label={`Remove one ${info.label}`} onclick={() => changeResource(resource, -1)}>−</button>
								<button aria-label={`Add one ${info.label}`} onclick={() => changeResource(resource, 1)}>+</button>
							</div>
						</div>
					</article>
				{/each}
			</div>

			<section class="research-section">
				<div class="section-heading flex items-center">
					<div><h3>Research &amp; technology</h3></div></div>
				<div class="tech-preview grid gap-4 p-4 sm:grid-cols-3">
					{#each technologyTrees as tree}
						<div class={`tech-branch ${tree.tone}`}>
							<div class="mb-3 flex items-center gap-2 border-b border-[#d1ccbf] pb-3">
								<span class="tech-branch-icon">{tree.icon}</span>
								<strong class="flex-1">{tree.name}</strong>
								<div class="tech-stepper">
									<button
										aria-label={`Remove one ${tree.name} technology level`}
										disabled={technologyProgress[tree.name] === 0}
										onclick={() => changeTechnology(tree.name, -1)}>−</button>
									<strong class="tech-level">{technologyProgress[tree.name]} / 3</strong>
									<button
										aria-label={`Add one ${tree.name} technology level`}
										disabled={technologyProgress[tree.name] === 3}
										onclick={() => changeTechnology(tree.name, 1)}>+</button>
								</div>
							</div>
							<div class="tech-layers">
								{#each tree.layers as layer, index}
									<div
										class={`tech-node ${index < technologyProgress[tree.name] ? 'unlocked' : 'locked'}`}
									>
										<span>{index + 1}</span>
										<div>
											<strong>{layer.name}</strong>
											<small>{layer.detail}</small>
											<small class="tech-cost">
												<span class="cash-cost">${layer.cash}</span>
												<span>+</span>
												<span
													class={`tech-resource-icon ${resourceInfo[technologyResource[tree.name]].tone}`}
													aria-label={resourceInfo[technologyResource[tree.name]].label}
												>
													{resourceInfo[technologyResource[tree.name]].icon}
												</span>
												<span>{layer.resourceAmount} {resourceInfo[technologyResource[tree.name]].label.toLowerCase()}</span>
											</small>
										</div>
										<b>{index < technologyProgress[tree.name] ? 'Ready' : 'Locked'}</b>
									</div>
									{#if index < tree.layers.length - 1}<div class="tech-line"></div>{/if}
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
	:global(body) { margin: 0; background: #f3efe7; color: #252724; font-family: Georgia, 'Times New Roman', serif; }
	:global(button) { font: inherit; }
	.app-shell { width: 100%; max-width: 1280px; box-sizing: border-box; margin: 0 auto; padding: 28px 42px 32px; }
	.game-meta, .resource-top, .resource-bottom, .panel-heading, .player-row, footer { display: flex; align-items: center; }
	.topbar { justify-content: space-between; padding-bottom: 28px; border-bottom: 1px solid #d5d0c5; }
	.brand { gap: 12px; }.brand-mark { width: 36px; height: 36px; display: grid; place-items: center; background: #263c32; color: #f5eede; font-size: 22px; border-radius: 50%; font-style: italic; }
	h1, h2, h3, p { margin: 0; } h1 { font-size: 22px; letter-spacing: -.5px; }.eyebrow { color: #88887e; font: 10px/1.2 Arial, sans-serif; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; }.accent { color: #b9573f; }
	.game-meta { gap: 31px; }.game-meta div:not(.save-state) { border-left: 1px solid #d5d0c5; padding-left: 20px; }.game-meta span { display: block; color: #8e8d83; font: 9px Arial, sans-serif; letter-spacing: 1px; text-transform: uppercase; }.game-meta strong { font-size: 14px; }.save-state { color: #718071; font: 11px Arial, sans-serif; }.icon-button { border: 0; background: none; color: #75796f; cursor: pointer; font-size: 22px; }
	.hero h2 { margin: 8px 0 9px; color: #263c32; font-size: clamp(38px, 5vw, 65px); font-weight: 400; letter-spacing: -3px; }.hero-copy { color: #77786f; font: 14px Arial, sans-serif; }
	.layout, .main-column, .research-section, .tech-preview { min-width: 0; }.main-column { min-width: 0; }.section-heading { min-width: 0; margin-bottom: 15px; gap: 12px; flex-wrap: wrap; }.section-heading h3, .panel-heading h3 { margin-top: 5px; font-size: 23px; font-weight: 400; }.hint { color: #a1a097; font: 11px Arial, sans-serif; }		.resource-card { min-height: 135px; }.resource-top { gap: 9px; }.resource-icon { font-size: 18px; }.resource-label { color: #6d7069; font: 10px Arial, sans-serif; letter-spacing: .8px; text-transform: uppercase; }.resource-bottom { justify-content: space-between; margin-top: 38px; }.resource-bottom strong { font-size: 31px; font-weight: 400; }.stepper { display: flex; gap: 4px; }.stepper button { width: 25px; height: 25px; border: 1px solid #d4cfc4; background: transparent; color: #6f736b; cursor: pointer; font-size: 17px; line-height: 1; }.brick .resource-icon { color: #b9573f; }.wood .resource-icon { color: #567d67; }.sheep .resource-icon { color: #9a8b5a; }.wheat .resource-icon { color: #c28d2e; }.ore .resource-icon { color: #687479; }
	.sidebar { display: flex; flex-direction: column; gap: 24px; }.panel { padding: 23px 20px; border: 1px solid #d8d1c3; background: #fbf8f2; }.panel-heading { justify-content: space-between; margin-bottom: 19px; }.live-dot { color: #61806a; font: 10px Arial, sans-serif; }.live-dot:before { content: '•'; margin-right: 4px; font-size: 17px; }.player-row { gap: 9px; padding: 12px 0; border-top: 1px solid #e4dfd5; }.rank { width: 20px; color: #aca99f; font: 10px Arial, sans-serif; }.avatar { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 50%; color: white; font: 12px Arial, sans-serif; }.player-name { flex: 1; }.player-name strong { display: block; font-size: 13px; font-weight: 400; }.player-name small { display: block; margin-top: 3px; color: #99978d; font: 10px Arial, sans-serif; }.points { color: #263c32; font-size: 17px; font-weight: 400; }.points small { color: #97988e; font: 9px Arial, sans-serif; }.text-button { padding: 13px 0 0; border: 0; background: none; color: #a65442; cursor: pointer; font: 11px Arial, sans-serif; }
	.research-section { padding-top: 3px; }.badge { max-width: 100%; min-width: 0; padding: 5px 8px; border: 1px solid #c9d5c9; color: #67806b; font: 9px Arial, sans-serif; letter-spacing: .7px; text-transform: uppercase; overflow-wrap: anywhere; }.tech-preview { border: 1px solid #d8d1c3; background: #ebe8de; }.tech-branch { min-width: 0; padding: 4px; }.tech-branch-icon { color: #a65442; font-size: 18px; }.tech-branch strong { font-size: 14px; font-weight: 400; }.tech-stepper { display: flex; align-items: center; gap: 3px; }.tech-stepper button { width: 20px; height: 20px; border: 1px solid #c8c2b5; background: transparent; color: #6f736b; cursor: pointer; font-size: 14px; line-height: 1; }.tech-stepper button:disabled { cursor: not-allowed; opacity: .35; }.tech-level { min-width: 25px; color: #777a70; text-align: center; font: 9px Arial, sans-serif !important; }.tech-cost { display: flex !important; align-items: center; gap: 4px; margin-top: 3px; color: #8d8c82; font: 9px Arial, sans-serif; }.tech-resource-icon { font-size: 11px; }.tech-resource-icon.brick { color: #b9573f; }.tech-resource-icon.wheat { color: #c28d2e; }.tech-resource-icon.ore { color: #687479; }.tech-layers { display: flex; flex-direction: column; }.tech-node { display: flex; align-items: center; gap: 8px; min-height: 48px; }.tech-node > span { display: grid; width: 27px; height: 27px; flex: 0 0 27px; place-items: center; border: 1px solid #bfbaa9; border-radius: 50%; color: #797d6e; font: 11px Arial, sans-serif; }.tech-node.unlocked > span { border-color: #66836d; background: #dce8da; color: #52705c; }.tech-node strong, .tech-node small { display: block; }.tech-node strong { font-size: 11px; font-weight: 400; }.tech-node small { margin-top: 3px; color: #99998f; font: 9px Arial, sans-serif; }.tech-node b { margin-left: auto; color: #7d8277; font: 8px Arial, sans-serif; font-weight: 400; }.tech-node.unlocked b { color: #52705c; }.tech-node.locked { opacity: .63; }.tech-line { width: 1px; height: 11px; margin-left: 13px; background: #bbb7aa; }
	footer { justify-content: space-between; margin-top: 46px; padding-top: 16px; border-top: 1px solid #d5d0c5; color: #aaa79d; font: 9px Arial, sans-serif; letter-spacing: 1px; }
	@media (max-width: 900px) { .app-shell { padding: 22px 24px; }.layout { grid-template-columns: 1fr; }.sidebar { display: grid; grid-template-columns: 1fr 1fr; } }
	@media (max-width: 620px) { .app-shell { padding: 18px 15px; }.game-meta > div:not(.save-state), .save-state { display: none; }.hero { display: block; padding: 35px 0; }.resource-card:last-child { grid-column: span 2; }.research-section .section-heading { align-items: flex-start; }.badge { margin-top: 5px; }footer { align-items: flex-start; flex-direction: column; gap: 6px; } }
</style>
