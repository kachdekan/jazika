import * as nearAPI from 'near-api-js';
import CryptoJS from 'crypto-js';
import { ed25519 } from '@noble/curves/ed25519';
import { WORDS } from 'jzk/utils/data';
import { generateAddresses } from '../../scripts';
import { BigNumber } from 'ethers';

const { Near, Account, keyStores, KeyPair, connect } = nearAPI;
/*
const master = {
  accountId: '254712526155.testnet',
  privateKey:
    'ed25519:58CQwMUZF2ZtSPd2E2eGcbdHTfwAhfpAhM5Y8iUPrQzizVC9gM1yqSirytJ5a7XRRy9KCGnr5C2u6PQ57EdEdfzQ',
};*/

const thisAccount = {
  accountId: 'easycoin8945.testnet',
  privateKey:
    'ed25519:3iSUmCdHF1UC7qNMeSNtS9WfMHLRXRr7JryyucqtXpUUcUK7WeBFsPVU8pbtCiRtCizQ5o2zjrbibsc4qN8nhFmb',
};

const contractId = 'v1.signer-prod.testnet';
//set master account in keyStore
const keyStore = new keyStores.InMemoryKeyStore();
keyStore.setKey('testnet', thisAccount.accountId, thisAccount.privateKey);

//configure near connection
const config = {
  networkId: 'testnet',
  keyStore: keyStore,
  nodeUrl: 'https://rpc.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
};

//create master near connection
const near = new Near(config);
//const masterAccount = new Account(near.connection, master.accountId);

async function getBalance(accountId) {
  const account = await near.account(accountId);
  const balance = await account.getAccountBalance();
  console.log(balance);
}

//create new account from a pair of phone number and uid
async function checkAccountAvailability(accountId) {
  try {
    const thisAcc = await near.account(accountId);
    await thisAcc.state('');
    return false; // Account exists
  } catch (error) {
    if (error.type.toString().includes('AccountDoesNotExist')) {
      return true; // Account is available
    }
    throw error; // Other errors
  }
}

async function generateAccountId() {
  for (let i = 0; i < 5; i++) {
    const words = [];
    for (let i = 0; i < 2; i++) {
      const index = Math.floor(Math.random() * WORDS.length);
      words.push(WORDS[index]);
    }
    const digits = Math.floor(Math.random() * 10000);
    words.push(digits.toString().padStart(4, '0'));
    const accountId = `${words.join('').toLowerCase()}.testnet`;
    const isAvailable = await checkAccountAvailability(accountId);
    if (isAvailable) {
      return accountId;
    }
  }

  throw new Error(`Could not find available account ID after 5 attempts`);
}

async function createAccountWithHelper(accountId, publicKey) {
  const response = await fetch(`${config.helperUrl}/account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      newAccountId: accountId,
      newAccountPublicKey: publicKey,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create account: ${error}`);
  }

  return await response.text();
}

function wordArrayToUint8Array(wordArray) {
  const { words, sigBytes } = wordArray;
  const u8 = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return u8;
}

export async function createAccount(phoneNumber, uid) {
  const combined = `${phoneNumber}-${uid}`;
  const fullHash = CryptoJS.SHA256(combined);
  const hashArray = wordArrayToUint8Array(fullHash);
  const seed = hashArray.slice(0, 32);

  // Convert to Near keypair format
  const fullSecretKey = Buffer.concat([Buffer.from(seed), Buffer.from(ed25519.getPublicKey(seed))]);
  const nearKeyPair = KeyPair.fromString(
    `ed25519:${nearAPI.utils.serialize.base_encode(fullSecretKey)}`,
  );

  // Get private and public keys
  const privateKey = nearKeyPair.toString();
  const publicKey = nearKeyPair.publicKey.toString();
  const accountId = await generateAccountId();

  // Create account
  await createAccountWithHelper(accountId, publicKey);
  keyStore.setKey('testnet', accountId, privateKey);
  const extAccounts = await generateAddresses(accountId);
  return { accountId, privateKey, publicKey, extAccounts };
}

export async function sign(accountId, payload, path) {
  const account = await near.account(accountId);
  const accStaet = await account.state();
  console.log(accStaet);

  const args = {
    request: {
      payload,
      path,
      key_version: 0,
    },
  };
  let attachedDeposit = nearAPI.utils.format.parseNearAmount('0.2');
  /*
  const proxyArgs = {
    rlp_payload: undefined,
    path,
    key_version: 0,
  };
  

  /*if (isProxyCall) {
    proxyArgs.rlp_payload = payload.substring(2);
    attachedDeposit = nearAPI.utils.format.parseNearAmount('1');
  }*/

  console.log('sign payload', payload.length > 200 ? payload.length : payload.toString());
  console.log('with path', path);
  console.log('this may take approx. 30 seconds to complete');
  //console.log('argument to sign: ', args);

  let res;
  try {
    res = await account.functionCall({
      contractId,
      methodName: 'sign',
      args: args,
      gas: BigNumber.from('300000000000000'),
      attachedDeposit: BigNumber.from(attachedDeposit),
    });
  } catch (e) {
    console.log(e);
    throw new Error(`error signing ${JSON.stringify(e)}`);
  }

  // parse result into signature values we need r, s but we don't need first 2 bytes of r (y-parity)
  if ('SuccessValue' in res.status) {
    const successValue = res.status.SuccessValue;
    const decodedValue = Buffer.from(successValue, 'base64').toString();
    //console.log('decoded value: ', decodedValue);
    const { big_r, s: S, recovery_id } = JSON.parse(decodedValue);
    const r = Buffer.from(big_r.affine_point.substring(2), 'hex');
    const s = Buffer.from(S.scalar, 'hex');

    return {
      r,
      s,
      v: recovery_id,
    };
  } else {
    throw new Error(`error signing ${JSON.stringify(res)}`);
  }
}
