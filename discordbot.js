/*jshint esversion: 6 */
var Discord = require('discord.js');
var jsonfile = require('jsonfile');
var yaml = require('js-yaml');
var fs   = require('fs');

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
var judgesRoleID = 'Judges';
var helpMessage = 'Usage of this bot: \n Use ' +
givePointCommand + ' ' +
'<number of points> <@mention user> to give a user that number of ' +
pointName + 's. ' +
'The number of ' + pointName + 's argument is optional. \n Use ' +
listPointCommand + ' '+
'<@mention user> to list that user\'s points, or optionally ' +
'simply use ' + listPointCommand +
' to list all users\'s ' + pointName + 's on the server, ' +
'sorted by number of ' + pointName + 's \n \n  ' +
'Admins only commands: \n Use !logout to cause the bot to go ' +
'offline. \n Use !restart to restart the bot. \n \n If an error ' +
'is encountered, please report it to sblaplace+pointbot@gmail.com \n' +
'To see the source code, please visit ' +
' https://github.com/sblaplace/DiscordPointBot';


// User class for use in storing point values
User = function(username){
  this.points = 0;
  this.name =  username;
};

// Server class for use in storing User
Server = function(servername){
  // Map Users to id values
  this.users = {};
  this.name = servername;
};

var loadAuthDetails = function(detailKey) {
  return authFile[detailKey];
};

/* Takes a string, and returns an array with the first element as a string
*  of the command, and the rest as all the numbers in the message, to be
*  passed to givePoint()
*/
var parseMessage = function(msgContent) {
  var commands = [givePointCommand, listPointCommand, help, logout, restart];
  var msgContentArray = [];
  var msgContentArrayParsed = [];

  /* If the message only contains one word, and that word is a valid command,
  *  return that in an array
  */
  if (msgContent.includes(' ') === false) {
    msgContentArrayParsed.push(msgContent);
    if (commands.includes(msgContentArray[0])) {
      return msgContentArrayParsed;
    }
  }

  /* Split the string of the content of the mssage on every space. The
  *  first item in the array is a command, and is checked against the
  *  array of commands to ensure this. If it isn't, then false is returned,
  *  so that the check later on in chooseCommand will work. Otherwise, the
  *  other items are then checked to make sure that they're a positive integer.
  *  If they are, they're put into the array which is returned.
  */
  msgContentArray = msgContent.split(' ');
  if (commands.includes(msgContentArray[0])) {
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

//Checks if a user has any roles that match roles that can give points
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
  var userMentioned;
  serverID = server.id;
  if (pointsArray.length === mentions.length) {
    jsonfile.readFile(pointsFile, function(error, serverList) {
      if (error) {
        console.error(error);
      }
      for (let i in mentions) {
        userMentioned = serverList[server.id].users[mentions[i].id];
        userMentioned.points += pointsArray[i];
        pointsMessage = pointsMessage.concat('Gave ' + pointsArray[i] + ' ' +
        pointName + 's to ' +
        serverList[server.id].users[mentions[i].id].name + ' \n');
        /*if (userMentioned.points >= 100) {
        mentions[i].addTo(judgesRoleID);
      }*/
    }

    // Send message to chat confirming points were given
    bot.sendMessage(channel, pointsMessage, function(error,
      pointsMessage) {
        if (error) {
          console.error(error);
        } else {
          console.log('Success: Sent give point message');
        }
      });
      jsonfile.writeFile(pointsFile, serverList, function(error) {
        if (error) {
          console.error(error);
        } else {
          console.log('Success: Wrote points to file');
        }
      });
    });

    // Send message to chat asking for usable input
  } else if (pointsArray.length != mentions.length){
    var pointsErrorMessage = 'Please input a ' + pointName +
    ' value for each user mentioned';
    bot.sendMessage(channel, pointsErrorMessage, function(error,
      pointsErrorMessage) {
        if (error) {
          console.error(error);
        } else {
          console.log('Success: Sent points error message');
        }
      });
    }
  };

/* Lists the point values for a server of all users mentioned, or, if
*  no users are mentioned, then for all users on that server.
*/
var listPoint = function(server, channel, mentions) {

  // If there aren't any mentions, list everyone
  if (mentions.length === 0) {
    mentions = server.members;
  }

  var pointsMessage = '';
  jsonfile.readFile(pointsFile, function(error, serverList) {

    // If there's an error, log it, and if not, log a success
    if (error) {
      console.error(error);
    } else {
      console.log('Success: Read points file');
    }

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
    bot.sendMessage(channel, pointsMessage, function (error) {
      if (error) {
        console.error(error);
      } else {
        console.log('Success: Sent points list');
      }
    });
  });
};

//Updates the local jsonfile used to store Servers and Users
var updateServers = function() {
  jsonfile.readFile(pointsFile, function(error, serverList) {
    var discordServerID;
    var discordServerName;
    var serverListEntry;
    var memberID;
    var memberName;

    if (error) {
      console.error(error);
    } else {
      console.log('Success: Read points file');
    }

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
      if (error) {
        console.error(error);
      } else {
        console.log('Success: Updated server list');
      }
    });
  });
};

//Decide which command to run
var chooseCommand = function(msg) {
  var parsedMessage = parseMessage(msg.content);
  var msgRoles = [];

  // For every role the message sender has, add it's name to an array
  for (let role in msg.server.rolesOfUser(msg.author)) {
    msgRoles.push(msg.server.rolesOfUser(msg.author)[role].name);
  }

  /* Based on the first word of the message, choose a command to run,
  *  making sure that the user is allowed to use it. Additionally, send the
  *  help message if the bot is mentioned.
  */
  if (parsedMessage[0] == givePointCommand && canUseGivePoint(msgRoles)) {
    givePoint(msg.server, msg.channel, msg.mentions, parsedMessage);
  } else if (parsedMessage[0] == listPointCommand) {
    listPoint(msg.server, msg.channel, msg.mentions);
  } else if (parsedMessage[0] == help || msg.isMentioned(bot.user)) {
    bot.sendMessage(msg.channel, helpMessage, function(error) {
      if (error) {
        console.error(error);
      } else {
        console.log('Success: Logged in');
      }
    });

  } else if (parsedMessage[0] == logout) {
    bot.logout(function(error) {
      if(error){
        console.error(error);
      } else {
        console.log('Log out successful');
      }
    });


  } else if (parsedMessage[0] == restart) {

  }
};

//Export all functions for use in unit tests
exports.loadAuthDetails = loadAuthDetails;
exports.parseMessage = parseMessage;
exports.canUseGivePoint = canUseGivePoint;
exports.givePoint = givePoint;
exports.listPoint = listPoint;
exports.updateServers = updateServers;
exports.chooseCommand = chooseCommand;

var bot = new Discord.Client();

/* When the bot has successfully logged in, update the local points file,
*  log to the console that we're ready, and then set the bot's status to
*  online, and the game it's playing to a prompt for how to use the bot.
*/
bot.on('ready', function(){
  updateServers();

  bot.setStatus('online', '!help for help', function (error) {
    if (error) {
      console.error(error);
    } else {
      console.log('Success: Set status');
      console.log('Success: Set up finished');
    }
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
bot.loginWithToken(loginToken = loadAuthDetails('loginToken'), null, null,
function(error, loginToken) {
  if (error) {
    console.error(error);
  } else {
    console.log('Success: Logged in');
  }
});
