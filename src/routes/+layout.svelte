<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import GlobalHeader from '#lib/components/GlobalHeader.svelte';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<GlobalHeader />
<div class="p-2 flex flex-col items-center gap-2 w-full">
{@render children()}	
</div>

