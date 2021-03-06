'use strict';

const express = require('express');
const wrap = require('co-express');

const controller = require('./riders.controller');

const router = express.Router();

/**
 * @api {get} /riders get all riders
 * @apiGroup Riders
 *
 * @apiDescription get riders data
 *
 *
 *
 * @apiSuccess {String} welcome message
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    message: 'Welcome Robert (id: 32)!'
 *  }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL_SERVER_ERROR
 *     {
 *       message: 'Invalid request'
 *     }
 *
 */
router.get('', wrap(controller.getRiders));
router.get('/topTen',wrap(controller.getTopTen))
router.get('/stats/:state',wrap(controller.getStats))
module.exports = router;
