const express = require("express");
const router = express.Router();
const cryptofolioController = require("./controllers/cryptofolioController");

router.route("/").post(cryptofolioController.mockfunc);
router.route("/new").post(cryptofolioController.createCryptoFolioDB);

module.exports = router;
