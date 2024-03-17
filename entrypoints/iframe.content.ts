import type { protocol } from "@/lib/types";
import { ulid } from "ulidx";
// import type { Runtime } from "wxt/browser";

let myUlid = ''

export default defineContentScript({
	matches: ['<all_urls>'],
	allFrames: true,
	runAt: 'document_start',
	main() { 
		if (window.self === window.top) return; // return if we're in the top window.
		console.log(`Hello from yoink's iframe content script`, window.self.location.href) 
		browser.runtime.onMessage.addListener(msgCallback)
	}
})

async function msgCallback(req: protocol, sender, ) {
	// console.log('iframe script', req, 'name:self', sender )
	if (req.for === 'iframe*' && req.cmd === "iframe-init-ulid") {
		myUlid = ulid()
		browser.runtime.sendMessage({ 
			for: 'content',
			from: 'iframe*',
			cmd: 'iframe-init-ulid',
			type: 'forward',
			data: { src: window.self.location.href, ulid: myUlid },
		} satisfies protocol )
	} else if (req.for === myUlid && req.cmd === 'iframe-get') {
		browser.runtime.sendMessage({ 
			for: 'content',
			from: myUlid,
			cmd: 'iframe-get',
			type: 'forward',
			html: document.documentElement.innerHTML,
		} satisfies protocol )
	}
}