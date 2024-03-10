import { Readability } from '@mozilla/readability';
import type { math3Obj } from '@/lib/mathjax3';
import { mathjax2isBlock, wrapMathjaxContent } from './mathjax';

function getCharCount(el: HTMLElement, s = ",") {
	return el.innerText.split(s).length - 1;
}

export async function processHTML(dom: Document, mathObjs: math3Obj[]) {
	let domm = dom;

	const reasons = {
		mathjax3: dom.querySelector("mjx-container") !== null && (mathObjs || (dom.querySelector("mjx-container") as HTMLElement)?.dataset?.originalMjx),
		mathjax2: dom.querySelector(`script[type^="math/tex"], script[type^="math/asciimath"]`) !== null,
		katex: dom.querySelector('link[href="katex.min.css"], .katex-mathml, .katex-html, .katex') !== null,
		verge: document.location.origin === "https://www.theverge.com"
	};

	let mjx3NodeCounter = 0;

	if (reasons.mathjax3) {
		domm.querySelectorAll("mjx-container").forEach(el => {
			if (typeof (el as HTMLElement).dataset.originalMjx !== 'string' && !mathObjs) return;
			const el2 = el as HTMLElement

			const unwrappedTex = (typeof el2.dataset.originalMjx === 'string')
				? decodeURIComponent(el2.dataset.originalMjx)
				: mathObjs[mjx3NodeCounter].tex;

			const delim = mathObjs[mjx3NodeCounter]
				? mathObjs[mjx3NodeCounter].delim
				: el2.dataset.mjx3delim

			const isBlock = delim === "$$"
			const wrap = Object.assign(document.createElement(isBlock ? 'pre' : 'span'), {
				textContent: wrapMathjaxContent(unwrappedTex, delim, isBlock)
			} satisfies Partial<HTMLElement>)
			wrap.classList.add("__mjx3-turndown")

			el2.parentElement.replaceChild(wrap, el2)
			mjx3NodeCounter += 1;
		})
	}

	if (reasons.mathjax2) {
		domm.querySelectorAll(`script[type^="math/tex"], script[type^="math/asciimath"]`).forEach(el => {

			const isBlock = mathjax2isBlock(el) === 'block'
			const wrap = Object.assign(document.createElement(isBlock ? 'pre' : 'span'), {
				textContent: el.innerHTML
			} satisfies Partial<HTMLElement>)

			wrap.classList.add(isBlock ? "__mjx2-turndown-block" : "__mjx2-turndown-inline")
			el.parentElement.replaceChild(wrap, el)
		})
	}

	if (reasons.katex) {
		domm.querySelectorAll(".katex-mathml").forEach(el => {
			const texEl = el.querySelector(`math > semantics > annotation[encoding*="tex"]`)
			if (el.querySelector('math') === null || texEl === null) return;

			const isBlock = (el.querySelector(`math`).hasAttribute('display')
				&& el.querySelector(`math`).getAttribute("display") === "block"
			) || el.querySelector(`math > semantics > mrow > mstyle[displaystyle="true"]`) !== null

			const wrap = Object.assign(document.createElement(isBlock ? 'pre' : 'span'), {
				textContent: texEl.textContent
			} satisfies Partial<HTMLElement>)

			console.log(isBlock, texEl.textContent)

			wrap.classList.add(isBlock ? "__katex-turndown-block" : "__katex-turndown-inline")
			el.parentElement.replaceChild(wrap, el)
		})
		// TODO non-mathml extraction? (see katex.org)
	}

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

	const { title, byline, content } = new Readability(domm, {
		keepClasses: true,
		debug: false
	}).parse();
	// console.log('read', reasons, content)

	return content;
}
