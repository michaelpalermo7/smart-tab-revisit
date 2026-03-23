import { encryptData } from "../crypto/encryptData.js";
import { getSessionKey, setSessionEntries } from "./session.js";
import { decrypt } from "../crypto/decrypt.js";
import { renderList } from "./renderVault.js";

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
      const key = getSessionKey();
      if (!key) {
        console.error("No active session");
        return;
      }

      //get current vault, decrypt it
      const result = await chrome.storage.local.get(["vault", "salt", "iv"]);
      const iv = new Uint8Array(result.iv);
      const currentEntries = await decrypt(result.vault, key, iv);

      //check for duplicates
      for (let i = 0; i < currentEntries.length; i++) {
        if (tabUrl === currentEntries[i].url) {
          console.log("Tab already saved");

          return;
        }
      }
      //append new entry
      currentEntries.push({ url: tabUrl, reason: reason });
      setSessionEntries(currentEntries);
      //encrypt + save
      const { ciphertext, iv: newIv } = await encryptData(currentEntries, key);
      chrome.storage.local.set({
        vault: ciphertext,
        salt: result.salt,
        iv: Array.from(newIv),
      });
      renderList();
    } catch (err) {
      console.error(err);
    }
  });
});
