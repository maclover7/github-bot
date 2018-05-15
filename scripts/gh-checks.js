const triggerBuild = require('../lib/build-jenkins-job')
const request = require('request')
const jwt = require('jsonwebtoken')

var key = require('fs').readFileSync(`checkstesterapp.2018-05-09.private-key.pem`).toString()

module.exports = function (app) {
  app.on('check_suite.requested', function (event, user, repo) {
    var options = {
      repo: 'node',
      number: '20641',
      logger: event.logger
    }

    triggerBuild(options, (url) => {
      url2 = url;
      var now = Math.floor(Date.now() / 1000)
      var jwtKey = jwt.sign(
        {
          iat: now,
          exp: now + (10 * 60),
          iss: '12005'
        },
        key,
        { algorithm: 'RS256' }
      )

      request({
        uri: `https://api.github.com/installations/${event.installation.id}/access_tokens`,
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.machine-man-preview+json',
          'Authorization': `Bearer ${jwtKey}`,
          'User-Agent': 'github-bot',
          'Content-Type': 'application/json'
        },
      },
      (err, res, tokenBody) => {
        var { token } = JSON.parse(tokenBody)
        var checkRunPayload = {
          name: 'node-test-pull-request',
          details_url: url2,
          head_branch: event.check_suite.head_branch,
          head_sha: event.check_suite.head_sha,
          status: 'in_progress',
          output: {
            title: 'node-test-pull-request',
            summary: url2
          }
        }

        request({
          uri: 'https://api.github.com/repos/maclover7/nodechecks/check-runs',
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github.machine-man-preview+json,application/vnd.github.antiope-preview+json',
            'Authorization': `token ${token}`,
            'User-Agent': 'github-bot'
          },
          body: JSON.stringify(checkRunPayload)
        }, (err, res, body) => {
          console.log(body);
        })
      })
    })
  })
}
