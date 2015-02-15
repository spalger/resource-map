var levelup = require('levelup');
var redis = require('./redis')();

function create(name) {
  var config = {
    valueEncoding: 'json'
  };

  if (redis) {
    config.db = require('redisdown');
    config.redis = redis;
  } else {
    config.db = require('leveldown');
  }

  return levelup(name, config)
}


exports.meta = create('resource-meta');
exports.graph = require('levelgraph')(create('resource-graph'));