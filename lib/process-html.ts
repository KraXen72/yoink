import { Readability } from '@mozilla/readability';
import type { mathJaxInfo } from '@/lib/mathjax3';

export async function processHTML(dom: Document, mjx3Data: mathJaxInfo) {
	let domm = dom;

	const reasons = {
		mathjax3: dom.querySelector("mjx-container") !== null && (mjx3Data || (dom.querySelector("mjx-container") as HTMLElement)?.dataset?.originalMjx),
		mathjax2: dom.querySelector(`script[type="math/tex"]`) !== null
	};

	if (Object.values(reasons).some(Boolean)) {
		let mjx3NodeCounter = 0;

		if (reasons.mathjax3) domm.querySelectorAll("mjx-container").forEach(el => {
			if (typeof (el as HTMLElement).dataset.originalMjx !== 'string' && !mjx3Data) return;
			const el2 = el as HTMLElement

			const tex = (typeof el2.dataset.originalMjx === 'string')
				? decodeURIComponent(el2.dataset.originalMjx)
				: `${mjx3Data[mjx3NodeCounter].delim}${mjx3Data[mjx3NodeCounter].tex}${mjx3Data[mjx3NodeCounter].delim}`;
			console.log(tex)

			const span = Object.assign(document.createElement("span"), {
				textContent: tex
			} satisfies Partial<HTMLElement>)
			span.classList.add("__mjx3-turndown")
		
			el2.parentElement.replaceChild(span, el2)
			mjx3NodeCounter += 1;
		})
		if (reasons.mathjax2) domm.querySelectorAll(`script[type^="math/tex"]`).forEach(el => {
			const span = Object.assign(document.createElement("span"), {
				textContent: el.innerHTML
			} satisfies Partial<HTMLElement>)
			span.classList.add("__mjx2-turndown")

			el.parentElement.replaceChild(span, el)
		})
	}

	const { title, byline, content } = new Readability(domm, {
		keepClasses: true,
	}).parse();

	console.log('read', content)

	return content;
}
