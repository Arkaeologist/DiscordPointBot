'use strict';
const expect = require('chai').expect;
const bot = require('../bot');

describe('Auth Detail Loader', function() {
  it('loads the log in token from the environment', function() {
    expect(bot.token).to.exist;
  });
});
