import { USERNAME_KEY } from "../constants/storageKeys.js";

export function requireAuth(): void {
  const username = localStorage.getItem(USERNAME_KEY);
  if (!username) {
    window.location.href = "login.html";
  }
}

export function skipLoginIfAuthenticated(): void {
  const username = localStorage.getItem(USERNAME_KEY);
  if (username) {
    window.location.href = "dashboard.html";
  }
}