import { USERNAME_KEY } from "../constants/storageKeys.js";

// Check if user is logged in, redirect to login page if not 
export function requireAuth(): void {
  const username = localStorage.getItem(USERNAME_KEY);
  if (!username) {
    window.location.href = "login.html";
  }
}

// Check if user is logged in, redirect to dashboard if so
export function skipLoginIfAuthenticated(): void {
  const username = localStorage.getItem(USERNAME_KEY);
  if (username) {
    window.location.href = "dashboard.html";
  }
}