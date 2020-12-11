#!/usr/bin/env node

const cli = require('commander')
const chalk = require('chalk')
const path = require('path')
const readPkgUp = require('read-pkg-up')
const git = require('git-utils')
const igit = require('isomorphic-git')

const {
  root,
  version,
  REPO_DIR,
  repos,
  error,
  isRepoDirectory,
  isGitRepo,
  run
} = require('../src/utils')

/**
 * gather infos (version, revision, etc.) per repos
 */
const repositoryInfo = async (remote, local) => {
  // is directory and repo existing?
  if (!isRepoDirectory(local) || !isGitRepo(local)) return

  const dir = path.resolve(root, REPO_DIR, local)
  const { packageJson } = readPkgUp.sync({ cwd: dir })

  if (cli.fetch) {
    await run('git', ['fetch'], dir) // slows down a bit
  }
  const branch = await igit.currentBranch({ dir })
  const repository = git.open(dir)
  const { ahead, behind } = repository.getAheadBehindCount()
  const Status = repository.getStatus()
  const changes = Object.keys(Status).length

  let state = chalk.blue(local) + `@${packageJson.version} - [${branch}] HEAD`

  if (ahead || behind) {
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
