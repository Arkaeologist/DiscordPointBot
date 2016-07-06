var authFile = require('./auth.json');
var Discord = require('discord.js');
var rolesWhichCanGiveToken = ["Admins", "Mods", "Judges"];

var loadAuthDetails = function(detailKey) {
    return authFile[detailKey];
};

var parseMessage = function(msgContent) {
  var commands = ["!giveToken", "!listToken", "!help"];
  var msgContentArray = msgContent.split(" ");
  if (commands.includes(msgContentArray[0])){
      if(msgContentArray[0] == "!giveToken" && !(Number.isNaN(Number(msgContentArray[1])))) {
        msgContentArray[1] = Number(msgContentArray[1]);
      }
      return msgContentArray;
  }
};

var canUseGiveToken = function(roleArray) {
  for (let role in rolesWhichCanGiveToken) {
    if (roleArray.includes(rolesWhichCanGiveToken[role])) {
      return true;
    }
  }
  return false;
};

exports.loadAuthDetails = loadAuthDetails;
exports.parseMessage = parseMessage;
exports.canUseGiveToken = canUseGiveToken;

var bot = new Discord.Client();

bot.on("ready", function(){
    console.log("I'm ready!");
  });

bot.on("message", function(msg) {
  var parsedMessage = parseMessage(msg.content);
  console.log(parsedMessage);
});

bot.loginWithToken(loadAuthDetails("loginToken"));
