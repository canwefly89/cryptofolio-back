const metadata = require("../../crawler/crawled/metadata/metadata.json");
// const coinData = require("../../crawler/crawled/coin/coinData.json");
const Coin = require("../../models/coinModel");

exports.getHomeDB = async (req, res, next) => {
  try {
    const coinDB = await Coin.find().lean();
    const coinData = {};
    coinDB.forEach((coin) => (coinData[coin.ticker] = coin));

    const data = {
      metadata,
      coinData,
    };

    return res.status(200).json({
      message: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.mockfunc = async (req, res, next) => {
  try {
    return res.status(200).json();
  } catch (err) {
    next(err);
  }
};
