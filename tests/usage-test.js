var hapi = require('./fixtures/hapi-server');
var schemas = require('./fixtures/schemas');
var routes = require('./fixtures/routes');
var expect = require('chai').expect;

describe('Usage tests', function() {

  describe('Default config usage', function() {

    it('Should work as a plugin', function() {

      return hapi.faker({
          schemas: [schemas.hello]
        })
        .then(function(server) {

          server.route(routes.plugin);

          return server;
        })
        .then(function(server) {
          return server.injectThen({
            method: 'GET',
            url: '/faker'
          }).then(function(res) {
            expect(res.result.shouldnot).to.be.equal(undefined);
            expect(res.result.hello).to.be.an('string');
          });
        });
    });

    it('Should not intercept other requests', function() {

      return hapi.faker({
          schemas: [schemas.hello]
        })
        .then(function(server) {

          server.route(routes.clean);

          return server;
        })
        .then(function(server) {
          return server.injectThen({
            method: 'GET',
            url: '/faker'
          }).then(function(res) {
            expect(res.result.should).to.be.equal('exists');
            expect(res.result.hello).to.be.equal(undefined);
          });
        });
    });

    it('Should hook when configured', function() {

      return hapi.faker({
          schemas: [schemas.hello],
          hooks: {
            request: function(){
              return false;
            }
          }
        })
        .then(function(server) {

          server.route(routes.plugin);

          return server;
        })
        .then(function(server) {
          return server.injectThen({
            method: 'GET',
            url: '/faker'
          }).then(function(res) {
            expect(res.result.hello).to.be.equal(undefined);
          });
        });
    });

    it('Should work as a handler', function() {

      return hapi.faker({
          schemas: [schemas.hello]
        })
        .then(function(server) {

          server.route(routes.handler);

          return server;
        })
        .then(function(server) {
          return server.injectThen({
            method: 'GET',
            url: '/faker'
          }).then(function(res) {
            expect(res.result.hello).to.be.an('string');
          });
        });
    });

    it('Should work as a function', function() {

      return hapi.faker({
          schemas: [schemas.hello]
        })
        .then(function(server) {

          server.route(routes.function);

          return server;
        })
        .then(function(server) {
          return server.injectThen({
            method: 'GET',
            url: '/faker'
          }).then(function(res) {
            expect(res.result.hello).to.be.an('string');
          });
        });
    });
  });

});
