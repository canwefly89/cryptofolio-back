const Cryptofolio = require("../../models/cryptofolioModel");
const User = require("../../models/userModel");

exports.mockfunc = async (req, res, next) => {
  try {
    return res.status(200).json();
  } catch (err) {
    next(err);
  }
};

exports.createCryptoFolioDB = async (req, res, next) => {
  try {
    const savedCryptofolio = await Cryptofolio.create(req.body);
    const updatedUser = await User.findByIdAndUpdate(req.body.createdBy, {
      $addToSet: { cryptofolios: savedCryptofolio._id },
    });

    if (!savedCryptofolio || !updatedUser) {
      return res.status(400).json({
        message: "fail",
      });
    }

    return res.status(200).json({
      message: "success",
      data: savedCryptofolio,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
