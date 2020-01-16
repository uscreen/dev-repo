#!/usr/bin/env node

const cli = require('commander')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')

const {
  absoluteRepoPath,
  error,
  isGitRepo,
  isRepoDirectory,
  REPO_DIR,
  repos,
  run,
  version
} = require('../src/utils')

/**
 * init new yarn project
 */
const yarnInstall = path => run('yarn', ['install'], path)

/**
 * mkdir & git clone
 */
const repositoryInstall = async (remote, local) => {
  const dir = absoluteRepoPath(local)
  if (!isRepoDirectory(local)) {
    console.log(
      chalk.green('mkdir new directory'),
      `"${path.join(REPO_DIR, local)}"`
    )
    fs.ensureDirSync(dir)
  }

  if (!isGitRepo(local)) {
    console.log(chalk.green('git clone'), remote, path.join(REPO_DIR, local))
    await run('git', ['clone', remote, path.join(REPO_DIR, local)])
  }

  await yarnInstall(dir)
}

/**
 * define the command
 */
cli
  .version(version)
  .arguments('[repository]')
  .action(async repository => {
    try {
      if (repository) {
        if (!repos.has(repository)) {
          throw Error(`repository "${repository}" does not exist`)
        }
        repositoryInstall(repos.get(repository), repository)
      } else {
        repos.forEach(repositoryInstall)
      }
    } catch (e) {
      error(e)
    }
  })

/**
 * read args
 */
cli.parse(process.argv)
