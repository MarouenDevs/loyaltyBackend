const amqp = require('amqplib/callback_api');
const config = require('../config');
const Process = require('./Process').Process;
const rideProcess = new Process();

/**
 *Class Consumer
 * Consume riders events queue
 */
class Consumer {

    constructor() {

    }


    launch(socket) {
        this.processConsume(socket);

    }

    processConsume(socket) {


        amqp.connect(config.amqp.url, (err, conn) => {
            this.consume(conn, socket, this.processData);
        });

    }

    consume(conn, socket, cb) {

        conn.createChannel(function (err, ch) {
            var q = 'riders';
            ch.assertQueue(q, {durable: false});
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

            ch.consume(q, function (data) {
                const event = JSON.parse(data.content.toString());
                //socket.emit('message',data.content.toString());
                let response = cb(socket, event);
            }, {noAck: true});
        });
    }


    /**
     * Process data , emit event
     * @param data
     */
    processData(socket, data) {

        rideProcess.listen(socket, data);


    }

}

module.exports = {
    Consumer
};