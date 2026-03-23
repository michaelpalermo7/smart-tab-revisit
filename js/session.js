let sessionKey = null;
let sessionEntries = [];

export function setSessionKey(key) {
  sessionKey = key;
}

export function getSessionKey() {
  return sessionKey;
}

export function clearSessionKey() {
  sessionKey = null;
}

export function setSessionEntries(entries) {
  sessionEntries = entries;
}
export function getSessionEntries() {
  return sessionEntries;
}
