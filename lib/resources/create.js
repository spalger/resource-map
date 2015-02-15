var parse = require('url').parse
var format = require('url').format
var tld = require('tld')

module.exports = function (referrerUrl) {
  var referrer = parse(referrerUrl || '', false, true)

  return function create(resource) {
    if (!resource) return

    if (typeof resource === 'string') {
      resource = {
        type: 'link',
        url: resource
      }
    }

    var source = parse(resource.url, false, true)

    var protocol = source.protocol || referrer.protocol;
    if (protocol !== 'https:' && protocol !== 'http:') {
      return;
    }

    var parts = {
      protocol: protocol,
      auth: source.auth || referrer.auth,
      hostname: source.hostname || referrer.hostname,
      port: source.port || referrer.port,
    }

    var hostUrl = format(parts)

    parts.pathname = 'robots.txt'
    var botsFileUrl = format(parts)

    parts.pathname = source.pathname || '/'
    parts.search = source.search
    var url = format(parts)

    return {
      type: resource.type,

      url: url,
      referrer: referrerUrl,

      host: hostUrl,
      hostname: parts.hostname,
      botsFile: botsFileUrl,
      protocol: parts.protocol,
      domain: tld.registered(parts.hostname)
    }
  }
}