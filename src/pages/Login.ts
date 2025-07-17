import { USERNAME_KEY } from "../constants/storageKeys.js";
import { skipLoginIfAuthenticated } from "../utils/auth.js";
import { getElement } from "../utils/dom.js";
import { validateForm } from "../utils/validation/formValidator.js";
import { minLength, required } from "../utils/validation/validators.js";

skipLoginIfAuthenticated();

// --- DOM elements --- //
const form = getElement<HTMLFormElement>("#login-form");
const usernameInput = getElement<HTMLInputElement>("#username");
const passwordInput = getElement<HTMLInputElement>("#password");
const usernameError = getElement<HTMLParagraphElement>(
  "#username-error-message"
);
const passwordError = getElement<HTMLParagraphElement>(
  "#password-error-message"
);
const togglePasswordBtn = getElement<HTMLButtonElement>(".toggle-password");
const togglePasswordImg = getElement<HTMLImageElement>(".toggle-password img");


// --- Event handlers --- //
function handleLoginSubmit(e: Event): void {
  e.preventDefault();

  const { isValid } = validateForm({
    username: {
      value: usernameInput.value.trim(),
      errorElement: usernameError,
      validators: [required("Vänligen ange ditt användarnamn.")],
    },
    password: {
      value: passwordInput.value,
      errorElement: passwordError,
      validators: [
        required("Vänligen ange ditt lösenord."),
        minLength(4, "Lösenordet måste vara minst 4 tecken långt"),
      ],
    },
  });

  if (!isValid) return;

  localStorage.setItem(USERNAME_KEY, usernameInput.value.trim());
  window.location.href = "dashboard.html";
}

function handleTogglePasswordVisibility(): void {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePasswordImg.src = "../assets/images/eye-close.png";
    togglePasswordImg.alt = "Dölj lösenord";
  } else {
    passwordInput.type = "password";
    togglePasswordImg.src = "../assets/images/eye-open.png";
    togglePasswordImg.alt = "Visa lösenord";
  }
}

// --- Event listeners --- //
form.addEventListener("submit", handleLoginSubmit);
togglePasswordBtn.addEventListener("click", handleTogglePasswordVisibility);