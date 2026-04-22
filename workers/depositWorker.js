const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { getUSDTTransactions } = require("../services/blockchainService");

exports.runDepositWorker = async () => {
  console.log("🔄 Checking deposits...");

  const users = await User.find();

  for (let user of users) {
    try {
      const txs = await getUSDTTransactions(user.walletAddress);

      for (let tx of txs) {
        // Only incoming tx
        if (tx.to.toLowerCase() !== user.walletAddress.toLowerCase()) continue;

        const exists = await Transaction.findOne({ txHash: tx.hash });

        if (exists) continue; // 🔥 prevent duplicate

        const amount = Number(tx.value) / 1e18;

        // Save transaction
        await Transaction.create({
          userId: user._id,
          txHash: tx.hash,
          amount,
          type: "deposit"
        });

        // Credit user
        user.balance += amount;
        await user.save();

        console.log(`💰 Deposit: ${amount} USDT → ${user.email}`);
      }

    } catch (err) {
      console.error("Deposit error:", err.message);
    }
  }
};