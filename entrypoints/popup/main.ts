import { protocol } from '@/lib/types';
import './style.css';

async function trigger() {
	const tabs = await browser.tabs.query({ active: true, currentWindow: true })
	for (const tab of tabs) {
		if (!tab.id) continue;
		await browser.tabs.sendMessage(tab.id, { cmd: "process", for: 'content', from: 'popup' } satisfies protocol);
	}
}

document.getElementById("process-btn").addEventListener("click", trigger)
document.addEventListener("DOMContentLoaded", trigger)
