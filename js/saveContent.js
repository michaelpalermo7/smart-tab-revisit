document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("saveBtn");

  async function getCurrentTabUrl() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab) {
      throw new Error("No active tab found");
    }

    if (!tab.url) {
      throw new Error("No URL found");
    }

    return tab.url;
  }

  if (!btn) {
    return;
  }

  btn.addEventListener("click", async () => {
    try {
      let tabUrl = await getCurrentTabUrl();
      const reason = document.getElementById("reasonField").value;
      console.log(tabUrl);
      console.log(reason);
      saveCurrentTabUrl(tabUrl, reason);
    } catch (err) {
      console.error(err);
    }
  });

  function saveCurrentTabUrl(url, reason) {
    chrome.storage.local.set({ url: url, reason: reason }, function () {
      console.log(`URL ${url} and reason ${reason} saved in local storage`);
    });
  }
});
