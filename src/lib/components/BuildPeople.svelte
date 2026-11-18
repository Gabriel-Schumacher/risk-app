<script lang="ts">
	import { getContext } from 'svelte';
	import { unitBuildOrders } from '#lib/data/unitBuildOrders.ts';
	import { resourceInfo } from '#lib/data/icon.ts';
	import ResourceIcon from '#lib/components/ResourceIcon.svelte';
	import {
		isTechnologyUnlocked,
		technologyProgressContext,
		type TechnologyProgress
	} from '#lib/data/technology.svelte.ts';

	type Resource = keyof typeof resourceInfo;
	const technologyProgress = getContext<TechnologyProgress>(technologyProgressContext);
</script>

<div class="flex flex-col gap-5 pb-8">
	{#each unitBuildOrders as order}
		<section class="flex flex-col gap-3">
			<h4 class="border-b-2 border-[#c7a758] pb-2 text-lg font-bold">{order.title}</h4>
			{#each order.details as detail}
				{@const technologyUnlocked =
					!detail.requirement || isTechnologyUnlocked(technologyProgress, detail.requirement)}
				{@const locked =
					!!detail.requirement && !technologyUnlocked && detail.requirement.mode !== 'upgrade'}
				{@const limited =
					!!detail.requirement && !technologyUnlocked && detail.requirement.mode === 'upgrade'}
				<article
					class={`flex flex-col gap-3 border-2 p-2 ${locked ? 'border-red-700 bg-red-100/60' : limited ? 'border-amber-700 bg-amber-100/60' : 'border-[#b28719]'}`}
				>
					<div>
						<div class="flex flex-wrap items-center gap-2" role="group" aria-label="Build cost">
							<h5 class="font-bold">{detail.title}</h5>
							{#if detail.requirement}
								<span
									class={`rounded border px-2 py-1 text-sm ${locked ? 'border-red-700 text-red-900' : limited ? 'border-amber-700 text-amber-900' : 'border-green-700 text-green-900'}`}
									role="status"
								>
									{locked ? 'Locked' : limited ? 'Limited' : 'Unlocked'} · {detail.requirement.name}
								</span>
							{/if}
							<div class="flex items-center px-2 py-1">
								<span class="flex items-center py-1">
									<strong>${detail.cost.cash} +</strong>
								</span>
								<div class="flex">
									{#each Object.entries(detail.cost.resources) as [resourceKey, amount]}
										{@const resource = resourceKey as Resource}
										{@const info = resourceInfo[resource]}
										<span
											class={`flex items-center py-1 ${info.tone}`}
											role="img"
											aria-label={`${amount} ${info.label}`}
										>
											<span class="flex items-center">
												{#each Array(amount) as _}
													<ResourceIcon {resource} shape="circle" class="mx-0.5" ariaHidden />
												{/each}
											</span>
											<!-- <span>{info.label}</span> -->
										</span>
									{/each}
								</div>
							</div>
						</div>
					</div>

					<p class="leading-relaxed">
						{#each detail.text.split('\\') as segment, index}
							{#if index % 2 === 1}
								<strong>{segment}</strong>
							{:else}
								{segment}
							{/if}
						{/each}
					</p>
				</article>
			{/each}
		</section>
	{/each}
</div>
