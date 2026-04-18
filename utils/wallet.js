const { ethers } = require("ethers");

const mnemonic = process.env.MNEMONIC;

function generateWallet(index) {
  const wallet = ethers.Wallet.fromPhrase(mnemonic, `m/44'/60'/0'/0/${index}`);
  
  return {
    address: wallet.address,
    privateKey: wallet.privateKey
  };
}

module.exports = generateWallet;