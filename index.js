var cluster = require('cluster')
require('./lib/loadConfig')(process.env)

var master = cluster.isMaster
var redis = !!process.env.redisUrl

if (!master) {
  require('./worker');
  return;
}

require('./master')

if (redis) {
  require('./fork')
} else {
  require('./worker')
}