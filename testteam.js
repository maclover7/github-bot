process.env.GITHUB_TOKEN = 'bb7c92391b7a3415cf5fc5a4bd97022ec6722f89'

const script = require('./scripts/node-subsystem-team.js')
script({ logger: { debug: console.log }, prId: '21238' }, 'nodejs', 'node')
