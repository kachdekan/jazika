import Crypto from 'crypto-js';
import { ENC_KEY } from '../config';

export function encryptData(data, passcode) {
  const saltedPasscode = saltyPasscode(passcode);
  return Crypto.AES.encrypt(data, saltedPasscode).toString();
}

export function decryptDataWpasscode(encryptedData, passcode) {
  const saltedPasscode = saltyPasscode(passcode);
  const bytes = Crypto.AES.decrypt(encryptedData.toString(), saltedPasscode);
  return bytes.toString(Crypto.enc.Utf8);
}

export function encryptDataWToken(data, token) {
  return Crypto.AES.encrypt(data, token).toString();
}

export function decryptDataWtoken(encryptedData, token) {
  const bytes = Crypto.AES.decrypt(encryptedData.toString(), token);
  return bytes.toString(Crypto.enc.Utf8);
}

export function saltyPasscode(passcode) {
  return Crypto.PBKDF2(passcode, ENC_KEY, { keySize: 8 }).toString();
}
