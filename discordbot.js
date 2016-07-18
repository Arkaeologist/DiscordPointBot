/*jshint esversion: 6 */
var authFile = require('./auth.json');
var Discord = require('discord.js');
var rolesWhichCanGivePoint = ['Admins', 'Mods', 'Judges'];
var adminRole = 'Admins';
var givePoint = '!givePoint';
var listPoint = '!listPoint';
var help = '!help';
var logout = '!logout';
var restart = '!restart';

var loadAuthDetails = function(detailKey) {
  return authFile[detailKey];
};

var parseMessage = function(msgContent) {
  var commands = [givePoint, listPoint, help, logout, restart];
  var msgContentArray = [];
  var msgContentArrayParsed = [];
  if (msgContent.includes(' ') === false) {
    msgContentArrayParsed.push(msgContent);
    if (commands.includes(msgContentArray[0])) {
      return msgContentArrayParsed;
    }
  }
  msgContentArray = msgContent.split(" ");
  if (commands.includes(msgContentArray[0])){
    msgContentArrayParsed.push(msgContentArray[0]);
    msgContentArray = msgContentArray.slice(1);
    for (let pointValue in msgContentArray) {
      pointValue = Number(pointValue);
      if (!(isNaN(pointValue)) && pointValue % 1 === 0) {
        msgContentArrayParsed.push(pointValue);
      }
      return msgContentArrayParsed;
    }
  }
  return false;
};

var canUseGivePoint = function(roleArray) {
  for (let role in rolesWhichCanGivePoint) {
    if (roleArray.includes(rolesWhichCanGivePoint[role])) {
      return true;
    }
  }
  return false;
};

var givePoint = function() {
  return null;
};

var listPoint = function() {
  return null;
};
exports.loadAuthDetails = loadAuthDetails;
exports.parseMessage = parseMessage;
exports.canUseGivePoint = canUseGivePoint;
exports.givePoint = givePoint;
exports.listPoint = listPoint;

var bot = new Discord.Client();

bot.on('ready', function(){
  console.log('I\'m ready!');
  bot.setStatus('online', '!help for help');
});

bot.on('message', function(msg) {
  var parsedMessage = parseMessage(msg.content);
  if (parsedMessage[0] == givePoint && canUseGivePoint(msg.server.rolesOfUser(msg.author))) {
    givePoint(parsedMessage, msg.mentions);
  } else if (parsedMessage[0] == listPoint) {
    listPoint(parsedMessage, msg.mentions);
  } else if (parsedMessage[0] == help || msg.isMentioned(bot.user)) {
    bot.sendMessage(msg.channel, 'Usage of this bot: \n Use !givePoint ' +
    '<number of points> <@mention user> to give a user that number of Points' +
    'The number of Points argument is optional. \n Use !listPoint ' +
    '<@mention user> to list that user\'s points, or optionally ' +
    'simply use !listPoint to list all users\' points on the server, ' +
    'formatted to a table sorted by number of points. \n \n  ' +
    'Admins only commands: \n Use !logout to cause the bot to go ' +
    'offline. \n Use !restart to restart the bot. \n \n If an error ' +
    'is encountered, please report it to sblaplace+pointbot@gmail.com');
  } else if (parsedMessage[0] == logout) {
    bot.logout(function(error){
      if(error){
        console.log('Log out failed');
      } else {
        console.log('Log out successful');
      }
    });
  } else if (parsedMessage[0] == restart) {

  }
});

bot.loginWithToken(loadAuthDetails('loginToken'));
