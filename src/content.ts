import { process } from "./processor"

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		// console.log(MathJax.startup.document.getMathItemsWithin(document.body));
		process(document.documentElement.cloneNode(true) as Document)
	}
);