'use strict';

const { Router } = require('express');

const riderRouter = require('./riders');

module.exports = function addRouter(app) {
  const router = Router();
  router.use('/riders', riderRouter);
  app.use('/api', router);
};
