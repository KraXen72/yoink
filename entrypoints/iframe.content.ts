import type { protocol } from "@/lib/types";
// import type { Runtime } from "wxt/browser";

export default defineContentScript({
	matches: ['<all_urls>'],
	allFrames: true,
	main() { 
		if (window.self === window.top) return; // return if we're in the top window.
		console.log(`Hello from yoink's iframe content script`, window.self === window.top, window.self) 
		window.self.addEventListener('message', msgCallback)
	}
})

async function msgCallback(ev: MessageEvent<protocol>) {
	console.log(ev)
	if (ev.data?.for === window.name && ev.data?.cmd === 'iframe-get') {
		console.log(window.name, 'got!')
		// const activeTab = await currTab()
		// if (!activeTab) return;
		// await browser.tabs.sendMessage(activeTab.id, { 
		// 	cmd: "iframe-cont", 
		// 	for: 'content', 
		// 	html: document.documentElement.innerHTML
		// });
	}
}