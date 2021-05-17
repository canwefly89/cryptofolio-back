const express = require("express");
const router = express.Router();
const {
  getHomeDB,
  updateMetaDataDB,
  updatePriceDB,
} = require("./controllers/coinController");

router.route("/").get(getHomeDB);
router.route("/metadata").get(updateMetaDataDB);
router.route("/price").get(updatePriceDB);

module.exports = router;
