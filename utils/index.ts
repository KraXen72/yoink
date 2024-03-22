export async function currTab() {
	const tabs = await browser.tabs.query({ active: true, currentWindow: true })
	for (const tab of tabs) {
		if (!tab.id) continue;
		return tab
	}
	// return void 0
}

export function getReasons(dom: Document) {
	return {
		iframes: dom.querySelector("iframe") !== null,
		mathjax3: dom.querySelector("mjx-container") !== null,
		mathjax2: dom.querySelector(`script[type^="math/tex"], script[type^="math/asciimath"]`) !== null,
		katex: dom.querySelector('link[href="katex.min.css"], .katex-mathml, .katex-html, .katex') !== null,
	};
}

/**
 * create a dom element given an object of properties
 * @param type element type, e.g. "div"
 * @param options options for the element. like class, id, etc
 */
export function elem(
	type: keyof HTMLElementTagNameMap, 
	options: { 'class'?: string | string[] } & Partial<HTMLElement> = {},
	...children: HTMLElement[]
) {
	const element = document.createElement(type)
	if (options.class) {
		if (typeof options.class === 'string') {
			element.classList.add(options.class)
		} else if (Array.isArray(options.class)) {
			element.classList.add(...options.class)
		}
		delete options.class
	}

	Object.assign(element, options)
	if (children.length > 0) {
		for (const child of children) element.appendChild(child)
	}
	return element
}

export function getCharCount(el: HTMLElement, s = ",") {
	return el.innerText.split(s).length - 1;
}