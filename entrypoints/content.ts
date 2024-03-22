import { processContent } from "@/lib/processor"
import { HTMLRewriter } from "@/lib/process-html";
import { mathjax3unneededPayload } from "@/lib/mathjax3";
import { getReasons } from "@/utils";
import type { mathJax3Payload } from "@/lib/mathjax3"
import type { protocol } from "@/lib/types";
import type { Runtime } from "wxt/browser";

interface IExtraData {
	mathjaxResult: mathJax3Payload
}

/** 
 * initial iframe src's (key) => ulid that the iframe generates (value).
 * this solves the problem of iframes navigating to different locations and their href not matching
 */
const iframeMap = new Map<string, string>()
const iframeContents = {}
let extraData: IExtraData = { mathjaxResult: null };

function getSelectionHtml() {
	const sel = window.getSelection();
	if (!sel.rangeCount) return '';
	const container = document.createElement("div");
	for (let i = 0; i < sel.rangeCount; ++i) {
		container.appendChild(sel.getRangeAt(i).cloneContents());
	}
	return container.innerHTML;
}

export default defineContentScript({
	matches: ['<all_urls>'],
	main() { 
		console.log(`Hello from yoink's content script`, window.self === window.top)
		browser.runtime.onMessage.addListener(msgCallback) 
		const reasons = getReasons(document)
		if (reasons.iframes && iframeMap.size > 0) {
			browser.runtime.onMessage.addListener((request: protocol) => {
				if (request?.for !== 'content' 
					|| request?.cmd !== 'iframe-init-ulid' 
					|| typeof request?.data?.src === 'undefined'
					|| request?.data?.ulid === 'undefined'
				) return;
				iframeMap.set(request?.data?.src.toString(), request?.data?.ulid.toString())
			})
			browser.runtime.sendMessage({ 
				for: 'iframe*',
				from: 'content', 
				type: 'forward',
				cmd: 'iframe-init-ulid', 
			} satisfies protocol)
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

				// this is not the best solution, but works for most cases
				// there could be 2 iframes with the same src, but a different html due to js changing it
				browser.runtime.sendMessage({ 
					for: iframeMap.get(ifr.src) ?? ifr.src,
					from: 'content',
					type: 'forward', 
					cmd: 'iframe-get', 
				} satisfies protocol)
			}
		} else {
			process_bare()
		}
	} else if (request.for === 'content' && request.cmd === 'iframe-get') {
		if (request.from === '') {
			if (!Array.isArray(request?.data?.ULIDpair) || request?.data?.ULIDpair?.length !== 2) {
				console.warn(`couldn't get contents of iframe with no ulid`)
				return;
			} 
			const [ newSrc, newULID ] = request?.data?.ULIDpair as [string, string]
			iframeMap.set(newSrc, newULID)
			request.from = newULID
		}

		iframeContents[request.from] = request.html
		if (Object.keys(iframeContents).length >= iframeMap.size) process_iframes()
	}
}

function getSelOrDOM() {
	const selHTML = getSelectionHtml()
	if (selHTML !== '') {
		return selHTML
	} else {
		return document.documentElement.innerHTML
	}
}

function process_iframes() {
	console.log('gonna process iframes', 'map', Object.fromEntries(iframeMap.entries()), iframeContents)
	const todoDOM = new DOMParser().parseFromString(getSelOrDOM(), 'text/html')
	const rewriter = new HTMLRewriter(todoDOM)
	rewriter.addRule('iframe-repl', {
		selector: 'iframe',
		rewrite(el, dom, storage) {
			const currentULID = iframeMap.get((el as HTMLIFrameElement).src || '')
			if (typeof currentULID === 'undefined') return;
			const content = iframeContents[currentULID]
			if (typeof content === 'undefined') return;
			return elem('div', { innerHTML: content, class: '__turndown-iframe' })
		}
	})
	rewriter.processHTML()
	processContent(
		todoDOM,
		extraData.mathjaxResult
	)
}

function process_bare() {
	processContent(
		new DOMParser().parseFromString(getSelOrDOM(), 'text/html'),
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

	return { mathjaxResult }
}

