document.addEventListener("DOMContentLoaded", async () => {
  const result = await chrome.storage.local.get("vault");

  if (result.vault) {
    document.getElementById("createPassPrompt").style.display = "none";
    document.getElementById("enterPassPrompt").style.display = "flex";
    document.getElementById("saveSection").style.display = "none";
  } else {
    document.getElementById("createPassPrompt").style.display = "block";
    document.getElementById("enterPassPrompt").style.display = "none";
    document.getElementById("saveSection").style.display = "none";
  }
});
