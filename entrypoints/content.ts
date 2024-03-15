import { process } from "@/lib/processor"
import { getReasons, currTab } from "@/utils";
import { mathjax3unneededPayload } from "@/lib/mathjax3";
import type { mathJax3Payload } from "@/lib/mathjax3"
import type { protocol } from "@/lib/types";
import type { Runtime } from "wxt/browser";

export default defineContentScript({
	matches: ['<all_urls>'],
	main() { 
		console.log(`Hello from yoink's content script`, window.self === window.top)
		browser.runtime.onMessage.addListener(msgCallback) 
	}
});

async function msgCallback(request: protocol, sender: Runtime.MessageSender, sendResponse: () => void) {
	if (request?.for === 'content' && request?.cmd === 'process') {
		const reasons = getReasons(document)
		console.log('processing', reasons)
		const extraData = (reasons.mathjax3)
			? (await injectPageScript())
			: { mathjaxResult: mathjax3unneededPayload };

		if (reasons.iframes) {
			// const tabId = (await currTab())!.id
			document.querySelectorAll("iframe").forEach(ifr => {
				if (!ifr.name) ifr.name = window.btoa(new Date().getTime().toString())
				ifr.contentWindow.postMessage({ cmd: 'iframe-get', for: ifr.name })
			})
		}
		const todoDOM = new DOMParser().parseFromString(document.documentElement.innerHTML, 'text/html')
		
		process(
			todoDOM,
			extraData.mathjaxResult
		)
	}
}

/** gets mathjax3 stuff from page global & calls process() */
async function injectPageScript() {
	let pageScriptElem: HTMLScriptElement | null = null;
	let scriptTimeout: ReturnType<typeof setTimeout>;

	if (pageScriptElem !== null) pageScriptElem.remove();
	pageScriptElem = document.createElement("script")
	pageScriptElem.src = browser.runtime.getURL("/page.js")
	pageScriptElem.type = 'text/javascript'
	document.head.appendChild(pageScriptElem)

	console.log(browser.runtime.getURL("/page.js"))

	const mathjaxResult = await new Promise((res, rej) => {
		window.addEventListener("message", (e) => res(e.data))
		scriptTimeout = setTimeout(() => res(false), 100)
	}) satisfies mathJax3Payload

	if (pageScriptElem !== null) pageScriptElem.remove();
	clearTimeout(scriptTimeout)
	console.log(mathjaxResult)

	return { mathjaxResult }
	// browser.runtime.sendMessage({
	// 	cmd: 'process', for: 'background',
	// 	html: document.documentElement.innerHTML,
	// 	data: { mjx3: mathjaxResult }
	// } satisfies protocol)
}

