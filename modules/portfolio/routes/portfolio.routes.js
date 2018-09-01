const portfolioController = require('../controllers/portfolio.controller');

module.exports = (app) => {
  app.route('/portfolio').get(portfolioController.portfolio);
  app.route('/portfolio/holdings').get(portfolioController.holdings);
  app.route('/portfolio/returns').get(portfolioController.returns);
  app.route('/portfolio/stock').post(portfolioController.createStock);
  app.route('/portfolio/stock').get(portfolioController.fetchStocks);
  app.route('/portfolio/trade').post(portfolioController.createTrade);
  app.route('/portfolio/trade/:id').put(portfolioController.updateTrade);
  app.route('/portfolio/trade/:id').delete(portfolioController.deleteTrade);
};