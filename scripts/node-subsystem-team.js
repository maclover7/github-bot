'use strict'

const { getFiles } = require('../lib/node-repo')

function requestTeams(files) {
}

module.exports = //function (app) {
  // app.on('pull_request.opened',
  function pingSubsystemTeams (event, owner, repo) {
    const { prId, logger } = event;

    // subsystem-team-pinging is for node core only
    if (repo !== 'node') return

    getFiles({ owner, repo, prId, logger, timeoutInSec: 2 }, requestTeams)
  }
//}
