import { StaticCeloProvider } from '@celo-tools/celo-ethers-wrapper';
import { BigNumber, ethers } from 'ethers';
import { fetchJson } from '../../scripts/utils';
import { sign } from './wallet.service';
import jazikaGroupsABI from '../abis/JazikaGroups.json';
import { store } from '../redux';

const celo = {
  name: 'alfajores',
  chainId: 44787,
  rpcUrl: 'https://alfajores-forno.celo-testnet.org',
  explorer: 'https://alfajores.celoscan.io',
  nomspaceRegistry: '0x40cd4db228e9c172dA64513D0e874d009486A9a9',
  gasLimit: 21000,
  path: 'jazika/1',
  tokens: {
    CELO: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
    CKES: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
    CUSD: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
  },
  contracts: {
    minGasPrice: '0xd0Bf87a5936ee17014a057143a494Dc5C5d51E5e',
    groups: '0x6596178c648C4AA57bA689A1e735e775d35951a8',
  },

  getProvider: function () {
    return new StaticCeloProvider(this.rpcUrl, {
      chainId: this.chainId,
      name: this.name,
      ensAddress: this.nomspaceRegistry,
    });
  },

  //Get gasPrice
  getGasPrice: async function (params) {
    console.log('Checking balance yet!');
  },

  getBalance: async function (address, token) {
    const tokenABI = ['function balanceOf(address account) external view returns (uint256)'];
    const provider = this.getProvider();
    const contract = new ethers.Contract(this.tokens[token], tokenABI, provider);
    const balance = await contract.balanceOf(address);
    return ethers.utils.formatEther(balance);
  },

  getAllBalances: async function (address) {
    const tokenABI = ['function balanceOf(address account) external view returns (uint256)'];
    const provider = this.getProvider();
    let balances = {
      CELO: 0.0,
      CKES: 0.0,
      CUSD: 0.0,
    };
    for (let i = 0; i < 3; i++) {
      const contract = new ethers.Contract(
        this.tokens[Object.keys(this.tokens)[i]],
        tokenABI,
        provider,
      );
      const balance = await contract.balanceOf(address);
      balances[Object.keys(balances)[i]] = ethers.utils.formatEther(balance);
    }
    return balances;
  },

  getContract: function () {
    const provider = this.getProvider();
    const iface = new ethers.utils.Interface(jazikaGroupsABI);
    const contract = new ethers.Contract(this.contracts.groups, jazikaGroupsABI, provider);
    return {
      contract,
      iface,
    };
  },

  sendTransaction: async function (address, baseTx) {
    //create hash of unsigned TX to sign -> payload
    // get account id from state
    const accountId = store.getState().wallet.userDetails.account.accountId;
    const unsignedTx = ethers.utils.serializeTransaction(baseTx);
    const txHash = ethers.utils.keccak256(unsignedTx);
    const payload = Object.values(ethers.utils.arrayify(txHash));
    const sig = await sign(accountId, payload, this.path);
    if (!sig) return;

    sig.r = '0x' + sig.r.toString('hex');
    sig.s = '0x' + sig.s.toString('hex');
    //console.log('sig', sig);

    // check 2 values for v (y-parity) and recover the same ethereum address
    let addressRecovered = false;
    for (let v = 0; v < 2; v++) {
      sig.v = v + this.chainId * 2 + 35;
      const recoveredAddress = ethers.utils.recoverAddress(payload, sig);
      if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
        addressRecovered = true;
        break;
      }
    }
    if (!addressRecovered) {
      return console.log('signature failed to recover correct sending address');
    }

    // broadcast TX - signature now has correct { r, s, v }
    try {
      const hash = await this.getProvider().send('eth_sendRawTransaction', [
        ethers.utils.serializeTransaction(baseTx, sig),
      ]);
      const receipt = await this.getProvider().waitForTransaction(hash);
      console.log('explorer link', `${this.explorer}/tx/${hash}`);
      return receipt;
    } catch (e) {
      if (/nonce too low/gi.test(JSON.stringify(e))) {
        return console.log('tx has been tried');
      }
      if (/gas too low|underpriced/gi.test(JSON.stringify(e))) {
        return console.log(e);
      }
      console.log(e);
    }
  },

  transfer: async function (from, to, amount, token) {
    const provider = this.getProvider();
    const balance = await this.getBalance(from, token);
    console.log(balance);
    const nonce = await provider.getTransactionCount(from);
    const gasPrice = await provider.getGasPrice();
    const value = ethers.utils.hexlify(ethers.utils.parseUnits(amount));
    if (value === '0x00') {
      console.log('Amount is zero');
    }
    if (
      !balance ||
      BigNumber.from(ethers.utils.parseUnits(balance).toString()).lt(
        BigNumber.from(ethers.utils.parseUnits(amount).toString()).add(
          BigNumber.from(gasPrice).mul(BigNumber.from(this.gasLimit)),
        ),
      )
    ) {
      return console.log('Insufficient funds');
    }
    console.log('sending', amount, token, 'from', from, 'to', to);
    const baseTx = {
      to,
      nonce,
      data: [],
      value,
      gasLimit: this.gasLimit,
      gasPrice,
      chainId: this.chainId,
    };

    await this.sendTransaction(from, baseTx);
  },

  //Create Group
  createGroup: async function (address, groupName, inviteCode) {
    const { contract, iface } = this.getContract();
    const provider = this.getProvider();
    const data = iface.encodeFunctionData('createGroup', [groupName, inviteCode]);
    const nonce = await provider.getTransactionCount(address);
    const gasPrice = await provider.getGasPrice();
    const tx = await this.sendTransaction(address, {
      to: this.contracts.groups,
      data,
      nonce,
      value: 0,
      gasPrice,
      gasLimit: 1000000,
      chainId: this.chainId,
    });
    return tx;
  },

  //Get Member Group
  getMemberGroupId: async function (address) {
    const { contract } = this.getContract();
    const result = await contract.getMemberGroupId(address);
    return result;
  },

  //Join Group
  joinGroup: async function (address, groupID, inviteCode) {
    const { contract, iface } = this.getContract();
    const provider = this.getProvider();
    //encode function data using contract interface
    //const data = iface.encodeFunctionData('joinGroup', [groupID, inviteCode]);
    const data = contract.interface.encodeFunctionData('joinGroup', [groupID, inviteCode]);
    const nonce = await provider.getTransactionCount(address);
    const gasPrice = await provider.getGasPrice();
    const tx = await this.sendTransaction(address, {
      to: this.contracts.groups,
      data,
      nonce,
      value: 0,
      gasPrice,
      gasLimit: 1000000,
      chainId: this.chainId,
    });
    return tx;
  },

  //Get Group
  getGroup: async function (groupID) {
    const { contract } = this.getContract();
    const result = await contract.groups(groupID);
    return result;
  },

  //Request Loan
  requestLoan: async function (address, amount) {
    const { contract, iface } = this.getContract();
    const provider = this.getProvider();
    const data = iface.encodeFunctionData('requestLoan', [
      ethers.utils.parseUnits(amount.toString()),
    ]);
    const nonce = await provider.getTransactionCount(address);
    const gasPrice = await provider.getGasPrice();
    const tx = await this.sendTransaction(address, {
      to: this.contracts.groups,
      data,
      nonce,
      value: 0,
      gasPrice,
      gasLimit: 1000000,
      chainId: this.chainId,
    });

    return tx;
  },

  //Get Member Loan Balance
  getMemberLoanBalance: async function (address) {
    const { contract } = this.getContract();
    const result = await contract.getMemberLoanBalance(address);
    return result;
  },

  //Get Group Loan Balance
  getGroupLoanBalance: async function (groupID) {
    const { contract } = this.getContract();
    const result = await contract.getGroupLoanBalance(groupID);
    return result.toNumber();
  },

  //Repay Loan
  repayLoan: async function (address, amount) {
    const { contract, iface } = this.getContract();
    const provider = this.getProvider();
    //approve spending of token
    const tokenABI = ['function approve(address spender, uint256 amount) public returns (bool)'];
    const token = new ethers.Contract(this.tokens.CKES, tokenABI, provider);
    const approveData = token.interface.encodeFunctionData('approve', [
      this.contracts.groups,
      ethers.utils.parseUnits(amount.toString()),
    ]);
    const approveNonce = await provider.getTransactionCount(address);
    const approveTx = await this.sendTransaction(address, {
      to: this.tokens.CKES,
      data: approveData,
      nonce: approveNonce,
      value: 0,
      gasPrice: await provider.getGasPrice(),
      gasLimit: 1000000,
      chainId: this.chainId,
    });
    //console.log(approveTx);

    const data = iface.encodeFunctionData('repayLoan', [
      ethers.utils.parseUnits(amount.toString()),
    ]);

    const nonce = await provider.getTransactionCount(address);
    const gasPrice = await provider.getGasPrice();
    const tx = await this.sendTransaction(address, {
      to: this.contracts.groups,
      data,
      nonce,
      value: 0,
      gasPrice,
      gasLimit: 1000000,
      chainId: this.chainId,
    });

    return tx;
  },
};

export default celo;
