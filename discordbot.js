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
var judgesRoleID = 'Judges';

//User class for use in storing point values
User = function(username){
  this.points = 0;
  this.name =  username;
};

//Server class for use in storing User
Server = function(servername){
  //Map Users to id values
  this.users = {};
  this.name = servername;
};

var loadAuthDetails = function(detailKey) {
  return authFile[detailKey];
};

/* Takes a string, and returns an array with the first element as a string
of the command, and the rest as all the numbers in the message, to be
passed to givePoint()
*/
var parseMessage = function(msgContent) {
  var commands = [givePointCommand, listPointCommand, help, logout, restart];
  var msgContentArray = [];
  var msgContentArrayParsed = [];
  //If the message only contains one word, and that word is a valid command, return it
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
    jsonfile.readFile(pointsFile, function(err, serverList) {
      if (err) {
        console.error(err);
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
      for (let i in serverList[serverID].users) {

      }
      bot.sendMessage(channel, pointsMessage);
      jsonfile.writeFile(pointsFile, serverList, function(err) {
        if (err) {
          console.error(err);
        }
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
    if (err) {
      console.error(err);
    }
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

  //Updates the local jsonfile used to store Servers and Users
  var updateServers = function() {
    jsonfile.readFile(pointsFile, function(err, serverList) {
      var discordServerID;
      var discordServerName;
      var serverListEntry;
      var memberID;
      var memberName;

      //For every server the bot has cached
      for (let i = 0; i < bot.servers.length; i++) {

        //Assign the variable for that server's name and id
        discordServerID = bot.servers[i].id;
        discordServerName = bot.servers[i].name;

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
        for (let j = 0; j < bot.servers[i].members.length; j++) {

          //Assign their name and ID variables
          memberID = bot.servers[i].members[j].id;
          memberName = bot.servers[i].members[j].name;

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
      jsonfile.writeFile(pointsFile, serverList, function(err) {
        if (err) {
          console.error(err);
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
      bot.sendMessage(msg.channel, 'Usage of this bot: \n Use ' +
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
    console.log('I\'m ready!');
    bot.setStatus('online', '!help for help');
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
  bot.loginWithToken(loadAuthDetails('loginToken'));
