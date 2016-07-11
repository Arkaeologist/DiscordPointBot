/*jshint esversion: 6 */
var authFile = require('./auth.json');
var Discord = require('discord.js');
var rolesWhichCanGiveToken = ['Admins', 'Mods', 'Judges'];
var adminRole = 'Admins';

var loadAuthDetails = function(detailKey) {
    return authFile[detailKey];
};

var parseMessage = function(msgContent) {
  var commands = ['!giveToken', '!listToken', '!help', '!logout', '!restart'];
  var msgContentArray = [];
  if (msgContent.includes(' ') === false) {
    msgContentArray.push(msgContent);
    if (commands.includes(msgContentArray[0])) {
      return msgContentArray;
    }
  }
  msgContentArray = msgContent.split(" ");
  msgContentArray = msgContentArray.slice(0, 3);
  if (commands.includes(msgContentArray[0])){
      if(msgContentArray[0] == '!giveToken') {
        if (!(Number.isNaN(Number(msgContentArray[1])))) {
          msgContentArray[1] = Number(msgContentArray[1]);
          return msgContentArray;
        } else if (msgContentArray[1] === "") {

        }
      } else if (msgContentArray[0] == '!listToken') {

      }
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

bot.on('ready', function(){
    console.log('I\'m ready!');
    bot.setStatus('online', '!help for help');
  });

bot.on('message', function(msg) {
  var parsedMessage = parseMessage(msg.content);
  if (parsedMessage[0] == '!giveToken') {
    giveToken(parsedMessage);
  } else if (parsedMessage[0] == '!listToken') {
    listToken(parsedMessage);
  } else if (parsedMessage[0] == '!help' || msg.isMentioned(bot.user)) {
    bot.sendMessage(msg.channel, 'Usage of this bot: \n Use !giveToken ' +
    '<number of tokens> <@mention user> to give a user that number of tokens' +
    'The number of tokens argument is optional. \n Use !listToken ' +
    '<@mention user> to list that user\'s tokens, or optionally ' +
    'simply use !listToken to list all users\' tokens on the server, ' +
    'formatted to a table sorted by number of tokens. \n \n  ' +
    'Admins only commands: \n Use !logout to cause the bot to go ' +
    'offline. \n Use !restart to restart the bot. \n \n If an error ' +
    'is encountered, please report it to sblaplace+tokenbot@gmail.com');
  } else if (parsedMessage[0] == '!logout') {
    bot.logout(function(error){
      if(error){
        console.log('Log out failed');
      } else {
        console.log('Log out successful');
      }
    });
  } else if (parsedMessage[0] == '!restart') {

  }
});

bot.loginWithToken(loadAuthDetails('loginToken'));
