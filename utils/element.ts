/**
 * create a dom element given an object of properties
 * @param type element type, e.g. "div"
 * @param options options for the element. like class, id, etc
 */
export function elem(
	type: keyof HTMLElementTagNameMap, 
	options: { 'class'?: string | string[] } & Partial<HTMLElement> = {}
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
	return element
}