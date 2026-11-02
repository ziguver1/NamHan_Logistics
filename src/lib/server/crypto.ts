/**
 * Server-side cryptographic utilities using Web Crypto API.
 * Compatible with Node.js 22+ and modern serverless runtimes.
 */

const ALGORITHM = 'AES-GCM';
const IV_LENGTH = 12; // 96 bits for AES-GCM
const KEY_LENGTH = 256;

/**
 * Derives a CryptoKey from a secret passphrase using PBKDF2.
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts plain text into a base64 string formatted as:
 * base64(salt:iv:ciphertext)
 */
export async function encryptData(plainText: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(secret, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv: iv as unknown as ArrayBuffer },
    key,
    enc.encode(plainText)
  );

  const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

  return Buffer.from(combined).toString('base64');
}

/**
 * Decrypts a base64 string formatted as:
 * base64(salt:iv:ciphertext)
 */
export async function decryptData(encryptedBase64: string, secret: string): Promise<string> {
  const combined = Buffer.from(encryptedBase64, 'base64');
  if (combined.length < 16 + IV_LENGTH) {
    throw new Error('Invalid encrypted payload length');
  }

  const salt = combined.subarray(0, 16);
  const iv = combined.subarray(16, 16 + IV_LENGTH);
  const ciphertext = combined.subarray(16 + IV_LENGTH);

  const key = await deriveKey(secret, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: iv as unknown as ArrayBuffer },
    key,
    ciphertext as unknown as ArrayBuffer
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Generates a cryptographically random URL-safe token.
 */
export function generateRandomToken(bytes: number = 24): string {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return Buffer.from(arr).toString('base64url');
}

/**
 * Creates an HMAC-SHA256 signature for session tokens.
 */
export async function signSession(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  const sigBase64 = Buffer.from(signature).toString('base64url');
  return `${payload}.${sigBase64}`;
}

/**
 * Verifies an HMAC-SHA256 signature for session tokens.
 */
export async function verifySession(signedToken: string, secret: string): Promise<string | null> {
  const parts = signedToken.split('.');
  if (parts.length !== 2) return null;

  const [payload, sigBase64] = parts;
  if (!payload || !sigBase64) return null;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const expectedSig = Buffer.from(sigBase64, 'base64url');
  const isValid = await crypto.subtle.verify('HMAC', key, expectedSig, enc.encode(payload));

  return isValid ? payload : null;
}
