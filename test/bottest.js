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
    it("allows for !givePoint with 2 arguments", function() {
      var goodCommandArg = "!givePoint 5 <@140740133648465920>";
      var goodCommand = discordBot.parseMessage(goodCommandArg);
      console.log(goodCommand);
      expect(goodCommand).to.deep.equal(["!givePoint", 5]);
    });
    it("allows for !givePoint with 1 arguments", function() {
      var goodCommandArg = "!givePoint <@140740133648465920>";
      var goodCommand = discordBot.parseMessage(goodCommandArg);
      expect(goodCommand).to.deep.equal(["!givePoint"]);
    });
    it("does not allow partial points", function() {
      var badCommandArg = "!givePoint 1.772 <@140740133648465920>";
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(badCommand).to.deep.equal(["!givePoint"]);
    });
    it("does not allow non number points", function() {
      var badCommandArg = "!givePoint blah <@140740133648465920>";
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(badCommand).to.deep.equal(["!givePoint"]);
    });
    it("allows a maximum of two arguments for !givePoint", function() {
      var badCommandArg = "!givePoint 2 <@140740133648465920> blah";
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(badCommand).to.deep.equal(["!givePoint", 2]);
    });
    it("allows a maximum of one argument for !listPoint", function() {
      var badCommandArg = "!listPoint <@140740133648465920> blah";
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(badCommand).to.deep.equal(["!listPoint"]);
    });
    it("does not allow arguments for !help", function() {
      var badCommandArg = "!help blah";
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(badCommand).to.deep.equal(["!help"]);
    });
  });
  describe("Give Point Permission Checker", function() {
    it("checks if the sender can give points", function() {
      roleArray = ["Admins"];
      canUseGivePoint = discordBot.canUseGivePoint(roleArray);
      expect(canUseGivePoint).to.be.true;
    });
    it("returns false if sender cannot", function() {
      roleArray = ["Blah"];
      canUseGivePoint = discordBot.canUseGivePoint(roleArray);
      expect(canUseGivePoint).to.be.false;
    });
  });
  describe("User List Builder", function() {
    it("builds a list of admins", function() {

    });
  });
});
