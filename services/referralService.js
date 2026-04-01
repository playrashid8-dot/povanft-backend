const User = require("../models/User");

const levels = [7, 5, 3, 2];

function getUnlockedLevels(activeStake) {
  if (activeStake >= 500) return 4;
  if (activeStake >= 300) return 3;
  if (activeStake >= 200) return 2;
  if (activeStake >= 100) return 1;
  return 0;
}

async function distributeReferral(user, amount) {
  let upline = await User.findOne({ referralCode: user.referredBy });

  for (let i = 0; i < levels.length; i++) {
    if (!upline) break;

    const unlocked = getUnlockedLevels(upline.activeStake);

    if (unlocked >= i + 1) {
      const reward = (amount * levels[i]) / 100;

      upline.balance += reward;
      await upline.save();

      console.log(`👥 Level ${i + 1} income: ${reward}`);
    }

    upline = await User.findOne({ referralCode: upline.referredBy });
  }
}

module.exports = { distributeReferral };