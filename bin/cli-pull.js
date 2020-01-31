#!/usr/bin/env node

const cli = require('commander')
const path = require('path')

const { root, version, REPO_DIR, repos, error, run } = require('../src/utils')

const pull = async (remote, local) => {
  const dir = path.resolve(root, REPO_DIR, local)
  await run('git', ['pull'], dir)
}

/**
 * define the command
 */
cli
  .version(version)
  .arguments('<command> [repository]')
  .action(async (command, repository) => {
    try {
      if (repository) {
        if (!repos.has(repository)) {
          throw Error(`repository "${repository}" does not exist`)
        }
        pull(repos.get(repository), repository)
      } else {
        repos.forEach(pull)
      }
    } catch (e) {
      error(e)
      process.exit(1)
    }
  })

/**
 * read args
 */
cli.parse(process.argv)
