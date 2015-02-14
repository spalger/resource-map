var levelup = require('levelup')

module.exports = levelup('resources', {
  db: require('redisdown'),
  redis: require('../redis')()
})