'use strict';
const Discord = require('discord.js');
const jsonfile = require('jsonfile');
const winston = require('winston');
const authFile = require('./auth.json');
const User = require('./user').User;
const Server = require('./server').Server;
const parseMessage = require('./parsemessage').parseMessage;

const pointsFile = './points.json';
const rolesWhichCanGivePoint = ['Admins', 'Mods', 'Judges'];
const givePointCommand = '!givePoint';
const listPointCommand = '!listPoint';
const help = '!help';
const logout = '!logout';
const restart = '!restart';
const commands = [givePointCommand, listPointCommand, help, logout, restart];
const pointName = 'point';
const helpMessage = `Usage of this bot: \n Use ${givePointCommand} <number of points> <@mention user> to give a user that number of ${pointName}s. The number of ${pointName}s argument is optional. \n Use ${listPointCommand} <@mention user> to list that user\'s points, or optionally simply use ' + ${listPointCommand} to list all users\'s ${pointName}s on the server, sorted by number of ${pointName}s \n \n Admins only commands: \n Use !logout to cause the bot to go offline. \n Use !restart to restart the bot. \n \n If an error is encountered, please report it to sblaplace+pointbot@gmail.com \n To see the source code, please visit https://github.com/sblaplace/DiscordPointBot1`;

function logAndProfile(error, profileName) {
  winston.error(error);
  winston.profile(profileName);
}

function loadAuthDetails(detailKey) {
  return authFile[detailKey];
}

// Checks if a user has any roles that match roles that can give points
function canUseGivePoint(roleArray) {
  for (let role in rolesWhichCanGivePoint) {
    if (roleArray.includes(rolesWhichCanGivePoint[role])) {
      return true;
    }
  }
  return false;
}

function givePoint(server, channel, mentions, pointsArray) {
  winston.profile('givePoint');
  // pointsArray is an optional argument in the case of only one mention
  pointsArray = pointsArray.slice(1) || [1];
  let pointsMessage = '';
  let userMentioned;
  serverID = server.id;
  if (pointsArray.length === mentions.length) {
    jsonfile.readFile(pointsFile, function(error, serverList) {
      winston.error(error);
      for (let i in mentions) {
        userMentioned = serverList[server.id].users[mentions[i].id];
        userMentioned.points += pointsArray[i];
        pointsMessage = pointsMessage.concat('Gave ' + pointsArray[i] + ' ' +
        pointName + 's to ' +
        serverList[server.id].users[mentions[i].id].name + ' \n');
    }

    // Write to file and message chat confirming points were given
    jsonfile.writeFile(pointsFile, serverList, function (error) {
      winston.error(error);
      bot.sendMessage(channel, pointsMessage, function(error) {
          logAndProfile(error, 'givePoint');
        });
    });
  });

    // Send message to chat asking for usable input
  }
  else if (pointsArray.length !== mentions.length){
    let pointsErrorMessage = 'Please input a ' + pointName +
    ' value for each user mentioned';
    bot.sendMessage(channel, pointsErrorMessage, function(error) {
      logAndProfile(error, 'givePoint');
    });
  }
}

/* Lists the point values for a server of all users mentioned, or, if
*  no users are mentioned, then for all users on that server.
*/
function listPoint(server, channel, mentions) {
  winston.profile('listPoint');
  // If there aren't any mentions, list everyone
  if (mentions.length === 0) {
    mentions = server.members;
  }

let pointsMessage = '';
jsonfile.readFile(pointsFile, function(error, serverList) {
  winston.error(error);
  // For every person mentioned
  for (let mentionedIndex = 0; mentionedIndex < mentions.length;
  mentionedIndex++) {

      // After the first mention, add a new line before every mention
      if ( mentionedIndex > 0 ) {
        pointsMessage = pointsMessage.concat('\n');
      }

      /* Add a line for this mention of the format
      *  '<username>: <number of points> points'
      *  e.g. 'sblaplace: 15 points'
      */
      pointsMessage =
      pointsMessage.concat(serverList[server.id].
        users[mentions[mentionedIndex].id].name +
        ': ' + serverList[server.id].
        users[mentions[mentionedIndex].id].points +
        ' ' + pointName + 's ');
    }


    // Send a the completed points message, and log an error or success
    bot.sendMessage(channel, pointsMessage, function(error) {
      logAndProfile(error, 'listPoint');
    });
  });
}

