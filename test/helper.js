'use strict'

const path = require('path')
const { exec } = require('child_process')
const fs = require('fs-extra')

// for easy string testing: disable color output of chalk
process.env.FORCE_COLOR = 0

module.exports.cli = (args, cwd) => {
  return new Promise((resolve) => {
    exec(
      `node ${path.resolve(__dirname, '../bin/cli.js')} ${args.join(' ')}`,
      { cwd },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr
        })
      }
    )
  })
}

module.exports.stubGit = () => {
  const cwd = path.resolve(__dirname, './_stubs/demorepo')
  exec('git init; git add .; git commit -m "init"', { cwd })
}

module.exports.cleanupGit = () => {
  fs.removeSync(path.resolve(__dirname, './_stubs/demorepo/.git'))
  fs.removeSync(path.resolve(__dirname, './_fixtures/addrepos/repos'))
}

module.exports.wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
