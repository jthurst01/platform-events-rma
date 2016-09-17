'use strict'
 
var nforce = require('nforce');
var config = require('../config.js');
var app = require('../app.js')(app);

var server = require('http').Server(app);
var io = require('socket.io')(server);
// get a reference to the socket once a client connects
var socket = io.sockets.on('connection', function (socket) { });

var org = nforce.createConnection({
  clientId: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  redirectUri: config.CALLBACK_URL + '/oauth/_callback',
  mode: 'single',
  environment: config.ENVIRONMENT  // optional, sandbox or production, production default
});

org.authenticate({ username: config.USERNAME, password: config.PASSWORD }, function(err, oauth) {

  if(err) return console.log(err);
  if(!err) {
    console.log('*** Successfully connected to Salesforce ***');
    // add any logic to perform after login
  }

  var cj = org.createStreamClient();
  var str = cj.subscribe({ topic: config.TOPIC, isPlatformEvent: true, oauth: oauth });

  str.on('connect', function(){
    console.log('Connected to topic: ' + config.TOPIC);
  });

  str.on('error', function(error) {
    console.log('Error received from topic: ' + error);
  });

  str.on('data', function(data) {
    console.log('Received the following from topic ---');
    console.log(data);
    // emit the record to be displayed on the page
    socket.emit('event-processed', JSON.stringify(data));
  });

});

module.exports = org;
