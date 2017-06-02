platform-events-rma
=======================

Node demo that streams Platform Events from Salesforce.com to the browser using socket.io. 

### Setup Remote Access in Salesforce.com

Setup a new Remote Access to get your OAuth tokens. If you are unfamiliar with settng this up, see 4:45 of Jeff Douglas' [Salesforce.com Primer for New Developers](http://www.youtube.com/watch?v=fq2ju2ML9GM). For your callback, simply use: http://localhost:3001/oauth/_callback

### Install Package for Platform Event Demo

You can install a package for the RMA events at https://login.salesforce.com/packaging/installPackage.apexp?p0=04tB0000000HbtU.  Note that the package will add two new Platform Event definitions along with the asociated triggers.  After your config.js is set up, this should then allow the app to work.

### Running the Application Locally

```
git clone https://github.com/jthurst01/platform-events-rma.git
cd platform-event-rma
npm install
```

This will clone this repo locally so you simply have to make your config changes and be up and running. Now replace your OAuth tokens and credentials in the config.js file then run the following to start the server:

```
node bin/www
```

Open your browser to  [http://localhost:3001](http://localhost:3001) and create an RMA Event in Salesforce from the left hand form, and see a Return Status event subscribed on the right hand pane.
