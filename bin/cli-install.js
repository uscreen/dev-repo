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
 * creates local target directory if missing
 */
const ensureLocalDir = local => {
  const dir = absoluteRepoPath(local)
  if (!isRepoDirectory(local)) {
    console.log(
      chalk.green('mkdir new directory'),
      `"${path.join(REPO_DIR, local)}"`
    )
    fs.ensureDirSync(dir)
  }
}

/**
 * clones remote respository into local working directory
 */
const ensureGitClone = async (remote, local) => {
  if (!isGitRepo(local)) {
    console.log(chalk.green('git clone'), remote, path.join(REPO_DIR, local))
    await run('git', ['clone', remote, path.join(REPO_DIR, local)])
  }
}

/**
 * init new yarn project
 */
const yarnInstall = local => {
  const dir = absoluteRepoPath(local)
  return run('yarn', ['install'], dir)
}

/**
 * mkdir & git clone & yarn install
 */
const repositoryInstall = async (remote, local) => {
  ensureLocalDir(local)
  await ensureGitClone(remote, local)
  await yarnInstall(local)
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
