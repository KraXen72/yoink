import { mjx3CollectPath } from "@/lib/mathjax3"

export default defineUnlistedScript(() => {
	try { 
		if (!(
			globalThis.MathJax?.startup?.document?.math?.list ||
			globalThis.MathJax?.startup?.document?.getMathItemsWithin
		)) {
			window.postMessage({ type: "mathjax3", status: 404, data: "mjx3: MathJax global not found" })
		} else {
			const collected = mjx3CollectPath(
				globalThis.MathJax?.startup?.document?.math?.list,
				globalThis.MathJax?.startup?.document?.getMathItemsWithin(document.documentElement)
			)
			window.postMessage({ type: "mathjax3", status: 200, data: { math: collected } })
		}
	} catch (e) { console.error(e) }
})


