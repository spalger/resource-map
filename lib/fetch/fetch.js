var Promise = require('bluebird')
var superagent = require('superagent')


function fetch(method, url) {
  return new Promise(function (resolve, reject) {
    var req = superagent(method, url);
    var start = Date.now();

    req
    .buffer(false)
    .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36')
    .on('error', reject)
    .on('response', function (res) {
      res.stats = {
        status: res.statusCode,
        method: method,
        url: url,
        ms: Date.now() - start,
        type: res.headers['content-type'],
        length: res.headers['content-legth'],
        encoding: res.headers['content-encoding'],
      }

      req.resp = res;
      resolve(req)
    })
    .end();
  })
}

module.exports = fetch;