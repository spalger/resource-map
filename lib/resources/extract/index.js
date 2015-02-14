var htmlparser = require('htmlparser2')
var Promise = require('bluebird')
var log = require('../../log')('extract')
var handlers = require('./handlers');

module.exports = function (htmlStream) {
  return new Promise(function (resolve, reject) {
    var resources = []

    var parser = new htmlparser.Parser(
      {
        onopentag: function (name, attr) {
          var handler = handlers[name]
          if (handler) {
            var count = resources.length
            handler(attr, resources)
            if (resources.length !== count) {
              log.debug('found open tag %s with attributes %j', name, attr)
            }
          }
        },
        onerror: reject,
        onend: function () {
          log.debug('done parsing doc, found %d resources', resources.length)
          resolve(resources)
        }
      },
      {
        decodeEntities: true,
        lowerCaseTags: true
      }
    )

    htmlStream.on('data', parser.write.bind(parser))
    htmlStream.on('end', parser.end.bind(parser))
  })
}