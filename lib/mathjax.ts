/**
 * modifed from:
 * @see https://github.com/laurent22/joplin/tree/dev/packages/turndown
 */
export function mathjax2isBlock(node: Element) {
	if (node.nodeName !== 'SCRIPT') return null;

	const a = node.getAttribute('type');
	if (!a || !a.includes('math/tex') && !a.includes("math/asciimath")) return null;

	return a.indexOf('display') >= 0 ? 'block' : 'inline';
}

export function wrapMathjaxContent(tex: string, delim: string, isBlock?: boolean) {
	if (typeof isBlock === "undefined") isBlock = delim === "$$"
	
	let content = `${delim}`
	if (isBlock) content += "\n"
	content += tex.trim()
	if (isBlock) content += "\n"
	content += delim

	// because turndown's collapse-whitespace removes newlines form multi-line mathjax, we set the wrappers to <pre> and collapse whitespace here
	return content
		.replace(/(?<!\$)\n{2,}|^\s+/gm, '')
}