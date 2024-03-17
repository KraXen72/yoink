import { process } from "@/lib/processor"
import { getReasons, currTab } from "@/utils";
import { mathjax3unneededPayload } from "@/lib/mathjax3";
import type { mathJax3Payload } from "@/lib/mathjax3"
import type { protocol } from "@/lib/types";
import type { Runtime } from "wxt/browser";
import { HTMLRewriter } from "@/lib/process-html";

interface IExtraData {
	mathjaxResult: mathJax3Payload
}

/** 
 * map initial iframe src's (key) to a ulid that the iframe generates (value).
 * this solves the problem of iframes navigating to different locations and their href not matching
 */
const iframeMap = new Map<string, string>()
const iframeContents = {}
let extraData: IExtraData = { mathjaxResult: mathjax3unneededPayload };

export default defineContentScript({
	matches: ['<all_urls>'],
	main() { 
		console.log(`Hello from yoink's content script`, window.self === window.top)
		browser.runtime.onMessage.addListener(msgCallback) 
		const reasons = getReasons(document)
		if (reasons.iframes) {
			browser.runtime.onMessage.addListener((request: protocol) => {
				// console.log(request)
				if (request?.for !== 'content' 
					|| request?.cmd !== 'iframe-init-ulid' 
					|| typeof request?.data?.src === 'undefined'
					|| request?.data?.ulid === 'undefined'
				) return;
				iframeMap.set(request?.data?.src.toString(), request?.data?.ulid.toString())
			})
			browser.runtime.sendMessage({ from: 'content', type: 'forward', cmd: 'iframe-init-ulid', for: 'iframe*'} satisfies protocol)
		}
	}
});

async function msgCallback(request: protocol, sender: Runtime.MessageSender, sendResponse: () => void) {
	if (request?.for === 'content' && request?.cmd === 'process') {
		const reasons = getReasons(document)
		extraData = (reasons.mathjax3)
			? (await injectPageScript())
			: { mathjaxResult: mathjax3unneededPayload };
		
		console.log('processing', reasons, Object.fromEntries(iframeMap.entries()))

		if (reasons.iframes) {
			for (const ifr of document.querySelectorAll("iframe")) {
				if (typeof iframeMap.get(ifr.src) === 'undefined') {
					// TODO implement fallback getting with src, which also establishes ulid
					console.warn('failed to get uuid for iframe with src:', ifr.src);
					continue;
				}
				console.log('sending for', iframeMap.get(ifr.src))

				// this is not the best solution 
				// there could be 2 iframes with the same src, but a different html due to js changing it
				browser.runtime.sendMessage({ 
					for: iframeMap.get(ifr.src),
					from: 'content',
					type: 'forward', 
					cmd: 'iframe-get', 
				} satisfies protocol)
			}
		} else {
			process_bare()
		}
	} else if (request.for === 'content' && request.cmd === 'iframe-get') {
		iframeContents[request.from] = request.html
		if (Object.keys(iframeContents).length >= iframeMap.size) process_iframes()
	}
}

function process_iframes() {
	// console.log('gonna process iframes')
	const todoDOM = new DOMParser().parseFromString(document.documentElement.innerHTML, 'text/html')
	const rewriter = new HTMLRewriter(todoDOM)
	rewriter.addRule('iframe-repl', {
		selector: 'iframe',
		rewrite(el, dom, storage) {
			const currentULID = iframeMap.get((el as HTMLIFrameElement).src || '')
			if (typeof currentULID === 'undefined') return;
			const content = iframeContents[currentULID]
			if (typeof content === 'undefined') return;
			return elem('div', { innerHTML: content })
		}
	})
	rewriter.processHTML()
	process(
		todoDOM,
		extraData.mathjaxResult
	)
}

function process_bare() {
	process(
		new DOMParser().parseFromString(document.documentElement.innerHTML, 'text/html'),
		extraData.mathjaxResult
	)
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


	const mathjaxResult = await new Promise((res, rej) => {
		window.addEventListener("message", (e) => res(e.data))
		scriptTimeout = setTimeout(() => res(false), 100)
	}) satisfies mathJax3Payload

	if (pageScriptElem !== null) pageScriptElem.remove();
	clearTimeout(scriptTimeout)
	// console.log(mathjaxResult)

	return { mathjaxResult }
	// browser.runtime.sendMessage({
	// 	cmd: 'process', for: 'background',
	// 	html: document.documentElement.innerHTML,
	// 	data: { mjx3: mathjaxResult }
	// } satisfies protocol)
}

