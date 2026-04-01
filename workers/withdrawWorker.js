const cron = require("node-cron");
const Transaction = require("../models/Transaction");

cron.schedule("*/5 * * * *", async () => {
  const txs = await Transaction.find({ status: "pending" });

  for (let tx of txs) {
    // TODO: send from Vault

    tx.status = "completed";
    await tx.save();

    console.log("💸 Withdraw processed");
  }
});