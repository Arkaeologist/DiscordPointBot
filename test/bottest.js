var expect = require("chai").expect;
var pointBot = require("../discordbot.js");
var Discord = require('discord.js');
var jsonfile = require('jsonfile');
var pointsFile = '../points.json';

describe("Discord Point Bot", function(){
  describe("#canUseGivePoint()", function() {
    it("checks if the sender can give points", function() {
      roleArray = ['Admins', 'blah'];
      canUseGivePoint = pointBot.canUseGivePoint(roleArray);
      expect(canUseGivePoint).to.deep.equal(true);
    });
    it("returns false if sender cannot", function() {
      roleArray = ['Blah'];
      canUseGivePoint = pointBot.canUseGivePoint(roleArray);
      expect(canUseGivePoint).to.deep.equal(false);
    });
  });
  describe("#updateServers()", function() {
    it.skip("adds new servers to points file", function() {

    });
    it.skip("adds new users to points file", function() {

    });
  });
  describe('#on()', function() {
    it.skip('calls updateServers on serverMemberUpdated', function() {

    });
  });
});
