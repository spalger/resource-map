var _ = require('lodash');
var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;
var jsYaml = require('js-yaml');

module.exports = function (into, path) {
  // pick the config file path
  path = path || process.env.configPath || resolve(__dirname, '..', 'conf.yml')

  // read the doc
  var doc;
  try { doc = jsYaml.safeLoad(readFileSync(path, 'utf8')); }
  catch (e) {
    if (e.code === 'ENOENT') {
      console.error('unable to find config file at %s', path);
    } else {
      console.error(e.stack);
    }
    process.exit();
  }

  // resolve all templates and assign all values
  _.forOwn(doc, function (val, key) {
    into[key] = _.template(val)(into);
  });

  return into;
}