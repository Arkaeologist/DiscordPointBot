// Server class for use in storing User
Server = function(servername) {
  // Map Users to id values
  this.users = {};
  this.name = servername;
};

exports.Server = Server;
