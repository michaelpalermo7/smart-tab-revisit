export async function encryptData(data, key) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(data));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  //encrypt with AES-GCM
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedData
  );

  //return new vault and iv for storage
  return {
    ciphertext: Array.from(new Uint8Array(ciphertext)),
    iv: Array.from(iv),
  };
}
