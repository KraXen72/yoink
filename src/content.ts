import type { mathJaxInfo } from "./page";
import { process } from "./processor"

let pageScriptElem: HTMLScriptElement | null = null;
const pageScriptURL = chrome.runtime.getURL("page.js")

chrome.runtime.onMessage.addListener(
	async function (request, sender, sendResponse) {
		if (request.cmd && request.cmd === 'process') {
			if (pageScriptElem !== null) pageScriptElem.remove();
			pageScriptElem = document.createElement("script")
			pageScriptElem.src = pageScriptURL
			document.head.appendChild(pageScriptElem)

			const mathjaxResult = await Promise.race([
				new Promise((res, rej) => {
					window.addEventListener("message", (e) => {
						if (pageScriptElem !== null) pageScriptElem.remove();
						res(e.data)
					})
				}),
				new Promise((res, rej) => setTimeout(() => res(false), 100))
			]) as mathJaxInfo
	
			// process(document.documentElement.cloneNode(true) as Document, mathjaxResult)
			process(new DOMParser().parseFromString(document.documentElement.innerHTML, 'text/html'), mathjaxResult)
		}
	}
);

