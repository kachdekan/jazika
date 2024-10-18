import * as nearAPI from 'near-api-js';
import Crypto from 'crypto-js';
import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';
import { encode as base58Encode } from 'bs58';
import axios from 'axios';

const { connect, keyStores, utils } = nearAPI;

const config = {
  networkId: 'testnet',
  keyStore: new keyStores.InMemoryKeyStore(),
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
};

function wordArrayToUint8Array(wordArray) {
  const { words, sigBytes } = wordArray;
  const u8 = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return u8;
}

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

export async function generateKeyPair(phoneNumber, uid) {
  const combined = `${phoneNumber}-${uid}`;
  const fullHash = Crypto.SHA256(combined);
  const hashArray = wordArrayToUint8Array(fullHash);
  const seed = hashArray.slice(0, 32);

  const privateKey = ed.utils.randomPrivateKey(seed);
  const publicKey = await ed.getPublicKey(privateKey);

  return { privateKey, publicKey };
}

function generateKeyPairFromPrivateKey(privateKey) {
  return utils.KeyPair.fromString(privateKey);
}

export async function createAccountUsingHelper(phoneNumber, uid) {
  try {
    const { privateKey, publicKey } = await generateKeyPair(phoneNumber, uid);
    const accountId = `${phoneNumber.replace(/[^a-zA-Z0-9]/g, '')}.testnet`;
    console.log(accountId);
    const publicKeyString = `ed25519:${base58Encode(publicKey)}`;
    console.log(publicKeyString);

    const response = await retryRequest(async () => {
      return axios.post(
        'https://helper.testnet.near.org/account',
        {
          newAccountId: accountId,
          newPublicKey: publicKeyString,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }, 3);

    if (!response || response.status !== 200) {
      throw new Error('Failed to create account after multiple attempts');
    }

    const data = parseResponse(response.data);
    console.log('Account created:', data);

    const keyPair = utils.KeyPair.fromString(`ed25519:${base58Encode(privateKey)}`);
    await config.keyStore.setKey(config.networkId, accountId, keyPair);

    await verifyAccountCreation(accountId);

    return {
      privateKey: `ed25519:${base58Encode(privateKey)}`,
      publicKey: publicKeyString,
      accountId,
    };
  } catch (error) {
    console.error('Error creating account using helper:', error);
    throw error;
  }
}

async function retryRequest(requestFn, maxRetries) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await requestFn();
      if (response.status === 200) return response;
    } catch (error) {
      console.error(`Error creating account, attempt ${i + 1}:`, error);
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  return null;
}

function parseResponse(rawResponse) {
  console.log('Raw response:', rawResponse);
  const data = typeof rawResponse === 'object' ? rawResponse : JSON.parse(rawResponse);
  if (!data || typeof data !== 'object') {
    throw new Error(`Invalid response data: ${JSON.stringify(rawResponse)}`);
  }
  return data;
}

async function verifyAccountCreation(accountId) {
  const near = await connect(config);
  const account = await near.account(accountId);
  const accountState = await account.state();

  if (!accountState) {
    throw new Error(`Account ${accountId} was not created successfully`);
  }

  console.log('Account state:', accountState);
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
