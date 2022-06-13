#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import path from 'path'
import { readPackageUpSync } from 'read-pkg-up'

import {
  root,
  version,
  REPO_DIR,
  repos,
  error,
  isRepoDirectory,
  isGitRepo,
  gitStatus,
  run
} from '../src/utils.js'

const cli = new Command()

/**
 * gather infos (version, revision, etc.) per repos
 */
const repositoryInfo = async (remote, local) => {
  // is directory and repo existing?
  if (!isRepoDirectory(local) || !isGitRepo(local)) return

  const dir = path.resolve(root, REPO_DIR, local)
  const { packageJson } = readPackageUpSync({ cwd: dir })

  const options = cli.opts()
  if (options.fetch) {
    await run('git', ['fetch'], dir) // slows down a bit
  }
  // const branch = await igit.currentBranch({ dir, fs })

  const { branch, ahead, behind, changes } = gitStatus(dir)

  let state = chalk.blue(local) + `@${packageJson.version} - [${branch}] HEAD`

  if (ahead > 0 || behind > 0) {
    state += chalk.red(` dirty [${ahead}⇡/⇣${behind}]`)
  } else {
    state += chalk.green(' clean')
  }

  if (changes) {
    state += ' - Working Copy: '
    state += chalk.red(`${changes} uncommitted local changes`)
  }
  console.log(state)
}

/**
 * define the command
 */
cli
  .version(version)
  .arguments('[repository]')
  .option('-f, --fetch', 'do a git fetch before check status')
  .action(async (repository) => {
    try {
      if (repository) {
        if (!repos.has(repository)) {
          throw Error(`repository "${repository}" does not exist`)
        }
        repositoryInfo(repos.get(repository), repository)
      } else {
        repos.forEach(repositoryInfo)
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
