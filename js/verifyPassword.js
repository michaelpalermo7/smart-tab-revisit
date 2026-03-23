import { deriveKeyFromPassword } from "./crypto.js";
import { decrypt } from "./decrypt.js";
import { renderList } from "./renderVault.js";
import { setSessionKey, setSessionEntries } from "./session.js";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("unlockBtn");

  btn.addEventListener("click", async () => {
    const password = document.getElementById("enterPass").value;
    if (!password) {
      return;
    }

    //retrieve salt+iv+vault
    const result = await chrome.storage.local.get(["vault", "salt", "iv"]);

    console.log("Vault:", result.vault);
    console.log("Salt:", result.salt);
    console.log("IV:", result.iv);

    const salt = new Uint8Array(result.salt);
    const iv = new Uint8Array(result.iv);
    const vault = result.vault;

    //generate key from password
    const generatedKey = await deriveKeyFromPassword(password, salt);

    //decrypt
    let decrypted;

    try {
      decrypted = await decrypt(vault, generatedKey, iv);
      setSessionKey(generatedKey);
      setSessionEntries(decrypted);
      console.log("Decryption successful");
      renderList();
      document.getElementById("enterPassPrompt").style.display = "none";
      document.getElementById("saveSection").style.display = "block";
    } catch (e) {
      console.error("Password invalid.");
    }
  });
});
