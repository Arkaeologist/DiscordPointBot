var expect = require("chai").expect;
var User = require("../user.js").User;

describe('User', function() {
  var newUser = new User('username');
  describe('.points', function() {
    it('starts as 0', function() {
      expect(newUser.points).to.deep.equal(0);
    });
  });
  describe('.name', function() {
    it('starts as first argument', function() {
      expect(newUser.name).to.deep.equal('username');
    });
  });
});
