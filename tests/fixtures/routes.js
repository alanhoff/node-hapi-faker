exports.plugin = {
  method: 'GET',
  path: '/faker',
  handler: function(request, reply) {
    reply({
      shouldnot: 'exists'
    });
  },
  config: {
    plugins: {
      faker: 'hello-world'
    }
  }
};

exports.clean = {
  method: 'GET',
  path: '/faker',
  handler: function(request, reply) {
    reply({
      should: 'exists'
    });
  }
};

exports.handler = {
  method: 'GET',
  path: '/faker',
  handler: {
    faker: 'hello-world'
  }
};

exports.function = {
  method: 'GET',
  path: '/faker',
  handler: function(request, reply){
    reply.faker('hello-world');
  }
};
