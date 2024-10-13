import { Account, Aptos, AptosConfig, Network, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';
import Crypto from 'crypto-js';

const aptosConfig = new AptosConfig({
  network: Network.TESTNET,
});
const aptos = new Aptos(aptosConfig);

export async function generatePrivateKey(phoneNumber, uid) {
  const combinedString = `${phoneNumber}-${uid}`;
  const hash = Crypto.SHA256(combinedString);
  const hashHex = hash.toString(Crypto.enc.Hex);
  const privateKey = new Ed25519PrivateKey(hashHex);
  return privateKey;
}

export async function createKeylessAccount(phoneNumber, uid) {
  try {
    const privateKey = await generatePrivateKey(phoneNumber, uid);
    const account = Account.fromPrivateKey({ privateKey });
    return {
      account,
      address: account.accountAddress.toString(),
    };
  } catch (error) {
    console.error('Error creating keyless account:', error);
    throw error;
  }
}

export async function seedAccount(address) {
  try {
    const tx = await aptos.fundAccount({
      accountAddress: address,
      amount: 100000000,
    });
    return tx;
  } catch (error) {
    console.error('Error seeding account:', error);
    throw error;
  }
}
