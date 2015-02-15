var bunyan = require('bunyan');

var patterns = [];
(process.env.RM_DEBUG || '')
.split(',')
.map(function (str) {
  if (!str) return;

  if (str.indexOf('*') > -1) {
    str = str.replace(/\*/g, '.*')
  }

  patterns.push(new RegExp('^' + str + '$'));
});

module.exports = function (name) {
  var debugging = patterns.some(function (pattern) {
    return pattern.test(name)
  })

  return bunyan.createLogger({
    name: name,
    level: debugging ? 'debug' : 'info'
  });
}