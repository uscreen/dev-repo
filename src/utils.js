'use strict'

const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const execa = require('execa')
const readPkgUp = require('read-pkg-up')
const { spawn } = require('child_process')

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
const REPO_DIR = 'repos'
module.exports.REPO_DIR = REPO_DIR

/**
 * a map of repos
 */
module.exports.repos = new Map(Object.entries(packageJson.repos || {}))

/**
 * simple error formating
 */
module.exports.error = (error) => {
  console.error(chalk.red(`ERROR: ${error.message} Aborting.`))
}

/**
 * get the absolute path to local repos directory
 */
const absoluteRepoPath = (local) => path.resolve(root, REPO_DIR, local)
module.exports.absoluteRepoPath = absoluteRepoPath

/**
 * check to be an existing directory within repos path
 */
module.exports.isRepoDirectory = (local) => {
  const dir = absoluteRepoPath(local)
  if (!fs.existsSync(dir)) {
    console.log(chalk.blue(local), '- missing:', chalk.red('no directory'))
    return false
  }
  return true
}

/**
 * check to be a git repos within repos path
 */
module.exports.isGitRepo = (local) => {
  const dir = absoluteRepoPath(local)
  if (!fs.existsSync(path.resolve(dir, '.git'))) {
    console.log(chalk.blue(local), '- missing:', chalk.red('no repository'))
    return false
  }
  return true
}

/**
 * a git status returning { branch, changes, behind, ahead }
 * as object
 */
module.exports.gitStatus = (dir) => {
  const { stdout } = execa.commandSync('git status -s -b', {
    cwd: dir,
    shell: process.env.SHELL
  })

  const lines = stdout.split(/\r\n|\r|\n/)
  const changes = lines.length - 1
  const firstLine = lines[0]

  const br = firstLine.match(/##\s+(\w+)/)
  const branch = (br && String(br[1])) || ''

  const b = firstLine.match(/behind\s+(\d+)/)
  const behind = (b && Number(b[1])) || 0

  const a = firstLine.match(/ahead\s+(\d+)/)
  const ahead = (a && Number(a[1])) || 0

  return { branch, changes, behind, ahead }
}

/**
 * spawns a child process and returns a promise
 */
module.exports.run = (command, parameters = [], cwd = null) =>
  new Promise((resolve, reject) => {
    const c = spawn(command, parameters, {
      cwd,
      stdio: [0, 1, 2],
      shell: process.env.SHELL
    })
    c.on('close', (code) => {
      if (code === 0) return resolve(code)
      reject(code)
    })
  })
