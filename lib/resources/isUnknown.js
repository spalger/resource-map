var db = require('../db')
var Promise = require('bluebird')

var notFound = 'NotFoundError';

module.exports = function (resource) {
  return new Promise(function (resolve, reject) {
    db.get(resource.url, function (err) {
      if (!err) resolve(false)
      else if (err.type === notFound) resolve(resource)
      else reject(err)
    })
  })
}