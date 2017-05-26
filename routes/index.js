var express = require('express');
var router = express.Router();

var nforce = require('nforce');
var app = require('../app');

const util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Return Request Demo' });
});

/* GET home page. */
router.get('/cdc', function(req, res, next) {
	res.render('cdc', { title: 'Change Data Events Demo' });
});

/* Creates a new the record */
router.post('/', function(req, res) {
	console.log('In router post');
	var newEvent = nforce.createSObject('acme_services__RMA_Request__e');
	newEvent.set('acme_services__AccountId__c', req.body.accountId);
	newEvent.set('acme_services__Asset_Type__c', req.body.assetType);
	newEvent.set('acme_services__Serial_Number__c', req.body.serialNumber);
	newEvent.set('acme_services__Issue_Date__c', req.body.issueDate);
	newEvent.set('acme_services__Issue_Description__c', req.body.issueDescription);  
	app.org.insert({ sobject: newEvent })
	res.sendStatus(200);
});

router.post('/newSub', function(req, res) {
	var cj = app.org.createStreamClient({ topic: app.config.TOPIC, replayId: app.config.REPLAY_ID });
	var str = cj.disconnect({ topic: app.config.TOPIC, oauth: app.oauth });
	str = cj.subscribe({ topic: app.config.TOPIC, oauth: app.oauth });
	//console.log(util.inspect(cj, false, null));

	str.on('connect', function(){
		console.log('Connected to topic: ' + app.config.TOPIC);
	});
	
	str.on('disconnect', function(){
		console.log('Disconnected from topic: ' + app.config.TOPIC);
	});

	str.on('error', function(error) {
		console.log('Error received from topic: ' + error);
	});

	str.on('data', function(data) {
		console.log('Received the following from topic ---');
		console.log(data);
		// emit the record to be displayed on the page
		app.socket.emit('event-processed', JSON.stringify(data));
	});
	res.sendStatus(200);
});

router.post('/newCDCSub', function(req, res) {
	var cj = app.org.createStreamClient({ topic: '/data/ChangeEvents', replayId: -2 });
	var str = cj.disconnect({ topic: app.config.TOPIC, oauth: app.oauth });
	str = cj.subscribe({ topic: '/data/ChangeEvents', oauth: app.oauth });
	//console.log(util.inspect(cj, false, null));

	str.on('connect', function(){
		console.log('Connected to topic: ' + '/data/ChangeEvents');
	});

	str.on('error', function(error) {
		console.log('Error received from topic: ' + error);
	});

	str.on('data', function(data) {
		console.log('Received the following from topic ---');
		console.log(data);
		// emit the record to be displayed on the page
		app.socket.emit('event-processed', JSON.stringify(data));
	});
	res.sendStatus(200);
});

module.exports = router;
