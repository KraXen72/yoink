<script lang="ts">
	import type { protocol } from '@/lib/types';
    import { onMount } from 'svelte';

	async function trigger() {
		const tabs = await browser.tabs.query({ active: true, currentWindow: true })
		for (const tab of tabs) {
			if (!tab.id) continue;
			await browser.tabs.sendMessage(tab.id, { cmd: "process", for: 'content', from: 'popup' } satisfies protocol);
		}
	}
	onMount(trigger)
</script>

<button id="process-btn" on:click={trigger}>process</button>

<style>

</style>