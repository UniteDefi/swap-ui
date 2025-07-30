import { keccak256, encodePacked } from "viem";

/**
 * Generates a random secret for HTLC
 * @returns 32-byte hex string
 */
export function generateSecret(): string {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return "0x" + Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generates a keccak256 hash of the secret
 * @param secret - The secret to hash
 * @returns The keccak256 hash of the secret
 */
export function generateSecretHash(secret: string): string {
  return keccak256(encodePacked(["bytes32"], [secret as `0x${string}`]));
}

/**
 * Stores the secret in localStorage for later retrieval
 * @param orderId - The order ID to associate with the secret
 * @param secret - The secret to store
 */
export function storeSecret(orderId: string, secret: string): void {
  const secrets = getStoredSecrets();
  secrets[orderId] = {
    secret,
    timestamp: Date.now(),
  };
  localStorage.setItem("htlc_secrets", JSON.stringify(secrets));
}

/**
 * Retrieves a stored secret by order ID
 * @param orderId - The order ID to lookup
 * @returns The secret if found, null otherwise
 */
export function getSecret(orderId: string): string | null {
  const secrets = getStoredSecrets();
  return secrets[orderId]?.secret || null;
}

/**
 * Gets all stored secrets
 * @returns Object mapping order IDs to secrets
 */
function getStoredSecrets(): Record<string, { secret: string; timestamp: number }> {
  try {
    const stored = localStorage.getItem("htlc_secrets");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Cleans up old secrets (older than 24 hours)
 */
export function cleanupOldSecrets(): void {
  const secrets = getStoredSecrets();
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  
  const cleaned = Object.entries(secrets).reduce((acc, [orderId, data]) => {
    if (data.timestamp > oneDayAgo) {
      acc[orderId] = data;
    }
    return acc;
  }, {} as Record<string, { secret: string; timestamp: number }>);
  
  localStorage.setItem("htlc_secrets", JSON.stringify(cleaned));
}