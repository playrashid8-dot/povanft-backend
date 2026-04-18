const { ethers } = require("ethers");
const User = require("../models/User");

const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");

const USDT = "0x55d398326f99059fF775485246999027B3197955";

const ABI = [
  "function transfer(address to, uint amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)"
];

async function sweepFunds() {
  const users = await User.find();

  for (let user of users) {
    try {
      const wallet = new ethers.Wallet(user.privateKey, provider);
      const contract = new ethers.Contract(USDT, ABI, wallet);

      const balance = await contract.balanceOf(user.walletAddress);

      if (balance > 0) {
        const tx = await contract.transfer(
          process.env.MAIN_WALLET,
          balance
        );

        console.log("Swept:", user.walletAddress);
      }

    } catch (err) {
      console.log("Sweep error:", err.message);
    }
  }
}

module.exports = sweepFunds;