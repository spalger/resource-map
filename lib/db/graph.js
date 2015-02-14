var levelup = require('levelup')

module.exports = require('levelgraph')(levelup('resources', {
  db: require('redisdown'),
  redis: require('../redis')()
}))
