var jobs = require('./lib/jobs');

jobs.loadPage({
  url: 'http://spenceralger.com'
});

require('./worker');