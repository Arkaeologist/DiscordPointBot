var expect = require("chai").expect;
var discordbot = require("../discordbot");
var Discord = require('discord.js');
var authfile = require('../auth.json');

/*
describe("Bot Authenticator", function() {
  var bot = new Discord.Client();
  it("logs in to Discord", function(done) {
    bot.loginWithToken(discordbot.loadAuthDetails("loginToken"), null, null, function(error, token){
      done();
    });
    expect(bot.uptime).to.be.above(0);
  });
  /*it("adds itself to a server given invite link", function() {
    var addRequested = bot.bot.joinServer(bot.inviteLink);
  });
});
*/
