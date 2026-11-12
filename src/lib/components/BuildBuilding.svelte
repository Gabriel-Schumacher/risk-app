<script lang="ts">
	import { buildOrders } from '#lib/data/buildOrders.ts';
	import { resourceInfo } from '#lib/data/icon.ts';

	type Resource = keyof typeof resourceInfo;
</script>

<div class="flex flex-col gap-5">
	{#each buildOrders as order}
		<section class="flex flex-col gap-3">
			<h4 class="border-b border-[#d1ccbf] pb-2 text-lg font-bold">{order.title}</h4>

			{#each order.details as detail}
				<article class="flex flex-col gap-3 border-b border-[#d1ccbf] pb-4 last:border-b-0">
					<h5 class="font-bold">{detail.title}</h5>
					<p class="leading-relaxed">
						{#each detail.text.split('\\') as segment, index}
							{#if index % 2 === 1}
								<strong>{segment}</strong>
							{:else}
								{segment}
							{/if}
						{/each}
					</p>

					<div class="flex flex-wrap items-center gap-2" role="group" aria-label="Build cost">
						<span class="flex items-center gap-1 border border-[#d1ccbf] px-2 py-1">
							Cash <strong>${detail.cost.cash}</strong>
						</span>
						{#each Object.entries(detail.cost.resources) as [resourceKey, amount]}
							{@const resource = resourceKey as Resource}
							{@const info = resourceInfo[resource]}
							<span
								class={`flex items-center gap-2 border border-[#d1ccbf] px-2 py-1 ${info.tone}`}
								role="img"
								aria-label={`${amount} ${info.label}`}
							>
								<span class="flex items-center gap-1">
									{#each Array(amount) as _}
										<span
											class="resource-icon flex h-5 w-5 items-center justify-center rounded-full border-2"
											style={`border-color: ${info.color}; background-color: ${info.color}`}
											aria-hidden="true">{info.icon}</span
										>
									{/each}
								</span>
								<span>{info.label}</span>
							</span>
						{/each}
					</div>
				</article>
			{/each}
		</section>
	{/each}
</div>
