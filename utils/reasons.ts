export function getReasons(dom: Document) {
	return {
		mathjax3: dom.querySelector("mjx-container") !== null,
		mathjax2: dom.querySelector(`script[type^="math/tex"], script[type^="math/asciimath"]`) !== null,
		katex: dom.querySelector('link[href="katex.min.css"], .katex-mathml, .katex-html, .katex') !== null,
	};
}