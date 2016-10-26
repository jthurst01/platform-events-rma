var express = require('express');
var router = express.Router();

var Promise = require("bluebird");

var nforce = require('nforce');
var app = require('../app');

const util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Return Request Demo' });
});

/* Creates a new the record */
router.post('/', function(req, res) {
	console.log('In router post');
	var newEvent = nforce.createSObject('RMA_Request__e');
	newEvent.set('AccountId__c', req.body.accountId);
	newEvent.set('Asset_Type__c', req.body.assetType);
	newEvent.set('Serial_Number__c', req.body.serialNumber);
	newEvent.set('Issue_Date__c', req.body.issueDate);
	newEvent.set('Issue_Description__c', req.body.issueDescription);  
	app.org.insert({ sobject: newEvent })
	res.sendStatus(200);
});

router.post('/newSub', function(req, res) {
	var cj = app.org.createStreamClient({ topic: app.config.TOPIC, replayId: app.config.REPLAY_ID });
	var str = cj.subscribe({ topic: app.config.TOPIC, oauth: app.oauth });
	//console.log(util.inspect(cj, false, null));

	str.on('connect', function(){
	console.log('Connected to topic: ' + app.config.TOPIC);
	});

	str.on('error', function(error) {
	console.log('Error received from topic: ' + error);
	});

	str.on('data', function(data) {
	//console.log('Received the following from topic ---');
	//console.log(data);
	// emit the record to be displayed on the page
	app.socket.emit('event-processed', JSON.stringify(data));
	});
});

module.exports = router;
