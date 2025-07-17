export function getElement<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`Element with selector "${selector}" not found.`);
  return el as T;
}
