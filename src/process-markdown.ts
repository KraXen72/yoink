import Turndown from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const turndownService = new Turndown({
	headingStyle: 'atx',
	hr: '---',
	bulletListMarker: '-',
	codeBlockStyle: 'fenced',
	emDelimiter: '*',
})
turndownService.use(gfm)

// mathjax logic initially based on joplin fork of turndoww

function majaxScriptBlockType(node) {
	if (node.nodeName !== 'SCRIPT') return null;

	const a = node.getAttribute('type');
	if (!a || a.indexOf('math/tex') < 0) return null;

	return a.indexOf('display') >= 0 ? 'block' : 'inline';
}

turndownService.addRule("mathjax2Rendered", { 
	filter: function (node: HTMLElement) { return node.nodeName === 'SPAN' && node.getAttribute('class') === 'MathJax' }, 
	replacement: () => "" 
})

turndownService.addRule("mathjax2ScriptInline", { 
	filter: function (node: HTMLElement) { return majaxScriptBlockType(node) === 'inline'; }, 
	escapeContent: function () { return false; }, 
	replacement: function (content, node, options) { return '$' + content + '$'; } 
})

turndownService.addRule("validMathjax", {
	filter: function (node: HTMLElement) {
		return node.classList.contains('__mjx-turndown') || majaxScriptBlockType(node) === 'block';
	},
	escapeContent: function () { return false; },
	replacement: function (content, node, options) {
		return '$$\n' + content + '\n$$';
	}
})

export function processMarkdown(htmlString: string) {
	const markdownBody = turndownService.turndown(htmlString);
	return markdownBody as string;
}
