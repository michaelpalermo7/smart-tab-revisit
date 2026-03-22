export async function decrypt(vault, key, iv) {
  const encryptedBytes = new Uint8Array(vault);

  // decrypt
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedBytes
  );

  const decoder = new TextDecoder();
  const decryptedString = decoder.decode(decryptedBuffer);

  return JSON.parse(decryptedString);
}
