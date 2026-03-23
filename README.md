# Tab Echo

A Chrome extension that saves tabs with context and notifies you when your Google searches match something you've previously saved.

## Features

- Save any tab with a custom reason/context
- AES-GCM encrypted vault, your data never leaves your browser in plaintext
- Password protected with PBKDF2 key derivation via Web Crypto API
- Automatic session persistence, only need to enter your password once per browser session
- Smart keyword matching using NLP (compromise.js) to detect relevant saved tabs when searching on Google

## How It Works

1. Create a password to initialize your encrypted vault
2. Browse to any page and open the extension to save it with a reason
3. When you search on Google, Tab Echo automatically analyzes your query and alerts you if a saved tab matches

## Tech Stack

- JavaScript (ES Modules)
- Web Crypto API (AES-GCM, PBKDF2)
- compromise.js for NLP keyword extraction
- Chrome Extension Manifest V3
- chrome.storage.local for encrypted persistence
- chrome.storage.session for session key management

## Security Model

- Vault is encrypted with AES-GCM 256-bit encryption
- Encryption key is derived from your password using PBKDF2 (100,000 iterations, SHA-256)
- Decrypted data only ever lives in memory (chrome.storage.session), its never written to disk in plaintext
- Exported key stored in session storage is cleared when the browser closes
- No data is sent to any server — everything is local

## Installation (Development)

1. Clone the repo
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer Mode** in the top right
4. Click **Load unpacked** and select the project folder
5. The extension will appear in your toolbar

## Usage

1. Click the Tab Echo icon to open the popup
2. Create a password on first launch
3. Enter your password to unlock the vault
4. Navigate to any page you want to save
5. Open the popup, enter a reason, and click **Save This Page**
6. Search on Google, Tab Echo will alert you if a saved tab matches your query

## Notes

- If you forget your password, your data cannot be recovered
- Uninstalling the extension will delete all saved data
- Data does not sync across devices or browser profiles
