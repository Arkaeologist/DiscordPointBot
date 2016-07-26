/*jshint esversion: 6 */
var Discord = require('discord.js');
var jsonfile = require('jsonfile');
var pointsFile = './points.json';
var authFile = require('./auth.json');
var rolesWhichCanGivePoint = ['Admins', 'Mods', 'Judges'];
var adminRole = 'Admins';
var givePointCommand = '!givePoint';
var listPointCommand = '!listPoint';
var help = '!help';
var logout = '!logout';
var restart = '!restart';
var pointName = 'point';

User = function(username){
  this.points = 0;
  this.name =  username;
};

Server = function(servername){
  this.users = {};
  this.name = servername;
};

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

var givePoint = function(server, channel, mentions, pointsArray) {
  // pointsArray is an optional argument in the case of only one mention
  pointsArray = pointsArray.slice(1) || [1];
  var pointsMessage = '';
  if (pointsArray.length === mentions.length) {
    jsonfile.readFile(pointsFile, function(err, serverList) {
      console.error(err);
      for (let i in mentions) {
        serverList[server.id].users[mentions[i].id].points += pointsArray[i];
        pointsMessage = pointsMessage.concat('Gave ' + pointsArray[i] + ' ' +
          pointName + 's to ' +
          serverList[server.id].users[mentions[i].id].name + ' \n');
      }
      bot.sendMessage(channel, pointsMessage);
      jsonfile.writeFile(pointsFile, serverList, function(err) {
        console.error(err);
      });
    });
  } else {
    bot.sendMessage(channel, 'Please input a ' + pointName +
    ' value for each user mentioned');
  }
};

var listPoint = function(server, channel, mentions) {
  if (mentions.length === 0) {
    mentions = server.members;
  }
  var pointsMessage = '';
  jsonfile.readFile(pointsFile, function(err, serverList) {
    console.error(err);
    for (let i = 0; i < mentions.length; i++) {
      console.log(mentions[i].id);
      console.log(serverList[server.id].users[mentions[i].id].name);
      pointsMessage =
      pointsMessage.concat(serverList[server.id].users[mentions[i].id].name +
        ': ' + serverList[server.id].users[mentions[i].id].points +
      ' ' + pointName + 's \n');
    }
    bot.sendMessage(channel, pointsMessage);
  });
};

var updateServers = function() {
  jsonfile.readFile(pointsFile, function(err, serverList) {
    var serverListEntry;
    for (let i = 0; i < bot.servers.length; i++) {
      if ( !(bot.servers[i].id in serverList)) {
        serverList[bot.servers[i].id] = new Server(bot.servers[i].name);
      } else {
        serverList[bot.servers[i].id].name = bot.servers[i].name;
      }
      serverListEntry = serverList[bot.servers[i].id];
      for (let j = 0; j < bot.servers[i].members.length; j++) {
        if ( !(bot.servers[i].members[j].id in serverListEntry.users)) {
          serverListEntry.users[bot.servers[i].members[j].id] =
            new User(bot.servers[i].members[j].name);
        } else {
          serverListEntry.users[bot.servers[i].members[j].id].name =
            bot.servers[i].members[j].name;
        }
      }
    }
    jsonfile.writeFile(pointsFile, serverList, function(err) {
      console.error(err);
      console.log('I\'m ready!');
      bot.setStatus('online', '!help for help');
    });
  });
};

exports.loadAuthDetails = loadAuthDetails;
exports.parseMessage = parseMessage;
exports.canUseGivePoint = canUseGivePoint;
exports.givePoint = givePoint;
exports.listPoint = listPoint;
exports.updateServers = updateServers;

var bot = new Discord.Client();

bot.on('ready', function(){
  updateServers();
});

bot.on('serverMemberUpdated', function(){
  updateServers();
});

bot.on('serverNewMember', function(){
  updateServers();
});

bot.on('serverUpdated', function(){
  updateServers();
});

bot.on('serverCreated', function(){
  updateServers();
});

bot.on('serverCreated', function(){
  updateServers();
});

bot.on('message', function(msg) {
  var parsedMessage = parseMessage(msg.content);
  var msgRoles = [];
  for (let role in msg.server.rolesOfUser(msg.author)) {
    msgRoles.push(msg.server.rolesOfUser(msg.author)[role].name);
  }
  if (parsedMessage[0] == givePointCommand && canUseGivePoint(msgRoles)) {
    givePoint(msg.server, msg.channel, msg.mentions, parsedMessage);
  } else if (parsedMessage[0] == listPointCommand) {
    listPoint(msg.server, msg.channel, msg.mentions);
  } else if (parsedMessage[0] == help || msg.isMentioned(bot.user)) {
    bot.sendMessage(msg.channel, 'Usage of this bot: \n Use ' +
    givePointCommand + ' ' +
    '<number of points> <@mention user> to give a user that number of ' +
    pointName + 's. ' +
    'The number of ' + pointName + 's argument is optional. \n Use ' +
    listPointCommand + ' '+
    '<@mention user> to list that user\'s points, or optionally ' +
    'simply use ' + listPointCommand +
    ' to list all users\' points on the server, ' +
    'sorted by number of points. \n \n  ' +
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
