const cron = require("node-cron");
const { checkDeposits } = require("../services/blockchainService");

cron.schedule("*/1 * * * *", async () => {
  console.log("🔍 Checking deposits...");
  await checkDeposits();
});