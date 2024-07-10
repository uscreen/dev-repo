#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs-extra'

import {
  absoluteRepoPath,
  error,
  isGitRepo,
  isRepoDirectory,
  REPO_DIR,
  repos,
  run,
  version
} from '../src/utils.js'

const cli = new Command()

/**
 * creates local target directory if missing
 */
const ensureLocalDir = (local) => {
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
 * create .gitignore if not exists
 */
const ensureGitIgnore = async () => {
  const ignorePath = path.resolve(REPO_DIR, '.gitignore')
  try {
    await fs.outputFile(ignorePath, '*\n!.gitignore', { flag: 'wx' })
  } catch (e) {
    console.log(`skip creating ${ignorePath} as it might be existing`, e)
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
const yarnInstall = (local) => {
  const dir = absoluteRepoPath(local)
  return run('yarn', ['install'], dir)
}

/**
 * mkdir & git clone & yarn install
 */
const repositoryInstall = async (remote, local) => {
  ensureLocalDir(local)
  await ensureGitClone(remote, local)

  const options = cli.opts()
  if (options.skipPackages) return

  await yarnInstall(local)
}

/**
 * define the command
 */
cli
  .version(version)
  .arguments('[repository]')
  .option('--skip-packages', "don't install packages")
  .action(async (repository) => {
    try {
      ensureGitIgnore()

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
