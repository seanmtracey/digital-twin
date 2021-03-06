const debug = require('debug')('bin:lib:mqtt-proxy');
const mqtt = require('mqtt');
const ws = require('ws');

let WebSocketServer;

function bindEventsForClient(socket){

	let mqttClient;

	socket.on('message', function(payload){
		
		debug('Received message from Digital Twin client:', payload.toString('utf8'));

		payload = JSON.parse(payload);

		if(payload.type === "connect"){
			
			if(payload.data){
				
				if(!payload.data.connectionDetails){
					debug(`MQTT connection details were not passed.`, payload.data);
				} else {
					
					const storedBrokerAddress = payload.data.connectionDetails.broker;
					const storedBrokerPort = payload.data.connectionDetails.port;

					const brokerAddress = storedBrokerAddress.startsWith('mqtt://') ? storedBrokerAddress : `mqtt://${storedBrokerAddress}`;
					const brokerPort = storedBrokerPort === "" ? '1883' : storedBrokerPort;

					mqttClient = mqtt.connect(brokerAddress, {
						port : Number(brokerPort) || 1883,
						connectTimeout : 5 * 1000,
						username : payload.data.connectionDetails.username,
						password : payload.data.connectionDetails.password,
						clientId : payload.data.connectionDetails.clientId,
						rejectUnauthorized: false,
						reconnectPeriod : 0
					});
					
					mqttClient.on('connect', function () {
						debug(`Succesfully connected to broker: ${mqttClient.options.href}`)
						socket.send( JSON.stringify({
							status : 'ok',
							type : 'connectionStatus',
							data : 'connected'
						}) );
					});
					
					function handleDisconnect(err){
						debug('MQTT Broker Disconnected:', err);
						
						if(socket.readyState === 1){

							socket.send( JSON.stringify({
								status : 'err',
								type : 'connectionStatus',
								data : err
							}));

						}

					}

					mqttClient.on('close', handleDisconnect);
					mqttClient.on('offline', handleDisconnect);
					mqttClient.on('error', handleDisconnect);

				}

			}

		}

		if(payload.type === "subscribe"){

			if(!mqttClient){
				
				const errorMessage = `Connection to MQTT broker has not been created. Can not subscribe to topic`;
				const response = {
					status : 'err',
					data : errorMessage
				};
				socket.send(response);

			} else {

				mqttClient.subscribe(payload.data.topic, function (err) {

					if (err) {
						console.log('MQTT Subscription Error:', err);
					} else {
						console.log('Successful subscription to topic:', payload.data.topic);

						mqttClient.on('message', function (topic, data) {

							// debug(`Data from broker on topic ${topic}:`, data.toString('utf8'));
							
							socket.send(JSON.stringify({
								status : 'ok',
								type : 'data',
								data : {
									topic,
									data : data.toString('utf8')
								}
							}));

						});

					}

				});

			}

		}

	});

	socket.on('close', function close() {
		
		debug(`Digital Twin disconnected from server. Disconnecting from MQTT broker ${ mqttClient.options.href }`);
		mqttClient.end(true, function(){
			console.log(`Succesfully disconnected from broker ${ mqttClient.options.href }`);
		});

	});

}

module.exports.initialise = function(httpServer){

	// Bind the websocket serve so that it lives happily alongside our
	// HTTP server. NO FIGHTING YOU TWO!
	WebSocketServer = new ws.Server( { server : httpServer } );

	WebSocketServer.on('listening', function(){
		debug('WebSocket server is listening');
	});

	WebSocketServer.on('connection', function connection(ws) {
		debug('Client connected to WebSocket Server');
		bindEventsForClient(ws);
	});

	WebSocketServer.on('error', function(err){
		debug('WebSocket server error:', err);
		throw err;
	});

};