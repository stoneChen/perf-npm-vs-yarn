const { runScript, log, scenarios, registry } = require('./utils')

exports.removeCache = function() {
  log('┏━━ Yarn: cleaning cache...'.cyan)
  return runScript('yarn cache clean')
    .then(() => {
      log('┗━━ Yarn: cleaning cache Done'.cyan)
    })
}

exports.removeLockFile = function() {
  log('┏━━ Yarn: removing lock file...'.cyan)
  return runScript('rm -rf yarn.lock')
    .then(() => {
      log('┗━━ Yarn: removing lock file Done'.cyan)
    })
}

exports.removeNodeModules = function() {
  log('┏━━ Yarn: removing node_modules...'.cyan)
  return runScript('rm -rf node_modules')
    .then(() => {
      log('┗━━ Yarn: removing node_modules Done'.cyan)
    })
}

exports.install = function() {
  log('┏━━ Yarn: installing...'.cyan)
  return runScript(`yarn --registry ${registry}`)
    .then((costTime) => {
      log('┗━━ Yarn: installing Done'.cyan)
      return costTime
    })
}

exports.firstInstall = function() {
  log('┏━━━━━━━━━ Yarn: first installing...'.green)
  return Promise.resolve()
    .then(exports.removeCache)
    .then(exports.removeLockFile)
    .then(exports.removeNodeModules)
    .then(exports.install)
    .then((costTime) => {
      log('┗━━━━━━━━━ Yarn: first installing DONE'.green)
      return costTime
    })
}

exports.installWithCacheWithLockWithNodeModules = function () {
  log(`┏━━━━━━━━━ Yarn: installing [${scenarios.YYY}]...`.green)
  return Promise.resolve()
    .then(exports.install)
    .then((costTime) => {
      log(`┗━━━━━━━━━ Yarn: installing [${scenarios.YYY}] DONE`.green)
      return costTime
    })
}

exports.installWithCacheWithoutLockWithNodeModules = function (params) {
  log(`┏━━━━━━━━━ Yarn: installing [${scenarios.YNY}]...`.green)
  return Promise.resolve()
    .then(exports.removeLockFile)
    .then(exports.install)
    .then((costTime) => {
      log(`┗━━━━━━━━━ Yarn: installing [${scenarios.YNY}] DONE`.green)
      return costTime
    })
}

exports.installWithoutCacheWithLockWithNodeModules = function (params) {
  log(`┏━━━━━━━━━ Yarn: installing [${scenarios.NYY}]...`.green)
  return Promise.resolve()
    .then(exports.removeCache)
    .then(exports.install)
    .then((costTime) => {
      log(`┗━━━━━━━━━ Yarn: installing [${scenarios.NYY}] DONE`.green)
      return costTime
    })
}

exports.installWithoutCacheWithoutLockWithNodeModules = function (params) {
  log(`┏━━━━━━━━━ Yarn: installing [${scenarios.NNY}]...`.green)
  return Promise.resolve()
    .then(exports.removeCache)
    .then(exports.removeLockFile)
    .then(exports.install)
    .then((costTime) => {
      log(`┗━━━━━━━━━ Yarn: installing [${scenarios.NNY}] DONE`.green)
      return costTime
    })
}

exports.installWithCacheWithLockWithoutNodeModules = function (params) {
  log(`┏━━━━━━━━━ Yarn: installing [${scenarios.YYN}]...`.green)
  return Promise.resolve()
    .then(exports.removeNodeModules)
    .then(exports.install)
    .then((costTime) => {
      log(`┗━━━━━━━━━ Yarn: installing [${scenarios.YYN}] DONE`.green)
      return costTime
    })
}

exports.installWithCacheWithoutLockWithoutNodeModules = function (params) {
  log(`┏━━━━━━━━━ Yarn: installing [${scenarios.YNN}]...`.green)
  return Promise.resolve()
    .then(exports.removeLockFile)
    .then(exports.removeNodeModules)
    .then(exports.install)
    .then((costTime) => {
      log(`┗━━━━━━━━━ Yarn: installing [${scenarios.YNN}] DONE`.green)
      return costTime
    })
}

exports.installWithoutCacheWithLockWithoutNodeModules = function (params) {
  log(`┏━━━━━━━━━ Yarn: installing [${scenarios.NYN}]...`.green)
  return Promise.resolve()
    .then(exports.removeCache)
    .then(exports.removeNodeModules)
    .then(exports.install)
    .then((costTime) => {
      log(`┗━━━━━━━━━ Yarn: installing [${scenarios.NYN}] DONE`.green)
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