var redis = require('redis')

module.exports = function () {
  return redis.createClient()
}