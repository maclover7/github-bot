'use strict'

const githubClient = require('../lib/github-client')
const botUsername = require('../lib/bot-username')
const triggerBuild = require('../lib/build-jenkins-job')

function ifBotWasMentionedInCiComment (commentBody, cb) {
  botUsername.resolve((err, username) => {
    if (err) {
      return cb(err)
    }

    const atBotName = new RegExp(`^@${username} run CI`, 'mi')
    const wasMentioned = commentBody.match(atBotName) !== null

    cb(null, wasMentioned)
  })
}

function createPrComment ({ owner, repo, number, logger }, body) {
  githubClient.issues.createComment({
    owner,
    repo,
    number,
    body
  }, (err) => {
    if (err) {
      logger.error(err, 'Error while creating comment to reply on CI run comment')
    }
  })
}

module.exports = (app) => {
  app.on('issue_comment.created', function handleCommentCreated (event, owner, repo) {
    const { number, logger, comment } = event
    const commentAuthor = comment.user.login
    const options = {
      owner,
      repo,
      number,
      logger
    }

    function replyToCollabWithBuildStarted (err, buildUrl) {
      if (err) {
        logger.error(err, 'Error while triggering Jenkins build')
        return createPrComment(options, `@${commentAuthor} sadly an error occured when I tried to trigger a build :(`)
      }

      createPrComment(options, `@${commentAuthor} build started: ${buildUrl}`)
      logger.info({ buildUrl }, 'Jenkins build started')
    }

    function triggerBuildWhenCollaborator (err) {
      if (err) {
        return logger.debug(`Ignoring comment to me by @${commentAuthor} because they are not a repo collaborator`)
      }

      triggerBuild(options, replyToCollabWithBuildStarted)
    }

    ifBotWasMentionedInCiComment(comment.body, (err, wasMentioned) => {
      if (err) {
        return logger.error(err, 'Error while checking if the bot username was mentioned in a comment')
      }

      if (!wasMentioned) return

      githubClient.repos.checkCollaborator({ owner, repo, username: commentAuthor }, triggerBuildWhenCollaborator)
    })
  })
}
