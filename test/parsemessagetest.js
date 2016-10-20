'use strict';
var parseMessage = require('../parsemessage.js').parseMessage;
var parseMultiWordMsg = require('../parsemessage.js').parseMultiWordMsg;
var expect = require("chai").expect;

describe("#parseMessage()", function(){
  it("only accepts commands from array of commands", function() {
    var goodCommandArg = "!help";
    var badCommandArg = "!blah";
    var goodCommand = parseMessage(goodCommandArg);
    var badCommand = parseMessage(badCommandArg);
    expect(goodCommand[0]).to.deep.equal("!help");
    expect(badCommand).to.deep.equal(false);
  });
  it("allows for !givePoint with numerical arguments", function() {
    var goodCommandArg = "!givePoint 5 <@140740133648465920>";
    var goodCommand = parseMessage(goodCommandArg);
    expect(goodCommand).to.deep.equal(["!givePoint", 5]);
  });
  it("allows for !givePoint with no arguments", function() {
    var goodCommandArg = "!givePoint <@140740133648465920>";
    var goodCommand = parseMessage(goodCommandArg);
    expect(goodCommand).to.deep.equal(["!givePoint"]);
  });
  it("does not allow partial points", function() {
    var badCommandArg = "!givePoint 1.772 <@140740133648465920>";
    var badCommand = parseMessage(badCommandArg);
    expect(badCommand).to.deep.equal(["!givePoint"]);
  });
  it("only accepts numerical arguments for !givePoint", function() {
    var badCommandArg = "!givePoint 2 <@140740133648465920> blah";
    var badCommand = parseMessage(badCommandArg);
    expect(badCommand).to.deep.equal(["!givePoint", 2]);
  });
  it("does not accept arguments for !listPoint", function() {
    var badCommandArg = "!listPoint 5 <@140740133648465920> blah";
    var badCommand = parseMessage(badCommandArg);
    expect(badCommand).to.deep.equal(["!listPoint"]);
  });
  it("does not accept arguments for !help", function() {
    var badCommandArg = "!help blah";
    var badCommand = parseMessage(badCommandArg);
    expect(badCommand).to.deep.equal(["!help"]);
  });
});
describe('#parseMultiWordMsg()', function() {
  it('returns correctly parsed content', function() {
    var pointsArray = ['!givePoint', 5, '@user#1234'];
    var parsedArray = parseMultiWordMsg(pointsArray);
    var expectedParsedArray = ['!givePoint', 5];
    expect(parsedArray).to.deep.equal(expectedParsedArray);
  });
});
