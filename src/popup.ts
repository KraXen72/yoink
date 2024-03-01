async function trigger() {
	(async () => {
		const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
		/*const response =*/ await chrome.tabs.sendMessage(tab.id, {cmd: "process"});
		// do something with response here, not outside the function
		// console.log(response);
	})();
}

document.getElementById("process-btn").addEventListener("click", trigger)
trigger()