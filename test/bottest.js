var expect = require("chai").expect;
var bot = require("../bot");

describe("Bot Authenticator", function() {
  it("requests to log in to Discord servers", function() {
    var loginRequested = bot.bot.loginWithToken(bot.loadAuthDetails("loginToken"));
    expect(loginRequested).to.be.empty;
  });
});
