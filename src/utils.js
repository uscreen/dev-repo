/**
 * my package.json content
 */
import { createRequire } from 'module'

import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import execa from 'execa'
import { spawn } from 'child_process'
import { readPackageUpSync } from 'read-pkg-up'

/**
 * the root directory of the project
 */
export const root = path.resolve(process.cwd())
const require = createRequire(import.meta.url)
export const { version } = require('../package.json')

/**
 * the projects package.json
 */
export const { packageJson } = readPackageUpSync({ cwd: root })

/**
 * subdirectory containing working copies
 */
export const REPO_DIR = 'repos'

/**
 * a map of repos
 */
export const repos = new Map(Object.entries(packageJson.repos || {}))

/**
 * simple error formating
 */
export const error = (error) => {
  console.error(chalk.red(`ERROR: ${error.message} Aborting.`))
}

/**
 * get the absolute path to local repos directory
 */
export const absoluteRepoPath = (local) => path.resolve(root, REPO_DIR, local)

/**
 * check to be an existing directory within repos path
 */
export const isRepoDirectory = (local) => {
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
export const isGitRepo = (local) => {
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
export const gitStatus = (dir) => {
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
export const run = (command, parameters = [], cwd = null) =>
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
