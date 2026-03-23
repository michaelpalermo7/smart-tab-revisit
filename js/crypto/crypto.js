export async function deriveKeyFromPassword(password, salt) {
  const encoder = new TextEncoder();

  //prepare password for key derivation
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  //encrypt password using web crypto api
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    //key can be exported to raw bytes, needs to be the case
    //to persist key accross popup close/reopen in browser session
    //the key is only ever stored in chrome.storage.session, never written to disk
    true,
    ["encrypt", "decrypt"]
  );

  return key;
}

export function generateSalt(length = 16) {
  const salt = new Uint8Array(length);
  crypto.getRandomValues(salt);

  return salt;
}
