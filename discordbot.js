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

//Updates the local jsonfile used to store Servers and Users
function updateServers() {
  winston.profile('updateServers');
  jsonfile.readFile(pointsFile, function(error, serverList) {
    let discordServerID;
    let discordServerName;
    let serverListEntry;
    let memberID;
    let memberName;

    if (error) winston.error(error);

    //For every server the bot has cached
    for (let serverIndex = 0; serverIndex < bot.servers.length;
    serverIndex++) {

      //Assign the variable for that server's name and id
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

      //For every cached member in the server
      for (let userIndex = 0; userIndex <
      bot.servers[serverIndex].members.length; userIndex++) {

        //Assign their name and ID variables
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

    //Write to the file
    jsonfile.writeFile(pointsFile, serverList, function(error) {
      logAndProfile(error, 'updateServers');
    });
  });
}

//Decide which command to run
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
    givePoint(msg.server, msg.channel, msg.mentions, parsedMessage,
      function() {
        bot.sendMessage(channel, pointsMessage, function(error) {
          logAndProfile(error, 'givePoint');
        });
      });
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

//Export all functions for use in unit tests
exports.loadAuthDetails = loadAuthDetails;
exports.canUseGivePoint = canUseGivePoint;
exports.updateServers = updateServers;
exports.chooseCommand = chooseCommand;
exports.commands = commands;
exports.bot = bot;

const bot = new Discord.Client();

/* When the bot has successfully logged in, update the local points file,
*  log to the console that we're ready, and then set the bot's status to
*  online, and the game it's playing to a prompt for how to use the bot.
*/
bot.on('ready', function() {
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
bot.on('serverMemberUpdated' || 'serverNewMember' || 'serverUpdated' ||
 'serverCreated', function() {
  updateServers();
});

// Listen for messages
bot.on('message', function(msg) {
  chooseCommand(msg);
});

// Log in to Discord
function login() {
  winston.profile('login');
  bot.loginWithToken(loginToken = loadAuthDetails('loginToken'), null, null, function(error) {
    logAndProfile(error, 'login');
  });
}

login();
