// installed globally
require('colors')
const { runScript, log, scenarios, registry } = require('./utils')

exports.removeCache = function() {
  log('┏━━ Npm: cleaning cache...'.red)
  return runScript('npm cache clean -f')
    .then(() => {
      log('┗━━ Npm: cleaning cache Done'.red)
    })
}

exports.removeLockFile = function() {
  log('┏━━ Npm: removing lock file...'.red)
  return runScript('rm -rf package-lock.json')
    .then(() => {
      log('┗━━ Npm: removing lock file Done'.red)
    })
}

exports.removeNodeModules = function() {
  log('┏━━ Npm: removing node_modules...'.red)
  return runScript('rm -rf node_modules')
    .then(() => {
      log('┗━━ Npm: removing node_modules Done'.red)
    })
}

exports.install = function() {
  log('┏━━ Npm: installing...'.red)
  return runScript(`npm install --registry ${registry}`)
    .then((costTime) => {
      log('┗━━ Npm: installing Done'.red)
      return costTime
    })
}

exports.firstInstall = function() {
  log('┏━━━━━━━━━ Npm: first installing...'.green)
  return Promise.resolve()
    .then(exports.removeCache)
    .then(exports.removeLockFile)
    .then(exports.removeNodeModules)
    .then(exports.install)
    .then((costTime) => {
      log('┗━━━━━━━━━ Npm: first installing DONE'.green)
      return costTime
    })
}

exports.installWithCacheWithLockWithNodeModules = function () {
  log(`┏━━━━━━━━━ Npm: installing [${scenarios.YYY}]...`.green)
  return Promise.resolve()
    .then(exports.install)
    .then((costTime) => {
      log(`┗━━━━━━━━━ Npm: installing [${scenarios.YYY}] DONE`.green)
      return costTime
    })
}

exports.installWithCacheWithoutLockWithNodeModules = function (params) {
  log(`┏━━━━━━━━━ Npm: installing [${scenarios.YNY}]...`.green)
  return Promise.resolve()
    .then(exports.removeLockFile)
    .then(exports.install)
    .then((costTime) => {
      log(`┗━━━━━━━━━ Npm: installing [${scenarios.YNY}] DONE`.green)
      return costTime
    })
}

exports.installWithoutCacheWithLockWithNodeModules = function (params) {
  log(`┏━━━━━━━━━ Npm: installing [${scenarios.NYY}]...`.green)
  return Promise.resolve()
    .then(exports.removeCache)
    .then(exports.install)
    .then((costTime) => {
      log(`┗━━━━━━━━━ Npm: installing [${scenarios.NYY}] DONE`.green)
      return costTime
    })
}

exports.installWithoutCacheWithoutLockWithNodeModules = function (params) {
  log(`┏━━━━━━━━━ Npm: installing [${scenarios.NNY}]...`.green)
  return Promise.resolve()
    .then(exports.removeCache)
    .then(exports.removeLockFile)
    .then(exports.install)
    .then((costTime) => {
      log(`┗━━━━━━━━━ Npm: installing [${scenarios.NNY}] DONE`.green)
      return costTime
    })
}

exports.installWithCacheWithLockWithoutNodeModules = function (params) {
  log(`┏━━━━━━━━━ Npm: installing [${scenarios.YYN}]...`.green)
  return Promise.resolve()
    .then(exports.removeNodeModules)
    .then(exports.install)
    .then((costTime) => {
      log(`┗━━━━━━━━━ Npm: installing [${scenarios.YYN}] DONE`.green)
      return costTime
    })
}

exports.installWithCacheWithoutLockWithoutNodeModules = function (params) {
  log(`┏━━━━━━━━━ Npm: installing [${scenarios.YNN}]...`.green)
  return Promise.resolve()
    .then(exports.removeLockFile)
    .then(exports.removeNodeModules)
    .then(exports.install)
    .then((costTime) => {
      log(`┗━━━━━━━━━ Npm: installing [${scenarios.YNN}] DONE`.green)
      return costTime
    })
}

exports.installWithoutCacheWithLockWithoutNodeModules = function (params) {
  log(`┏━━━━━━━━━ Npm: installing [${scenarios.NYN}]...`.green)
  return Promise.resolve()
    .then(exports.removeCache)
    .then(exports.removeNodeModules)
    .then(exports.install)
    .then((costTime) => {
      log(`┗━━━━━━━━━ Npm: installing [${scenarios.NYN}] DONE`.green)
      return costTime
    })
}

exports.runTasks = function() {
    const timeResults = []
    return [
      exports.firstInstall,
      exports.installWithCacheWithLockWithNodeModules,
      exports.installWithCacheWithoutLockWithNodeModules,
      exports.installWithoutCacheWithLockWithNodeModules,
      exports.installWithoutCacheWithoutLockWithNodeModules,
      exports.installWithCacheWithLockWithoutNodeModules,
      exports.installWithCacheWithoutLockWithoutNodeModules,
      exports.installWithoutCacheWithLockWithoutNodeModules,
    ].reduce((previousPromise, task, index) => {
      return previousPromise.then(task)
        .then((costTime) => {
          timeResults.push(costTime)
        })
    }, Promise.resolve())
    .then(() => {
      return timeResults
    })
}