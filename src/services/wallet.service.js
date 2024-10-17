import * as nearAPI from 'near-api-js';
import Crypto from 'crypto-js';
import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';
import { encode as base58Encode } from 'bs58';
const { connect, keyStores, utils } = nearAPI;

const config = {
  networkId: 'testnet',
  keyStore: new keyStores.InMemoryKeyStore(),
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
};

// Helper function to convert WordArray to Uint8Array
function wordArrayToUint8Array(wordArray) {
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;
  const u8 = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return u8;
}

// Set sha512 function for ed25519
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

export async function generateKeyPair(phoneNumber, uid) {
  const combined = `${phoneNumber}-${uid}`;
  const fullHash = Crypto.SHA256(combined);
  const hashArray = wordArrayToUint8Array(fullHash);
  const seed = hashArray.slice(0, 32);

  // Generate private key from seed
  const privateKey = ed.utils.randomPrivateKey(seed);
  const publicKey = await ed.getPublicKey(privateKey);

  return { privateKey, publicKey };
}

// Function to generate KeyPair from a private key
function generateKeyPairFromPrivateKey(privateKey) {
  return utils.KeyPair.fromString(privateKey);
}

export async function createAccount(phoneNumber, uid) {
  try {
    const { privateKey, publicKey } = await generateKeyPair(phoneNumber, uid);
    const accountId = phoneNumber.replace(/[^a-zA-Z0-9]/g, '') + '.testnet';
    const publicKeyString = 'ed25519:' + base58Encode(publicKey);

    // Replace this private key with your actual temp account's private key
    const tempAccountPrivateKey = '';
    const tempAccountKeyPair = generateKeyPairFromPrivateKey(tempAccountPrivateKey);

    await config.keyStore.setKey(config.networkId, 'toughkilt7684.testnet', tempAccountKeyPair);

    const near = await connect(config);
    const tempAccount = await near.account('toughkilt7684.testnet');
    console.log(tempAccount);
    const initialBalance = utils.format.parseNearAmount('0.1');
    await tempAccount.createAccount(accountId, publicKeyString, initialBalance);

    const keyPair = utils.KeyPair.fromString('ed25519:' + base58Encode(privateKey));
    await config.keyStore.setKey(config.networkId, accountId, keyPair);
    console.log(keyPair);
    return {
      privateKey: 'ed25519:' + base58Encode(privateKey),
      publicKey: publicKeyString,
      accountId,
    };
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

export async function seedAccount(accountId) {
  try {
    const near = await connect(config);
    const account = await near.account(accountId);
    const amount = utils.format.parseNearAmount('1');

    const result = await account.sendMoney(accountId, amount);
    return result.transaction;
  } catch (error) {
    console.error('Error seeding account:', error);
    throw error;
  }
}

export async function getAccountBalances(accountId) {
  try {
    const near = await connect(config);
    const account = await near.account(accountId);
    const balance = await account.getAccountBalance();

    return {
      total: utils.format.formatNearAmount(balance.total),
      available: utils.format.formatNearAmount(balance.available),
      staked: utils.format.formatNearAmount(balance.staked),
    };
  } catch (error) {
    console.error('Error fetching balances:', error);
    throw error;
  }
}
