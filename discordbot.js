var authFile = require('./auth.json');
var Discord = require('discord.js');

var loadAuthDetails = function(detailKey) {
    return authFile[detailKey];
};

var parseMessage = function(msgContent) {
  var commands = ["!giveToken", "!listToken"];
  if (commands.includes(msgContent)){
      return msgContent;
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
