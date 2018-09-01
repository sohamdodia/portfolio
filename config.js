require('dotenv').config();

exports.const = {
  apiPort: process.env.API_PORT || 6005,
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017/portfolio',
  serverRoutes: 'modules/*/routes/*.js',
  dbModels: 'modules/*/models/*.js'
};