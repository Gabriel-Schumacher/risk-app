<script lang="ts">
	import { onMount } from 'svelte';
	import BuildBuilding from '#lib/components/BuildBuilding.svelte';
	import BuildPeople from '#lib/components/BuildPeople.svelte';
	import { scoreboard, startScoreboard } from '#lib/data/scoreboard.svelte.ts';

	let leadingPlayerColor = $derived.by(() => {
		if (scoreboard.players.length === 0) return 'black';

		const highestScore = Math.max(...scoreboard.players.map((player) => player.victory_points));
		const leaders = scoreboard.players.filter((player) => player.victory_points === highestScore);
		return leaders.length === 1 ? leaders[0].color : 'white';
	});

	onMount(() => {
		void startScoreboard();
	});
</script>

<div class="flex w-full flex-col gap-2 bg-[#303e4d] p-2">
	<ul class="flex items-center justify-between gap-2 pt-2">
		<div>
			<button
				class="m-1 flex h-8 items-center justify-center gap-2 rounded-full border-2 border-white px-2 text-white"
				aria-label="Open global scoreboard"
				onclick={() => document.querySelector<HTMLDialogElement>('#scoreboard-modal')?.showModal()}
			>
				<li class="flex h-6 w-auto items-center gap-2">
					<div
						class="h-4 w-4 rounded-full border-2 border-white"
						style={`background-color: ${leadingPlayerColor}`}
						aria-label="Leading player's color"
					></div>
					<svg class="h-6 w-6" fill="gold" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"
						><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
							d="M313 87.2c9.2-7.3 15-18.6 15-31.2 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 12.6 5.9 23.9 15 31.2L194.6 194.8c-10 15.7-31.3 19.6-46.2 8.4L88.9 158.7c4.5-6.4 7.1-14.3 7.1-22.7 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 21.8 17.5 39.6 39.2 40L87.8 393.5c4.7 31.3 31.6 54.5 63.3 54.5l273.8 0c31.7 0 58.6-23.2 63.3-54.5L520.8 176c21.7-.4 39.2-18.2 39.2-40 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 8.4 2.6 16.3 7.1 22.7l-59.4 44.6c-14.9 11.2-36.2 7.3-46.2-8.4L313 87.2z"
						/></svg
					>
				</li>
				<span class="sr-only sm:not-sr-only">Scoreboard</span>
			</button>
			<dialog id="scoreboard-modal" class="modal font-bold text-black">
				<div class="marbleImage modal-box">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-bold text-white">Global scoreboard</h2>
						<div class="modal-action">
							<button class="btn" onclick={() => void startScoreboard()}>Refresh</button>
							<form method="dialog">
								<button class="btn">Close</button>
							</form>
						</div>
					</div>
					{#if scoreboard.loading}
						<p class="py-4">Loading scoreboard…</p>
					{:else if scoreboard.error}
						<p class="py-4 text-red-800" role="alert">{scoreboard.error}</p>
					{:else if scoreboard.players.length === 0}
						<p class="py-4">No players have selected a color yet.</p>
					{:else}
						<ul class="flex flex-col gap-2 py-4">
							{#each scoreboard.players as player (player.id)}
								<li
									class="flex items-center justify-between rounded border border-black/20 bg-white/40 p-3"
								>
									<span class="flex items-center gap-3 capitalize">
										<span
											class="h-5 w-5 rounded-full border border-black/30"
											style={`background-color: ${player.color}`}
										></span>
										{player.color}
									</span>
									<strong>{player.victory_points} / 10 points</strong>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</dialog>
		</div>

		<div class="flex items-center gap-4">
			<a href="/">
				<li class="flex h-7 w-7 items-center">
					<svg class="h-7 w-7" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"
						><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
							d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM176 352l32 0c17.7 0 32 14.3 32 32l0 80-96 0 0-80c0-17.7 14.3-32 32-32zM96 112c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM240 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM96 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm144-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM464 0c-17.7 0-32 14.3-32 32l0 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-288 112 0c17.7 0 32-14.3 32-32l0-96c0-17.7-14.3-32-32-32L496 32c0-17.7-14.3-32-32-32z"
						/></svg
					>
				</li>
			</a>
			<a href="/rules/">
				<li class="h-6 w-6">
					<svg class="h-6 w-6" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
						><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
							d="M96 512l320 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-66.7c18.6-6.6 32-24.4 32-45.3l0-288c0-26.5-21.5-48-48-48l-48 0 0 169.4c0 12.5-10.1 22.6-22.6 22.6-6 0-11.8-2.4-16-6.6L272 144 230.6 185.4c-4.2 4.2-10 6.6-16 6.6-12.5 0-22.6-10.1-22.6-22.6L192 0 96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96zM64 416c0-17.7 14.3-32 32-32l256 0 0 64-256 0c-17.7 0-32-14.3-32-32z"
						/></svg
					>
				</li>
			</a>

			<button
				class="m-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white btn-ghost bg-none"
				onclick={() => document.querySelector<HTMLDialogElement>('#my_modal_1')?.showModal()}
			>
				<svg class="h-6 w-6" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"
					><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
						d="M246.9 18.3L271 3.8c21.6-13 46.3-19.8 71.5-19.8 36.8 0 72.2 14.6 98.2 40.7l63.9 63.9c15 15 23.4 35.4 23.4 56.6l0 30.9 19.7 19.7 0 0c15.6-15.6 40.9-15.6 56.6 0s15.6 40.9 0 56.6l-64 64c-15.6 15.6-40.9 15.6-56.6 0s-15.6-40.9 0-56.6L464 240 433.1 240c-21.2 0-41.6-8.4-56.6-23.4l-49.1-49.1c-15-15-23.4-35.4-23.4-56.6l0-12.7c0-11.2-5.9-21.7-15.5-27.4l-41.6-25c-10.4-6.2-10.4-21.2 0-27.4zM50.7 402.7l222.1-222.1 90.5 90.5-222.1 222.1c-25 25-65.5 25-90.5 0s-25-65.5 0-90.5z"
					/></svg
				>
			</button>
			<dialog id="my_modal_1" class="modal font-bold text-black">
				<div class="parchmentImage modal-box">
					<div class="flex items-center justify-between">
						<h3 class="text-lg font-bold">Build Orders</h3>
						<div class="modal-action">
							<form method="dialog">
								<!-- if there is a button in form, it will close the modal -->
								<button class="btn">Close</button>
							</form>
						</div>
					</div>
					<BuildBuilding />
				</div>
			</dialog>
			<button
				class="m-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white btn-ghost bg-none"
				onclick={() => document.querySelector<HTMLDialogElement>('#my_modal_2')?.showModal()}
			>
				<svg class="h-6 w-6" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"
					><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
						d="M248 24a56 56 0 1 0 -112 0 56 56 0 1 0 112 0zm24 212.7l46.3 62.4c10.5 14.2 30.6 17.2 44.8 6.6s17.2-30.6 6.6-44.8l-70.5-95C274 132 234.3 112 192 112s-82 20-107.2 53.9l-70.5 95c-10.5 14.2-7.6 34.2 6.6 44.8s34.2 7.6 44.8-6.6L112 236.7 112 512c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-8.8 7.2-16 16-16s16 7.2 16 16l0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-275.3z"
					/></svg
				>
			</button>
			<dialog id="my_modal_2" class="modal font-bold text-black">
				<div class="parchmentImage modal-box">
					<div class="flex items-center justify-between">
						<h3 class="text-lg font-bold">Build Orders</h3>
						<div class="modal-action">
							<form method="dialog">
								<!-- if there is a button in form, it will close the modal -->
								<button class="btn">Close</button>
							</form>
						</div>
					</div>
					<BuildPeople />
				</div>
			</dialog>
		</div>
	</ul>
</div>

<style>
	.parchmentImage {
		background-image: url('../assets/parchment.jpg');
	}
    .marbleImage {
		background-image: url('../assets/dgmarble.jpg');
	}
</style>
