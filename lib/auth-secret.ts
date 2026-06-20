/**
 * Shared resolver for the session signing secret.
 * Edge-safe (no Node APIs) so it can be used by both server code and
 * middleware. Falls back to a development secret when AUTH_SECRET is unset so
 * the app runs out of the box; set AUTH_SECRET in production.
 */
const DEV_FALLBACK = "mahadev-apf-dev-secret-change-me-in-production-0001";

let warned = false;

export function authSecretString(): string {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 16) return s;
  if (!warned) {
    warned = true;
    console.warn(
      "[auth] AUTH_SECRET is not set — using an insecure development secret. " +
        "Set AUTH_SECRET in your environment for production.",
    );
  }
  return DEV_FALLBACK;
}

export function authSecretKey(): Uint8Array {
  return new TextEncoder().encode(authSecretString());
}
