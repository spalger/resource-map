var read = require('../botFile').read;

module.exports = function (resource) {
  return read(resource.botsFile).then(function (checker) {
    return checker(resource.url)
  });
}