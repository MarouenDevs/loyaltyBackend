const Consumer = require("./lib/Consumer").Consumer;
const http = require('http');
const co = require('co');
const express = require('express');
const io = require('socket.io');

const {configure} = require('./config/express');

let app;
let server;

/**
 * Start the web app.
 *
 * @returns {Promise} when app end to start
 */
async function start() {
    if (app) {
        return app;
    }
    app = configure(express());

    const port = app.get('port');
    server = http.createServer(app);
    // init socket
    const socket = io.listen(server);
    // init consumer


    await server.listen(port);

    socket.sockets.on('connection', function (socket) {
        const consumer = new Consumer();
        consumer.launch(socket);

    });
// eslint-disable-next-line no-console

    console.log(`✔ Server running on port ${port}`);
    return app;
}

/**
 * Stop the web app.
 *
 * @returns {Promise} when app end to start
 */
async function stop() {
    if (server) {
        await server.close();
        server = null;
        app = null;
    }
    return Promise.resolve();
}

if (!module.parent) {
    co(start);
}

module.exports = {
    start,
    stop,
    get server() {
        return server;
    },
    get app() {
        return app;
    }
};
