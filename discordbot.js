/*jshint esversion: 6 */
var pointsFile = './points.json';
var authFile = require('./auth.json');
var Discord = require('discord.js');
var jsonfile = require('jsonfile');
var rolesWhichCanGivePoint = ['Admins', 'Mods', 'Judges'];
var adminRole = 'Admins';
var givePointCommand = '!givePoint';
var listPointCommand = '!listPoint';
var help = '!help';
var logout = '!logout';
var restart = '!restart';

var loadAuthDetails = function(detailKey) {
  return authFile[detailKey];
};

var parseMessage = function(msgContent) {
  var commands = [givePointCommand, listPointCommand, help, logout, restart];
  var msgContentArray = [];
  var msgContentArrayParsed = [];
  if (msgContent.includes(' ') === false) {
    msgContentArrayParsed.push(msgContent);
    if (commands.includes(msgContentArray[0])) {
      return msgContentArrayParsed;
    }
  }
  msgContentArray = msgContent.split(' ');
  if (commands.includes(msgContentArray[0])){
    msgContentArrayParsed.push(msgContentArray[0]);
    for (var pointValue in msgContentArray) {
      var numericalPointValue = Number(msgContentArray[pointValue]);
      if (!(Number.isNaN(numericalPointValue)) &&
      numericalPointValue % 1 === 0 &&
      msgContentArray[0] != listPointCommand) {
        msgContentArrayParsed.push(numericalPointValue);
      }
    }
    return msgContentArrayParsed;
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

var givePoint = function(server, mentions, pointsArray) {
  // pointsArray is an optional argument in the case of only one mention
  pointsArray = pointsArray.slice(1) || [1];
  jsonfile.readFile(pointsFile, function(err, serverList) {
    console.error(err);
    for (let i in mentions) {
      var updatedUser = mentions[i].points += pointsArray[i];
      bot.server.members.update(mentions[i], updatedUser);
    }
    serverList = bot.servers;
    jsonfile.writeFile(pointsFile, bot.servers, function(err) {
      console.error(err);
    });
  });
};

var listPoint = function() {
  return null;
};

var replace = function(key, value) {
  if (key === 'client') {
    console.log('replaced');
    return undefined;
  }
  return value;
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
  jsonfile.writeFile(pointsFile, bot.servers, {replacer: replace}, function(err) {
    console.error(err);
  });
});

bot.on('message', function(msg) {
  var parsedMessage = parseMessage(msg.content);
  if (parsedMessage[0] == givePoint && canUseGivePoint(msg.server.rolesOfUser(msg.author))) {
    givePoint(parsedMessage, msg.mentions);
    bot.sendMessage(msg.channel, '');
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
