// Module dependencies

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');
const helper = require('./helper');

// MongoDB Initialization

const models = helper.getGlobbedPaths(config.const.dbModels);
models.forEach((modelPath) => {
  require(path.resolve(modelPath));
});

mongoose.connect(config.const.dbUri, ((err) => {
  if (err) {
    console.log('Could not connect to MongoDB', err);
  } else {
    mongoose.set('debug', false);
  }
}));

// ExpressJS Initialization
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(cors());
app.options('*', cors());
app.use(express.static('public'));

const routes = helper.getGlobbedPaths(config.const.serverRoutes);
routes.forEach((routePath) => {
  require(path.resolve(routePath))(app);
});

// NodeJS Server Initialization
app.listen(config.const.apiPort, () => {
  console.log(`App is running on port ${config.const.apiPort}`);
});
