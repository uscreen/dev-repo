'use strict'

const path = require('path')
const exec = require('child_process').exec

module.exports.cli = (args, cwd) => {
  return new Promise(resolve => {
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
