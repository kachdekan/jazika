import { utils } from 'near-api-js';
import { ec as EC } from 'elliptic';
import { ethers } from 'ethers';
import bs58check from 'bs58check';
import { sha3_256 } from 'js-sha3';
const { base_decode } = utils.serialize;

export async function generateAddresses(accountId) {
  //const mpcAccountId = 'v1.signer-prod.testnet';
  const mpcPublicKey =
    'secp256k1:4NfTiv3UsGahebgTaHyD9vF8KYKMBnfd6kh94mK6xv8fGBiJB8TBtFMP5WWXz6B89Ac1fbpzPwAvoyQebemHFwx3';
  const expPublicKey = uncompressPublicKey(mpcPublicKey);
  const addresses = [];
  //generate for Aurora/0 and Celo/1
  for (let i = 0; i < 2; i++) {
    let childPublicKey = await deriveChildPublicKey(expPublicKey, accountId, `jazika/${i}`);
    let address = uncompressedHexPointToEvmAddress(childPublicKey);
    addresses.push({
      address,
      publicKey: childPublicKey,
    });
  }
  //generate for Bitcoin/2
  const childPublicKey = await deriveChildPublicKey(expPublicKey, accountId, `jazika/2`);
  const address = await uncompressedHexPointToBtcAddress(childPublicKey, Buffer.from([0x6f]));
  addresses.push({
    address,
    publicKey: childPublicKey,
  });

  return addresses;
}

export async function deriveChildPublicKey(parentUncompressedPublicKeyHex, signerId, path = '') {
  const ec = new EC('secp256k1');
  const scalarHex = sha3_256(`near-mpc-recovery v0.1.0 epsilon derivation:${signerId},${path}`);
  /*const scalarHex = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(`near-mpc-recovery v0.1.0 epsilon derivation:${signerId},${path}`),
  );*/

  const x = parentUncompressedPublicKeyHex.substring(2, 66);
  const y = parentUncompressedPublicKeyHex.substring(66);

  // Create a point object from X and Y coordinates
  const oldPublicKeyPoint = ec.curve.point(x, y);

  // Multiply the scalar by the generator point G
  const scalarTimesG = ec.g.mul(scalarHex);

  // Add the result to the old public key point
  const newPublicKeyPoint = oldPublicKeyPoint.add(scalarTimesG);
  const newX = newPublicKeyPoint.getX().toString('hex').padStart(64, '0');
  const newY = newPublicKeyPoint.getY().toString('hex').padStart(64, '0');
  return '04' + newX + newY;
}

//compress secp256k1 uncompressed key
export function compressPublicKey(uncompressedKey) {
  // Remove '0x' prefix if present
  uncompressedKey = uncompressedKey.replace('0x', '');

  const ec = new EC('secp256k1');
  const key = ec.keyFromPublic(uncompressedKey, 'hex');

  // Compress the public key
  const compressedKey = key.getPublic(true, 'hex');
  //console.log(Buffer.from(compressedKey, 'hex').toString('base64'));
  return Buffer.from(compressedKey, 'hex').toString('base64');
}

//uncompress ed25519 public key hex string
function uncompressPublicKey(publicKey) {
  const keyBuffer = base_decode(publicKey.split(':')[1]);
  const key = `04${Buffer.from(keyBuffer).toString('hex')}`;
  return key;
}

function uncompressedHexPointToEvmAddress(uncompressedHexPoint) {
  /* Remove '0x' prefix if present and get the hex bytes
  const hexPoint = uncompressedHexPoint.startsWith('0x')
    ? uncompressedHexPoint.substring(2)
    : uncompressedHexPoint;*/

  // Calculate keccak256 hash
  const hash = ethers.utils.keccak256('0x' + uncompressedHexPoint.substring(2));
  // Take last 20 bytes (40 characters) of the hash
  return '0x' + hash.substring(hash.length - 40);
}

async function uncompressedHexPointToBtcAddress(publicKeyHex, networkByte) {
  // Step 1: SHA-256 hashing of the public key
  const publicKeyBytes = Uint8Array.from(Buffer.from(publicKeyHex, 'hex'));
  const sha256Hash = ethers.utils.sha256(publicKeyBytes);
  //Step 2: RIPEMD-160 hashing on the result of SHA-256
  const ripemd160Hash = ethers.utils.ripemd160(ethers.utils.arrayify(sha256Hash));
  // Step 3:  Adding network byte (0x00 for Bitcoin Mainnet)
  const networkByteAndRipemd160 = Buffer.concat([
    networkByte,
    ethers.utils.arrayify(ripemd160Hash),
  ]);

  //Step 4: Base58Check encoding
  const address = bs58check.encode(networkByteAndRipemd160);

  return address;
}
