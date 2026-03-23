import { getSessionEntries } from "./session.js";

export function renderList() {
  const entries = getSessionEntries();
  const list = document.getElementById("vaultList");
  list.innerHTML = "";

  for (let i = 0; i < entries.length; i++) {
    const listItem = document.createElement("li");

    const reason = document.createElement("span");
    reason.className = "entry-reason";
    reason.textContent = entries[i].reason;

    const url = document.createElement("a");
    url.className = "entry-url";
    url.textContent = entries[i].url;
    url.href = entries[i].url;
    url.target = "_blank";

    listItem.appendChild(reason);
    listItem.appendChild(url);
    document.getElementById("vaultList").appendChild(listItem);
  }
}
