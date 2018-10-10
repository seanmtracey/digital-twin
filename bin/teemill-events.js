const debug = require('debug')('bin:teemill-events');
const mqtt = require('mqtt');
const ws = require('ws');

let WebSocketServer;
const mqttClient = mqtt.connect(process.env.MQTT_BROKER);

mqttClient.on('connect', function () {
    mqttClient.subscribe(process.env.MQTT_TOPIC, function (err) {
        if (!err) {
            debug('Connected to Teemill broker');
        } else {
            debug(`Error subscribing to MQTT topic "${process.env.MQTT_TOPIC}"`);
            throw err;
        }
    });
})

mqttClient.on('message', function (topic, message) {
    
    debug('Received MQTT message:', topic, message.toString());

    if(WebSocketServer){
        // If we have a WebSocket server set up, forward everything we get from 
        // the MQTT broker to all connected clients.
        WebSocketServer.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send( JSON.stringify( {
                    topic,
                    data : message.toString()
                } ) );
            }
        });

    }

});

module.exports.initialise = function(httpServer){

    // Bind the websocket serve so that it lives happily alongside our
    // HTTP server. NO FIGHTING YOU TOO!
    WebSocketServer = new ws.Server( { server : httpServer } );

    WebSocketServer.on('listening', function(){
        debug('WebSocket server is listening');
        throw err;
    });

    WebSocketServer.on('connection', function connection(ws) {
        debug('Client connected to WebSocket Server');
    });

    WebSocketServer.on('error', function(err){
        debug('WebSocket server error:', err);
        throw err;
    });

};