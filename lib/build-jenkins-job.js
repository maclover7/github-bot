const request = require('request')

const jenkinsApiCredentials = process.env.JENKINS_API_CREDENTIALS || ''

// URL to the Jenkins job should be triggered for a given repository
function buildUrlForRepo (repo) {
  // e.g. JENKINS_JOB_URL_CITGM = https://ci.nodejs.org/job/citgm-continuous-integration-pipeline
  const jobUrl = process.env[`JENKINS_JOB_URL_${repo.toUpperCase()}`] || ''
  return jobUrl ? `${jobUrl}/build` : ''
}

// Authentication token configured per Jenkins job needed when triggering a build,
// this is set per job in Configure -> Build Triggers -> Trigger builds remotely
function buildTokenForRepo (repo) {
  // e.g. JENKINS_BUILD_TOKEN_CITGM
  return process.env[`JENKINS_BUILD_TOKEN_${repo.toUpperCase()}`] || ''
}

function triggerBuild (options, cb) {
  const { repo } = options
  const base64Credentials = new Buffer(jenkinsApiCredentials).toString('base64')
  const authorization = `Basic ${base64Credentials}`

  if (repo === 'citgm') {
    var buildParameters = [{
      name: 'GIT_REMOTE_REF',
      value: `refs/pull/${options.number}/head`
    }]
  } else if (repo === 'node') {
    var buildParameters = [
      {
        name: 'CERTIFY_SAFE',
        value: true
      },
      {
        name: 'TARGET_GITHUB_ORG',
        value: 'nodejs'
      },
      {
        name: 'TARGET_REPO_NAME',
        value: 'node'
      },
      {
        name: 'PR_ID',
        value: options.number
      },
      {
        name: 'POST_STATUS_TO_PR',
        value: true
      }
    ]
  }

  const payload = JSON.stringify({ parameter: buildParameters })
  const uri = buildUrlForRepo(repo)
  const buildAuthToken = buildTokenForRepo(repo)

  if (!uri) {
    return cb(new TypeError(`Will not trigger Jenkins build because $JENKINS_JOB_URL_${repo.toUpperCase()} is not set`))
  }

  if (!buildAuthToken) {
    return cb(new TypeError(`Will not trigger Jenkins build because $JENKINS_BUILD_TOKEN_${repo.toUpperCase()} is not set`))
  }

  options.logger.debug('Triggering Jenkins build')

  request.post({
    uri,
    headers: { authorization },
    qs: { token: buildAuthToken },
    form: { json: payload }
  }, (err, response) => {
    if (err) {
      return cb(err)
    } else if (response.statusCode !== 201) {
      console.log(response)
      return cb(new Error(`Expected 201 from Jenkins, got ${response.statusCode}`))
    }

    cb(null, response.headers.location)
  })
}

module.exports = triggerBuild
