/*jshint multistr: true */
var authFile = require('./auth.json');
var Discord = require('discord.js');
var rolesWhichCanGiveToken = ["Admins", "Mods", "Judges"];
var adminRole = "Admins";

var loadAuthDetails = function(detailKey) {
    return authFile[detailKey];
};

var parseMessage = function(msgContent) {
  var commands = ["!giveToken", "!listToken", "!help", "!logout", "!restart"];
  var msgContentArray = msgContent.split(" ");
  if (commands.includes(msgContentArray[0])){
      if(msgContentArray[0] == "!giveToken" &&
      !(Number.isNaN(Number(msgContentArray[1])))) {
        msgContentArray[1] = Number(msgContentArray[1]);
      }
      return msgContentArray;
  }
  return false;
};

var canUseGiveToken = function(roleArray) {
  for (let role in rolesWhichCanGiveToken) {
    if (roleArray.includes(rolesWhichCanGiveToken[role])) {
      return true;
    }
  }
  return false;
};

var giveToken = function() {
  return null;
};

var listToken = function() {
  return null;
};
exports.loadAuthDetails = loadAuthDetails;
exports.parseMessage = parseMessage;
exports.canUseGiveToken = canUseGiveToken;
exports.giveToken = giveToken;
exports.listToken = listToken;

var bot = new Discord.Client();

bot.on("ready", function(){
    console.log("I'm ready!");
    bot.setStatus("online", "!help for help");
  });

bot.on("message", function(msg) {
  var parsedMessage = parseMessage(msg.content);
  console.log(parsedMessage);
  console.log(msg.author.id);
  console.log(msg.server.rolesOfUser(msg.author.id));
  console.log(msg.server.rolesOfUser(msg.author.id).includes(adminRole));
  if (parsedMessage[0] == "!giveToken") {
    giveToken(parsedMessage);
  }
  else if (parsedMessage[0] == "!listToken") {
    listToken(parsedMessage);
  }
  else if (parsedMessage[0] == "!help" || msg.isMentioned(bot.user)) {
    bot.sendMessage(msg.channel, "Usage of this bot: \n Use !giveToken \
<number of tokens> <@mention user> to give a user that number of tokens. \
The number of tokens argument is optional. \n Use !listToken \
<@mention user> to list that user's tokens, or optionally \
simply use !listToken to list all users' tokens on the server, \
formatted to a table sorted by number of tokens. \n \n  \
Admins only commands: \n Use !logout to cause the bot to go \
offline. \n Use !restart to restart the bot.");
  }
  else if (parsedMessage[0] == "!logout" &&
    msg.server.rolesOfUser(msg.author.id).includes(adminRole)) {
      bot.logout();
  }
  else if (parsedMessage[0] == "!restart" &&
    msg.server.rolesOfUser(msg.author.id).includes(adminRole)) {
      bot.logout();
      bot.loginWithToken(loadAuthDetails("loginToken"));
  }
});

bot.loginWithToken(loadAuthDetails("loginToken"));
