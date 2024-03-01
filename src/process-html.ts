import { Readability } from '@mozilla/readability';

import { unified } from 'unified';
import rehypeRewrite from 'rehype-rewrite';
import rehypeDomParse from 'rehype-dom-parse'
import rehypeStringify from 'rehype-stringify';


export async function processHTML(dom: Document) {
	let domm = dom
	const parser = new DOMParser()
	
	const reasons = {
		mathjax3: dom.querySelector("mjx-container") !== null
	}

	console.log(dom)
	if (Object.values(reasons).some(r => r === true)) {
		let mjx3Data = globalThis.MathJax && globalThis.MathJax.startup.document.getMathItemsWithin(dom)
		console.log(mjx3Data)

		const vfile = await unified()
			.use(rehypeDomParse)
			.use(rehypeStringify)
			.use(rehypeRewrite, {
				rewrite: (node, index, parent) => {
					if(node.type === 'element' && node.tagName === 'mjx-container') {
						if (!mjx3Data) return;
						const mjxIndex = Number(node.properties.ctxtmenu_counter)
						const tex = mjx3Data[Number.isNaN(mjxIndex) ? index : mjxIndex].math

						node.tagName = 'div'
						node.children = [ {type: 'text', value: tex } ]
						node.properties.className = '__mjx-turndown'
						console.log(node)
					}
				}
			})
			.process(dom?.documentElement?.innerHTML ?? (dom as unknown as HTMLElement).innerHTML)
		domm = parser.parseFromString(String(vfile), 'text/html')
		console.log(domm)
	}
	
	const { title, byline, content } = new Readability(domm, { 
		keepClasses: true,
	}).parse();

	return content
	// ;
}