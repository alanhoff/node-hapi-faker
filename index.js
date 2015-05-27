var pkg = require('./package.json');
var HapiFaker = require('./lib/hapi-faker');

exports.register = function(server, options, next) {

  try {
    var hf = new HapiFaker(options);
    hf.attach(server);
  } catch (err) {
    return next(err);
  }

  next();
};

exports.register.attributes = {
  name: 'faker',
  version: pkg.version
};
