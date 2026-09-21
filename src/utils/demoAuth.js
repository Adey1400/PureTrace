// Demo-only frontend authentication utility.
// This is not intended for production security.

import { DEMO_AUTH_EMAIL, DEMO_AUTH_PASSWORD, DEMO_STORAGE_KEY } from '../config/demoAuth.js';

function getStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
  } catch {
    // localStorage disabled or restricted
  }
  return null;
}

/**
 * Check whether the demo user is currently authenticated via localStorage.
 * @returns {boolean}
 */
export function isAuthenticated() {
  const storage = getStorage();
  if (storage) {
    return storage.getItem(DEMO_STORAGE_KEY) === 'true';
  }
  return false;
}

/**
 * Get the current demo user object if authenticated.
 * @returns {{ email: string, role: string } | null}
 */
export function getCurrentUser() {
  if (isAuthenticated()) {
    return {
      email: DEMO_AUTH_EMAIL,
      role: 'Admin'
    };
  }
  return null;
}

/**
 * Attempt demo login with provided email and password.
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, user?: { email: string, role: string }, error?: string }}
 */
export function login(email, password) {
  const normalizedEmail = (email || '').trim();
  const rawPassword = password || '';

  if (!normalizedEmail) {
    return {
      success: false,
      error: 'Email is required.'
    };
  }

  if (!rawPassword) {
    return {
      success: false,
      error: 'Password is required.'
    };
  }

  // Case-insensitive email comparison, exact password comparison
  const isEmailMatch = normalizedEmail.toLowerCase() === DEMO_AUTH_EMAIL.toLowerCase();
  const isPasswordMatch = rawPassword === DEMO_AUTH_PASSWORD;

  if (!isEmailMatch || !isPasswordMatch) {
    return {
      success: false,
      error: 'Invalid email or password.'
    };
  }

  const storage = getStorage();
  if (storage) {
    try {
      storage.setItem(DEMO_STORAGE_KEY, 'true');
    } catch {
      // storage error fallback
    }
  }

  return {
    success: true,
    user: {
      email: DEMO_AUTH_EMAIL,
      role: 'Admin'
    }
  };
}

/**
 * Clear demo authentication state.
 */
export function logout() {
  const storage = getStorage();
  if (storage) {
    try {
      storage.removeItem(DEMO_STORAGE_KEY);
    } catch {
      // storage error fallback
    }
  }
}
