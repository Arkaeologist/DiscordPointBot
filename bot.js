var authfile = require('./auth.json');

exports.loadAuthDetails = function(detailKey) {
  return authfile[detailKey];
};
