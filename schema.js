const Joi = require('joi');

exports.createStockSchema = Joi.object({
  title: Joi
          .string()
          .required()
          .options({
            language: {
              any: { 
                empty: 'is required'
              }
            } 
          }).
          label('Title')
});

exports.createTradeSchema = Joi.object({
  stockId: Joi
            .string()
            .required()
            .options({ 
              language: { 
                any: { 
                  empty: 'is required' 
                } 
              } 
            })
            .label('Stock Id'),
  type: Joi
          .string()
          .required()
          .options({ 
            language: { 
              any: { 
                empty: 'is required' 
              } 
            } 
          })
          .label('Type'),
  price: Joi
          .number()
          .required()
          .options({ 
            language: { 
              any: { 
                empty: 'is required' 
              } 
            } 
          })
          .label('Price'),
  quantity: Joi
              .number()
              .integer()
              .required()
              .options({ 
                language: {
                   any: {
                      empty: 'is required' 
                    } 
                  } 
                })
                .label('Quantity'),
  date: Joi
          .number()
          .integer()
          .required()
          .options({ 
            language: { 
              any: { 
                empty: ' is required' 
              } 
            } 
          })
          .label('Date')
});

exports.updateTradeSchema = Joi.object({
  id: Joi
        .string()
        .required()
        .options({ 
          language: { 
            any: { 
              empty: 'is required' 
            } 
          } 
        })
        .label('Id'),
  stockId: Joi
            .string()
            .label('Stock Id'),
  type: Joi
          .string()
          .label('Type'),
  price: Joi
          .number()
          .label('Price'),
  quantity: Joi
            .number()
            .integer()
            .label('Quantity'),
  date: Joi
          .number()
          .integer().label('Date')
});

exports.deleteTradeSchema = Joi.object({
  id: Joi
        .string()
        .required()
        .options({ 
          language: { 
            any: { 
              empty: 'is required' 
            } 
          } 
        })
        .label('Id')
});
