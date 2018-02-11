'use strict';

const HttpStatus = require('http-status-codes');
const dbRiders = require('../../config/dbStore').dbRiders;
/**
 * Get riders list
 *
 */
async function getRiders(req, res) {

   dbRiders.find({}).exec(function(err, riders) {
       return res.status(HttpStatus.OK).send(riders);
   });
  return res.status(HttpStatus.OK).send(riders);
}

module.exports = {
    getRiders
};
