<script lang="ts">
	import { resourceInfo } from '#lib/data/icon.ts';

	let {
		resource,
		shape = 'hex',
		bordered = true,
		borderColor = '#000000',
		class: className = '',
		ariaLabel,
		textColor,
		ariaHidden = false
	}: {
		resource: keyof typeof resourceInfo;
		shape?: 'hex' | 'circle';
		bordered?: boolean;
		borderColor?: string;
		class?: string;
		ariaLabel?: string;
		textColor?: 'black' | 'white';
		ariaHidden?: boolean;
	} = $props();

	const info = $derived(resourceInfo[resource]);
</script>

<span
	class={`resource-icon ${shape === 'hex' ? 'resource-icon-hex' : 'resource-icon-circle'} ${bordered ? 'resource-icon-bordered' : ''} ${className}`}
	style={`background-color: ${bordered ? borderColor : info.color}`}
	role={ariaHidden ? undefined : 'img'}
	aria-label={ariaHidden ? undefined : (ariaLabel ?? info.label)}
	aria-hidden={ariaHidden}
>
	<span
		class="resource-icon-face"
		style={`background-color: ${info.color}; color: ${textColor ?? info.textColor}`}
		aria-hidden="true">{info.icon}</span
	>
</span>

<style>
	.resource-icon {
		position: relative;
		display: inline-flex;
		width: 1.3rem;
		height: 1.3rem;
		flex: none;
		align-items: center;
		justify-content: center;
	}

	.resource-icon-face {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.resource-icon-bordered .resource-icon-face {
		inset: 2px;
	}

	.resource-icon-hex,
	.resource-icon-hex .resource-icon-face {
		clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
	}

	.resource-icon-circle,
	.resource-icon-circle .resource-icon-face {
		border-radius: 9999px;
	}
</style>
