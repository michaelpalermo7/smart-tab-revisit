import { deriveKeyFromPassword } from "../crypto/crypto.js";
import { decrypt } from "../crypto/decrypt.js";
import { renderList } from "../vault/renderVault.js";
import { setSessionKey, setSessionEntries } from "../vault/session.js";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("unlockBtn");

  btn.addEventListener("click", async () => {
    try {
      const password = document.getElementById("enterPass").value;
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

      decrypted = await decrypt(vault, generatedKey, iv);
      setSessionKey(generatedKey);
      setSessionEntries(decrypted);
      console.log("Decryption successful");
      renderList();
      document.getElementById("mascot").style.display = "none";
      document.getElementById("enterPassPrompt").style.display = "none";
      document.getElementById("saveSection").style.display = "block";
    } catch (e) {
      console.error("Password invalid.");
    }
  });
});
