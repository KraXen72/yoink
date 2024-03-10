import { mjx3CollectPatch } from "@/lib/mathjax3"

export default defineUnlistedScript(() => {
	try { 
		if (!(
			globalThis.MathJax?.startup?.document?.math?.list ||
			globalThis.MathJax?.startup?.document?.getMathItemsWithin
		)) {
			window.postMessage({ type: "mathjax3", status: 404, data: "mjx3: MathJax global not found" })
		} else {
			const collected = mjx3CollectPatch(
				globalThis.MathJax?.startup?.document?.math?.list,
				globalThis.MathJax?.startup?.document?.getMathItemsWithin(document.documentElement)
			)
			window.postMessage({ type: "mathjax3", status: 200, data: collected })
		}
	} catch (e) { console.error(e) }
})


