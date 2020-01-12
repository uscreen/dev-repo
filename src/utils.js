'use strict'

const chalk = require('chalk')
const path = require('path')
const readPkgUp = require('read-pkg-up')

/**
 * the root directory of the project
 */
const root = path.resolve(process.cwd())
module.exports.root = root

/**
 * my package.json content
 */
const { version } = require('../package.json')
module.exports.version = version

/**
 * the projects package.json
 */
const { packageJson } = readPkgUp.sync({ cwd: root })
module.exports.packageJson = packageJson

/**
 * subdirectory containing working copies
 */
module.exports.REPO_DIR = 'repos'

/**
 * a map of repos
 */
module.exports.repos = new Map(Object.entries(packageJson.repos))

/**
 * simple error formating
 */
module.exports.error = error => {
  console.error(chalk.red(`ERROR: ${error.message} Aborting.`))
}
