var jfs = require('json-schema-faker');
var mout = require('mout');
var Joi = require('joi');
var bluebird = require('bluebird');

var HapiFaker = function(options) {
  if (!(this instanceof HapiFaker))
    return new HapiFaker(options);

  var result = Joi.validate(options, Joi.object({
    schemas: Joi.array().items(Joi.object({
      id: Joi.string().required(),
      type: Joi.string().required()
    }).unknown(true)).optional().default([]),
    attachAt: Joi.string().only(['onRequest', 'onPreAuth', 'onPostAuth',
      'onPreHandler', 'onPostHandler', 'onPreResponse'
    ]).default('onPostAuth'),
    hooks: Joi.object({
      request: Joi.func().optional()
    }).optional().default({}),
    jfs: Joi.func().optional().default(undefined)
  }).optional().default({}));

  if (result.error)
    throw result.error;

  this._options = mout.lang.deepClone(result.value);

  if (!this._options.jfs)
    this._options.jfs = jfs;
};

HapiFaker.prototype.attach = function(server) {
  this._server = server;

  // Capture requests to do the default job
  server.ext(this._options.attachAt, this._hook, {
    bind: this
  });

  // Add a new handler in case the user want's to
  server.handler('faker', this._handler.bind(this));

  // Add a new method in the reply interface
  server.decorate('reply', 'faker', this._decorator(this));

  // Expose our options server wide
  server.expose('options', mout.lang.deepClone(this._options));

};

HapiFaker.prototype._hook = function(request, reply) {
  var settings = request.route.settings.plugins;
  var that = this;

  // If this route isn't configured for faker, just ignore
  if (!settings || !settings.faker)
    return reply.continue();

  var req = this._options.hooks.request;

  bluebird
    .resolve()
    .then(req ? req.bind(this, request, reply) : function() {
      return true;
    })
    .then(function(enable) {
      if (!enable)
        return reply.continue();

      return bluebird
        .resolve(that._genData(settings.faker))
        .then(function(data) {
          reply(data);
        });

    }).catch(function(err) {

      // Enable Hapi to handle our errors
      process.nextTick(function() {
        throw err;
      });

    });
};

HapiFaker.prototype._handler = function(route, options) {
  var that = this;

  return function(request, reply) {
    reply(that._genData(options));
  };

};

HapiFaker.prototype._decorator = function(ctx) {
  var that = ctx;

  return function(input) {
    this(that._genData(input));
  };

};

HapiFaker.prototype._genData = function(input) {
  var schema = null;

  if (typeof input === 'string')
    schema = this._options.schemas.filter(function(s) {
      return s.id === input;
    })[0];
  else
    schema = input;

  if (!schema)
    throw new Error('Unknown faker schema with ID ' + input);

  // Do not modify the original schema
  schema = mout.lang.deepClone(schema);

  return this._options.jfs(schema, this._options.schemas);
};

module.exports = HapiFaker;
