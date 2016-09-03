/*jshint esversion: 6 */
var givePoint = function(server, channel, mentions, pointsArray, callback) {
  winston.profile('givePoint');
  // pointsArray is an optional argument in the case of only one mention
  pointsArray = pointsArray.slice(1) || [1];
  serverID = server.id;
  if (pointsArray.length === mentions.length) {
    savePoints(server, channel, mentions, pointsArray, callback);
  }
  // Send message to chat asking for usable input
  else if (pointsArray.length !== mentions.length) {
    makeErrorMessage(channel);
  }
};

var makeErrorMessage = function() {
  var pointsErrorMessage = 'Please input a ' + pointName +
  ' value for each user mentioned';
  bot.sendMessage(channel, pointsErrorMessage, function(error) {
    logAndProfile(error, 'givePoint');
  });
};

var savePoints = function(server, channel, mentions, pointsArray,
  callback) {
  var pointsMessage = '';
  var userMentioned;
  jsonfile.readFile(pointsFile, function(error, serverList) {
    if (error) winston.error(error);
    serverList = makeServerList(server, channel, mentions, pointsArray);
    // Write to file and message chat confirming points were given
    jsonfile.writeFile(pointsFile, serverList, function (error) {
      if (error) winston.error(error);
      callback(error, channel, pointsMessage)
    });
  });
};

var makeSaveMessage = function(server, channel, mentions, pointsArray) {
  for (let i in mentions) {
    userMentioned = serverList[server.id].users[mentions[i].id];
    userMentioned.points += pointsArray[i];
    pointsMessage = pointsMessage.concat('Gave ' + pointsArray[i] + ' ' +
    pointName + 's to ' +
    serverList[server.id].users[mentions[i].id].name + ' \n');
  }
  return serverList;
};
/* Lists the point values for a server of all users mentioned, or, if
*  no users are mentioned, then for all users on that server.
*/
var listPoint = function(server, channel, mentions) {
  winston.profile('listPoint');
  // If there aren't any mentions, list everyone
  if (mentions.length === 0) {
    mentions = server.members;
  }
  listMessage(server, channel, mentions);
};

var listMessage = function(server, channel, mentions) {
  var pointsMessage = '';
  jsonfile.readFile(pointsFile, function(error, serverList) {
    if (error) winston.error(error);
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
};

exports.givePoint = givePoint;
exports.listPoint = listPoint;
