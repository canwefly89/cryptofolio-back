const puppeteer = require("puppeteer");
const fs = require("fs");
const priceLog = require(`${__dirname}/crawled/price/priceLog.json`);
const Coin = require("../models/coinModel");
const { getDate } = require("../utils/getDate");
const date = getDate();

exports.priceCrawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--window-size=1920, 1080", "--disable-notifications"],
    });

    let crawlResult = {
      price: {},
      date,
    };

    for (let i = 1; i < 11; i++) {
      const page = await browser.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36"
      );
      await page.setViewport({
        width: 1920,
        height: 1080,
      });
      await page.setDefaultNavigationTimeout(0);
      await page.goto(`https://coinmarketcap.com/?page=${i}`);

      await page.waitForTimeout(Math.floor(Math.random() * 500 + 1000));
      await page.evaluate(async () => {
        window.scrollBy(0, 1500);
      });
      await page.waitForTimeout(Math.floor(Math.random() * 500 + 1000));
      await page.evaluate(async () => {
        window.scrollBy(0, 1500);
      });
      await page.waitForTimeout(Math.floor(Math.random() * 500 + 1000));
      await page.evaluate(async () => {
        window.scrollBy(0, 1500);
      });
      await page.waitForTimeout(Math.floor(Math.random() * 500 + 1000));
      await page.evaluate(async () => {
        window.scrollBy(0, 1500);
      });
      await page.waitForTimeout(Math.floor(Math.random() * 500 + 1000));
      await page.evaluate(async () => {
        window.scrollBy(0, 1500);
      });
      await page.waitForTimeout(Math.floor(Math.random() * 500 + 1000));
      await page.evaluate(async () => {
        window.scrollBy(0, 1500);
      });
      await page.waitForTimeout(Math.floor(Math.random() * 1000 + 2000));

      const crawledData = await page.evaluate(() => {
        const coinData = { price: {}, marketCap: {} };
        const NANRegex = /[^0-9.]/g;

        const ticker = Array.from(
          document.querySelectorAll("td .coin-item-symbol")
        ).map((v) => v.textContent);

        const price = Array.from(
          document.querySelectorAll("td .price___3rj7O")
        ).map((v) => parseFloat(v.textContent?.replace(NANRegex, "")));

        const marketCap = Array.from(
          document.querySelectorAll("td .kDEzev")
        ).map((v) => parseInt(v.textContent?.replace(NANRegex, ""), 10));

        ticker.forEach((value, index) => {
          coinData.price[value] = price[index];
          coinData.marketCap[value] = marketCap[index];
        });

        return coinData;
      });

      crawlResult = {
        price: { ...crawlResult.price, ...crawledData.price },
        marketCap: { ...crawlResult.marketCap, ...crawledData.marketCap },
      };

      await page.waitForTimeout(Math.floor(Math.random() * 2000 + 1000));
      await page.close();
    }

    crawlResult.date = date;

    const updatedPrice = { ...crawlResult };
    const updatePriceLog = [...priceLog, date];

    if (updatePriceLog.length > 20) {
      delete updatedPrice[updatePriceLog[0]];
      updatePriceLog.shift();
    }

    const priceList = Object.entries(updatedPrice.price);
    const marketCapList = Object.entries(updatedPrice.marketCap);

    for (let i = 0; i < priceList.length; i++) {
      await Coin.findOneAndUpdate(
        { ticker: priceList[i][0] },
        { price: { date, price: priceList[i][1] } }
      );

      await Coin.findOneAndUpdate(
        { ticker: marketCapList[i][0] },
        { marketCap: { date, marketCap: marketCapList[i][1] } }
      );
    }

    fs.writeFileSync(
      `${__dirname}/crawled/price/priceData.json`,
      JSON.stringify(updatedPrice)
    );

    fs.writeFileSync(
      `${__dirname}/crawled/price/priceLog.json`,
      JSON.stringify(updatePriceLog)
    );

    await browser.close();
  } catch (err) {
    console.error(err);
  }
};
