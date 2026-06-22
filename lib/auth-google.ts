/**
 * Admins allowed to sign in with Google. Override via the
 * ALLOWED_ADMIN_EMAILS env var (comma-separated) if needed.
 */
const DEFAULT_ALLOWED = [
  "atuljotaniya151@gmail.com",
  "rudraxdevelopment98@gmail.com",
  "kuldeepjotaniya83@gmail.com",
];

export const allowedAdminEmails = (
  process.env.ALLOWED_ADMIN_EMAILS
    ? process.env.ALLOWED_ADMIN_EMAILS.split(",")
    : DEFAULT_ALLOWED
)
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAllowedAdmin(email: string): boolean {
  return allowedAdminEmails.includes(email.trim().toLowerCase());
}
