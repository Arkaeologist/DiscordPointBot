var expect = require("chai").expect;
var discordBot = require("../discordbot");
var Discord = require('discord.js');
var jsonfile = require('jsonfile');
var pointsFile = '../points.json';

describe("Discord Point Bot", function(){
  describe("#parseMessage()", function(){
    it("only accepts commands from array of commands", function() {
      var goodCommandArg = "!help";
      var badCommandArg = "!blah";
      var goodCommand = discordBot.parseMessage(goodCommandArg);
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(goodCommand[0]).to.equal("!help");
      expect(badCommand).to.be.false;
    });
    it("allows for !givePoint with numerical arguments", function() {
      var goodCommandArg = "!givePoint 5 <@140740133648465920>";
      var goodCommand = discordBot.parseMessage(goodCommandArg);
      expect(goodCommand).to.deep.equal(["!givePoint", 5]);
    });
    it("allows for !givePoint with no arguments", function() {
      var goodCommandArg = "!givePoint <@140740133648465920>";
      var goodCommand = discordBot.parseMessage(goodCommandArg);
      expect(goodCommand).to.deep.equal(["!givePoint"]);
    });
    it("does not allow partial points", function() {
      var badCommandArg = "!givePoint 1.772 <@140740133648465920>";
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(badCommand).to.deep.equal(["!givePoint"]);
    });
    it("only accepts numerical arguments for !givePoint", function() {
      var badCommandArg = "!givePoint 2 <@140740133648465920> blah";
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(badCommand).to.deep.equal(["!givePoint", 2]);
    });
    it("does not accept arguments for !listPoint", function() {
      var badCommandArg = "!listPoint 5 <@140740133648465920> blah";
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(badCommand).to.deep.equal(["!listPoint"]);
    });
    it("does not accept arguments for !help", function() {
      var badCommandArg = "!help blah";
      var badCommand = discordBot.parseMessage(badCommandArg);
      expect(badCommand).to.deep.equal(["!help"]);
    });
  });
  describe("#canUseGivePoint()", function() {
    it("checks if the sender can give points", function() {
      roleArray = ['Admins', 'blah'];
      canUseGivePoint = discordBot.canUseGivePoint(roleArray);
      expect(canUseGivePoint).to.be.true;
    });
    it("returns false if sender cannot", function() {
      roleArray = ['Blah'];
      canUseGivePoint = discordBot.canUseGivePoint(roleArray);
      expect(canUseGivePoint).to.be.false;
    });
  });
  describe("#givePoint()", function() {
    it.skip("adds points to a user", function() {
      var pointsArray = ['!givePoint', 5, 7];
      var mentionsArray = ['109134866209095680', '140740133648465920'];
      discordBot.givePoint(msg.server, msg.channel, msg.mentions, parsedMessage);
    });
  });
  describe('#parseMultiWordMsg()', function() {
    it('returns correctly parsed content', function() {
      var pointsArray = ['!givePoint', 5, '@user#1234'];
      var parsedArray = discordBot.parseMultiWordMsg(pointsArray);
      var expectedParsedArray = ['!givePoint', 5];
      expect(parsedArray).to.deep.equal(expectedParsedArray);
    });
  });
  describe("#listPoint()", function() {
    it("lists points of mentioned users", function() {

    });
  });
  describe("#updateServers()", function() {
    it("adds new servers to points file", function() {

    });
    it("adds new users to points file", function() {

    });
  });
});
