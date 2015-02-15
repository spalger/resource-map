var jobs = require('../lib/jobs')

// resource generator with no referer
var resource = require('../lib/resources/create')(null)

// master provides the web ui
jobs.startActivityServer()

// seed the job queue with a single resource
jobs.fetch(resource('http://spenceralger.com'))