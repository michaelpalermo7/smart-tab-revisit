import { setSessionKey, setSessionEntries } from "../vault/session.js";
import { renderList } from "../vault/renderVault.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const session = await chrome.storage.session.get([
      "entries",
      "exportedKey",
    ]);

    //check if session already exists to avoid password prompt
    if (session.entries && session.exportedKey) {
      const key = await crypto.subtle.importKey(
        "raw",
        new Uint8Array(session.exportedKey),
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );

      setSessionKey(key);
      setSessionEntries(session.entries);
      renderList();

      document.getElementById("mascot").style.display = "none";
      document.getElementById("createPassPrompt").style.display = "none";
      document.getElementById("enterPassPrompt").style.display = "none";
      document.getElementById("saveSection").style.display = "flex";
      return;
    }

    const result = await chrome.storage.local.get("vault");

    if (result.vault) {
      document.getElementById("mascot").style.display = "flex";

      document.getElementById("createPassPrompt").style.display = "none";
      document.getElementById("enterPassPrompt").style.display = "flex";
      document.getElementById("saveSection").style.display = "none";
    } else {
      document.getElementById("mascot").style.display = "flex";

      document.getElementById("createPassPrompt").style.display = "block";
      document.getElementById("enterPassPrompt").style.display = "none";
      document.getElementById("saveSection").style.display = "none";
    }
  } catch (err) {
    console.error("Failed to load state:", err);
  }
});
