platform-events-rma
=======================

Node demo that streams Platform Events from Salesforce.com to the browser using socket.io. 

### Setup Remote Access in Salesforce.com

Setup a new Remote Access to get your OAuth tokens. If you are unfamiliar with settng this up, see 4:45 of Jeff Douglas' [Salesforce.com Primer for New Developers](http://www.youtube.com/watch?v=fq2ju2ML9GM). For your callback, simply use: http://localhost:3001/oauth/_callback

### Create a Platform Event Definition in Salesforce.com

Create a new Platform Event from the Setup Menu of your Salesforce Instance. 

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

Open your browser to  [http://localhost:3001](http://localhost:3001) and creat a Platform Event Salesforce and see it appear on the page.
