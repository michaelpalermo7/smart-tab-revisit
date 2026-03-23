import { encryptData } from "../crypto/encryptData.js";
import { generateSalt, deriveKeyFromPassword } from "../crypto/crypto.js";

function validatePassword(password) {
  const minLength = 8;
  const hasNumber = /[0-9]/.test(password);

  const invalidWarning = document.getElementById("invalid-pass");
  const dataWarning = document.getElementById("data-loss-warning");

  if (password.length < minLength || !hasNumber || !password) {
    dataWarning.style.display = "none";
    invalidWarning.style.display = "block";
    return;
  }

  return password;
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("createPassBtn");

  btn.addEventListener("click", async () => {
    try {
      //add pass check
      const password = document.getElementById("createPass").value;
      const validatedPassword = validatePassword(password);
      if (!validatedPassword) return;

      const salt = generateSalt();
      const generatedKey = await deriveKeyFromPassword(validatedPassword, salt);
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
    } catch (err) {
      console.error("Failed to create password:", err);
    }
  });
});
