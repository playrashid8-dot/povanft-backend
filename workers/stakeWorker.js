const cron = require("node-cron");
const Stake = require("../models/Stake");
const User = require("../models/User");

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const stakes = await Stake.find({ status: "active" });

    for (let stake of stakes) {
      if (now >= stake.endTime) {
        const user = await User.findById(stake.userId);

        user.balance += stake.totalReturn;
        user.activeStake -= stake.amount;

        stake.status = "completed";

        await user.save();
        await stake.save();

        console.log(`✅ Stake completed for user ${user._id}`);
      }
    }
  } catch (err) {
    console.log("Worker Error:", err.message);
  }
});