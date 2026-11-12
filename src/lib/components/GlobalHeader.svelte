<script lang="ts">
	let winner = $state<string | null>(null);
</script>

<div class="flex w-full flex-col gap-2 p-2">
	<ul class="flex items-center justify-between gap-2 pt-2">
		<li class="flex h-6 w-auto items-center gap-2">
			<div class="background-white rounded-full border-2 p-2"></div>
			<svg class="h-6 w-6" fill="gold" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"
				><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
					d="M313 87.2c9.2-7.3 15-18.6 15-31.2 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 12.6 5.9 23.9 15 31.2L194.6 194.8c-10 15.7-31.3 19.6-46.2 8.4L88.9 158.7c4.5-6.4 7.1-14.3 7.1-22.7 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 21.8 17.5 39.6 39.2 40L87.8 393.5c4.7 31.3 31.6 54.5 63.3 54.5l273.8 0c31.7 0 58.6-23.2 63.3-54.5L520.8 176c21.7-.4 39.2-18.2 39.2-40 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 8.4 2.6 16.3 7.1 22.7l-59.4 44.6c-14.9 11.2-36.2 7.3-46.2-8.4L313 87.2z"
				/></svg
			>
		</li>
		<div class="flex items-center gap-4">
			<li class="flex h-7 w-7 items-center">
				<svg class="h-6 w-6"
					fill="white
                "
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 640 512"
					><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
						d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM176 352l32 0c17.7 0 32 14.3 32 32l0 80-96 0 0-80c0-17.7 14.3-32 32-32zM96 112c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM240 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM96 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm144-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM464 0c-17.7 0-32 14.3-32 32l0 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-288 112 0c17.7 0 32-14.3 32-32l0-96c0-17.7-14.3-32-32-32L496 32c0-17.7-14.3-32-32-32z"
					/></svg
				>
			</li>
			<li class="h-6 w-6">
				<svg class="h-6 w-6" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"
					><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
						d="M169.6 153.4l-18.7-18.7c-12.5-12.5-12.5-32.8 0-45.3L265.6-25.4c12.5-12.5 32.8-12.5 45.3 0L329.6-6.6c12.5 12.5 12.5 32.8 0 45.3L214.9 153.4c-12.5 12.5-32.8 12.5-45.3 0zM276 211.7l-31.4-31.4 112-112 119.4 119.4-112 112-31.4-31.4-232 232c-15.6 15.6-40.9 15.6-56.6 0s-15.6-40.9 0-56.6l232-232zM390.9 374.6c-12.5-12.5-12.5-32.8 0-45.3L505.6 214.6c12.5-12.5 32.8-12.5 45.3 0l18.7 18.7c12.5 12.5 12.5 32.8 0 45.3L454.9 393.4c-12.5 12.5-32.8 12.5-45.3 0l-18.7-18.7z"
					/></svg
				>
			</li>
			<button
				class="m-1 flex h-6 w-6 items-center justify-center btn-ghost bg-none"
				onclick={() => document.querySelector<HTMLDialogElement>('#my_modal_1')?.showModal()}
			>
				<svg class="h-6 w-6" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
					><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
						d="M351.9 280l-190.9 0c2.9 64.5 17.2 123.9 37.5 167.4 11.4 24.5 23.7 41.8 35.1 52.4 11.2 10.5 18.9 12.2 22.9 12.2s11.7-1.7 22.9-12.2c11.4-10.6 23.7-28 35.1-52.4 20.3-43.5 34.6-102.9 37.5-167.4zM160.9 232l190.9 0C349 167.5 334.7 108.1 314.4 64.6 303 40.2 290.7 22.8 279.3 12.2 268.1 1.7 260.4 0 256.4 0s-11.7 1.7-22.9 12.2c-11.4 10.6-23.7 28-35.1 52.4-20.3 43.5-34.6 102.9-37.5 167.4zm-48 0C116.4 146.4 138.5 66.9 170.8 14.7 78.7 47.3 10.9 131.2 1.5 232l111.4 0zM1.5 280c9.4 100.8 77.2 184.7 169.3 217.3-32.3-52.2-54.4-131.7-57.9-217.3L1.5 280zm398.4 0c-3.5 85.6-25.6 165.1-57.9 217.3 92.1-32.7 159.9-116.5 169.3-217.3l-111.4 0zm111.4-48C501.9 131.2 434.1 47.3 342 14.7 374.3 66.9 396.4 146.4 399.9 232l111.4 0z"
					/></svg
				>
			</button>
			<dialog id="my_modal_1" class="modal text-black font-bold">
				<div class="modal-box marbleImage">
					<h3 class="text-lg font-bold">Leader Board</h3>
					<p class="py-4 text-shadow-accent">This is where players are going to be able to see the leader board.</p>
					<div class="modal-action">
						<form method="dialog">
							<!-- if there is a button in form, it will close the modal -->
							<button class="btn">Close</button>
						</form>
					</div>
				</div>
			</dialog>
		</div>
	</ul>
</div>

<style>
    .marbleImage {
        background-image: url('../assets/marble.jpg');
    }
</style>
