#!/usr/bin/env node

import { Command } from 'commander'
import path from 'path'
import { root, version, REPO_DIR, repos, error, run } from '../src/utils.js'

const cli = new Command()

const repositoryRun = (command) => async (remote, local) => {
  const dir = path.resolve(root, REPO_DIR, local)
  const [cmd, ...params] = command.split(/[ ,|]+/)
  await run(cmd, params, dir)
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
        repositoryRun(command)(repos.get(repository), repository)
      } else {
        repos.forEach(repositoryRun(command))
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
