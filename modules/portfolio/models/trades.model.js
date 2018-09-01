const mongoose = require('mongoose');

const { Schema } = mongoose;

const TradeSchema = new Schema({
  stockId: {
    type: Schema.ObjectId,
		ref: 'stocks'
  },
  type: {
    type: String
  },
  price: {
    type: Number
  },
  quantity: {
    type: Number
  },
  date: {
    type: Number
  }
});

mongoose.model('trades', TradeSchema);