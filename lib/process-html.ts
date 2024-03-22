import { Readability } from '@mozilla/readability';
import { mathjax2displayType, wrapMathjaxContent } from '@/lib/mathjax';
import type { math3Obj } from '@/lib/mathjax3';
import { getReasons, elem, getCharCount } from '@/utils';
import { ulid } from 'ulidx';

interface HTMLProcessRule {
	/** boolean check for the rule. otherwise rule will run always */
	check?: boolean
	/** for document.querySelectorAll */
	selector: string,
	/** rewriter function. return an element if you want it as a replacement */
	rewrite: (el: HTMLElement, dom: Document, storage: HTMLRewriter['storage']) => HTMLElement | void
}

/**
 * A HTMLRewriter - register rewrite rules, that modify some elements based on their queryselector
 * provides access to a simple numeric storage and the whole dom  
 * **note: this is not cloudflare's HTMLRewriter**
 */
export class HTMLRewriter {

	dom: Document
	rules: Record<string, HTMLProcessRule>
	/** only counters for now. */
	storage: Record<string, any>

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

// readability yeets headings if they have a *header* class. smh
rewriter.addRule('preserveHeaders', {
	selector: ':is(h1, h2, h3, h4, h5, h6)[class], :is(h1, h2, h3, h4, h5, h6)[id]',
	rewrite: (el, dom, stor) => {
		if (el.textContent.trim() === "") return;
		el.className = ''
		el.id = `__turndown-${ulid()}`
	}
})

rewriter.addRule('mathjax2', {
	selector: `script[type^="math/tex"], script[type^="math/asciimath"]`,
	rewrite: (el, dom, stor) => {
		const isBlock = mathjax2displayType(el) === 'block'
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
	rewriter.storage.learnxLang = ''

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

	rewriter.processHTML()
	// return rewriter.dom.documentElement.innerHTML

	const { title, byline, content } = new Readability(rewriter.dom, {
		keepClasses: true,
		debug: false,
	}).parse();
	// console.log('read', content)
	return content;
}

// site-specific rules
// feel free to add site specific rules below

// fix some paragraphs not being included in theverge.
// repro: https://www.theverge.com/2022/10/28/23428132/elon-musk-twitter-acquisition-problems-speech-moderation
rewriter.addRule('www.theverge.com', {
	// second url is example for local testing
	check: document.location.origin === 'https://www.theverge.com' || 
		(document.location.protocol === 'file:' && document.location.href.endsWith("verge-stripped.html")),
	selector: '.duet--article--article-body-component',
	rewrite(el, dom, storage) {
		if (el.firstElementChild == null) return;
		if (getCharCount(el.firstElementChild as HTMLElement, ',') < 10) {
			const newElem = elem('figure')
			newElem.append(el.firstElementChild)
			return newElem
		}
	},
})

// codeblocks on learnxinyminutes.com - get language from title at the top
rewriter.addRule('learnxinyminutes.com', {
	check: document.location.origin === 'https://learnxinyminutes.com',
	selector: 'div.highlight', // later, div.highlight:has(pre)
	rewrite(el, dom, stor) {
		if (!stor.learnxLang) { // try to get the language from the h2, e.g. 'Where X=SQL'
			const langCandidates = [...dom.querySelectorAll('.container > h2')]
				.filter(el => el.textContent.includes("Where X="))
			const probableLang = langCandidates[0].textContent.split("=")[1].trim().toLowerCase()
			stor.learnxLang = (!(probableLang.includes(" "))) ? probableLang : ''
		}
		const preEl = elem('pre')
		const codeEl = elem('code', { innerHTML: el.firstElementChild.innerHTML })
		if (stor.learnxLang.trim() !== '') {
			preEl.classList.add(`language-${stor.learnxLang}`)
			codeEl.classList.add(`language-${stor.learnxLang}`)
		}
		preEl.appendChild(codeEl)
		return preEl
	},
})
