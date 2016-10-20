var expect = require("chai").expect;
var discordBot = require("../bot.js");
var Discord = require('discord.js');
var jsonfile = require('jsonfile');
var pointsFile = '../points.json';

describe("Discord Point Bot", function(){
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
