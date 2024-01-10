#!/usr/bin/env node
import { Command } from 'commander'
import path from 'path'
import { root, version, REPO_DIR, repos, error, run } from '../src/utils.js'

const cli = new Command()

const pull = async (remote, local) => {
  const dir = path.resolve(root, REPO_DIR, local)
  await run('git', ['pull'], dir)
}

/**
 * define the command
 */
cli
  .version(version)
  .arguments('[repository]')
  .action(async (repository) => {
    console.log('pulling repositories')
    try {
      if (repository) {
        if (!repos.has(repository)) {
          throw Error(`repository "${repository}" does not exist`)
        }
        console.log('pulling', repository)
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
