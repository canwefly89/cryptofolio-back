const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Mixed } = Schema.Types;

const CoinSchema = new Schema({
  name: {
    type: String,
    trim: true,
    // required: true,
    unique: true,
  },
  date: {
    type: String,
    // required: true,
  },
  ticker: {
    type: String,
    // required: true,
  },
  imagePath: {
    type: String,
    // required: true,
  },
  categories: {
    type: [String],
    default: [],
    // required: true,
  },
  portfolios: {
    type: [String],
    default: [],
    // required: true,
  },
  circulatingSupply: {
    type: Mixed,
    // required: true,
  },
  totalSupply: {
    type: Mixed,
    // required: true,
  },
  maxSupply: {
    type: Mixed,
    // required: true,
  },
  dominance: {
    type: Mixed,
  },
  price: {
    date: {
      type: String,
      // required: true,
    },
    price: {
      type: Mixed,
      // required: true,
    },
  },
  marketCap: {
    date: {
      type: String,
      // required: true,
    },
    marketCap: {
      type: Mixed,
      // required: true,
    },
  },
  exchanges: {
    type: [String],
    default: [],
    // required: true,
  },
});

const Coin = mongoose.model("Coin", CoinSchema);

module.exports = Coin;
