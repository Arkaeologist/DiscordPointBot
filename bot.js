var authfile = require('./auth.json');
var Discord = require('discord.js');

var loadAuthDetails = function(detailKey) {
  return authfile[detailKey];
};

exports.loadAuthDetails = loadAuthDetails;

var bot = new Discord.Client();

exports.bot = bot;
