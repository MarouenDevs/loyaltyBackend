/**
 * DataStore to persist data
 * @type {*|Datastore}
 */
const Datastore = require('nedb');
const dbRiders = new Datastore();

module.exports = {
    dbRiders
}