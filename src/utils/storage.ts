import { bucketList as defaultList } from "../data/bucketListData.js";
import { themes as defaultThemes } from "../data/themesData.js";

import { UserData } from "../models/UserData";
import { USERNAME_KEY, USER_PREFIX } from "../constants/storageKeys.js";

// Get stored logged in user
function getUsername(): string {
  const username = localStorage.getItem(USERNAME_KEY);
  if (!username) throw new Error("No user logged in");
  return username;
}

// Generate storage key for user
export function getUserKey(username: string = getUsername()): string {
  return `${USER_PREFIX}${username}`;
}

// Save user data to local storage
export function saveUserData(data: UserData): void {
  localStorage.setItem(getUserKey(data.name), JSON.stringify(data));
}

// Load user data from local storage or initialize if not found
export function loadUserData(): UserData {
  const username = getUsername();
  const stored = localStorage.getItem(getUserKey(username));

  if (stored) {
    return JSON.parse(stored);
  }
  
  const newUser: UserData = {
    name: getUsername(),
    bucketList: [...defaultList],
    themes: [...defaultThemes],
  };

  saveUserData(newUser);
  return newUser;
}

// Update part of user data
export function updateUserData(partial: Partial<UserData>): void {
  const current = loadUserData();
  const updated: UserData = {
    ...current,
    ...partial,
  };
  saveUserData(updated);
}

// Rename user and move associated data
export function renameUser(newName: string): boolean {
  const oldName = localStorage.getItem(USERNAME_KEY);
  if (!oldName || oldName === newName) return !!oldName;

  const oldKey = getUserKey(oldName);
  const newKey = getUserKey(newName);
  
  const stored = localStorage.getItem(oldKey);
  if (!stored) return false;

  if (localStorage.getItem(newKey)) return false;

  const data: UserData = { ...JSON.parse(stored), name: newName };

  localStorage.setItem(newKey, JSON.stringify(data));
  localStorage.removeItem(oldKey);
  localStorage.setItem(USERNAME_KEY, newName);

  return true;
}
