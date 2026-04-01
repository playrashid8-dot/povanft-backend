const axios = require("axios");
const User = require("../models/User");

const API_KEY = process.env.BSCSCAN_API_KEY;
const USDT = process.env.USDT_CONTRACT;

async function checkDeposits() {
  const users = await User.find();

  for (let user of users) {
    try {
      const url = `https://api.bscscan.com/api?module=account&action=tokentx&address=${user.walletAddress}&contractaddress=${USDT}&apikey=${API_KEY}`;

      const res = await axios.get(url);

      const txs = res.data.result || [];

      for (let tx of txs) {
        if (tx.to.toLowerCase() === user.walletAddress.toLowerCase()) {
          const amount = Number(tx.value) / 1e18;

          if (!user.lastTx || user.lastTx !== tx.hash) {
            user.balance += amount;
            user.teamVolume += amount;

            user.lastTx = tx.hash;

            await user.save();

            console.log(`💰 Deposit: ${amount} USDT`);

            // 👉 CALL REFERRAL + SALARY
            const { distributeReferral } = require("./referralService");
            const { checkSalary } = require("./salaryService");

            await distributeReferral(user, amount);
            checkSalary(user);
          }
        }
      }
    } catch (err) {
      console.log("Deposit error:", err.message);
    }
  }
}

module.exports = { checkDeposits };