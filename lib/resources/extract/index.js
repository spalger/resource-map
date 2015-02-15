var _ = require('lodash')
var htmlparser = require('htmlparser2')
var Promise = require('bluebird')

var handlers = require('./handlers')
var creator = require('../create')

module.exports = function (job, url, htmlStream) {
  return new Promise(function (resolve, reject) {
    var urls = {}
    var resources = []
    var create = creator(url)

    var parser = new htmlparser.Parser(
      {
        onerror: reject,
        onopentag: function (name, attr) {
          var handler = handlers[name]
          if (!handler) return

          var resource = create(handler(attr));
          if (!resource) return

          urls[resource.url] = true
          resources.push(resource)
        },
        onend: function () {
          job.info('parsing complete – found %d resources', resources.length);
          resolve(resources)
        }
      },
      {
        decodeEntities: true,
        lowerCaseTags: true
      }
    )

    htmlStream.on('data', _.bindKey(parser, 'write'))
    htmlStream.on('end', _.bindKey(parser, 'end'))
  })
}