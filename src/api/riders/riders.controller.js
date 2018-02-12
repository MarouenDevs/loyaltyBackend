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

}
async function getTopTen(req, res) {

    dbRiders.find({}).sort({ points: 1 }).limit(10).exec(function(err, riders) {
        return res.status(HttpStatus.OK).send(riders);
    });

}

async function getStats(req, res){
    let statePram = req.params['state'];

    dbRiders.find({state:statePram}).sort({ points: 1 }).exec(function(err, riders) {
        return res.status(HttpStatus.OK).send({'state':statePram,'nbRiders':riders.length,'maxPoints':(riders.length!=0 ? riders[0].points: 0)});
    });
}

module.exports = {
    getRiders,
    getTopTen,
    getStats
};
