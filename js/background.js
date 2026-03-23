let sessionKey = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_ENTRIES") {
    chrome.storage.session.get("entries").then((result) => {
      sendResponse({ entries: result.entries || [] });
    });
    return true;
  }
});
