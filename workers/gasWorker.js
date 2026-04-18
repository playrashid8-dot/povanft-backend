const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
const mainWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function sendGas(userAddress) {
  const tx = await mainWallet.sendTransaction({
    to: userAddress,
    value: ethers.parseEther("0.00007")
  });

  console.log("Gas sent");
}

module.exports = sendGas;