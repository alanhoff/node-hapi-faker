# Hapi Faker 
[![Coverage Status](https://coveralls.io/repos/alanhoff/node-hapi-faker/badge.svg?branch=master)][2]
[![Travis](https://travis-ci.org/alanhoff/node-hapi-faker.svg)][1]

Hapi Faker helps you to create fake data to easily mock or test API endpoints.

### Installation

Install this module with the command `npm install --save hapi-faker`, after that
you are ready to register this module as a Hapi.js plugin.

```javascript
var Hapi = require('hapi');
var hapiFaker = require('hapi-faker');
var server = new Hapi.Server();

server.register({
  register: hapiFaker,
  options: {...} // See the options documentation above
}, function(err){
  if(err)
    throw err;

  console.log('Ready to go!');
});
```

### Usage

First of all, we need to add some schemas when registering Hapi Faker

```javascript
var schema = {
  id: 'fake-email',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      faker: 'internet.email'
    }
  },
  required: ['email']
};


server.register({
  register: hapiFaker,
  options: {
    schemas: [schema]
  }
});
```

After this you are ready to go. Also, you don't need to provide your schema at
register time, with every method you can pass a full schema instead of your
schema's ID.

##### As a plugin

To use Hapi Faker as a plugin, you just need to configure it in your route,
passing a string containing the schema's ID or a full schema.

```javascript
server.route({
  method: 'GET',
  path: '/fake/data',
  handler: function(request, reply){
    // This won't be triggered unless you hook this request
    // and disable Hapi Faker, to do so please read the options documentation
    reply({hello: 'world'});
  },
  config: {
    plugins: {
      faker: 'fake-email' // or a full JSF schema
    }
  }
});
```

##### As a handler

Passing `faker` as the handler will also work.

```javascript
server.route({
  method: 'GET',
  path: '/fake/data',
  handler: {
    faker: 'fake-email' // or a full JSF schema
  }
});
```

##### As a `reply` method

For convenience, you can also call `faker` as a reply method

```javascript
server.route({
  method: 'GET',
  path: '/fake/data',
  handler: function(request, reply){
    if(Math.random() < 0.5)
      return reply.faker('fake-email'); // or a full JSF schema

    reply('Not a fake data, this one is real.');
  }
});
```

### Options

The `options` key when you register this plugin with Hapi, have the following
signature:

* `schemas` an array containing schemas compatibles with [JSON Schema Faker][0].
* `hooks` an object used to hook internal functions.
  * `request` a function that receives `request` and `reply`, to disable fake
  data on this request, you must return a `false` value. You can also return a
  promise that will resolve to a boolean value.
* `jsf` your own [JSON Schema Faker][0] instance. 

### Testing

```bash
git clone https://github.com/alanhoff/node-hapi-faker
cd node-hapi-faker && npm install
npm test
```

### Todo

- [ ] Add inline documentation
- [ ] Allow context reference (payload, params, headers, query)
- [ ] Add documentation about hooks

### License

Copyright (c) 2015, Alan Hoffmeister <alanhoffmeister@gmail.com>

Permission to use, copy, modify, and distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

[0]: https://github.com/pateketrueke/json-schema-faker
[1]: https://travis-ci.org/alanhoff/node-hapi-faker
[2]: https://coveralls.io/r/alanhoff/node-hapi-faker?branch=master
