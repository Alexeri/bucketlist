import { requireAuth } from "../utils/auth.js";
import { getElement } from "../utils/dom.js";
import { loadUserData, renameUser, updateUserData } from "../utils/storage.js";
import { USERNAME_KEY } from "../constants/storageKeys.js";
import { validateForm } from "../utils/validation/formValidator.js";
import {
  isSameAsCurrent,
  required,
  themeNotExists,
  usernameAvailable,
} from "../utils/validation/validators.js";
import BucketListItem from "../models/BucketListItem.js";
import { renderUsernameToElement } from "../utils/userDisplay.js";

requireAuth();

// --- DOM elements --- //
const nameInput = getElement<HTMLInputElement>("#name-input");
const saveNameBtn = getElement<HTMLButtonElement>("#save-name");
const addThemeBtn = getElement<HTMLButtonElement>("#add-theme");
const addThemeInput = getElement<HTMLInputElement>("#theme-input");
const themeList = getElement<HTMLUListElement>("#theme-list");
const nameError = getElement<HTMLParagraphElement>("#username-error-message");
const themeError = getElement<HTMLParagraphElement>("#theme-error-message");
const logOutBtn = getElement<HTMLButtonElement>(".logout");

// --- Render functions --- //
function renderThemes(): void {
  const { bucketList, themes } = loadUserData();

  themeList.innerHTML = "";

  if (themes.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "Inga drömteman ännu";
    themeList.appendChild(emptyMessage);
    return;
  }

  themes.forEach((theme, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<p>${theme}</p> <img src="../assets/images/trash_delete.png" class="delete-theme" />`;

    const deleteIcon = li.querySelector(".delete-theme");
    deleteIcon?.addEventListener("click", () =>
      handleDeleteTheme(theme, themes, bucketList)
    );

    themeList.appendChild(li);
  });
}

// --- Event handlers --- //
function handleNameChange(): void {
  const currentUsername = localStorage.getItem(USERNAME_KEY) ?? "";

  const { isValid, values } = validateForm({
    name: {
      value: nameInput.value,
      errorElement: nameError,
      validators: [
        required("Vänligen ange ett användarnamn."),
        isSameAsCurrent(
          currentUsername,
          "Du använder redan detta användarnamn."
        ),
        usernameAvailable("Användarnamnet finns redan."),
      ],
    },
  });

  if (!isValid) return;

  renameUser(values.name);
  alert("Användarnamn uppdaterat!");
}

function handleAddTheme(): void {
  const { themes } = loadUserData();
  const { isValid, values } = validateForm({
    theme: {
      value: addThemeInput.value.trim(),
      errorElement: themeError,
      validators: [
        required("Vänligen ange ett tema."),
        themeNotExists(themes, "Temat finns redan."),
      ],
    },
  });

  if (!isValid) return;
  updateUserData({ themes: [...themes, values.theme] });
  addThemeInput.value = "";
  renderThemes();
}

function handleDeleteTheme(
  theme: string,
  themes: string[],
  bucketList: BucketListItem[]
): void {
  const confirmed = confirm(
    `Är du säker på att du vill ta bort temat "${theme}"?`
  );
  if (!confirmed) return;

  const updatedThemes = themes.filter((t) => t !== theme);
  const updatedBucketList = bucketList.map((item) =>
    item.theme === theme ? { ...item, theme: "tema saknas" } : item
  );

  updateUserData({
    themes: updatedThemes,
    bucketList: updatedBucketList,
  });

  renderThemes();
}

function logOut(): void {
  localStorage.removeItem(USERNAME_KEY);
  window.location.replace("login.html");
}

// --- Event listeners --- //
saveNameBtn.addEventListener("click", handleNameChange);
addThemeBtn.addEventListener("click", handleAddTheme);
logOutBtn.addEventListener("click", logOut);

// --- Initial render --- //
renderUsernameToElement(nameInput, "value");
renderThemes();
