<script lang="ts">
	import { setContext } from 'svelte';
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import {
		technologyProgressContext,
		type TechnologyProgress
	} from '#lib/data/technology.svelte.ts';

	import GlobalHeader from '#lib/components/GlobalHeader.svelte';

	let { children }: LayoutProps = $props();
	const technologyProgress = $state<TechnologyProgress>({
		Economy: 0,
		Religion: 0,
		Military: 0
	});

	setContext(technologyProgressContext, technologyProgress);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<GlobalHeader />
<div class="mapImage flex w-full flex-col items-center gap-2 p-2">
	{@render children()}
</div>

<style>
	.mapImage {
		background-image: url('/src/lib/assets/map.jpg');
	}
</style>
