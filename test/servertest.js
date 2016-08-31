var expect = require("chai").expect;
var Server = require("../server.js").Server;

describe('Server', function() {
  var newServer = new Server('servername');
  describe('.users', function() {
    it('starts empty', function() {
      expect(newServer.users).to.deep.equal({});
    });
  });
  describe('.name', function() {
    it('starts as first argument', function() {
      expect(newServer.name).to.deep.equal('servername');
    });
  });
});
