const fs = require("fs");
const categories = require("./crawler/crawled/category/category.json");
const coinData = require("./crawler/crawled/coin/coinData.json");
const { coinCategories } = require("./crawler/baseList/categoryList");
const Coin = require("./models/coinModel");

exports.foo = async () => {
  const coinDB = await Coin.find().lean();
  const tickerList = coinDB.map((coin) => coin.ticker);
  const dataList = Object.entries(coinData);

  for (let i = 0; i < dataList.length; i++) {
    const ticker = dataList[i][0];
    const data = dataList[i][1];

    if (tickerList.includes(ticker)) {
      await Coin.findOneAndReplace({ ticker }, data);
    } else {
      await Coin.create(data);
    }
  }
};
