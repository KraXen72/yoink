import { Readability } from '@mozilla/readability';
import type { math3Obj } from '@/lib/mathjax3';
import { mathjax2isBlock, wrapMathjaxContent } from './mathjax';
import { getReasons } from '@/utils/reasons';
import { elem } from '@/utils/element';

function getCharCount(el: HTMLElement, s = ",") {
	return el.innerText.split(s).length - 1;
}

interface HTMLProcessRule {
	/** boolean check for the rule. otherwise rule will run always */
	check?: boolean
	/** for document.querySelectorAll */
	selector: string,
	/** rewriter function. return an element if you want it as a replacement */
	rewrite: (el: HTMLElement, dom: Document, storage: Record<string, number>) => HTMLElement | void
}

/**
 * A HTMLRewriter - register rewrite rules, that modify some elements based on their queryselector
 * provides access to a simple numeric storage and the whole dom
 */
class HTMLRewriter {

	dom: Document
	rules: Record<string, HTMLProcessRule>
	/** only counters for now. */
	storage: Record<string, number>

	/**
	 * @param dom You don't need to pass a dom if use registerDOM later. this allows you to instantiate the rewriter and it's rules whenever, and then regiseter the dom only when needed.
	 */
	constructor(dom?: Document) {
		if (dom) this.dom = dom
		this.rules = {}
		this.storage = {}
	}
	
	/** allows to lazily register a DOM later */
	registerDOM(dom: Document) {
		this.dom = dom
	}

	addRule(uniqueRuleKey: string, rule: HTMLProcessRule) {
		this.rules[uniqueRuleKey] = rule
	}

	processHTML() {
		if (!this.dom) {
			throw new Error(`HTMLRewriter was instantiated without a dom, use registerDOM before running processHTML`)
		}
		for (const rule of Object.values(this.rules)) {
			if ('check' in rule && !rule.check) continue;
			const applicable = [...this.dom.querySelectorAll(rule.selector)] as HTMLElement[]
			applicable.forEach(el => {
				const newElem: HTMLElement | void = rule.rewrite(el, this.dom, this.storage)
				if (typeof newElem !== "undefined") el.parentElement.replaceChild(newElem, el)
			})
		}
	}
}

const rewriter = new HTMLRewriter()

rewriter.addRule('mathjax2', {
	selector: `script[type^="math/tex"], script[type^="math/asciimath"]`,
	rewrite: (el, dom, stor) => {
		const isBlock = mathjax2isBlock(el) === 'block'
		const wrap = elem(isBlock ? 'pre' : 'span', {
			textContent: el.innerHTML,
			class: isBlock ? "__mjx2-turndown-block" : "__mjx2-turndown-inline"
		})
		return wrap
	}
})

rewriter.addRule('katex', {
	selector: '.katex-mathml',
	rewrite: (el, dom, stor) => {
		const texEl = el.querySelector(`math > semantics > annotation[encoding*="tex"]`)
		if (el.querySelector('math') === null || texEl === null) return;

		const isBlock = (el.querySelector(`math`).hasAttribute('display')
			&& el.querySelector(`math`).getAttribute("display") === "block"
		) || el.querySelector(`math > semantics > mrow > mstyle[displaystyle="true"]`) !== null

		const wrap = elem(isBlock ? 'pre' : 'span', {
			class: isBlock ? "__katex-turndown-block" : "__katex-turndown-inline",
			textContent: texEl.textContent,
		})
		return wrap
	}
})

export async function processHTML(dom: Document, mathObjs: math3Obj[]) {
	const reasons = getReasons(dom)
	rewriter.registerDOM(dom)
	rewriter.rules['mathjax2'].check = reasons.mathjax2
	rewriter.rules['katex'].check = reasons.katex
	rewriter.storage.mjx3NodeCounter = 0

	rewriter.addRule('mathjax3', {
		check: reasons.mathjax3 && !!(mathObjs || (dom.querySelector("mjx-container") as HTMLElement)?.dataset?.originalMjx),
		selector: 'mjx-container',
		rewrite: (el, dom, stor) => {
			if (typeof (el as HTMLElement).dataset.originalMjx !== 'string' && !mathObjs) return;

			const unwrappedTex = (typeof el.dataset.originalMjx === 'string')
				? decodeURIComponent(el.dataset.originalMjx)
				: mathObjs[stor.mjx3NodeCounter].tex;

			const delim = mathObjs[stor.mjx3NodeCounter]
				? mathObjs[stor.mjx3NodeCounter].delim
				: el.dataset.mjx3delim

			const isBlock = delim === "$$"
			const wrap = elem(isBlock ? 'pre' : 'span', {
				class: '__mjx3-turndown',
				textContent: wrapMathjaxContent(unwrappedTex, delim, isBlock),
			})

			stor.mjx3NodeCounter += 1;
			return wrap
		}
	})

	// fix for https://www.theverge.com/2022/10/28/23428132/elon-musk-twitter-acquisition-problems-speech-moderation
	// likely happens elsewhere too
	// if (reasons.verge) { 
	// 	domm.querySelectorAll(".duet--article--article-body-component").forEach(el => {
	// 		const el2 = el as HTMLElement
	// 		if (el2.firstElementChild == null) return;
	// 		if (getCharCount(el2.firstElementChild as HTMLElement, ',') < 10) {
	// 			const wrap = document.createElement("figure")
	// 			wrap.appendChild(el2.firstElementChild)
	// 			el2.textContent = ""
	// 			el2.appendChild(wrap)
	// 		}
	// 	})
	// }

	rewriter.processHTML()
	console.log(rewriter.dom.documentElement.innerHTML)

	const { title, byline, content } = new Readability(rewriter.dom, {
		keepClasses: true,
		debug: false
	}).parse();
	// console.log('read', reasons, content)

	return content;
}
