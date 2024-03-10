import { Readability } from '@mozilla/readability';
import type { math3Obj } from '@/lib/mathjax3';

export async function processHTML(dom: Document, mathObjs: math3Obj[]) {
	let domm = dom;

	const reasons = {
		mathjax3: dom.querySelector("mjx-container") !== null && (mathObjs || (dom.querySelector("mjx-container") as HTMLElement)?.dataset?.originalMjx),
		mathjax2: dom.querySelector(`script[type="math/tex"]`) !== null
	};

	if (Object.values(reasons).some(Boolean)) {
		let mjx3NodeCounter = 0;

		if (reasons.mathjax3) {
			domm.querySelectorAll("mjx-container").forEach(el => {
				if (typeof (el as HTMLElement).dataset.originalMjx !== 'string' && !mathObjs) return;
				const el2 = el as HTMLElement

				const tex = (typeof el2.dataset.originalMjx === 'string')
					? decodeURIComponent(el2.dataset.originalMjx)
					: `${mathObjs[mjx3NodeCounter].delim}${mathObjs[mjx3NodeCounter].tex}${mathObjs[mjx3NodeCounter].delim}`;
				const isBlock = mathObjs[mjx3NodeCounter] 
					? mathObjs[mjx3NodeCounter].delim === "$$" 
					: tex.startsWith("$$")
				console.log("isBlock", isBlock, tex)

				const wrap = Object.assign(document.createElement(isBlock ? 'div' : 'span'), {
					textContent: tex
				} satisfies Partial<HTMLElement>)
			
				el2.parentElement.replaceChild(wrap, el2)
				mjx3NodeCounter += 1;
			})
		}

		// TODO fully implement
		if (reasons.mathjax2) domm.querySelectorAll(`script[type^="math/tex"]`).forEach(el => {
			const wrap = Object.assign(document.createElement("pre"), {
				textContent: el.innerHTML
			} satisfies Partial<HTMLElement>)
			wrap.classList.add("__mjx2-turndown")

			el.parentElement.replaceChild(wrap, el)
		})
	}

	const { title, byline, content } = new Readability(domm, {
		keepClasses: true,
	}).parse();

	console.log('read', content)

	return content;
}
