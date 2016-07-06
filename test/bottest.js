var expect = require("chai").expect;
var discordBot = require("../discordbot");
var Discord = require('discord.js');

describe("Bot", function(){
  /* describe("User List Builder", function() {
    it("loads Cache of users from server", function() {
    });
  }); */
  describe("Message Parser", function(){
    it("only accepts commands from array of commands", function() {
      var goodCommandArg = "!giveToken";
      var badCommandArg = "!blah";
      var goodCommand = discordBot.parseMessage(goodCommandArg);
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(goodCommand[0]).to.equal("!giveToken");
      expect(badCommand).to.be.undefined;
    });
    it("allows for !giveToken with 2 arguments", function() {
      var goodCommandArg = "!giveToken 5 user";
      var goodCommand = discordBot.parseMessage(goodCommandArg);
      expect(goodCommand).to.deep.equal(["!giveToken", 5, "user"]);
    });
    it("allows for !giveToken with 1 arguments", function() {
      var goodCommandArg = "!giveToken user";
      var goodCommand = discordBot.parseMessage(goodCommandArg);
      expect(goodCommand).to.deep.equal(["!giveToken", "user"]);
    });
  });
  describe("Give Token Ability Checker", function() {
    it("checks if the sender can give tokens", function() {
      roleArray = ["Admins"];
      canUseGiveToken = discordBot.canUseGiveToken(roleArray);
      expect(canUseGiveToken).to.be.true;
    });
    it("returns false if sender cannot", function() {
      roleArray = ["Blah"];
      canUseGiveToken = discordBot.canUseGiveToken(roleArray);
      expect(canUseGiveToken).to.be.false;
    });
  });
});
