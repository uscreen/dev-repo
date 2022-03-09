'use strict'

import path from 'path'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// for easy string testing: disable color output of chalk
process.env.FORCE_COLOR = 0

export const cli = (args, cwd) => {
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

export const stubGit = (testPhase = 'install') => {
  if (testPhase === 'install') {
    const cwd = path.resolve(__dirname, './_stubs/demorepo')
    exec('git init; git add .; git commit -m "init"', { cwd })
    return
  }

  const cwd = path.resolve(__dirname, `./_stubs/demorepo_${testPhase}`)
  exec('git init; git add .; git commit -m "init"', { cwd })
}

export const cleanupGit = (testPhase = 'install') => {
  if (testPhase === 'install') {
    fs.removeSync(path.resolve(__dirname, './_stubs/demorepo/.git'))
    fs.removeSync(path.resolve(__dirname, `./_fixtures/addrepos/repos`))
    return
  }

  fs.removeSync(path.resolve(__dirname, `./_stubs/demorepo_${testPhase}/.git`))
  fs.removeSync(path.resolve(__dirname, `./_fixtures/${testPhase}repos/repos`))
}

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Set fallback for `process.env.SHELL` as it may be undefined in CI container
 * Reason: `yarn --cache-folder` does not work properly without.
 * See /src/utils.js (run->spawn)
 */
export const before = () => {
  process.env.SHELL = process.env.SHELL || 'sh'
}
