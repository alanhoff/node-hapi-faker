exports.hello = {
  id: 'hello-world',
  type: 'object',
  properties: {
    hello: {
      type: 'string',
      faker: 'internet.email'
    }
  },
  required: ['hello']
};
