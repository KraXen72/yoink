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


export function processMarkdown(htmlString: string) {
	const markdownBody = turndownService.turndown(htmlString);
	return markdownBody as string;
}
