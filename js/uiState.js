document.addEventListener("DOMContentLoaded", async () => {
  const result = await chrome.storage.local.get("vault");

  if (result.vault) {
    document.getElementById("createPassPrompt").style.display = "none";
    document.getElementById("enterPassPrompt").style.display = "block";
    document.getElementById("savePrompts").style.display = "none";
  } else {
    document.getElementById("createPassPrompt").style.display = "block";
    document.getElementById("enterPassPrompt").style.display = "none";
    document.getElementById("savePrompts").style.display = "none";
  }
});
