import { ulid } from "ulidx";
import type { protocol } from "@/lib/types";

let myUlid = ''

const blacklistedOrigins = [
	'https://tpc.googlesyndication.com',
	'https://googleads.g.doubleclick.net'
]

export default defineContentScript({
	matches: ['<all_urls>'],
	allFrames: true,
	runAt: 'document_start',
	main() { 
		if (
			window.self === window.top // return if we're in the top window.
			|| window.location.origin === 'https://www.google.com' // don't inject into recaptcha
				&& window.location.href.includes('/recaptcha/')
			|| blacklistedOrigins.includes(window.location.origin)
		) return;
		
		console.log(`Hello from yoink's iframe content script`, window.self.location.href)
		browser.runtime.onMessage.addListener(msgCallback)
	}
})

function setULIDandSend() {
	myUlid = ulid()
	browser.runtime.sendMessage({ 
		for: 'content',
		from: 'iframe*',
		cmd: 'iframe-init-ulid',
		type: 'forward',
		data: { src: window.self.location.href, ulid: myUlid },
	} satisfies protocol )
}

async function msgCallback(req: protocol, sender, ) {
	// console.log('iframe script', req, 'name:self', sender )
	if (req.for === 'iframe*' && req.cmd === "iframe-init-ulid") {
		setULIDandSend()
	} else if (
		(req.for === myUlid || (myUlid === '' && req.for === window.location.href)) 
		&& req.cmd === 'iframe-get'
	) {
		const payload: protocol = { 
			for: 'content',
			from: myUlid,
			cmd: 'iframe-get',
			type: 'forward',
			html: document.documentElement.innerHTML,
		}
		// if this iframe missed the iframe-init-ulid message, it can still generate an id and send it's content alongside the id and href.
		// the href might not match the iframe's src, but it's still a lot better than compeltely failing to extract iframe for most cases
		if (myUlid === '') {
			myUlid = ulid()
			payload.data = { ULIDpair: [window.self.location.href, myUlid] }
		}
		browser.runtime.sendMessage(payload)
	}
}