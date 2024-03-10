import type { mathJax3Payload } from "@/lib/mathjax3"
import { process } from "@/lib/processor"

export default defineContentScript({
	matches: ['<all_urls>'],
	main() {
		let pageScriptElem: HTMLScriptElement | null = null;
		let scriptTimeout: ReturnType<typeof setTimeout>;
		
		browser.runtime.onMessage.addListener(
			async function (request, sender, sendResponse) {
				if (request.cmd && request.cmd === 'process') {
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
			}
		);
	}
});

