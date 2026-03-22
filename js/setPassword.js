document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("unlockBtn");

  btn.addEventListener("click", async () => {
    const password = document.getElementById("createPass").value;
    const salt = generateSalt();
    console.log("User entered followed by salt:", password, salt);
    getKeyFromPassword(password, salt);
    //hide createPass, show savePrompts
  });

  function generateSalt(length = 12) {
    const salt = new Uint8Array(length);
    window.crypto.getRandomValues(salt);

    return salt;
  }

  function getKeyFromPassword(password, salt) {}
});
