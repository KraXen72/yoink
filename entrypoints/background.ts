import { protocol } from "@/lib/types";
import type { Runtime } from "wxt/browser";

export default defineBackground(() => {
	browser.runtime.onMessage.addListener(msgCallback) 
  console.log('Hello background!', { id: browser.runtime.id });
});

async function msgCallback(request: protocol, sender: Runtime.MessageSender, sendResponse: () => void) {
	if (request?.cmd === 'process' && request?.for === 'background') {
		
		// TODO sending back to popup/content script
	}
}