// Updates the local jsonfile used to store Servers and Users
function updateServers() {
  winston.profile('updateServers');
  jsonfile.readFile(pointsFile, function(error, serverList) {
    let discordServerID;
    let discordServerName;
    let serverListEntry;
    let memberID;
    let memberName;

    winston.error(error);

    // For every server the bot has cached
    for (let serverIndex = 0; serverIndex < bot.servers.length;
    serverIndex++) {

      // Assign the variable for that server's name and id
      discordServerID = bot.servers[serverIndex].id;
      discordServerName = bot.servers[serverIndex].name;

      /* If the server isn't in the json file, add it. Otherwise,
      *  update the name.
      */
      if ( !(discordServerID in serverList)) {
        serverList[discordServerID] = new Server(discordServerName);
      } else {
        serverList[discordServerID].name = discordServerName;
      }

      // Assign the variable for the Server object to be stored locally
      serverListEntry = serverList[discordServerID];

      // For every cached member in the server
      for (let userIndex = 0; userIndex <
      bot.servers[serverIndex].members.length; userIndex++) {

        // Assign their name and ID variables
        memberID = bot.servers[serverIndex].
        members[userIndex].id;
        memberName = bot.servers[serverIndex].
        members[userIndex].name;

        /* If the user isn't in the points file,
        *  add them, and if they are in it, then update their name
        */
        if ( !(memberID in serverListEntry.users)) {
          serverListEntry.users[memberID] = new User(memberName);
        } else {
          serverListEntry.users[memberID].name = memberName;
        }
      }
    }

    // Write to the file
    jsonfile.writeFile(pointsFile, serverList, function(error) {
      logAndProfile(error, 'updateServers');
    });
  });
}

// Decide which command to run
function chooseCommand(msg) {
  const parsedMessage = parseMessage(msg.content);
  let msgRoles = [];

  // For every role the message sender has, add it's name to an array
  for (let role in msg.server.rolesOfUser(msg.author)) {
    msgRoles.push(msg.server.rolesOfUser(msg.author)[role].name);
  }

  /* Based on the first word of the message, choose a command to run,
  *  making sure that the user is allowed to use it. Additionally, send the
  *  help message if the bot is mentioned.
  */
  if (parsedMessage[0] === givePointCommand && canUseGivePoint(msgRoles)) {
    givePoint(msg.server, msg.channel, msg.mentions, parsedMessage);
  } else if (parsedMessage[0] === listPointCommand) {
    listPoint(msg.server, msg.channel, msg.mentions);
  } else if (parsedMessage[0] === help || msg.isMentioned(bot.user)) {
    winston.profile('helpMessage');
    bot.sendMessage(msg.channel, helpMessage, function(error) {
      logAndProfile(error, 'helpMessage');
    });
  } else if (parsedMessage[0] === logout) {
    winston.profile('logout');
    bot.logout(function(error) {
      logAndProfile(error, 'logout');
    });
  }
}

// Export all functions for use in unit tests
exports.loadAuthDetails = loadAuthDetails;
exports.canUseGivePoint = canUseGivePoint;
exports.givePoint = givePoint;
exports.listPoint = listPoint;
exports.updateServers = updateServers;
exports.chooseCommand = chooseCommand;
exports.commands = commands;

const bot = new Discord.Client();

/* When the bot has successfully logged in, update the local points file,
*  log to the console that we're ready, and then set the bot's status to
*  online, and the game it's playing to a prompt for how to use the bot.
*/
bot.on('ready', function(){
  updateServers();
  winston.profile('setStatus');
  bot.setStatus('online', '!help for help', function(error) {
    logAndProfile(error, 'setStatus');
  });
});


/* Listen for any event in which a new member or server is added, or has
*  changed it's name. On these events, update the locally stored points
*  file.
*/
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

// Listen for messages
bot.on('message', function(msg) {
  chooseCommand(msg);
});

// Log in to Discord
function login() {
  winston.profile('login');
  bot.login(loadAuthDetails('loginToken'), null, null, function(error) {
    logAndProfile(error, 'login');
  });
}

login();
