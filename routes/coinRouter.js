const express = require("express");
const router = express.Router();
const coinController = require("./controllers/coinController");

router.route("/").get(coinController.getHomeDB);
router.route("/:coinName").get(coinController.mockfunc);

module.exports = router;
