<script lang="ts">
	type Resource = 'brick' | 'wood' | 'sheep' | 'wheat' | 'ore';
	type TechnologyBranch = 'Economy' | 'Religion' | 'Military';
	type Layer = { name: string; detail: string; cash: number; resourceAmount: number };
	type Tree = { name: TechnologyBranch; layers: Layer[] };

	let {
		index,
		tree,
		layer,
		technologyProgress,
		resourceInfo,
		technologyResource
	}: {
		index: number;
		tree: Tree;
		layer: Layer;
		technologyProgress: Record<TechnologyBranch, number>;
		resourceInfo: Record<Resource, { label: string; icon: string; tone: string }>;
		technologyResource: Record<TechnologyBranch, Resource>;
	} = $props();
</script>

<div class='{`tech-node ${index < technologyProgress[tree.name] ? 'unlocked' : 'locked'}`}'>
	<div class="flex items-center gap-2 align-middle">
		<p>{index + 1}</p>
		<div class="flex h-6 w-6 items-center justify-center rounded-full border-2 p-1 {index < technologyProgress[tree.name] ? 'border-green-500' : 'border-red-500'}">
			{#if index < technologyProgress[tree.name]}
				<svg class="text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 -32 384 512" width="100%" height="100%"
					><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
						d="M128 96c0-35.3 28.7-64 64-64 31.7 0 58 23 63.1 53.3 2.9 17.4 19.4 29.2 36.9 26.3s29.2-19.4 26.3-36.9C308.1 14.1 255.5-32 192-32 121.3-32 64 25.3 64 96l0 64c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64l-192 0 0-64z"
					/></svg
				>
			{:else}
				<svg class="text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 -32 384 512" width="100%" height="100%" 
					><!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--><path
						d="M128 96l0 64 128 0 0-64c0-35.3-28.7-64-64-64s-64 28.7-64 64zM64 160l0-64C64 25.3 121.3-32 192-32S320 25.3 320 96l0 64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64z"
					/></svg
				>
			{/if}
		</div>
	</div>
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
			<span
				>{layer.resourceAmount}
				{resourceInfo[technologyResource[tree.name]].label.toLowerCase()}</span
			>
		</small>
	</div>
</div>
{#if index < tree.layers.length - 1}<div class="tech-line"></div>{/if}
