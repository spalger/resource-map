var _ = require('lodash');
var Promise = require('bluebird')
var request = require('superagent');

var UA = process.env.userAgentString

var agent = request.agent();
agent.onRedirect = function (req, res) {
  this.saveCookies(res);
  this.attachCookies(req);
}
_.bindAll(agent);

function ReqError(req, err) {
  this.message = 'REQUEST FAILURE – Request: ' + JSON.stringify(req.toJSON()) + ' Error: ' + err.message;
  this.stack = err.stack;
  this.req = req;
  this.err = err;
}

function fetch(logger, method, url) {
  return new Promise(function (resolve, reject) {
    var req = request(method, url);
    var start = Date.now();

    // setup the cookie jar
    agent.attachCookies(req);
    req.on('response', agent.saveCookies);
    req.on('redirect', _.partial(agent.onRedirect, req))

    // we want to stream the reqeust, so don't bugger
    req.buffer(false)

    // who dis is
    req.set('User-Agent', UA)

    // don't wait forever
    req.timeout(15000)

    // don't dance in circles
    req.redirects(5)

    // something's fucked
    req.on('error', function (err) {
      reject(new ReqError(req, err));
    })

    // now we're getting somewhere
    req.on('response', function (res) {
      var incoming = req.res;
      var redirects = res.redirects || [];

      incoming.res = {
        url: _.last(redirects) || req.url,
        method: req.method,
        status: res.status,

        ms: Date.now() - start,
        headers: res.headers || {},
        redirects: redirects,
        redirectCount: redirects.length,

        // superagent sugar
        ok: res.ok,
        info: res.info,
        statusType: res.statusType,

        error: res.error,
        clientError: res.clientError,
        serverError: res.serverError,

        accepted: res.accepted,
        notFound: res.notFound,
        noContent: res.noContent,
        forbidden: res.forbidden,
        badRequest: res.badRequest,
        unauthorized: res.unauthorized,
        notAcceptable: res.notAcceptable
      };

      logger.info(
        '%s request completed as %s with status %d',
        incoming.res.method,
        incoming.res.url,
        incoming.res.status
      );

      resolve(incoming);
    });

    req.end();
  })
}

module.exports = fetch;