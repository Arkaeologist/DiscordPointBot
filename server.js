'use strict';
// Server class for use in storing User
class Server {
  constructor(servername) {
    this.users = {};
    this.name = servername;
  }
}

exports.Server = Server;
