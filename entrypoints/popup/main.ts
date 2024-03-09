import './style.css';

async function trigger() {
	const tabs = await browser.tabs.query({ active: true, currentWindow: true })
	for (const tab of tabs) {
		if (!tab.id) continue;
		const response = await browser.tabs.sendMessage(tab.id, {cmd: "process"});
		console.log(response)
	}
}

document.getElementById("process-btn").addEventListener("click", trigger)
document.addEventListener("DOMContentLoaded", trigger)
