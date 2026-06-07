import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

/* RFC 6238 TOTP (SHA-1, 6 digits, 30s) - no external dependency.
   Used to gate the /admin dashboard behind an authenticator code. */

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/** Generate a random base32 secret (default 20 bytes = 160 bits). */
export function generateSecret(bytes = 20): string {
  let bits = "";
  for (const b of randomBytes(bytes)) bits += b.toString(2).padStart(8, "0");
  let out = "";
  for (let i = 0; i + 5 <= bits.length; i += 5) out += B32[parseInt(bits.slice(i, i + 5), 2)];
  return out;
}

function base32Decode(s: string): Buffer {
  const clean = s.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (const c of clean) bits += B32.indexOf(c).toString(2).padStart(5, "0");
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}

function hotp(secret: Buffer, counter: number): string {
  const buf = Buffer.alloc(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    buf[i] = c & 0xff;
    c = Math.floor(c / 256);
  }
  const hmac = createHmac("sha1", secret).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return (code % 1_000_000).toString().padStart(6, "0");
}

/** Verify a 6-digit token against the secret, allowing +/- one 30s step for clock skew. */
export function verifyTotp(token: string, secretB32: string, window = 1): boolean {
  const t = (token || "").replace(/\D/g, "");
  if (t.length !== 6 || !secretB32) return false;
  const secret = base32Decode(secretB32);
  if (secret.length === 0) return false;
  const counter = Math.floor(Date.now() / 1000 / 30);
  for (let w = -window; w <= window; w++) {
    const candidate = hotp(secret, counter + w);
    if (timingSafeEqual(Buffer.from(candidate), Buffer.from(t))) return true;
  }
  return false;
}

/** otpauth:// URI to add the secret to an authenticator app. */
export function otpauthUri(secretB32: string, account: string, issuer = "Bots & Buyers"): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(
    account,
  )}?secret=${secretB32}&issuer=${encodeURIComponent(issuer)}&period=30&digits=6&algorithm=SHA1`;
}
