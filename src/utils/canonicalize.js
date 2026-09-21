/**
 * Canonical JSON serialization and Web Crypto SHA-256 utilities.
 * Ensures deterministic string representation and standards-based cryptographic hashing.
 */

/**
 * Deterministically serialize any JavaScript value into a canonical JSON string
 * with recursively sorted object keys.
 *
 * @param {any} val
 * @returns {string}
 */
export function canonicalize(val) {
  if (val === null || val === undefined) {
    return JSON.stringify(val);
  }
  if (typeof val !== 'object') {
    return JSON.stringify(val);
  }
  if (Array.isArray(val)) {
    return '[' + val.map(canonicalize).join(',') + ']';
  }
  const sortedKeys = Object.keys(val).sort();
  const entries = sortedKeys.map(key => `${JSON.stringify(key)}:${canonicalize(val[key])}`);
  return '{' + entries.join(',') + '}';
}

/**
 * Asynchronously compute SHA-256 hash of a string using browser-native Web Crypto API.
 * Returns a 64-character lowercase hex string prefixed with "0x".
 *
 * @param {string} str
 * @returns {Promise<string>}
 */
export async function sha256Hex(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return '0x' + hex;
}
