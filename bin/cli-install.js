#!/usr/bin/env node

const cli = require('commander')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')
const { spawn } = require('child_process')

const {
  version,
  repos,
  REPO_DIR,
  error,
  isRepoDirectory,
  isGitRepo,
  absoluteRepoPath
} = require('../src/utils')

/**
 * init new yarn project
 */
const yarnInstall = path =>
  new Promise((resolve, reject) => {
    const yarn = spawn('yarn', ['install'], {
      cwd: path,
      stdio: [0, 1, 2]
    })
    yarn.on('close', code => {
      if (code === 0) return resolve(code)
      reject(code)
    })
  })

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
    await new Promise((resolve, reject) => {
      const git = spawn('git', ['clone', remote, path.join(REPO_DIR, local)])
      git.stdout.on('data', data => process.stdout.write(data))
      git.stderr.on('data', data => process.stderr.write(data))
      git.on('close', code => {
        if (code === 0) return resolve(code)
        reject(code)
      })
    })
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
