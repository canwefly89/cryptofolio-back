const puppeteer = require("puppeteer");
const fs = require("fs");
const { fixCrawledData } = require("../utils/fixCrawledData");
const { coinNames } = require("./baseList/coinLIst");
const Coin = require("../models/coinModel");
const date = new Date().toISOString().slice(0, 16);

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--window-size=1920, 1080", "--disable-notifications"],
    });

    const result = {};
    const coins = [...coinNames];

    for (let i = 0; i < coins.length; i++) {
      const correctedName = coins[i].replace(/ /gi, "-").toLowerCase();
      const page = await browser.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36"
      );
      await page.setViewport({
        width: 1920,
        height: 1080,
      });

      await page.goto(`https://coinmarketcap.com/currencies/${correctedName}`);

      const crawledData = await page.evaluate(() => {
        const coinData = {
          marketCap: {},
          price: {},
        };

        coinData.ticker = document.querySelectorAll(
          ".nameSymbol___1arQV"
        )[0]?.textContent;

        coinData.imagePath = document.querySelectorAll(
          ".nameHeader___27HU_ img"
        )[0]?.src;

        coinData.circulatingSupply = document.querySelectorAll(
          ".statsValue___2iaoZ"
        )[4]?.textContent;

        coinData.totalSupply = document.querySelectorAll(
          ".maxSupplyValue___1nBaS"
        )[1]?.textContent;

        coinData.maxSupply = document.querySelectorAll(
          ".maxSupplyValue___1nBaS"
        )[0]?.textContent;

        coinData.marketCap.marketCap = document.querySelectorAll(
          ".statsValue___2iaoZ"
        )[0]?.textContent;

        coinData.dominance = document.querySelectorAll(
          ".statsValue___2iaoZ"
        )[3]?.textContent;

        coinData.price.price = document.querySelectorAll(
          ".priceValue___11gHJ"
        )[0]?.textContent;

        return coinData;
      });

      crawledData.date = date;
      crawledData.name = correctedName;
      crawledData.exchanges = [];
      crawledData.categories = [];

      const fixedCrawledData = fixCrawledData(crawledData);

      const updateDB = await Coin.findOneAndReplace(
        { name: crawledData.name },
        fixedCrawledData
      );

      if (!updateDB) {
        await Coin.create(fixedCrawledData);
      }

      result[crawledData.ticker] = fixedCrawledData;
      await page.waitForTimeout(Math.floor(Math.random() * 1500 + 1500));
      await page.close();
    }

    await browser.close();

    return result;
  } catch (e) {
    console.error(e);
  }
};

exports.coinCrawler = async () => {
  try {
    const crawledData = await crawler();
    const coinLog = [date];

    fs.writeFileSync(
      `${__dirname}/crawledData/coinData/coinData.json`,
      JSON.stringify(crawledData)
    );

    fs.writeFileSync(
      `${__dirname}/crawledData/coinData/coinLog.json`,
      JSON.stringify(coinLog)
    );
  } catch (e) {
    console.error(e);
  }
};
