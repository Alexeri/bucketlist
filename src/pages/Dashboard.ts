import BucketListItem from "../models/BucketListItem.js";
import { requireAuth } from "../utils/auth.js";
import { getElement } from "../utils/dom.js";
import { loadUserData, updateUserData } from "../utils/storage.js";
import { renderUsernameToElement } from "../utils/userDisplay.js";

requireAuth();

// --- DOM elements --- //
const user = getElement<HTMLParagraphElement>("#user-name");
const list = getElement<HTMLUListElement>(".dream-list");

// --- Render functions --- //
function renderList(): void {
  const { bucketList } = loadUserData();
  list.innerHTML = "";

  if (bucketList.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "Inga drömmar ännu.";
    list.appendChild(emptyMessage);
    return;
  }

  bucketList.forEach((item) => {
    const li = document.createElement("li");
    li.className = "dream-list_item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "dream-check";
    checkbox.name = "dream-check";
    checkbox.id = `dream-check-${item.id}`;
    checkbox.checked = item.checked;

    checkbox.addEventListener("change", () => handleToggleDreamCheck(item.id, checkbox.checked));

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.innerHTML = `${item.name}, <span class="dream-theme">${item.theme}</span>`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.innerHTML = `<img src="../assets/images/trash_delete.png" alt="Ta bort dröm" />`;

    deleteButton.addEventListener("click", () => handleDeleteDream(item.id, item.name));

    li.append(checkbox, label, deleteButton);
    list.appendChild(li);
  });
}


// --- Event handlers --- //
function handleToggleDreamCheck(itemId: number, isChecked: boolean): void {
  const { bucketList } = loadUserData();
  const updatedList = bucketList.map((item: BucketListItem) => 
    item.id === itemId ? { ...item, checked: isChecked } : item
  );
  updateUserData({ bucketList: updatedList });
}

function handleDeleteDream(itemId: number, itemName: string): void {
  const confirmed = confirm(`Är du säker på att du vill ta bort "${itemName}"?`);
  if (!confirmed) return;

  const { bucketList } = loadUserData();
  const updatedList = bucketList.filter((d: BucketListItem) => d.id !== itemId);
  updateUserData({ bucketList: updatedList });
  renderList();
}

// --- Initial render --- //
renderList();
renderUsernameToElement(user, "text");
