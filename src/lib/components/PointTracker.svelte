<script lang="ts">
	import { onMount } from 'svelte';
	import {
		claimPlayerColor,
		playerColors,
		playerStorageKey,
		scoreboard,
		startScoreboard,
		updateVictoryPoints,
		type PlayerColor
	} from '#lib/data/scoreboard.svelte.ts';

	let playerId = $state<string | null>(null);
	let pending = $state(false);
	let actionError = $state('');
	let currentPlayer = $derived(scoreboard.players.find((player) => player.id === playerId));

	onMount(async () => {
		playerId = localStorage.getItem(playerStorageKey);
		await startScoreboard();

		if (
			playerId &&
			scoreboard.loaded &&
			!scoreboard.players.some((player) => player.id === playerId)
		) {
			localStorage.removeItem(playerStorageKey);
			playerId = null;
		}
	});

	async function selectColor(color: PlayerColor) {
		pending = true;
		actionError = '';
		try {
			const player = await claimPlayerColor(color, playerId);
			playerId = player.id;
			localStorage.setItem(playerStorageKey, player.id);
		} catch (error) {
			actionError = error instanceof Error ? error.message : 'Could not select that color.';
		} finally {
			pending = false;
		}
	}

	async function changePoints(amount: number) {
		if (!currentPlayer) return;
		pending = true;
		actionError = '';
		try {
			await updateVictoryPoints(currentPlayer.id, currentPlayer.victory_points + amount);
		} catch (error) {
			actionError = error instanceof Error ? error.message : 'Could not update victory points.';
		} finally {
			pending = false;
		}
	}
</script>

<section
	class="parchmentImage mb-6 rounded-lg p-4 text-black shadow-lg"
	aria-labelledby="point-tracker-title"
>
	<h2 id="point-tracker-title" class="mb-3 text-xl font-bold">Player point tracker</h2>

	{#if currentPlayer}
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<span
					class="h-6 w-6 rounded-full border border-black/30"
					style={`background-color: ${currentPlayer.color}`}
					aria-label={`${currentPlayer.color} player`}
				></span>
				<strong class="capitalize">{currentPlayer.color}</strong>
			</div>
			<div class="flex items-center gap-3" aria-label="Victory points">
				<button
					class="btn btn-sm"
					aria-label="Remove one victory point"
					disabled={pending || currentPlayer.victory_points === 0}
					onclick={() => changePoints(-1)}>−</button
				>
				<strong class="min-w-16 text-center text-lg">
					{currentPlayer.victory_points} / 10
				</strong>
				<button
					class="btn btn-sm"
					aria-label="Add one victory point"
					disabled={pending || currentPlayer.victory_points === 10}
					onclick={() => changePoints(1)}>+</button
				>
			</div>
		</div>
	{:else}
		<p class="mb-3">Choose an available player color to start tracking victory points.</p>
		<div class="flex flex-wrap gap-2">
			{#each playerColors as color}
				{@const takenBy = scoreboard.players.find((player) => player.color === color)}
				<button
					class="btn capitalize btn-sm"
					aria-label={`Select ${color} player color`}
					disabled={pending || !scoreboard.configured || scoreboard.loading || Boolean(takenBy)}
					onclick={() => selectColor(color)}
				>
					<span
						class="h-3 w-3 rounded-full border border-black/30"
						style={`background-color: ${color}`}
					></span>
					{color}{takenBy ? ' · taken' : ''}
				</button>
			{/each}
		</div>
	{/if}

	{#if actionError}
		<p class="mt-3 text-sm text-red-800" role="alert">{actionError}</p>
	{:else if scoreboard.error}
		<p class="mt-3 text-sm text-red-800" role="alert">{scoreboard.error}</p>
	{/if}
</section>

<style>
	.parchmentImage {
		background-image: url('../assets/parchment.jpg');
	}
</style>
