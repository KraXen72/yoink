import Turndown from '@joplin/turndown';
import { gfm } from '@joplin/turndown-plugin-gfm';

const turndownService = new Turndown({
	headingStyle: 'atx',
	hr: '---',
	bulletListMarker: '-',
	codeBlockStyle: 'fenced',
	emDelimiter: '*',
})
turndownService.use(gfm)

// joplin turndown does have some mathjax rules but i'm not hitting them due to me having to handle mathjax stuff before it get's to readability
// i'm still keeping the fork due to it being more maintained and having more features
turndownService.addRule("mathjax3", {
	filter: (node: HTMLElement) => node.classList.contains("__mjx3-turndown") || node.dataset?.originalMjx,
	escapeContent: () => false,
	replacement: function (content, node, options) {
		// console.log(content, options, node)
    return content
			.replace(/(?<=\$\$)(\S)/g, "\n$1") // start: ensure $$ is on a new line
			.replace(/(\S)(?=\$\$)/g, "$1\n") // end: ensure $$ is on a new line
			.replace(/\\n/g, "\n"); // revive newlines :euphoria:
  }
})
turndownService.addRule("mathjax2_inline", {
	filter: (node: HTMLElement) => node.classList.contains("__mjx2-turndown"),
	escapeContent: () => false,
	replacement: function (content, node, options) {
		return `$${content}$`
	}
})



export function processMarkdown(htmlString: string) {
	const markdownBody = turndownService.turndown(htmlString);
	return markdownBody as string;
}
