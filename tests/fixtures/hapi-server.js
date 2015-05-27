var Hapi = require('hapi');
var injectThen = require('inject-then');
var bluebird = require('bluebird');
var hapiFaker = require('../../');

exports.server = function() {
  return new bluebird.Promise(function(resolve, reject) {
    var server = new Hapi.Server();
    server.connection();

    server.register(injectThen, function(err) {
      if (err)
        return reject(err);

      resolve(server);
    });
  });
};

exports.faker = function(options) {
  return new bluebird.Promise(function(resolve, reject) {
    var server = new Hapi.Server();
    server.connection();

    server.register([{
      register: injectThen
    }, {
      register: hapiFaker,
      options: options
    }], function(err) {
      if (err)
        return reject(err);

      resolve(server);
    });
  });
};
