'use strict';

const https = require('https');
var webhook_path = process.env.SLACK_WEBHOOK_PATH;
var slack_channel = process.env.SLACK_CHANNEL;
var slack_user = process.env.SLACK_USERNAME;
var bell_path = process.env.BELL_PATH;
var last_bell = ""

function getBellImage() {
    var bells = [
        "bradybunch.gif",
        "busey.gif",
        "cartoon.gif",
        "cowbell.gif",
        "ednorton.gif",
        "mouse.gif",
        "olympics.gif",
        "seth.gif",
        "timeclock.gif",
        "triangle.gif",
        "christmas.gif",
        "weinerdog.gif",
        "hat.gif",
        "mackey.gif",
        "morticia.gif",
        "boxing.gif"
    ]
    var this_bell = "";
    //with only a handful of bells, we were getting a lot of back-to-back repeats; this is a kluge to prevent those
    while (!this_bell.length || this_bell == last_bell) {
        this_bell = bells[Math.floor(Math.random() * bells.length)]
    }
    last_bell = this_bell;
    // slack won't auto-expand an image if the same image is posted back-to-back; adding the guid forces the auto-expand
    return bell_path + this_bell + "?" + guid();
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4();
}

// could be moved into a datastore, but we have few enough salespeople that it's not worth paying for right now...
function getinitiator(button_id){
    switch(button_id) {
        case 'G030XXXXXXXXXXXX':
            return "Zach"
            break;
        case 'G030XXXXXXXXXXXX':
            return "Joe"
            break;
        case 'G030XXXXXXXXXXXX':
            // "shared" button for the office
            return "HQ"
        default:
            return "Someone"
    }    
}

exports.handler = (event, context, callback) => {
    //console.log(event);
    var options = {
      hostname: 'hooks.slack.com',
      port: 443,
      path: webhook_path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    var button_id = event.serialNumber || 0;
    var slack_message = getinitiator(button_id) + " rang the sales bell! " + getBellImage();
    var postData = {
      "text" : slack_message,
      "channel": slack_channel, 
      "username": slack_user 
    };
    const req = https.request(options, (res) => {
        let body = '';
        res.setEncoding('utf8');
    });
    req.write(JSON.stringify(postData));
    req.end();
};

