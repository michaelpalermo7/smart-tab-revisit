document.addEventListener("DOMContentLoaded", async () => {
  try {
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
