const { spawn, execSync } = require('child_process')

const REG_TIME_LOG = /in\s+([0-9\.]+)s\.?\n$/

exports.log = function(...args) {
  console.log(...args)
}

exports.runScript = function(command, { useLogTime = true } = {}) {
  console.log(`Running command: "${command}"`)
  const args = command.split(' ')
  const cmd = args.shift()
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const childProcess = spawn(cmd, args)
    let innerTime = 0

    childProcess.stdout.on('data', (data) => {
      const log = data.toString()
      console.log(log)
      const matches = log.match(REG_TIME_LOG)
      if (matches && matches[1]) {
        innerTime = +(matches[1])
      }
    })
    childProcess.stderr.on('data', (data) => {
      console.log(data.toString())
    })

    childProcess.on('close', (code) => {
      resolve(innerTime)
      //resolve(Date.now() - start)
    })
  })
}

exports.scenarios = {
  NNN: 'cache ✗ lock ✗ node_modules ✗',
  YYY: 'cache ✓ lock ✓ node_modules ✓',
  YNY: 'cache ✓ lock ✗ node_modules ✓',
  NYY: 'cache ✗ lock ✓ node_modules ✓',
  NNY: 'cache ✗ lock ✗ node_modules ✓',
  YYN: 'cache ✓ lock ✓ node_modules ✗',
  YNN: 'cache ✓ lock ✗ node_modules ✗',
  NYN: 'cache ✗ lock ✓ node_modules ✗',
}

exports.registry = require('./package.json').perfConfig.registry || 'https://registry.npmjs.org'

exports.npmVersion = execSync('npm -v').toString().replace(/\n/, '')

exports.yarnVersion = execSync('yarn -v').toString().replace(/\n/, '')