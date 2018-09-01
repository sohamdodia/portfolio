//Module dependencies

const mongoose = require('mongoose');

const { Schema } = mongoose;

const StockSchema = new Schema({
  title: {
    type: String
  }
});

mongoose.model('stocks', StockSchema);