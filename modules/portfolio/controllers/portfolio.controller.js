const mongoose = require('mongoose');
const Joi = require('joi');

const helper = require('../../../helper');
const message = require('../../../message');
const schema = require('../../../schema');

const Stock = mongoose.model('stocks');
const Trade = mongoose.model('trades');


const holdingsQuery = [
  {
    $group: {
      _id: '$stockId',
      buyPrice: {
        $sum: {
          $cond: {
            if: {
              '$eq': ['$type', 'buy']
            },
            then: {
              $multiply: ['$price', '$quantity']
            },
            else: 0
          }
        }
      },
      sellPrice: {
        $sum: {
          $cond: {
            if: {
              '$eq': ['$type', 'sell']
            },
            then: {
              $multiply: ['$price', '$quantity']
            },
            else: 0
          }
        }
      },
      buyQuantity: {
        $sum: {
          $cond: {
            if: {
              '$eq': ['$type', 'buy']
            },
            then: '$quantity',
            else: 0
          }
        }
      },
      sellQuantity: {
        $sum: {
          $cond: {
            if: {
              '$eq': ['$type', 'sell']
            },
            then: '$quantity',
            else: 0
          }
        }
      },
    }
  },
  {
    $lookup: {
      from: 'stocks',
      localField: '_id',
      foreignField: '_id',
      as: 'stock'
    }
  },
  {
    $project: {
      '_id': 1,
      stock: {
        $arrayElemAt: ['$stock', 0]
      },
      price: {
        $divide: ['$buyPrice', '$buyQuantity']
      },
      quantity: {
        $subtract: ['$buyQuantity', '$sellQuantity']
      }
    }
  }
];

/**
 * POST /portfolio/stock
 */
exports.createStock = async (req, res) => {
  try {
    const validationResult = Joi.validate(req.body, schema.createStockSchema, { abortEarly: false });

    if (validationResult.error) {
      return res.status(400).send(helper.getCustomErrorMessage(
        validationResult.error, validationResult.error.details[0].message,
      ));
    }
  
    const stock = new Stock(req.body);

    const createdStock = await stock.save();

    return res.status(200).send(helper.getCustomSuccessMessage(createdStock));
  } catch (error) {
    return res.status(500).send(helper.getCustomErrorMessage());
  }
};

/**
 * GET /portfolio/stock
 */

exports.fetchStocks = async (req, res) => {
  try {
    const retrievedStocks = await Stock.find({});

    return res.status(200).send(helper.getCustomSuccessMessage(retrievedStocks));
  } catch (error) {
    return res.status(500).send(helper.getCustomErrorMessage());
  }
};

/**
 * POST /portfolio/trade
 */

exports.createTrade = async (req, res) => {
  try {
    const validationResult = Joi.validate(req.body, schema.createTradeSchema, { abortEarly: false });

    if (validationResult.error) {
      return res.status(400).send(helper.getCustomErrorMessage(
        validationResult.error, validationResult.error.details[0].message,
      ));
    }
    
    const retrievedStock = await Stock.findById(req.body.stockId);

    if (!retrievedStock) {
      return res.status(500).send(helper.getCustomErrorMessage(message.stockNotFound));
    }

    const trade = new Trade(req.body);
    const createdTrade = await trade.save();

    return res.status(200).send(helper.getCustomSuccessMessage(createdTrade));
  } catch (error) {
    console.log({error});
    return res.status(500).send(helper.getCustomErrorMessage());
  }
};

/**
 * PUT /portfolio/stock
 */

exports.updateTrade = async (req, res) => {
  try {
    const obj = Object.assign({}, req.params, req.body);
    const validationResult = Joi.validate(obj, schema.updateTradeSchema, { abortEarly: false });

    if (validationResult.error) {
      return res.status(400).send(helper.getCustomErrorMessage(
        validationResult.error, validationResult.error.details[0].message,
      ));
    }

    const retrievedTrade = await Trade.findById(req.params.id);

    if (!retrievedTrade) {
      return res.status(500).send(helper.getCustomErrorMessage(message.tradeNotFound));
    }
    
    if(req.body.stockId) {
      const retrievedStock = await Stock.findById(req.body.stockId);

      if (!retrievedStock) {
        return res.status(500).send(helper.getCustomErrorMessage(message.stockNotFound));
      }
    }

    const updatedTrade = await Trade.findByIdAndUpdate(req.params.id, req.body, { new: true });

    return res.status(200).send(helper.getCustomSuccessMessage(updatedTrade));
  } catch (error) {
    return res.status(500).send(helper.getCustomErrorMessage());
  }
};

/**
 * delete /portfolio/stock
 */

exports.deleteTrade = async (req, res) => {
  try {
    const validationResult = Joi.validate(req.params, schema.deleteTradeSchema, { abortEarly: false });

    if (validationResult.error) {
      return res.status(400).send(helper.getCustomErrorMessage(
        validationResult.error, validationResult.error.details[0].message,
      ));
    }

    const retrievedTrade = await Trade.findById(req.params.id);

    if (!retrievedTrade) {
      return res.status(500).send(helper.getCustomErrorMessage(message.tradeNotFound));
    }

    await Trade.findByIdAndRemove(req.params.id);

    return res.status(200).send(helper.getCustomSuccessMessage());
  } catch (error) {
    return res.status(500).send(helper.getCustomErrorMessage());
  }
}

/**
 * GET /portfolio
 */

exports.portfolio = async (req, res) => {
  try {
    const retrievedTrades = await Trade.aggregate([
      {
        $group: { 
          _id: '$stockId'
        }
      },
      {
        $lookup: {
          from: 'trades',
          localField: '_id',
          foreignField: 'stockId',
          as: 'trade'
        }
      },
      {
        $lookup: {
          from: "stocks",
          localField: "_id",
          foreignField: "_id",
          as: "stock"
        }
      },
      {
        $project: {
          stock: {
            $arrayElemAt: ["$stock", 0]
          },
          trade: 1
        }    
      },
      {
        $project: {
          stock: '$stock.title',
          trade: 1
        }
      }
    ]);

    return res.status(200).send(helper.getCustomSuccessMessage(retrievedTrades));
  } catch (error) {
    return res.status(500).send(helper.getCustomErrorMessage());
  }
}

/**
 * GET /portfolio/holdings
 */

exports.holdings = async (req, res) => {
  try {
    const query = [
      ...holdingsQuery,
      {
        $project: {
          _id: 1,
          stock: '$stock.title',
          price: 1,
          quantity: 1
        }
      }
    ];
    
    const holdings = await Trade.aggregate(query);

    return res.status(200).send(helper.getCustomSuccessMessage(holdings));
  } catch (error) {
    return res.status(500).send(helper.getCustomErrorMessage());
  }
}


/**
 * GET /portfolio/returns
 */

exports.returns = async (req, res) => {
  try {
    const query = [...holdingsQuery];

    query.push({
      $project: {
        _id: 1,
        stock: '$stock.title',
        price: 1,
        quantity: 1,
        priceDiff: {
          $subtract: [100, "$price"]
        }
      }
    }, {
      $project: {
        stock: 1,
        ProfitAndLoss: {
          $sum: {
            $multiply: ["$priceDiff", "$quantity"]
          }
        }
      }
    });

    const returns = await Trade.aggregate(query);

    return res.status(200).send(helper.getCustomSuccessMessage(returns));
  } catch (error) {
    return res.status(500).send(helper.getCustomErrorMessage());
  }
}
