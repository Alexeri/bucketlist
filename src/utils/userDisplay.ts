import { loadUserData } from "./storage.js";

export function renderUsernameToElement(
  targetElement: HTMLElement,
  type: "text" | "value" = "text",
  defaultValue: string = "namn"
): void {
  const { name } = loadUserData();

  if (name) {
    if (type === "text") {
      targetElement.innerText = name;
    } else if (type === "value") {
      (targetElement as HTMLInputElement).value = name;
    }
  } else {
    if (type === "text") {
      targetElement.innerText = defaultValue;
    } else if (type === "value") {
      (targetElement as HTMLInputElement).value = defaultValue;
    }
  }
}
