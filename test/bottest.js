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
      var goodCommandArg = "!help";
      var badCommandArg = "!blah";
      var goodCommand = discordBot.parseMessage(goodCommandArg);
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(goodCommand[0]).to.equal("!help");
      expect(badCommand).to.be.false;
    });
    it("allows for !giveToken with 2 arguments", function() {
      var goodCommandArg = "!giveToken 5 <@140740133648465920>";
      var goodCommand = discordBot.parseMessage(goodCommandArg);
      expect(goodCommand).to.deep.equal(["!giveToken", 5, "<@140740133648465920>"]);
    });
    it("allows for !giveToken with 1 arguments", function() {
      var goodCommandArg = "!giveToken <@140740133648465920>";
      var goodCommand = discordBot.parseMessage(goodCommandArg);
      expect(goodCommand).to.deep.equal(["!giveToken", "<@140740133648465920>"]);
    });
    it("does not allow partial tokens", function() {
      var badCommandArg = "!giveToken 1.772 <@140740133648465920>";
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(badCommand).to.be.false;
    });
    it("does not allow non number tokens", function() {
      var badCommandArg = "!giveToken blah <@140740133648465920>";
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(badCommand).to.be.false;
    });
    it("allows a maximum of two arguments for !giveToken", function() {
      var badCommandArg = "!giveToken 2 <@140740133648465920> blah";
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(badCommand).to.be.deep.equal(["!giveToken", 2, "<@140740133648465920>"]);
    });
    it("allows a maximum of one argument for !listToken", function() {
      var badCommandArg = "!listToken <@140740133648465920> blah";
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(badCommand).to.be.false;
    });
    it("does not allow arguments for !help", function() {
      var badCommandArg = "!help blah";
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(badCommand).to.be.false;
    });
  });
  describe("Give Token Permission Checker", function() {
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
  describe("User List Builder", function() {
    it("builds a list of admins", function() {

    });
  });
});
