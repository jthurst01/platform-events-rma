var express = require('express');
var router = express.Router();

var Promise = require("bluebird");

var nforce = require('nforce');
var org = require('../app');

const util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Return Request Demo' });
});

/* Creates a new the record */
router.post('/', function(req, res, next) {
	console.log('In router post');
	var newEvent = nforce.createSObject('RMA_Request__e');
	newEvent.set('AccountId__c', req.body.accountId);
	newEvent.set('Item__c', req.body.item);
	newEvent.set('Serial_Number__c', req.body.serialNumber);
	newEvent.set('Issue_Date__c', req.body.issueDate);
	newEvent.set('Issue_Description__c', req.body.issueDescription);  
	org.org.insert({ sobject: newEvent })
});

module.exports = router;
