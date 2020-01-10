#!/usr/bin/env node

const cli = require('commander')
const chalk = require('chalk')

// const { fetchAllUsers, userList, listAllUsers } = require('../src/users')

/**
 * package.json content
 */
const { version } = require('../package.json')

/**
 * simple error formating
 */
const error = error => {
  console.error(chalk.red(`ERROR: ${error.message} Aborting.`))
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
        throw Error(`list of ${repository} not yet implemented`)
      } else {
        throw Error(`list of all repositories not yet implemented`)
      }
    } catch (e) {
      error(e)
    }
  })

/**
 * read args
 */
cli.parse(process.argv)
