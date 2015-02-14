var db = require('../db')
var Promise = require('bluebird')
var log = require('../log')('markSeen')

module.exports = function (resource) {
  return new Promise(function (resolve, reject) {
    db.put(resource.url, resource, function (err) {
      if (err) {
        log.debug('failed to mark %s as seen', resource.url, err.message)
        return reject(err)
      }

      log.debug('marked %s as seen', resource.url)
      resolve(resource);
    })
  })
}