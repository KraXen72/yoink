import Turndown from '@joplin/turndown';
import { gfm } from '@joplin/turndown-plugin-gfm';
import { wrapMathjaxContent } from './mathjax';

const turndownService = new Turndown({
	headingStyle: 'atx',
	hr: '---',
	bulletListMarker: '-',
	codeBlockStyle: 'fenced',
	emDelimiter: '*'
})
turndownService.use(gfm)

turndownService.addRule("mathjax3", {
	filter: (node: HTMLElement) => node.classList.contains("__mjx3-turndown") || !!(node.dataset?.originalMjx),
	escapeContent: (node, _options) => false,
	replacement: function (content, node, options) {
		// console.log(content)
    return content
  }
})

turndownService.addRule("mathjax2-katex", {
	filter: (node: HTMLElement) => {
		return node.classList.contains("__mjx2-turndown-inline") 
			|| node.classList.contains("__mjx2-turndown-block")
			|| node.classList.contains("__katex-turndown-inline")
			|| node.classList.contains("__katex-turndown-block")
	},
	escapeContent: () => false,
	replacement: function (content: string, node: HTMLElement) {
		const delim = node.classList.toString().includes("-block") ? "$$" : "$"
		let out = wrapMathjaxContent(content, delim)
		// console.table({ formatted: out, content, delim })
		if (node.classList.contains("__katex-turndown-block")) out = "\n" + out + '\n'
		return out
	}
})
turndownService.addRule("mathjax2-yeetRendered", {
	filter: (node: HTMLElement) => {
		return node.classList.contains("MathJax_CHTML") && node.id 
			&& node.id.startsWith("MathJax-") && node.id.endsWith("Frame")
	},
	replacement: (content: string, node: HTMLElement) => ''
})

export function processMarkdown(htmlString: string) {
	// console.log("input for markdown")
	// console.log(htmlString)
	const markdownBody = turndownService.turndown(htmlString);
	return markdownBody as string;
}
