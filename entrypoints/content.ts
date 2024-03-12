import type { mathJax3Payload } from "@/lib/mathjax3"
import { process } from "@/lib/processor"
import { getReasons } from "@/utils/reasons";
import { Runtime } from "wxt/browser";
import { mathjax3unneededPayload } from "@/lib/mathjax3";

export default defineContentScript({
	matches: ['<all_urls>'],
	main() { browser.runtime.onMessage.addListener(onMessageCallback) }
});

async function onMessageCallback(request, sender: Runtime.MessageSender, sendResponse: () => void) {
	if (request.cmd && request.cmd === 'process') {
		const reasons = getReasons(document)

		if (reasons.mathjax3) {
			injectPageScriptAndProcess()
		} else {
			process(
				new DOMParser().parseFromString(document.documentElement.innerHTML, 'text/html'),mathjax3unneededPayload
			)
		}
	}
}

/** gets mathjax3 stuff from page global & calls process() */
async function injectPageScriptAndProcess() {
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

	process(new DOMParser().parseFromString(document.documentElement.innerHTML, 'text/html'), mathjaxResult)
}

