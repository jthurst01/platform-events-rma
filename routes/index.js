var express = require('express');
var router = express.Router();

var Promise = require("bluebird");

var nforce = require('nforce');
var org = require('../app');

const util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Salesforce Platform Events <-> Heroku Demo' });
});

/* Creates a new the record */
router.post('/', function(req, res, next) {
	console.log('In router post');
	var newEvent = nforce.createSObject('Customer_Order__e');
	newEvent.set('CustomerId__c', req.body.customerId);
	newEvent.set('Product_Name__c', req.body.productName);
	newEvent.set('Number_of_Units__c', req.body.numberOfUnits);
	newEvent.set('Total_Amount__c', req.body.totalAmount);  
console.log('newEvent: ' + req.body);

	// var newEvent = nforce.createSObject('Order_Response__e');
// 	newEvent.set();  newEvent.set('Account_Executive__c', 'Test');
// 	newEvent.set('Contact_by_Date__c', '2016-01-01');
// 	newEvent.set('Email_Address__c', 'test@test.com');
// 	newEvent.set('Phone_Number__c', '555-5555');
  

	org.org.insert({ sobject: newEvent });
  
});

module.exports = router;
