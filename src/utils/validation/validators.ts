import { USERNAME_KEY } from "../../constants/storageKeys.js";
import { getUserKey, loadUserData } from "../storage.js";

export type Validator = (value: string) => string | null;

export const required = (message: string): Validator => {
  return (value: string) => (value.trim() ? null : message);
};

export const minLength = (min: number, message: string): Validator => {
  return (value: string) => (value.length >= min ? null : message);
};

export const usernameAvailable = (message: string): Validator => {
  return (value: string): string | null => {
    const current = localStorage.getItem(USERNAME_KEY);
    const existing = localStorage.getItem(getUserKey(value));

    if (existing && value !== current) {
      return message;
    }

    return null;
  };
};

export const isSameAsCurrent = (
  currentValue: string,
  message: string
): Validator => {
  return (value: string): string | null => {
    return value === currentValue ? message : null;
  };
};

export const themeNotExists = (themes: string[], message: string): Validator => {
  return (value: string): string | null => {
    return themes.includes(value) ? message : null;
  };
};