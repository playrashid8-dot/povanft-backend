const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { getUSDTTransactions } = require("../services/blockchainService");

const runDepositWorker = async () => {
  try {
    console.log("🔄 Checking deposits...");

    const users = await User.find();

    for (let user of users) {

      const txs = await getUSDTTransactions(user.walletAddress);

      for (let tx of txs) {

        // sirf incoming tx
        if (tx.to.toLowerCase() !== user.walletAddress.toLowerCase()) continue;

        // already processed?
        const exists = await Transaction.findOne({ txHash: tx.hash });
        if (exists) continue;

        const amount = Number(tx.value) / 1e18;

        // 💰 update balance
        user.balance += amount;
        await user.save();

        // 💾 save tx
        await Transaction.create({
          userId: user._id,
          txHash: tx.hash,
          amount,
          from: tx.from,
          to: tx.to,
          status: "completed"
        });

        console.log(`✅ Deposit: ${amount} USDT -> ${user.username}`);
      }
    }

  } catch (err) {
    console.log("Deposit error:", err.message);
  }
};

module.exports = { runDepositWorker };