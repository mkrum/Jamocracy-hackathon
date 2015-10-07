// Include the Twilio Cloud Module and initialize it
var twilio = require("twilio");
twilio.initialize("ACe51cb73194af06d1048ce2b11ffb8cb1","437e0f5d041b542c58f09b814b7e5639");

// Create the Cloud Function
Parse.Cloud.define("sendText", function(request, response) {
  // Use the Twilio Cloud Module to send an SMS
  // Send an SMS message
  twilio.sendSMS({
      to:'9788703785',
      from: '9787986085',
      body: 'Hello world!'
    },
    {
      success: function(httpResponse) { response.success("SMS sent!"); },
      error: function(httpResponse) { response.error("Uh oh, something went wrong"); }
  });
});

var express = require('express');
var app = express();

// Global app configuration section
app.use(express.bodyParser());  // Populate req.body

app.post('/receiveSMS',
         function(req, res) {

  console.log("Received a new text: " + req.body.Body);
  save(req.body.Body,{
    success: function() {
      response.success();
    },
    error: function(error) {
      response.error(error);
    }
  });
  res.send('Success');
});

app.listen();

function save(message, options){
  console.log("in save");
  var Text = Parse.Object.extend("Text");
  var text = new Text();
  text.set("body", message);
  text.set("added", false);
  text.save(null, {
            success:function () {
                console.log("Successfully saved message");
                options.success();
            },
            error:function (error) {
                console.log("Could not save song: " + error.message);
                options.error(error.message);
            }
        }
    );
}
