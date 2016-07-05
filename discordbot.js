var authfile = require('./auth.json');
var Discord = require('discord.js');

var loadAuthDetails = function(detailKey) {
    return authfile[detailKey];
};

exports.loadAuthDetails = loadAuthDetails;

var bot = new Discord.Client();

bot.on("ready", function(){
    console.log("I'm ready!");
  });

bot.loginWithToken(loadAuthDetails("loginToken"));
