import { encryptData } from "./encryptData.js";
import { generateSalt, deriveKeyFromPassword } from "./crypto.js";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("createPassBtn");

  btn.addEventListener("click", async () => {
    //add pass check
    const password = document.getElementById("createPass").value;
    if (!password) {
      return;
    }
    const salt = generateSalt();
    const generatedKey = await deriveKeyFromPassword(password, salt);
    console.log(generatedKey);

    //encryption
    const vault = [];
    const { ciphertext, iv } = await encryptData(vault, generatedKey);

    //store encrypted data and salt in local storage
    await chrome.storage.local.set(
      {
        vault: ciphertext,
        salt: Array.from(salt),
        iv: Array.from(iv),
      },
      function () {
        console.log(
          `Vault ${vault}, salt ${Array.from(salt)}, and iv ${iv} saved in local storage`
        );
      }
    );

    console.log();

    if (generatedKey) {
      document.getElementById("createPassPrompt").style.display = "none";

      document.getElementById("enterPassPrompt").style.display = "flex";
    }
  });
});
