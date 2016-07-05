var authFile = require('./auth.json');
var Discord = require('discord.js');

var loadAuthDetails = function(detailKey) {
    return authFile[detailKey];
};

var parseMessage = function(msgContent) {
  var commands = ["!giveToken", "!listToken"];
  var msgContentArray = msgContent.split(" ");
  if (commands.includes(msgContentArray[0])){
      if(msgContentArray[0] == "!giveToken" && !(Number.isNaN(Number(msgContentArray[1])))) {
        msgContentArray[1] = Number(msgContentArray[1]);
      }
      return msgContentArray;
  }
};

exports.loadAuthDetails = loadAuthDetails;
exports.parseMessage = parseMessage;

var bot = new Discord.Client();

bot.on("ready", function(){
    console.log("I'm ready!");
  });

bot.on("message", function(msg) {

});

bot.loginWithToken(loadAuthDetails("loginToken"));
