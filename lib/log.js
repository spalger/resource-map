var bunyan = require('bunyan');

var patterns = [];
(process.env.DEBUG || '')
.split(',')
.map(function (str) {
  if (!str) return;

  if (str.indexOf('*') > -1) {
    str = str.replace(/\*/g, '.*')
  }

  patterns.push(new RegExp('^' + str + '$'));
});

module.exports = function (name) {
  var log = bunyan.createLogger({ name: name });

  var debug = patterns.some(function (pattern) {
    return pattern.test(name)
  })

  log.level(debug ? 'debug' : 'info')
  return log;
}