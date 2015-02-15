var read = require('../robots.txt/checker').read;

module.exports = function (resource) {
  return read(resource.botsFile).then(function (checker) {
    return checker(resource.url)
  });
}