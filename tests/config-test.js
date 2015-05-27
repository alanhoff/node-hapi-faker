var hapiFaker = require('../');
var hapi = require('./fixtures/hapi-server');
var expect = require('chai').expect;
var server = null;

describe('General configuration tests', function() {

  beforeEach(function() {
    return hapi
      .server()
      .then(function(inst) {
        server = inst;
      });
  });

  describe('Configure as a plugin test', function() {

    it('Should callback with an error if missconfigured', function(done){
      server.register({
        register: hapiFaker,
        options: {
          willThrow: true
        }
      }, function(err){
        expect(err).to.be.an.instanceof(Error);
        done();
      });
    });

    it('Should allow correct config', function(done){
      server.register({
        register: hapiFaker,
        options: {
          schemas: [
            {id: 'test', type: 'string'}
          ],
          hooks: {
            request: function(){}
          },
          jfs: function(){}
        }
      }, function(err){
        expect(err).to.not.exist;
        done();
      });
    });

  });
});
