import type { mathJaxInfo } from './page';
import { Readability } from '@mozilla/readability';

import { unified } from 'unified';
import rehypeRewrite from 'rehype-rewrite';
import rehypeDomParse from 'rehype-dom-parse'
import rehypeStringify from 'rehype-stringify';


export async function processHTML(dom: Document, mjx3Data: mathJaxInfo) {
	let domm = dom
	const parser = new DOMParser()
	
	const reasons = {
		mathjax3: dom.querySelector("mjx-container") !== null && (mjx3Data || (dom.querySelector("mjx-container") as HTMLElement)?.dataset?.originalMjx)
	}

	if (Object.values(reasons).some(Boolean)) {
		let mjx3Data = globalThis.MathJax && globalThis.MathJax.startup.document.getMathItemsWithin(dom)
		console.log(mjx3Data)

		let mjxNodeCounter = 0

		// honestly this could be done with a domparser and either a querySelectorALl or a NodeIterator
		// i'll leave it like this because i might find i have to do additional processing of the html and that might be better in unified
		const vfile = await unified()
			.use(rehypeDomParse)
			.use(rehypeStringify)
			.use(rehypeRewrite, {
				rewrite: (node, index, parent) => {
					if(node.type === 'element' && node.tagName === 'mjx-container') {
						if (typeof node.properties?.dataOriginalMjx !== 'string' && !mjx3Data) return;

						const tex = (typeof node.properties?.dataOriginalMjx === 'string') 
							? decodeURIComponent(node.properties?.dataOriginalMjx) 
							: `${mjx3Data[mjxNodeCounter].delim}${mjx3Data[mjxNodeCounter].tex}${mjx3Data[mjxNodeCounter].delim}`
						
						console.log(node, tex)
						node.tagName = 'span'
						node.children = [ {type: 'text', value: tex } ]
						node.properties.className = '__mjx3-turndown'
						mjxNodeCounter += 1
					}
				}
			})
			.process(dom?.documentElement?.innerHTML ?? (dom as unknown as HTMLElement).innerHTML)
		const stringVFile = String(vfile)
		console.log(stringVFile)
		domm = parser.parseFromString(stringVFile, 'text/html')
	}

	const { title, byline, content } = new Readability(domm, { 
		keepClasses: true,
	}).parse();
	// console.log(content)

	return content
}