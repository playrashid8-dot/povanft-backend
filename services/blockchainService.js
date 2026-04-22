const axios = require("axios");

const getUSDTTransactions = async (address) => {
  try {
    const url = `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${process.env.USDT_CONTRACT}&address=${address}&apikey=${process.env.BSCSCAN_API_KEY}`;

    const res = await axios.get(url);

    if (res.data.status !== "1") return [];

    return res.data.result;

  } catch (err) {
    console.log("BSC API Error:", err.message);
    return [];
  }
};

module.exports = {
  getUSDTTransactions
};