export interface math3Obj {
	delim: string,
	tex: string
}
export type mathJax3Payload = 
	{ status: 200, type: "mathjax3", data: math3Obj[] } |
	{ status: 404, type: "mathjax3", data: 'string' } | false

/** add data attributes to mathjax3 elements */
export function patchMathjaxNode(node: HTMLElement, mObj: math3Obj) {
	if (node.dataset.originalMjx) return;
	node.dataset.mjx3deilm = mObj.delim
	node.dataset.originalMjx = encodeURIComponent(mObj.tex)
}

export function processMathObj(m: any) {
	const mObj: math3Obj = {
		delim: m?.start?.delim ?? m?.end?.delim ?? "$$",
		tex: m.math
	}
	if (!(["$", "$$"].includes(mObj.delim))) mObj.delim = mObj.tex.includes("\n") ? "$$" : "$"
	patchMathjaxNode(m.typesetRoot, mObj)
	return mObj
}

/**
 * collect the mathjax tex commands and patch the mjx-container elements
 */
export function mjx3CollectPatch(mathObj, collectedMathObj) {
	if (!mathObj && !collectedMathObj) return null;

	const acc: math3Obj[] = []
	if (collectedMathObj) {
		for (const m of collectedMathObj) {
			acc.push(processMathObj(m))
		}
		console.log(acc)
		return acc
	} else {
		let next = true;
		let current = mathObj

		while (next) {
			if (current.data?.typesetRoot?.dataset?.originalMjx) { break; }
			if (current.data.toString() !== "Symbol()") { acc.push(processMathObj(current.data)) }
			current = current.next
		}
		return acc
	}
}