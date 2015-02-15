var redis = require('redis')

module.exports = function () {
  if (process.env.redisUrl) {
    return redis.createClient()
  }
}