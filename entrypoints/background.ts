import { protocol } from "@/lib/types";
import type { Runtime } from "wxt/browser";

export default defineBackground(() => {
	browser.runtime.onMessage.addListener(msgCallback) 
  console.log('Hello background!', { id: browser.runtime.id });
});

async function msgCallback(request: protocol, sender: Runtime.MessageSender, sendResponse: () => void) {
	if (request?.type === 'forward') {
		delete request.type
		console.log(`${request.from} ==> ${request.for}`, request)
		browser.tabs.sendMessage(sender.tab?.id ?? (await currTab()).id, request)
	}
}