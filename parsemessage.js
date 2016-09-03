/*jshint esversion: 6 */
var givePointCommand = '!givePoint';
var listPointCommand = '!listPoint';
var help = '!help';
var logout = '!logout';
var restart = '!restart';
var commands = [givePointCommand, listPointCommand, help, logout, restart];

/* Takes a string, and returns an array with the first element as a string
*  of the command, and the rest as all the numbers in the message, to be
*  passed to givePoint()
*/
function parseMessage(msgContent) {
  var msgContentArray = [];
  var msgContentArrayParsed = [];
  /* If the message only contains one word, and that word is a valid command,
  *  return that in an array
  */
  if (msgContent.includes(' ') === false) {
    msgContentArrayParsed.push(msgContent);
  }
  msgContentArray = msgContent.split(' ');
  return parseMultiWordMsg(msgContentArray);
}

/* Split the string of the content of the mssage on every space. The
*  first item in the array is a command, and is checked against the
*  array of commands to ensure this. If it isn't, then false is returned,
*  so that the check later on in chooseCommand will work. Otherwise, the
*  other items are then checked to make sure that they're a positive integer.
*  If they are, they're put into the array which is returned.
*/
function parseMultiWordMsg(msgContentArray) {
  var msgContentArrayParsed = [];
  if (commands.includes(msgContentArray[0])) {
    msgContentArrayParsed.push(msgContentArray[0]);
    for (var pointValue in msgContentArray) {
      var numericalPointValue = Number(msgContentArray[pointValue]);
      if (!(Number.isNaN(numericalPointValue)) &&
      numericalPointValue % 1 === 0 &&
      msgContentArray[0] !== listPointCommand) {
        msgContentArrayParsed.push(numericalPointValue);
      }
    }
    return msgContentArrayParsed;
  }
  return false;
}

exports.parseMultiWordMsg = parseMultiWordMsg;
exports.parseMessage = parseMessage;
