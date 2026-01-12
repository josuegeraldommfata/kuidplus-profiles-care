const crypto = require('crypto');

const ALGO = 'aes-256-gcm';
const IV_LENGTH = 12; // recommended for GCM

function getKey() {
  const secret = process.env.MP_KEYS_SECRET || process.env.SECRET_KEY || process.env.JWT_SECRET;
  if (!secret) throw new Error('Encryption secret not set (MP_KEYS_SECRET or SECRET_KEY)');
  // derive 32-byte key from secret
  return crypto.createHash('sha256').update(String(secret)).digest();
}

function encrypt(text) {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(String(text), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(payload) {
  if (!payload) return null;
  const key = getKey();
  const parts = String(payload).split(':');
  if (parts.length !== 3) return null;
  const iv = Buffer.from(parts[0], 'hex');
  const tag = Buffer.from(parts[1], 'hex');
  const encrypted = Buffer.from(parts[2], 'hex');
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };
