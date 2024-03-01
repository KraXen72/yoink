(() => {
  // src/popup.ts
  async function trigger() {
    (async () => {
      const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      await chrome.tabs.sendMessage(tab.id, { cmd: "process" });
    })();
  }
  document.getElementById("process-btn").addEventListener("click", trigger);
  trigger();
})();
