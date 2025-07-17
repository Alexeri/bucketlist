import { getElement } from "../utils/dom.js";
import BucketListItem from "../models/BucketListItem.js";
import { loadUserData, updateUserData } from "../utils/storage.js";
import { requireAuth } from "../utils/auth.js";
import { validateForm } from "../utils/validation/formValidator.js";
import { required } from "../utils/validation/validators.js";
import { renderUsernameToElement } from "../utils/userDisplay.js";

requireAuth();

// --- DOM elements --- //
const dreamInput = getElement<HTMLInputElement>("#dream");
const themeSelect = getElement<HTMLSelectElement>("#dream-select");
const form = getElement<HTMLFormElement>("form");
const nameEl = getElement<HTMLParagraphElement>("#user-name");
const dreamError = getElement<HTMLParagraphElement>("#dream-error-message");
const themeError = getElement<HTMLParagraphElement>("#theme-error-message");
const successMessage = getElement<HTMLParagraphElement>("#success-message");

// --- Utility functions --- //
function getNextId(list: BucketListItem[]): number {
  if (list.length === 0) return 1;
  return Math.max(...list.map((item) => item.id)) + 1;
}

// --- Render functions --- //
function populateThemes() {
  const { themes } = loadUserData();
  const placeholder = themeSelect.options[0].outerHTML || "";
  themeSelect.innerHTML =
    placeholder +
    themes
      .map((theme) => `<option value="${theme}">${theme}</option>`)
      .join("");
}

// --- Event handlers --- //
function handleAddDreamSubmit(e: Event): void {
  e.preventDefault();

  const { isValid, values } = validateForm({
    dream: {
      value: dreamInput.value.trim(),
      errorElement: dreamError,
      validators: [required("Vänligen ange vad du drömmer om.")],
    },
    theme: {
      value: themeSelect.value,
      errorElement: themeError,
      validators: [required("Vänligen välj ett tema för din dröm.")],
    },
  });

  if (!isValid) return;

  const { dream, theme } = values;

  const userData = loadUserData();
  const newDream: BucketListItem = {
    id: getNextId(userData.bucketList),
    name: dream,
    theme,
    checked: false,
  };

  updateUserData({ bucketList: [...userData.bucketList, newDream] });

  // Reset UI
  dreamInput.value = "";
  themeSelect.value = "";
  successMessage.style.display = "block";
  successMessage.innerText = `Drömmen "${newDream.name}" med temat "${newDream.theme}" har lagts till!`;
}

// --- Event listeners --- //
form.addEventListener("submit", handleAddDreamSubmit);

// --- Initial render --- //
populateThemes();
renderUsernameToElement(nameEl, "text");
