const os = require('os')

require('colors')
const Table = require('cli-table')
const npm = require('./npm')
const yarn = require('./yarn')
const { scenarios, npmVersion, yarnVersion } = require('./utils')

const totalStart = Date.now()

const scenarioArray = Object.keys(scenarios).map((key) => {
  return scenarios[key]
})
const totalTimeResults = []

const ths = [
  'scenarios'.yellow,
  'npm5(s)'.yellow,
  'yarn(s)'.yellow,
]

const table = new Table({
  head: ths,
  colWidths: [32, 10, 10],
})

let yarnResults
let npmResults

console.log('Platform    :', os.platform())
console.log('Total memory: %sG', os.totalmem() / 1024 / 1024 / 1024)
console.log('Free  memory: %sG', (os.freemem() / 1024 / 1024 / 1024).toFixed(2))
console.log('Npm  version:', npmVersion)
console.log('Yarn version:', yarnVersion)

Promise.resolve()
  .then(npm.runTasks)
  .then((results) => {
    npmResults = results
  })
  .then(yarn.runTasks)
  .then((results) => {
    yarnResults = results
  })
  .then(() => {
    npmResults.forEach((r, index) => {
      let npmResut = npmResults[index]
      let yarnResut = yarnResults[index]
      if (npmResut <= yarnResut) {
        npmResut = `${npmResut}`.green
      } else {
        yarnResut = `${yarnResut}`.green
      }
      table.push(
        [scenarioArray[index], npmResut, yarnResut]
      )
    })
    console.log('Platform    :', os.platform())
    console.log('Total memory: %sG', os.totalmem() / 1024 / 1024 / 1024)
    console.log('Free  memory: %sG', (os.freemem() / 1024 / 1024 / 1024).toFixed(2))
    console.log('Npm  version:', npmVersion)
    console.log('Yarn version:', yarnVersion)
    console.log(table.toString())
    const totalSeconds = (Date.now() - totalStart) / 1000
    const fomattedMinutes = Math.floor(totalSeconds / 60)
    const fomattedSeconds = (totalSeconds % 60).toFixed(2)
    console.log(`Total run cost: ${fomattedMinutes}min ${fomattedSeconds}s`)
  })